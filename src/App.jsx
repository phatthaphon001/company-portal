import React, { useState, useEffect } from 'react';
import {
  Lock, Unlock, FileText, Radar, Megaphone, Landmark, UserCog, TrendingUp,
  LogOut, AlertTriangle, KeyRound, ScrollText, ClipboardCheck,
  Bot, ShoppingBag, PlayCircle, AtSign, Music2, Share2, ShieldAlert, Sparkles,
  CheckSquare, Square, Plus, Trash2, Loader2, RefreshCw, ChevronDown, ChevronUp,
  Calendar, Mail, UserPlus, ArrowLeft, Image as ImageIcon, Video as VideoIcon,
  CheckCircle2, XCircle, Users, Camera,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const C = {
  bg: '#0A0A0F', bgDeep: '#050506', panel: '#15161D', panelAlt: '#1B1C26',
  border: 'rgba(255,255,255,0.08)', text: '#F5F5F7', muted: '#9195A3',
  blue: '#3B82F6', cyan: '#22D3EE', violet: '#A78BFA', pink: '#F472B6',
  emerald: '#34D399', orange: '#FB923C', teal: '#2DD4BF', red: '#F87171',
};
const BRAND = `linear-gradient(135deg, ${C.blue}, ${C.violet})`;

const CLEARANCE = {
  1: { label: 'ระดับ 1 · ทั่วไป', code: 'LV-1 STAFF', color: C.cyan },
  2: { label: 'ระดับ 2 · หัวหน้างาน', code: 'LV-2 MANAGER', color: C.orange },
  3: { label: 'ระดับ 3 · ผู้บริหาร', code: 'LV-3 EXECUTIVE', color: C.red },
};

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: C.pink, icon: Music2 },
  facebook: { label: 'Facebook', color: C.blue, icon: Share2 },
  youtube: { label: 'YouTube', color: C.red, icon: PlayCircle },
  instagram: { label: 'Instagram', color: C.orange, icon: Camera },
  shopee: { label: 'Shopee', color: C.orange, icon: ShoppingBag },
  other: { label: 'อื่นๆ', color: C.teal, icon: AtSign },
};

const DEPARTMENTS = [
  {
    id: 'content', th: 'ฝ่ายคอนเทนต์', en: 'CONTENT OPS', clearance: 1,
    icon: FileText, accent: C.blue, manager: 'ผู้จัดการฝ่ายคอนเทนต์',
    brief: 'ผลิตและดูแลคอนเทนต์ทั้งหมดขององค์กร ตั้งแต่ไอเดียจนถึงเผยแพร่',
    roles: [
      { title: 'นักเขียนบท', en: 'Scriptwriter', duty: 'พัฒนาไอเดียและบทคอนเทนต์ก่อนเข้าสู่การผลิต' },
      { title: 'ตัดต่อวิดีโอ', en: 'Video Editor', duty: 'ตัดต่อ ปรับสี และมิกซ์เสียงให้พร้อมเผยแพร่' },
      { title: 'กราฟิกและโมชัน', en: 'Motion Designer', duty: 'ออกแบบภาพนิ่งและกราฟิกเคลื่อนไหวประกอบคอนเทนต์' },
      { title: 'ดูแลโซเชียลมีเดีย', en: 'Social Manager', duty: 'วางตารางโพสต์ ตอบคอมเมนต์ และติดตามยอดเข้าถึง' },
    ],
  },
  {
    id: 'rnd', th: 'ฝ่ายวิจัยและวิเคราะห์ข้อมูล', en: 'R&D / ANALYTICS', clearance: 2,
    icon: Radar, accent: C.cyan, hasChart: true, manager: 'ผู้จัดการฝ่ายวิจัยและวิเคราะห์ข้อมูล',
    brief: 'เก็บและวิเคราะห์ข้อมูลจากทุกแผนก สรุปผลเชิงลึกให้ผู้บริหารตัดสินใจ',
    roles: [
      { title: 'นักวิเคราะห์ข้อมูล', en: 'Data Analyst', duty: 'รวบรวมข้อมูลจากทุกแผนกมาประมวลผลเป็นรายงาน' },
      { title: 'นักวิจัยตลาด', en: 'Market Researcher', duty: 'ติดตามเทรนด์ คู่แข่ง และพฤติกรรมลูกค้า' },
      { title: 'หัวหน้าสรุปผล', en: 'Performance Lead', duty: 'สรุปภาพรวมผลการดำเนินงานประจำเดือน' },
    ],
  },
  {
    id: 'marketing', th: 'ฝ่ายการตลาด', en: 'MARKETING', clearance: 1,
    icon: Megaphone, accent: C.pink, manager: 'ผู้จัดการฝ่ายการตลาด',
    brief: 'วางแผนแคมเปญและสร้างการเติบโตให้แบรนด์',
    roles: [
      { title: 'นักการตลาดดิจิทัล', en: 'Digital Marketer', duty: 'บริหารแคมเปญโฆษณาบนแพลตฟอร์มออนไลน์' },
      { title: 'นักกลยุทธ์แบรนด์', en: 'Brand Strategist', duty: 'วางทิศทางและภาพลักษณ์แบรนด์ระยะยาว' },
      { title: 'ประสานงานพันธมิตร', en: 'Partnerships', duty: 'ดูแลความสัมพันธ์กับพันธมิตรและช่องทางจัดจำหน่าย' },
    ],
  },
  {
    id: 'sales', th: 'ฝ่ายขาย', en: 'SALES', clearance: 1,
    icon: TrendingUp, accent: C.emerald, manager: 'ผู้จัดการฝ่ายขาย',
    brief: 'ปิดการขายและดูแลความสัมพันธ์กับลูกค้า',
    roles: [
      { title: 'ฝ่ายขาย', en: 'Sales Executive', duty: 'ติดต่อและปิดการขายกับลูกค้าใหม่' },
      { title: 'ดูแลลูกค้าเดิม', en: 'Account Manager', duty: 'ดูแลความสัมพันธ์และต่อยอดกับลูกค้าเดิม' },
      { title: 'สนับสนุนการขาย', en: 'Sales Support', duty: 'จัดทำใบเสนอราคาและเอกสารประกอบการขาย' },
    ],
  },
  {
    id: 'qc', th: 'ฝ่ายตรวจสอบคุณภาพ', en: 'QC / AUDIT', clearance: 2,
    icon: ClipboardCheck, accent: C.violet, manager: 'ผู้จัดการฝ่าย QC',
    brief: 'ตรวจสอบความถูกต้องของงานจากทุกแผนกก่อนเผยแพร่หรือส่งมอบ',
    roles: [
      { title: 'ผู้ตรวจสอบคุณภาพ', en: 'QC Reviewer', duty: 'ตรวจสอบความถูกต้องของงานก่อนเผยแพร่หรือส่งมอบลูกค้า' },
      { title: 'ผู้ตรวจสอบมาตรฐาน', en: 'Compliance Checker', duty: 'ตรวจสอบว่าเนื้อหาถูกต้องตามมาตรฐานที่กำหนด' },
      { title: 'ผู้ประสานงานแก้ไข', en: 'Revision Coordinator', duty: 'ประสานงานให้แผนกที่เกี่ยวข้องแก้ไขจุดที่ตรวจพบ' },
    ],
  },
  {
    id: 'hr', th: 'ฝ่ายบุคคล', en: 'PERSONNEL', clearance: 2,
    icon: UserCog, accent: C.orange, manager: 'ผู้จัดการฝ่ายบุคคล',
    brief: 'ดูแลบุคลากรตั้งแต่สรรหาจนถึงสวัสดิการ',
    roles: [
      { title: 'บุคคล', en: 'HR Generalist', duty: 'ดูแลสวัสดิการ การจ้างงาน และเรื่องทั่วไปของพนักงาน' },
      { title: 'สรรหาบุคลากร', en: 'Recruiter', duty: 'สรรหาและคัดเลือกพนักงานใหม่' },
      { title: 'ธุรการ', en: 'Office Admin', duty: 'ดูแลงานเอกสารและการประสานงานภายใน' },
    ],
  },
  {
    id: 'finance', th: 'ฝ่ายการเงิน', en: 'FINANCE', clearance: 3,
    icon: Landmark, accent: C.teal, manager: 'ผู้จัดการฝ่ายการเงิน',
    brief: 'ควบคุมกระแสเงินสดและความถูกต้องทางบัญชี',
    roles: [
      { title: 'บัญชี', en: 'Bookkeeper', duty: 'บันทึกรายรับ-รายจ่ายและจัดทำงบการเงิน' },
      { title: 'นักวิเคราะห์การเงิน', en: 'Financial Analyst', duty: 'วิเคราะห์กระแสเงินสดและวางแผนงบประมาณ' },
      { title: 'ออกใบแจ้งหนี้', en: 'Billing', duty: 'จัดทำและติดตามใบแจ้งหนี้และใบเสร็จ' },
    ],
  },
];

