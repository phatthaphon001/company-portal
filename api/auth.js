const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function getAccounts() {
  const r = await fetch(`${REDIS_URL}/get/accounts`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  const d = await r.json();
  return d.result ? JSON.parse(d.result) : [];
}
async function saveAccounts(accounts) {
  await fetch(`${REDIS_URL}/set/accounts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(accounts),
  });
}
function sanitize(a) {
  const { password, ...rest } = a;
  return rest;
}
async function getSecurity() {
  const r = await fetch(`${REDIS_URL}/get/security`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  const d = await r.json();
  return d.result ? JSON.parse(d.result) : { forceOtpAlways: false };
}
async function saveSecurity(security) {
  await fetch(`${REDIS_URL}/set/security`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(security),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า Upstash ใน Vercel ก่อน)' });
  }

  const { action } = req.body || {};

  try {
    if (action === 'signup') {
      const { name, username, email, password } = req.body;
      if (!name || !username || !email || !password) return res.status(400).json({ error: 'กรอกข้อมูลให้ครบ' });
      const accounts = await getAccounts();
      if (accounts.some((a) => a.email === email)) return res.status(400).json({ error: 'อีเมลนี้ถูกใช้แล้ว' });
      if (accounts.some((a) => a.username === username)) return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
      const account = {
        name, username, email, password,
        clearance: accounts.length === 0 ? 3 : 1,
        isOwner: accounts.length === 0,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };
      accounts.push(account);
      await saveAccounts(accounts);
      return res.status(200).json({ account: sanitize(account) });
    }

    if (action === 'login') {
      const { identifier, password } = req.body;
      const accounts = await getAccounts();
      const idx = accounts.findIndex((a) => (a.email === identifier || a.username === identifier) && a.password === password);
      if (idx === -1) return res.status(400).json({ error: 'อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง' });
      const loginCount = (accounts[idx].loginCount || 0) + 1;
      accounts[idx].loginCount = loginCount;
      accounts[idx].lastLogin = Date.now();
      await saveAccounts(accounts);
      const security = await getSecurity();
      const requireOtp = security.forceOtpAlways || loginCount > 6;
      return res.status(200).json({ account: sanitize(accounts[idx]), requireOtp });
    }

    if (action === 'getSecurity') {
      return res.status(200).json({ security: await getSecurity() });
    }

    if (action === 'updateSecurity') {
      const { forceOtpAlways } = req.body;
      const security = { forceOtpAlways: !!forceOtpAlways };
      await saveSecurity(security);
      return res.status(200).json({ security });
    }

    if (action === 'resetLoginCounts') {
      const accounts = await getAccounts();
      const reset = accounts.map((a) => ({ ...a, loginCount: 0 }));
      await saveAccounts(reset);
      return res.status(200).json({ ok: true });
    }

    if (action === 'updateProfile') {
      const { email, patch } = req.body;
      const accounts = await getAccounts();
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      const safePatch = { ...patch };
      delete safePatch.password;
      delete safePatch.email;
      delete safePatch.isOwner;
      delete safePatch.clearance;
      accounts[idx] = { ...accounts[idx], ...safePatch };
      await saveAccounts(accounts);
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    if (action === 'changePassword') {
      const { email, currentPassword, newPassword } = req.body;
      const accounts = await getAccounts();
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      if (accounts[idx].password !== currentPassword) return res.status(400).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      accounts[idx].password = newPassword;
      await saveAccounts(accounts);
      return res.status(200).json({ ok: true });
    }

    if (action === 'updateClearance') {
      const { email, clearance } = req.body;
      const accounts = await getAccounts();
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      accounts[idx].clearance = clearance;
      await saveAccounts(accounts);
      return res.status(200).json({ ok: true });
    }

    if (action === 'pruneExpired') {
      const accounts = await getAccounts();
      const kept = accounts.filter((a) => a.isOwner || (Date.now() - (a.lastLogin || a.createdAt || Date.now())) <= THIRTY_DAYS_MS);
      if (kept.length !== accounts.length) await saveAccounts(kept);
      return res.status(200).json({ accounts: kept.map(sanitize) });
    }

    return res.status(400).json({ error: 'ไม่รู้จัก action นี้' });
  } catch (err) {
    return res.status(500).json({ error: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
  }
}
