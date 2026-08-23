import crypto from 'crypto';

const SECRET = process.env.OTP_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!SECRET) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า OTP_SECRET' });
  }

  const { token, code } = req.body || {};
  if (!token || !code) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    const signature = parts.pop();
    const expiresAt = parts.pop();
    const storedCode = parts.pop();
    const email = parts.join(':');
    const payload = `${email}:${storedCode}:${expiresAt}`;
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

    const validSignature =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

    if (!validSignature) {
      return res.status(400).json({ error: 'โทเค็นไม่ถูกต้อง' });
    }
    if (Date.now() > Number(expiresAt)) {
      return res.status(400).json({ error: 'รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่' });
    }
    if (code !== storedCode) {
      return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
    }

    return res.status(200).json({ verified: true, email });
  } catch (err) {
    return res.status(400).json({ error: 'โทเค็นไม่ถูกต้อง' });
  }
}