const CHART_DATA = [
  { month: 'ม.ค.', output: 42 }, { month: 'ก.พ.', output: 55 },
  { month: 'มี.ค.', output: 61 }, { month: 'เม.ย.', output: 58 },
  { month: 'พ.ค.', output: 73 }, { month: 'มิ.ย.', output: 80 },
];

const SECURITY_PROTOCOL = [
  { title: 'เข้ารหัสรหัสผ่านเสมอ', body: 'ใช้ bcrypt หรือ argon2 แฮชรหัสผ่าน ห้ามเก็บเป็นข้อความล้วนเด็ดขาด' },
  { title: 'HTTPS/TLS ทุกหน้า', body: 'บังคับ HTTPS พร้อม HSTS ป้องกันการดักข้อมูลระหว่างทาง' },
  { title: 'บังคับสิทธิ์ที่ฝั่งเซิร์ฟเวอร์', body: 'RBAC ต้องตรวจสอบที่ backend ทุกครั้ง การซ่อนปุ่มฝั่ง UI อย่างเดียวไม่นับว่าปลอดภัย' },
  { title: 'เซสชันปลอดภัย', body: 'คุกกี้แบบ httpOnly, secure, sameSite และกำหนดเวลาหมดอายุที่เหมาะสม' },
  { title: 'ป้องกันช่องโหว่พื้นฐาน', body: 'ตรวจสอบ/กรอง input ทุกจุด ป้องกัน SQL Injection, XSS, CSRF' },
  { title: 'ลิงก์รีเซ็ตรหัสผ่านหมดอายุเร็ว', body: 'ลิงก์ "ลืมรหัสผ่าน" ควรใช้ได้ครั้งเดียวและหมดอายุใน 15-30 นาที' },
  { title: 'ยืนยันตัวตนสองชั้น (MFA)', body: 'บังคับใช้กับสิทธิ์ระดับสูง เช่น ผู้บริหารและฝ่ายการเงิน' },
  { title: 'บันทึก Audit Log', body: 'เก็บประวัติการเข้าถึงข้อมูลสำคัญ ตรวจสอบย้อนหลังได้' },
  { title: 'จำกัดอัตราการเรียกใช้งาน', body: 'Rate limiting ป้องกันการสุ่มรหัสผ่าน (brute-force)' },
  { title: 'API Key ต้องเก็บไว้หลังบ้านเท่านั้น', body: 'ห้ามฝัง API Key ไว้ในโค้ดฝั่งหน้าเว็บ เพราะใครก็ดูซอร์สแล้วขโมยไปใช้ได้' },
];

const PLATFORMS = [
  { name: 'Facebook', icon: Share2, note: 'สำหรับโพสต์และจัดการเพจธุรกิจ' },
  { name: 'TikTok', icon: Music2, note: 'สำหรับอัปโหลดคลิปและจัดการร้านค้า' },
  { name: 'Shopee', icon: ShoppingBag, note: 'สำหรับซิงค์สินค้าและออเดอร์' },
  { name: 'YouTube', icon: PlayCircle, note: 'สำหรับอัปโหลดและจัดการวิดีโอ' },
  { name: 'X (Twitter)', icon: AtSign, note: 'สำหรับโพสต์และติดตามการมีส่วนร่วม' },
];

const VIDEO_SYS = 'คุณคือฝ่ายคิดคอนเทนต์ในองค์กรผลิตคลิปวิดีโอสั้น เตรียมข้อมูลสำหรับโพสต์คลิปวิดีโอวันนี้ ตอบเป็นภาษาไทยเท่านั้น จัดเป็นหัวข้อตามนี้เป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้ ห้ามทักทาย:\nชื่อคลิป: ...\nคำบรรยาย: ... (ใส่อิโมจิและแฮชแท็กที่เกี่ยวข้อง)\nพรอมต์วิดีโอ: ...\nพรอมต์หน้าปกคลิป: ...';
const IMAGE_SYS = 'คุณคือฝ่ายคิดคอนเทนต์ เตรียมข้อมูลสำหรับโพสต์รูปภาพวันนี้ ตอบเป็นภาษาไทยเท่านั้น จัดเป็นหัวข้อตามนี้เป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้ ห้ามทักทาย:\nชื่อโพสต์: ...\nคำบรรยาย: ... (ใส่อิโมจิและแฮชแท็กที่เกี่ยวข้อง)\nพรอมต์รูปภาพ: ...';

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function todayLabel() {
  const d = new Date();
  return `วัน${THAI_DAYS[d.getDay()]}ที่ ${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function todayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const ACCOUNT_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function daysUntilExpiry(account) {
  if (account.isOwner) return null;
  const last = account.lastLogin || account.createdAt || Date.now();
  const remaining = ACCOUNT_EXPIRY_MS - (Date.now() - last);
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}

function daysAgoLabel(ts) {
  if (!ts) return 'ไม่เคยเข้าสู่ระบบ';
  const days = Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'วันนี้';
  if (days === 1) return 'เมื่อวาน';
  return `${days} วันที่แล้ว`;
}

async function callClaude(system, content) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, content }),
  });
  const data = await response.json();
  if (!response.ok || data?.error) throw new Error(data.error || 'เกิดข้อผิดพลาด');
  return data.text || '(ไม่มีคำตอบ)';
}

function buildTasksForChannel(channel) {
  const tasks = [];
  for (let i = 1; i <= channel.dailyVideos; i++) tasks.push({ id: `${channel.id}-video-${i}`, channelId: channel.id, type: 'video', label: `วิดีโอ ${i}`, done: false, content: null, qc: null });
  for (let i = 1; i <= channel.dailyImages; i++) tasks.push({ id: `${channel.id}-image-${i}`, channelId: channel.id, type: 'image', label: `รูปภาพ ${i}`, done: false, content: null, qc: null });
  return tasks;
}

function parseContentBlock(text, type) {
  const get = (label) => {
    const re = new RegExp(label + '\\s*[:：]\\s*([\\s\\S]*?)(?=\\n[ก-๙A-Za-z]+\\s*[:：]|$)');
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };
  if (type === 'video') {
    return { title: get('ชื่อคลิป') || get('ชื่อ'), caption: get('คำบรรยาย'), videoPrompt: get('พรอมต์วิดีโอ'), coverPrompt: get('พรอมต์หน้าปกคลิป') || get('พรอมต์หน้าปก'), raw: text };
  }
  return { title: get('ชื่อโพสต์') || get('ชื่อ'), caption: get('คำบรรยาย'), imagePrompt: get('พรอมต์รูปภาพ'), raw: text };
}

function GradientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{ position: 'absolute', top: -120, left: -80, width: 320, height: 320, borderRadius: '50%', background: C.blue, opacity: 0.2, filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -60, width: 280, height: 280, borderRadius: '50%', background: C.violet, opacity: 0.2, filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', top: '45%', right: '8%', width: 200, height: 200, borderRadius: '50%', background: C.pink, opacity: 0.12, filter: 'blur(90px)' }} />
    </div>
  );
}

function IconBadge({ Icon, accent, size = 44 }) {
  return (
    <div className="flex items-center justify-center rounded-2xl shrink-0" style={{ width: size, height: size, background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>
      <Icon size={Math.round(size * 0.48)} color="#fff" />
    </div>
  );
}

function CameraLensO({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.6" />
      <circle cx="16" cy="16" r="4.5" fill="#fff" opacity="0.95" />
    </svg>
  );
}

function Wordmark({ fontSize = 28 }) {
  const iconSize = Math.round(fontSize * 0.72);
  const textStyle = { fontSize, color: '#fff', letterSpacing: '0.03em', lineHeight: 1 };
  return (
    <div className="inline-flex items-center font-display font-bold" style={{ gap: fontSize * 0.06 }}>
      <span style={textStyle}>F</span>
      <CameraLensO size={iconSize} />
      <span style={textStyle}>RGE</span>
    </div>
  );
}

function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="font-mono text-2xs tracking-widest uppercase px-2 py-1" style={{ color: active ? C.text : C.muted, borderBottom: active ? `2px solid ${C.blue}` : '2px solid transparent' }}>
      {label}
    </button>
  );
}

function Header({ user, stage, setStage, logout, accounts }) {
  const cl = CLEARANCE[user.clearance];
  const account = (accounts || []).find((a) => a.email === user.email);
  return (
    <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 shrink-0">
          <Wordmark fontSize={15} />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <NavTab label="งานประจำวัน" active={stage === 'daily'} onClick={() => setStage('daily')} />
          <NavTab label="Directory" active={stage === 'directory' || stage === 'department'} onClick={() => setStage('directory')} />
          <NavTab label="ปฏิทิน" active={stage === 'calendar'} onClick={() => setStage('calendar')} />
          <NavTab label="แพลตฟอร์ม" active={stage === 'platforms'} onClick={() => setStage('platforms')} />
          {user.clearance === 3 && <NavTab label="ทีมงาน" active={stage === 'team'} onClick={() => setStage('team')} />}
          <NavTab label="Protocol" active={stage === 'security'} onClick={() => setStage('security')} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="font-body text-sm" style={{ color: C.text }}>{user.name}</div>
          <div className="font-mono text-2xs tracking-wider" style={{ color: cl.color }}>{cl.code}</div>
        </div>
        <button onClick={() => setStage('profile')} aria-label="โปรไฟล์" className="shrink-0">
          {account?.avatar ? (
            <img src={account.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" style={{ border: stage === 'profile' ? `2px solid ${C.blue}` : '2px solid transparent' }} />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold" style={{ background: `linear-gradient(135deg, ${account?.avatarColor || cl.color}, ${account?.avatarColor || cl.color}88)`, color: '#0A0A0F', border: stage === 'profile' ? `2px solid ${C.blue}` : '2px solid transparent' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
        <button onClick={logout} className="p-2" style={{ color: C.muted }} aria-label="ออกจากระบบ"><LogOut size={16} /></button>
      </div>
    </div>
  );
}

function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 anim-fade relative" style={{ background: C.bg }}>
      <GradientBlobs />
      <div className="w-full max-w-sm relative rounded-3xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}`, boxShadow: `0 20px 60px -20px rgba(59,130,246,0.25)`, zIndex: 1, overflow: 'hidden' }}>
        <div style={{ height: 3, background: BRAND }} />
        {children}
      </div>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <div>
      <label className="font-mono text-2xs tracking-widest uppercase block mb-1" style={{ color: C.muted }}>{label}</label>
      <input {...props} className="w-full px-3 py-2.5 font-body text-sm outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
    </div>
  );
}

