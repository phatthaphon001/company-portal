import React, { useState } from 'react';
import {
  Lock, Unlock, FileText, Radar, Megaphone, Landmark, UserCog, TrendingUp,
  LogOut, Fingerprint, AlertTriangle, KeyRound, ScrollText, ClipboardCheck,
  Bot, ShoppingBag, PlayCircle, AtSign, Music2, Share2, ShieldAlert, Sparkles,
  CheckSquare, Square, Plus, Trash2, Loader2, RefreshCw, ChevronDown, ChevronUp,
  Calendar, Mail, UserPlus, ArrowLeft, Image as ImageIcon, Video as VideoIcon,
  CheckCircle2, XCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const C = {
  bg: '#1E2A30', bgDeep: '#141C21', panel: '#25333A',
  panelLine: 'rgba(231,225,211,0.14)', ink: '#1E2A30',
  text: '#EDEAE0', muted: '#8FA0A6',
  brass: '#B8834D', teal: '#4C7A6B', brick: '#A6432E',
  steel: '#4C6E89', olive: '#8A7B3E', plum: '#7B5C7E', gold: '#C9A227',
};

const CLEARANCE = {
  1: { label: 'ระดับ 1 · ทั่วไป', code: 'LV-1 GENERAL', color: C.steel },
  2: { label: 'ระดับ 2 · หัวหน้างาน', code: 'LV-2 MANAGER', color: C.brass },
  3: { label: 'ระดับ 3 · ผู้บริหาร', code: 'LV-3 EXECUTIVE', color: C.brick },
};

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: C.plum },
  facebook: { label: 'Facebook', color: C.steel },
  youtube: { label: 'YouTube', color: C.brick },
  instagram: { label: 'Instagram', color: C.olive },
  shopee: { label: 'Shopee', color: C.gold },
  other: { label: 'อื่นๆ', color: C.teal },
};

