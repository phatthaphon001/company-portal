import { requireUser, isBanned, clientIp, spendTokens, tokenState, reserveAiSlot, TOKEN_COST, pushFeed, touchPresence } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = clientIp(req);
  try { if (await isBanned(ip)) return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ', banned: true }); } catch (e) {}

  const session = await requireUser(req);
  if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
  const me = session.account;

  const { system, content, images, action } = req.body || {};
  if (!content) return res.status(400).json({ error: 'ต้องระบุ content' });

  // ---- คีย์ของผู้ใช้เองมาก่อนเสมอ ถ้าไม่มีค่อยใช้คีย์กลางของระบบ ----
  const userKey = (me.geminiKey || '').trim();
  const centralKey = process.env.GEMINI_API_KEY;
  const usingCentral = !userKey;
  const apiKey = userKey || centralKey;
  if (!apiKey) {
    return res.status(400).json({ error: 'ยังไม่ได้ตั้งค่าคีย์ Gemini — ไปที่หน้า Setting เพื่อใส่คีย์ของคุณ (ฟรี ใช้เวลา 2 นาที)', needKey: true });
  }

  // ---- ใช้คีย์กลาง = ต้องหักโทเค็น + เข้าคิวรวม ----
  const act = action || 'other';
  const cost = TOKEN_COST[act] || 1;
  if (usingCentral) {
    const st = tokenState(me);
    if (!st.unlimited && st.left < cost) {
      return res.status(402).json({
        error: `โทเค็นไม่พอ (เหลือ ${st.left} ต้องใช้ ${cost}) — ใส่คีย์ Gemini ของคุณเองในหน้า Setting เพื่อใช้ได้ไม่จำกัด หรืออัปเกรดแพ็กเกจ`,
        outOfTokens: true, left: st.left, needed: cost,
      });
    }
    const slot = await reserveAiSlot(4);
    if (!slot.ok) {
      return res.status(429).json({
        error: `ตอนนี้มีคนใช้ AI พร้อมกันหลายคน กรุณารออีก ${slot.waitSec} วินาที — หรือใส่คีย์ Gemini ของคุณเองเพื่อไม่ต้องรอคิวใคร`,
        rateLimited: true, waitSec: slot.waitSec,
      });
    }
  }

  const imageParts = Array.isArray(images)
    ? images.filter((im) => im && im.data).map((im) => ({ inline_data: { mime_type: im.mimeType || 'image/jpeg', data: im.data } }))
    : [];

  function parseRetrySeconds(data) {
    try {
      for (const d of (data?.error?.details || [])) {
        if (d?.retryDelay) { const n = parseFloat(String(d.retryDelay).replace('s', '')); if (!Number.isNaN(n)) return n; }
      }
      const m = String(data?.error?.message || '').match(/retry in ([\d.]+)s/i);
      if (m) return parseFloat(m[1]);
    } catch (e) {}
    return null;
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  try {
    let response; let data;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          system_instruction: system ? { parts: [{ text: system }] } : undefined,
          contents: [{ role: 'user', parts: [{ text: content }, ...imageParts] }],
        }),
      });
      data = await response.json();
      const rateLimited = response.status === 429 || /quota|rate limit/i.test(data?.error?.message || '');
      if (!rateLimited) break;
      if (attempt === 2) {
        const wait = parseRetrySeconds(data);
        return res.status(429).json({
          error: usingCentral
            ? `ระบบใช้ AI ถี่เกินไป${wait ? ` รออีก ${Math.ceil(wait)} วินาที` : ''} — ใส่คีย์ Gemini ของคุณเองในหน้า Setting จะไม่ต้องแย่งคิวกับใคร`
            : `คีย์ของคุณใช้ถี่เกินไป (แพ็กฟรีจำกัด 5 ครั้ง/นาที)${wait ? ` รออีก ${Math.ceil(wait)} วินาที` : ''}`,
          rateLimited: true,
        });
      }
      const w = parseRetrySeconds(data);
      await sleep(w ? Math.min(w + 1, 35) * 1000 : (attempt + 1) * 7000);
    }

    if (!response.ok || data?.error) {
      const msg = data?.error?.message || 'เรียก Gemini ไม่สำเร็จ';
      if (!usingCentral && /API key not valid|API_KEY_INVALID|invalid/i.test(msg)) {
        return res.status(400).json({ error: 'คีย์ Gemini ของคุณใช้ไม่ได้ — ตรวจสอบอีกครั้งในหน้า Setting', badKey: true });
      }
      return res.status(500).json({ error: msg });
    }

    const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('\n');

    // บันทึกว่าผู้ใช้ทำอะไร ให้เจ้าของระบบดูย้อนหลังได้
    const ACT_LABEL = { outline: 'ให้ AI คิดโครงเรื่อง', prompts: 'สร้าง Prompt', meta: 'สร้างชื่อ/แคปชั่น', review: 'สรุปผลตรวจคลิป', metricRead: 'อ่านตัวเลขจากภาพสถิติ', deepAnalysis: 'วิเคราะห์เชิงลึก', teamAnalysis: 'วิเคราะห์ทีม', postTimeAdvice: 'วิเคราะห์เวลาโพสต์', planAhead: 'วางแผนล่วงหน้า', plan: 'วางแผนกลยุทธ์', rival: 'ถอดสูตรคู่แข่ง', productFit: 'วิเคราะห์สินค้า', other: 'ใช้ AI' };
    pushFeed({ email: me.email, what: ACT_LABEL[act] || act, action: act, cost: usingCentral ? cost : 0 }).catch(() => {});
    touchPresence(me.email, null, ACT_LABEL[act]).catch(() => {});

    // สำเร็จแล้วค่อยหักโทเค็น (ล้มเหลวไม่หัก)
    let tokensLeft = null;
    if (usingCentral) {
      const spent = await spendTokens(me.email, act, cost);
      tokensLeft = spent.unlimited ? -1 : spent.left;
    }

    return res.status(200).json({ text: text || '(ไม่มีคำตอบ)', tokensLeft, usedOwnKey: !usingCentral, cost: usingCentral ? cost : 0 });
  } catch (err) {
    return res.status(500).json({ error: 'เชื่อมต่อ Gemini API ไม่สำเร็จ' });
  }
}
