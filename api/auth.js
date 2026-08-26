import {
  redisReady, redisGet, redisSet,
  hashPassword, verifyPassword,
  issueToken, requireUser, sanitize, rateLimit,
  isBanned, addBan, removeBan, listBans, recordSuspicious, clientIp,
  logActivity, getActivityLog, autoBackup, listBackups, getBackup,
} from './_lib.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

function bangkokDateStr(ts) {
  const d = new Date((ts || Date.now()) + BANGKOK_OFFSET_MS);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

const getAccounts = async () => (await redisGet('accounts')) || [];
const saveAccounts = (accounts) => redisSet('accounts', accounts);
const getSecurity = async () => (await redisGet('security')) || { forceOtpAlways: false };
const saveSecurity = (security) => redisSet('security', security);

// ย้ายบัญชีเก่าที่เก็บรหัสผ่านเป็นข้อความล้วน ให้เป็นรหัสที่เข้ารหัสแล้วโดยอัตโนมัติ
function upgradeLegacyPassword(account, plainPassword) {
  const { salt, hash } = hashPassword(plainPassword);
  account.passwordSalt = salt;
  account.passwordHash = hash;
  delete account.password;
}

function checkPassword(account, password) {
  if (account.passwordHash && account.passwordSalt) {
    return verifyPassword(password, account.passwordSalt, account.passwordHash);
  }
  // บัญชีเก่าที่ยังเป็นข้อความล้วน — ตรวจแบบเดิมแล้วอัปเกรดให้ทันที
  if (typeof account.password === 'string') {
    if (account.password !== password) return false;
    upgradeLegacyPassword(account, password);
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!redisReady()) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า Upstash ใน Vercel ก่อน)' });
  }
  if (!process.env.OTP_SECRET) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า OTP_SECRET ใน Vercel' });
  }

  const { action } = req.body || {};
  const ip = clientIp(req);

  // ---------- ด่านแรก: ถ้า IP นี้ถูกแบนไว้ ปฏิเสธทุกคำสั่งทันที ----------
  try {
    const ban = await isBanned(ip);
    if (ban) {
      return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ กรุณาติดต่อผู้ดูแลระบบ', banned: true });
    }
  } catch (e) {}

  try {
    // ---------- ไม่ต้องล็อกอินก่อน ----------
    if (action === 'signup') {
      const { name, username, email, password } = req.body;
      if (!name || !username || !email || !password) return res.status(400).json({ error: 'กรอกข้อมูลให้ครบ' });
      if (String(password).length < 8) return res.status(400).json({ error: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' });

      const rl = await rateLimit(`signup_${ip}`, 5, 60 * 60 * 1000);
      if (!rl.allowed) return res.status(429).json({ error: `สมัครถี่เกินไป ลองใหม่ใน ${rl.retrySec} วินาที` });

      const accounts = await getAccounts();
      if (accounts.some((a) => a.email === email)) return res.status(400).json({ error: 'อีเมลนี้ถูกใช้แล้ว' });
      if (accounts.some((a) => a.username === username)) return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });

      const { salt, hash } = hashPassword(password);
      const account = {
        name, username, email,
        passwordSalt: salt, passwordHash: hash,
        clearance: accounts.length === 0 ? 3 : 1,
        isOwner: accounts.length === 0,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };
      accounts.push(account);
      await saveAccounts(accounts);
      return res.status(200).json({ account: sanitize(account), token: issueToken(email) });
    }

    if (action === 'login') {
      const { identifier, password } = req.body;
      // กันเดารหัสผ่านรัวๆ
      const rl = await rateLimit(`login_${ip}_${identifier || ''}`, 10, 15 * 60 * 1000);
      if (!rl.allowed) return res.status(429).json({ error: `พยายามเข้าสู่ระบบถี่เกินไป ลองใหม่ใน ${rl.retrySec} วินาที` });

      const accounts = await getAccounts();
      const idx = accounts.findIndex((a) => a.email === identifier || a.username === identifier);
      if (idx === -1 || !checkPassword(accounts[idx], password)) {
        const sus = await recordSuspicious(ip, 'login_failed');
        if (sus.banned) return res.status(403).json({ error: 'พยายามเข้าสู่ระบบผิดหลายครั้งเกินไป อุปกรณ์นี้ถูกระงับชั่วคราว 24 ชม.', banned: true });
        return res.status(400).json({ error: 'อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง' });
      }

      const today = bangkokDateStr();
      const isNewDay = accounts[idx].loginCountDate !== today;
      const loginCount = isNewDay ? 1 : (accounts[idx].loginCount || 0) + 1;
      accounts[idx].loginCount = loginCount;
      accounts[idx].loginCountDate = today;
      accounts[idx].lastLogin = Date.now();
      await saveAccounts(accounts);

      const security = await getSecurity();
      const requireOtp = !accounts[idx].otpExempt && (security.forceOtpAlways || loginCount > 6);

      // ต้องยืนยัน OTP ก่อน จึงยังไม่ออกโทเค็นให้
      if (requireOtp) {
        return res.status(200).json({ account: sanitize(accounts[idx]), requireOtp: true });
      }
      await logActivity({ type: 'login', email: accounts[idx].email, ip });
      return res.status(200).json({ account: sanitize(accounts[idx]), requireOtp: false, token: issueToken(accounts[idx].email) });
    }

    // ออกโทเค็นหลังยืนยัน OTP สำเร็จ (ฝั่งเซิร์ฟเวอร์ตรวจ OTP เองอีกชั้น ไม่เชื่อหน้าเว็บ)
    if (action === 'completeOtpLogin') {
      const { otpToken, code } = req.body;
      const crypto = await import('crypto');
      if (!otpToken || !code) return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
      let email;
      try {
        const decoded = Buffer.from(otpToken, 'base64').toString('utf-8');
        const parts = decoded.split(':');
        const signature = parts.pop();
        const expiresAt = parts.pop();
        const storedCode = parts.pop();
        email = parts.join(':');
        const expected = crypto.default.createHmac('sha256', process.env.OTP_SECRET).update(`${email}:${storedCode}:${expiresAt}`).digest('hex');
        const a = Buffer.from(signature); const b = Buffer.from(expected);
        if (a.length !== b.length || !crypto.default.timingSafeEqual(a, b)) { await recordSuspicious(ip, 'otp_token_tampered'); return res.status(400).json({ error: 'โทเค็นไม่ถูกต้อง' }); }
        if (Date.now() > Number(expiresAt)) return res.status(400).json({ error: 'รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่' });
        if (String(code) !== String(storedCode)) return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
      } catch (e) {
        return res.status(400).json({ error: 'โทเค็นไม่ถูกต้อง' });
      }
      const accounts = await getAccounts();
      const account = accounts.find((a) => a.email === email);
      if (!account) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      return res.status(200).json({ account: sanitize(account), token: issueToken(email) });
    }

    // ---------- ต้องล็อกอินแล้วเท่านั้น ----------
    const session = await requireUser(req);
    if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
    const { account: me, accounts } = session;

    if (action === 'me') {
      return res.status(200).json({ account: sanitize(me) });
    }

    if (action === 'listAccounts') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์ดูรายชื่อบัญชี' });
      return res.status(200).json({ accounts: accounts.map(sanitize) });
    }

    if (action === 'getSecurity') {
      return res.status(200).json({ security: await getSecurity() });
    }

    if (action === 'updateSecurity') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'เฉพาะระดับสูงสุดเท่านั้น' });
      const security = { forceOtpAlways: !!req.body.forceOtpAlways };
      await saveSecurity(security);
      return res.status(200).json({ security });
    }

    if (action === 'resetLoginCounts') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'เฉพาะระดับสูงสุดเท่านั้น' });
      const reset = accounts.map((a) => ({ ...a, loginCount: 0, loginCountDate: null }));
      await saveAccounts(reset);
      return res.status(200).json({ ok: true });
    }

    // บังคับให้ทุกบัญชีล็อกอินใหม่ (โทเค็นเก่าใช้ไม่ได้ทันที) — ใช้เวลาสงสัยว่าข้อมูลรั่ว
    if (action === 'revokeAllSessions') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const stamped = accounts.map((a) => ({ ...a, sessionsValidFrom: Date.now() }));
      await saveAccounts(stamped);
      return res.status(200).json({ ok: true });
    }

    if (action === 'updateProfile') {
      const { patch } = req.body;
      const idx = accounts.findIndex((a) => a.email === me.email); // แก้ได้เฉพาะบัญชีตัวเอง
      const safePatch = { ...patch };
      ['password', 'passwordHash', 'passwordSalt', 'email', 'isOwner', 'clearance', 'sessionsValidFrom', 'otpExempt'].forEach((k) => delete safePatch[k]);
      accounts[idx] = { ...accounts[idx], ...safePatch };
      await saveAccounts(accounts);
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    if (action === 'changePassword') {
      const { currentPassword, newPassword } = req.body;
      if (!newPassword || String(newPassword).length < 8) return res.status(400).json({ error: 'รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร' });
      const idx = accounts.findIndex((a) => a.email === me.email);
      if (!checkPassword(accounts[idx], currentPassword)) return res.status(400).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      const { salt, hash } = hashPassword(newPassword);
      accounts[idx].passwordSalt = salt;
      accounts[idx].passwordHash = hash;
      delete accounts[idx].password;
      accounts[idx].sessionsValidFrom = Date.now(); // เปลี่ยนรหัสแล้วเตะอุปกรณ์อื่นออก
      await saveAccounts(accounts);
      return res.status(200).json({ ok: true, token: issueToken(me.email) });
    }

    if (action === 'updateClearance') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'เฉพาะระดับสูงสุดเท่านั้นที่ปรับสิทธิ์ได้' });
      const { email, clearance } = req.body;
      const lvl = Number(clearance);
      if (![1, 2, 3].includes(lvl)) return res.status(400).json({ error: 'ระดับสิทธิ์ไม่ถูกต้อง' });
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      if (accounts[idx].isOwner && lvl !== 3) return res.status(400).json({ error: 'ลดสิทธิ์บัญชีเจ้าของระบบไม่ได้' });
      accounts[idx].clearance = lvl;
      await saveAccounts(accounts);
      return res.status(200).json({ ok: true });
    }

    if (action === 'updateOtpExempt') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้นที่ตั้งค่านี้ได้' });
      const idx = accounts.findIndex((a) => a.email === me.email);
      accounts[idx].otpExempt = !!req.body.otpExempt;
      await saveAccounts(accounts);
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    if (action === 'pruneExpired') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'เฉพาะระดับสูงสุดเท่านั้น' });
      const kept = accounts.filter((a) => a.isOwner || (Date.now() - (a.lastLogin || a.createdAt || Date.now())) <= THIRTY_DAYS_MS);
      if (kept.length !== accounts.length) await saveAccounts(kept);
      return res.status(200).json({ accounts: kept.map(sanitize) });
    }

    // ---------- ผู้ดูแลระบบ: ความปลอดภัย / สำรองข้อมูล / บันทึกกิจกรรม ----------
    if (action === 'listBans') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
      return res.status(200).json({ bans: await listBans() });
    }
    if (action === 'addBan') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
      const { target, reason, days } = req.body;
      if (!target) return res.status(400).json({ error: 'ต้องระบุ IP หรืออีเมลที่จะแบน' });
      await addBan(String(target).trim(), reason || 'แบนโดยผู้ดูแลระบบ', me.email, days ? Date.now() + Number(days) * 86400000 : null);
      await logActivity({ type: 'ban_added', target, by: me.email });
      return res.status(200).json({ bans: await listBans() });
    }
    if (action === 'removeBan') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
      await removeBan(String(req.body.target || '').trim());
      await logActivity({ type: 'ban_removed', target: req.body.target, by: me.email });
      return res.status(200).json({ bans: await listBans() });
    }
    if (action === 'activityLog') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
      return res.status(200).json({ log: (await getActivityLog()).slice(-100).reverse() });
    }
    if (action === 'runBackup') {
      const result = await autoBackup(req.body.date || new Date().toISOString().slice(0, 10));
      return res.status(200).json({ result, backups: await listBackups() });
    }
    if (action === 'listBackups') {
      return res.status(200).json({ backups: await listBackups() });
    }
    if (action === 'getBackup') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
      return res.status(200).json({ backup: await getBackup(req.body.date) });
    }

    return res.status(400).json({ error: 'ไม่รู้จัก action นี้' });
  } catch (err) {
    return res.status(500).json({ error: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
  }
}
