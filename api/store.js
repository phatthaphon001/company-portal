const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const ALLOWED_KEYS = ['channels', 'tasks', 'history', 'lastActiveDate'];

export default async function handler(req, res) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า Upstash ใน Vercel ก่อน)' });
  }

  if (req.method === 'GET') {
    const key = req.query.key;
    if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    try {
      const r = await fetch(`${REDIS_URL}/get/${key}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
      const data = await r.json();
      return res.status(200).json({ value: data.result ? JSON.parse(data.result) : null });
    } catch (err) {
      return res.status(500).json({ error: 'อ่านข้อมูลไม่สำเร็จ' });
    }
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    try {
      await fetch(`${REDIS_URL}/set/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
        body: JSON.stringify(value),
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
