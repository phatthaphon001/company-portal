import { redisReady, redisGet, redisSet, requireUser, isBanned, clientIp, logActivity, autoBackup } from './_lib.js';

const ALLOWED_KEYS = ['channels', 'tasks', 'history', 'lastActiveDate', 'futureTasks', 'templates', 'trash', 'metrics', 'plans', 'rivals', 'ads'];

export default async function handler(req, res) {
  if (!redisReady()) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า Upstash ใน Vercel ก่อน)' });
  }

  const ip = clientIp(req);
  try {
    if (await isBanned(ip)) return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ', banned: true });
  } catch (e) {}

  // ทุกคำสั่งต้องมีโทเค็นที่เซิร์ฟเวอร์ออกให้เท่านั้น — ยิงตรงจากภายนอกไม่ได้อีกต่อไป
  const session = await requireUser(req);
  if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });

  if (req.method === 'GET') {
    const key = req.query.key;
    if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    try {
      return res.status(200).json({ value: await redisGet(key) });
    } catch (err) {
      return res.status(500).json({ error: 'อ่านข้อมูลไม่สำเร็จ' });
    }
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    // ระดับ 1 ดูได้อย่างเดียว แก้ข้อมูลส่วนกลางไม่ได้
    if (session.account.clearance < 2) return res.status(403).json({ error: 'สิทธิ์ของคุณแก้ไขข้อมูลนี้ไม่ได้' });
    try {
      // สำรองข้อมูลอัตโนมัติวันละครั้ง ก่อนเขียนทับข้อมูลหลัก
      if (key === 'channels' || key === 'tasks') {
        autoBackup(new Date().toISOString().slice(0, 10)).catch(() => {});
      }
      await redisSet(key, value);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