const DEPARTMENTS = [
  {
    id: 'content', th: 'ฝ่ายคอนเทนต์', en: 'CONTENT OPS', clearance: 1,
    icon: FileText, accent: C.brass, manager: 'ผู้จัดการฝ่ายคอนเทนต์',
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
    icon: Radar, accent: C.teal, hasChart: true, manager: 'ผู้จัดการฝ่ายวิจัยและวิเคราะห์ข้อมูล',
    brief: 'เก็บและวิเคราะห์ข้อมูลจากทุกแผนก สรุปผลเชิงลึกให้ผู้บริหารตัดสินใจ',
    roles: [
      { title: 'นักวิเคราะห์ข้อมูล', en: 'Data Analyst', duty: 'รวบรวมข้อมูลจากทุกแผนกมาประมวลผลเป็นรายงาน' },
      { title: 'นักวิจัยตลาด', en: 'Market Researcher', duty: 'ติดตามเทรนด์ คู่แข่ง และพฤติกรรมลูกค้า' },
      { title: 'หัวหน้าสรุปผล', en: 'Performance Lead', duty: 'สรุปภาพรวมผลการดำเนินงานประจำเดือน' },
    ],
  },
  {
    id: 'marketing', th: 'ฝ่ายการตลาด', en: 'MARKETING', clearance: 1,
    icon: Megaphone, accent: C.brick, manager: 'ผู้จัดการฝ่ายการตลาด',
    brief: 'วางแผนแคมเปญและสร้างการเติบโตให้แบรนด์',
    roles: [
      { title: 'นักการตลาดดิจิทัล', en: 'Digital Marketer', duty: 'บริหารแคมเปญโฆษณาบนแพลตฟอร์มออนไลน์' },
      { title: 'นักกลยุทธ์แบรนด์', en: 'Brand Strategist', duty: 'วางทิศทางและภาพลักษณ์แบรนด์ระยะยาว' },
      { title: 'ประสานงานพันธมิตร', en: 'Partnerships', duty: 'ดูแลความสัมพันธ์กับพันธมิตรและช่องทางจัดจำหน่าย' },
    ],
  },
  {
    id: 'sales', th: 'ฝ่ายขาย', en: 'SALES', clearance: 1,
    icon: TrendingUp, accent: C.olive, manager: 'ผู้จัดการฝ่ายขาย',
    brief: 'ปิดการขายและดูแลความสัมพันธ์กับลูกค้า',
    roles: [
      { title: 'ฝ่ายขาย', en: 'Sales Executive', duty: 'ติดต่อและปิดการขายกับลูกค้าใหม่' },
      { title: 'ดูแลลูกค้าเดิม', en: 'Account Manager', duty: 'ดูแลความสัมพันธ์และต่อยอดกับลูกค้าเดิม' },
      { title: 'สนับสนุนการขาย', en: 'Sales Support', duty: 'จัดทำใบเสนอราคาและเอกสารประกอบการขาย' },
    ],
  },
  {
    id: 'qc', th: 'ฝ่ายตรวจสอบคุณภาพ', en: 'QC / AUDIT', clearance: 2,
    icon: ClipboardCheck, accent: C.gold, manager: 'ผู้จัดการฝ่าย QC',
    brief: 'ตรวจสอบความถูกต้องของงานจากทุกแผนกก่อนเผยแพร่หรือส่งมอบ',
    roles: [
      { title: 'ผู้ตรวจสอบคุณภาพ', en: 'QC Reviewer', duty: 'ตรวจสอบความถูกต้องของงานก่อนเผยแพร่หรือส่งมอบลูกค้า' },
      { title: 'ผู้ตรวจสอบมาตรฐาน', en: 'Compliance Checker', duty: 'ตรวจสอบว่าเนื้อหาถูกต้องตามมาตรฐานที่กำหนด' },
      { title: 'ผู้ประสานงานแก้ไข', en: 'Revision Coordinator', duty: 'ประสานงานให้แผนกที่เกี่ยวข้องแก้ไขจุดที่ตรวจพบ' },
    ],
  },
  {
    id: 'hr', th: 'ฝ่ายบุคคล', en: 'PERSONNEL', clearance: 2,
    icon: UserCog, accent: C.plum, manager: 'ผู้จัดการฝ่ายบุคคล',
    brief: 'ดูแลบุคลากรตั้งแต่สรรหาจนถึงสวัสดิการ',
    roles: [
      { title: 'บุคคล', en: 'HR Generalist', duty: 'ดูแลสวัสดิการ การจ้างงาน และเรื่องทั่วไปของพนักงาน' },
      { title: 'สรรหาบุคลากร', en: 'Recruiter', duty: 'สรรหาและคัดเลือกพนักงานใหม่' },
      { title: 'ธุรการ', en: 'Office Admin', duty: 'ดูแลงานเอกสารและการประสานงานภายใน' },
    ],
  },
  {
    id: 'finance', th: 'ฝ่ายการเงิน', en: 'FINANCE', clearance: 3,
    icon: Landmark, accent: C.steel, manager: 'ผู้จัดการฝ่ายการเงิน',
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

const VIDEO_SYS = 'คุณคือฝ่ายคิดคอนเทนต์ เตรียมข้อมูลสำหรับโพสต์คลิปวิดีโอวันนี้ ตอบเป็นภาษาไทยเท่านั้น จัดเป็นหัวข้อตามนี้เป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้ ห้ามทักทาย:\nชื่อคลิป: ...\nคำบรรยาย: ... (ใส่อิโมจิและแฮชแท็กที่เกี่ยวข้อง)\nพรอมต์วิดีโอ: ...\nพรอมต์หน้าปกคลิป: ...';
const IMAGE_SYS = 'คุณคือฝ่ายคิดคอนเทนต์ เตรียมข้อมูลสำหรับโพสต์รูปภาพวันนี้ ตอบเป็นภาษาไทยเท่านั้น จัดเป็นหัวข้อตามนี้เป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้ ห้ามทักทาย:\nชื่อโพสต์: ...\nคำบรรยาย: ... (ใส่อิโมจิและแฮชแท็กที่เกี่ยวข้อง)\nพรอมต์รูปภาพ: ...';
const QC_VIDEO_SYS = 'คุณคือฝ่าย QC ตรวจสอบเนื้อหาที่เตรียมไว้สำหรับโพสต์คลิปวิดีโอ ก่อนที่ทีมจะเอาไปเจนจริง ตรวจว่าชื่อคลิป คำบรรยาย พรอมต์วิดีโอ และพรอมต์หน้าปก เหมาะสม ชัดเจน ไม่ผิดพลาด สอดคล้องกัน และคำบรรยายมีแฮชแท็ก/อิโมจิหรือยัง ตอบเป็นภาษาไทย บรรทัดแรกขึ้นต้นด้วยคำว่า "ผ่าน" หรือ "ควรแก้ไข" ตามด้วยเหตุผลสั้นๆ ไม่เกิน 3 บรรทัด';
const QC_IMAGE_SYS = 'คุณคือฝ่าย QC ตรวจสอบเนื้อหาที่เตรียมไว้สำหรับโพสต์รูปภาพ ก่อนที่ทีมจะเอาไปเจนจริง ตรวจว่าชื่อโพสต์ คำบรรยาย และพรอมต์รูปภาพ เหมาะสม ชัดเจน ไม่ผิดพลาด สอดคล้องกัน และคำบรรยายมีแฮชแท็ก/อิโมจิหรือยัง ตอบเป็นภาษาไทย บรรทัดแรกขึ้นต้นด้วยคำว่า "ผ่าน" หรือ "ควรแก้ไข" ตามด้วยเหตุผลสั้นๆ ไม่เกิน 3 บรรทัด';

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function todayLabel() {
  const d = new Date();
  return `วัน${THAI_DAYS[d.getDay()]}ที่ ${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

async function callClaude(system, content) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 500, system, messages: [{ role: 'user', content }] }),
  });
  const data = await response.json();
  if (data?.error) throw new Error(data.error?.message || 'เกิดข้อผิดพลาด');
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  return text || '(ไม่มีคำตอบ)';
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

function CornerMarks({ color }) {
  const base = { position: 'absolute', width: 12, height: 12, borderColor: color };
  return (
    <>
      <span style={{ ...base, top: 5, left: 5, borderTop: '2px solid', borderLeft: '2px solid' }} />
      <span style={{ ...base, top: 5, right: 5, borderTop: '2px solid', borderRight: '2px solid' }} />
      <span style={{ ...base, bottom: 5, left: 5, borderBottom: '2px solid', borderLeft: '2px solid' }} />
      <span style={{ ...base, bottom: 5, right: 5, borderBottom: '2px solid', borderRight: '2px solid' }} />
    </>
  );
}

function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="font-mono text-2xs tracking-widest uppercase px-2 py-1" style={{ color: active ? C.text : C.muted, borderBottom: active ? `2px solid ${C.brass}` : '2px solid transparent' }}>
      {label}
    </button>
  );
}

function Header({ user, stage, setStage, logout }) {
  const cl = CLEARANCE[user.clearance];
  return (
    <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ background: C.bgDeep, borderBottom: `1px solid ${C.panelLine}` }}>
      <div className="flex items-center gap-1 flex-wrap">
        <NavTab label="งานประจำวัน" active={stage === 'daily'} onClick={() => setStage('daily')} />
        <NavTab label="Directory" active={stage === 'directory' || stage === 'department'} onClick={() => setStage('directory')} />
        <NavTab label="แพลตฟอร์ม" active={stage === 'platforms'} onClick={() => setStage('platforms')} />
        <NavTab label="Protocol" active={stage === 'security'} onClick={() => setStage('security')} />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="font-body text-sm" style={{ color: C.text }}>{user.name}</div>
          <div className="font-mono text-2xs tracking-wider" style={{ color: cl.color }}>{cl.code}</div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: cl.color, boxShadow: `0 0 8px ${cl.color}` }} />
        <button onClick={logout} className="p-2" style={{ color: C.muted }} aria-label="ออกจากระบบ"><LogOut size={16} /></button>
      </div>
    </div>
  );
}

function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 anim-fade" style={{ background: `radial-gradient(${C.panelLine} 1px, transparent 1px) ${C.bg}`, backgroundSize: '22px 22px' }}>
      <div className="w-full max-w-sm relative" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
        <CornerMarks color={C.brass} />
        {children}
      </div>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <div>
      <label className="font-mono text-2xs tracking-widest uppercase block mb-1" style={{ color: C.muted }}>{label}</label>
      <input {...props} className="w-full px-3 py-2 font-body text-sm outline-none" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.panelLine}` }} />
    </div>
  );
}