function Terminal({ accounts, onSignup, onLogin }) {
  const [mode, setMode] = useState('login');
  const [loginStep, setLoginStep] = useState('credentials');
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', code: '' });
  const [loginError, setLoginError] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingAccount, setPendingAccount] = useState(null);
  const [signupForm, setSignupForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [signupError, setSignupError] = useState('');
  const [signupDone, setSignupDone] = useState(false);
  const [signupRole, setSignupRole] = useState(3);
  const [signupLoading, setSignupLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotDone, setForgotDone] = useState(false);

  async function submitCredentials(e) {
    e.preventDefault();
    setLoginError('');
    setOtpLoading(true);
    try {
      const loginRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', identifier: loginForm.identifier.trim(), password: loginForm.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) { setOtpLoading(false); setLoginError(loginData.error || 'เข้าสู่ระบบไม่สำเร็จ'); return; }
      const acc = loginData.account;

      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email }),
      });
      const data = await res.json();
      setOtpLoading(false);
      if (!res.ok) { setLoginError(data.error || 'ส่งรหัสไม่สำเร็จ ลองใหม่อีกครั้ง'); return; }
      setOtpToken(data.token);
      setOtpEmail(acc.email);
      setPendingAccount(acc);
      setLoginForm((f) => ({ ...f, code: '' }));
      setLoginStep('verify');
    } catch (err) {
      setOtpLoading(false);
      setLoginError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ ลองใหม่อีกครั้ง');
    }
  }
  async function submitVerify(e) {
    e.preventDefault();
    if (loginForm.code.trim().length < 6) return;
    setLoginError('');
    setOtpLoading(true);
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otpToken, code: loginForm.code.trim() }),
      });
      const data = await res.json();
      setOtpLoading(false);
      if (!res.ok) { setLoginError(data.error || 'รหัสไม่ถูกต้องหรือหมดอายุ'); return; }
      onLogin(pendingAccount);
    } catch (err) {
      setOtpLoading(false);
      setLoginError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ ลองใหม่อีกครั้ง');
    }
  }
  async function submitSignup(e) {
    e.preventDefault();
    setSignupError('');
    if (!signupForm.name.trim() || !signupForm.username.trim() || !signupForm.email.trim() || !signupForm.password) { setSignupError('กรอกข้อมูลให้ครบ'); return; }
    if (signupForm.password !== signupForm.confirm) { setSignupError('รหัสผ่านไม่ตรงกัน'); return; }
    setSignupLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', name: signupForm.name.trim(), username: signupForm.username.trim(), email: signupForm.email.trim(), password: signupForm.password }),
      });
      const data = await res.json();
      setSignupLoading(false);
      if (!res.ok) { setSignupError(data.error || 'สร้างบัญชีไม่สำเร็จ'); return; }
      setSignupRole(data.account.clearance);
      onSignup(data.account);
      setSignupDone(true);
    } catch (err) {
      setSignupLoading(false);
      setSignupError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ');
    }
  }

  if (mode === 'signup') {
    return (
      <AuthShell>
        <div className="px-6 pt-8 pb-6 text-center">
          <IconBadge Icon={UserPlus} accent={C.blue} size={52} />
          <h1 className="font-display uppercase tracking-widest text-sm mt-3" style={{ color: C.text }}>Create Account</h1>
          <p className="font-body text-xs mt-1" style={{ color: C.muted }}>สร้างบัญชีใหม่สำหรับ FORGE</p>
        </div>
        {signupDone ? (
          <div className="px-6 pb-6 text-center">
            <p className="font-body text-sm mb-1" style={{ color: C.emerald }}>สร้างบัญชีสำเร็จ</p>
            <p className="font-mono text-2xs mb-4" style={{ color: C.muted }}>
              {signupRole === 3 ? 'คุณคือผู้บริหารสูงสุดของระบบนี้' : 'บัญชีเริ่มต้นที่ระดับพนักงานทั่วไป — ผู้บริหารปรับสิทธิ์ให้ภายหลังได้ที่หน้าทีมงาน'}
            </p>
            <button onClick={() => { setMode('login'); setLoginForm({ ...loginForm, identifier: signupForm.username }); }} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase rounded-xl" style={{ background: BRAND, color: '#fff' }}>ไปหน้าเข้าสู่ระบบ</button>
          </div>
        ) : (
          <form onSubmit={submitSignup} className="px-6 pb-6 space-y-3">
            <TextField label="ชื่อ" value={signupForm.name} onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} placeholder="ชื่อของคุณ" required />
            <TextField label="ชื่อผู้ใช้ (สำหรับล็อกอิน)" value={signupForm.username} onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value.replace(/\s/g, '') })} placeholder="เช่น forge_admin" required />
            <TextField label="อีเมล" type="email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} placeholder="you@email.com" required />
            <TextField label="รหัสผ่าน" type="password" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} placeholder="••••••••" required />
            <TextField label="ยืนยันรหัสผ่าน" type="password" value={signupForm.confirm} onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })} placeholder="••••••••" required />
            {signupError && <p className="font-mono text-2xs" style={{ color: C.red }}>{signupError}</p>}
            <button type="submit" disabled={signupLoading} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND, color: '#fff', opacity: signupLoading ? 0.6 : 1 }}>
              {signupLoading ? <Loader2 size={14} className="animate-spin" /> : null} {signupLoading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full font-mono text-2xs tracking-widest flex items-center justify-center gap-1" style={{ color: C.muted }}><ArrowLeft size={11} /> กลับไปเข้าสู่ระบบ</button>
          </form>
        )}
      </AuthShell>
    );
  }

  if (mode === 'forgot') {
    return (
      <AuthShell>
        <div className="px-6 pt-8 pb-6 text-center">
          <IconBadge Icon={Mail} accent={C.violet} size={52} />
          <h1 className="font-display uppercase tracking-widest text-sm mt-3" style={{ color: C.text }}>Reset Password</h1>
          <p className="font-body text-xs mt-1" style={{ color: C.muted }}>กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์รีเซ็ตให้</p>
        </div>
        {forgotDone ? (
          <div className="px-6 pb-6 text-center">
            <p className="font-body text-sm mb-1" style={{ color: C.emerald }}>ถ้ามีบัญชีนี้ในระบบ เราได้ส่งลิงก์รีเซ็ตไปที่อีเมลแล้ว</p>
            <p className="font-mono text-2xs mb-4" style={{ color: C.muted }}>(จำลอง — ยังไม่มีระบบส่งลิงก์รีเซ็ตจริง)</p>
            <button onClick={() => setMode('login')} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase rounded-xl" style={{ background: BRAND, color: '#fff' }}>กลับไปเข้าสู่ระบบ</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setForgotDone(true); }} className="px-6 pb-6 space-y-3">
            <TextField label="อีเมล" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@email.com" required />
            <button type="submit" className="w-full py-2.5 font-mono text-xs tracking-widest uppercase rounded-xl" style={{ background: BRAND, color: '#fff' }}>ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
            <button type="button" onClick={() => setMode('login')} className="w-full font-mono text-2xs tracking-widest flex items-center justify-center gap-1" style={{ color: C.muted }}><ArrowLeft size={11} /> กลับไปเข้าสู่ระบบ</button>
          </form>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="px-6 pt-8 pb-6 text-center">
        <div className="flex justify-center"><Wordmark fontSize={34} /></div>
        <p className="font-body text-xs mt-3" style={{ color: C.muted }}>
          {loginStep === 'credentials' ? 'เข้าสู่ระบบ FORGE' : 'กรอกรหัสยืนยันตัวตนขั้นที่สอง'}
        </p>
      </div>

      {loginStep === 'credentials' && (
        <form onSubmit={submitCredentials} className="px-6 pb-6 space-y-3">
          <TextField label="อีเมล หรือ ชื่อผู้ใช้" value={loginForm.identifier} onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })} placeholder="you@email.com หรือ ชื่อผู้ใช้" required />
          <TextField label="รหัสผ่าน" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" required />
          {loginError && <p className="font-mono text-2xs" style={{ color: C.red }}>{loginError}</p>}
          <button type="submit" disabled={otpLoading} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 rounded-xl" style={{ background: BRAND, color: '#fff', opacity: otpLoading ? 0.6 : 1 }}>
            {otpLoading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />} {otpLoading ? 'กำลังส่งรหัส...' : 'ถัดไป'}
          </button>
          <div className="flex items-center justify-between pt-1">
            <button type="button" onClick={() => setMode('forgot')} className="font-mono text-2xs" style={{ color: C.muted }}>ลืมรหัสผ่าน?</button>
            <button type="button" onClick={() => setMode('signup')} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.muted }}><UserPlus size={11} /> สร้างบัญชีใหม่</button>
          </div>
          {accounts.length === 0 && <p className="font-mono text-2xs mt-2" style={{ color: C.muted }}>* ยังไม่มีบัญชี — กด "สร้างบัญชีใหม่" ก่อน</p>}
        </form>
      )}

      {loginStep === 'verify' && (
        <form onSubmit={submitVerify} className="px-6 pb-6 space-y-4">
          <div>
            <label className="font-mono text-2xs tracking-widest uppercase block mb-1" style={{ color: C.muted }}>รหัสยืนยัน 6 หลัก</label>
            <input value={loginForm.code} onChange={(e) => setLoginForm({ ...loginForm, code: e.target.value })} placeholder="000000" maxLength={6} className="w-full px-3 py-2 font-mono text-lg tracking-widest text-center outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} required />
            <p className="font-mono text-2xs mt-2" style={{ color: C.muted }}>* ส่งรหัสไปที่ {otpEmail} แล้ว (เช็คโฟลเดอร์สแปมด้วยถ้าไม่เจอ) รหัสหมดอายุใน 5 นาที</p>
            {loginError && <p className="font-mono text-2xs mt-2" style={{ color: C.red }}>{loginError}</p>}
          </div>
          <button type="submit" disabled={otpLoading} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 rounded-xl" style={{ background: BRAND, color: '#fff', opacity: otpLoading ? 0.6 : 1 }}>
            {otpLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />} {otpLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันตัวตน'}
          </button>
          <button type="button" onClick={() => setLoginStep('credentials')} className="w-full font-mono text-2xs tracking-widest" style={{ color: C.muted }}>← กลับ</button>
        </form>
      )}
      <div className="px-6 pb-5"><p className="font-mono text-2xs leading-relaxed" style={{ color: C.muted }}>* รหัสยืนยันส่งจริงทางอีเมลแล้ว — ส่วนบัญชีผู้ใช้ยังเก็บไว้ชั่วคราวในเบราว์เซอร์ ยังไม่มีฐานข้อมูลถาวร</p></div>
    </AuthShell>
  );
}

