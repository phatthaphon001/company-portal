import { Resend } from 'resend';
import crypto from 'crypto';
import { redisGet, rateLimit } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.RESEND_API_KEY || !process.env.OTP_SECRET) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า RESEND_API_KEY หรือ OTP_SECRET ใน Vercel' });
  }

  const SECRET = process.env.OTP_SECRET;
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'ต้องระบุอีเมล' });

  // 1) ส่งได้เฉพาะอีเมลที่มีบัญชีจริงในระบบ — กันคนเอาเว็บเราไปยิงอีเมลชาวบ้าน
  try {
    const accounts = (await redisGet('accounts')) || [];
    if (!accounts.some((a) => a.email === email)) {
      // ตอบเหมือนสำเร็จ เพื่อไม่ให้คนนอกใช้ทดสอบว่าอีเมลไหนมีบัญชีอยู่
      return res.status(200).json({ token: '', sent: false });
    }
  } catch (e) {
    return res.status(500).json({ error: 'ตรวจสอบบัญชีไม่สำเร็จ' });
  }

  // 2) จำกัดจำนวนครั้ง — ต่ออีเมล และต่อ IP
  const perEmail = await rateLimit(`otp_${email}`, 5, 60 * 60 * 1000);
  if (!perEmail.allowed) {
    return res.status(429).json({ error: `ขอรหัสถี่เกินไป ลองใหม่ใน ${Math.ceil(perEmail.retrySec / 60)} นาที` });
  }
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const perIp = await rateLimit(`otpip_${ip}`, 20, 60 * 60 * 1000);
  if (!perIp.allowed) {
    return res.status(429).json({ error: `ขอรหัสถี่เกินไป ลองใหม่ใน ${Math.ceil(perIp.retrySec / 60)} นาที` });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const code = crypto.randomInt(100000, 1000000).toString(); // สุ่มแบบเข้ารหัส เดายากกว่า Math.random
  const expiresAt = Date.now() + 5 * 60 * 1000;
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
        <p style="color:#888;font-size:12px">ถ้าคุณไม่ได้เป็นคนขอรหัสนี้ ให้เพิกเฉยได้เลย และควรเปลี่ยนรหัสผ่านของคุณ</p>
      </div>`,
    });
    return res.status(200).json({ token, sent: true });
  } catch (err) {
    return res.status(500).json({ error: 'ส่งอีเมลไม่สำเร็จ ลองใหม่อีกครั้ง: ' + (err?.message || '') });
  }
}
