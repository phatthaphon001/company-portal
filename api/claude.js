// หมายเหตุ: ไฟล์นี้ยังชื่อ claude.js เหมือนเดิม (ไม่ต้องสร้างไฟล์ใหม่)
// แต่เปลี่ยนไปเรียก Gemini API ของ Google แทน เพราะมีแพ็กฟรีจริง ไม่ต้องผูกบัตร
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Vercel' });
  }

  const { system, content, images } = req.body || {};
  if (!content) {
    return res.status(400).json({ error: 'ต้องระบุ content' });
  }

  // images (ถ้ามี) = [{ mimeType: 'image/jpeg', data: 'base64...' }, ...] ให้ AI ดูรูปประกอบการวิเคราะห์
  const imageParts = Array.isArray(images)
    ? images.filter((im) => im && im.data).map((im) => ({ inline_data: { mime_type: im.mimeType || 'image/jpeg', data: im.data } }))
    : [];

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: system ? { parts: [{ text: system }] } : undefined,
          contents: [{ role: 'user', parts: [{ text: content }, ...imageParts] }],
        }),
      }
    );
    const data = await response.json();
    if (!response.ok || data?.error) {
      return res.status(500).json({ error: data?.error?.message || 'เรียก Gemini ไม่สำเร็จ' });
    }
    const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('\n');
    return res.status(200).json({ text: text || '(ไม่มีคำตอบ)' });
  } catch (err) {
    return res.status(500).json({ error: 'เชื่อมต่อ Gemini API ไม่สำเร็จ' });
  }
}