function DeptCard({ dept, userClearance, denied, onOpen }) {
  const Icon = dept.icon;
  const locked = userClearance < dept.clearance;
  const isDenied = denied === dept.id;
  return (
    <button onClick={() => onOpen(dept)} className="relative text-left p-5 rounded-2xl transition-transform" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${isDenied ? C.red : C.border}`, boxShadow: locked ? 'none' : `0 8px 24px -14px ${dept.accent}66`, opacity: locked ? 0.5 : 1, cursor: locked ? 'not-allowed' : 'pointer', filter: locked ? 'grayscale(0.6)' : 'none' }}>
      <div className="flex items-start justify-between mb-3">
        <IconBadge Icon={Icon} accent={dept.accent} size={40} />
        {locked ? <Lock size={16} style={{ color: C.muted }} /> : <Unlock size={16} style={{ color: dept.accent }} />}
      </div>
      <div className="font-mono text-2xs tracking-widest" style={{ color: dept.accent }}>{dept.en}</div>
      <div className="font-body text-base mt-0.5" style={{ color: C.text }}>{dept.th}</div>
      <p className="font-body text-xs mt-2 leading-relaxed" style={{ color: C.muted }}>{dept.brief}</p>
      <div className="flex items-center gap-1 mt-3"><Bot size={12} style={{ color: C.muted }} /><span className="font-mono text-2xs" style={{ color: C.muted }}>{dept.manager} · ดำเนินการโดย AI ได้</span></div>
      <div className="font-mono text-2xs tracking-wider mt-2" style={{ color: locked ? C.red : C.muted }}>ต้องการสิทธิ์ {CLEARANCE[dept.clearance].label}</div>
      {isDenied && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-1 anim-fade rounded-2xl" style={{ background: 'rgba(5,5,6,0.92)' }}>
          <AlertTriangle size={18} style={{ color: C.red }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.red }}>ACCESS DENIED</span>
        </div>
      )}
    </button>
  );
}

function Directory({ user, denied, onOpen }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="mb-6"><div className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>DEPARTMENT DIRECTORY</div><h2 className="font-body text-xl mt-1" style={{ color: C.text }}>เลือกแผนกที่ต้องการเข้าถึง</h2></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{DEPARTMENTS.map((d) => <DeptCard key={d.id} dept={d} userClearance={user.clearance} denied={denied} onOpen={onOpen} />)}</div>
    </div>
  );
}

function RoleFile({ role, index, accent }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="font-mono text-2xs shrink-0" style={{ color: accent }}>แฟ้ม {String(index + 1).padStart(2, '0')}</div>
      <div><div className="font-body text-sm" style={{ color: C.text }}>{role.title} <span className="font-mono text-2xs" style={{ color: C.muted }}>· {role.en}</span></div><p className="font-body text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{role.duty}</p></div>
    </div>
  );
}

function DepartmentView({ dept, onBack }) {
  const Icon = dept.icon;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-stamp">
      <button onClick={onBack} className="font-mono text-2xs tracking-widest mb-4" style={{ color: C.muted }}>← กลับไปไดเรกทอรี</button>
      <div className="relative p-5 mb-6 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3"><IconBadge Icon={Icon} accent={dept.accent} size={46} /><div><div className="font-mono text-2xs tracking-widest" style={{ color: dept.accent }}>{dept.en}</div><div className="font-body text-lg" style={{ color: C.text }}>{dept.th}</div></div></div>
        <p className="font-body text-sm mt-3" style={{ color: C.muted }}>{dept.brief}</p>
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}><Bot size={14} style={{ color: dept.accent }} /><span className="font-body text-xs" style={{ color: C.text }}>{dept.manager}</span><span className="font-mono text-2xs" style={{ color: C.muted }}>· ดำเนินการโดย AI ภายใต้การกำกับของคุณ</span></div>
      </div>
      <div className="space-y-3 mb-6">{dept.roles.map((r, i) => <RoleFile key={r.en} role={r} index={i} accent={dept.accent} />)}</div>
      {dept.hasChart && (
        <div className="p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: dept.accent }}>สรุปผลรายเดือน (ข้อมูลตัวอย่าง)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
              <Tooltip contentStyle={{ background: C.bgDeep, border: `1px solid ${C.border}`, fontSize: 12, borderRadius: 8 }} labelStyle={{ color: C.text }} />
              <Bar dataKey="output" fill={dept.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function PlatformsPanel() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Share2 size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>PLATFORM LINKS</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>การเชื่อมต่อแพลตฟอร์ม</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>การเชื่อมต่อจริงต้องลงทะเบียน API/OAuth ของแต่ละแพลตฟอร์มเอง หน้านี้แสดงสถานะตัวอย่างเท่านั้น</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => { const meta = PLATFORM_META[Object.keys(PLATFORM_META).find(k => PLATFORM_META[k].label === p.name.split(' ')[0])] || PLATFORM_META.other; return (
          <div key={p.name} className="p-4 flex items-center gap-3 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <IconBadge Icon={p.icon} accent={meta.color} size={36} />
            <div className="flex-1"><div className="font-body text-sm" style={{ color: C.text }}>{p.name}</div><div className="font-mono text-2xs" style={{ color: C.muted }}>{p.note}</div></div>
            <span className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ color: C.muted, border: `1px solid ${C.border}` }}>ยังไม่เชื่อมต่อ</span>
          </div>
        );})}
      </div>
    </div>
  );
}

function SecurityProtocol() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><ScrollText size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>SECURITY PROTOCOL</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>มาตรการความปลอดภัยสำหรับระบบจริง</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>หน้านี้เป็นข้อมูลอ้างอิง — ระบบล็อกอินหลักเชื่อมจริงแล้ว แต่บางส่วนยังเป็นต้นแบบ</p>
      <div className="space-y-3">
        {SECURITY_PROTOCOL.map((item, i) => (
          <div key={item.title} className="relative p-4 pl-16 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <span className="absolute left-4 top-4 font-mono text-xs w-8 h-8 rounded-full flex items-center justify-center" style={{ color: '#fff', background: BRAND }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="font-body text-sm" style={{ color: C.text }}>{item.title}</div>
            <p className="font-body text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamPanel({ accounts, onUpdateClearance }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Users size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>TEAM MANAGEMENT</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>จัดการทีมงาน</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>คนที่สมัครใหม่จะเริ่มที่ระดับพนักงานทั่วไปเสมอ ปรับสิทธิ์ให้แต่ละคนได้ที่นี่ — บัญชีที่ไม่เข้าสู่ระบบเกิน 30 วันจะถูกลบอัตโนมัติ (ยกเว้นบัญชีเจ้าของระบบ)</p>
      {accounts.length === 0 ? (
        <p className="font-body text-sm" style={{ color: C.muted }}>ยังไม่มีสมาชิกในระบบ</p>
      ) : (
        <div className="space-y-2">
          {accounts.map((a) => {
            const cl = CLEARANCE[a.clearance];
            const remaining = daysUntilExpiry(a);
            return (
              <div key={a.email} className="p-4 flex items-center justify-between gap-3 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-bold shrink-0" style={{ background: `linear-gradient(135deg, ${cl.color}, ${cl.color}88)`, color: '#0A0A0F' }}>
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body text-sm truncate" style={{ color: C.text }}>{a.name}</span>
                      {a.isOwner && <span className="font-mono text-2xs px-1.5 py-0.5 rounded shrink-0" style={{ color: C.emerald, border: `1px solid ${C.emerald}` }}>เจ้าของ</span>}
                    </div>
                    <div className="font-mono text-2xs truncate" style={{ color: C.muted }}>@{a.username} · {a.email}</div>
                    <div className="font-mono text-2xs truncate mt-0.5" style={{ color: a.isOwner ? C.emerald : (remaining !== null && remaining <= 7 ? C.red : C.muted) }}>
                      {a.isOwner ? 'ไม่มีวันหมดอายุ' : `ใช้ล่าสุด ${daysAgoLabel(a.lastLogin)} · เหลือ ${remaining} วันก่อนถูกลบ`}
                    </div>
                  </div>
                </div>
                <select value={a.clearance} onChange={(e) => onUpdateClearance(a.email, Number(e.target.value))} className="font-mono text-2xs px-2 py-2 rounded-xl outline-none shrink-0" style={{ background: C.panelAlt, color: cl.color, border: `1px solid ${C.border}` }}>
                  <option value={1}>LV-1 STAFF</option>
                  <option value={2}>LV-2 MANAGER</option>
                  <option value={3}>LV-3 EXECUTIVE</option>
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const AVATAR_COLORS = [C.blue, C.violet, C.teal, C.pink, C.emerald, C.cyan];

function ProfilePage({ user, accounts, tasks, history, onUpdateProfile }) {
  const account = accounts.find((a) => a.email === user.email);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(account?.avatar || null);
  const [avatarColor, setAvatarColor] = useState(account?.avatarColor || C.blue);
  const [saveMsg, setSaveMsg] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const totalToday = tasks.length;
  const doneToday = tasks.filter((t) => t.done).length;
  const histTotal = history.reduce((sum, h) => sum + h.totalTasks, 0) + totalToday;
  const histDone = history.reduce((sum, h) => sum + h.doneTasks, 0) + doneToday;
  const consistencyPct = histTotal === 0 ? 0 : Math.round((histDone / histTotal) * 100);

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    onUpdateProfile({ name: name.trim() || account.name, avatar, avatarColor });
    setSaveMsg('บันทึกโปรไฟล์แล้ว');
    setTimeout(() => setSaveMsg(''), 2000);
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwError('');
    setPwMsg('');
    if (newPassword.length < 4) { setPwError('รหัสผ่านใหม่สั้นเกินไป'); return; }
    if (newPassword !== confirmPassword) { setPwError('รหัสผ่านใหม่ไม่ตรงกัน'); return; }
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changePassword', email: user.email, currentPassword, newPassword }),
      });
      const data = await res.json();
      setPwLoading(false);
      if (!res.ok) { setPwError(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ'); return; }
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setPwMsg('เปลี่ยนรหัสผ่านแล้ว');
      setTimeout(() => setPwMsg(''), 2000);
    } catch (err) {
      setPwLoading(false);
      setPwError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ');
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <h2 className="font-body text-xl mb-6" style={{ color: C.text }}>โปรไฟล์ของฉัน</h2>

      <div className="p-5 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-4 mb-4">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover shrink-0" style={{ border: `2px solid ${C.border}` }} />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-display text-2xl font-bold shrink-0" style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`, color: '#0A0A0F' }}>
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <label className="font-mono text-2xs px-3 py-2 rounded-xl inline-block cursor-pointer" style={{ border: `1px solid ${C.border}`, color: C.text }}>
              อัปโหลดรูป
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
            {avatar && <button onClick={() => setAvatar(null)} className="font-mono text-2xs ml-2" style={{ color: C.muted }}>ลบรูป ใช้อวาตาร์แทน</button>}
          </div>
        </div>
        {!avatar && (
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-2xs" style={{ color: C.muted }}>สีอวาตาร์:</span>
            {AVATAR_COLORS.map((c) => (
              <button key={c} onClick={() => setAvatarColor(c)} className="w-6 h-6 rounded-full" style={{ background: c, border: avatarColor === c ? `2px solid ${C.text}` : '2px solid transparent' }} aria-label="เลือกสีอวาตาร์" />
            ))}
          </div>
        )}
        <TextField label="ชื่อที่แสดง" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={saveProfile} className="mt-3 font-mono text-2xs px-4 py-2 rounded-xl" style={{ background: BRAND, color: '#fff' }}>บันทึกโปรไฟล์</button>
        {saveMsg && <p className="font-mono text-2xs mt-2" style={{ color: C.emerald }}>{saveMsg}</p>}
      </div>

      <div className="p-5 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ความสม่ำเสมอสะสม</div>
        <div style={{ width: '100%', height: 10, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${consistencyPct}%`, height: '100%', background: `linear-gradient(90deg, ${C.emerald}, ${C.cyan})`, transition: 'width 0.4s ease' }} />
        </div>
        <div className="font-mono text-2xs mt-2" style={{ color: C.muted }}>{consistencyPct}% ({histDone}/{histTotal} งานเสร็จ นับตั้งแต่เริ่มใช้งาน)</div>
        <p className="font-mono text-2xs mt-3 leading-relaxed" style={{ color: C.muted }}>* คำนวณจากงานทั้งหมดที่บันทึกไว้ในฐานข้อมูล รวมวันนี้ด้วย ดูรายละเอียดรายวันได้ที่หน้าปฏิทิน</p>
      </div>

      <div className="p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เปลี่ยนรหัสผ่าน</div>
        <form onSubmit={changePassword} className="space-y-3">
          <TextField label="รหัสผ่านปัจจุบัน" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <TextField label="รหัสผ่านใหม่" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <TextField label="ยืนยันรหัสผ่านใหม่" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {pwError && <p className="font-mono text-2xs" style={{ color: C.red }}>{pwError}</p>}
          {pwMsg && <p className="font-mono text-2xs" style={{ color: C.emerald }}>{pwMsg}</p>}
          <button type="submit" disabled={pwLoading} className="font-mono text-2xs px-4 py-2 rounded-xl flex items-center gap-2" style={{ background: BRAND, color: '#fff', opacity: pwLoading ? 0.6 : 1 }}>
            {pwLoading ? <Loader2 size={12} className="animate-spin" /> : null} {pwLoading ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
          </button>
        </form>
      </div>
    </div>
  );
}

const WEEKDAY_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

function ReminderBanner({ reminder, onDismiss }) {
  if (!reminder) return null;
  return (
    <div className="p-4 rounded-2xl mb-4 relative" style={{ background: `${C.orange}18`, border: `1px solid ${C.orange}` }}>
      <button onClick={onDismiss} className="absolute top-3 right-3 font-mono text-2xs" style={{ color: C.muted }}>ปิด</button>
      <div className="font-mono text-2xs tracking-widest mb-2" style={{ color: C.orange }}>⚠ แจ้งเตือน — เมื่อวาน ({reminder.date})</div>
      <p className="font-body text-sm mb-2" style={{ color: C.text }}>มีงานที่ยังไม่เสร็จ {reminder.missed.length} งาน:</p>
      <div className="space-y-1">
        {reminder.missed.map((m, i) => <div key={i} className="font-body text-xs" style={{ color: C.muted }}>• {m.channelName} — {m.label}</div>)}
      </div>
    </div>
  );
}

function CalendarPage({ history, tasks, channels }) {
  const todayStr = todayDateStr();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const historyByDate = {};
  history.forEach((h) => { historyByDate[h.date] = h; });

  const todayDone = tasks.filter((t) => t.done).length;
  const todayEntry = {
    date: todayStr,
    totalTasks: tasks.length,
    doneTasks: todayDone,
    missed: tasks.filter((t) => !t.done).map((t) => {
      const ch = channels.find((c) => c.id === t.channelId);
      return { channelName: ch ? ch.name : '-', label: t.label };
    }),
  };

  function entryColor(entry) {
    if (!entry || entry.totalTasks === 0) return C.border;
    const pct = entry.doneTasks / entry.totalTasks;
    if (pct >= 1) return C.emerald;
    if (pct > 0) return C.orange;
    return C.red;
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedEntry = selectedDate === todayStr ? todayEntry : historyByDate[selectedDate];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Calendar size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>CALENDAR</span></div>
      <h2 className="font-body text-xl mb-6" style={{ color: C.text }}>ปฏิทิน / ประวัติย้อนหลัง</h2>

      <div className="p-5 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-body text-sm mb-3" style={{ color: C.text }}>{THAI_MONTHS[month]} {year + 543}</div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAY_LABELS.map((d) => <div key={d} className="font-mono text-2xs text-center" style={{ color: C.muted }}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const entry = isToday ? todayEntry : historyByDate[dateStr];
            const hasData = isToday || !!historyByDate[dateStr];
            const color = isToday ? C.blue : entryColor(entry);
            return (
              <button
                key={i}
                onClick={() => hasData && setSelectedDate(dateStr)}
                className="aspect-square rounded-lg flex items-center justify-center font-mono text-2xs"
                style={{
                  background: dateStr === selectedDate && hasData ? `${color}33` : 'transparent',
                  border: `1px solid ${hasData ? color : C.border}`,
                  color: hasData ? C.text : C.muted,
                  cursor: hasData ? 'pointer' : 'default',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {selectedEntry ? (
        <div className="p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-2" style={{ color: C.blue }}>{selectedDate}{selectedDate === todayStr ? ' (วันนี้)' : ''}</div>
          <div style={{ width: '100%', height: 8, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: selectedEntry.totalTasks ? `${Math.round((selectedEntry.doneTasks / selectedEntry.totalTasks) * 100)}%` : '0%', height: '100%', background: `linear-gradient(90deg, ${C.emerald}, ${C.cyan})` }} />
          </div>
          <div className="font-mono text-2xs mt-2 mb-3" style={{ color: C.muted }}>{selectedEntry.doneTasks}/{selectedEntry.totalTasks} งานเสร็จ</div>
          {selectedEntry.missed.length > 0 ? (
            <div>
              <div className="font-mono text-2xs mb-1" style={{ color: C.red }}>งานที่ยังไม่เสร็จ:</div>
              <div className="space-y-1">
                {selectedEntry.missed.map((m, i) => <div key={i} className="font-body text-xs" style={{ color: C.text }}>• {m.channelName} — {m.label}</div>)}
              </div>
            </div>
          ) : (
            <p className="font-body text-xs" style={{ color: C.emerald }}>{selectedEntry.totalTasks > 0 ? 'ทำครบทุกงาน 🎉' : 'ไม่มีงานในวันนี้'}</p>
          )}
        </div>
      ) : (
        <p className="font-body text-sm text-center py-6" style={{ color: C.muted }}>เลือกวันที่มีข้อมูล (มีกรอบสี) เพื่อดูรายละเอียด</p>
      )}
    </div>
  );
}

function ProgressBar({ done, total, color }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div style={{ width: '100%', height: 6, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${C.violet})`, transition: 'width 0.3s ease' }} /></div>
      <div className="font-mono text-2xs mt-1" style={{ color: C.muted }}>{done}/{total} เสร็จวันนี้</div>
    </div>
  );
}

