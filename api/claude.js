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

  // ดึงเวลาที่ Google บอกให้รอ (วินาที) จากข้อความ error เช่น "Please retry in 32.25s"
  function parseRetrySeconds(data) {
    try {
      const details = data?.error?.details || [];
      for (const d of details) {
        if (d?.retryDelay) {
          const n = parseFloat(String(d.retryDelay).replace('s', ''));
          if (!Number.isNaN(n)) return n;
        }
      }
      const m = String(data?.error?.message || '').match(/retry in ([\d.]+)s/i);
      if (m) return parseFloat(m[1]);
    } catch (e) {}
    return null;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  try {
    let response;
    let data;
    // ลองใหม่อัตโนมัติเมื่อโดนจำกัดจำนวนครั้งต่อนาที (แพ็กฟรีจำกัด 5 ครั้ง/นาที)
    for (let attempt = 0; attempt < 4; attempt++) {
      response = await fetch(
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
      data = await response.json();

      const rateLimited = response.status === 429 || /quota|rate limit/i.test(data?.error?.message || '');
      if (!rateLimited) break;
      if (attempt === 3) {
        const wait = parseRetrySeconds(data);
        return res.status(429).json({
          error: `ใช้ AI ถี่เกินไป (แพ็กฟรีของ Gemini จำกัด 5 ครั้งต่อนาที)${wait ? ` — รออีกประมาณ ${Math.ceil(wait)} วินาทีแล้วลองใหม่` : ' — รอสักครู่แล้วลองใหม่'}`,
          rateLimited: true,
        });
      }
      const waitSec = parseRetrySeconds(data);
      // รอเท่าที่ Google บอก (บวกเผื่อ 1 วิ) หรือถอยหลังแบบเพิ่มเวลาขึ้นเรื่อยๆ
      await sleep(waitSec ? Math.min(waitSec + 1, 40) * 1000 : (attempt + 1) * 8000);
    }

    if (!response.ok || data?.error) {
      return res.status(500).json({ error: data?.error?.message || 'เรียก Gemini ไม่สำเร็จ' });
    }
    const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('\n');
    return res.status(200).json({ text: text || '(ไม่มีคำตอบ)' });
  } catch (err) {
    return res.status(500).json({ error: 'เชื่อมต่อ Gemini API ไม่สำเร็จ' });
  }
}
