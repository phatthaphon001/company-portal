import { redisReady, redisGet, redisSet, requireUser, isBanned, clientIp, autoBackup, logActivity } from './_lib.js';

// ข้อมูลส่วนตัวของแต่ละคน — เก็บแยกตามอีเมล ห้ามปนกันเด็ดขาด
const USER_KEYS = ['channels', 'tasks', 'history', 'lastActiveDate', 'futureTasks', 'templates', 'trash', 'metrics', 'plans', 'rivals', 'ads', 'deptRecords', 'dayNotes'];

// สร้างชื่อคีย์เฉพาะของผู้ใช้คนนั้น
function scopedKey(key, email) {
  return `u:${String(email).toLowerCase()}:${key}`;
}

export default async function handler(req, res) {
  if (!redisReady()) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า Upstash ใน Vercel ก่อน)' });
  }

  const ip = clientIp(req);
  try {
    if (await isBanned(ip)) return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ', banned: true });
  } catch (e) {}

  const session = await requireUser(req);
  if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
  const me = session.account;
  const email = me.email;

  if (req.method === 'GET') {
    const key = req.query.key;
    if (!USER_KEYS.includes(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    try {
      let value = await redisGet(scopedKey(key, email));

      // ---- ย้ายข้อมูลเดิม (สมัยยังใช้คนเดียว) เข้าบัญชีเจ้าของระบบครั้งเดียว ----
      if (value == null && me.isOwner) {
        const legacy = await redisGet(key);
        if (legacy != null) {
          await redisSet(scopedKey(key, email), legacy);
          await logActivity({ type: 'data_migrated', key, email });
          value = legacy;
        }
      }
      return res.status(200).json({ value });
    } catch (err) {
      return res.status(500).json({ error: 'อ่านข้อมูลไม่สำเร็จ' });
    }
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!USER_KEYS.includes(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    if (me.clearance < 2) return res.status(403).json({ error: 'สิทธิ์ของคุณแก้ไขข้อมูลนี้ไม่ได้' });
    try {
      if (key === 'channels' || key === 'tasks') {
        autoBackup(new Date().toISOString().slice(0, 10), email).catch(() => {});
      }
      await redisSet(scopedKey(key, email), value);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