function VerdictBox({ verdict }) {
  if (!verdict) return null;
  return (
    <div className="p-2 mt-1.5 rounded-xl" style={{ border: `1px solid ${verdict.passed ? C.emerald : C.red}`, background: verdict.passed ? `${C.emerald}11` : `${C.red}11` }}>
      <div className="flex items-center gap-2 mb-1">
        {verdict.passed ? <CheckCircle2 size={13} style={{ color: C.emerald }} /> : <XCircle size={13} style={{ color: C.red }} />}
        <span className="font-mono text-2xs" style={{ color: verdict.passed ? C.emerald : C.red }}>{verdict.passed ? 'QC ผ่าน' : 'QC ให้แก้ไข'}</span>
      </div>
      <p className="font-body text-xs whitespace-pre-wrap" style={{ color: C.muted }}>{verdict.text}</p>
    </div>
  );
}

function DailyTaskCard({ task, onToggle, onGenerate, onQC, loading, qcLoading }) {
  const Icon = task.type === 'video' ? VideoIcon : ImageIcon;
  const c = task.content;
  const hasFields = c && (c.title || c.caption || c.videoPrompt || c.coverPrompt || c.imagePrompt);
  return (
    <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task.id)} style={{ color: task.done ? C.emerald : C.muted }} className="mt-0.5 shrink-0">{task.done ? <CheckSquare size={18} /> : <Square size={18} />}</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><Icon size={13} style={{ color: C.muted }} /><span className="font-body text-sm" style={{ color: task.done ? C.muted : C.text, textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</span></div>
          {!c ? (
            <button onClick={() => onGenerate(task)} disabled={loading} className="mt-2 font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: BRAND, color: '#fff', opacity: loading ? 0.6 : 1 }}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI เตรียมเนื้อหา
            </button>
          ) : (
            <div className="mt-2 space-y-1.5">
              {hasFields ? (
                <>
                  {c.title && <div><span className="font-mono text-2xs" style={{ color: C.blue }}>ชื่อ: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.title}</span></div>}
                  {c.caption && <div><span className="font-mono text-2xs" style={{ color: C.blue }}>คำบรรยาย: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.caption}</span></div>}
                  {c.videoPrompt && <div><span className="font-mono text-2xs" style={{ color: C.cyan }}>พรอมต์วิดีโอ: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.videoPrompt}</span></div>}
                  {c.coverPrompt && <div><span className="font-mono text-2xs" style={{ color: C.violet }}>พรอมต์หน้าปก: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.coverPrompt}</span></div>}
                  {c.imagePrompt && <div><span className="font-mono text-2xs" style={{ color: C.violet }}>พรอมต์รูปภาพ: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.imagePrompt}</span></div>}
                </>
              ) : (
                <pre className="font-body text-xs whitespace-pre-wrap" style={{ color: C.text, fontFamily: 'inherit' }}>{c.raw}</pre>
              )}
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => onGenerate(task)} disabled={loading} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.muted }}>
                  {loading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} สร้างใหม่
                </button>
                {!task.qc && (
                  <button onClick={() => onQC(task)} disabled={qcLoading} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.violet }}>
                    {qcLoading ? <Loader2 size={11} className="animate-spin" /> : <ClipboardCheck size={11} />} ส่งให้ QC ตรวจสอบ
                  </button>
                )}
              </div>
              <VerdictBox verdict={task.qc} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddChannelForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [videos, setVideos] = useState(1);
  const [images, setImages] = useState(0);
  return (
    <div className="relative p-4 mb-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
      <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เพิ่มช่อง/เพจใหม่</div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อช่อง เช่น ช่องวาฬ" className="w-full px-3 py-2 font-body text-sm mb-2 outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 font-body text-sm mb-2 outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>
        {Object.entries(PLATFORM_META).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}
      </select>
      <div className="flex gap-2 mb-3">
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>วิดีโอ/วัน</label><input type="number" min="0" value={videos} onChange={(e) => setVideos(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 font-body text-sm outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} /></div>
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>รูปภาพ/วัน</label><input type="number" min="0" value={images} onChange={(e) => setImages(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 font-body text-sm outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (name.trim() && (videos > 0 || images > 0)) { onAdd(name.trim(), platform, videos, images); onClose(); } }} className="font-mono text-2xs px-3 py-2 flex items-center gap-1 rounded-xl" style={{ background: BRAND, color: '#fff' }}><Plus size={13} /> เพิ่มช่อง</button>
        <button onClick={onClose} className="font-mono text-2xs px-3 py-2 rounded-xl" style={{ color: C.muted, border: `1px solid ${C.border}` }}>ยกเลิก</button>
      </div>
    </div>
  );
}

