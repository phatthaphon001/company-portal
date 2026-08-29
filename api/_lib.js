// ไฟล์นี้เป็น "ตัวช่วยกลาง" ของฝั่งเซิร์ฟเวอร์ ไม่ใช่หน้าเว็บ
// ชื่อขึ้นต้นด้วย _ เพื่อให้ Vercel รู้ว่าไม่ใช่ API endpoint (เรียกจากภายนอกไม่ได้)
import crypto from 'crypto';

const SECRET = process.env.OTP_SECRET;
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // โทเค็นอายุ 7 วัน

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export function redisReady() {
  return !!(REDIS_URL && REDIS_TOKEN);
}

export async function redisGet(key) {
  const r = await fetch(`${REDIS_URL}/get/${key}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  const d = await r.json();
  return d.result ? JSON.parse(d.result) : null;
}

export async function redisSet(key, value) {
  await fetch(`${REDIS_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(value),
  });
}

// ---------- แจ้งเตือนทางอีเมล ----------
// ใช้ตอนมีเรื่องด่วนที่เจ้าของระบบต้องรู้ทันทีแม้ไม่ได้เปิดเว็บอยู่
// ส่งแบบไม่ให้ล้มกระทบงานหลัก — ถ้าส่งไม่ได้ให้บันทึกไว้เฉยๆ
export async function sendAlertEmail({ to, subject, title, lines, footer }) {
  try {
    if (!process.env.RESEND_API_KEY || !to) return { ok: false, reason: 'ยังไม่ได้ตั้งค่าอีเมล' };
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = (lines || []).map((l) => `<p style="margin:4px 0">${String(l)}</p>`).join('');
    await resend.emails.send({
      from: 'FORGE Alert <onboarding@resend.dev>',
      to,
      subject: String(subject || 'แจ้งเตือนจากระบบ').slice(0, 180),
      html: `<div style="font-family:sans-serif;max-width:560px">
        <h2 style="margin:0 0 8px">${String(title || subject || 'แจ้งเตือน')}</h2>
        ${body}
        <p style="color:#888;font-size:12px;margin-top:16px">${String(footer || 'อีเมลนี้ส่งอัตโนมัติจากระบบ FORGE')}</p>
      </div>`,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e?.message || 'ส่งอีเมลไม่สำเร็จ' };
  }
}

// หาอีเมลผู้รับแจ้งเตือน — เจ้าของระบบ และผู้บริหารขององค์กรที่เกี่ยวข้อง
export async function alertRecipients(orgId) {
  const accounts = (await redisGet('accounts')) || [];
  const owner = accounts.find((a) => a.isOwner);
  const out = [];
  if (owner?.email) out.push(owner.email);
  if (orgId) {
    accounts
      .filter((a) => !a.isOwner && a.orgId === orgId && (a.role === 'exec' || a.clearance === 3))
      .forEach((a) => { if (a.email && !out.includes(a.email)) out.push(a.email); });
  }
  return out;
}

// ---------- รหัสยืนยันทางอีเมล (OTP) ----------
// สำคัญ: รหัสต้องอยู่ที่เซิร์ฟเวอร์เท่านั้น ห้ามส่งกลับไปที่เบราว์เซอร์ไม่ว่ารูปแบบใด
// เดิมระบบใส่รหัสไว้ในโทเค็นแบบ base64 ซึ่งใครก็ถอดอ่านได้ ทำให้ OTP ไม่มีความหมาย
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

export async function createOtp(email) {
  // ตัวอ้างอิงแบบสุ่ม ไม่มีข้อมูลอะไรอยู่ข้างใน เดาไม่ได้
  const ref = crypto.randomBytes(24).toString('hex');
  const code = crypto.randomInt(100000, 1000000).toString();
  // เก็บเป็นแฮชพร้อมเกลือ เผื่อฐานข้อมูลรั่วก็ยังย้อนกลับเป็นรหัสไม่ได้
  const salt = crypto.randomBytes(12).toString('hex');
  const codeHash = crypto.createHmac('sha256', SECRET).update(`${salt}:${code}`).digest('hex');
  await redisSet(`otp_${ref}`, {
    email: String(email).toLowerCase(),
    salt, codeHash,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  return { ref, code }; // code ใช้ส่งอีเมลเท่านั้น ห้ามส่งออก API
}

// ตรวจรหัส — ใช้ได้ครั้งเดียว ผิดเกินกำหนดถือว่าใช้ไม่ได้แล้ว
export async function consumeOtp(ref, code) {
  if (!ref || !code) return { ok: false, reason: 'ข้อมูลไม่ครบ' };
  const key = `otp_${String(ref).replace(/[^a-f0-9]/gi, '').slice(0, 64)}`;
  let rec = null;
  try { rec = await redisGet(key); } catch (e) { return { ok: false, reason: 'ตรวจสอบรหัสไม่สำเร็จ' }; }
  if (!rec) return { ok: false, reason: 'รหัสไม่ถูกต้องหรือหมดอายุแล้ว' };
  if (Date.now() > rec.expiresAt) { await redisSet(key, null); return { ok: false, reason: 'รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่' }; }
  if ((rec.attempts || 0) >= OTP_MAX_ATTEMPTS) { await redisSet(key, null); return { ok: false, reason: 'ใส่รหัสผิดหลายครั้งเกินไป กรุณาขอรหัสใหม่' }; }

  const expected = crypto.createHmac('sha256', SECRET).update(`${rec.salt}:${String(code)}`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(rec.codeHash));
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!match) {
    await redisSet(key, { ...rec, attempts: (rec.attempts || 0) + 1 });
    const left = OTP_MAX_ATTEMPTS - ((rec.attempts || 0) + 1);
    return { ok: false, reason: left > 0 ? `รหัสไม่ถูกต้อง เหลืออีก ${left} ครั้ง` : 'ใส่รหัสผิดหลายครั้งเกินไป กรุณาขอรหัสใหม่' };
  }
  await redisSet(key, null); // ใช้แล้วทิ้งทันที กันเอาไปใช้ซ้ำ
  return { ok: true, email: rec.email };
}

// ---------- รหัสผ่าน ----------
// ใช้ scrypt ที่มากับ Node อยู่แล้ว ไม่ต้องติดตั้งอะไรเพิ่ม และไม่มีค่าใช้จ่าย
export function hashPassword(password, existingSalt) {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  if (!salt || !hash) return false;
  try {
    const candidate = crypto.scryptSync(String(password), salt, 64).toString('hex');
    const a = Buffer.from(candidate);
    const b = Buffer.from(hash);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

// ---------- โทเค็นยืนยันตัวตน ----------
// เซ็นด้วยกุญแจลับฝั่งเซิร์ฟเวอร์ ผู้ใช้แก้เนื้อในไม่ได้ (แก้แล้วลายเซ็นจะไม่ตรง)
export function issueToken(email) {
  const payload = `${email}:${Date.now()}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

export function verifyToken(token) {
  try {
    if (!token || !SECRET) return null;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    const sig = parts.pop();
    const issuedAt = parts.pop();
    const email = parts.join(':');
    if (!email || !issuedAt || !sig) return null;
    const expected = crypto.createHmac('sha256', SECRET).update(`${email}:${issuedAt}`).digest('hex');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
    if (Date.now() - Number(issuedAt) > SESSION_MAX_AGE_MS) return null;
    return { email, issuedAt: Number(issuedAt) };
  } catch (e) {
    return null;
  }
}

// ดึงโทเค็นจาก header Authorization หรือจาก body (เผื่อไว้)
export function getToken(req) {
  const h = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  if (typeof h === 'string' && h.startsWith('Bearer ')) return h.slice(7);
  return (req.body && req.body.token) || null;
}

// ตรวจว่าเป็นผู้ใช้จริงหรือไม่ — คืนข้อมูลบัญชีสดจากฐานข้อมูล (ไม่เชื่อข้อมูลจากเบราว์เซอร์)
export async function requireUser(req) {
  const claim = verifyToken(getToken(req));
  if (!claim) return null;
  const accounts = (await redisGet('accounts')) || [];
  const account = accounts.find((a) => a.email === claim.email);
  if (!account) return null;
  // ถ้าเจ้าของระบบสั่งให้ทุกคนล็อกอินใหม่ โทเค็นที่ออกก่อนหน้านั้นจะใช้ไม่ได้
  if (account.sessionsValidFrom && claim.issuedAt < account.sessionsValidFrom) return null;
  return { account, accounts, claim };
}

// เอาข้อมูลลับออกก่อนส่งกลับหน้าเว็บ
export function sanitize(a) {
  // ห้ามส่งรหัสผ่านหรือคีย์ API ออกไปฝั่งหน้าเว็บเด็ดขาด
  const { password, passwordHash, passwordSalt, geminiKey, ...rest } = a;
  return { ...rest, hasGeminiKey: !!(geminiKey && String(geminiKey).trim()) };
}

// ---------- จำกัดจำนวนครั้ง (กันยิงถี่) ----------
// เก็บเวลาที่เรียกไว้ใน Redis แล้วนับเฉพาะที่อยู่ในช่วงเวลาที่กำหนด
export async function rateLimit(bucketKey, maxHits, windowMs) {
  const key = `rl_${bucketKey}`.replace(/[^a-zA-Z0-9_@.-]/g, '_');
  const now = Date.now();
  let hits = [];
  try {
    hits = (await redisGet(key)) || [];
  } catch (e) {
    return { allowed: true, remaining: maxHits }; // อ่านไม่ได้ก็ไม่บล็อก
  }
  const recent = (Array.isArray(hits) ? hits : []).filter((t) => now - t < windowMs);
  if (recent.length >= maxHits) {
    const retryMs = windowMs - (now - recent[0]);
    return { allowed: false, retrySec: Math.ceil(retryMs / 1000) };
  }
  recent.push(now);
  try { await redisSet(key, recent); } catch (e) {}
  return { allowed: true, remaining: maxHits - recent.length };
}

// ---------- สำรองข้อมูลอัตโนมัติ ----------
// เก็บสแนปช็อตรายวันไว้ 7 ชุด (เขียนทับชุดเดิมของวันเดียวกัน) กู้คืนได้จากหน้า Setting
const BACKUP_KEYS = ['channels', 'tasks', 'history', 'futureTasks', 'lastActiveDate'];

// สำรองข้อมูลแยกตามผู้ใช้ — ของใครของมัน ไม่ทับกัน
export async function autoBackup(dateStr, scope) {
  if (!scope) return { skipped: true, reason: 'no-scope' };
  const em = String(scope).toLowerCase();
  const idxKey = `bk:${em}:index`;
  const index = (await redisGet(idxKey)) || [];
  if (index.includes(dateStr)) return { skipped: true };

  const snapshot = {};
  for (const k of BACKUP_KEYS) {
    snapshot[k] = await redisGet(`o:${em}:${k}`) ?? await redisGet(`u:${em}:${k}`);
  }
  // ไม่สำรองถ้าไม่มีข้อมูลจริง — กันชุดว่างทับชุดดี
  const hasData = Array.isArray(snapshot.channels) && snapshot.channels.length > 0;
  if (!hasData) return { skipped: true, reason: 'empty' };

  await redisSet(`bk:${em}:${dateStr}`, { at: Date.now(), data: snapshot });
  const nextIndex = [...index, dateStr].slice(-7);
  await redisSet(idxKey, nextIndex);
  for (const old of index) {
    if (!nextIndex.includes(old)) {
      try { await redisSet(`bk:${em}:${old}`, null); } catch (e) {}
    }
  }
  return { ok: true, kept: nextIndex };
}

export async function listBackups(scope) {
  if (!scope) return [];
  return (await redisGet(`bk:${String(scope).toLowerCase()}:index`)) || [];
}

export async function getBackup(dateStr, scope) {
  if (!scope) return null;
  return await redisGet(`bk:${String(scope).toLowerCase()}:${dateStr}`);
}

// ---------- บันทึกกิจกรรม (Activity Log) ----------
export async function logActivity(entry) {
  try {
    const log = (await redisGet('activity_log')) || [];
    const next = [...log, { ...entry, at: Date.now() }].slice(-300); // เก็บ 300 รายการล่าสุด
    await redisSet('activity_log', next);
  } catch (e) {}
}

export async function getActivityLog() {
  return (await redisGet('activity_log')) || [];
}

// ---------- ระบบแบน ----------
export async function isBanned(identifier) {
  const bans = (await redisGet('bans')) || [];
  const hit = bans.find((b) => b.id === identifier);
  if (!hit) return null;
  if (hit.until && Date.now() > hit.until) return null; // หมดเวลาแบนแล้ว
  return hit;
}

export async function addBan(identifier, reason, byEmail, untilMs) {
  const bans = (await redisGet('bans')) || [];
  const next = bans.filter((b) => b.id !== identifier);
  next.push({ id: identifier, reason, by: byEmail || 'system', at: Date.now(), until: untilMs || null });
  await redisSet('bans', next.slice(-200));
}

export async function removeBan(identifier) {
  const bans = (await redisGet('bans')) || [];
  await redisSet('bans', bans.filter((b) => b.id !== identifier));
}

export async function listBans() {
  return (await redisGet('bans')) || [];
}

// นับความพยายามน่าสงสัย แล้วแบนอัตโนมัติเมื่อเกินเกณฑ์
export async function recordSuspicious(ip, kind) {
  try {
    const key = `sus_${String(ip).replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const now = Date.now();
    const hits = ((await redisGet(key)) || []).filter((h) => now - h.at < 60 * 60 * 1000);
    hits.push({ at: now, kind });
    await redisSet(key, hits.slice(-50));
    await logActivity({ type: 'suspicious', ip, kind });
    // ผิดพลาดน่าสงสัยเกิน 15 ครั้งใน 1 ชม. → แบนอัตโนมัติ 24 ชม.
    if (hits.length >= 15) {
      await addBan(ip, `ระบบแบนอัตโนมัติ: พฤติกรรมน่าสงสัย ${hits.length} ครั้งใน 1 ชม. (${kind})`, 'system', now + 24 * 60 * 60 * 1000);
      await logActivity({ type: 'auto_ban', ip, kind, hits: hits.length });
      return { banned: true };
    }
    return { banned: false, hits: hits.length };
  } catch (e) {
    return { banned: false };
  }
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || 'unknown';
}

// ---------- ระบบโทเค็นการใช้งาน (usage credits) ----------
// ---------- ประเภทผู้ใช้ 4 กลุ่ม ----------
// แยกขาดจากกัน: ฟีเจอร์และข้อมูลของแต่ละกลุ่มห้ามปนกัน
export const TIERS = {
  personal: { label: 'บุคคลธรรมดา',   desc: 'ฟรีแลนซ์ นักเรียน นักศึกษา ผู้ใช้ทั่วไป', seeTeam: false, maxSeats: 1 },
  juristic: { label: 'นิติบุคคล',      desc: 'มีลูกน้องได้ ดูการทำงานของทีมได้',        seeTeam: true,  maxSeats: 5 },
  company:  { label: 'บริษัท/องค์กร',  desc: 'ทีมใหญ่ ดูพนักงานและจัดการสิทธิ์ได้เต็ม',  seeTeam: true,  maxSeats: 25 },
  dev:      { label: 'ผู้พัฒนาระบบ',   desc: 'ผู้ดูแลแพลตฟอร์ม',                        seeTeam: true,  maxSeats: 9999 },
};

export const PLANS = {
  // --- บุคคลธรรมดา: โทเค็นเป็นของตัวเอง ไม่มีลูกทีม ---
  trial:   { name: 'ทดลองใช้ฟรี', tier: 'personal', tokens: 300,   days: 7,    price: 0,    seats: 1 },
  starter: { name: 'Starter',     tier: 'personal', tokens: 1500,  days: 30,   price: 290,  seats: 1 },
  pro:     { name: 'Pro',         tier: 'personal', tokens: 5000,  days: 30,   price: 790,  seats: 1 },
  // --- นิติบุคคล: โทเค็นเป็นกองกลาง ลูกทีมดึงจากกองเดียวกัน ---
  biz:     { name: 'นิติบุคคล',    tier: 'juristic', tokens: 12000, days: 30,   price: 1990, seats: 5 },
  // --- บริษัท/องค์กร ---
  studio:  { name: 'Studio',      tier: 'company',  tokens: 15000, days: 30,   price: 1990, seats: 10 },
  corp:    { name: 'องค์กร',       tier: 'company',  tokens: 40000, days: 30,   price: 5900, seats: 25 },
  owner:   { name: 'ผู้พัฒนาระบบ', tier: 'dev',      tokens: -1,    days: 3650, price: 0,    seats: 9999 }, // -1 = ไม่จำกัด
};

// แพ็กที่ใช้โทเค็นกองกลางขององค์กร (พนักงานไม่มีโควตาแยกของตัวเอง)
export function isPooledPlan(planKey) {
  const p = PLANS[planKey];
  return !!p && (p.tier === 'juristic' || p.tier === 'company');
}

// ประเภทของผู้ใช้ ดูจากแพ็กขององค์กรก่อน ถ้าไม่มีจึงดูของตัวเอง
export function tierOf(account, org) {
  if (!account) return 'personal';
  if (account.isOwner || account.isDeveloper) return 'dev';
  if (org && org.plan && PLANS[org.plan]) return PLANS[org.plan].tier;
  const p = PLANS[account.plan];
  return p ? p.tier : 'personal';
}

// ราคาโทเค็นต่อการกระทำ — สะท้อนต้นทุนจริงคร่าวๆ
export const TOKEN_COST = {
  outline: 1, prompts: 2, meta: 2, review: 2,
  metricRead: 3, deepAnalysis: 5, teamAnalysis: 5, postTimeAdvice: 3, planAhead: 4, progressReview: 4, holidayIdeas: 4, safeScript: 5, prodPack: 8, imageQC: 6, finalQC: 6, backendRead: 7, crossCheck: 5, protocolAnalysis: 4, plan: 6, planSearch: 9, rival: 8, rivalSearch: 11, productFit: 4,
  other: 1,
};

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export function planOf(account, org) {
  if (!account) return PLANS.trial;
  if (account.isOwner) return PLANS.owner;
  // ถ้าอยู่ในองค์กรที่ซื้อแพ็กแบบกองกลาง ให้ยึดแพ็กขององค์กรเป็นหลัก
  // ไม่งั้นบริษัทจ่ายเงินแล้วพนักงานยังติดโควตาทดลองใช้ของตัวเอง
  if (org && org.plan && isPooledPlan(org.plan)) return PLANS[org.plan];
  return PLANS[account.plan] || PLANS.trial;
}

// คืนสถานะโทเค็นปัจจุบัน พร้อมรีเซ็ตรอบใหม่อัตโนมัติเมื่อครบกำหนด
export function tokenState(account, org) {
  const plan = planOf(account, org);
  const now = Date.now();
  // ถ้าเป็นแพ็กกองกลาง ตัวเลขทั้งหมดอ่านจากองค์กร ไม่ใช่จากบัญชีรายคน
  const pooled = !!(org && org.plan && isPooledPlan(org.plan)) && !account.isOwner;
  const holder = pooled ? org : account;
  const cycleStart = holder.cycleStart || holder.createdAt || account.createdAt || now;
  const cycleLen = (plan.days || 30) * 24 * 60 * 60 * 1000;
  const expired = now - cycleStart > cycleLen;
  const used = expired ? 0 : (holder.tokensUsed || 0);
  const quota = plan.tokens === -1 ? Infinity : (plan.tokens + (holder.bonusTokens || 0));
  return {
    plan,
    planKey: account.isOwner ? 'owner' : (pooled ? org.plan : (account.plan || 'trial')),
    tier: tierOf(account, org),
    pooled,
    unlimited: plan.tokens === -1,
    quota, used, left: plan.tokens === -1 ? Infinity : Math.max(0, quota - used),
    cycleStart: expired ? now : cycleStart,
    cycleEnd: (expired ? now : cycleStart) + cycleLen,
    expiredCycle: expired,
    daysLeft: Math.max(0, Math.ceil(((expired ? now : cycleStart) + cycleLen - now) / 86400000)),
  };
}

// หักโทเค็น — คืน { ok, left } ถ้าไม่พอจะคืน ok:false
export async function spendTokens(email, action, amount) {
  const cost = amount != null ? amount : (TOKEN_COST[action] || 1);
  const accounts = (await redisGet('accounts')) || [];
  const idx = accounts.findIndex((a) => a.email === email);
  if (idx === -1) return { ok: false, error: 'ไม่พบบัญชี' };
  const acc = accounts[idx];

  // หาองค์กรก่อน เพื่อรู้ว่าต้องหักจากกองกลางหรือจากโควตาส่วนตัว
  let org = null;
  try { org = await getOrg(orgIdOf(acc)); } catch (e) { org = null; }
  const st = tokenState(acc, org);

  // บันทึกสถิติรายคนเสมอ แม้จะหักจากกองกลาง เพื่อให้รู้ว่าใครใช้ไปเท่าไหร่
  const recordPerUser = async () => { try { await bumpUsageStat(email, action, cost); } catch (e) {} };

  if (st.unlimited) {
    acc.tokensUsed = (st.expiredCycle ? 0 : (acc.tokensUsed || 0)) + cost;
    acc.cycleStart = st.cycleStart;
    acc.lastUsedAt = Date.now();
    await redisSet('accounts', accounts);
    await recordPerUser();
    return { ok: true, left: Infinity, unlimited: true, spent: cost, pooled: false };
  }

  if (st.left < cost) return { ok: false, error: 'โทเค็นไม่พอ', left: st.left, needed: cost, pooled: st.pooled };

  if (st.pooled) {
    // หักจากกองกลางขององค์กร — พนักงานทุกคนใช้ถังเดียวกัน
    const nextOrg = {
      id: org.id,
      tokensUsed: st.used + cost,
      cycleStart: st.cycleStart,
      lastUsedAt: Date.now(),
    };
    await upsertOrg(nextOrg);
    // ฝั่งบัญชีเก็บแค่ยอดสะสมไว้ดูว่าใครใช้เยอะ ไม่ได้เอาไปคิดโควตา
    acc.pooledUsed = (acc.pooledUsed || 0) + cost;
    acc.lastUsedAt = Date.now();
    await redisSet('accounts', accounts);
    await recordPerUser();
    return { ok: true, left: st.left - cost, spent: cost, pooled: true };
  }

  acc.tokensUsed = st.used + cost;
  acc.cycleStart = st.cycleStart;
  acc.lastUsedAt = Date.now();
  await redisSet('accounts', accounts);
  await recordPerUser();
  return { ok: true, left: st.left - cost, spent: cost, pooled: false };
}

// สถิติการใช้งานรายคน รายวัน (ให้เจ้าของระบบดูได้)
export async function bumpUsageStat(email, action, cost) {
  try {
    const day = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
    const stats = (await redisGet('usage_stats')) || {};
    if (!stats[day]) stats[day] = {};
    if (!stats[day][email]) stats[day][email] = { total: 0, actions: {} };
    stats[day][email].total += cost;
    stats[day][email].actions[action] = (stats[day][email].actions[action] || 0) + cost;
    // เก็บ 90 วันล่าสุด
    const days = Object.keys(stats).sort();
    if (days.length > 90) days.slice(0, days.length - 90).forEach((d) => delete stats[d]);
    await redisSet('usage_stats', stats);
  } catch (e) {}
}

export async function getUsageStats() {
  return (await redisGet('usage_stats')) || {};
}

// ---------- คิวเรียก AI ฝั่งเซิร์ฟเวอร์ ----------
// กันผู้ใช้หลายคนยิงพร้อมกันจนชนลิมิตของคีย์กลาง
export async function reserveAiSlot(maxPerMin) {
  const limit = maxPerMin || 4;
  const now = Date.now();
  const hits = ((await redisGet('ai_slots')) || []).filter((t) => now - t < 60000);
  if (hits.length >= limit) {
    const waitMs = 60000 - (now - hits[0]);
    return { ok: false, waitSec: Math.ceil(waitMs / 1000) };
  }
  hits.push(now);
  await redisSet('ai_slots', hits);
  return { ok: true };
}

// ---------- กันสมัครใหม่วนซ้ำ ----------
const DISPOSABLE = ['10minutemail','tempmail','guerrillamail','mailinator','yopmail','throwawaymail','trashmail','sharklasers','maildrop','getnada','temp-mail','fakeinbox','dispostable'];

export function isDisposableEmail(email) {
  const d = String(email || '').split('@')[1] || '';
  return DISPOSABLE.some((x) => d.toLowerCase().includes(x));
}

// จำ "ลายนิ้วมือ" ของคนที่เคยสมัครแล้ว — สมัครซ้ำจากเครื่อง/IP เดิมจะโดนปฏิเสธ
export async function checkSignupAbuse(ip, fingerprint) {
  const list = (await redisGet('signup_marks') || []);
  const now = Date.now();
  const recent = list.filter((m) => now - m.at < 180 * 24 * 3600 * 1000);
  const byIp = recent.filter((m) => m.ip === ip).length;
  const byFp = fingerprint ? recent.filter((m) => m.fp === fingerprint).length : 0;
  if (byFp >= 1) return { blocked: true, reason: 'อุปกรณ์นี้เคยสมัครบัญชีทดลองใช้ไปแล้ว' };
  if (byIp >= 3) return { blocked: true, reason: 'เครือข่ายนี้สมัครบัญชีครบจำนวนที่กำหนดแล้ว' };
  return { blocked: false };
}

export async function markSignup(ip, fingerprint, email) {
  const list = (await redisGet('signup_marks') || []);
  list.push({ ip, fp: fingerprint || null, email, at: Date.now() });
  await redisSet('signup_marks', list.slice(-500));
}

// ---------- ระบบล็อกเว็บ (Gatekeeper) ----------
// โหมด: open = ใครก็สมัคร/เข้าได้, invite = เฉพาะคนที่อยู่ในรายชื่อ, closed = ปิดทั้งเว็บ (เจ้าของยังเข้าได้)
export async function getGate() {
  const g = (await redisGet('gate')) || {};
  return {
    mode: g.mode || 'invite',
    allowList: Array.isArray(g.allowList) ? g.allowList : [],
    inviteCodes: Array.isArray(g.inviteCodes) ? g.inviteCodes : [],
    closedMessage: g.closedMessage || 'ระบบปิดปรับปรุงชั่วคราว กรุณากลับมาใหม่ภายหลัง',
    maxAccounts: typeof g.maxAccounts === 'number' ? g.maxAccounts : 10,
  };
}

export async function saveGate(gate) {
  await redisSet('gate', gate);
}

// ตรวจว่าอีเมลนี้ได้รับอนุญาตให้สมัคร/เข้าใช้หรือไม่
export async function gateCheck(email, account, inviteCode) {
  const gate = await getGate();
  if (account && account.isOwner) return { allowed: true, gate };   // เจ้าของเข้าได้เสมอ
  if (gate.mode === 'open') return { allowed: true, gate };
  if (gate.mode === 'closed') return { allowed: false, reason: gate.closedMessage, gate };
  // invite mode
  const em = String(email || '').toLowerCase();
  if (gate.allowList.some((e) => String(e).toLowerCase() === em)) return { allowed: true, gate };
  if (inviteCode) {
    const hit = gate.inviteCodes.find((c) => c.code === String(inviteCode).trim().toUpperCase() && !c.usedBy);
    if (hit) return { allowed: true, gate, viaCode: hit.code };
  }
  return { allowed: false, reason: 'เว็บไซต์นี้เปิดให้เฉพาะผู้ที่ได้รับเชิญ — กรุณากรอกรหัสเชิญ หรือติดต่อผู้ดูแลระบบ', gate, needCode: true };
}

export async function consumeInviteCode(code, email) {
  const gate = await getGate();
  const next = gate.inviteCodes.map((c) => (c.code === String(code).toUpperCase() ? { ...c, usedBy: email, usedAt: Date.now() } : c));
  await saveGate({ ...gate, inviteCodes: next });
}

export function makeInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

// ---------- คำขอความช่วยเหลือ / ขอโทเค็นเพิ่ม ----------
export async function addTicket(entry) {
  const list = (await redisGet('tickets')) || [];
  list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), status: 'open', ...entry });
  await redisSet('tickets', list.slice(-200));
  return list[list.length - 1];
}
export async function listTickets() { return (await redisGet('tickets')) || []; }
export async function updateTicket(id, patch) {
  const list = (await redisGet('tickets')) || [];
  const next = list.map((t) => (t.id === id ? { ...t, ...patch } : t));
  await redisSet('tickets', next);
  return next;
}

// ---------- ระบบเปิด/ปิดฟีเจอร์รายตัว (เจ้าของระบบคุมได้) ----------
export const FEATURE_DEFS = {
  pages: {
    calendar:  { label: 'ปฏิทิน', def: true },
    directory: { label: 'Directory (แผนก)', def: false },
    platforms: { label: 'เชื่อมต่อแพลตฟอร์ม', def: false },
    analytics: { label: 'ศูนย์วิเคราะห์', def: true },
    kpi:       { label: 'KPI / รายเดือน', def: true },
    security:  { label: 'Protocol (ความปลอดภัย)', def: false },
    files:     { label: 'ไฟล์ & เชื่อมต่อ (Excel/Word)', def: true },
  },
  analyticsTabs: {
    stats:   { label: 'สถิติผลงาน', def: true },
    plan:    { label: 'แผน & กลยุทธ์', def: true },
    ads:     { label: 'ยิงแอด & ROAS', def: true },
    rival:   { label: 'ถอดสูตรคู่แข่ง', def: true },
    product: { label: 'วิเคราะห์สินค้า', def: true },
  },
  departments: {
    content:   { label: 'ฝ่ายคอนเทนต์', def: true },
    rnd:       { label: 'ฝ่ายวิจัย/วิเคราะห์', def: false },
    marketing: { label: 'ฝ่ายการตลาด', def: true },
    sales:     { label: 'ฝ่ายขาย', def: true },
    qc:        { label: 'ฝ่าย QC', def: false },
    hr:        { label: 'ฝ่ายบุคคล', def: false },
    finance:   { label: 'ฝ่ายการเงิน', def: false },
  },
};

function defaultFeatures() {
  const out = {};
  for (const group of Object.keys(FEATURE_DEFS)) {
    out[group] = {};
    for (const [k, v] of Object.entries(FEATURE_DEFS[group])) out[group][k] = v.def;
  }
  return out;
}

export async function getFeatures() {
  const saved = (await redisGet('features')) || {};
  const base = defaultFeatures();
  for (const group of Object.keys(base)) {
    if (saved[group]) base[group] = { ...base[group], ...saved[group] };
  }
  return base;
}

export async function saveFeatures(next) {
  await redisSet('features', next);
}

// ---------- ติดตามสถานะผู้ใช้แบบเรียลไทม์ ----------
export async function touchPresence(email, page, note) {
  try {
    const p = (await redisGet('presence')) || {};
    p[email] = { at: Date.now(), page: page || null, note: note || null };
    // ล้างคนที่หายไปเกิน 1 วัน
    const cutoff = Date.now() - 24 * 3600 * 1000;
    for (const k of Object.keys(p)) if (p[k].at < cutoff) delete p[k];
    await redisSet('presence', p);
  } catch (e) {}
}
export async function getPresence() { return (await redisGet('presence')) || {}; }

// บันทึกสิ่งที่ผู้ใช้ทำ (feed แบบละเอียด ให้เจ้าของดูย้อนหลังได้)
export async function pushFeed(entry) {
  try {
    const f = (await redisGet('activity_feed')) || [];
    f.push({ ...entry, at: Date.now() });
    await redisSet('activity_feed', f.slice(-500));
  } catch (e) {}
}
export async function getFeed() { return (await redisGet('activity_feed')) || []; }

// ---------- ระบบองค์กร (Multi-tenant) ----------
// ลูกค้าแต่ละองค์กรใช้ข้อมูลร่วมกันภายในองค์กร แต่มองข้ามองค์กรไม่ได้เด็ดขาด
export const ROLES = {
  staff:   { label: 'ผู้ใช้/พนักงาน',        level: 1 },
  manager: { label: 'หัวหน้า/ผู้จัดการแผนก', level: 2 },
  exec:    { label: 'ผู้บริหาร/CEO',          level: 3 },
  dev:     { label: 'ผู้พัฒนาระบบ',           level: 9 },
};

export function roleOf(account) {
  if (!account) return 'staff';
  if (account.isDeveloper) return 'dev';
  return ROLES[account.role] ? account.role : (account.isOwner ? 'exec' : 'staff');
}
export function roleLevel(account) { return ROLES[roleOf(account)].level; }
export const isDev = (a) => roleOf(a) === 'dev';
export const isExec = (a) => roleLevel(a) >= 3;
export const isManager = (a) => roleLevel(a) >= 2;

export function orgIdOf(account) {
  return account?.orgId || `org_${String(account?.email || '').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

export async function getOrgs() { return (await redisGet('orgs')) || []; }
export async function saveOrgs(list) { await redisSet('orgs', list); }

export async function getOrg(orgId) {
  const list = await getOrgs();
  return list.find((o) => o.id === orgId) || null;
}

export async function upsertOrg(org) {
  const list = await getOrgs();
  const idx = list.findIndex((o) => o.id === org.id);
  if (idx === -1) list.push(org); else list[idx] = { ...list[idx], ...org };
  await saveOrgs(list);
  return list.find((o) => o.id === org.id);
}

// รหัสเข้าร่วมองค์กร — พนักงานใหม่ใช้รหัสนี้เพื่อเข้าองค์กรที่ถูกต้อง
export function makeOrgCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
