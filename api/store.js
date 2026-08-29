import { redisReady, redisGet, redisSet, requireUser, isBanned, clientIp, autoBackup, logActivity, orgIdOf, roleLevel, isDev } from './_lib.js';

// ข้อมูลที่ทั้งองค์กรใช้ร่วมกัน
const ORG_KEYS = ['channels', 'tasks', 'history', 'lastActiveDate', 'futureTasks', 'templates', 'trash', 'metrics', 'plans', 'rivals', 'ads', 'deptData', 'company', 'calendarNotes'];
// ข้อมูลส่วนตัวของแต่ละคน — เพื่อนร่วมองค์กรก็ห้ามเห็น (เช่น การเงินส่วนบุคคล)
const PRIVATE_KEYS = ['myFinance', 'myNotes'];

const orgKey = (key, orgId) => `o:${orgId}:${key}`;
const userKey = (key, email) => `u:${String(email).toLowerCase()}:${key}`;

export default async function handler(req, res) {
  if (!redisReady()) {
    return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า Upstash ใน Vercel ก่อน)' });
  }

  const ip = clientIp(req);
  try {
    if (await isBanned(ip)) return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ', banned: true });
  } catch (e) {}

  const session = await requireUser(req);
  if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
  const me = session.account;
  const orgId = orgIdOf(me);

  // ผู้พัฒนาสามารถระบุ orgId เพื่อดูข้อมูลขององค์กรลูกค้าได้ (สำหรับช่วยแก้ปัญหา)
  const targetOrg = (isDev(me) && (req.query.orgId || req.body?.orgId)) ? String(req.query.orgId || req.body.orgId) : orgId;

  function resolveKey(key) {
    if (PRIVATE_KEYS.includes(key)) return userKey(key, me.email);
    return orgKey(key, targetOrg);
  }
  const allowed = (key) => ORG_KEYS.includes(key) || PRIVATE_KEYS.includes(key);

  if (req.method === 'GET') {
    const key = req.query.key;
    if (!allowed(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    try {
      let value = await redisGet(resolveKey(key));

      // ---- ย้ายข้อมูลเดิมเข้าองค์กรครั้งเดียว (ของเจ้าขององค์กรเท่านั้น) ----
      if (value == null && !PRIVATE_KEYS.includes(key) && targetOrg === orgId && me.isOwner) {
        const legacyUser = await redisGet(userKey(key, me.email));
        const legacy = legacyUser != null ? legacyUser : await redisGet(key);
        if (legacy != null) {
          await redisSet(orgKey(key, orgId), legacy);
          await logActivity({ type: 'data_migrated_to_org', key, orgId, email: me.email });
          value = legacy;
        }
      }
      return res.status(200).json({ value });
    } catch (err) {
      return res.status(500).json({ error: 'อ่านข้อมูลไม่สำเร็จ' });
    }
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!allowed(key)) return res.status(400).json({ error: 'key ไม่ถูกต้อง' });
    // พนักงานทั่วไปแก้ข้อมูลส่วนตัวได้ แต่ข้อมูลกลางขององค์กรต้องระดับหัวหน้าขึ้นไป
    // ยกเว้น calendarNotes — โน้ตธุระรายวัน พนักงานทุกคนต้องจดของตัวเองได้ ไม่งั้นระบบวางแผนล่วงหน้าจะไม่มีข้อมูล
    if (!PRIVATE_KEYS.includes(key) && key !== 'calendarNotes' && roleLevel(me) < 2 && me.clearance < 2) {
      return res.status(403).json({ error: 'สิทธิ์ของคุณแก้ไขข้อมูลส่วนกลางไม่ได้' });
    }
    try {
      if (key === 'channels' || key === 'tasks') {
        autoBackup(new Date().toISOString().slice(0, 10), targetOrg).catch(() => {});
      }
      await redisSet(resolveKey(key), value);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