function Terminal({ accounts, onSignup, onLogin }) {
  const [mode, setMode] = useState('login');
  const [loginStep, setLoginStep] = useState('credentials');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', code: '' });
  const [loginError, setLoginError] = useState('');
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [signupError, setSignupError] = useState('');
  const [signupDone, setSignupDone] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotDone, setForgotDone] = useState(false);

  function submitCredentials(e) {
    e.preventDefault();
    const acc = accounts.find((a) => a.email === loginForm.email && a.password === loginForm.password);
    if (!acc) { setLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); return; }
    setLoginError('');
    setLoginStep('verify');
  }
  function submitVerify(e) {
    e.preventDefault();
    if (loginForm.code.trim().length < 6) return;
    const acc = accounts.find((a) => a.email === loginForm.email);
    onLogin(acc);
  }
  function submitSignup(e) {
    e.preventDefault();
    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password) { setSignupError('กรอกข้อมูลให้ครบ'); return; }
    if (signupForm.password !== signupForm.confirm) { setSignupError('รหัสผ่านไม่ตรงกัน'); return; }
    if (accounts.some((a) => a.email === signupForm.email)) { setSignupError('อีเมลนี้ถูกใช้แล้ว'); return; }
    onSignup({ name: signupForm.name.trim(), email: signupForm.email.trim(), password: signupForm.password, clearance: 3 });
    setSignupError('');
    setSignupDone(true);
  }

  if (mode === 'signup') {
    return (
      <AuthShell>
        <div className="px-6 pt-8 pb-6 text-center">
          <UserPlus size={28} style={{ color: C.brass, margin: '0 auto' }} />
          <h1 className="font-display uppercase tracking-widest text-sm mt-3" style={{ color: C.text }}>Create Account</h1>
          <p className="font-body text-xs mt-1" style={{ color: C.muted }}>สร้างบัญชีใหม่สำหรับเว็บไซต์ส่วนตัวของคุณ</p>
        </div>
        {signupDone ? (
          <div className="px-6 pb-6 text-center">
            <p className="font-body text-sm mb-4" style={{ color: C.teal }}>สร้างบัญชีสำเร็จ (จำลอง)</p>
            <button onClick={() => { setMode('login'); setLoginForm({ ...loginForm, email: signupForm.email }); }} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase" style={{ background: C.brass, color: C.ink }}>ไปหน้าเข้าสู่ระบบ</button>
          </div>
        ) : (
          <form onSubmit={submitSignup} className="px-6 pb-6 space-y-3">
            <TextField label="ชื่อ" value={signupForm.name} onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} placeholder="ชื่อของคุณ" required />
            <TextField label="อีเมล" type="email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} placeholder="you@email.com" required />
            <TextField label="รหัสผ่าน" type="password" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} placeholder="••••••••" required />
            <TextField label="ยืนยันรหัสผ่าน" type="password" value={signupForm.confirm} onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })} placeholder="••••••••" required />
            {signupError && <p className="font-mono text-2xs" style={{ color: C.brick }}>{signupError}</p>}
            <button type="submit" className="w-full py-2.5 font-mono text-xs tracking-widest uppercase" style={{ background: C.brass, color: C.ink }}>สร้างบัญชี</button>
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
          <Mail size={28} style={{ color: C.brass, margin: '0 auto' }} />
          <h1 className="font-display uppercase tracking-widest text-sm mt-3" style={{ color: C.text }}>Reset Password</h1>
          <p className="font-body text-xs mt-1" style={{ color: C.muted }}>กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์รีเซ็ตให้</p>
        </div>
        {forgotDone ? (
          <div className="px-6 pb-6 text-center">
            <p className="font-body text-sm mb-1" style={{ color: C.teal }}>ถ้ามีบัญชีนี้ในระบบ เราได้ส่งลิงก์รีเซ็ตไปที่อีเมลแล้ว</p>
            <p className="font-mono text-2xs mb-4" style={{ color: C.muted }}>(จำลอง — ยังไม่มีระบบส่งอีเมลจริง)</p>
            <button onClick={() => setMode('login')} className="w-full py-2.5 font-mono text-xs tracking-widest uppercase" style={{ background: C.brass, color: C.ink }}>กลับไปเข้าสู่ระบบ</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setForgotDone(true); }} className="px-6 pb-6 space-y-3">
            <TextField label="อีเมล" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@email.com" required />
            <button type="submit" className="w-full py-2.5 font-mono text-xs tracking-widest uppercase" style={{ background: C.brass, color: C.ink }}>ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
            <button type="button" onClick={() => setMode('login')} className="w-full font-mono text-2xs tracking-widest flex items-center justify-center gap-1" style={{ color: C.muted }}><ArrowLeft size={11} /> กลับไปเข้าสู่ระบบ</button>
          </form>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="px-6 pt-8 pb-6 text-center">
        <Fingerprint size={30} style={{ color: C.brass, margin: '0 auto' }} />
        <h1 className="font-display uppercase tracking-widest text-sm mt-3" style={{ color: C.text }}>Access Terminal</h1>
        <p className="font-body text-xs mt-1" style={{ color: C.muted }}>
          {loginStep === 'credentials' ? 'เข้าสู่ระบบเว็บไซต์ส่วนตัวของคุณ' : 'กรอกรหัสยืนยันตัวตนขั้นที่สอง'}
        </p>
      </div>

      {loginStep === 'credentials' && (
        <form onSubmit={submitCredentials} className="px-6 pb-6 space-y-3">
          <TextField label="อีเมล" type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@email.com" required />
          <TextField label="รหัสผ่าน" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" required />
          {loginError && <p className="font-mono text-2xs" style={{ color: C.brick }}>{loginError}</p>}
          <button type="submit" className="w-full py-2.5 font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2" style={{ background: C.brass, color: C.ink }}><KeyRound size={14} /> ถัดไป</button>
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
            <input value={loginForm.code} onChange={(e) => setLoginForm({ ...loginForm, code: e.target.value })} placeholder="000000" maxLength={6} className="w-full px-3 py-2 font-mono text-lg tracking-widest text-center outline-none" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.panelLine}` }} required />
            <p className="font-mono text-2xs mt-2" style={{ color: C.muted }}>* สาธิต: กรอกตัวเลขใดก็ได้ 6 หลัก ระบบจริงจะส่งรหัสผ่าน SMS/อีเมลที่ลงทะเบียนไว้</p>
          </div>
          <button type="submit" className="w-full py-2.5 font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2" style={{ background: C.brass, color: C.ink }}><ShieldAlert size={14} /> ยืนยันตัวตน</button>
          <button type="button" onClick={() => setLoginStep('credentials')} className="w-full font-mono text-2xs tracking-widest" style={{ color: C.muted }}>← กลับ</button>
        </form>
      )}
      <div className="px-6 pb-5"><p className="font-mono text-2xs leading-relaxed" style={{ color: C.muted }}>* ต้นแบบ UI จำลอง บัญชีเก็บไว้ชั่วคราวในเบราว์เซอร์ ยังไม่มีฐานข้อมูลจริง</p></div>
    </AuthShell>
  );
}

function DeptCard({ dept, userClearance, denied, onOpen }) {
  const Icon = dept.icon;
  const locked = userClearance < dept.clearance;
  const isDenied = denied === dept.id;
  return (
    <button onClick={() => onOpen(dept)} className="relative text-left p-4 transition-transform" style={{ background: C.panel, border: `1px solid ${isDenied ? C.brick : C.panelLine}`, opacity: locked ? 0.55 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}>
      <CornerMarks color={locked ? C.muted : dept.accent} />
      <div className="flex items-start justify-between mb-3">
        <Icon size={22} style={{ color: locked ? C.muted : dept.accent }} />
        {locked ? <Lock size={16} style={{ color: C.muted }} /> : <Unlock size={16} style={{ color: dept.accent }} />}
      </div>
      <div className="font-mono text-2xs tracking-widest" style={{ color: dept.accent }}>{dept.en}</div>
      <div className="font-body text-base mt-0.5" style={{ color: C.text }}>{dept.th}</div>
      <p className="font-body text-xs mt-2 leading-relaxed" style={{ color: C.muted }}>{dept.brief}</p>
      <div className="flex items-center gap-1 mt-3"><Bot size={12} style={{ color: C.muted }} /><span className="font-mono text-2xs" style={{ color: C.muted }}>{dept.manager} · ดำเนินการโดย AI ได้</span></div>
      <div className="font-mono text-2xs tracking-wider mt-2" style={{ color: locked ? C.brick : C.muted }}>ต้องการสิทธิ์ {CLEARANCE[dept.clearance].label}</div>
      {isDenied && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-1 anim-fade" style={{ background: 'rgba(20,28,33,0.92)' }}>
          <AlertTriangle size={18} style={{ color: C.brick }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.brick }}>ACCESS DENIED</span>
        </div>
      )}
    </button>
  );
}

function Directory({ user, denied, onOpen }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="mb-6"><div className="font-mono text-2xs tracking-widest" style={{ color: C.muted }}>DEPARTMENT DIRECTORY</div><h2 className="font-body text-xl mt-1" style={{ color: C.text }}>เลือกแผนกที่ต้องการเข้าถึง</h2></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{DEPARTMENTS.map((d) => <DeptCard key={d.id} dept={d} userClearance={user.clearance} denied={denied} onOpen={onOpen} />)}</div>
    </div>
  );
}

function RoleFile({ role, index, accent }) {
  return (
    <div className="flex gap-4 p-4" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
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
      <div className="relative p-5 mb-6" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
        <CornerMarks color={dept.accent} />
        <div className="flex items-center gap-3"><Icon size={26} style={{ color: dept.accent }} /><div><div className="font-mono text-2xs tracking-widest" style={{ color: dept.accent }}>{dept.en}</div><div className="font-body text-lg" style={{ color: C.text }}>{dept.th}</div></div></div>
        <p className="font-body text-sm mt-3" style={{ color: C.muted }}>{dept.brief}</p>
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.panelLine}` }}><Bot size={14} style={{ color: dept.accent }} /><span className="font-body text-xs" style={{ color: C.text }}>{dept.manager}</span><span className="font-mono text-2xs" style={{ color: C.muted }}>· ดำเนินการโดย AI ภายใต้การกำกับของคุณ</span></div>
      </div>
      <div className="space-y-3 mb-6">{dept.roles.map((r, i) => <RoleFile key={r.en} role={r} index={i} accent={dept.accent} />)}</div>
      {dept.hasChart && (
        <div className="p-5" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: dept.accent }}>สรุปผลรายเดือน (ข้อมูลตัวอย่าง)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA}>
              <CartesianGrid stroke={C.panelLine} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={{ stroke: C.panelLine }} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={{ stroke: C.panelLine }} tickLine={false} />
              <Tooltip contentStyle={{ background: C.bgDeep, border: `1px solid ${C.panelLine}`, fontSize: 12 }} labelStyle={{ color: C.text }} />
              <Bar dataKey="output" fill={dept.accent} radius={[2, 2, 0, 0]} />
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
      <div className="flex items-center gap-2 mb-1"><Share2 size={18} style={{ color: C.brass }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.brass }}>PLATFORM LINKS</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>การเชื่อมต่อแพลตฟอร์ม</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>การเชื่อมต่อจริงต้องลงทะเบียน API/OAuth ของแต่ละแพลตฟอร์มเอง หน้านี้แสดงสถานะตัวอย่างเท่านั้น</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => { const Icon = p.icon; return (
          <div key={p.name} className="p-4 flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
            <Icon size={20} style={{ color: C.muted }} />
            <div className="flex-1"><div className="font-body text-sm" style={{ color: C.text }}>{p.name}</div><div className="font-mono text-2xs" style={{ color: C.muted }}>{p.note}</div></div>
            <span className="font-mono text-2xs px-2 py-1" style={{ color: C.muted, border: `1px solid ${C.panelLine}` }}>ยังไม่เชื่อมต่อ</span>
          </div>
        );})}
      </div>
    </div>
  );
}

