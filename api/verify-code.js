import { consumeOtp, rateLimit } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.OTP_SECRET) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า OTP_SECRET' });
  }

  const { ref, token, code } = req.body || {};
  const otpRef = ref || token; // รองรับชื่อเดิมจากหน้าเว็บรุ่นก่อน
  if (!otpRef || !code) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
  }

  // กันการไล่เดารหัส 6 หลักด้วยการยิงรัว
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const rl = await rateLimit(`otpverify_${ip}`, 20, 15 * 60 * 1000);
  if (!rl.allowed) {
    return res.status(429).json({ error: `ยืนยันรหัสถี่เกินไป ลองใหม่ใน ${rl.retrySec} วินาที` });
  }

  // ตรวจกับรหัสที่เก็บไว้ฝั่งเซิร์ฟเวอร์เท่านั้น
  // หมายเหตุ: endpoint นี้ยืนยันอย่างเดียว ไม่ออกโทเค็นเข้าสู่ระบบให้
  // การเข้าสู่ระบบด้วย OTP ต้องผ่าน /api/auth action completeOtpLogin เท่านั้น
  const r = await consumeOtp(otpRef, code);
  if (!r.ok) {
    return res.status(400).json({ error: r.reason });
  }
  return res.status(200).json({ verified: true, email: r.email });
}