function DailyChannelBlock({ channel, tasks, onToggle, onGenerate, onQC, loadingTaskId, qcLoadingId, onRemove, onGenerateAll, generatingAll, onQCAll, qcAllRunning }) {
  const [open, setOpen] = useState(true);
  const meta = PLATFORM_META[channel.platform];
  const PlatformIcon = meta.icon;
  const done = tasks.filter((t) => t.done).length;
  const qcable = tasks.some((t) => t.content && !t.qc);
  return (
    <div className="relative mb-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}`, boxShadow: `0 8px 24px -16px ${meta.color}66`, overflow: 'hidden' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.color}, transparent)` }} />
      <div className="p-4 flex items-center justify-between gap-3">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2"><span className="font-mono text-2xs px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1" style={{ color: meta.color, border: `1px solid ${meta.color}` }}><PlatformIcon size={11} />{meta.label}</span><span className="font-body text-sm truncate" style={{ color: C.text }}>{channel.name}</span></div>
          <div className="mt-2 max-w-xs"><ProgressBar done={done} total={tasks.length} color={meta.color} /></div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onRemove(channel.id)} style={{ color: C.muted }} aria-label="ลบช่อง"><Trash2 size={15} /></button>
          <button onClick={() => setOpen((o) => !o)} style={{ color: C.muted }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        </div>
      </div>
      {open && (
        <div className="anim-fade">
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            <button onClick={() => onGenerateAll(channel)} disabled={generatingAll} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: meta.color, color: '#fff', opacity: generatingAll ? 0.6 : 1 }}>
              {generatingAll ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} เตรียมเนื้อหาให้ครบทุกงานวันนี้
            </button>
            {qcable && (
              <button onClick={() => onQCAll(channel)} disabled={qcAllRunning} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: C.violet, color: '#fff', opacity: qcAllRunning ? 0.6 : 1 }}>
                {qcAllRunning ? <Loader2 size={12} className="animate-spin" /> : <ClipboardCheck size={12} />} ตรวจ QC ทั้งหมด
              </button>
            )}
          </div>
          {tasks.map((t) => <DailyTaskCard key={t.id} task={t} onToggle={onToggle} onGenerate={onGenerate} onQC={onQC} loading={loadingTaskId === t.id} qcLoading={qcLoadingId === t.id} />)}
        </div>
      )}
    </div>
  );
}

