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
  const { password, passwordHash, passwordSalt, ...rest } = a;
  return rest;
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
