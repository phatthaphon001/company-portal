import {
  redisReady, redisGet, redisSet,
  hashPassword, verifyPassword,
  issueToken, requireUser, sanitize, rateLimit,
  isBanned, addBan, removeBan, listBans, recordSuspicious, clientIp,
  logActivity, getActivityLog, autoBackup, listBackups, getBackup,
  PLANS, TOKEN_COST, planOf, tokenState, getUsageStats,
  isDisposableEmail, checkSignupAbuse, markSignup,
  getGate, saveGate, gateCheck, consumeInviteCode, makeInviteCode,
  addTicket, listTickets, updateTicket,
  getFeatures, saveFeatures, FEATURE_DEFS,
  touchPresence, getPresence, pushFeed, getFeed,
  ROLES, roleOf, roleLevel, isDev, isExec, isManager, orgIdOf,
  getOrgs, getOrg, upsertOrg, makeOrgCode,
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

// รุ่นของเอกสารความยินยอม — ถ้าแก้ข้อความ PDPA/ข้อกำหนด ต้องขยับเลขนี้ เพื่อให้ผู้ใช้เดิมกดยอมรับใหม่
const CONSENT_VERSION = 'v1-2026-08';

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
    if (action === 'gateInfo') {
      const g = await getGate();
      return res.status(200).json({ mode: g.mode, closedMessage: g.closedMessage, needCode: g.mode === 'invite' });
    }

    // ---------- ไม่ต้องล็อกอินก่อน ----------
    if (action === 'signup') {
      const { name, username, email, password } = req.body;
      if (!name || !username || !email || !password) return res.status(400).json({ error: 'กรอกข้อมูลให้ครบ' });
      if (String(password).length < 8) return res.status(400).json({ error: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' });

      const rl = await rateLimit(`signup_${ip}`, 5, 60 * 60 * 1000);
      if (!rl.allowed) return res.status(429).json({ error: `สมัครถี่เกินไป ลองใหม่ใน ${rl.retrySec} วินาที` });

      const gk = await gateCheck(email, null, req.body.inviteCode);
      if (!gk.allowed) return res.status(403).json({ error: gk.reason, needCode: gk.needCode, gateBlocked: true });
      const gateNow = gk.gate;
      if (isDisposableEmail(email)) return res.status(400).json({ error: 'ไม่รองรับอีเมลชั่วคราว กรุณาใช้อีเมลจริง' });
      const fp = String(req.body.fingerprint || '').slice(0, 120);
      const abuse = await checkSignupAbuse(ip, fp);
      if (abuse.blocked) {
        await logActivity({ type: 'signup_blocked', ip, email, reason: abuse.reason });
        return res.status(403).json({ error: abuse.reason });
      }
      const accounts = await getAccounts();
      if (accounts.length >= gateNow.maxAccounts && accounts.length > 0) {
        return res.status(403).json({ error: `ระบบรับสมาชิกครบจำนวนที่กำหนดแล้ว (${gateNow.maxAccounts} บัญชี)`, gateBlocked: true });
      }
      if (accounts.some((a) => a.email === email)) return res.status(400).json({ error: 'อีเมลนี้ถูกใช้แล้ว' });
      if (accounts.some((a) => a.username === username)) return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });

      // ---- องค์กร: สร้างใหม่ หรือเข้าร่วมด้วยรหัสองค์กร ----
      const joinCode = String(req.body.orgCode || '').trim().toUpperCase();
      let orgId, orgRole, orgName;
      if (joinCode) {
        const orgs = await getOrgs();
        const found = orgs.find((o) => o.code === joinCode);
        if (!found) return res.status(400).json({ error: 'รหัสองค์กรไม่ถูกต้อง — ขอรหัสจากผู้ดูแลองค์กรของคุณ' });
        orgId = found.id; orgName = found.name; orgRole = 'staff';
      } else {
        orgId = `org_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        orgName = String(req.body.orgName || '').trim() || `องค์กรของ ${name}`;
        orgRole = 'exec'; // คนแรกขององค์กรเป็นผู้บริหาร
        await upsertOrg({ id: orgId, name: orgName, code: makeOrgCode(), createdAt: Date.now(), createdBy: email });
      }

      const { salt, hash } = hashPassword(password);
      const account = {
        name, username, email,
        passwordSalt: salt, passwordHash: hash,
        clearance: accounts.length === 0 ? 3 : 1,
        isOwner: accounts.length === 0,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        orgId, orgName, role: accounts.length === 0 ? 'dev' : orgRole,
        isDeveloper: accounts.length === 0,
        plan: accounts.length === 0 ? 'owner' : 'trial',
        tokensUsed: 0,
        bonusTokens: 0,
        cycleStart: Date.now(),
        birthDate: String(req.body.birthDate || '').slice(0, 10) || null,
        signupIp: ip,
        signupFp: fp || null,
      };
      accounts.push(account);
      await saveAccounts(accounts);
      await markSignup(ip, fp, email);
      if (gk.viaCode) await consumeInviteCode(gk.viaCode, email);
      await logActivity({ type: 'signup', email, ip, viaCode: gk.viaCode || null });
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

      const lgk = await gateCheck(accounts[idx].email, accounts[idx], null);
      if (!lgk.allowed) {
        return res.status(403).json({ error: lgk.reason, gateBlocked: true });
      }
      if (accounts[idx].suspended) {
        return res.status(403).json({ error: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
      }
      const today = bangkokDateStr();
      const isNewDay = accounts[idx].loginCountDate !== today;
      const loginCount = isNewDay ? 1 : (accounts[idx].loginCount || 0) + 1;
      accounts[idx].loginCount = loginCount;
      accounts[idx].loginCountDate = today;
      accounts[idx].lastLogin = Date.now();
      await saveAccounts(accounts);

      const security = await getSecurity();
      // ปิดยืนยันอีเมลทั้งระบบได้ (ใช้ตอนยังไม่ได้ยืนยันโดเมนกับผู้ให้บริการอีเมล)
      const requireOtp = !security.otpDisabled && !accounts[idx].otpExempt && (security.forceOtpAlways || loginCount > 6);

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
      return res.status(200).json({
        account: sanitize(me), tokens: tokenState(me), plans: PLANS, tokenCost: TOKEN_COST,
        features: await getFeatures(),
        role: roleOf(me), roleLevel: roleLevel(me), roles: ROLES,
        org: await getOrg(orgIdOf(me)),
      });
    }

    // ---- คีย์ Gemini ส่วนตัวของผู้ใช้ ----
    if (action === 'saveGeminiKey') {
      const key = String(req.body.key || '').trim();
      const idx = accounts.findIndex((a) => a.email === me.email);
      if (key) {
        // ทดสอบว่าคีย์ใช้ได้จริงก่อนบันทึก
        try {
          const test = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }] }),
          });
          const td = await test.json();
          if (!test.ok && !/quota|rate/i.test(td?.error?.message || '')) {
            return res.status(400).json({ error: 'คีย์นี้ใช้ไม่ได้ — ตรวจสอบว่าคัดลอกมาครบถ้วนหรือไม่' });
          }
        } catch (e) {
          return res.status(400).json({ error: 'ทดสอบคีย์ไม่สำเร็จ ลองใหม่อีกครั้ง' });
        }
      }
      accounts[idx].geminiKey = key;
      await saveAccounts(accounts);
      await logActivity({ type: key ? 'key_added' : 'key_removed', email: me.email });
      return res.status(200).json({ ok: true, hasKey: !!key });
    }

    if (action === 'listAccounts') {
      if (!isManager(me)) return res.status(403).json({ error: 'ไม่มีสิทธิ์ดูรายชื่อบัญชี' });
      const myOrg = orgIdOf(me);
      // ผู้พัฒนาเห็นทุกองค์กร · คนอื่นเห็นเฉพาะองค์กรตัวเอง
      const list = isDev(me) ? accounts : accounts.filter((a) => orgIdOf(a) === myOrg);
      return res.status(200).json({ accounts: list.map((a) => ({ ...sanitize(a), role: roleOf(a) })) });
    }

    // ---------- องค์กร ----------
    if (action === 'myOrg') {
      return res.status(200).json({ org: await getOrg(orgIdOf(me)), role: roleOf(me), roles: ROLES });
    }
    if (action === 'updateOrg') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขององค์กรเท่านั้น' });
      const cur = await getOrg(orgIdOf(me));
      if (!cur) return res.status(404).json({ error: 'ไม่พบองค์กร' });
      const p = req.body.patch || {};
      const next = await upsertOrg({
        id: cur.id,
        name: p.name != null ? String(p.name).slice(0, 100) : cur.name,
        address: p.address != null ? String(p.address).slice(0, 300) : cur.address,
        province: p.province != null ? String(p.province).slice(0, 60) : cur.province,
        phone: p.phone != null ? String(p.phone).slice(0, 40) : cur.phone,
        email: p.email != null ? String(p.email).slice(0, 80) : cur.email,
        taxId: p.taxId != null ? String(p.taxId).slice(0, 20) : cur.taxId,
        business: p.business != null ? String(p.business).slice(0, 500) : cur.business,
        website: p.website != null ? String(p.website).slice(0, 120) : cur.website,
      });
      await logActivity({ type: 'org_updated', orgId: cur.id, by: me.email });
      return res.status(200).json({ org: next });
    }
    if (action === 'regenOrgCode') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขององค์กรเท่านั้น' });
      const cur = await getOrg(orgIdOf(me));
      const next = await upsertOrg({ id: cur.id, code: makeOrgCode() });
      return res.status(200).json({ org: next });
    }
    if (action === 'setRole') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขึ้นไปเท่านั้น' });
      const { email: t, role } = req.body;
      if (!ROLES[role] || (role === 'dev' && !isDev(me))) return res.status(400).json({ error: 'ระดับสิทธิ์ไม่ถูกต้อง' });
      const idx = accounts.findIndex((a) => a.email === t);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      if (!isDev(me) && orgIdOf(accounts[idx]) !== orgIdOf(me)) return res.status(403).json({ error: 'ปรับสิทธิ์คนนอกองค์กรไม่ได้' });
      accounts[idx].role = role;
      accounts[idx].clearance = ROLES[role].level >= 3 ? 3 : ROLES[role].level >= 2 ? 2 : 1;
      await saveAccounts(accounts);
      await logActivity({ type: 'role_changed', target: t, role, by: me.email });
      return res.status(200).json({ ok: true });
    }
    if (action === 'devListOrgs') {
      if (!isDev(me)) return res.status(403).json({ error: 'เฉพาะผู้พัฒนาระบบเท่านั้น' });
      const orgs = await getOrgs();
      return res.status(200).json({
        orgs: orgs.map((o) => ({
          ...o,
          members: accounts.filter((a) => orgIdOf(a) === o.id).length,
          tokensUsed: accounts.filter((a) => orgIdOf(a) === o.id).reduce((s2, a) => s2 + (a.tokensUsed || 0), 0),
        })),
      });
    }

    if (action === 'getSecurity') {
      return res.status(200).json({ security: await getSecurity() });
    }

    if (action === 'updateSecurity') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'เฉพาะระดับสูงสุดเท่านั้น' });
      const cur = await getSecurity();
      const security = {
        forceOtpAlways: req.body.forceOtpAlways != null ? !!req.body.forceOtpAlways : !!cur.forceOtpAlways,
        otpDisabled: req.body.otpDisabled != null ? !!req.body.otpDisabled : !!cur.otpDisabled,
      };
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

    // ---- บันทึกการยินยอม PDPA + ข้อมูลโปรไฟล์ตอนสมัคร ----
    // แยกออกจาก updateProfile เพราะการยินยอมมีผลทางกฎหมาย ต้องบันทึกเวลาและ IP จากฝั่งเซิร์ฟเวอร์เป็นหลักฐาน
    if (action === 'saveOnboarding') {
      const { consent, profile } = req.body || {};
      const c = consent || {};
      if (!c.terms || !c.privacy || !c.aiTransfer) {
        return res.status(400).json({ error: 'ต้องยอมรับเงื่อนไขให้ครบทั้ง 3 ข้อก่อนจึงจะใช้งานได้' });
      }
      const idx = accounts.findIndex((a) => a.email === me.email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });

      const p = profile || {};
      const str = (v, n = 200) => String(v == null ? '' : v).slice(0, n).trim();
      const accountType = p.accountType === 'org' ? 'org' : 'personal';
      const OCCUPATIONS = ['employee', 'student', 'freelancer', 'business_owner', 'other'];

      const safeProfile = {
        accountType,
        occupation: OCCUPATIONS.includes(p.occupation) ? p.occupation : 'other',
        birthDate: str(p.birthDate, 10) || accounts[idx].birthDate || null,
        displayName: str(p.displayName, 120) || accounts[idx].name,
        phone: str(p.phone, 40),
      };
      if (accountType === 'org') {
        safeProfile.org = {
          companyName: str(p.companyName, 200),
          taxId: str(p.taxId, 30),
          address: str(p.address, 500),
          warehouse: str(p.warehouse, 300),
          office: str(p.office, 300),
          phone: str(p.orgPhone, 40),
          email: str(p.orgEmail, 120),
          facebook: str(p.facebook, 200),
          line: str(p.line, 100),
          website: str(p.website, 200),
          businessDesc: str(p.businessDesc, 3000),
          owners: Array.isArray(p.owners)
            ? p.owners.slice(0, 10).map((o) => ({ name: str(o?.name, 120), birthDate: str(o?.birthDate, 10) })).filter((o) => o.name)
            : [],
        };
      }

      accounts[idx] = {
        ...accounts[idx],
        ...safeProfile,
        consent: {
          terms: true, privacy: true, aiTransfer: true,
          marketing: !!c.marketing,           // ข้อนี้ไม่บังคับ
          version: CONSENT_VERSION,
          at: Date.now(),                      // เวลาจากเซิร์ฟเวอร์ ไม่เชื่อเวลาจากเครื่องผู้ใช้
          ip,
        },
        onboardedAt: Date.now(),
      };
      await saveAccounts(accounts);
      await logActivity({ type: 'consent_given', email: me.email, ip, version: CONSENT_VERSION });
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    // ---- บันทึกว่าอ่านคู่มือแนะนำการใช้งานรุ่นไหนไปแล้ว ----
    if (action === 'markTourSeen') {
      const idx = accounts.findIndex((a) => a.email === me.email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      accounts[idx].tourSeen = String(req.body?.version || '').slice(0, 20);
      await saveAccounts(accounts);
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    if (action === 'updateProfile') {
      const { patch } = req.body;
      const idx = accounts.findIndex((a) => a.email === me.email); // แก้ได้เฉพาะบัญชีตัวเอง
      const safePatch = { ...patch };
      ['password', 'passwordHash', 'passwordSalt', 'email', 'isOwner', 'clearance', 'sessionsValidFrom', 'otpExempt', 'consent', 'onboardedAt', 'tourSeen', 'plan', 'role', 'orgId', 'isDeveloper', 'tokensUsed', 'bonusTokens'].forEach((k) => delete safePatch[k]);
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

    // ---------- คำขอความช่วยเหลือ / ขอโทเค็นเพิ่ม ----------
    if (action === 'submitTicket') {
      const { kind, message } = req.body;
      if (!message || !String(message).trim()) return res.status(400).json({ error: 'กรุณาพิมพ์ข้อความ' });
      const rl = await rateLimit(`ticket_${me.email}`, 5, 60 * 60 * 1000);
      if (!rl.allowed) return res.status(429).json({ error: `ส่งคำขอถี่เกินไป ลองใหม่ใน ${Math.ceil(rl.retrySec / 60)} นาที` });
      const t = await addTicket({ kind: kind === 'tokens' ? 'tokens' : 'help', email: me.email, name: me.name, message: String(message).slice(0, 1000) });
      await logActivity({ type: 'ticket', email: me.email, kind });
      return res.status(200).json({ ok: true, ticket: t });
    }
    if (action === 'myTickets') {
      const all = await listTickets();
      return res.status(200).json({ tickets: all.filter((t) => t.email === me.email).slice(-20).reverse() });
    }
    if (action === 'adminTickets') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      return res.status(200).json({ tickets: (await listTickets()).slice(-100).reverse() });
    }
    if (action === 'adminReplyTicket') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const next = await updateTicket(req.body.id, { status: req.body.status || 'closed', reply: String(req.body.reply || '').slice(0, 1000), repliedAt: Date.now() });
      return res.status(200).json({ tickets: next.slice(-100).reverse() });
    }

    // ---------- เจ้าของระบบ: เปิด/ปิดฟีเจอร์ ----------
    if (action === 'getFeatures') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      return res.status(200).json({ features: await getFeatures(), defs: FEATURE_DEFS });
    }
    if (action === 'saveFeatures') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const cur = await getFeatures();
      const { group, key, value } = req.body;
      if (!cur[group] || !(key in cur[group])) return res.status(400).json({ error: 'ฟีเจอร์ไม่ถูกต้อง' });
      cur[group][key] = !!value;
      await saveFeatures(cur);
      await logActivity({ type: 'feature_toggle', group, key, value: !!value, by: me.email });
      return res.status(200).json({ features: cur });
    }

    // ---------- เจ้าของระบบ: ล็อกเว็บ ----------
    if (action === 'getGate') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      return res.status(200).json({ gate: await getGate() });
    }
    if (action === 'saveGate') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const cur = await getGate();
      const next = {
        ...cur,
        mode: ['open', 'invite', 'closed'].includes(req.body.mode) ? req.body.mode : cur.mode,
        closedMessage: req.body.closedMessage != null ? String(req.body.closedMessage).slice(0, 300) : cur.closedMessage,
        maxAccounts: req.body.maxAccounts != null ? Math.max(1, Number(req.body.maxAccounts)) : cur.maxAccounts,
      };
      await saveGate(next);
      await logActivity({ type: 'gate_changed', mode: next.mode, by: me.email });
      return res.status(200).json({ gate: next });
    }
    if (action === 'gateAllow') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const em = String(req.body.email || '').trim().toLowerCase();
      if (!em) return res.status(400).json({ error: 'ต้องระบุอีเมล' });
      const cur = await getGate();
      if (!cur.allowList.includes(em)) cur.allowList.push(em);
      await saveGate(cur);
      await logActivity({ type: 'gate_allow', target: em, by: me.email });
      return res.status(200).json({ gate: cur });
    }
    if (action === 'gateRevoke') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const em = String(req.body.email || '').trim().toLowerCase();
      const cur = await getGate();
      cur.allowList = cur.allowList.filter((e) => e !== em);
      await saveGate(cur);
      return res.status(200).json({ gate: cur });
    }
    if (action === 'gateNewCode') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const cur = await getGate();
      const code = makeInviteCode();
      cur.inviteCodes = [...cur.inviteCodes, { code, note: String(req.body.note || '').slice(0, 60), at: Date.now(), usedBy: null }].slice(-100);
      await saveGate(cur);
      return res.status(200).json({ gate: cur, code });
    }
    if (action === 'gateDeleteCode') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const cur = await getGate();
      cur.inviteCodes = cur.inviteCodes.filter((c) => c.code !== req.body.code);
      await saveGate(cur);
      return res.status(200).json({ gate: cur });
    }

    // ---------- เจ้าของระบบ: จัดการผู้ใช้ / โทเค็น / งบการเงิน ----------
    if (action === 'adminUsers') {
      if (!isManager(me)) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const myOrg2 = orgIdOf(me);
      const scoped = isDev(me) ? accounts : accounts.filter((a) => orgIdOf(a) === myOrg2);
      return res.status(200).json({
        users: scoped.map((a) => ({
          ...sanitize(a),
          role: roleOf(a),
          hasKey: !!(a.geminiKey && a.geminiKey.trim()),
          tokens: tokenState(a),
        })),
        plans: PLANS, isDev: isDev(me),
      });
    }
    if (action === 'adminGrantTokens') {
      if (!isDev(me)) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const { email, amount } = req.body;
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      accounts[idx].bonusTokens = (accounts[idx].bonusTokens || 0) + Number(amount || 0);
      await saveAccounts(accounts);
      await logActivity({ type: 'grant_tokens', target: email, amount, by: me.email });
      return res.status(200).json({ ok: true, tokens: tokenState(accounts[idx]) });
    }
    if (action === 'adminSetPlan') {
      if (!isDev(me)) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const { email, plan } = req.body;
      if (!PLANS[plan]) return res.status(400).json({ error: 'แพ็กเกจไม่ถูกต้อง' });
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      accounts[idx].plan = plan;
      accounts[idx].tokensUsed = 0;
      accounts[idx].cycleStart = Date.now();
      await saveAccounts(accounts);
      await logActivity({ type: 'set_plan', target: email, plan, by: me.email });
      return res.status(200).json({ ok: true });
    }
    if (action === 'adminSetOtpExempt') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const { email, exempt } = req.body;
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      accounts[idx].otpExempt = !!exempt;
      await saveAccounts(accounts);
      await logActivity({ type: 'otp_exempt', target: email, exempt: !!exempt, by: me.email });
      return res.status(200).json({ ok: true });
    }
    if (action === 'presence') {
      await touchPresence(me.email, req.body.page, req.body.note);
      return res.status(200).json({ ok: true });
    }
    if (action === 'adminPresence') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบหรือผู้บริหารเท่านั้น' });
      const presenceAll = await getPresence();
      const feedAll = (await getFeed()).slice(-120).reverse();
      if (isDev(me)) return res.status(200).json({ presence: presenceAll, feed: feedAll });
      // ผู้บริหารองค์กร (ไม่ใช่ผู้พัฒนาระบบ) เห็นได้เฉพาะคนในองค์กรตัวเอง — presence/feed เก็บรวมทุกองค์กรไว้ที่เดียว ต้องกรองก่อนส่งออกเสมอ
      const myOrg5 = orgIdOf(me);
      const orgEmails5 = new Set(accounts.filter((a) => orgIdOf(a) === myOrg5).map((a) => a.email));
      const presence = Object.fromEntries(Object.entries(presenceAll).filter(([email]) => orgEmails5.has(email)));
      const feed = feedAll.filter((f) => orgEmails5.has(f.email));
      return res.status(200).json({ presence, feed });
    }
    if (action === 'adminResetPassword') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const { email, newPassword } = req.body;
      if (!newPassword || String(newPassword).length < 8) return res.status(400).json({ error: 'รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัว' });
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      const { salt, hash } = hashPassword(newPassword);
      accounts[idx].passwordSalt = salt;
      accounts[idx].passwordHash = hash;
      delete accounts[idx].password;
      accounts[idx].sessionsValidFrom = Date.now();
      await saveAccounts(accounts);
      await logActivity({ type: 'password_reset_by_owner', target: email, by: me.email });
      return res.status(200).json({ ok: true });
    }
    if (action === 'adminSuspend') {
      if (!me.isOwner) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const { email, suspended } = req.body;
      const idx = accounts.findIndex((a) => a.email === email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      if (accounts[idx].isOwner) return res.status(400).json({ error: 'ระงับบัญชีเจ้าของระบบไม่ได้' });
      accounts[idx].suspended = !!suspended;
      accounts[idx].sessionsValidFrom = Date.now();
      await saveAccounts(accounts);
      await logActivity({ type: suspended ? 'suspend' : 'unsuspend', target: email, by: me.email });
      return res.status(200).json({ ok: true });
    }
    if (action === 'adminUsage') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบหรือผู้บริหารเท่านั้น' });
      const statsAll = await getUsageStats();
      if (isDev(me)) return res.status(200).json({ stats: statsAll, plans: PLANS });
      // ผู้บริหารองค์กร เห็นเฉพาะสถิติของคนในองค์กรตัวเอง — usage_stats เก็บรวมทุกองค์กรไว้ที่เดียว ต้องกรองก่อนส่งออกเสมอ
      const myOrg6 = orgIdOf(me);
      const orgEmails6 = new Set(accounts.filter((a) => orgIdOf(a) === myOrg6).map((a) => a.email));
      const stats = {};
      for (const day of Object.keys(statsAll)) {
        const dayEntries = Object.fromEntries(Object.entries(statsAll[day] || {}).filter(([email]) => orgEmails6.has(email)));
        if (Object.keys(dayEntries).length) stats[day] = dayEntries;
      }
      return res.status(200).json({ stats, plans: PLANS });
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
      const result = await autoBackup(req.body.date || new Date().toISOString().slice(0, 10), me.email);
      return res.status(200).json({ result, backups: await listBackups(me.email) });
    }
    if (action === 'listBackups') {
      return res.status(200).json({ backups: await listBackups(me.email) });
    }
    if (action === 'getBackup') {
      if (me.clearance !== 3) return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
      return res.status(200).json({ backup: await getBackup(req.body.date, me.email) });
    }

    return res.status(400).json({ error: 'ไม่รู้จัก action นี้' });
  } catch (err) {
    return res.status(500).json({ error: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
  }
}
