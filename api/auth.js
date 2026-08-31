import crypto from 'crypto';
import {
  redisReady, redisGet, redisSet,
  hashPassword, verifyPassword,
  issueToken, requireUser, sanitize, rateLimit,
  isBanned, addBan, removeBan, listBans, recordSuspicious, clientIp,
  logActivity, getActivityLog, autoBackup, listBackups, getBackup,
  PLANS, TIERS, TOKEN_COST, planOf, tokenState, tierOf, isPooledPlan, getUsageStats,
  isDisposableEmail, checkSignupAbuse, markSignup,
  getGate, saveGate, gateCheck, consumeInviteCode, makeInviteCode,
  addTicket, listTickets, updateTicket,
  getFeatures, saveFeatures, FEATURE_DEFS,
  touchPresence, getPresence, pushFeed, getFeed,
  createOtp, consumeOtp,
  sendAlertEmail, alertRecipients,
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
// ต้องตรงกับ TOUR_VERSION ใน src/App.jsx — ถ้าขยับที่หน้าเว็บต้องขยับตรงนี้ด้วย
const TOUR_VERSION_SERVER = 'v1';

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
      const { name, nameEn, username, email, password } = req.body;
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
        // จำนวนที่นั่งตามแพ็กขององค์กร — กันซื้อแพ็ก 5 คนแล้วใส่พนักงาน 50 คน
        const seatLimit = (PLANS[found.plan] || {}).seats || 1;
        const usedSeats = accounts.filter((a) => a.orgId === found.id).length;
        if (usedSeats >= seatLimit) {
          return res.status(403).json({ error: `องค์กรนี้ใช้ที่นั่งครบ ${seatLimit} คนแล้ว — ผู้ดูแลองค์กรต้องอัปเกรดแพ็กก่อนเพิ่มคน`, seatFull: true });
        }
        orgId = found.id; orgName = found.name; orgRole = 'staff';
      } else {
        orgId = `org_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        orgName = String(req.body.orgName || '').trim() || `องค์กรของ ${name}`;
        orgRole = 'exec'; // คนแรกขององค์กรเป็นผู้บริหาร
        await upsertOrg({ id: orgId, name: orgName, code: makeOrgCode(), createdAt: Date.now(), createdBy: email });
      }

      const { salt, hash } = hashPassword(password);
      const account = {
        name, nameEn: String(nameEn || '').slice(0, 120).trim(), username, email,
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
      return res.status(200).json({
        account: sanitize(accounts[idx]), requireOtp: false, token: issueToken(accounts[idx].email),
        mustChangePassword: !!accounts[idx].mustChangePassword,
      });
    }

    // ออกโทเค็นหลังยืนยัน OTP สำเร็จ (ฝั่งเซิร์ฟเวอร์ตรวจ OTP เองอีกชั้น ไม่เชื่อหน้าเว็บ)
    if (action === 'completeOtpLogin') {
      const { otpRef, otpToken, code } = req.body;
      const ref = otpRef || otpToken; // รองรับชื่อเดิมจากหน้าเว็บรุ่นก่อน
      if (!ref || !code) return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });

      // จำกัดการเดารหัสต่อ IP ด้วย นอกเหนือจากการนับครั้งผิดต่อรหัส
      const otpRl = await rateLimit(`otpverify_${ip}`, 20, 15 * 60 * 1000);
      if (!otpRl.allowed) return res.status(429).json({ error: `ยืนยันรหัสถี่เกินไป ลองใหม่ใน ${otpRl.retrySec} วินาที` });

      // ตรวจกับรหัสที่เก็บไว้ฝั่งเซิร์ฟเวอร์ — ใช้ได้ครั้งเดียว ผิดเกิน 5 ครั้งถือว่าใช้ไม่ได้
      const r = await consumeOtp(ref, code);
      if (!r.ok) {
        await recordSuspicious(ip, 'otp_failed');
        return res.status(400).json({ error: r.reason });
      }
      const accounts = await getAccounts();
      const account = accounts.find((a) => a.email === r.email);
      if (!account) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      if (account.suspended) return res.status(403).json({ error: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
      const ogk = await gateCheck(account.email, account, null);
      if (!ogk.allowed) return res.status(403).json({ error: ogk.reason, gateBlocked: true });
      await logActivity({ type: 'otp_login', email: account.email, ip });
      return res.status(200).json({ account: sanitize(account), token: issueToken(account.email) });
    }

    // ---------- ต้องล็อกอินแล้วเท่านั้น ----------
    const session = await requireUser(req);
    if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
    const { account: me, accounts } = session;

    if (action === 'me') {
      return res.status(200).json({
        account: sanitize(me), tokens: tokenState(me, await getOrg(orgIdOf(me))), plans: PLANS, tiers: TIERS, tokenCost: TOKEN_COST,
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
        orgs: orgs.map((o) => {
          const mem = accounts.filter((a) => orgIdOf(a) === o.id);
          // แพ็กกองกลางเก็บยอดใช้ไว้ที่องค์กร ไม่ใช่รวมจากรายคน (ถ้ารวมรายคนจะได้เลขผิด)
          const pooled = isPooledPlan(o.plan);
          return {
            ...o,
            members: mem.length,
            tokensUsed: pooled ? (o.tokensUsed || 0) : mem.reduce((s2, a) => s2 + (a.tokensUsed || 0), 0),
            pooled,
          };
        }),
      });
    }

    if (action === 'getSecurity') {
      // ตั้งค่าความปลอดภัยบอกใบ้ว่าระบบเปิด OTP อยู่ไหม ไม่ควรให้ผู้ใช้ทั่วไปเห็น
      if (me.clearance !== 3) return res.status(403).json({ error: 'เฉพาะระดับสูงสุดเท่านั้น' });
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

    // ---- ทางลัดสำหรับผู้พัฒนา: ข้ามหน้ายินยอมและคู่มือ ----
    // ตรวจสิทธิ์ที่เซิร์ฟเวอร์เสมอ การซ่อนปุ่มฝั่งหน้าเว็บไม่ใช่การป้องกัน คนอื่นยิง request ตรงมาก็ต้องถูกปฏิเสธ
    if (action === 'devSkipOnboarding') {
      if (!isDev(me) && !me.isOwner) return res.status(403).json({ error: 'เฉพาะผู้พัฒนาระบบเท่านั้น' });
      const idx = accounts.findIndex((a) => a.email === me.email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      accounts[idx] = {
        ...accounts[idx],
        // บันทึกตามความจริงว่านี่คือการข้ามโดยผู้พัฒนา ไม่ใช่การกดยอมรับจริง
        // เพื่อให้ประวัติการยินยอมของลูกค้าจริงเชื่อถือได้เวลาถูกตรวจสอบ
        consent: { version: CONSENT_VERSION, at: Date.now(), ip, devBypass: true },
        onboardedAt: accounts[idx].onboardedAt || Date.now(),
        tourSeen: TOUR_VERSION_SERVER,
      };
      await saveAccounts(accounts);
      await logActivity({ type: 'onboarding_dev_skip', email: me.email, ip });
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    // ---- ผู้พัฒนาสั่งให้ตัวเองเห็นหน้ายินยอม/คู่มือใหม่ เพื่อทดสอบ flow ----
    if (action === 'resetMyOnboarding') {
      if (!isDev(me) && !me.isOwner) return res.status(403).json({ error: 'เฉพาะผู้พัฒนาระบบเท่านั้น' });
      const idx = accounts.findIndex((a) => a.email === me.email);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      const { consent, onboardedAt, tourSeen, ...rest } = accounts[idx];
      accounts[idx] = rest;
      await saveAccounts(accounts);
      await logActivity({ type: 'onboarding_reset_self', email: me.email, ip });
      return res.status(200).json({ account: sanitize(accounts[idx]) });
    }

    // ---- ศูนย์แจ้งเตือน: รวมสัญญาณปัญหาจริงจากระบบ แล้วแยกเป็น 3 กลุ่ม ----
    // ล่วงหน้า = ยังไม่เกิดแต่กำลังจะเกิด · กำลังเกิด = ต้องแก้ตอนนี้ · ตามหลัง = เกิดไปแล้วรอตามเก็บ
    if (action === 'protocolScan') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขึ้นไปเท่านั้น' });
      const myOrgP = orgIdOf(me);
      const devView = isDev(me);
      const scope = accounts.filter((a) => devView || orgIdOf(a) === myOrgP);
      const scopeEmails = new Set(scope.map((a) => a.email));
      const now = Date.now();
      const DAY = 24 * 60 * 60 * 1000;

      const ahead = [];   // ปัญหาล่วงหน้า
      const current = []; // ปัญหาที่กำลังเกิด
      const trailing = []; // ปัญหาที่ตามหลัง

      // --- ตั๋วที่ยังไม่ได้ตอบ = ปัญหาที่กำลังเกิด ---
      let tickets = [];
      try { tickets = await listTickets(); } catch (e) {}
      const openTickets = tickets.filter((t) => (devView || scopeEmails.has(t.email)) && t.status !== 'done');
      openTickets.forEach((t) => {
        const ageH = Math.floor((now - (t.at || now)) / 3600000);
        current.push({
          severity: ageH > 24 ? 'สูง' : 'กลาง',
          area: 'คำขอจากผู้ใช้',
          what: `${t.name || t.email} ส่ง${t.kind === 'tokens' ? 'คำขอโทเค็น' : 'คำขอความช่วยเหลือ'}ไว้ ยังไม่ได้ตอบ${ageH >= 1 ? ` (${ageH} ชม.)` : ''}`,
          detail: String(t.message || '').slice(0, 200),
          action: 'เข้าไปตอบในหน้าจัดการคำขอ',
        });
      });

      // --- โทเค็นใกล้หมด = ปัญหาล่วงหน้า ---
      // ถ้าองค์กรใช้โทเค็นกองกลาง ต้องเตือนครั้งเดียวในนามองค์กร ไม่ใช่เตือนซ้ำทุกคน
      const myOrgRec = await getOrg(myOrgP);
      if (myOrgRec && myOrgRec.plan && isPooledPlan(myOrgRec.plan)) {
        const stOrg = tokenState(me, myOrgRec);
        if (!stOrg.unlimited && stOrg.quota > 0) {
          if (stOrg.left <= 0) current.push({ severity: 'สูง', area: 'โทเค็น', what: `โทเค็นกองกลางขององค์กรหมดแล้ว ทุกคนใช้ AI ต่อไม่ได้`, action: 'ต่ออายุแพ็กหรือเติมโทเค็น' });
          else if (stOrg.left / stOrg.quota < 0.15) ahead.push({ severity: 'กลาง', area: 'โทเค็น', what: `โทเค็นกองกลางเหลือ ${stOrg.left} จาก ${stOrg.quota} (ต่ำกว่า 15%) ใช้ร่วมกันทั้งทีม`, action: 'เตรียมเติมก่อนหมด ไม่งั้นทั้งทีมสะดุดพร้อมกัน' });
        }
      } else {
        scope.forEach((a) => {
          const st = tokenState(a);
          if (st.unlimited) return;
          const total = st.quota;
          if (total > 0 && st.left <= 0) {
            current.push({ severity: 'สูง', area: 'โทเค็น', what: `${a.name || a.email} โทเค็นหมดแล้ว ใช้ AI ต่อไม่ได้`, action: 'เติมโทเค็นให้ หรือแนะนำให้ใส่คีย์ Gemini ของตัวเอง' });
          } else if (total > 0 && st.left / total < 0.15) {
            ahead.push({ severity: 'กลาง', area: 'โทเค็น', what: `${a.name || a.email} เหลือโทเค็น ${st.left} (ต่ำกว่า 15%)`, action: 'เตรียมเติมก่อนหมด ไม่งั้นงานสะดุดกลางคัน' });
          }
        });
      }

      // --- บัญชียังไม่ยินยอม/ยังไม่ตั้งค่า = ล่วงหน้า ---
      const notOnboarded = scope.filter((a) => !a.onboardedAt);
      if (notOnboarded.length) {
        ahead.push({
          severity: 'ต่ำ', area: 'บัญชีผู้ใช้',
          what: `มี ${notOnboarded.length} บัญชีที่สมัครแล้วแต่ยังไม่ผ่านหน้ายินยอม`,
          detail: notOnboarded.slice(0, 5).map((a) => a.email).join(', '),
          action: 'ทักไปเตือนให้เข้ามากรอกให้เสร็จ ไม่งั้นใช้ระบบไม่ได้',
        });
      }

      // --- คนหายไปนาน = ตามหลัง ---
      let presence = {};
      try { presence = await getPresence(); } catch (e) {}
      scope.forEach((a) => {
        if (a.email === me.email) return;
        const p = presence[a.email];
        const last = p ? p.at : (a.lastLogin || 0);
        if (last && now - last > 7 * DAY) {
          trailing.push({ severity: 'ต่ำ', area: 'ทีมงาน', what: `${a.name || a.email} ไม่ได้เข้าระบบมา ${Math.floor((now - last) / DAY)} วัน`, action: 'เช็คว่ายังทำงานอยู่ไหม หรือควรปิดบัญชี' });
        }
      });

      // --- ความปลอดภัย: ล็อกอินล้มเหลว / OTP ผิด / ถูกแบน = กำลังเกิด ---
      if (devView) {
        let log = [];
        try { log = await getActivityLog(); } catch (e) {}
        const recent = log.filter((l) => now - (l.at || 0) < DAY);
        const failed = recent.filter((l) => l.type === 'login_failed' || l.type === 'otp_failed').length;
        if (failed >= 10) {
          current.push({ severity: 'สูง', area: 'ความปลอดภัย', what: `24 ชม.ที่ผ่านมามีการล็อกอิน/ใส่รหัสผิด ${failed} ครั้ง อาจมีคนพยายามเดารหัส`, action: 'ดูบันทึกกิจกรรมว่ามาจาก IP เดียวกันไหม ถ้าใช่ให้แบน' });
        }
        const blocked = recent.filter((l) => l.type === 'signup_blocked').length;
        if (blocked >= 5) {
          trailing.push({ severity: 'กลาง', area: 'ความปลอดภัย', what: `มีการสมัครที่ถูกบล็อก ${blocked} ครั้งใน 24 ชม.`, action: 'ตรวจว่าเป็นคนพยายามเลี่ยงข้อจำกัด หรือระบบกันผิดพลาด' });
        }
        let bans = [];
        try { bans = await listBans(); } catch (e) {}
        if (bans.length) trailing.push({ severity: 'ต่ำ', area: 'ความปลอดภัย', what: `มี ${bans.length} อุปกรณ์/IP ที่ถูกระงับอยู่`, action: 'ทบทวนว่ายังควรระงับอยู่ไหม' });
      }

      // --- สำรองข้อมูล = ล่วงหน้า ---
      try {
        const backups = await listBackups(me.email);
        const latest = Array.isArray(backups) && backups.length ? backups[backups.length - 1] : null;
        const latestDate = latest ? (latest.date || latest) : null;
        if (!latestDate) {
          ahead.push({ severity: 'กลาง', area: 'ข้อมูล', what: 'ยังไม่เคยสำรองข้อมูลเลย', action: 'กดสำรองข้อมูลในหน้าตั้งค่า ก่อนข้อมูลหาย' });
        } else {
          const days = Math.floor((now - new Date(String(latestDate) + 'T00:00:00').getTime()) / DAY);
          if (days > 7) ahead.push({ severity: 'กลาง', area: 'ข้อมูล', what: `สำรองข้อมูลล่าสุดเมื่อ ${days} วันก่อน`, action: 'สำรองใหม่ ถ้าข้อมูลหายตอนนี้จะย้อนได้ถึงแค่วันนั้น' });
        }
      } catch (e) {}

      // --- การตั้งค่าที่ทำให้ระบบเสี่ยง = กำลังเกิด ---
      try {
        const sec = await getSecurity();
        if (sec.otpDisabled) current.push({ severity: 'สูง', area: 'ความปลอดภัย', what: 'ระบบปิดการยืนยันอีเมล (OTP) อยู่ ทุกบัญชีเข้าได้ด้วยรหัสผ่านอย่างเดียว', action: 'เปิดกลับในหน้าตั้งค่าความปลอดภัย ถ้าไม่ได้ตั้งใจปิดไว้ชั่วคราว' });
      } catch (e) {}

      const order = { 'สูง': 0, 'กลาง': 1, 'ต่ำ': 2 };
      const sortBy = (arr) => arr.sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3));
      return res.status(200).json({
        ahead: sortBy(ahead), current: sortBy(current), trailing: sortBy(trailing),
        scannedAt: now,
        scope: devView ? 'ทั้งระบบ' : 'องค์กรของคุณ',
      });
    }

    // ---- ส่งสรุปปัญหาเข้าอีเมล เพื่อให้รู้เรื่องแม้ไม่ได้เปิดเว็บ ----
    if (action === 'protocolEmail') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขึ้นไปเท่านั้น' });
      const rl = await rateLimit(`protoemail_${me.email}`, 6, 60 * 60 * 1000);
      if (!rl.allowed) return res.status(429).json({ error: `ส่งอีเมลถี่เกินไป ลองใหม่ใน ${Math.ceil(rl.retrySec / 60)} นาที` });
      const { ahead = [], current = [], trailing = [] } = req.body || {};
      const fmt = (arr, label) => arr.length
        ? [`<b>${label} (${arr.length})</b>`, ...arr.slice(0, 12).map((x) => `• [${x.severity}] ${x.area}: ${x.what}${x.action ? ` → ${x.action}` : ''}`)]
        : [`<b>${label}</b>`, '• ไม่พบปัญหา'];
      const lines = [
        ...fmt(current, 'ปัญหาที่กำลังเกิด'), '',
        ...fmt(ahead, 'ปัญหาล่วงหน้า'), '',
        ...fmt(trailing, 'ปัญหาที่ตามหลัง'),
      ];
      const r = await sendAlertEmail({
        to: [me.email],
        subject: `[FORGE] สรุปปัญหาระบบ ${current.length ? `— ด่วน ${current.length} เรื่อง` : ''}`,
        title: 'สรุปสถานะระบบ',
        lines,
      });
      if (!r.ok) return res.status(500).json({ error: r.reason || 'ส่งอีเมลไม่สำเร็จ' });
      return res.status(200).json({ ok: true, to: me.email });
    }

    // ---- ผู้บริหารรีเซ็ตรหัสผ่านให้พนักงานที่ลืมรหัส ----
    // ไม่มีใครเห็นรหัสเดิมของใครได้ เพราะเก็บเป็นค่าที่ย้อนกลับไม่ได้ (scrypt)
    // วิธีที่ถูกต้องคือออกรหัสชั่วคราวใหม่ แล้วบังคับให้เจ้าตัวเปลี่ยนทันทีที่ล็อกอิน
    if (action === 'resetMemberPassword') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขององค์กรเท่านั้น' });
      const { email: target } = req.body || {};
      const idx = accounts.findIndex((a) => a.email === target);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      // กันผู้บริหารองค์กรอื่นมารีเซ็ตข้ามองค์กร และกันไม่ให้รีเซ็ตของคนที่สิทธิ์สูงกว่าตัวเอง
      if (!isDev(me) && orgIdOf(accounts[idx]) !== orgIdOf(me)) {
        return res.status(403).json({ error: 'รีเซ็ตรหัสของคนนอกองค์กรไม่ได้' });
      }
      if (!isDev(me) && (accounts[idx].isOwner || roleLevel(accounts[idx]) > roleLevel(me))) {
        return res.status(403).json({ error: 'รีเซ็ตรหัสของคนที่สิทธิ์สูงกว่าหรือเท่ากันไม่ได้' });
      }

      // รหัสชั่วคราวอ่านง่าย ไม่ใช้ตัวที่สับสน (0/O, 1/l/I) เพราะต้องบอกกันปากเปล่า
      const CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
      let temp = '';
      for (let i = 0; i < 10; i++) temp += CH[crypto.randomInt(0, CH.length)];

      const { salt, hash } = hashPassword(temp);
      accounts[idx].passwordSalt = salt;
      accounts[idx].passwordHash = hash;
      accounts[idx].mustChangePassword = true;          // บังคับตั้งใหม่ทันทีที่ล็อกอิน
      accounts[idx].sessionsValidFrom = Date.now();      // เตะทุกอุปกรณ์ที่ล็อกอินค้างอยู่ออก
      delete accounts[idx].password;
      await saveAccounts(accounts);
      await logActivity({ type: 'password_reset_by_admin', target, by: me.email, ip });
      // ส่งรหัสชั่วคราวกลับให้ผู้บริหารครั้งเดียว เพื่อเอาไปบอกพนักงาน
      return res.status(200).json({ ok: true, tempPassword: temp, name: accounts[idx].name || target });
    }

    // ---- บันทึกสถานะการทำงานรายวัน (มาทำงาน/ลา/ขาด/สาย) ----
    if (action === 'setAttendance') {
      const { email: target, date, status, note } = req.body || {};
      const VALID = ['present', 'late', 'leave', 'absent', 'sick', 'wfh'];
      if (!VALID.includes(status)) return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
      const day = /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? date : bangkokDateStr();
      const who = target || me.email;
      // พนักงานบันทึกของตัวเองได้ · หัวหน้าขึ้นไปบันทึกให้ลูกทีมในองค์กรตัวเองได้
      if (who !== me.email) {
        if (!isManager(me)) return res.status(403).json({ error: 'บันทึกให้คนอื่นได้เฉพาะระดับหัวหน้าขึ้นไป' });
        const t = accounts.find((a) => a.email === who);
        if (!t) return res.status(404).json({ error: 'ไม่พบบัญชี' });
        if (!isDev(me) && orgIdOf(t) !== orgIdOf(me)) return res.status(403).json({ error: 'บันทึกให้คนนอกองค์กรไม่ได้' });
      }
      const key = `att_${orgIdOf(me)}_${day}`;
      const rec = (await redisGet(key)) || {};
      rec[who] = { status, note: String(note || '').slice(0, 200), at: Date.now(), by: me.email };
      await redisSet(key, rec);
      return res.status(200).json({ ok: true, date: day, attendance: rec });
    }

    // ---- ดูสถานะทีมวันนี้ + คำนวณ Work Flow ----
    if (action === 'getAttendance') {
      const { date } = req.body || {};
      const day = /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? date : bangkokDateStr();
      const myOrgA = orgIdOf(me);
      const rec = (await redisGet(`att_${myOrgA}_${day}`)) || {};
      const members = accounts.filter((a) => orgIdOf(a) === myOrgA && !a.suspended);

      // พนักงานทั่วไปเห็นแค่ของตัวเอง — สถานะการลาของเพื่อนเป็นข้อมูลส่วนบุคคล
      if (!isManager(me)) {
        return res.status(200).json({ date: day, mine: rec[me.email] || null, canSeeTeam: false });
      }

      // น้ำหนักกำลังคน: มาเต็ม=1, สาย/ทำที่บ้าน=0.9, ลา/ป่วย=0, ขาด=0
      const WEIGHT = { present: 1, wfh: 0.9, late: 0.9, leave: 0, sick: 0, absent: 0 };
      const rows = members.map((a) => {
        const r = rec[a.email];
        // ยังไม่บันทึก = ถือว่ามาทำงานปกติ (ไม่ลงโทษคนที่ลืมเช็คอิน)
        const status = r?.status || 'present';
        return {
          email: a.email, name: a.name || a.email, dept: a.dept || '', role: roleOf(a),
          status, note: r?.note || '', markedAt: r?.at || null, marked: !!r,
        };
      });
      const calc = (list) => {
        if (list.length === 0) return null;
        const sum = list.reduce((s2, x) => s2 + (WEIGHT[x.status] ?? 1), 0);
        return Math.round((sum / list.length) * 100);
      };
      // แยกรายแผนกด้วย เพราะภาพรวมทั้งบริษัทอาจดูดี แต่บางแผนกอาจขาดคนจนงานหนักเกินไป
      const byDept = {};
      rows.forEach((r) => {
        const d = r.dept || 'ไม่ระบุแผนก';
        if (!byDept[d]) byDept[d] = [];
        byDept[d].push(r);
      });
      const departments = Object.entries(byDept).map(([dept, list]) => {
        const flow = calc(list);
        return {
          dept, total: list.length, flow,
          out: list.filter((x) => (WEIGHT[x.status] ?? 1) === 0).length,
          // แผนกเล็กที่คนหายไปครึ่งหนึ่ง งานจะกองที่คนที่เหลือทันที ต้องเตือน
          strained: flow != null && flow < 60,
        };
      }).sort((a, b) => (a.flow ?? 100) - (b.flow ?? 100));

      return res.status(200).json({
        date: day, canSeeTeam: true,
        workFlow: calc(rows),
        headcount: rows.length,
        present: rows.filter((r) => r.status === 'present').length,
        late: rows.filter((r) => r.status === 'late').length,
        leave: rows.filter((r) => r.status === 'leave' || r.status === 'sick').length,
        absent: rows.filter((r) => r.status === 'absent').length,
        rows, departments,
      });
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
      delete accounts[idx].mustChangePassword; // ตั้งรหัสใหม่แล้ว ไม่ต้องบังคับอีก
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
      // แจ้งทางอีเมลทันที เพื่อให้รู้เรื่องแม้ไม่ได้เปิดหน้าเว็บอยู่
      // ไม่ await ผลลัพธ์ ถ้าอีเมลส่งไม่ได้ก็ต้องไม่ทำให้การส่งตั๋วล้มเหลว
      alertRecipients(orgIdOf(me)).then((to) => sendAlertEmail({
        to,
        subject: `[FORGE] มีคำขอใหม่จาก ${me.name || me.email}`,
        title: kind === 'tokens' ? 'มีคำขอโทเค็นเข้ามาใหม่' : 'มีคำขอความช่วยเหลือเข้ามาใหม่',
        lines: [
          `<b>จาก:</b> ${me.name || '-'} (${me.email})`,
          `<b>องค์กร:</b> ${me.orgName || '-'}`,
          `<b>ประเภท:</b> ${kind === 'tokens' ? 'ขอโทเค็นเพิ่ม' : 'ขอความช่วยเหลือ'}`,
          `<b>ข้อความ:</b><br>${String(message).slice(0, 1000).replace(/</g, '&lt;').replace(/\n/g, '<br>')}`,
        ],
        footer: 'เข้าไปตอบได้ที่หน้าตั้งค่า > กล่องคำขอ',
      })).catch(() => {});
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
    // ---- ตั้งแพ็กให้ทั้งองค์กร (แพ็กแบบกองกลาง) ----
    // แพ็กนิติบุคคล/องค์กรต้องผูกกับองค์กร ไม่ใช่รายบุคคล ไม่งั้นพนักงานจะไม่ได้อะไรจากที่บริษัทจ่าย
    if (action === 'adminSetOrgPlan') {
      if (!isDev(me)) return res.status(403).json({ error: 'เฉพาะเจ้าของระบบเท่านั้น' });
      const { orgId: targetOrgId, plan } = req.body;
      if (!PLANS[plan]) return res.status(400).json({ error: 'แพ็กเกจไม่ถูกต้อง' });
      if (!targetOrgId) return res.status(400).json({ error: 'ต้องระบุองค์กร' });
      const cur = await getOrg(targetOrgId);
      if (!cur) return res.status(404).json({ error: 'ไม่พบองค์กร' });
      // เตือนถ้าคนในองค์กรมากกว่าที่นั่งของแพ็กใหม่ — ไม่บล็อก แต่ต้องรู้
      const members = accounts.filter((a) => orgIdOf(a) === targetOrgId).length;
      const seats = PLANS[plan].seats || 1;
      const next = await upsertOrg({ id: targetOrgId, plan, tokensUsed: 0, cycleStart: Date.now() });
      await logActivity({ type: 'set_org_plan', orgId: targetOrgId, plan, by: me.email });
      return res.status(200).json({
        ok: true, org: next,
        warning: members > seats ? `องค์กรนี้มี ${members} คน แต่แพ็ก${PLANS[plan].name}รองรับ ${seats} ที่นั่ง — คนที่เกินยังใช้ได้ แต่จะเพิ่มคนใหม่ไม่ได้` : null,
      });
    }

    // ---- ผู้บริหารตั้งแผนกให้พนักงานในองค์กรตัวเอง ----
    if (action === 'setMemberDept') {
      if (!isExec(me)) return res.status(403).json({ error: 'เฉพาะผู้บริหารขององค์กรเท่านั้น' });
      const { email: t, dept } = req.body;
      const idx = accounts.findIndex((a) => a.email === t);
      if (idx === -1) return res.status(404).json({ error: 'ไม่พบบัญชี' });
      if (!isDev(me) && orgIdOf(accounts[idx]) !== orgIdOf(me)) {
        return res.status(403).json({ error: 'แก้ข้อมูลคนนอกองค์กรไม่ได้' });
      }
      accounts[idx].dept = String(dept || '').slice(0, 60).trim();
      await saveAccounts(accounts);
      await logActivity({ type: 'set_dept', target: t, dept, by: me.email });
      return res.status(200).json({ ok: true });
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