function SecurityProtocol() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><ScrollText size={18} style={{ color: C.brass }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.brass }}>SECURITY PROTOCOL</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>มาตรการความปลอดภัยสำหรับระบบจริง</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>หน้านี้เป็นข้อมูลอ้างอิง — ต้นแบบที่คุณกำลังดูอยู่ยังไม่มีระบบยืนยันตัวตนหรือฐานข้อมูลจริง</p>
      <div className="space-y-3">
        {SECURITY_PROTOCOL.map((item, i) => (
          <div key={item.title} className="relative p-4 pl-14" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
            <span className="absolute left-4 top-4 font-mono text-xs w-7 h-7 flex items-center justify-center" style={{ color: C.brass, border: `1px solid ${C.brass}` }}>{String(i + 1).padStart(2, '0')}</span>
            <div className="font-body text-sm" style={{ color: C.text }}>{item.title}</div>
            <p className="font-body text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ done, total, color }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div style={{ width: '100%', height: 6, background: C.bgDeep, border: `1px solid ${C.panelLine}` }}><div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s ease' }} /></div>
      <div className="font-mono text-2xs mt-1" style={{ color: C.muted }}>{done}/{total} เสร็จวันนี้</div>
    </div>
  );
}

function VerdictBox({ verdict }) {
  if (!verdict) return null;
  return (
    <div className="p-2 mt-1.5" style={{ border: `1px solid ${verdict.passed ? C.teal : C.brick}` }}>
      <div className="flex items-center gap-2 mb-1">
        {verdict.passed ? <CheckCircle2 size={13} style={{ color: C.teal }} /> : <XCircle size={13} style={{ color: C.brick }} />}
        <span className="font-mono text-2xs" style={{ color: verdict.passed ? C.teal : C.brick }}>{verdict.passed ? 'QC ผ่าน' : 'QC ให้แก้ไข'}</span>
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
    <div className="p-3" style={{ borderTop: `1px solid ${C.panelLine}` }}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task.id)} style={{ color: task.done ? C.teal : C.muted }} className="mt-0.5 shrink-0">{task.done ? <CheckSquare size={18} /> : <Square size={18} />}</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><Icon size={13} style={{ color: C.muted }} /><span className="font-body text-sm" style={{ color: task.done ? C.muted : C.text, textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</span></div>
          {!c ? (
            <button onClick={() => onGenerate(task)} disabled={loading} className="mt-2 font-mono text-2xs px-3 py-1.5 flex items-center gap-1" style={{ background: C.brass, color: C.ink, opacity: loading ? 0.6 : 1 }}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI เตรียมเนื้อหา
            </button>
          ) : (
            <div className="mt-2 space-y-1.5">
              {hasFields ? (
                <>
                  {c.title && <div><span className="font-mono text-2xs" style={{ color: C.brass }}>ชื่อ: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.title}</span></div>}
                  {c.caption && <div><span className="font-mono text-2xs" style={{ color: C.brass }}>คำบรรยาย: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.caption}</span></div>}
                  {c.videoPrompt && <div><span className="font-mono text-2xs" style={{ color: C.teal }}>พรอมต์วิดีโอ: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.videoPrompt}</span></div>}
                  {c.coverPrompt && <div><span className="font-mono text-2xs" style={{ color: C.gold }}>พรอมต์หน้าปก: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.coverPrompt}</span></div>}
                  {c.imagePrompt && <div><span className="font-mono text-2xs" style={{ color: C.gold }}>พรอมต์รูปภาพ: </span><span className="font-body text-xs" style={{ color: C.text }}>{c.imagePrompt}</span></div>}
                </>
              ) : (
                <pre className="font-body text-xs whitespace-pre-wrap" style={{ color: C.text, fontFamily: 'inherit' }}>{c.raw}</pre>
              )}
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => onGenerate(task)} disabled={loading} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.muted }}>
                  {loading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} สร้างใหม่
                </button>
                {!task.qc && (
                  <button onClick={() => onQC(task)} disabled={qcLoading} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.gold }}>
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
    <div className="relative p-4 mb-4" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
      <CornerMarks color={C.brass} />
      <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.brass }}>เพิ่มช่อง/เพจใหม่</div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อช่อง เช่น ช่องวาฬ" className="w-full px-3 py-2 font-body text-sm mb-2 outline-none" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.panelLine}` }} />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 font-body text-sm mb-2 outline-none" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.panelLine}` }}>
        {Object.entries(PLATFORM_META).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}
      </select>
      <div className="flex gap-2 mb-3">
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>วิดีโอ/วัน</label><input type="number" min="0" value={videos} onChange={(e) => setVideos(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 font-body text-sm outline-none" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.panelLine}` }} /></div>
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>รูปภาพ/วัน</label><input type="number" min="0" value={images} onChange={(e) => setImages(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 font-body text-sm outline-none" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.panelLine}` }} /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (name.trim() && (videos > 0 || images > 0)) { onAdd(name.trim(), platform, videos, images); onClose(); } }} className="font-mono text-2xs px-3 py-2 flex items-center gap-1" style={{ background: C.brass, color: C.ink }}><Plus size={13} /> เพิ่มช่อง</button>
        <button onClick={onClose} className="font-mono text-2xs px-3 py-2" style={{ color: C.muted, border: `1px solid ${C.panelLine}` }}>ยกเลิก</button>
      </div>
    </div>
  );
}