function DailyWork({ channels, setChannels, tasks, setTasks, reminder, onDismissReminder }) {
  const [showAdd, setShowAdd] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [generatingAllId, setGeneratingAllId] = useState(null);
  const [qcLoadingId, setQcLoadingId] = useState(null);
  const [qcAllId, setQcAllId] = useState(null);

  function addChannel(name, platform, dailyVideos, dailyImages) {
    const channel = { id: Date.now().toString(), name, platform, dailyVideos, dailyImages };
    setChannels((prev) => [...prev, channel]);
    setTasks((prev) => [...prev, ...buildTasksForChannel(channel)]);
  }
  function removeChannel(id) {
    setChannels((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.filter((t) => t.channelId !== id));
  }
  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  async function generateTask(task) {
    setLoadingTaskId(task.id);
    const channel = channels.find((c) => c.id === task.channelId);
    try {
      const sys = task.type === 'video' ? VIDEO_SYS : IMAGE_SYS;
      const text = await callClaude(sys, `ช่อง/เพจ: ${channel.name} (${PLATFORM_META[channel.platform].label})\nงาน: ${task.label}`);
      const content = parseContentBlock(text, task.type);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, content, qc: null } : t)));
    } catch (e) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, content: { raw: 'เรียก AI ไม่สำเร็จ ลองใหม่อีกครั้ง' }, qc: null } : t)));
    } finally {
      setLoadingTaskId(null);
    }
  }
  async function generateAll(channel) {
    setGeneratingAllId(channel.id);
    const chTasks = tasks.filter((t) => t.channelId === channel.id);
    for (const t of chTasks) { await generateTask(t); }
    setGeneratingAllId(null);
  }
  async function runQC(task) {
    if (!task.content) return;
    setQcLoadingId(task.id);
    try {
      const sys = task.type === 'video'
        ? 'คุณคือฝ่าย QC ตรวจสอบเนื้อหาที่เตรียมไว้สำหรับโพสต์คลิปวิดีโอ ก่อนที่ทีมจะเอาไปเจนจริง ตรวจว่าชื่อคลิป คำบรรยาย พรอมต์วิดีโอ และพรอมต์หน้าปก เหมาะสม ชัดเจน ไม่ผิดพลาด สอดคล้องกัน และคำบรรยายมีแฮชแท็ก/อิโมจิหรือยัง ตอบเป็นภาษาไทย บรรทัดแรกขึ้นต้นด้วยคำว่า "ผ่าน" หรือ "ควรแก้ไข" ตามด้วยเหตุผลสั้นๆ ไม่เกิน 3 บรรทัด'
        : 'คุณคือฝ่าย QC ตรวจสอบเนื้อหาที่เตรียมไว้สำหรับโพสต์รูปภาพ ก่อนที่ทีมจะเอาไปเจนจริง ตรวจว่าชื่อโพสต์ คำบรรยาย และพรอมต์รูปภาพ เหมาะสม ชัดเจน ไม่ผิดพลาด สอดคล้องกัน และคำบรรยายมีแฮชแท็ก/อิโมจิหรือยัง ตอบเป็นภาษาไทย บรรทัดแรกขึ้นต้นด้วยคำว่า "ผ่าน" หรือ "ควรแก้ไข" ตามด้วยเหตุผลสั้นๆ ไม่เกิน 3 บรรทัด';
      const c = task.content;
      const summary = task.type === 'video'
        ? `ชื่อคลิป: ${c.title || '-'}\nคำบรรยาย: ${c.caption || '-'}\nพรอมต์วิดีโอ: ${c.videoPrompt || '-'}\nพรอมต์หน้าปก: ${c.coverPrompt || '-'}`
        : `ชื่อโพสต์: ${c.title || '-'}\nคำบรรยาย: ${c.caption || '-'}\nพรอมต์รูปภาพ: ${c.imagePrompt || '-'}`;
      const text = await callClaude(sys, c.raw && !c.title ? c.raw : summary);
      const passed = text.trim().startsWith('ผ่าน');
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, qc: { passed, text } } : t)));
    } catch (e) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, qc: { passed: false, text: 'เรียก AI ตรวจสอบไม่สำเร็จ ลองใหม่อีกครั้ง' } } : t)));
    } finally {
      setQcLoadingId(null);
    }
  }
  async function qcAll(channel) {
    setQcAllId(channel.id);
    const chTasks = tasks.filter((t) => t.channelId === channel.id && t.content && !t.qc);
    for (const t of chTasks) { await runQC(t); }
    setQcAllId(null);
  }
  function resetToday() {
    setTasks((prev) => prev.map((t) => ({ ...t, done: false, content: null, qc: null })));
  }

  const totalDone = tasks.filter((t) => t.done).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Calendar size={14} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>{todayLabel()}</span></div>
      <h2 className="font-body text-xl" style={{ color: C.text }}>งานประจำวัน</h2>
      <div className="mt-3"><ReminderBanner reminder={reminder} onDismiss={onDismissReminder} /></div>
      <div className="flex items-center justify-between gap-3 mt-3 mb-6">
        <div className="flex-1 max-w-xs"><ProgressBar done={totalDone} total={tasks.length} color={C.blue} /></div>
        <button onClick={resetToday} className="font-mono text-2xs px-2 py-1.5 flex items-center gap-1 shrink-0 rounded-lg" style={{ color: C.muted, border: `1px solid ${C.border}` }}>เริ่มวันใหม่</button>
      </div>

      {showAdd ? (
        <AddChannelForm onAdd={addChannel} onClose={() => setShowAdd(false)} />
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full mb-4 font-mono text-2xs px-3 py-2.5 flex items-center justify-center gap-2 rounded-xl" style={{ background: BRAND, color: '#fff' }}><Plus size={14} /> เพิ่มช่อง/เพจ</button>
      )}

      {channels.length === 0 ? (
        <p className="font-body text-sm text-center py-8" style={{ color: C.muted }}>ยังไม่มีช่อง — เพิ่มช่อง/เพจแรกของคุณ เช่น "ช่องวาฬ" แล้วบอกว่าวันนี้ต้องลงวิดีโอ/รูปกี่ชิ้น</p>
      ) : (
        channels.map((c) => (
          <DailyChannelBlock key={c.id} channel={c} tasks={tasks.filter((t) => t.channelId === c.id)} onToggle={toggleTask} onGenerate={generateTask} onQC={runQC} loadingTaskId={loadingTaskId} qcLoadingId={qcLoadingId} onRemove={removeChannel} onGenerateAll={generateAll} generatingAll={generatingAllId === c.id} onQCAll={qcAll} qcAllRunning={qcAllId === c.id} />
        ))
      )}
      <p className="font-mono text-2xs mt-6 leading-relaxed text-center" style={{ color: C.muted }}>* ข้อมูลบันทึกไว้ในฐานข้อมูลแล้ว ไม่หายเมื่อรีเฟรชหรือกลับมาใหม่</p>
    </div>
  );
}

