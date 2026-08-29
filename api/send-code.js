import { Resend } from 'resend';
import crypto from 'crypto';
import { redisGet, rateLimit, createOtp } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.RESEND_API_KEY || !process.env.OTP_SECRET) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า RESEND_API_KEY หรือ OTP_SECRET ใน Vercel' });
  }

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'ต้องระบุอีเมล' });

  // 1) จำกัดจำนวนครั้งก่อนเสมอ — ทำก่อนแตะฐานข้อมูล เพื่อไม่ให้ใช้ endpoint นี้ยิงถามว่าอีเมลไหนมีบัญชี
  const perEmail = await rateLimit(`otp_${email}`, 5, 60 * 60 * 1000);
  if (!perEmail.allowed) {
    return res.status(429).json({ error: `ขอรหัสถี่เกินไป ลองใหม่ใน ${Math.ceil(perEmail.retrySec / 60)} นาที` });
  }
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const perIp = await rateLimit(`otpip_${ip}`, 20, 60 * 60 * 1000);
  if (!perIp.allowed) {
    return res.status(429).json({ error: `ขอรหัสถี่เกินไป ลองใหม่ใน ${Math.ceil(perIp.retrySec / 60)} นาที` });
  }

  // 2) ส่งจริงเฉพาะอีเมลที่มีบัญชี — กันเอาเว็บเราไปยิงอีเมลชาวบ้าน
  let exists = false;
  try {
    const accounts = (await redisGet('accounts')) || [];
    exists = accounts.some((a) => a.email === email);
  } catch (e) {
    return res.status(500).json({ error: 'ตรวจสอบบัญชีไม่สำเร็จ' });
  }

  // 3) ถ้าไม่มีบัญชี ตอบหน้าตาเหมือนกันทุกประการ พร้อม ref ปลอมที่ใช้ยืนยันไม่ได้
  //    เพื่อไม่ให้คนนอกไล่เดาว่าอีเมลไหนมีบัญชีอยู่ในระบบ
  if (!exists) {
    const fakeRef = crypto.randomBytes(24).toString('hex');
    return res.status(200).json({ ref: fakeRef, sent: true });
  }

  // 4) สร้างรหัสและเก็บไว้ที่เซิร์ฟเวอร์ — ตัวรหัสไม่เคยถูกส่งกลับไปที่เบราว์เซอร์
  const { ref, code } = await createOtp(email);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Access Terminal <onboarding@resend.dev>',
      to: email,
      subject: 'รหัสยืนยันตัวตนของคุณ',
      html: `<div style="font-family:sans-serif">
        <p>รหัสยืนยันตัวตนของคุณคือ:</p>
        <p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p>
        <p>รหัสนี้จะหมดอายุใน 5 นาที และใช้ได้ครั้งเดียว</p>
        <p style="color:#888;font-size:12px">ถ้าคุณไม่ได้เป็นคนขอรหัสนี้ ให้เพิกเฉยได้เลย และควรเปลี่ยนรหัสผ่านของคุณ</p>
      </div>`,
    });
    return res.status(200).json({ ref, sent: true });
  } catch (err) {
    return res.status(500).json({ error: 'ส่งอีเมลไม่สำเร็จ ลองใหม่อีกครั้ง: ' + (err?.message || '') });
  }
}