function DailyChannelBlock({ channel, tasks, onToggle, onGenerate, onQC, loadingTaskId, qcLoadingId, onRemove, onGenerateAll, generatingAll, onQCAll, qcAllRunning }) {
  const [open, setOpen] = useState(true);
  const meta = PLATFORM_META[channel.platform];
  const done = tasks.filter((t) => t.done).length;
  const qcable = tasks.some((t) => t.content && !t.qc);
  return (
    <div className="relative mb-4" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
      <CornerMarks color={meta.color} />
      <div className="p-4 flex items-center justify-between gap-3">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2"><span className="font-mono text-2xs px-2 py-0.5 shrink-0" style={{ color: meta.color, border: `1px solid ${meta.color}` }}>{meta.label}</span><span className="font-body text-sm truncate" style={{ color: C.text }}>{channel.name}</span></div>
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
            <button onClick={() => onGenerateAll(channel)} disabled={generatingAll} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1" style={{ background: meta.color, color: C.ink, opacity: generatingAll ? 0.6 : 1 }}>
              {generatingAll ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} เตรียมเนื้อหาให้ครบทุกงานวันนี้
            </button>
            {qcable && (
              <button onClick={() => onQCAll(channel)} disabled={qcAllRunning} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1" style={{ background: C.gold, color: C.ink, opacity: qcAllRunning ? 0.6 : 1 }}>
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

function DailyWork() {
  const [channels, setChannels] = useState([]);
  const [tasks, setTasks] = useState([]);
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
      const sys = task.type === 'video' ? QC_VIDEO_SYS : QC_IMAGE_SYS;
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
      <div className="flex items-center gap-2 mb-1"><Calendar size={14} style={{ color: C.brass }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.brass }}>{todayLabel()}</span></div>
      <h2 className="font-body text-xl" style={{ color: C.text }}>งานประจำวัน</h2>
      <div className="flex items-center justify-between gap-3 mt-3 mb-6">
        <div className="flex-1 max-w-xs"><ProgressBar done={totalDone} total={tasks.length} color={C.brass} /></div>
        <button onClick={resetToday} className="font-mono text-2xs px-2 py-1.5 flex items-center gap-1 shrink-0" style={{ color: C.muted, border: `1px solid ${C.panelLine}` }}>เริ่มวันใหม่</button>
      </div>

      {showAdd ? (
        <AddChannelForm onAdd={addChannel} onClose={() => setShowAdd(false)} />
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full mb-4 font-mono text-2xs px-3 py-2.5 flex items-center justify-center gap-2" style={{ background: C.brass, color: C.ink }}><Plus size={14} /> เพิ่มช่อง/เพจ</button>
      )}

      {channels.length === 0 ? (
        <p className="font-body text-sm text-center py-8" style={{ color: C.muted }}>ยังไม่มีช่อง — เพิ่มช่อง/เพจแรกของคุณ เช่น "ช่องวาฬ" แล้วบอกว่าวันนี้ต้องลงวิดีโอ/รูปกี่ชิ้น</p>
      ) : (
        channels.map((c) => (
          <DailyChannelBlock key={c.id} channel={c} tasks={tasks.filter((t) => t.channelId === c.id)} onToggle={toggleTask} onGenerate={generateTask} onQC={runQC} loadingTaskId={loadingTaskId} qcLoadingId={qcLoadingId} onRemove={removeChannel} onGenerateAll={generateAll} generatingAll={generatingAllId === c.id} onQCAll={qcAll} qcAllRunning={qcAllId === c.id} />
        ))
      )}
      <p className="font-mono text-2xs mt-6 leading-relaxed text-center" style={{ color: C.muted }}>* ต้นแบบนี้ยังไม่มีฐานข้อมูล เช็คลิสต์จะหายเมื่อรีเฟรชหน้า</p>
    </div>
  );
}

export default function CompanyPortal() {
  const [stage, setStage] = useState('terminal');
  const [accounts, setAccounts] = useState([]);
  const [user, setUser] = useState(null);
  const [activeDept, setActiveDept] = useState(null);
  const [denied, setDenied] = useState(null);

  function handleSignup(account) { setAccounts((prev) => [...prev, account]); }
  function handleLogin(account) { setUser({ name: account.name, clearance: account.clearance }); setStage('daily'); }

  function openDept(dept) {
    if (user.clearance < dept.clearance) { setDenied(dept.id); setTimeout(() => setDenied(null), 1200); return; }
    setActiveDept(dept); setStage('department');
  }
  function logout() { setUser(null); setStage('terminal'); setActiveDept(null); }

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
          <Header user={user} stage={stage} setStage={setStage} logout={logout} />
          {stage === 'daily' && <DailyWork />}
          {stage === 'directory' && <Directory user={user} denied={denied} onOpen={openDept} />}
          {stage === 'department' && activeDept && <DepartmentView dept={activeDept} onBack={() => setStage('directory')} />}
          {stage === 'platforms' && <PlatformsPanel />}
          {stage === 'security' && <SecurityProtocol />}
        </>
      )}
    </div>
  );
}
