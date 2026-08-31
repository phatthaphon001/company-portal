import {
  requireUser, isBanned, clientIp, rateLimit,
  canvaFetch, getCanvaTokens, deleteCanvaTokens, revokeCanvaToken,
} from '../_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = clientIp(req);
  try { if (await isBanned(ip)) return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ' }); } catch (e) {}

  const session = await requireUser(req);
  if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
  const me = session.account;

  const { action } = req.body || {};

  // ---- เช็คว่าเชื่อมต่ออยู่ไหม — ยิงจริงไปที่ Canva ไม่ใช่แค่เช็คว่ามีบันทึกไว้ในเว็บเรา ----
  if (action === 'status') {
    const t = await getCanvaTokens(me.email);
    if (!t) return res.status(200).json({ connected: false });
    const r = await canvaFetch(me.email, '/users/me/profile');
    if (!r.ok) return res.status(200).json({ connected: false, expired: true });
    return res.status(200).json({ connected: true, displayName: r.data?.display_name || null, connectedAt: t.connectedAt || null });
  }

  // ---- ตัดการเชื่อมต่อ — เพิกถอนสิทธิ์ที่ฝั่ง Canva ด้วย ไม่ใช่แค่ลบในเว็บเรา ----
  if (action === 'disconnect') {
    const t = await getCanvaTokens(me.email);
    if (t?.accessToken) await revokeCanvaToken(t.accessToken);
    await deleteCanvaTokens(me.email);
    return res.status(200).json({ ok: true });
  }

  // ---- รายชื่อเทมเพลตแบรนด์ (ใช้อ้างอิงตอน AI คิดคอนเทนต์) ----
  if (action === 'listBrandTemplates') {
    const r = await canvaFetch(me.email, '/brand-templates?limit=50');
    // หมายเหตุ: ถ้า Canva token ไม่มีหรือหมดอายุ canvaFetch คืน status 401
    // ต้องไม่ส่ง 401 ออกไปให้หน้าเว็บ เพราะหน้าเว็บจะเข้าใจผิดว่า session ของผู้ใช้หมด แล้ว logout ทันที
    // ใช้ 200 (connected: false) หรือ 503 แทน เพื่อบอกว่า Canva ยังไม่ได้เชื่อมต่อ/หมดอายุ
    if (!r.ok) {
      const safeStatus = r.status === 401 ? 503 : (r.status || 500);
      return res.status(safeStatus).json({ error: r.data?.error?.message || 'ดึงเทมเพลตแบรนด์ไม่สำเร็จ — อาจยังไม่ได้เชื่อมต่อ Canva หรือ token หมดอายุ' });
    }
    return res.status(200).json({ items: r.data?.items || [] });
  }

  // ---- รายชื่องานออกแบบล่าสุดของผู้ใช้ (สำหรับดึงกลับเข้าเว็บ) ----
  if (action === 'listDesigns') {
    const r = await canvaFetch(me.email, '/designs?ownership=owned&sort_by=modified_descending&limit=30');
    if (!r.ok) {
      const safeStatus = r.status === 401 ? 503 : (r.status || 500);
      return res.status(safeStatus).json({ error: r.data?.error?.message || 'ดึงรายการงานออกแบบไม่สำเร็จ' });
    }
    return res.status(200).json({ items: r.data?.items || [] });
  }

  // ---- ส่งรูปเข้าคลัง Canva ----
  if (action === 'uploadAsset') {
    const rl = await rateLimit(`canvaupload_${me.email}`, 20, 5 * 60 * 1000);
    if (!rl.allowed) return res.status(429).json({ error: `อัปโหลดถี่เกินไป ลองใหม่ใน ${rl.retrySec} วินาที` });
    const { base64, name } = req.body || {};
    if (!base64 || !name) return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
    let buf;
    try { buf = Buffer.from(base64, 'base64'); } catch (e) { return res.status(400).json({ error: 'ไฟล์เสีย' }); }
    if (buf.length === 0) return res.status(400).json({ error: 'ไฟล์เสีย' });
    if (buf.length > 30 * 1024 * 1024) return res.status(400).json({ error: 'ไฟล์ใหญ่เกิน 30MB' });
    const nameB64 = Buffer.from(String(name).slice(0, 200)).toString('base64');
    const r = await canvaFetch(me.email, '/asset-uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream', 'Asset-Upload-Metadata': JSON.stringify({ name_base64: nameB64 }) },
      body: buf,
    });
    if (!r.ok) { const s = r.status === 401 ? 503 : (r.status || 500); return res.status(s).json({ error: r.data?.error?.message || 'ส่งเข้า Canva ไม่สำเร็จ' }); }
    return res.status(200).json({ job: r.data?.job });
  }

  // ---- เช็คสถานะงานอัปโหลด (asynchronous job — ต้อง poll) ----
  if (action === 'getUploadJob') {
    const { jobId } = req.body || {};
    if (!jobId) return res.status(400).json({ error: 'ต้องระบุ jobId' });
    const r = await canvaFetch(me.email, `/asset-uploads/${encodeURIComponent(jobId)}`);
    if (!r.ok) { const s = r.status === 401 ? 503 : (r.status || 500); return res.status(s).json({ error: r.data?.error?.message || 'ตรวจสถานะไม่สำเร็จ' }); }
    return res.status(200).json({ job: r.data?.job });
  }

  // ---- สร้างงานส่งออกไฟล์จาก Canva (asynchronous job) ----
  if (action === 'exportDesign') {
    const rl = await rateLimit(`canvaexport_${me.email}`, 20, 5 * 60 * 1000);
    if (!rl.allowed) return res.status(429).json({ error: `ส่งออกถี่เกินไป ลองใหม่ใน ${rl.retrySec} วินาที` });
    const { designId, format } = req.body || {};
    if (!designId) return res.status(400).json({ error: 'ต้องระบุ designId' });
    const fmt = ['png', 'jpg', 'pdf'].includes(format) ? format : 'png';
    const r = await canvaFetch(me.email, '/exports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ design_id: designId, format: { type: fmt } }),
    });
    if (!r.ok) { const s = r.status === 401 ? 503 : (r.status || 500); return res.status(s).json({ error: r.data?.error?.message || 'สร้างงานส่งออกไม่สำเร็จ' }); }
    return res.status(200).json({ job: r.data?.job });
  }

  // ---- เช็คสถานะงานส่งออก ----
  if (action === 'getExportJob') {
    const { jobId } = req.body || {};
    if (!jobId) return res.status(400).json({ error: 'ต้องระบุ jobId' });
    const r = await canvaFetch(me.email, `/exports/${encodeURIComponent(jobId)}`);
    if (!r.ok) { const s = r.status === 401 ? 503 : (r.status || 500); return res.status(s).json({ error: r.data?.error?.message || 'ตรวจสถานะไม่สำเร็จ' }); }
    return res.status(200).json({ job: r.data?.job });
  }

  return res.status(400).json({ error: 'action ไม่ถูกต้อง' });
}