export default function CompanyPortal() {
  const [stage, setStage] = useState('terminal');
  const [accounts, setAccounts] = useState([]);
  const [user, setUser] = useState(null);
  const [activeDept, setActiveDept] = useState(null);
  const [denied, setDenied] = useState(null);
  const [channels, setChannels] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [reminder, setReminder] = useState(null);

  function handleSignup(account) { setAccounts((prev) => [...prev, account]); }
  function handleLogin(account) {
    setAccounts((prev) => prev.map((a) => (a.email === account.email ? { ...a, lastLogin: account.lastLogin || Date.now() } : a)));
    setUser({ name: account.name, clearance: account.clearance, email: account.email });
    setStage('daily');
  }
  async function updateAccountClearance(email, clearance) {
    setAccounts((prev) => prev.map((a) => (a.email === email ? { ...a, clearance } : a)));
    try {
      await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateClearance', email, clearance }) });
    } catch (err) {}
  }
  async function updateProfile(patch) {
    setAccounts((prev) => prev.map((a) => (a.email === user.email ? { ...a, ...patch } : a)));
    if (patch.name) setUser((u) => ({ ...u, name: patch.name }));
    try {
      await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateProfile', email: user.email, patch }) });
    } catch (err) {}
  }

  // โหลดข้อมูลจากฐานข้อมูลตอนเปิดเว็บ (บัญชี + ช่อง/เพจ + งาน + ประวัติ) ลบบัญชีหมดอายุ และเก็บประวัติวันก่อนหน้าถ้าข้ามวันมาแล้ว
  useEffect(() => {
    async function loadAll() {
      try {
        const [accRes, chRes, taskRes, histRes, dateRes] = await Promise.all([
          fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'pruneExpired' }) }),
          fetch('/api/store?key=channels'),
          fetch('/api/store?key=tasks'),
          fetch('/api/store?key=history'),
          fetch('/api/store?key=lastActiveDate'),
        ]);
        const accData = await accRes.json();
        const chData = await chRes.json();
        const taskData = await taskRes.json();
        const histData = await histRes.json();
        const dateData = await dateRes.json();

        const loadedChannels = Array.isArray(chData.value) ? chData.value : [];
        let loadedTasks = Array.isArray(taskData.value) ? taskData.value : [];
        let loadedHistory = Array.isArray(histData.value) ? histData.value : [];
        const loadedLastDate = dateData.value || null;
        const today = todayDateStr();

        if (loadedLastDate && loadedLastDate !== today && loadedTasks.length > 0) {
          const missed = loadedTasks.filter((t) => !t.done).map((t) => {
            const ch = loadedChannels.find((c) => c.id === t.channelId);
            return { channelName: ch ? ch.name : '-', label: t.label };
          });
          const entry = { date: loadedLastDate, totalTasks: loadedTasks.length, doneTasks: loadedTasks.filter((t) => t.done).length, missed };
          if (!loadedHistory.some((h) => h.date === loadedLastDate)) {
            loadedHistory = [...loadedHistory, entry];
          }
          if (missed.length > 0) setReminder(entry);
          loadedTasks = loadedTasks.map((t) => ({ ...t, done: false, content: null, qc: null }));
        }

        setAccounts(Array.isArray(accData.accounts) ? accData.accounts : []);
        setChannels(loadedChannels);
        setTasks(loadedTasks);
        setHistory(loadedHistory);
        setLastActiveDate(today);
      } catch (err) {
        setLastActiveDate(todayDateStr());
      } finally {
        setDataLoaded(true);
      }
    }
    loadAll();
  }, []);

  // บันทึกช่อง/เพจ งานประจำวัน และประวัติ ลงฐานข้อมูลทุกครั้งที่เปลี่ยน (หลังโหลดข้อมูลเสร็จแล้วเท่านั้น)
  useEffect(() => {
    if (!dataLoaded) return;
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'channels', value: channels }) }).catch(() => {});
  }, [channels, dataLoaded]);
  useEffect(() => {
    if (!dataLoaded) return;
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'tasks', value: tasks }) }).catch(() => {});
  }, [tasks, dataLoaded]);
  useEffect(() => {
    if (!dataLoaded) return;
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'history', value: history }) }).catch(() => {});
  }, [history, dataLoaded]);
  useEffect(() => {
    if (!dataLoaded || !lastActiveDate) return;
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'lastActiveDate', value: lastActiveDate }) }).catch(() => {});
  }, [lastActiveDate, dataLoaded]);

  function openDept(dept) {
    if (user.clearance < dept.clearance) { setDenied(dept.id); setTimeout(() => setDenied(null), 1200); return; }
    setActiveDept(dept); setStage('department');
  }
  function logout() { setUser(null); setStage('terminal'); setActiveDept(null); }

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <Loader2 size={28} className="animate-spin" style={{ color: C.blue }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body" style={{ background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display{font-family:'Space Grotesk','IBM Plex Sans Thai',sans-serif;}
        .font-body{font-family:'IBM Plex Sans Thai','Space Grotesk',sans-serif;}
        .font-mono{font-family:'IBM Plex Mono',monospace;}
        .text-2xs{font-size:10px; line-height:1rem;}
        @keyframes fadeIn{from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:translateY(0);}}
        .anim-fade{animation:fadeIn 0.35s ease-out;}
        @keyframes stampIn{from{opacity:0; transform:scale(0.97);} to{opacity:1; transform:scale(1);}}
        .anim-stamp{animation:stampIn 0.25s ease-out;}
        @media (prefers-reduced-motion: reduce){ .anim-fade, .anim-stamp { animation: none; } }
      `}</style>

      {stage === 'terminal' && <Terminal accounts={accounts} onSignup={handleSignup} onLogin={handleLogin} />}

      {stage !== 'terminal' && user && (
        <>
          <Header user={user} stage={stage} setStage={setStage} logout={logout} accounts={accounts} />
          {stage === 'daily' && <DailyWork channels={channels} setChannels={setChannels} tasks={tasks} setTasks={setTasks} reminder={reminder} onDismissReminder={() => setReminder(null)} />}
          {stage === 'directory' && <Directory user={user} denied={denied} onOpen={openDept} />}
          {stage === 'department' && activeDept && <DepartmentView dept={activeDept} onBack={() => setStage('directory')} />}
          {stage === 'calendar' && <CalendarPage history={history} tasks={tasks} channels={channels} />}
          {stage === 'platforms' && <PlatformsPanel />}
          {stage === 'team' && user.clearance === 3 && <TeamPanel accounts={accounts} onUpdateClearance={updateAccountClearance} />}
          {stage === 'profile' && <ProfilePage user={user} accounts={accounts} tasks={tasks} history={history} onUpdateProfile={updateProfile} />}
          {stage === 'security' && <SecurityProtocol />}
        </>
      )}
    </div>
  );
}
