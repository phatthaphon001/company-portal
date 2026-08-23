import { Resend } from 'resend';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.OTP_SECRET) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า RESEND_API_KEY หรือ OTP_SECRET ใน Vercel' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const SECRET = process.env.OTP_SECRET;

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'ต้องระบุอีเมล' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  const payload = `${email}:${code}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64');

  try {
    await resend.emails.send({
      from: 'Access Terminal <onboarding@resend.dev>',
      to: email,
      subject: 'รหัสยืนยันตัวตนของคุณ',
      html: `<div style="font-family:sans-serif">
        <p>รหัสยืนยันตัวตนของคุณคือ:</p>
        <p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p>
        <p>รหัสนี้จะหมดอายุใน 5 นาที</p>
      </div>`,
    });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'ส่งอีเมลไม่สำเร็จ ลองใหม่อีกครั้ง: ' + (err?.message || '') });
  }
}
