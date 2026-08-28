import React, { useState, useEffect, useRef } from 'react';
import {
  Lock, Unlock, FileText, Radar, Megaphone, Landmark, UserCog, TrendingUp,
  LogOut, AlertTriangle, KeyRound, ScrollText, ClipboardCheck,
  Bot, ShoppingBag, PlayCircle, AtSign, Music2, Share2, ShieldAlert, Sparkles,
  CheckSquare, Square, Plus, Trash2, Loader2, RefreshCw, ChevronDown, ChevronUp,
  Calendar, Mail, UserPlus, ArrowLeft, Image as ImageIcon, Video as VideoIcon,
  CheckCircle2, XCircle, Users, Camera, Settings as SettingsIcon, Palette, Type,
  X, Upload, PieChart as PieChartIcon, Download, Undo2, Redo2,
  Target, Trash, RotateCcw, Activity, Search, Flame, Award, Gauge,
  Compass, ShoppingCart, Mic2, Clapperboard, ArrowRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
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

const CHANNEL_COLORS = [C.blue, C.violet, C.emerald, C.orange, C.pink, C.cyan, C.teal, C.red];

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

// สถานะจริงของแต่ละข้อในระบบนี้ (กดที่การ์ดเพื่อดูรายละเอียด)
const PROTOCOL_STATUS = [
  { done: true,  detail: 'ใช้ scrypt แฮชรหัสผ่านพร้อม salt เฉพาะรายบัญชี รหัสเดิมที่เคยเก็บเป็นข้อความล้วนถูกอัปเกรดอัตโนมัติเมื่อผู้ใช้ล็อกอินครั้งถัดไป', how: 'โค้ดอยู่ใน /api/_lib.js ฟังก์ชัน hashPassword และ verifyPassword — ถอดกลับไม่ได้แม้แต่เจ้าของระบบ ถ้าผู้ใช้ลืมรหัส ให้ใช้ปุ่ม "ตั้งรหัสใหม่" ในศูนย์ควบคุม' },
  { done: true,  detail: 'Vercel บังคับ HTTPS ให้ทุกโดเมนอัตโนมัติอยู่แล้ว', how: 'ไม่ต้องตั้งค่าเพิ่ม แต่ถ้าใช้โดเมนของตัวเองในอนาคต ต้องเปิด HSTS ในหน้าตั้งค่าโดเมนของ Vercel' },
  { done: true,  detail: 'ทุกคำสั่งตรวจสิทธิ์ที่เซิร์ฟเวอร์ ไม่ใช่แค่ซ่อนปุ่ม — ปิดฟีเจอร์แล้วผู้ใช้ยิงคำสั่งตรงก็ยังโดนปฏิเสธ', how: 'ทุก endpoint เรียก requireUser() ก่อน แล้วเช็ค clearance/isOwner ก่อนทำงานทุกครั้ง' },
  { done: true,  detail: 'ใช้โทเค็นที่เซ็นด้วย HMAC-SHA256 อายุ 7 วัน ปลอมไม่ได้ เปลี่ยนรหัสผ่านแล้วโทเค็นเก่าใช้ไม่ได้ทันที', how: 'ยังไม่ได้ย้ายไปเป็นคุกกี้ httpOnly เพราะระบบเป็น API ล้วน หากต้องการความปลอดภัยสูงสุดในอนาคต ควรย้ายไปคุกกี้ + sameSite' },
  { done: true,  detail: 'ข้อมูลเก็บเป็น JSON ใน Redis จึงไม่มีความเสี่ยง SQL Injection · React กัน XSS ให้อัตโนมัติ · ทุกคำสั่งต้องมีโทเค็นจึงกัน CSRF ได้', how: 'ยังควรเพิ่มการจำกัดความยาว input ในบางช่องเพื่อกันข้อมูลใหญ่เกินจำเป็น' },
  { done: false, detail: 'ยังไม่มีระบบ "ลืมรหัสผ่าน" ให้ผู้ใช้กดเอง', how: 'ตอนนี้ใช้วิธีให้เจ้าของระบบตั้งรหัสใหม่ให้แทน — จะทำระบบลืมรหัสผ่านได้ต้องมีอีเมลที่ส่งหาคนอื่นได้ก่อน (ต้องยืนยันโดเมนกับ Resend)' },
  { done: false, detail: 'มีระบบยืนยันรหัสทางอีเมล (OTP) แล้ว แต่ตอนนี้ปิดใช้งานชั่วคราว เพราะยังส่งอีเมลหาคนอื่นไม่ได้', how: 'ซื้อโดเมนแล้วยืนยันที่ resend.com/domains → เปลี่ยนผู้ส่งเป็นโดเมนตัวเอง → เปิดสวิตช์ OTP กลับในศูนย์ควบคุม' },
  { done: true,  detail: 'บันทึกกิจกรรมเก็บ 300 รายการล่าสุด และฟีดการใช้งานเก็บ 500 รายการ ดูได้ในศูนย์ควบคุม', how: 'บันทึกทุกครั้งที่มีการล็อกอิน สมัคร เปลี่ยนสิทธิ์ แบน เติมโทเค็น และเรียกใช้ AI' },
  { done: true,  detail: 'จำกัดล็อกอินผิด 10 ครั้ง/15 นาที · สมัคร 5 ครั้ง/ชม./IP · ขอ OTP 5 ครั้ง/ชม. · เกิน 15 ครั้งน่าสงสัยใน 1 ชม. แบนอัตโนมัติ 24 ชม.', how: 'ปรับตัวเลขได้ในไฟล์ /api/_lib.js ฟังก์ชัน rateLimit และ recordSuspicious' },
  { done: true,  detail: 'คีย์ Gemini เก็บฝั่งเซิร์ฟเวอร์เท่านั้น ไม่เคยส่งกลับมาหน้าเว็บ แม้แต่เจ้าของระบบก็เห็นแค่ว่า "มีคีย์แล้ว"', how: 'ฟังก์ชัน sanitize() ตัดคีย์และรหัสผ่านออกก่อนส่งข้อมูลบัญชีทุกครั้ง' },
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

const OUTLINE_SYS = 'คุณคือฝ่ายคิดคอนเทนต์ ช่วยคิดโครงเรื่อง/แนวคิดคอนเทนต์สั้นๆ (2-4 บรรทัด) เป็นภาษาไทย ถ้าผู้ใช้ระบุสไตล์หรือแนวที่ต้องการมา ต้องยึดตามนั้นเป็นหลักเสมอ (เช่น ถ้าขอการ์ตูนเด็ก โครงเรื่องต้องเป็นการ์ตูนเด็ก ไม่ใช่แค่พูดถึงหัวข้อช่องเฉยๆ) ห้ามซ้ำกับหัวข้อที่เคยทำไปแล้วที่ผู้ใช้แจ้งมาในข้อความ ตอบเฉพาะเนื้อหาโครงเรื่องเท่านั้น ห้ามทักทาย ห้ามใส่หัวข้อกำกับ ห้ามใส่เครื่องหมายคำพูด';
const PROMPTS_SYS_VIDEO = 'คุณคือฝ่ายคิดคอนเทนต์คลิปวิดีโอสั้น จากโครงเรื่องและรายละเอียดที่ให้มา ให้สร้าง 3 อย่างแยกกันชัดเจน ห้ามปนกัน: (1) videoPrompt = prompt สำหรับ AI สร้างวิดีโอ/ความเคลื่อนไหวโดยตรง ถ้าข้อความระบุ "จำนวนฉากที่ควรแบ่ง" มากกว่า 1 ฉาก ให้แบ่งเป็นฉากลำดับชัดเจนรูปแบบ "Scene 1: ... Scene 2: ... Scene 3: ..." แต่ละฉากยาวประมาณ 3-5 วินาที บรรยายแยกฉากละเอียดพอเอาไปสร้างทีละฉากแล้วต่อกันได้จริง ถ้าแค่ 1 ฉากให้เขียนต่อเนื่องปกติ (2) coverPrompt = prompt สำหรับสร้างภาพหน้าปก/thumbnail ที่จะโชว์บนแพลตฟอร์ม เป็นภาพนิ่งภาพเดียว (3) sourceImagePrompt = prompt สำหรับสร้างภาพนิ่งตั้งต้นภาพเดียว (ไม่ใช่หน้าปก) ที่จะเอาไปใช้กับ AI แบบ image-to-video เพื่อสร้างความเคลื่อนไหวต่อ เขียน prompt ทั้ง 3 เป็นภาษาอังกฤษที่ AI สร้างภาพ/วิดีโอเข้าใจง่าย ระบุสไตล์ให้ชัดเจน ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ ```json รูปแบบ: {"videoPrompt": "...", "coverPrompt": "...", "sourceImagePrompt": "..."}';
const PROMPTS_SYS_IMAGE = 'คุณคือฝ่ายคิดคอนเทนต์โพสต์รูปภาพ จากโครงเรื่องและรายละเอียดที่ให้มา ให้สร้าง prompt สำหรับ AI สร้างภาพโพสต์ เขียน prompt เป็นภาษาอังกฤษที่ AI สร้างภาพเข้าใจง่าย ระบุสไตล์และรายละเอียดให้ชัดเจน ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ ```json รูปแบบ: {"imagePrompt": "..."}';
const META_SYS = 'คุณคือฝ่ายการตลาดโซเชียลมีเดีย จากโครงเรื่องที่ให้มา ให้สร้างชื่อคลิป/โพสต์ คำบรรยายสั้นๆ ใส่อิโมจิ และแฮชแท็ก เป็น 3 ภาษา (ไทย อังกฤษ จีน) ทั้งชื่อและคำบรรยายต้องมีครบทั้ง 3 ภาษา ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ ```json รูปแบบ: {"titleTh":"...","titleEn":"...","titleZh":"...","captionTh":"...","captionEn":"...","captionZh":"...","hashtagsTh":"...","hashtagsEn":"...","hashtagsZh":"..."}';
const QC_NOTE = 'หมายเหตุ: ระบบไม่สามารถเปิดดูวิดีโอ/รูปภาพจริงจากลิงก์ได้ ตรวจได้แค่จากข้อมูลที่กรอกในระบบเท่านั้น';
const QC_SYS_VIDEO = `คุณคือฝ่าย QC ตรวจสอบเนื้อหาที่เตรียมไว้สำหรับโพสต์คลิปวิดีโอ จากโครงเรื่อง พรอมต์วิดีโอ พรอมต์หน้าปก ชื่อคลิป และคำบรรยายที่ให้มา ตรวจว่าเหมาะสม ชัดเจน สอดคล้องกัน ไม่เข้าข่ายผิดกฎทั่วไปของแพลตฟอร์มโซเชียล (เนื้อหารุนแรง ล่อแหลม ผิดกฎหมาย ฯลฯ) ตอบเป็นภาษาไทย บรรทัดแรกขึ้นต้นด้วยคำว่า "ผ่าน" หรือ "ควรแก้ไข" ตามด้วยเหตุผลสั้นๆ ไม่เกิน 3 บรรทัด ${QC_NOTE}`;
const QC_SYS_IMAGE = `คุณคือฝ่าย QC ตรวจสอบเนื้อหาที่เตรียมไว้สำหรับโพสต์รูปภาพ จากโครงเรื่อง พรอมต์รูปภาพ ชื่อโพสต์ และคำบรรยายที่ให้มา ตรวจว่าเหมาะสม ชัดเจน สอดคล้องกัน ไม่เข้าข่ายผิดกฎทั่วไปของแพลตฟอร์มโซเชียล (เนื้อหารุนแรง ล่อแหลม ผิดกฎหมาย ฯลฯ) ตอบเป็นภาษาไทย บรรทัดแรกขึ้นต้นด้วยคำว่า "ผ่าน" หรือ "ควรแก้ไข" ตามด้วยเหตุผลสั้นๆ ไม่เกิน 3 บรรทัด ${QC_NOTE}`;
const DURATION_OPTIONS = [8, 10, 15, 20, 30, 40, 50, 60, 90, 120];

function parseJsonLoose(text) {
  try {
    let t = (text || '').trim();
    t = t.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    return JSON.parse(t);
  } catch (e) {
    return null;
  }
}

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

// ---------- คิวเรียก AI: ยิงทีละคำขอ และเว้นช่วงกันชนลิมิต 5 ครั้ง/นาที ของแพ็กฟรี Gemini ----------
// ผู้ใช้ที่ใส่คีย์ของตัวเองไม่ต้องแย่งคิวกับคนอื่น ลดเวลารอลงมาก
export function setAiGap(ms) { AI_MIN_GAP_MS = ms; }
let AI_MIN_GAP_MS = 13000; // เว้นห่างอย่างน้อย ~13 วิ ต่อคำขอ (ราว 4-5 ครั้ง/นาที)
let aiChain = Promise.resolve();
let aiLastCallAt = 0;

function callClaude(system, content, images, action) {
  // ต่อคิวไว้ท้ายแถว งานถัดไปจะเริ่มก็ต่อเมื่องานก่อนหน้าเสร็จและเว้นระยะครบแล้ว
  const run = aiChain.then(async () => {
    const since = Date.now() - aiLastCallAt;
    if (aiLastCallAt && since < AI_MIN_GAP_MS) {
      await new Promise((r) => setTimeout(r, AI_MIN_GAP_MS - since));
    }
    aiLastCallAt = Date.now();
    // ต้องแนบโทเค็นทุกครั้ง ไม่งั้นเซิร์ฟเวอร์จะปฏิเสธ (401)
    const authToken = loadSession();
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ system, content, images, action }),
    });
    const data = await response.json();
    aiLastCallAt = Date.now();
    if (response.status === 401) {
      clearSession();
      window.dispatchEvent(new CustomEvent('forge-session-expired'));
    }
    if (!response.ok || data?.error) {
      const e = new Error(data.error || 'เกิดข้อผิดพลาด');
      e.needKey = data.needKey; e.outOfTokens = data.outOfTokens; e.badKey = data.badKey;
      throw e;
    }
    // แจ้งยอดโทเค็นคงเหลือให้หน้าเว็บอัปเดต
    if (data.tokensLeft != null) window.dispatchEvent(new CustomEvent('forge-tokens', { detail: { left: data.tokensLeft, cost: data.cost } }));
    return data.text || '(ไม่มีคำตอบ)';
  });
  // กันไม่ให้คิวขาดเมื่อมีคำขอใดล้มเหลว
  aiChain = run.catch(() => {});
  return run;
}

// อ่านไฟล์รูปเป็น base64 พร้อมย่อขนาดก่อนส่ง
// รูปจากมือถือมักใหญ่ 4-8MB ถ้าส่งดิบๆ หลายใบพร้อมกันคำขอจะล้มเหลว
const MAX_IMG_SIDE = 1400;
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_IMG_SIDE / Math.max(img.width, img.height));
          if (scale >= 1 && dataUrl.length < 1_400_000) {
            resolve(dataUrl.split(',')[1] || '');
            return;
          }
          const cv = document.createElement('canvas');
          cv.width = Math.round(img.width * scale);
          cv.height = Math.round(img.height * scale);
          cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
          resolve(cv.toDataURL('image/jpeg', 0.82).split(',')[1] || '');
        } catch (e) {
          resolve(dataUrl.split(',')[1] || '');
        }
      };
      img.onerror = () => resolve(dataUrl.split(',')[1] || '');
      img.src = dataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ลายนิ้วมืออุปกรณ์อย่างง่าย — ใช้กันคนสมัครบัญชีทดลองซ้ำจากเครื่องเดิม
function deviceFingerprint() {
  try {
    const parts = [
      navigator.userAgent, navigator.language, String(screen.width), String(screen.height),
      String(screen.colorDepth), String(new Date().getTimezoneOffset()),
      String(navigator.hardwareConcurrency || ''), String(navigator.maxTouchPoints || ''),
    ].join('|');
    let h = 0;
    for (let i = 0; i < parts.length; i++) { h = ((h << 5) - h) + parts.charCodeAt(i); h |= 0; }
    return `fp${Math.abs(h).toString(36)}`;
  } catch (e) { return ''; }
}

// ---------- session: เก็บเฉพาะ "โทเค็น" ที่เซิร์ฟเวอร์เซ็นมา ----------
// ไม่เก็บระดับสิทธิ์ไว้ในเบราว์เซอร์อีกต่อไป เพราะผู้ใช้แก้เองได้
// ข้อมูลบัญชีจริงจะถามจากเซิร์ฟเวอร์ทุกครั้งที่เปิดหน้าใหม่
const SESSION_KEY = 'forge_token';

function saveSession(token) {
  try { localStorage.setItem(SESSION_KEY, token); } catch (e) {}
}
function loadSession() {
  try { return localStorage.getItem(SESSION_KEY) || null; } catch (e) { return null; }
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}

// เรียก API พร้อมแนบโทเค็นให้อัตโนมัติ
async function api(path, options = {}) {
  const token = loadSession();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (res.status === 401) {
    clearSession();
    window.dispatchEvent(new CustomEvent('forge-session-expired'));
  }
  return { ok: res.ok, status: res.status, data };
}

const apiPost = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });

// คัดลอกข้อความลงคลิปบอร์ด คืนค่า Promise ที่ resolve เป็น true/false
function copyText(text) {
  if (!text) return Promise.resolve(false);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

// รวมชื่อ + คำบรรยาย + แฮชแท็ก ของภาษาหนึ่งเป็นข้อความชุดเดียว พร้อมวางลงโพสต์
function buildPostBundle(task, lang) {
  const title = task[`title${lang}`] || (lang === 'Th' ? task.title : '') || '';
  const caption = task[`caption${lang}`] || '';
  const tags = task[`hashtags${lang}`] || '';
  return [title, caption, tags].filter(Boolean).join('\n\n');
}

function emptyTask(id, channelId, platform, type, label, date) {
  return {
    id, channelId, platform, type, label, date, done: false,
    outline: '', durationSec: 15, styleTemplate: '',
    imagePrompt: '', imagePromptCopied: false, imagePromptMade: false,
    videoPrompt: '', videoPromptCopied: false, videoPromptMade: false,
    coverPrompt: '', coverPromptCopied: false, coverPromptMade: false,
    sourceImagePrompt: '', sourceImagePromptCopied: false, sourceImagePromptMade: false,
    titleTh: '', titleEn: '', titleZh: '', captionTh: '', captionEn: '', captionZh: '',
    hashtagsTh: '', hashtagsEn: '', hashtagsZh: '',
    link: '', qc: null, lastError: '', referenceLink: '',
    geminiReview: '',        // ผลวิเคราะห์ที่วางกลับมาจาก Gemini
    reviewScore: null,       // คะแนน 1-10 ที่ระบบสรุปได้จากผลวิเคราะห์
    reviewSummary: '',       // สรุปสั้นๆ + สิ่งที่ควรแก้ครั้งหน้า
    reviewAt: null,          // เวลาที่วิเคราะห์
    templateLinks: [''], // ลิงก์วิดีโอ/รูปต้นแบบให้ AI ดูสไตล์ (เพิ่มได้หลายลิงก์)
  };
}

// คำสั่งมาตรฐานสำหรับให้ Gemini ตรวจคลิป — คัดลอกไปวางพร้อมแนบไฟล์วิดีโอ
function buildGeminiReviewPrompt(task, channelName) {
  const scenes = (task.videoPrompt || '').trim();
  return `คุณคือผู้ตรวจคุณภาพคอนเทนต์วิดีโอมืออาชีพ ผมจะแนบไฟล์วิดีโอมาให้ กรุณาดูคลิปทั้งคลิปอย่างละเอียดแล้วตรวจตามหัวข้อด้านล่าง

## ข้อมูลงานชิ้นนี้
- ช่อง: ${channelName || '-'}
- ประเภท: ${task.type === 'video' ? 'วิดีโอ' : 'รูปภาพ'} (${task.label})
- ความยาวที่ตั้งใจ: ${task.durationSec || '-'} วินาที
- โครงเรื่องที่วางไว้: ${task.outline || '-'}
- สไตล์ที่ต้องการ: ${task.styleTemplate || '-'}
- Prompt ที่ใช้สร้าง: ${scenes || '-'}

## กรุณาตรวจและตอบตามรูปแบบนี้เป๊ะๆ

คะแนนรวม: [ให้คะแนน 1-10]

ตรงกับที่วางไว้ไหม:
[คลิปตรงกับโครงเรื่องและ Prompt ข้างบนหรือไม่ ตรงกี่ % ตรงไหนหลุด]

จุดที่ดี:
- [ข้อดีที่ควรทำต่อ อย่างน้อย 2 ข้อ]

จุดที่ต้องแก้:
- [ระบุปัญหาพร้อมบอกวินาทีที่เกิด เช่น "วินาทีที่ 3-5 ภาพเบลอ"]
- [เรียงจากปัญหาที่ร้ายแรงที่สุดก่อน]

ตรวจทางเทคนิค:
- ความคมชัด/ความละเอียด: [ประเมิน]
- แสงและสี: [ประเมิน]
- ความต่อเนื่องระหว่างฉาก: [ประเมิน]
- สัดส่วนภาพ 9:16 ถูกต้องไหม: [ใช่/ไม่ใช่]
- ความสมจริงของตัวละคร/สัตว์ (มีจุดที่ AI สร้างผิดเพี้ยนไหม): [ประเมิน]

แรงดึงดูด 3 วินาทีแรก:
[คลิปนี้จะหยุดนิ้วคนเลื่อนฟีดได้ไหม เพราะอะไร]

สิ่งที่ต้องแก้ใน Prompt ครั้งหน้า:
- [บอกชัดว่าควรเพิ่มหรือตัดคำไหนออกจาก Prompt เพื่อให้คลิปหน้าดีกว่านี้]

สรุปสั้น 1 บรรทัด:
[สรุปว่าผ่านหรือควรทำใหม่ พร้อมเหตุผลสั้นๆ]`;
}

// ป้ายชื่องาน (Thai) มาพร้อมเลขลำดับอยู่แล้ว เช่น "วิดีโอ 3" / "โพสต์ 2" — แปลงเป็นอังกฤษกำกับไว้ด้วย
function taskLabelEn(task) {
  const n = (task.label.match(/\d+/) || [''])[0];
  return task.type === 'video' ? `Video ${n}` : `Post ${n}`;
}

function buildTasksForPlatform(channelId, platformEntry, videoOffset, imageOffset, date) {
  const tasks = [];
  const p = platformEntry.platform;
  for (let i = 1; i <= platformEntry.dailyVideos; i++) {
    const n = videoOffset + i;
    tasks.push(emptyTask(`${channelId}-${p}-video-${n}-${date}`, channelId, p, 'video', `วิดีโอ ${n}`, date));
  }
  for (let i = 1; i <= platformEntry.dailyImages; i++) {
    const n = imageOffset + i;
    tasks.push(emptyTask(`${channelId}-${p}-image-${n}-${date}`, channelId, p, 'image', `โพสต์ ${n}`, date));
  }
  return tasks;
}

function buildDefaultTasksForChannels(channelsList, date) {
  let allTasks = [];
  channelsList.forEach((c) => {
    let videoOffset = 0, imageOffset = 0;
    c.platforms.forEach((p) => {
      allTasks = [...allTasks, ...buildTasksForPlatform(c.id, p, videoOffset, imageOffset, date)];
      videoOffset += p.dailyVideos;
      imageOffset += p.dailyImages;
    });
  });
  return allTasks;
}

function shiftDateStr(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dedupeTasks(list) {
  const seen = new Map();
  for (const t of list) {
    const key = `${t.channelId}|${t.platform}|${t.type}|${t.label}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, t);
      continue;
    }
    const score = (x) => (x.outline ? 1 : 0) + (x.videoPrompt || x.imagePrompt ? 1 : 0) + (x.titleTh ? 1 : 0) + (x.link ? 1 : 0) + (x.done ? 1 : 0);
    if (score(t) > score(existing)) seen.set(key, t);
  }
  return Array.from(seen.values());
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

function CircularProgress({ pct, size = 40, strokeWidth = 3, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, pct)) / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={C.border} strokeWidth={strokeWidth} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
    </svg>
  );
}

function SidebarNavItem({ Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm justify-center sm:justify-start" style={{ background: active ? `${C.blue}18` : 'transparent', color: active ? C.blue : C.muted }}>
      <Icon size={17} className="shrink-0" />
      <span className="hidden sm:inline truncate">{label}</span>
    </button>
  );
}

// รวมรายการ "วันที่ยังทำงานไม่ครบ" จากประวัติ เพื่อเตือนไว้ที่แถบซ้ายให้กดเข้าไปเคลียร์ได้
function collectOverdueDays(history, limit = 6) {
  return (history || [])
    .filter((h) => h && h.totalTasks > 0 && h.doneTasks < h.totalTasks)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit)
    .map((h) => ({ date: h.date, done: h.doneTasks, total: h.totalTasks, left: h.totalTasks - h.doneTasks }));
}

function shortDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`;
}

function OverdueSidebarPanel({ history, onOpenDay, onDismissDay }) {
  const overdue = collectOverdueDays(history);
  const totalLeft = overdue.reduce((s, d) => s + d.left, 0);
  if (overdue.length === 0) {
    return (
      <div className="px-2 pt-3 hidden sm:block">
        <div className="px-2 py-2 rounded-xl flex items-center gap-2" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
          <CheckCircle2 size={13} style={{ color: C.emerald }} className="shrink-0" />
          <span className="font-mono text-2xs" style={{ color: C.emerald }}>ไม่มีงานค้าง</span>
        </div>
      </div>
    );
  }
  return (
    <div className="px-2 pt-3">
      {/* จอแคบ: แสดงแค่ไอคอน + ตัวเลข */}
      <div className="sm:hidden flex justify-center">
        <button onClick={() => onOpenDay(overdue[0].date)} className="relative p-2 rounded-xl" style={{ background: `${C.red}18` }} aria-label={`มีงานค้าง ${totalLeft} งาน`}>
          <AlertTriangle size={15} style={{ color: C.red }} />
          <span className="absolute -top-0.5 -right-0.5 font-mono rounded-full px-1" style={{ fontSize: 9, background: C.red, color: '#fff' }}>{totalLeft}</span>
        </button>
      </div>
      <div className="hidden sm:block rounded-xl overflow-hidden" style={{ background: `${C.red}0E`, border: `1px solid ${C.red}44` }}>
        <div className="px-2.5 py-1.5 flex items-center gap-1.5" style={{ borderBottom: `1px solid ${C.red}33` }}>
          <AlertTriangle size={12} style={{ color: C.red }} className="shrink-0" />
          <span className="font-mono text-2xs" style={{ color: C.red }}>งานค้าง {totalLeft} งาน</span>
        </div>
        <div className="p-1 space-y-0.5 max-h-44 overflow-y-auto">
          {overdue.map((d) => (
            <div key={d.date} className="w-full px-2 py-1.5 rounded-lg flex items-center justify-between gap-1.5" style={{ color: C.text }}>
              <button onClick={() => onOpenDay(d.date)} className="flex-1 min-w-0 text-left flex items-center justify-between gap-2" title={`เปิดไปเคลียร์งานของวันที่ ${d.date}`}>
                <span className="font-body text-xs truncate">{shortDayLabel(d.date)}</span>
                <span className="font-mono shrink-0" style={{ fontSize: 10, color: C.red }}>เหลือ {d.left}</span>
              </button>
              <button
                onClick={() => { if (window.confirm(`ยกเลิกงานค้างของวันที่ ${shortDayLabel(d.date)} ทั้ง ${d.left} งาน?\n\nงานที่ทำเสร็จแล้วจะยังอยู่ครบ ลบเฉพาะงานที่ยังไม่ได้ทำ`)) onDismissDay(d.date); }}
                title="ไม่ทำงานของวันนี้แล้ว — ลบออกจากรายการค้าง"
                aria-label="ยกเลิกงานค้างของวันนี้"
                className="shrink-0 p-1 rounded-md"
                style={{ color: C.muted }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, stage, setStage, logout, accounts, tasks, history, onOpenDay, onDismissDay, tokens, features }) {
  const account = (accounts || []).find((a) => a.email === user.email);
  const totalToday = tasks.length;
  const doneToday = tasks.filter((t) => t.done).length;
  const pct = totalToday === 0 ? 0 : Math.round((doneToday / totalToday) * 100);

  // เจ้าของระบบเห็นทุกหน้าเสมอ ส่วนคนอื่นเห็นเฉพาะหน้าที่เจ้าของเปิดให้
  const on = (key) => user.isOwner || !features || features.pages?.[key] !== false;
  const navItems = [
    { key: 'daily', label: 'งานประจำวัน', Icon: ClipboardCheck },
    ...(on('calendar') ? [{ key: 'calendar', label: 'ปฏิทิน', Icon: Calendar }] : []),
    ...(on('directory') ? [{ key: 'directory', label: 'Directory', Icon: FileText }] : []),
    ...(on('platforms') ? [{ key: 'platforms', label: 'แพลตฟอร์ม', Icon: Share2 }] : []),
    ...(user.clearance === 3 ? [{ key: 'team', label: 'ทีมงาน', Icon: Users }] : []),
    ...(on('analytics') ? [{ key: 'analytics', label: 'การวิเคราะห์', Icon: TrendingUp }] : []),
    ...(on('kpi') ? [{ key: 'kpi', label: 'KPI / รายเดือน', Icon: Target }] : []),
    ...(on('security') ? [{ key: 'security', label: 'Protocol', Icon: ScrollText }] : []),
    { key: 'settings', label: 'Setting', Icon: SettingsIcon },
  ];

  return (
    <div className="w-16 sm:w-56 shrink-0 flex flex-col sticky top-0" style={{ height: '100vh', background: C.bgDeep, borderRight: `1px solid ${C.border}` }}>
      <button onClick={() => setStage('daily')} className="p-4 flex items-center justify-center sm:justify-start" aria-label="กลับหน้างานประจำวัน">
        <Wordmark fontSize={15} />
      </button>
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {navItems.map((n) => (
          <SidebarNavItem key={n.key} Icon={n.Icon} label={n.label} active={stage === n.key || (n.key === 'directory' && stage === 'department')} onClick={() => setStage(n.key)} />
        ))}
        <OverdueSidebarPanel history={history} onOpenDay={onOpenDay} onDismissDay={onDismissDay} />
      </div>
      <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => setStage('profile')} className="w-full flex items-center gap-2.5 mb-1.5 justify-center sm:justify-start">
          <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
            <CircularProgress pct={pct} color={C.emerald} />
            <div className="absolute inset-0 flex items-center justify-center">
              {account?.avatar ? (
                <img src={account.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-display text-2xs font-bold" style={{ background: `linear-gradient(135deg, ${account?.avatarColor || C.blue}, ${account?.avatarColor || C.blue}88)`, color: '#0A0A0F' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <div className="font-body text-xs truncate" style={{ color: C.text }}>{user.name}</div>
            <div className="font-mono text-2xs" style={{ color: C.emerald }}>{pct}% วันนี้</div>
            {tokens && <div className="mt-0.5"><TokenMeter tokens={tokens} compact /></div>}
          </div>
        </button>
        <button onClick={logout} className="w-full flex items-center gap-2.5 px-1 py-1.5 justify-center sm:justify-start" style={{ color: C.muted }}>
          <LogOut size={15} className="shrink-0" /> <span className="hidden sm:inline font-mono text-2xs">ออกจากระบบ</span>
        </button>
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
  const [pendingAccount, setPendingAccount] = useState(null); // เก็บไว้แสดงชื่อระหว่างรอ OTP
  const [inviteCode, setInviteCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [joinMode, setJoinMode] = useState('create'); // create = สร้างองค์กรใหม่, join = เข้าร่วมองค์กรเดิม
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [gateMode, setGateMode] = useState(null);
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
      const { ok, data: loginData } = await apiPost('/api/auth', { action: 'login', identifier: loginForm.identifier.trim(), password: loginForm.password });
      if (!ok) { setOtpLoading(false); setLoginError(loginData.error || 'เข้าสู่ระบบไม่สำเร็จ'); return; }
      const acc = loginData.account;

      if (!loginData.requireOtp) {
        setOtpLoading(false);
        saveSession(loginData.token);
        onLogin(acc);
        return;
      }

      const { ok: sendOk, data } = await apiPost('/api/send-code', { email: acc.email });
      setOtpLoading(false);
      if (!sendOk || !data.token) {
        // ส่งอีเมลไม่ได้ (เช่น ยังไม่ได้ยืนยันโดเมนใน Resend) — บอกให้ชัด อย่าปล่อยค้าง
        setLoginError((data.error || 'ส่งรหัสยืนยันไม่สำเร็จ') + ' — กรุณาแจ้งผู้ดูแลระบบให้ยกเว้นการยืนยันอีเมลให้บัญชีนี้');
        return;
      }
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
      // เซิร์ฟเวอร์ตรวจ OTP เองแล้วออกโทเค็นให้ — หน้าเว็บปลอมขั้นตอนนี้ไม่ได้
      const { ok, data } = await apiPost('/api/auth', { action: 'completeOtpLogin', otpToken, code: loginForm.code.trim() });
      setOtpLoading(false);
      if (!ok) { setLoginError(data.error || 'รหัสไม่ถูกต้องหรือหมดอายุ'); return; }
      saveSession(data.token);
      onLogin(data.account);
    } catch (err) {
      setOtpLoading(false);
      setLoginError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ ลองใหม่อีกครั้ง');
    }
  }
  useEffect(() => {
    apiPost('/api/auth', { action: 'gateInfo' }).then(({ ok, data }) => { if (ok) setGateMode(data); }).catch(() => {});
  }, []);

  async function submitSignup(e) {
    e.preventDefault();
    setSignupError('');
    if (!signupForm.name.trim() || !signupForm.username.trim() || !signupForm.email.trim() || !signupForm.password) { setSignupError('กรอกข้อมูลให้ครบ'); return; }
    if (signupForm.password.length < 8) { setSignupError('รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร'); return; }
    if (signupForm.password !== signupForm.confirm) { setSignupError('รหัสผ่านไม่ตรงกัน'); return; }
    if (!birthDate) { setSignupError('กรุณาระบุวันเกิดจริง (ใช้กับฟีเจอร์ในฝ่ายบุคคล)'); return; }
    if (joinMode === 'join' && !orgCode.trim()) { setSignupError('กรุณากรอกรหัสองค์กรที่ได้รับจากผู้ดูแล'); return; }
    setSignupLoading(true);
    try {
      const { ok, data } = await apiPost('/api/auth', { action: 'signup', name: signupForm.name.trim(), username: signupForm.username.trim(), email: signupForm.email.trim(), password: signupForm.password, birthDate, orgName: joinMode === 'create' ? orgName.trim() : '', orgCode: joinMode === 'join' ? orgCode.trim() : '', inviteCode: inviteCode.trim(), fingerprint: deviceFingerprint() });
      setSignupLoading(false);
      if (!ok) { setSignupError(data.error || 'สร้างบัญชีไม่สำเร็จ'); return; }
      if (data.token) saveSession(data.token);
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
          {/* เข้าร่วมองค์กรเดิม หรือสร้างองค์กรใหม่ */}
          <div className="p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
            <div className="font-mono text-2xs mb-2" style={{ color: C.blue }}>องค์กรของคุณ</div>
            <div className="flex gap-1.5 mb-2">
              {[{ k: 'create', l: 'สร้างองค์กรใหม่' }, { k: 'join', l: 'เข้าร่วมองค์กรเดิม' }].map((o) => (
                <button key={o.k} type="button" onClick={() => setJoinMode(o.k)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex-1" style={{ background: joinMode === o.k ? BRAND : 'transparent', color: joinMode === o.k ? '#fff' : C.muted, border: `1px solid ${joinMode === o.k ? 'transparent' : C.border}` }}>{o.l}</button>
              ))}
            </div>
            {joinMode === 'create' ? (
              <>
                <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="ชื่อบริษัท/องค์กร (เว้นว่างได้)" className="w-full px-3 py-2 font-body text-sm outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }} />
                <p className="font-mono text-2xs mt-1" style={{ color: C.muted, fontSize: 10 }}>* คุณจะเป็นผู้บริหารขององค์กรนี้ และได้รหัสไว้ชวนทีมเข้ามา</p>
              </>
            ) : (
              <>
                <input value={orgCode} onChange={(e) => setOrgCode(e.target.value.toUpperCase())} placeholder="รหัสองค์กร 6 ตัว เช่น A7K2QP" maxLength={6} className="w-full px-3 py-2 font-mono text-sm outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}`, letterSpacing: 2 }} />
                <p className="font-mono text-2xs mt-1" style={{ color: C.muted, fontSize: 10 }}>* ขอรหัสจากผู้บริหาร/หัวหน้าขององค์กรคุณ</p>
              </>
            )}
          </div>

          <div>
            <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>วันเดือนปีเกิด (จริง)</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required max={todayDateStr()} className="w-full px-3 py-2.5 font-body text-sm outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
            <p className="font-mono text-2xs mt-1" style={{ color: C.muted, fontSize: 10 }}>* ใช้กับฟีเจอร์วิเคราะห์ในฝ่ายบุคคล กรุณาใส่ให้ตรงความจริง</p>
          </div>
          {gateMode?.needCode && (
            <div>
              <TextField label="รหัสเชิญ" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="XXXX-XXXX" />
              <p className="font-mono text-2xs mt-1" style={{ color: C.orange, fontSize: 10 }}>* เว็บนี้เปิดเฉพาะผู้ได้รับเชิญ — ถ้าอีเมลคุณอยู่ในรายชื่อแล้ว ไม่ต้องกรอกรหัส</p>
            </div>
          )}
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
      <div className="px-6 pb-5"><p className="font-mono text-2xs leading-relaxed" style={{ color: C.muted }}>* เข้าสู่ระบบ 6 ครั้งแรก<b>ของแต่ละวัน</b>ไม่ต้องยืนยันอีเมล ตั้งแต่ครั้งที่ 7 ของวันนั้นเป็นต้นไปต้องยืนยันรหัสทางอีเมลทุกครั้ง · พอขึ้นวันใหม่ (เที่ยงคืน เวลาไทย) ระบบจะเริ่มนับใหม่เอง</p></div>
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

// ============ เครื่องมือ AI ประจำแผนก ============
// แต่ละแผนกมีเครื่องมือของตัวเอง ใช้งานได้จริง เก็บผลลัพธ์ไว้ดูย้อนหลังได้
const DEPT_TOOLS = {
  finance: [
    {
      key: 'bills', label: 'อ่านบิล + แยกหมวด + ตรวจความครบ', Icon: FileText, color: '#34D399',
      desc: 'แนบบิลได้ 10 ใบ — AI อ่านตัวเลข แยกหมวด คำนวณ VAT/ภาษีหัก ณ ที่จ่าย ตรวจว่าใบกำกับภาษีครบไหม จ่ายตรงเวลาไหม และประเมินว่าใช้เงินคุ้มหรือเปลือง',
      images: 10, action: 'metricRead',
      fields: [
        { k: 'period', label: 'งวด/เดือน', ph: 'สิงหาคม 2569' },
        { k: 'budget', label: 'งบที่ตั้งไว้ (ถ้ามี)', ph: '30000' },
      ],
      sys: `คุณคือผู้ตรวจสอบบัญชีมืออาชีพ อ่านบิล/ใบเสร็จจากภาพทุกใบแล้ววิเคราะห์เชิงลึก ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"รายงานค่าใช้จ่าย",
 "items":[{"no":1,"ผู้ขาย":"ชื่อร้าน","วันที่":"วันที่บนบิล","หมวด":"ค่าอาหาร|ค่าเดินทาง|ค่าไฟ|ค่าน้ำ|ค่าทางด่วน|ค่าเช่า|อุปกรณ์|โฆษณา|อื่นๆ","ยอด":ตัวเลข,"VAT":ตัวเลขหรือ null,"ใบกำกับภาษี":"มี|ไม่มี|ไม่ชัด","หมายเหตุ":"..."}],
 "byCategory":[{"หมวด":"ชื่อหมวด","ยอดรวม":ตัวเลข,"เปอร์เซ็นต์":ตัวเลข,"ประเมิน":"เหมาะสม|สูงเกินไป|ควรลด"}],
 "totals":{"ยอดก่อนภาษี":ตัวเลข,"VATรวม":ตัวเลข,"ยอดรวมสุทธิ":ตัวเลข,"จำนวนบิล":ตัวเลข},
 "spendingGrade":{"grade":"แย่ควรปรับปรุง | พอใช้ | ดี | เยี่ยม","percent":0-100,"reasoning":"อธิบายว่าตัดสินจากอะไร","vsBudget":"เทียบกับงบที่ตั้งไว้เป็นยังไง"},
 "wasteful":[{"รายการ":"ค่าใช้จ่ายที่เปลือง","ยอด":ตัวเลข,"ทำไมเปลือง":"เหตุผล","ลดได้เท่าไหร่":"ประมาณการ"}],
 "documentCheck":{"บิลครบไหม":"ประเมิน","ใบกำกับภาษีขาดกี่ใบ":ตัวเลข,"ยอดที่หาหลักฐานไม่ได้":ตัวเลข,"ต้องตามอะไรบ้าง":["รายการที่ต้องตามเอกสารเพิ่ม"]},
 "paymentTiming":{"จ่ายตรงเวลาไหม":"ประเมินจากวันที่บนบิล","เลทกี่เปอร์เซ็นต์":ตัวเลขหรือ null,"ผลกระทบ":"เสียค่าปรับหรือเสียเครดิตไหม"},
 "tax":{"VATซื้อที่ขอคืนได้":ตัวเลข,"หักณที่จ่าย":[{"รายการ":"...","อัตรา":"3%|5%|1%","ยอดที่ต้องหัก":ตัวเลข}],"ค่าใช้จ่ายทางภาษี":"รายการไหนใช้ลดหย่อนภาษีนิติบุคคลได้","ข้อควรระวัง":"..."},
 "improvementSteps":[{"ขั้นที่":1,"ทำอะไร":"ระบุให้ชัด","ประหยัดได้":"ประมาณการ","ทำเมื่อไหร่":"..."}],
 "flags":["บิลซ้ำ ยอดผิดปกติ หรืออ่านไม่ชัด"]
}
กติกา: ตัวเลขห้ามมีจุลภาค/หน่วย · อ่านไม่ได้ใส่ null · ภาษีอิงกฎหมายไทย VAT 7%`,
    },
    {
      key: 'tax', label: 'คำนวณภาษีบุคคลธรรมดา + วางแผนลดหย่อน', Icon: Landmark, color: '#FBBF24',
      desc: 'กรอกรายได้และค่าลดหย่อน → คำนวณภาษีตามขั้นบันไดจริงของไทย พร้อมบอกเป็นขั้นตอนว่าลดหย่อนเพิ่มได้อีกยังไงแบบถูกกฎหมาย',
      action: 'deepAnalysis',
      fields: [
        { k: 'salary', label: 'เงินเดือน (ต่อเดือน)', ph: '30000', required: true },
        { k: 'bonus', label: 'โบนัสทั้งปี', ph: '30000' },
        { k: 'other', label: 'รายได้อื่นทั้งปี', ph: 'ขายของออนไลน์ 50000' },
        { k: 'status', label: 'สถานะสมรส/บุตร', ph: 'โสด / สมรส มีบุตร 1' },
        { k: 'parents', label: 'เลี้ยงดูบิดามารดา', ph: 'บิดา 1 มารดา 1 (อายุเกิน 60)' },
        { k: 'sso', label: 'ประกันสังคมทั้งปี', ph: '9000' },
        { k: 'insurance', label: 'เบี้ยประกันชีวิต/สุขภาพ', ph: 'ชีวิต 20000 สุขภาพ 15000' },
        { k: 'funds', label: 'กองทุน/PVD/RMF/ThaiESG', ph: 'PVD 18000, RMF 30000' },
        { k: 'home', label: 'ดอกเบี้ยบ้าน', ph: '40000' },
        { k: 'donate', label: 'เงินบริจาค', ph: 'การศึกษา 5000' },
      ],
      sys: `คุณคือนักวางแผนภาษีที่เชี่ยวชาญกฎหมายภาษีไทยปีล่าสุด คำนวณให้ถูกต้องตามขั้นบันไดจริง ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ผลคำนวณภาษี",
 "income":{"เงินเดือนทั้งปี":ตัวเลข,"โบนัส":ตัวเลข,"รายได้อื่น":ตัวเลข,"รวมเงินได้":ตัวเลข},
 "deductions":[{"รายการ":"ชื่อค่าลดหย่อน","จำนวน":ตัวเลข,"เพดาน":"ข้อจำกัดตามกฎหมาย","ใช้เต็มเพดานแล้วหรือยัง":"ใช้เต็มแล้ว|ยังเหลือ X บาท"}],
 "calculation":{"หักค่าใช้จ่าย":ตัวเลข,"รวมค่าลดหย่อน":ตัวเลข,"เงินได้สุทธิ":ตัวเลข},
 "taxBrackets":[{"ขั้น":"0-150,000","อัตรา":"ยกเว้น","เงินได้ในขั้นนี้":ตัวเลข,"ภาษีขั้นนี้":ตัวเลข}],
 "taxDue":{"ภาษีที่ต้องจ่าย":ตัวเลข,"ภาษีที่ถูกหักไว้แล้ว":ตัวเลขหรือ null,"ต้องจ่ายเพิ่ม/ขอคืน":"ระบุ","อัตราภาษีที่แท้จริง":"กี่ % ของรายได้"},
 "savingPlan":[{"ขั้นที่":1,"ทำอะไร":"วิธีลดหย่อนเพิ่มแบบถูกกฎหมาย ระบุให้ชัดเจนลงมือได้","ลงทุนเท่าไหร่":ตัวเลข,"ประหยัดภาษีได้":ตัวเลข,"ข้อควรรู้":"เงื่อนไข เช่น ต้องถือกี่ปี","ความเสี่ยง":"..."}],
 "maxSaving":"ถ้าทำครบทุกขั้น จะประหยัดภาษีได้รวมเท่าไหร่",
 "deadlines":["กำหนดเวลาสำคัญ เช่น ต้องซื้อกองทุนภายในสิ้นปี ยื่นภาษีภายในมีนาคม"],
 "warnings":["สิ่งที่ห้ามทำ หรือความเข้าใจผิดที่พบบ่อย"]
}
กติกา: ใช้ขั้นบันไดภาษีเงินได้บุคคลธรรมดาของไทยจริง · ค่าลดหย่อนส่วนตัว 60,000 · หักค่าใช้จ่าย 50% ไม่เกิน 100,000 สำหรับเงินเดือน · ระบุเพดานแต่ละรายการให้ถูก · วิธีลดหย่อนต้องถูกกฎหมายเท่านั้น`,
    },
    {
      key: 'personal', label: 'ตรวจสุขภาพการเงินส่วนตัว', Icon: Gauge, color: '#4A9DFF',
      desc: 'สำหรับพนักงานกรอกเอง — ประเมินสภาพคล่อง ภาระหนี้ แนะนำการลงทุน และวางแผนซื้อของชิ้นใหญ่ว่าควรซื้อไหม ผ่อนหรือสด',
      action: 'deepAnalysis',
      fields: [
        { k: 'income', label: 'รายได้ต่อเดือน', ph: '25000', required: true },
        { k: 'sideIncome', label: 'รายได้เสริม', ph: '3000' },
        { k: 'expenses', label: 'ค่าใช้จ่ายรายเดือน (ใส่ทีละรายการ)', ph: 'ค่าเช่า 5000, ค่ากิน 6000, ค่าเดินทาง 2000, ค่าโทรศัพท์ 500', big: true, required: true },
        { k: 'debts', label: 'หนี้สิน', ph: 'ผ่อนรถ 6500/เดือน เหลือ 30 งวด, บัตรเครดิต 20000', big: true },
        { k: 'assets', label: 'ทรัพย์สิน/เงินเก็บ', ph: 'เงินฝาก 50000 ทอง 1 บาท' },
        { k: 'goal', label: 'เป้าหมายที่อยากซื้อ/ทำ', ph: 'อยากซื้อมอเตอร์ไซค์ 80000 ภายในปีนี้', big: true },
      ],
      sys: `คุณคือที่ปรึกษาการเงินส่วนบุคคลที่พูดตรงและใช้ได้จริง ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"สุขภาพการเงินส่วนตัว",
 "healthPercent":0-100,
 "status":"วิกฤต | ขาดสภาพคล่อง | พอไปได้ | มั่นคง | แข็งแรงมาก",
 "summary":{"รายได้รวม":ตัวเลข,"รายจ่ายรวม":ตัวเลข,"ภาระหนี้ต่อเดือน":ตัวเลข,"เหลือเก็บต่อเดือน":ตัวเลข,"อัตราการออม":"กี่ %","อัตราส่วนหนี้ต่อรายได้":"กี่ % (ไม่ควรเกิน 40%)"},
 "expenseBreakdown":[{"หมวด":"ชื่อหมวด","จำนวน":ตัวเลข,"เปอร์เซ็นต์":ตัวเลข,"ประเมิน":"เหมาะสม|สูงไป|ควรลด"}],
 "liquidity":{"มีเงินสำรองฉุกเฉินกี่เดือน":"ตัวเลข","ควรมีกี่เดือน":"6 เดือน","ขาดอีกเท่าไหร่":ตัวเลข},
 "debtPlan":[{"หนี้":"ชื่อหนี้","ควรทำอะไร":"ปิดก่อน|ผ่อนต่อ|รีไฟแนนซ์","เหตุผล":"...","ประหยัดดอกเบี้ยได้":"..."}],
 "goalPlan":{"ควรซื้อไหม":"ควร|ยังไม่ควร|ควรแต่ต้องรอ","เหตุผล":"...","ถ้าซื้อสด":"ต้องเก็บเดือนละเท่าไหร่ กี่เดือน","ถ้าผ่อน":"ดาวน์กี่ % ผ่อนงวดละเท่าไหร่ ดอกเบี้ยรวมเท่าไหร่ คุ้มไหม","แนะนำ":"สรุปว่าควรทำแบบไหน"},
 "investmentAdvice":[{"ทางเลือก":"เช่น กองทุน S&P500 / พันธบัตรรัฐบาล / ทองคำ / เงินฝากประจำ","เหมาะกับคุณเพราะ":"...","ควรลงเท่าไหร่":"ต่อเดือน","ความเสี่ยง":"ต่ำ|กลาง|สูง","ผลตอบแทนที่คาด":"ประมาณ % ต่อปี"}],
 "actionSteps":[{"ขั้นที่":1,"ทำอะไร":"ระบุชัดเจน","ผลที่ได้":"...","เริ่มเมื่อไหร่":"..."}],
 "warning":"สิ่งที่ต้องระวังที่สุดสำหรับสถานะการเงินแบบนี้"
}
กติกา: คำแนะนำลงทุนต้องระบุความเสี่ยงเสมอ และย้ำว่าเป็นข้อมูลประกอบ ไม่ใช่คำแนะนำการลงทุนเฉพาะบุคคล · ตัวเลขต้องคำนวณจริงจากที่กรอกมา`,
    },
  ],
  hr: [
    {
      key: 'resume', label: 'คัดกรองผู้สมัคร', Icon: Users, color: '#A78BFA',
      desc: 'แนบเรซูเม่ + ผลงานจริงของผู้สมัคร → AI วิเคราะห์เนื้องานลึกถึงระดับว่าเขาละเอียดแค่ไหน ใช้ AI เป็นไหม พร้อมประเมินฐานเงินเดือนตามค่าครองชีพจังหวัดของคุณ',
      images: 10, action: 'rival',
      fields: [
        { k: 'name', label: 'ชื่อผู้สมัคร', ph: 'สมชาย ใจดี', required: true },
        { k: 'birth', label: 'วันเดือนปีเกิด', ph: '15/03/2540', required: true },
        { k: 'birthTime', label: 'เวลาเกิด (ถ้าทราบ)', ph: '08:30' },
        { k: 'position', label: 'ตำแหน่งที่รับสมัคร', ph: 'กราฟิกดีไซเนอร์', required: true },
        { k: 'companyLocation', label: 'ที่ตั้งบริษัทเรา', ph: 'คลองหลวง ปทุมธานี', required: true },
        { k: 'candidateLocation', label: 'ที่อยู่ผู้สมัคร', ph: 'ลำลูกกา ปทุมธานี' },
        { k: 'expectedSalary', label: 'เงินเดือนที่ขอ', ph: '25000' },
        { k: 'lastSalary', label: 'เงินเดือนที่เดิม', ph: '20000' },
        { k: 'education', label: 'วุฒิ/คณะ/สถาบัน', ph: 'ปริญญาตรี นิเทศศิลป์ ม.กรุงเทพ' },
        { k: 'experience', label: 'ประสบการณ์', ph: '3 ปี ที่บริษัท ABC ทำโฆษณาให้แบรนด์เครื่องสำอาง' },
        { k: 'skills', label: 'โปรแกรม/ทักษะที่ระบุ', ph: 'Photoshop, Illustrator, Premiere, ใช้ Midjourney ได้' },
        { k: 'transport', label: 'การเดินทาง/ใบขับขี่', ph: 'มีมอเตอร์ไซค์ มีใบขับขี่' },
        { k: 'imageNote', label: 'บอกว่ารูปไหนคืออะไร', ph: 'รูป 1-2 = เรซูเม่, รูป 3-8 = ผลงาน', big: true },
        { k: 'need', label: 'คุณสมบัติที่เราต้องการจริงๆ', ph: 'ทำงานละเอียด ตรวจงานตัวเองได้ รับแรงกดดัน ทำงานเป็นทีม', big: true },
      ],
      sys: `คุณคือผู้จัดการฝ่ายบุคคลระดับมืออาชีพที่คัดคนเก่งมาก และเชี่ยวชาญโหราศาสตร์ไทยด้วย
วิเคราะห์ผู้สมัครจากภาพที่แนบ (มีทั้งเรซูเม่และตัวอย่างผลงานจริง) อย่างลึกซึ้ง ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json

{
 "title":"ผลคัดกรองผู้สมัคร",
 "overallPercent":0-100,
 "grade":"ไม่ผ่าน | พอใช้ | ดี | ดีเยี่ยม",
 "verdict":"ควรนัดสัมภาษณ์ | พิจารณาเพิ่ม | ไม่ผ่าน",
 "headline":"สรุปตัวตนผู้สมัครคนนี้ 1-2 ประโยค",
 "scoreBreakdown":[{"หัวข้อ":"เนื้องาน/ผลงาน","คะแนน":0-100,"เหตุผล":"อ้างสิ่งที่เห็นในภาพจริง"},{"หัวข้อ":"ประสบการณ์","คะแนน":0-100,"เหตุผล":"..."},{"หัวข้อ":"ทักษะ/โปรแกรม","คะแนน":0-100,"เหตุผล":"..."},{"หัวข้อ":"การศึกษา","คะแนน":0-100,"เหตุผล":"..."},{"หัวข้อ":"ความเสี่ยงการเดินทาง","คะแนน":0-100,"เหตุผล":"..."},{"หัวข้อ":"ความเข้ากับทีม","คะแนน":0-100,"เหตุผล":"..."}],
 "workAnalysis":{"usesAI":"ใช้ AI สร้างงานหรือไม่ ดูจากอะไร","aiSkillLevel":"ถ้าใช้ AI เก่งแค่ไหน","detailLevel":"ละเอียดแค่ไหน — มีคำผิด ภาษาเพี้ยน หรือจุดที่ AI สร้างพลาดแล้วปล่อยผ่านไหม","postEditing":"เอางาน AI มาแก้ต่อเองไหม หรือปล่อยตามที่ได้มา","originality":"งานมีเอกลักษณ์หรือลอกแพทเทิร์นสำเร็จรูป","projectScale":"ผลงานเป็นโปรเจกต์ใหญ่หรือเล็ก แบรนด์ระดับไหน","verdict":"สรุปศักยภาพจากเนื้องานจริง"},
 "salaryAnalysis":{"suggestedRange":"ช่วงเงินเดือนที่ควรให้ (บาท)","reasoning":"อธิบายว่าคำนวณจากอะไรบ้าง","costOfLiving":"ค่าครองชีพจังหวัดที่บริษัทตั้งอยู่ประมาณเท่าไหร่","expectationGap":"เงินเดือนที่เขาขอ สมเหตุสมผลไหม","negotiationTip":"ถ้าจะต่อรอง ควรเสนอยังไง"},
 "commute":{"distance":"ประเมินระยะทาง/เวลาเดินทาง","risk":"ต่ำ|กลาง|สูง","note":"เสี่ยงลาออกเพราะเดินทางไหม"},
 "astrology":{"zodiac":"ราศี","dayColor":"วันเกิดในสัปดาห์ + สีมงคล","element":"ธาตุ","personality":["ลักษณะนิสัยตามหลักโหราศาสตร์"],"workStyle":"สไตล์การทำงาน","fitWithRole":"เข้ากับตำแหน่งนี้ไหม","caution":"สิ่งที่ต้องระวังเวลาร่วมงาน"},
 "redFlags":["สัญญาณเตือน เช่น อ้างว่าทำเป็นหลายอย่างเกินจริง งานตัดแปะ"],
 "hiddenPotential":"ถ้าประสบการณ์น้อยแต่มีแววบางอย่าง ให้ระบุว่าแววอะไร คุ้มที่จะเสี่ยงไหม",
 "nextStep":"ขั้นตอนถัดไปที่ควรทำ"
}
กติกา: ต้องดูภาพผลงานจริงแล้ววิเคราะห์ตรงๆ ไม่เดา · ถ้าภาพไม่พอ ให้บอกใน redFlags · โหราศาสตร์เป็นข้อมูลประกอบ การตัดสินหลักต้องมาจากเนื้องานและทักษะ · ค่าครองชีพอิงข้อมูลจังหวัดไทยจริง`,
    },
    {
      key: 'interview', label: 'สร้างคำถามสัมภาษณ์ + บันทึกผล', Icon: FileText, color: '#22D3EE',
      desc: 'AI ออกคำถาม 10 ข้อเจาะลึกเฉพาะตำแหน่ง — มีคำถามจับโกหกสำหรับคนที่อ้างว่าทำเป็น พร้อมช่องให้ HR กรอกคำตอบและพฤติกรรมที่สังเกตได้',
      action: 'rival',
      fields: [
        { k: 'name', label: 'ชื่อผู้สมัคร', ph: 'สมชาย ใจดี', required: true },
        { k: 'position', label: 'ตำแหน่ง', ph: 'กราฟิกดีไซเนอร์', required: true },
        { k: 'claims', label: 'สิ่งที่เขาอ้างว่าทำเป็น', ph: 'บอกว่าเคยทำโฆษณาให้แบรนด์ใหญ่ ใช้ AI เป็น ตัดต่อได้', big: true },
        { k: 'answers', label: 'คำตอบที่เขาตอบ (กรอกหลังสัมภาษณ์)', ph: 'ข้อ 1 ตอบว่า... ข้อ 2 ตอบว่า...', big: true },
        { k: 'behavior', label: 'พฤติกรรมที่สังเกต', ph: 'มาตรงเวลา แต่งกายสุภาพ พูดน้อย สบตาน้อย ตอบช้าตอนถามลึก', big: true },
        { k: 'personal', label: 'ข้อมูลส่วนตัวที่ได้', ph: 'มีแฟน อยู่หอใกล้ที่ทำงาน ตั้งใจย้ายมาอยู่ใกล้ๆ' },
      ],
      sys: `คุณคือผู้สัมภาษณ์งานมืออาชีพที่เชี่ยวชาญจิตวิทยาและจับโกหกเก่ง ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ชุดคำถามและผลสัมภาษณ์",
 "questions":[{"no":1,"question":"คำถาม","purpose":"ถามเพื่อวัดอะไร","goodAnswer":"คำตอบที่ดีควรมีอะไร","redFlagAnswer":"ถ้าตอบแบบไหนคือสัญญาณไม่ดี","type":"เนื้องาน|จับโกหก|จิตวิทยา|ความพร้อม"}],
 "verificationQuestions":["คำถามเฉพาะสำหรับตรวจว่าเขาทำเป็นจริงหรือแค่พูด — ต้องเจาะลึกจนคนที่ไม่เคยทำจริงตอบไม่ได้"],
 "assessment":{"honesty":"ประเมินความจริงใจจากคำตอบที่กรอกมา หรือ null ถ้ายังไม่ได้กรอก","skillReal":"ทำเป็นจริงหรือแค่เคยเห็น","personality":"อินโทรเวิร์ต|เอ็กซ์โทรเวิร์ต|ก้ำกึ่ง พร้อมเหตุผล","fullGlass":"เป็นคนน้ำเต็มแก้วไหม สอนได้ไหม","decisionMaking":"ตัดสินใจเองได้ไหม","empathy":"เห็นอกเห็นใจคนอื่นไหม","teamFit":"เข้ากับทีมได้ไหม","readiness":"ความพร้อมเริ่มงาน"},
 "overallPercent":0-100,
 "recommendation":"รับ | รับแบบทดลองงาน | ไม่รับ",
 "reasoning":"เหตุผลประกอบการตัดสินใจ",
 "onboardingTips":["ถ้ารับ ควรดูแลเขายังไงในเดือนแรก"]
}
กติกา: ถ้ายังไม่ได้กรอกคำตอบ ให้ออกคำถามอย่างเดียวแล้วใส่ assessment เป็น null`,
    },
    {
      key: 'kpi', label: 'ประเมินพนักงาน + ขึ้นเงินเดือน', Icon: Award, color: '#F472B6',
      desc: 'กรอกสถิติการทำงาน (มาสาย ลา ผลงาน) → AI ประเมินเป็น % บอกว่าควรขึ้นเงินเดือน เลื่อนตำแหน่ง หรือควรให้ออก',
      action: 'deepAnalysis',
      fields: [
        { k: 'name', label: 'ชื่อพนักงาน', ph: 'สมหญิง - ตัดต่อวิดีโอ', required: true },
        { k: 'salary', label: 'เงินเดือนปัจจุบัน', ph: '18000' },
        { k: 'months', label: 'ทำงานมากี่เดือน', ph: '14' },
        { k: 'attendance', label: 'สถิติเข้างาน', ph: 'มาสาย 6 ครั้ง รวม 95 นาที ลากิจ 2 ลาป่วย 3 ขาดงาน 0', big: true },
        { k: 'output', label: 'ผลงาน', ph: 'ส่งงาน 58 ชิ้น ผ่าน QC ครั้งแรก 42 ชิ้น แก้เฉลี่ย 1.2 รอบ', big: true },
        { k: 'behavior', label: 'พฤติกรรม/ทัศนคติ', ph: 'ช่วยทีม รับงานด่วนได้ แต่ไม่ค่อยเสนอไอเดีย', big: true },
      ],
      sys: `คุณคือผู้จัดการที่ประเมินผลงานอย่างเป็นธรรมและตรงไปตรงมา ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ผลประเมินพนักงาน",
 "overallPercent":0-100,
 "grade":"ต้องปรับปรุงด่วน | พอใช้ | ดี | ดีเยี่ยม",
 "scores":[{"ด้าน":"ผลงาน","คะแนน":0-100,"เหตุผล":"อ้างตัวเลขจริง"},{"ด้าน":"ความตรงต่อเวลา","คะแนน":0-100,"เหตุผล":"..."},{"ด้าน":"คุณภาพงาน","คะแนน":0-100,"เหตุผล":"..."},{"ด้าน":"ทัศนคติ/ทีมเวิร์ก","คะแนน":0-100,"เหตุผล":"..."}],
 "salaryDecision":{"shouldRaise":true/false,"suggestedRaise":"ขึ้นกี่บาท หรือกี่ %","newSalary":"เงินเดือนใหม่ที่แนะนำ","reasoning":"เหตุผลอ้างตัวเลข","timing":"ควรขึ้นเมื่อไหร่"},
 "promotion":{"ready":true/false,"toPosition":"ตำแหน่งที่เหมาะ หรือ null","whatIsMissing":"ยังขาดอะไรถึงจะเลื่อนได้"},
 "bonusSuggestion":"ควรให้โบนัสเท่าไหร่ต่อปี พร้อมเหตุผล",
 "keepOrLet":{"decision":"เก็บไว้ | เก็บไว้แต่ต้องคุย | ควรให้ออก","reasoning":"เหตุผลตรงไปตรงมา","costOfReplacing":"ถ้าหาคนใหม่ต้องเสียอะไรบ้าง"},
 "developmentPlan":[{"skill":"ทักษะที่ควรพัฒนา","how":"พัฒนายังไง","timeline":"กรอบเวลา","measure":"วัดผลยังไง"}],
 "talkingPoints":["ประเด็นที่ควรคุยกับเขาในการประชุมประเมิน"],
 "warning":"สิ่งที่ต้องระวังทางกฎหมายแรงงาน หรือ null"
}`,
    },
  ],
  qc: [
    {
      key: 'check', label: 'ตรวจงานก่อนเผยแพร่', Icon: ClipboardCheck, color: '#FBBF24',
      desc: 'แนบภาพงาน/คลิป + ระบุเกณฑ์ → AI ตรวจละเอียดว่าผ่านไหม อะไรต้องแก้ก่อนปล่อย',
      images: 8, action: 'review',
      fields: [
        { k: 'what', label: 'งานอะไร', ph: 'คลิปโปรโมทสินค้า 30 วิ', required: true },
        { k: 'standard', label: 'เกณฑ์ที่ต้องผ่าน', ph: 'ภาพคมชัด ไม่มีคำผิด โลโก้อยู่มุมขวาบน มี CTA ท้ายคลิป' },
      ],
      sys: `คุณคือหัวหน้าฝ่ายควบคุมคุณภาพที่ละเอียดมาก ตรวจงานจากภาพที่แนบ ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{"title":"ผลตรวจ QC","passed":true/false,"score":1-10,"headline":"สรุป 1 ประโยค",
"checklist":[{"item":"หัวข้อตรวจ","status":"ผ่าน|ไม่ผ่าน|ต้องดูเพิ่ม","detail":"รายละเอียด"}],
"mustFix":[{"issue":"ปัญหา","where":"อยู่ตรงไหน","how":"แก้ยังไง","severity":"high|medium|low"}],
"niceToHave":["ปรับได้จะดีขึ้น"],
"riskIfPublished":"ถ้าปล่อยทั้งที่ยังไม่แก้ จะเกิดอะไร",
"verdict":"ปล่อยได้ | แก้ก่อนปล่อย | ทำใหม่"}`,
    },
  ],
  rnd: [
    {
      key: 'trend', label: 'วิเคราะห์เทรนด์และโอกาส', Icon: Radar, color: '#22D3EE',
      desc: 'แนบภาพเทรนด์/คู่แข่ง/ข้อมูลตลาด → AI สรุปโอกาสและความเสี่ยง พร้อมข้อเสนอที่ลงมือได้',
      images: 8, action: 'deepAnalysis',
      fields: [
        { k: 'topic', label: 'หัวข้อที่อยากรู้', ph: 'เทรนด์คอนเทนต์สัตว์ AI ในไทยตอนนี้', required: true },
        { k: 'context', label: 'บริบทของเรา', ph: 'เรามี 4 ช่อง ลง Facebook เป็นหลัก' },
      ],
      sys: `คุณคือนักวิจัยตลาดและนักวิเคราะห์เทรนด์ ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{"title":"รายงานวิจัย","headline":"สรุปสถานการณ์ 1 ประโยค",
"findings":[{"finding":"สิ่งที่พบ","evidence":"หลักฐาน/เหตุผล","implication":"แปลว่าอะไรกับเรา"}],
"opportunities":[{"opportunity":"โอกาส","howToCapture":"คว้ายังไง","effort":"low|medium|high","impact":"low|medium|high"}],
"threats":[{"threat":"ความเสี่ยง","mitigation":"รับมือยังไง"}],
"recommendation":"ข้อเสนอหลัก 1 ข้อที่ควรทำก่อน",
"nextSteps":["ขั้นตอนถัดไปที่ทำได้ทันที"],
"confidence":"ความมั่นใจของบทวิเคราะห์นี้ และข้อมูลอะไรที่ยังขาด"}`,
    },
  ],
  marketing: [
    {
      key: 'campaign', label: 'วางแคมเปญการตลาด', Icon: Megaphone, color: '#F472B6',
      desc: 'ระบุเป้าหมาย งบ และกลุ่มเป้าหมาย → AI วางแคมเปญครบตั้งแต่ข้อความ ช่องทาง จนถึงวิธีวัดผล',
      action: 'plan',
      fields: [
        { k: 'goal', label: 'เป้าหมายแคมเปญ', ph: 'เพิ่มผู้ติดตาม 5000 คนใน 1 เดือน', required: true },
        { k: 'budget', label: 'งบประมาณ', ph: '5000 บาท' },
        { k: 'audience', label: 'กลุ่มเป้าหมาย', ph: 'ผู้หญิง 25-40 สนใจสัตว์และคอนเทนต์ผ่อนคลาย' },
        { k: 'product', label: 'สินค้า/บริการ (ถ้ามี)', ph: 'ครีมบำรุงผิว' },
      ],
      sys: `คุณคือนักวางแผนการตลาดดิจิทัลมืออาชีพ ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{"title":"แผนแคมเปญ","bigIdea":"แก่นของแคมเปญ 1 ประโยค",
"positioning":"วางตำแหน่งยังไงให้ต่างจากคู่แข่ง",
"messages":[{"angle":"มุมสื่อสาร","headline":"พาดหัวที่ใช้ได้จริง","why":"เหตุผลเชิงจิตวิทยา"}],
"channels":[{"channel":"ช่องทาง","budgetShare":"สัดส่วนงบ %","why":"ทำไมช่องนี้","kpi":"วัดด้วยอะไร"}],
"timeline":[{"phase":"ช่วง","days":"กี่วัน","do":"ทำอะไร"}],
"contentIdeas":["ไอเดียคอนเทนต์ที่ใช้ได้เลย"],
"kpiTargets":[{"metric":"ตัวชี้วัด","target":"เป้า","how":"วัดยังไง"}],
"budgetBreakdown":[{"item":"รายการ","amount":ตัวเลข,"note":"หมายเหตุ"}],
"risks":["ความเสี่ยงและวิธีรับมือ"]}`,
    },
  ],
  sales: [
    {
      key: 'reply', label: 'ช่วยตอบลูกค้า / ปิดการขาย', Icon: ShoppingCart, color: '#34D399',
      desc: 'วางข้อความที่ลูกค้าทักมา → AI ร่างคำตอบที่ปิดการขายได้ พร้อมรับมือข้อโต้แย้ง',
      action: 'productFit',
      fields: [
        { k: 'message', label: 'ข้อความจากลูกค้า', ph: 'สนใจค่ะ แต่ราคาแพงไปหน่อย มีลดไหม', required: true, big: true },
        { k: 'product', label: 'สินค้า/ราคา', ph: 'ครีมบำรุงผิว 890 บาท ต้นทุน 400' },
        { k: 'policy', label: 'เงื่อนไขที่ให้ได้', ph: 'ลดได้ไม่เกิน 10% ส่งฟรีเมื่อซื้อ 2 ชิ้น' },
      ],
      sys: `คุณคือเซลส์มืออาชีพที่ปิดการขายเก่งโดยไม่กดดันลูกค้า ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{"title":"แนวทางตอบลูกค้า","customerIntent":"ลูกค้าต้องการอะไรจริงๆ","stage":"ขั้นตอนที่ลูกค้าอยู่ตอนนี้",
"replies":[{"tone":"โทนที่ใช้ เช่น อบอุ่น/มืออาชีพ/เร่งปิด","text":"ข้อความที่ส่งได้เลย","whenToUse":"ใช้ตอนไหน"}],
"objectionHandling":[{"objection":"ข้อโต้แย้งที่จะเจอต่อ","response":"ตอบยังไง"}],
"upsell":"เสนอเพิ่มอะไรได้บ้าง โดยไม่ทำให้เสียดีล",
"doNot":["สิ่งที่ห้ามพูด"],
"closingLine":"ประโยคปิดการขายที่แนะนำ",
"followUp":"ถ้าลูกค้าเงียบ ควรตามเมื่อไหร่และพูดว่าอะไร"}`,
    },
  ],
  content: [
    {
      key: 'ideas', label: 'คลังไอเดียคอนเทนต์', Icon: Sparkles, color: '#4A9DFF',
      desc: 'ระบุช่องและแนว → AI คิดไอเดียคอนเทนต์พร้อมฮุกและมุมเล่า เก็บไว้ใช้ทั้งเดือน',
      action: 'plan',
      fields: [
        { k: 'channel', label: 'ช่อง/แนวคอนเทนต์', ph: 'ช่องวาฬ AI เสมือนจริง ลง Facebook', required: true },
        { k: 'count', label: 'อยากได้กี่ไอเดีย', ph: '10' },
        { k: 'avoid', label: 'เคยทำไปแล้ว (ห้ามซ้ำ)', ph: 'วาฬกินแพลงก์ตอน, วาฬว่ายกับพระอาทิตย์ตก' },
      ],
      sys: `คุณคือครีเอทีฟไดเรกเตอร์คอนเทนต์สั้น ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{"title":"คลังไอเดียคอนเทนต์",
"ideas":[{"no":1,"concept":"แนวคิดคลิป","hook":"ฮุก 3 วินาทีแรก เขียนให้เห็นภาพ","story":"เล่าเรื่องยังไง","emotion":"อารมณ์ที่ต้องการให้คนดูรู้สึก","cta":"ปิดท้ายยังไง","difficulty":"ง่าย|กลาง|ยาก"}],
"seriesIdea":"ถ้าทำเป็นซีรีส์ต่อเนื่อง ควรร้อยเรื่องยังไง",
"trendTie":"ผูกกับเทรนด์อะไรได้บ้าง"}`,
    },
  ],
};

// แสดงผล JSON จาก AI ให้อ่านง่ายแบบอัตโนมัติ
function AutoResult({ data }) {
  if (!data || typeof data !== 'object') return null;
  const sevCol = (v) => {
    const t = String(v || '').toLowerCase();
    if (['high', 'ไม่ผ่าน', 'ยาก', 'ทำใหม่'].some((x) => t.includes(x))) return C.red;
    if (['medium', 'กลาง', 'ต้องดูเพิ่ม', 'แก้ก่อนปล่อย', 'สัมภาษณ์เพิ่ม'].some((x) => t.includes(x))) return C.orange;
    if (['low', 'ผ่าน', 'ง่าย', 'ปล่อยได้', 'ควรรับ'].some((x) => t.includes(x))) return C.emerald;
    return C.blue;
  };
  const skip = new Set(['title']);

  function renderVal(key, val) {
    if (val == null || val === '') return null;
    // ตัวเลขคะแนน
    if (typeof val === 'number' && /score|fitScore|healthScore/i.test(key)) {
      const max = /health/i.test(key) ? 100 : 10;
      const col = val >= max * 0.75 ? C.emerald : val >= max * 0.45 ? C.orange : C.red;
      return (
        <div className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${col}` }}>
          <span className="font-display text-2xl font-bold leading-none" style={{ color: col }}>{val}<span className="font-mono text-xs" style={{ color: C.muted }}>/{max}</span></span>
          <span className="font-mono text-2xs" style={{ color: C.muted }}>{key}</span>
        </div>
      );
    }
    if (typeof val === 'boolean') {
      return <span className="font-mono text-2xs px-2 py-1 rounded" style={{ color: val ? C.emerald : C.red, border: `1px solid ${val ? C.emerald : C.red}` }}>{val ? 'ผ่าน' : 'ไม่ผ่าน'}</span>;
    }
    if (typeof val === 'string' || typeof val === 'number') {
      return <p className="font-body text-xs whitespace-pre-wrap" style={{ color: C.text }}>{String(val)}</p>;
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return null;
      if (typeof val[0] === 'string') {
        return <ul className="space-y-1">{val.map((x, i) => <li key={i} className="font-body text-xs flex gap-1.5" style={{ color: C.text }}><span style={{ color: C.blue }}>▸</span>{x}</li>)}</ul>;
      }
      // array ของ object → การ์ด
      return (
        <div className="space-y-1.5">
          {val.map((o, i) => {
            const entries = Object.entries(o).filter(([, v]) => v != null && v !== '');
            const sevKey = entries.find(([k]) => /severity|priority|status|difficulty|impact|effort|verdict/i.test(k));
            const col = sevKey ? sevCol(sevKey[1]) : C.border;
            return (
              <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderLeft: `3px solid ${col}` }}>
                {entries.map(([k, v], j) => (
                  <div key={k} className={j === 0 ? '' : 'mt-0.5'}>
                    {j === 0 ? (
                      <div className="font-body text-xs" style={{ color: col === C.border ? C.text : col }}>
                        {typeof v === 'number' && /amount|total/i.test(k) ? `${v.toLocaleString()} ฿` : String(v)}
                      </div>
                    ) : (
                      <div className="font-body text-xs" style={{ color: C.muted }}>
                        <span style={{ color: C.blue }}>{k}: </span>
                        {typeof v === 'number' && /amount|total|vat/i.test(k) ? `${v.toLocaleString()} ฿` : String(v)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    }
    // object → แสดงเป็นคู่ key/value
    return (
      <div className="p-2.5 rounded-xl space-y-1" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
        {Object.entries(val).filter(([, v]) => v != null && v !== '').map(([k, v]) => (
          <div key={k}>
            <span className="font-mono text-2xs" style={{ color: C.blue }}>{k}: </span>
            {Array.isArray(v)
              ? <span className="font-body text-xs" style={{ color: C.text }}>{v.join(' · ')}</span>
              : <span className="font-body text-xs" style={{ color: C.text }}>{typeof v === 'number' && /amount|total|vat|subtotal|grand/i.test(k) ? `${v.toLocaleString()} ฿` : String(v)}</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.title && <h4 className="font-body text-base" style={{ color: C.text }}>{data.title}</h4>}
      {Object.entries(data).filter(([k, v]) => !skip.has(k) && v != null && v !== '').map(([k, v]) => (
        <div key={k}>
          <div className="font-mono text-2xs mb-1 tracking-wide" style={{ color: C.muted }}>{k}</div>
          {renderVal(k, v)}
        </div>
      ))}
    </div>
  );
}

function DeptTool({ tool, deptId, records, setRecords, showToast }) {
  const [vals, setVals] = useState({});
  const [imgs, setImgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [openId, setOpenId] = useState(null);

  const mine = (records || []).filter((r) => r.dept === deptId && r.tool === tool.key);
  const active = mine.find((r) => r.id === openId) || mine[mine.length - 1] || null;

  async function addFiles(files) {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith('image/')).slice(0, tool.images || 0);
    const out = await Promise.all(arr.map(async (f) => {
      const base64 = await fileToBase64(f);
      const mimeType = f.type || 'image/jpeg';
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, mimeType, base64, dataUrl: `data:${mimeType};base64,${base64}` };
    }));
    setImgs((p) => [...p, ...out].slice(0, tool.images || 0));
  }

  async function run() {
    const missing = (tool.fields || []).filter((f) => f.required && !String(vals[f.k] || '').trim());
    if (missing.length) { setErr(`กรุณากรอก: ${missing.map((m) => m.label).join(', ')}`); return; }
    if (tool.images && imgs.length === 0 && (tool.fields || []).length === 0) { setErr('กรุณาแนบรูปอย่างน้อย 1 รูป'); return; }
    setBusy(true); setErr('');
    const body = (tool.fields || []).map((f) => `${f.label}: ${vals[f.k] || '-'}`).join('\n');
    try {
      const text = await callClaude(tool.sys, body || 'วิเคราะห์จากภาพที่แนบมา',
        imgs.length ? imgs.map((i) => ({ mimeType: i.mimeType, data: i.base64 })) : undefined, tool.action);
      const json = parseJsonLoose(text);
      const rec = { id: `${Date.now()}`, at: Date.now(), date: todayDateStr(), dept: deptId, tool: tool.key, toolLabel: tool.label, input: { ...vals }, thumb: imgs[0]?.dataUrl || null, imageCount: imgs.length, data: json };
      setRecords([...(records || []), rec].slice(-300));
      setOpenId(rec.id);
      setVals({}); setImgs([]);
      showToast('วิเคราะห์เสร็จแล้ว');
    } catch (e) { setErr(e.message || 'ไม่สำเร็จ'); }
    setBusy(false);
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-1">
        <tool.Icon size={15} style={{ color: tool.color }} />
        <span className="font-body text-sm" style={{ color: C.text }}>{tool.label}</span>
      </div>
      <p className="font-body text-xs mb-3 leading-relaxed" style={{ color: C.muted }}>{tool.desc}</p>

      {tool.images > 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          className="p-3.5 rounded-xl mb-2.5 text-center"
          style={{ background: C.bgDeep, border: `1.5px dashed ${C.border}` }}
        >
          <Upload size={18} style={{ color: C.muted }} className="mx-auto mb-1.5" />
          <p className="font-body text-xs mb-2" style={{ color: C.muted }}>ลากรูปมาวาง หรือกดเลือก (สูงสุด {tool.images} รูป)</p>
          <label className="inline-flex font-mono text-2xs px-3 py-1.5 rounded-lg cursor-pointer items-center gap-1.5" style={{ background: tool.color, color: '#111' }}>
            <Upload size={11} /> เลือกรูป
            <input type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} className="hidden" />
          </label>
          {imgs.length > 0 && (
            <div className="grid grid-cols-5 gap-1.5 mt-2.5">
              {imgs.map((im) => (
                <div key={im.id} className="relative rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  <img src={im.dataUrl} alt="" className="w-full object-cover" style={{ height: 46 }} />
                  <button onClick={() => setImgs((p) => p.filter((x) => x.id !== im.id))} className="absolute top-0.5 right-0.5 rounded-full p-0.5" style={{ background: 'rgba(0,0,0,.7)', color: '#fff' }}><X size={9} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-2 mb-2.5">
        {(tool.fields || []).map((f) => (
          <div key={f.k} className={f.big ? 'sm:col-span-2' : ''}>
            <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>{f.label}{f.required && <span style={{ color: C.red }}> *</span>}</label>
            {f.big
              ? <textarea value={vals[f.k] || ''} onChange={(e) => setVals((v) => ({ ...v, [f.k]: e.target.value }))} rows={3} placeholder={f.ph} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
              : <input value={vals[f.k] || ''} onChange={(e) => setVals((v) => ({ ...v, [f.k]: e.target.value }))} placeholder={f.ph} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />}
          </div>
        ))}
      </div>

      {err && <p className="font-mono text-2xs mb-2" style={{ color: C.red }}>{err}</p>}
      <button onClick={run} disabled={busy} className="font-mono text-2xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: tool.color, color: '#111', opacity: busy ? 0.6 : 1 }}>
        {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI วิเคราะห์
      </button>

      {mine.length > 0 && (
        <>
          <div className="flex gap-1.5 mt-3 mb-2 flex-wrap">
            {mine.slice().reverse().slice(0, 8).map((r) => (
              <button key={r.id} onClick={() => setOpenId(r.id)} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ background: active?.id === r.id ? tool.color : 'transparent', color: active?.id === r.id ? '#111' : C.muted, border: `1px solid ${active?.id === r.id ? 'transparent' : C.border}` }}>
                {new Date(r.at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} {new Date(r.at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
          {active && (
            <div className="p-3 rounded-xl mt-1" style={{ background: C.panel, border: `1px solid ${tool.color}44` }}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-2xs" style={{ color: C.muted }}>บันทึกเมื่อ {new Date(active.at).toLocaleString('th-TH')}{active.imageCount ? ` · ${active.imageCount} รูป` : ''}</span>
                <button onClick={() => { setRecords((records || []).filter((x) => x.id !== active.id)); setOpenId(null); }} style={{ color: C.muted }}><Trash2 size={12} /></button>
              </div>
              <AutoResult data={active.data} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DeptWorkspace({ dept, records, setRecords, showToast }) {
  const tools = DEPT_TOOLS[dept.id] || [];
  const [active, setActive] = useState(tools[0]?.key || null);
  if (tools.length === 0) {
    return <p className="font-body text-xs p-4 rounded-2xl" style={{ color: C.muted, background: C.panel, border: `1px solid ${C.border}` }}>แผนกนี้ยังไม่มีเครื่องมือ AI</p>;
  }
  const tool = tools.find((t) => t.key === active) || tools[0];
  const deptRecords = (records || []).filter((r) => r.dept === dept.id);
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {tools.map((t) => (
            <button key={t.key} onClick={() => setActive(t.key)} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: active === t.key ? t.color : 'transparent', color: active === t.key ? '#111' : C.muted, border: `1px solid ${active === t.key ? 'transparent' : C.border}` }}>
              <t.Icon size={11} /> {t.label}
            </button>
          ))}
        </div>
        {deptRecords.length > 0 && <span className="font-mono text-2xs" style={{ color: C.muted }}>บันทึกไว้ {deptRecords.length} รายการ</span>}
      </div>
      <DeptTool tool={tool} deptId={dept.id} records={records} setRecords={setRecords} showToast={showToast} />
    </div>
  );
}

function Directory({ user, denied, onOpen, features }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="mb-6"><div className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>DEPARTMENT DIRECTORY</div><h2 className="font-body text-xl mt-1" style={{ color: C.text }}>เลือกแผนกที่ต้องการเข้าถึง</h2></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEPARTMENTS.filter((d) => user.isOwner || !features || features.departments?.[d.id] !== false)
          .map((d) => <DeptCard key={d.id} dept={d} userClearance={user.clearance} denied={denied} onOpen={onOpen} />)}
      </div>
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

function DepartmentView({ dept, onBack, records, setRecords, showToast }) {
  const Icon = dept.icon;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-stamp">
      <button onClick={onBack} className="font-mono text-2xs tracking-widest mb-4" style={{ color: C.muted }}>← กลับไปไดเรกทอรี</button>
      <div className="relative p-5 mb-6 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3"><IconBadge Icon={Icon} accent={dept.accent} size={46} /><div><div className="font-mono text-2xs tracking-widest" style={{ color: dept.accent }}>{dept.en}</div><div className="font-body text-lg" style={{ color: C.text }}>{dept.th}</div></div></div>
        <p className="font-body text-sm mt-3" style={{ color: C.muted }}>{dept.brief}</p>
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}><Bot size={14} style={{ color: dept.accent }} /><span className="font-body text-xs" style={{ color: C.text }}>{dept.manager}</span><span className="font-mono text-2xs" style={{ color: C.muted }}>· ดำเนินการโดย AI ภายใต้การกำกับของคุณ</span></div>
      </div>
      {/* เครื่องมือ AI ของแผนกนี้ — ใช้งานได้จริง เก็บผลไว้ดูย้อนหลังได้ */}
      <DeptWorkspace dept={dept} records={records} setRecords={setRecords} showToast={showToast} />

      <details className="mb-6">
        <summary className="font-mono text-2xs cursor-pointer mb-2" style={{ color: C.muted }}>ดูโครงสร้างตำแหน่งงานในแผนกนี้ ({dept.roles.length})</summary>
        <div className="space-y-3 mt-2">{dept.roles.map((r, i) => <RoleFile key={r.en} role={r} index={i} accent={dept.accent} />)}</div>
      </details>
      {false && dept.hasChart && (
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

// ---------- แผงผู้ดูแลระบบ: แบน / บันทึกกิจกรรม / สำรองข้อมูล ----------
function AdminSecurityPanel({ user }) {
  const [tab, setTab] = useState('bans');
  const [bans, setBans] = useState([]);
  const [log, setLog] = useState([]);
  const [backups, setBackups] = useState([]);
  const [target, setTarget] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user.clearance !== 3) return;
    apiPost('/api/auth', { action: 'listBans' }).then(({ data }) => setBans(data.bans || [])).catch(() => {});
    apiPost('/api/auth', { action: 'activityLog' }).then(({ data }) => setLog(data.log || [])).catch(() => {});
    apiPost('/api/auth', { action: 'listBackups' }).then(({ data }) => setBackups(data.backups || [])).catch(() => {});
  }, [user.clearance]);

  if (user.clearance !== 3) return null;

  async function doBan() {
    if (!target.trim()) return;
    setBusy(true);
    const { ok, data } = await apiPost('/api/auth', { action: 'addBan', target: target.trim(), reason });
    if (ok) { setBans(data.bans || []); setTarget(''); setReason(''); setMsg('แบนแล้ว'); }
    setBusy(false); setTimeout(() => setMsg(''), 2500);
  }
  async function unban(id) {
    const { ok, data } = await apiPost('/api/auth', { action: 'removeBan', target: id });
    if (ok) { setBans(data.bans || []); setMsg('ปลดแบนแล้ว'); setTimeout(() => setMsg(''), 2500); }
  }
  async function backupNow() {
    setBusy(true);
    const { ok, data } = await apiPost('/api/auth', { action: 'runBackup' });
    if (ok) { setBackups(data.backups || []); setMsg('สำรองข้อมูลแล้ว'); }
    setBusy(false); setTimeout(() => setMsg(''), 2500);
  }

  const TABS = [
    { key: 'bans', label: `รายชื่อที่ถูกแบน (${bans.length})` },
    { key: 'log', label: 'บันทึกกิจกรรม' },
    { key: 'backup', label: `สำรองข้อมูล (${backups.length})` },
  ];

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert size={14} style={{ color: C.red }} />
        <span className="font-mono text-2xs tracking-widest" style={{ color: C.red }}>ศูนย์ควบคุมความปลอดภัย</span>
      </div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ background: tab === t.key ? BRAND : 'transparent', color: tab === t.key ? '#fff' : C.muted, border: `1px solid ${tab === t.key ? 'transparent' : C.border}` }}>{t.label}</button>
        ))}
      </div>
      {msg && <p className="font-mono text-2xs mb-2" style={{ color: C.emerald }}>{msg}</p>}

      {tab === 'bans' && (
        <div>
          <p className="font-body text-xs mb-2 leading-relaxed" style={{ color: C.muted }}>
            ระบบแบนอัตโนมัติเมื่อมีพฤติกรรมน่าสงสัยเกิน 15 ครั้งใน 1 ชม. (เช่น กรอกรหัสผิดรัวๆ) หรือแบนเองด้วยการใส่ IP/อีเมลด้านล่าง
          </p>
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="IP หรืออีเมลที่ต้องการแบน" className="flex-1 min-w-[140px] px-2 py-1.5 font-mono text-2xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="เหตุผล" className="flex-1 min-w-[100px] px-2 py-1.5 font-mono text-2xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
            <button onClick={doBan} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg shrink-0" style={{ background: C.red, color: '#fff' }}>แบน</button>
          </div>
          {bans.length === 0 ? (
            <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีใครถูกแบน</p>
          ) : (
            <div className="space-y-1.5">
              {bans.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2 p-2 rounded-lg" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="min-w-0">
                    <div className="font-mono text-2xs truncate" style={{ color: C.text }}>{b.id}</div>
                    <div className="font-mono text-2xs truncate" style={{ color: C.muted, fontSize: 10 }}>{b.reason} · {b.until ? `ถึง ${new Date(b.until).toLocaleString('th-TH')}` : 'ถาวร'}</div>
                  </div>
                  <button onClick={() => unban(b.id)} className="font-mono text-2xs px-2 py-1 rounded-lg shrink-0" style={{ border: `1px solid ${C.emerald}`, color: C.emerald }}>ปลดแบน</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'log' && (
        log.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีบันทึก</p> : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {log.map((e, i) => (
              <div key={i} className="font-mono text-2xs flex items-center gap-2 py-1" style={{ color: e.type.includes('ban') || e.type === 'suspicious' ? C.red : C.muted, borderBottom: `1px solid ${C.border}` }}>
                <span className="shrink-0" style={{ fontSize: 10 }}>{new Date(e.at).toLocaleString('th-TH')}</span>
                <span className="truncate">{e.type} {e.email || e.target || e.ip || ''}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'backup' && (
        <div>
          <p className="font-body text-xs mb-2 leading-relaxed" style={{ color: C.muted }}>
            ระบบสำรองข้อมูลอัตโนมัติวันละครั้ง เก็บย้อนหลัง 7 วัน (สำรองเฉพาะตอนมีข้อมูลจริง จะไม่ทับชุดดีด้วยชุดว่าง)
          </p>
          <button onClick={backupNow} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1 mb-2" style={{ background: BRAND, color: '#fff' }}>
            {busy ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} สำรองเดี๋ยวนี้
          </button>
          {backups.length === 0 ? (
            <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีชุดสำรอง</p>
          ) : (
            <div className="space-y-1">
              {backups.slice().reverse().map((d) => (
                <div key={d} className="font-mono text-2xs py-1.5 px-2 rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>{d}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SecurityProtocol({ user, onToggleOwnOtpExempt }) {
  const [security, setSecurity] = useState({ forceOtpAlways: false });
  const [loaded, setLoaded] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [savingOwnToggle, setSavingOwnToggle] = useState(false);
  const [openProto, setOpenProto] = useState(null);
  const [resetMsg, setResetMsg] = useState('');
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (user.clearance !== 3) return;
    apiPost('/api/auth', { action: 'getSecurity' })
      .then(({ data }) => { if (data.security) setSecurity(data.security); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [user.clearance]);

  async function toggleForceOtp() {
    setSavingToggle(true);
    const next = { forceOtpAlways: !security.forceOtpAlways };
    try {
      const { ok, data } = await apiPost('/api/auth', { action: 'updateSecurity', ...next });
      if (ok) setSecurity(data.security);
    } catch (e) {}
    setSavingToggle(false);
  }

  async function resetSessions() {
    setResetting(true);
    setResetMsg('');
    try {
      const { ok } = await apiPost('/api/auth', { action: 'resetLoginCounts' });
      if (ok) setResetMsg('ตั้งค่าแล้ว — ทุกบัญชีต้องยืนยันอีเมลใหม่ตั้งแต่การล็อกอินครั้งถัดไป');
    } catch (e) {}
    setResetting(false);
    setTimeout(() => setResetMsg(''), 4000);
  }

  async function handleToggleOwn() {
    setSavingOwnToggle(true);
    try {
      await onToggleOwnOtpExempt();
    } finally {
      setSavingOwnToggle(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><ScrollText size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>SECURITY PROTOCOL</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>มาตรการความปลอดภัยสำหรับระบบจริง</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>ระบบล็อกอิน ฐานข้อมูล และรหัสผ่าน เชื่อมต่อทำงานจริงแล้วทั้งหมด</p>

      <AdminSecurityPanel user={user} />

      {user.isOwner && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.violet }}>เฉพาะบัญชีของคุณ (เจ้าของระบบ)</div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-body text-sm" style={{ color: C.text }}>ตัวฉันเองไม่ต้องยืนยันอีเมล</div>
              <p className="font-body text-xs leading-relaxed" style={{ color: C.muted }}>เปิดไว้ = บัญชีของคุณจะไม่โดนขอ OTP เลย ไม่ว่าจะล็อกอินกี่ครั้ง หรือเปิด "บังคับยืนยันทุกครั้ง" ด้านล่างไว้ก็ตาม ผู้ใช้คนอื่นไม่มีสิทธิ์ปิดให้ตัวเอง ต้องทำตามกฎที่คุณตั้งไว้เสมอ</p>
            </div>
            <button onClick={handleToggleOwn} disabled={savingOwnToggle} className="shrink-0 w-11 h-6 rounded-full relative" style={{ background: user.otpExempt ? C.violet : C.border }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full" style={{ left: user.otpExempt ? 22 : 2, background: '#fff', transition: 'left 0.2s ease' }} />
            </button>
          </div>
        </div>
      )}

      {user.clearance === 3 && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ควบคุมโดยเจ้าของระบบ</div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="font-body text-sm" style={{ color: C.text }}>บังคับยืนยันอีเมลทุกครั้ง</div>
              <p className="font-body text-xs" style={{ color: C.muted }}>ปกติ 6 ครั้งแรกของแต่ละวันไม่ต้องยืนยัน (นับใหม่ทุกเที่ยงคืน) เปิดตัวนี้เพื่อบังคับยืนยันทุกครั้งแทน</p>
            </div>
            <button onClick={toggleForceOtp} disabled={savingToggle || !loaded} className="shrink-0 w-11 h-6 rounded-full relative" style={{ background: security.forceOtpAlways ? C.emerald : C.border }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full" style={{ left: security.forceOtpAlways ? 22 : 2, background: '#fff', transition: 'left 0.2s ease' }} />
            </button>
          </div>
          <button onClick={resetSessions} disabled={resetting} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ border: `1px solid ${C.red}`, color: C.red, opacity: resetting ? 0.6 : 1 }}>
            {resetting ? <Loader2 size={11} className="animate-spin" /> : <ShieldAlert size={11} />} บังคับยืนยันอีเมลรอบถัดไปทุกบัญชี
          </button>
          {resetMsg && <p className="font-mono text-2xs mt-2" style={{ color: C.emerald }}>{resetMsg}</p>}
        </div>
      )}

      <div className="space-y-3">
        {SECURITY_PROTOCOL.map((item, i) => {
          const st = PROTOCOL_STATUS[i] || { done: false, detail: '', how: '' };
          const open = openProto === i;
          return (
            <button key={item.title} onClick={() => setOpenProto(open ? null : i)} className="w-full text-left relative p-4 pl-16 rounded-2xl" style={{ background: C.panel, border: `1px solid ${open ? (st.done ? C.emerald : C.orange) : C.border}` }}>
              <span className="absolute left-4 top-4 font-mono text-xs w-8 h-8 rounded-full flex items-center justify-center" style={{ color: '#fff', background: st.done ? C.emerald : C.orange }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center justify-between gap-2">
                <div className="font-body text-sm" style={{ color: C.text }}>{item.title}</div>
                <span className="font-mono text-2xs px-2 py-0.5 rounded shrink-0" style={{ color: st.done ? C.emerald : C.orange, border: `1px solid ${st.done ? C.emerald : C.orange}` }}>
                  {st.done ? 'ทำแล้ว' : 'ยังไม่ทำ'}
                </span>
              </div>
              <p className="font-body text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{item.body}</p>
              {open && (
                <div className="mt-2.5 pt-2.5 space-y-2" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div className="font-mono text-2xs mb-1" style={{ color: st.done ? C.emerald : C.orange }}>สถานะจริงในระบบนี้</div>
                    <p className="font-body text-xs" style={{ color: C.text }}>{st.detail}</p>
                  </div>
                  {st.how && (
                    <div>
                      <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>{st.done ? 'ทำยังไง' : 'ต้องทำอะไรต่อ'}</div>
                      <p className="font-body text-xs" style={{ color: C.muted }}>{st.how}</p>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
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
    if (newPassword.length < 8) { setPwError('รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร'); return; }
    if (newPassword !== confirmPassword) { setPwError('รหัสผ่านใหม่ไม่ตรงกัน'); return; }
    setPwLoading(true);
    try {
      const { ok, data } = await apiPost('/api/auth', { action: 'changePassword', currentPassword, newPassword });
      setPwLoading(false);
      if (!ok) { setPwError(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ'); return; }
      if (data.token) saveSession(data.token); // รับโทเค็นใหม่ เพื่อไม่ให้ตัวเองหลุดออกจากระบบ
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setPwMsg('เปลี่ยนรหัสผ่านแล้ว — อุปกรณ์อื่นที่ล็อกอินค้างไว้จะถูกเตะออก');
      setTimeout(() => setPwMsg(''), 3000);
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

const CAL_SYS = `คุณคือผู้ช่วยวางแผนงานผลิตคอนเทนต์ วิเคราะห์จากประวัติการทำงานจริงที่ให้มา
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ \`\`\`json
{
 "headline":"สรุปพฤติกรรมการทำงานเดือนนี้ 1 ประโยค ตรงไปตรงมา",
 "consistency":{"score":0-100,"comment":"ความสม่ำเสมอเป็นยังไง"},
 "bestDays":["วันในสัปดาห์ที่ทำงานได้ดีที่สุด พร้อมเหตุผลจากข้อมูล"],
 "worstDays":["วันที่มักหลุด พร้อมเหตุผล"],
 "patterns":["รูปแบบที่สังเกตได้จากข้อมูลจริง เช่น มักหลุดช่วงปลายสัปดาห์"],
 "risks":[{"risk":"ความเสี่ยงที่จะเกิดซ้ำ","fix":"วิธีแก้ที่ทำได้ทันที"}],
 "planNextWeek":[{"day":"วัน","focus":"ควรโฟกัสอะไร","load":"เบา|ปกติ|หนัก","why":"เหตุผล"}],
 "advice":"คำแนะนำหลัก 1 ข้อที่จะช่วยได้มากที่สุด"
}
กติกา: อ้างตัวเลขจริงเสมอ · ถ้าข้อมูลน้อยเกินไปให้บอกตรงๆ ใน headline`;

const WEEKDAY_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

function CalendarPage({ history, tasks, channels, onOpenDay, futureTasks }) {
  const todayStr = todayDateStr();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [insight, setInsight] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [err, setErr] = useState('');

  // รวมข้อมูลทุกวัน: ประวัติ + วันนี้ + วันที่เตรียมล่วงหน้า
  const dayMap = {};
  history.forEach((h) => { dayMap[h.date] = { total: h.totalTasks || 0, done: h.doneTasks || 0, tasks: Array.isArray(h.tasks) ? h.tasks : [], missed: h.missed || [], kind: 'past' }; });
  dayMap[todayStr] = { total: tasks.length, done: tasks.filter((t) => t.done).length, tasks, missed: tasks.filter((t) => !t.done).map((t) => ({ channelName: (channels.find((c) => c.id === t.channelId) || {}).name || '-', label: t.label })), kind: 'today' };
  Object.entries(futureTasks || {}).forEach(([d, ts]) => {
    if (d > todayStr && Array.isArray(ts) && ts.length) dayMap[d] = { total: ts.length, done: ts.filter((t) => t.done).length, tasks: ts, missed: [], kind: 'future' };
  });

  const firstDay = new Date(ym.y, ym.m, 1).getDay();
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const dstr = (d) => `${ym.y}-${String(ym.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // ---- สถิติเดือนนี้ ----
  const monthDays = Object.entries(dayMap).filter(([d]) => d.startsWith(`${ym.y}-${String(ym.m + 1).padStart(2, '0')}`));
  const mTotal = monthDays.reduce((s, [, v]) => s + v.total, 0);
  const mDone = monthDays.reduce((s, [, v]) => s + v.done, 0);
  const mPct = mTotal ? Math.round((mDone / mTotal) * 100) : 0;
  const perfect = monthDays.filter(([, v]) => v.total > 0 && v.done >= v.total).length;
  const missedDays = monthDays.filter(([d, v]) => v.total > 0 && v.done < v.total && d < todayStr).length;

  // ความสม่ำเสมอต่อเนื่อง
  let streak = 0;
  const sortedPast = Object.entries(dayMap).filter(([d, v]) => d <= todayStr && v.total > 0).sort((a, b) => b[0].localeCompare(a[0]));
  for (const [, v] of sortedPast) { if (v.done >= v.total) streak++; else break; }

  // แยกตามวันในสัปดาห์
  const byWeekday = WEEKDAY_FULL.map((label, i) => {
    const rows = Object.entries(dayMap).filter(([d, v]) => v.total > 0 && d <= todayStr && new Date(d + 'T00:00:00').getDay() === i);
    const t = rows.reduce((s, [, v]) => s + v.total, 0);
    const dn = rows.reduce((s, [, v]) => s + v.done, 0);
    return { day: label.slice(0, 2), pct: t ? Math.round((dn / t) * 100) : 0, n: rows.length };
  });

  function heatColor(v) {
    if (!v || v.total === 0) return null;
    if (v.kind === 'future') return C.violet;
    const p = v.done / v.total;
    if (p >= 1) return C.emerald;
    if (p >= 0.5) return C.orange;
    return C.red;
  }

  async function runInsight() {
    setLoadingAi(true); setErr('');
    const payload = Object.entries(dayMap).filter(([d]) => d <= todayStr).sort().slice(-45)
      .map(([d, v]) => ({ date: d, weekday: WEEKDAY_FULL[new Date(d + 'T00:00:00').getDay()], total: v.total, done: v.done, pct: v.total ? Math.round((v.done / v.total) * 100) : 0 }));
    if (payload.length < 3) { setErr('ข้อมูลยังน้อยเกินไป — ใช้งานสัก 3-5 วันก่อนแล้วค่อยให้ AI วิเคราะห์'); setLoadingAi(false); return; }
    try {
      const text = await callClaude(CAL_SYS, `ประวัติการทำงานรายวัน (${payload.length} วัน):\n${JSON.stringify(payload)}\n\nช่องที่ดูแล: ${channels.map((c) => c.name).join(', ') || '-'}`, undefined, 'deepAnalysis');
      setInsight(parseJsonLoose(text));
    } catch (e) { setErr(e.message || 'วิเคราะห์ไม่สำเร็จ'); }
    setLoadingAi(false);
  }

  const sel = dayMap[selectedDate];
  const monthLabel = `${THAI_MONTHS[ym.m]} ${ym.y + 543}`;
  function shiftMonth(n) {
    setYm((p) => {
      const d = new Date(p.y, p.m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Calendar size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>CALENDAR</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>ปฏิทินงาน</h2>
      <p className="font-body text-xs mb-5" style={{ color: C.muted }}>ดูภาพรวมทั้งเดือน · ดับเบิลคลิกวันที่เพื่อเข้าไปทำ/แก้งานวันนั้น</p>

      {/* การ์ดสรุปเดือน */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <StatCard label="ทำเสร็จเดือนนี้" value={`${mPct}%`} sub={`${mDone}/${mTotal} งาน`} color={mPct >= 80 ? C.emerald : mPct >= 50 ? C.orange : C.red} Icon={Gauge} />
        <StatCard label="วันที่ทำครบ" value={perfect} sub="วัน" color={C.emerald} Icon={Award} />
        <StatCard label="วันที่หลุดเป้า" value={missedDays} sub="วัน" color={missedDays === 0 ? C.emerald : C.red} Icon={AlertTriangle} />
        <StatCard label="ทำครบติดกัน" value={streak} sub="วัน" color={C.violet} Icon={Flame} />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
        <div>
          {/* ปฏิทิน */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <button onClick={() => shiftMonth(-1)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>←</button>
              <div className="text-center">
                <div className="font-body text-sm" style={{ color: C.text }}>{monthLabel}</div>
                <button onClick={() => { const n = new Date(); setYm({ y: n.getFullYear(), m: n.getMonth() }); setSelectedDate(todayStr); }} className="font-mono text-2xs" style={{ color: C.blue }}>กลับมาเดือนนี้</button>
              </div>
              <button onClick={() => shiftMonth(1)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>→</button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {WEEKDAY_LABELS.map((d) => <div key={d} className="font-mono text-2xs text-center" style={{ color: C.muted }}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const ds = dstr(d);
                const v = dayMap[ds];
                const col = heatColor(v);
                const isToday = ds === todayStr;
                const isSel = ds === selectedDate;
                const pct = v && v.total ? v.done / v.total : 0;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(ds)}
                    onDoubleClick={() => onOpenDay && onOpenDay(ds)}
                    title={v ? `${v.done}/${v.total} งาน — ดับเบิลคลิกเพื่อเปิด` : 'ดับเบิลคลิกเพื่อเปิด'}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center relative"
                    style={{
                      background: col ? `${col}${Math.round(18 + pct * 30).toString(16).padStart(2, '0')}` : 'transparent',
                      border: `1.5px solid ${isSel ? C.blue : isToday ? C.cyan : col || C.border}`,
                      color: v ? C.text : C.muted,
                    }}
                  >
                    <span className="font-mono text-2xs">{d}</span>
                    {v && v.total > 0 && (
                      <span className="font-mono" style={{ fontSize: 8, color: col }}>{v.done}/{v.total}</span>
                    )}
                    {v?.kind === 'future' && <span className="absolute" style={{ top: 2, right: 3, width: 4, height: 4, borderRadius: 999, background: C.violet }} />}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              {[
                { c: C.emerald, l: 'ทำครบ' }, { c: C.orange, l: 'ทำบางส่วน' },
                { c: C.red, l: 'ยังไม่ได้ทำ' }, { c: C.violet, l: 'เตรียมล่วงหน้า' }, { c: C.cyan, l: 'วันนี้' },
              ].map((x) => (
                <span key={x.l} className="font-mono flex items-center gap-1" style={{ fontSize: 10, color: C.muted }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} /> {x.l}
                </span>
              ))}
            </div>
          </div>

          {/* วันไหนทำได้ดี */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ทำได้ดีแค่ไหนในแต่ละวันของสัปดาห์</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={byWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} />
                <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                <Bar dataKey="pct" name="ทำเสร็จ %" radius={[4, 4, 0, 0]}>
                  {byWeekday.map((w, i) => <Cell key={i} fill={w.pct >= 80 ? C.emerald : w.pct >= 50 ? C.orange : w.n ? C.red : C.border} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ผู้ช่วย AI */}
          <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}44` }}>
            <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
              <div className="flex items-center gap-2"><Sparkles size={14} style={{ color: C.violet }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>ผู้ช่วยวางแผนจากพฤติกรรมจริง</span></div>
              <button onClick={runInsight} disabled={loadingAi} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.violet, color: '#fff', opacity: loadingAi ? 0.6 : 1 }}>
                {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} วิเคราะห์พฤติกรรม
              </button>
            </div>
            {err && <p className="font-mono text-2xs mb-2" style={{ color: C.orange }}>{err}</p>}
            {!insight && !loadingAi && !err && <p className="font-body text-xs" style={{ color: C.muted }}>AI จะดูว่าคุณมักทำงานเสร็จวันไหน หลุดวันไหน แล้ววางแผนสัปดาห์หน้าให้เหมาะกับจังหวะจริงของคุณ</p>}
            {insight && (
              <div className="space-y-2.5">
                <p className="font-body text-sm" style={{ color: C.text }}>{insight.headline}</p>
                {insight.consistency && (
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0 text-center px-2.5 py-1.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${insight.consistency.score >= 70 ? C.emerald : insight.consistency.score >= 40 ? C.orange : C.red}` }}>
                      <div className="font-display text-lg font-bold leading-none" style={{ color: insight.consistency.score >= 70 ? C.emerald : insight.consistency.score >= 40 ? C.orange : C.red }}>{insight.consistency.score}</div>
                      <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>สม่ำเสมอ</div>
                    </div>
                    <p className="font-body text-xs" style={{ color: C.muted }}>{insight.consistency.comment}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-2">
                  {Array.isArray(insight.bestDays) && insight.bestDays.length > 0 && (
                    <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                      <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>วันที่ทำได้ดี</div>
                      {insight.bestDays.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
                    </div>
                  )}
                  {Array.isArray(insight.worstDays) && insight.worstDays.length > 0 && (
                    <div className="p-2.5 rounded-xl" style={{ background: `${C.red}12`, border: `1px solid ${C.red}44` }}>
                      <div className="font-mono text-2xs mb-1" style={{ color: C.red }}>วันที่มักหลุด</div>
                      {insight.worstDays.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
                    </div>
                  )}
                </div>
                {Array.isArray(insight.patterns) && insight.patterns.length > 0 && (
                  <div>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>รูปแบบที่สังเกตได้</div>
                    {insight.patterns.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
                  </div>
                )}
                {Array.isArray(insight.risks) && insight.risks.length > 0 && (
                  <div className="space-y-1.5">
                    {insight.risks.map((r, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.orange}`, border: `1px solid ${C.border}` }}>
                        <div className="font-body text-xs" style={{ color: C.orange }}>{r.risk}</div>
                        <div className="font-body text-xs" style={{ color: C.muted }}>→ {r.fix}</div>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(insight.planNextWeek) && insight.planNextWeek.length > 0 && (
                  <div>
                    <div className="font-mono text-2xs mb-1.5" style={{ color: C.violet }}>แผนสัปดาห์หน้า</div>
                    <div className="space-y-1">
                      {insight.planNextWeek.map((p, i) => {
                        const lc = p.load === 'หนัก' ? C.red : p.load === 'เบา' ? C.emerald : C.orange;
                        return (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: C.bgDeep }}>
                            <span className="font-mono shrink-0" style={{ fontSize: 10, color: C.blue, width: 46 }}>{p.day}</span>
                            <div className="min-w-0 flex-1">
                              <div className="font-body text-xs" style={{ color: C.text }}>{p.focus}</div>
                              {p.why && <div className="font-body text-xs" style={{ color: C.muted }}>{p.why}</div>}
                            </div>
                            <span className="font-mono shrink-0 px-1.5 rounded" style={{ fontSize: 9, color: lc, border: `1px solid ${lc}` }}>{p.load}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {insight.advice && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>คำแนะนำหลัก</div>
                    <p className="font-body text-xs" style={{ color: C.text }}>{insight.advice}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* แถบขวา: รายละเอียดวันที่เลือก */}
        <div className="lg:sticky lg:top-6">
          <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div>
                <div className="font-mono text-2xs" style={{ color: C.blue }}>{selectedDate}{selectedDate === todayStr ? ' (วันนี้)' : ''}</div>
                <div className="font-body text-xs" style={{ color: C.muted }}>วัน{WEEKDAY_FULL[new Date(selectedDate + 'T00:00:00').getDay()]}</div>
              </div>
              <button onClick={() => onOpenDay && onOpenDay(selectedDate)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg shrink-0" style={{ background: BRAND, color: '#fff' }}>เปิดทำงานวันนี้</button>
            </div>

            {!sel || sel.total === 0 ? (
              <p className="font-body text-xs" style={{ color: C.muted }}>ไม่มีงานในวันนี้ — กดปุ่มด้านบนเพื่อเข้าไปเพิ่มงาน</p>
            ) : (
              <>
                <div style={{ width: '100%', height: 7, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${sel.total ? (sel.done / sel.total) * 100 : 0}%`, height: '100%', background: `linear-gradient(90deg, ${C.emerald}, ${C.cyan})` }} />
                </div>
                <div className="font-mono text-2xs mt-1.5 mb-2.5" style={{ color: C.muted }}>{sel.done}/{sel.total} งานเสร็จ ({Math.round((sel.done / sel.total) * 100)}%)</div>

                {sel.tasks.length > 0 ? (
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {sel.tasks.map((t) => {
                      const ch = channels.find((c) => c.id === t.channelId);
                      return (
                        <div key={t.id} className="flex items-center gap-1.5 py-1" style={{ borderBottom: `1px solid ${C.border}` }}>
                          {t.done ? <CheckCircle2 size={12} style={{ color: C.emerald }} className="shrink-0" /> : <Square size={12} style={{ color: C.muted }} className="shrink-0" />}
                          <span className="font-body text-xs truncate" style={{ color: t.done ? C.muted : C.text, textDecoration: t.done ? 'line-through' : 'none' }}>
                            {ch ? `${ch.name} · ` : ''}{t.label}
                          </span>
                          {typeof t.reviewScore === 'number' && (
                            <span className="font-mono shrink-0 ml-auto" style={{ fontSize: 9, color: t.reviewScore >= 8 ? C.emerald : t.reviewScore >= 5 ? C.orange : C.red }}>{t.reviewScore}/10</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  sel.missed.length > 0 && (
                    <div>
                      <div className="font-mono text-2xs mb-1" style={{ color: C.red }}>งานที่ยังไม่เสร็จ</div>
                      {sel.missed.map((m, i) => <div key={i} className="font-body text-xs" style={{ color: C.text }}>• {m.channelName} — {m.label}</div>)}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ANALYSIS_SYS = 'คุณคือฝ่ายวิเคราะห์ข้อมูลในองค์กรผลิตคอนเทนต์ จากข้อมูลสถิติการทำงานที่ให้มา (อัตราการทำงานเสร็จรายวัน แยกตามช่อง จำนวนงานที่ผ่าน/ไม่ผ่าน QC) ให้วิเคราะห์แนวโน้มสั้นๆ และให้คำแนะนำแนวทางการทำงานที่เป็นประโยชน์ 3-5 ข้อ ตอบเป็นภาษาไทย กระชับ ไม่เกิน 10 บรรทัด หมายเหตุ: ข้อมูลที่มีคือสถิติภายในระบบเท่านั้น ไม่มีข้อมูลยอดวิว/ยอดไลก์จริงจากแพลตฟอร์ม ห้ามอ้างว่ามีข้อมูลนั้น';
const IMAGE_ANALYSIS_SYS = 'คุณคือฝ่ายวิเคราะห์คอนเทนต์ ดูรูปภาพตัวอย่างผลงาน/โพสต์ที่แนบมา แล้ววิเคราะห์จุดเด่น จุดที่ควรปรับปรุง (องค์ประกอบภาพ สี ความชัดเจนของข้อความ ความน่าสนใจ) และให้คำแนะนำเชิงปฏิบัติ 3-5 ข้อ ตอบเป็นภาษาไทย กระชับ ไม่เกิน 12 บรรทัด';

// ---------- หน้า KPI / วิเคราะห์รายเดือน ----------
function monthKey(dateStr) { return String(dateStr || '').slice(0, 7); }
function thaiMonthLabel(mk) {
  const [y, m] = mk.split('-');
  return `${THAI_MONTHS[Number(m) - 1]} ${Number(y) + 543}`;
}

// รวมงานทุกวัน (ประวัติ + วันนี้) ให้เป็นรายการเดียว เพื่อคำนวณ KPI
function collectAllDays(history, tasks) {
  const days = history.map((h) => ({
    date: h.date,
    tasks: Array.isArray(h.tasks) ? h.tasks : [],
    total: h.totalTasks || 0,
    done: h.doneTasks || 0,
  }));
  const today = todayDateStr();
  if (!days.some((d) => d.date === today)) {
    days.push({ date: today, tasks, total: tasks.length, done: tasks.filter((t) => t.done).length });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function StatCard({ label, value, sub, color, Icon }) {
  return (
    <div className="p-3.5 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(150deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon size={12} style={{ color }} />}
        <span className="font-mono text-2xs tracking-wide" style={{ color: C.muted }}>{label}</span>
      </div>
      <div className="font-display text-2xl font-bold leading-none" style={{ color }}>{value}</div>
      {sub && <div className="font-mono text-2xs mt-1.5" style={{ color: C.muted }}>{sub}</div>}
    </div>
  );
}

function KpiPage({ history, tasks, channels }) {
  const allDays = collectAllDays(history, tasks);
  const months = Array.from(new Set(allDays.map((d) => monthKey(d.date)))).sort().reverse();
  const [selMonth, setSelMonth] = useState(months[0] || monthKey(todayDateStr()));
  const [query, setQuery] = useState('');

  const monthDays = allDays.filter((d) => monthKey(d.date) === selMonth);
  const totalTasks = monthDays.reduce((s, d) => s + d.total, 0);
  const doneTasks = monthDays.reduce((s, d) => s + d.done, 0);
  const completion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // คะแนนคุณภาพจากผลตรวจ Gemini
  const scored = monthDays.flatMap((d) => d.tasks.filter((t) => typeof t.reviewScore === 'number').map((t) => ({ ...t, date: d.date })));
  const avgScore = scored.length ? (scored.reduce((s, t) => s + t.reviewScore, 0) / scored.length) : null;
  const reviewedPct = totalTasks ? Math.round((scored.length / totalTasks) * 100) : 0;

  // วันที่ทำครบติดต่อกัน (streak)
  let streak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    const d = allDays[i];
    if (d.total > 0 && d.done >= d.total) streak++;
    else if (d.total > 0) break;
  }

  const perfectDays = monthDays.filter((d) => d.total > 0 && d.done >= d.total).length;
  const activeDays = monthDays.filter((d) => d.total > 0).length;

  // แนวโน้มรายวันในเดือนนี้
  const dailyTrend = monthDays.map((d) => ({
    date: d.date.slice(8),
    pct: d.total ? Math.round((d.done / d.total) * 100) : 0,
    score: (() => {
      const ss = d.tasks.filter((t) => typeof t.reviewScore === 'number');
      return ss.length ? Math.round((ss.reduce((a, t) => a + t.reviewScore, 0) / ss.length) * 10) : null;
    })(),
  }));

  // เทียบรายเดือน
  const monthCompare = months.slice(0, 6).reverse().map((mk) => {
    const ds = allDays.filter((d) => monthKey(d.date) === mk);
    const tt = ds.reduce((s, d) => s + d.total, 0);
    const dd = ds.reduce((s, d) => s + d.done, 0);
    const sc = ds.flatMap((d) => d.tasks.filter((t) => typeof t.reviewScore === 'number'));
    return {
      month: thaiMonthLabel(mk).split(' ')[0],
      completion: tt ? Math.round((dd / tt) * 100) : 0,
      quality: sc.length ? Math.round((sc.reduce((a, t) => a + t.reviewScore, 0) / sc.length) * 10) : 0,
    };
  });

  // แยกตามช่อง
  const byChannel = channels.map((c) => {
    const ts = monthDays.flatMap((d) => d.tasks.filter((t) => t.channelId === c.id));
    const sc = ts.filter((t) => typeof t.reviewScore === 'number');
    return {
      name: c.name,
      color: c.color,
      total: ts.length,
      done: ts.filter((t) => t.done).length,
      avg: sc.length ? (sc.reduce((a, t) => a + t.reviewScore, 0) / sc.length).toFixed(1) : '-',
    };
  }).filter((c) => c.total > 0);

  // ค้นหางานย้อนหลัง
  const q = query.trim().toLowerCase();
  const searchResults = !q ? [] : allDays.flatMap((d) =>
    d.tasks.filter((t) =>
      [t.titleTh, t.title, t.outline, t.captionTh, t.styleTemplate].filter(Boolean).join(' ').toLowerCase().includes(q)
    ).map((t) => ({ ...t, date: d.date, channelName: (channels.find((c) => c.id === t.channelId) || {}).name || '-' }))
  ).slice(0, 30);

  const scoreColor = avgScore == null ? C.muted : avgScore >= 8 ? C.emerald : avgScore >= 5 ? C.orange : C.red;
  const compColor = completion >= 80 ? C.emerald : completion >= 50 ? C.orange : C.red;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Target size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>KPI DASHBOARD</span></div>
      <div className="flex items-end justify-between gap-3 flex-wrap mb-6">
        <div>
          <h2 className="font-body text-xl" style={{ color: C.text }}>ตัวชี้วัดผลงาน</h2>
          <p className="font-body text-xs" style={{ color: C.muted }}>วัดผลจริงจากงานที่ทำและคะแนนตรวจคลิป</p>
        </div>
        <select value={selMonth} onChange={(e) => setSelMonth(e.target.value)} className="px-3 py-1.5 font-mono text-xs outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }}>
          {months.map((mk) => <option key={mk} value={mk}>{thaiMonthLabel(mk)}</option>)}
        </select>
      </div>

      {/* การ์ดตัวเลขหลัก */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <StatCard label="อัตราทำงานเสร็จ" value={`${completion}%`} sub={`${doneTasks}/${totalTasks} งาน`} color={compColor} Icon={Gauge} />
        <StatCard label="คะแนนคุณภาพเฉลี่ย" value={avgScore == null ? '—' : avgScore.toFixed(1)} sub={avgScore == null ? 'ยังไม่มีผลตรวจ' : `จาก ${scored.length} คลิป`} color={scoreColor} Icon={Award} />
        <StatCard label="วันที่ทำครบติดกัน" value={streak} sub="วัน" color={C.violet} Icon={Flame} />
        <StatCard label="ส่งตรวจแล้ว" value={`${reviewedPct}%`} sub={`${perfectDays}/${activeDays} วันทำครบ`} color={C.cyan} Icon={ClipboardCheck} />
      </div>

      {/* แนวโน้มรายวัน */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>แนวโน้มรายวัน — {thaiMonthLabel(selMonth)}</div>
        {dailyTrend.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูลเดือนนี้</p> : (
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="pct" name="ทำเสร็จ %" stroke={C.emerald} strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="score" name="คุณภาพ (x10)" stroke={C.violet} strokeWidth={2} dot={{ r: 2 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* เทียบรายเดือน */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เทียบย้อนหลัง 6 เดือน</div>
        {monthCompare.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูล</p> : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthCompare}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completion" name="ทำเสร็จ %" fill={C.emerald} radius={[4, 4, 0, 0]} />
              <Bar dataKey="quality" name="คุณภาพ (x10)" fill={C.violet} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* แยกตามช่อง */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ผลงานแยกตามช่อง</div>
        {byChannel.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูลเดือนนี้</p> : (
          <div className="space-y-2.5">
            {byChannel.map((c) => {
              const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="font-body text-xs truncate" style={{ color: C.text }}>{c.name}</span>
                    </div>
                    <span className="font-mono text-2xs shrink-0" style={{ color: C.muted }}>{c.done}/{c.total} · คะแนน {c.avg}</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${c.color}, ${c.color}88)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ค้นหางานย้อนหลัง */}
      <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.blue }}>ค้นหางานย้อนหลัง</div>
        <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
          <Search size={13} style={{ color: C.muted }} className="shrink-0" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="พิมพ์คำที่อยากหา เช่น ปลาหมึก, ยามเช้า..." className="flex-1 min-w-0 font-body text-xs outline-none" style={{ background: 'transparent', color: C.text }} />
          {query && <button onClick={() => setQuery('')} style={{ color: C.muted }}><X size={13} /></button>}
        </div>
        {q && (
          searchResults.length === 0 ? (
            <p className="font-body text-xs mt-2.5" style={{ color: C.muted }}>ไม่พบงานที่ตรงกับ "{query}"</p>
          ) : (
            <div className="mt-2.5 space-y-1.5 max-h-72 overflow-y-auto">
              <p className="font-mono text-2xs" style={{ color: C.muted }}>พบ {searchResults.length} รายการ</p>
              {searchResults.map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-mono text-2xs" style={{ color: C.blue }}>{r.date}</span>
                    <span className="font-mono text-2xs" style={{ color: C.muted }}>{r.channelName} · {r.label}</span>
                    {typeof r.reviewScore === 'number' && <span className="font-mono text-2xs px-1.5 rounded" style={{ color: r.reviewScore >= 8 ? C.emerald : r.reviewScore >= 5 ? C.orange : C.red }}>{r.reviewScore}/10</span>}
                  </div>
                  <p className="font-body text-xs line-clamp-2" style={{ color: C.text }}>{r.titleTh || r.title || r.outline || '(ไม่มีชื่อ)'}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ---------- ระบบอ่านตัวเลขจากภาพหน้าจอสถิติ ----------
// จุดสำคัญ: ให้ AI "อ่านตัวเลขออกมาเป็นข้อมูล" ไม่ใช่แค่บรรยายภาพ
// พอเป็นข้อมูลจริงแล้วถึงจะสะสมเป็นสถิติ เทียบแพลตฟอร์ม และดูแนวโน้มได้
const METRIC_EXTRACT_SYS = `คุณคือระบบอ่านข้อมูลจากภาพหน้าจอสถิติโซเชียลมีเดีย
ผมจะแนบภาพหน้าจอหน้าสถิติ (insights/analytics) มาให้ กรุณาอ่านตัวเลขทั้งหมดที่เห็นในภาพ แล้วตอบกลับเป็น JSON เท่านั้น
ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json

รูปแบบ:
{
  "platform": "facebook | tiktok | youtube | instagram | other",
  "platformConfidence": "high | medium | low",
  "contentTitle": "ชื่อคลิป/โพสต์ที่เห็นในภาพ ถ้าไม่มีใส่ null",
  "periodLabel": "ช่วงเวลาที่ภาพแสดง เช่น 7 วันล่าสุด ถ้าไม่มีใส่ null",
  "metrics": {
    "views": ตัวเลขหรือ null,
    "reach": ตัวเลขหรือ null,
    "likes": ตัวเลขหรือ null,
    "comments": ตัวเลขหรือ null,
    "shares": ตัวเลขหรือ null,
    "saves": ตัวเลขหรือ null,
    "followers": ตัวเลขหรือ null,
    "newFollowers": ตัวเลขหรือ null,
    "watchTimeSec": ตัวเลขวินาทีหรือ null,
    "avgWatchPercent": ตัวเลข 0-100 หรือ null,
    "ctr": ตัวเลข 0-100 หรือ null
  },
  "topInsight": "ข้อสังเกตสำคัญที่สุดจากภาพนี้ 1 ประโยค ภาษาไทย",
  "notes": "สิ่งที่อ่านไม่ชัดหรือไม่แน่ใจ ภาษาไทย ถ้าไม่มีใส่ null"
}

กติกา:
- แปลงตัวย่อเป็นตัวเลขเต็ม (1.2K = 1200, 3.4M = 3400000, 1.2พัน = 1200, 5หมื่น = 50000)
- ตัวเลขต้องเป็น number ห้ามใส่เครื่องหมายจุลภาคหรือหน่วย
- ถ้าไม่เห็นค่าไหนในภาพ ใส่ null อย่าเดา
- ดูโลโก้ สี และรูปแบบหน้าจอเพื่อระบุแพลตฟอร์ม`;

const DEEP_ANALYSIS_SYS = `คุณคือที่ปรึกษาการเติบโตของช่องโซเชียลมีเดียระดับมืออาชีพ
ผมจะให้ข้อมูลสถิติจริงที่อ่านมาจากหน้า insights ของแต่ละแพลตฟอร์ม
วิเคราะห์อย่างละเอียด ตรงไปตรงมา และให้คำแนะนำที่ลงมือทำได้ทันที ตอบเป็น JSON เท่านั้น
ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json

รูปแบบ:
{
  "headline": "บรรทัดเดียวสรุปสถานการณ์ตอนนี้",
  "healthScore": ตัวเลข 0-100 (สุขภาพช่องโดยรวม),
  "bestPlatform": "แพลตฟอร์มที่ทำได้ดีที่สุดและเพราะอะไร",
  "weakestPlatform": "แพลตฟอร์มที่ต้องแก้ด่วนและเพราะอะไร",
  "findings": [
    {"title":"หัวข้อสั้น","detail":"อธิบายพร้อมอ้างตัวเลขจริง","severity":"high|medium|low"}
  ],
  "actions": [
    {"do":"สิ่งที่ต้องทำ ระบุให้ชัดเจนลงมือได้เลย","why":"เหตุผลอ้างอิงตัวเลข","impact":"high|medium|low"}
  ],
  "contentAdvice": "แนะนำแนวคอนเทนต์ที่ควรทำต่อ อ้างอิงจากตัวเลขที่เห็น",
  "warning": "สิ่งที่ต้องระวัง หรือ null"
}

กติกา:
- อ้างตัวเลขจริงเสมอ ห้ามพูดลอยๆ
- findings 3-6 ข้อ, actions 3-5 ข้อ เรียงจากสำคัญที่สุด
- ถ้าข้อมูลน้อยเกินจะสรุปได้ ให้บอกตรงๆ ใน warning`;

const PLATFORM_TABS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'other', label: 'อื่นๆ' },
];

function fmtNum(n) {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(n);
}

const METRIC_FIELDS = [
  { key: 'views', label: 'ยอดวิว', color: '#4A9DFF' },
  { key: 'reach', label: 'การเข้าถึง', color: '#22D3EE' },
  { key: 'likes', label: 'ถูกใจ', color: '#F472B6' },
  { key: 'comments', label: 'คอมเมนต์', color: '#A78BFA' },
  { key: 'shares', label: 'แชร์', color: '#34D399' },
  { key: 'saves', label: 'บันทึก', color: '#FBBF24' },
  { key: 'newFollowers', label: 'ผู้ติดตามใหม่', color: '#FB923C' },
  { key: 'avgWatchPercent', label: 'ดูเฉลี่ย %', color: '#F87171' },
];

// อัตราการมีส่วนร่วม = (ไลก์+คอมเมนต์+แชร์+บันทึก) / วิว
function engagementRate(m) {
  if (!m || !m.views) return null;
  const inter = (m.likes || 0) + (m.comments || 0) + (m.shares || 0) + (m.saves || 0);
  return Math.round((inter / m.views) * 1000) / 10;
}

// ---------- ระบบวางแผน & กลยุทธ์ ----------
const HORIZONS = [
  { key: '1d', label: '1 วัน', days: 1 },
  { key: '2d', label: '2 วัน', days: 2 },
  { key: '3d', label: '3 วัน', days: 3 },
  { key: '4d', label: '4 วัน', days: 4 },
  { key: '5d', label: '5 วัน', days: 5 },
  { key: '6d', label: '6 วัน', days: 6 },
  { key: '1w', label: '1 สัปดาห์', days: 7 },
  { key: '1m', label: '1 เดือน', days: 30 },
  { key: '3m', label: '3 เดือน', days: 90 },
  { key: '6m', label: '6 เดือน', days: 180 },
  { key: '9m', label: '9 เดือน', days: 270 },
  { key: '1y', label: '1 ปี', days: 365 },
  { key: '2y', label: '2 ปี', days: 730 },
];

const PLAN_SYS = `คุณคือนักวางกลยุทธ์การเติบโตช่องโซเชียลและครีเอเตอร์คอมเมิร์ซระดับมืออาชีพ
เชี่ยวชาญจิตวิทยาผู้ชม เทคนิคการหยุดนิ้ว (scroll-stopping) และการเปลี่ยนคนดูเป็นคนซื้อ
วางแผนจากข้อมูลจริงที่ให้มา ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json

รูปแบบ:
{
  "planName": "ชื่อแผนสั้นๆ",
  "thesis": "แก่นของแผน 1-2 ประโยค ว่าจะชนะด้วยอะไร",
  "targets": {
    "views": ตัวเลขเป้าหมายรวมทั้งช่วง,
    "engagementRate": ตัวเลข % เป้าหมาย,
    "newFollowers": ตัวเลข,
    "postsTotal": ตัวเลขจำนวนคลิปทั้งช่วง,
    "postsPerDay": ตัวเลข,
    "salesOrders": ตัวเลขหรือ null,
    "aov": ตัวเลขมูลค่าเฉลี่ยต่อคำสั่งซื้อหรือ null,
    "ctr": ตัวเลข % คลิกไปตะกร้าหรือ null
  },
  "targetRationale": "อธิบายว่าตั้งเป้านี้จากฐานอะไร อ้างตัวเลขจริง",
  "phases": [
    {"name":"ชื่อเฟส","range":"ช่วงวันที่","focus":"โฟกัสอะไร","successMetric":"วัดยังไงว่าผ่าน"}
  ],
  "contentPillars": [
    {"name":"เสาหลักคอนเทนต์","ratio":"สัดส่วน % ของคลิปทั้งหมด","why":"เหตุผลเชิงจิตวิทยา","exampleHook":"ตัวอย่างฮุก 3 วินาทีแรก"}
  ],
  "hookFormulas": ["สูตรฮุกที่ต้องใช้ พร้อมอธิบายว่าทำไมถึงหยุดนิ้วได้"],
  "psychologyNotes": ["หลักจิตวิทยาที่ใช้ในแผนนี้ อธิบายให้เข้าใจง่าย"],
  "weeklyRhythm": "จังหวะการทำงานรายสัปดาห์ที่ทำได้จริง",
  "contentDirective": "ข้อความสั่งการสำหรับ AI สร้างคอนเทนต์ ใช้เป็นสไตล์ตั้งต้นของทุกคลิปในช่วงนี้ เขียนละเอียด ระบุโทน มุมกล้อง จังหวะ และสิ่งที่ต้องมีใน 3 วินาทีแรก",
  "leadingIndicators": ["ตัวเลขที่ต้องจับตาทุกวัน เพราะบอกล่วงหน้าว่าแผนจะสำเร็จหรือไม่"],
  "risks": [{"risk":"ความเสี่ยง","mitigation":"วิธีรับมือ"}],
  "checkpointEvery": "ควรตรวจแผนทุกกี่วัน"
}

กติกา:
- เป้าหมายต้องท้าทายแต่เป็นไปได้จริงจากฐานปัจจุบัน ถ้าไม่มีข้อมูลฐานให้ตั้งแบบอนุรักษ์นิยมและบอกไว้
- contentPillars 3-5 ข้อ, hookFormulas 3-5 ข้อ, phases 2-5 เฟส
- ยิ่งช่วงเวลายาว ยิ่งต้องแบ่งเฟสและมีจุดตรวจถี่ขึ้น
- ห้ามพูดลอยๆ ต้องอ้างตัวเลขหรือหลักการที่ตรวจสอบได้`;

const PLAN_REVIEW_SYS = `คุณคือที่ปรึกษาที่ตรวจว่าแผนที่วางไว้เป็นไปตามเป้าหรือไม่ ตรงไปตรงมา ไม่ปลอบใจ
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json
{
  "onTrack": true หรือ false,
  "progressPercent": ตัวเลข 0-100 ความคืบหน้าเทียบเป้า,
  "verdict": "สรุปตรงๆ ว่าตอนนี้สถานการณ์เป็นยังไง",
  "gaps": [{"metric":"ตัวชี้วัด","target":"เป้า","actual":"จริง","gap":"ห่างเท่าไหร่","cause":"สาเหตุที่น่าจะเป็น"}],
  "fixNow": [{"action":"สิ่งที่ต้องทำทันที","expectedEffect":"คาดว่าจะช่วยอะไร","priority":"high|medium|low"}],
  "planAdjustment": "ควรปรับแผนยังไง หรือ null ถ้ายังไม่ต้องปรับ",
  "contentDirectiveUpdate": "ข้อความสั่งการใหม่สำหรับ AI สร้างคอนเทนต์ ถ้าควรเปลี่ยนแนว หรือ null"
}`;

// ---------- ถอดสูตรคู่แข่ง แล้วสร้างของที่ดีกว่า ----------
const RIVAL_SYS = `คุณคือนักวิเคราะห์คอนเทนต์สายครีเอเตอร์คอมเมิร์ซระดับโลก เชี่ยวชาญการถอดสูตรว่าคลิปไหน "ขายได้" เพราะอะไร
ผมจะให้ภาพจากคลิปของช่องอื่น (คู่แข่ง) พร้อมข้อมูลสินค้าที่เขาปักตะกร้า
ถอดสูตรอย่างละเอียด แล้วออกแบบคลิปเวอร์ชันที่ดีกว่าให้ผม โดยใช้สินค้าตัวเดียวกัน
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json

{
  "rivalBreakdown": {
    "hookType": "ประเภทฮุกที่เขาใช้",
    "hookSeconds": "เกิดอะไรใน 0-3 วินาทีแรก อธิบายละเอียด",
    "structure": [{"time":"ช่วงวินาที","what":"เกิดอะไร","purpose":"ทำไมต้องมีตรงนี้"}],
    "psychologyUsed": ["หลักจิตวิทยาที่เขาใช้ อธิบายว่าทำงานยังไงกับสมองคนดู"],
    "productIntegration": "เขาสอดแทรกสินค้าเข้ามาตอนไหนและอย่างไร โดยไม่ทำให้คนเลื่อนหนี",
    "ctaMethod": "เขาผลักให้คนกดตะกร้ายังไง",
    "whyItWorks": "เหตุผลหลักที่คลิปนี้ได้ผล",
    "weaknesses": ["จุดอ่อนของคลิปเขา ที่เราแซงได้"]
  },
  "ourVersion": {
    "concept": "แนวคิดคลิปของเราที่จะดีกว่า",
    "whyBetter": "อธิบายว่าเหนือกว่าเขาตรงไหน อ้างจุดอ่อนที่เจอ",
    "hook": "ฮุก 3 วินาทีแรกของเรา เขียนให้เห็นภาพ",
    "script": [{"time":"ช่วงวินาที","visual":"เห็นอะไร","voiceover":"พูดว่าอะไร (ภาษาไทย)","onScreenText":"ข้อความบนจอ"}],
    "videoPrompt": "Prompt ภาษาอังกฤษสำหรับสร้างวิดีโอ แนวตั้ง 9:16 ละเอียด ระบุมุมกล้อง แสง อารมณ์",
    "coverPrompt": "Prompt ภาษาอังกฤษสำหรับรูปหน้าปก แนวตั้ง 9:16 สะดุดตาบนฟีด",
    "caption": "แคปชั่นภาษาไทยพร้อมโพสต์",
    "hashtags": "แฮชแท็กที่ควรใช้",
    "ctaLine": "ประโยคผลักให้กดตะกร้า"
  },
  "fitScore": ตัวเลข 1-10 (สินค้านี้เหมาะกับช่องเราแค่ไหน),
  "fitReason": "อธิบายคะแนน",
  "estimatedCommission": "ประเมินค่าคอมที่น่าจะได้ต่อออเดอร์ ถ้ามีข้อมูลพอ ไม่งั้นบอกว่าต้องการข้อมูลอะไรเพิ่ม",
  "riskNote": "สิ่งที่ต้องระวัง เช่น ลอกเกินไป ผิดกฎแพลตฟอร์ม หรือ null",
  "lessonForLibrary": "บทเรียน 1 ประโยคที่ควรจำไว้ใช้กับคลิปอื่นในอนาคต"
}

กติกา:
- ห้ามลอกคลิปเขาแบบตรงๆ ต้องต่อยอดให้ดีกว่าและเป็นสไตล์ของเราเอง
- script ต้องละเอียดพอที่เอาไปถ่ายทำได้จริงทันที
- ถ้าภาพที่ให้มาไม่พอจะวิเคราะห์ ให้บอกตรงๆ ใน riskNote`;

const PRODUCT_FIT_SYS = `คุณคือที่ปรึกษาครีเอเตอร์คอมเมิร์ซ วิเคราะห์ว่าสินค้าที่ให้มาเหมาะกับช่องที่ระบุหรือไม่
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json
{
  "fitScore": ตัวเลข 1-10,
  "verdict": "ควรทำ | ทำได้แต่ต้องปรับ | ไม่ควรทำ",
  "reason": "เหตุผลละเอียด อ้างกลุ่มคนดูของช่องนี้",
  "audienceMatch": "คนดูช่องนี้ตรงกับคนซื้อสินค้านี้แค่ไหน",
  "contentAngles": [{"angle":"มุมคอนเทนต์","hook":"ฮุก 3 วิแรก","why":"ทำไมมุมนี้ถึงเวิร์กกับช่องนี้"}],
  "objections": ["ข้อโต้แย้งที่คนดูจะคิดในใจ และวิธีตอบในคลิป"],
  "commissionEstimate": "ประเมินค่าคอมต่อออเดอร์และต่อเดือนถ้าทำจริง ระบุสมมติฐานที่ใช้คำนวณ",
  "breakEven": "ต้องขายกี่ชิ้นถึงคุ้มเวลาที่ลงไป",
  "pricePositioning": "ราคานี้เหมาะกับกำลังซื้อคนดูช่องนี้ไหม",
  "bestPlatform": "ควรลงแพลตฟอร์มไหนก่อน เพราะอะไร",
  "warning": "สิ่งที่ต้องระวัง หรือ null"
}`;

// ---------- ระบบยิงแอด: อ่านตัวเลขจากภาพ + คำนวณ ROAS ----------
const AD_EXTRACT_SYS = `คุณคือระบบอ่านข้อมูลจากภาพหน้าจอโฆษณา (Ads Manager) ของแพลตฟอร์มโซเชียล
อ่านตัวเลขทั้งหมดที่เห็นในภาพ ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json
{
  "platform": "tiktok | facebook | shopee | youtube | other",
  "campaignName": "ชื่อแคมเปญที่เห็น หรือ null",
  "periodLabel": "ช่วงเวลา หรือ null",
  "objective": "วัตถุประสงค์แคมเปญ เช่น ยอดขาย/การเข้าถึง/คลิก หรือ null",
  "metrics": {
    "spend": ตัวเลขเงินที่ใช้ไปหรือ null,
    "impressions": ตัวเลขหรือ null,
    "clicks": ตัวเลขหรือ null,
    "ctr": ตัวเลข % หรือ null,
    "cpc": ตัวเลขต้นทุนต่อคลิกหรือ null,
    "cpm": ตัวเลขต้นทุนต่อพันครั้งหรือ null,
    "orders": ตัวเลขคำสั่งซื้อหรือ null,
    "revenue": ตัวเลขยอดขายหรือ null,
    "roas": ตัวเลขผลตอบแทนต่อค่าโฆษณาหรือ null,
    "addToCart": ตัวเลขเพิ่มลงตะกร้าหรือ null,
    "conversionRate": ตัวเลข % หรือ null,
    "costPerOrder": ตัวเลขหรือ null
  },
  "currency": "THB หรือสกุลที่เห็น",
  "topNote": "ข้อสังเกตสำคัญจากภาพนี้ 1 ประโยค ภาษาไทย",
  "notes": "สิ่งที่อ่านไม่ชัด หรือ null"
}
กติกา: แปลงตัวย่อเป็นเลขเต็ม (1.2K=1200) · ไม่เห็นค่าไหนใส่ null อย่าเดา · ตัวเลขห้ามมีเครื่องหมายจุลภาคหรือหน่วย`;

const AD_ANALYSIS_SYS = `คุณคือผู้เชี่ยวชาญการยิงแอดสายครีเอเตอร์คอมเมิร์ซ วิเคราะห์ผลแคมเปญจากตัวเลขจริง ตรงไปตรงมา
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ \`\`\`json
{
  "verdict": "กำไร | เท่าทุน | ขาดทุน",
  "healthScore": ตัวเลข 0-100,
  "headline": "สรุปสถานการณ์ 1 ประโยค",
  "keyNumbers": [{"label":"ชื่อตัวเลข","value":"ค่า","status":"good|warn|bad","meaning":"แปลว่าอะไร"}],
  "bottleneck": "จุดที่เป็นคอขวดจริงๆ ของกรวยการขาย (คนไม่คลิก / คลิกแล้วไม่ซื้อ / ต้นทุนสูงเกิน)",
  "diagnosis": [{"issue":"ปัญหา","evidence":"อ้างตัวเลข","fix":"วิธีแก้ที่ทำได้ทันที","priority":"high|medium|low"}],
  "budgetAdvice": "ควรเพิ่ม ลด หรือหยุดงบ พร้อมเหตุผลและตัวเลขที่ควรตั้ง",
  "creativeAdvice": "คลิป/ภาพโฆษณาควรแก้อะไร โดยเฉพาะ 3 วินาทีแรก",
  "scaleReadiness": "พร้อมขยายงบหรือยัง ถ้าพร้อมควรขยายทีละกี่ % ",
  "breakEvenRoas": "ROAS ที่ต้องทำได้ถึงจะไม่ขาดทุน พร้อมวิธีคำนวณ",
  "warning": "สิ่งที่ต้องระวัง หรือ null"
}
กติกา: อ้างตัวเลขจริงเสมอ · ถ้าข้อมูลไม่พอให้บอกตรงๆ ใน warning`;

const AD_FIELDS = [
  { key: 'spend', label: 'ใช้จ่าย', color: '#FB923C', money: true },
  { key: 'revenue', label: 'ยอดขาย', color: '#34D399', money: true },
  { key: 'orders', label: 'ออเดอร์', color: '#4A9DFF' },
  { key: 'roas', label: 'ROAS', color: '#A78BFA', suffix: 'x' },
  { key: 'clicks', label: 'คลิก', color: '#22D3EE' },
  { key: 'ctr', label: 'CTR', color: '#F472B6', suffix: '%' },
  { key: 'cpc', label: 'ต้นทุน/คลิก', color: '#FBBF24', money: true },
  { key: 'costPerOrder', label: 'ต้นทุน/ออเดอร์', color: '#F87171', money: true },
];

const AD_PLATFORMS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'tiktok', label: 'TikTok Ads' },
  { key: 'facebook', label: 'Facebook Ads' },
  { key: 'shopee', label: 'Shopee Ads' },
  { key: 'youtube', label: 'YouTube Ads' },
  { key: 'other', label: 'อื่นๆ' },
];

function AdsPanel({ ads, setAds, showToast }) {
  const [images, setImages] = useState([]);
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [tab, setTab] = useState('all');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [err, setErr] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const saved = Array.isArray(ads) ? ads : [];
  const filtered = tab === 'all' ? saved : saved.filter((a) => a.platform === tab);

  async function addFiles(files) {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith('image/'));
    const newOnes = await Promise.all(arr.map(async (f) => {
      const base64 = await fileToBase64(f);
      const mimeType = f.type || 'image/jpeg';
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: f.name, mimeType, base64, dataUrl: `data:${mimeType};base64,${base64}`, status: 'pending' };
    }));
    setImages((prev) => [...prev, ...newOnes]);
  }

  async function readAll() {
    const targets = images.filter((im) => im.status !== 'done');
    if (targets.length === 0) return;
    setReading(true); setErr(''); setProgress({ done: 0, total: targets.length });
    const collected = [];
    for (let i = 0; i < targets.length; i++) {
      const im = targets[i];
      setImages((p) => p.map((x) => (x.id === im.id ? { ...x, status: 'reading' } : x)));
      try {
        const text = await callClaude(AD_EXTRACT_SYS, 'อ่านตัวเลขทั้งหมดจากภาพหน้าจอโฆษณานี้', [{ mimeType: im.mimeType, data: im.base64 }], 'metricRead');
        const j = parseJsonLoose(text);
        const entry = {
          id: im.id, at: Date.now(), date: todayDateStr(), fileName: im.name,
          platform: j.platform || 'other', campaignName: j.campaignName || null,
          periodLabel: j.periodLabel || null, objective: j.objective || null,
          currency: j.currency || 'THB', metrics: j.metrics || {},
          topNote: j.topNote || '', notes: j.notes || null,
        };
        collected.push(entry);
        setImages((p) => p.map((x) => (x.id === im.id ? { ...x, status: 'done' } : x)));
      } catch (e) {
        setImages((p) => p.map((x) => (x.id === im.id ? { ...x, status: 'error' } : x)));
        setErr(`อ่านบางรูปไม่สำเร็จ: ${e.message || ''}`);
      }
      setProgress({ done: i + 1, total: targets.length });
    }
    if (collected.length) setAds([...(Array.isArray(ads) ? ads : []), ...collected].slice(-400));
    setReading(false);
  }

  async function analyze() {
    if (filtered.length === 0) return;
    setAnalyzing(true); setAnalysis(null);
    const payload = filtered.slice(-30).map((a) => ({ date: a.date, platform: a.platform, campaign: a.campaignName, objective: a.objective, currency: a.currency, ...a.metrics }));
    try {
      const text = await callClaude(AD_ANALYSIS_SYS, `ข้อมูลโฆษณาจริง (${payload.length} แคมเปญ):\n${JSON.stringify(payload, null, 1)}`, undefined, 'deepAnalysis');
      setAnalysis(parseJsonLoose(text));
    } catch (e) { setErr(`วิเคราะห์ไม่สำเร็จ: ${e.message || ''}`); }
    setAnalyzing(false);
  }

  // ---- ตัวเลขรวม ----
  const sum = (k) => filtered.map((a) => a.metrics?.[k]).filter((v) => typeof v === 'number').reduce((x, y) => x + y, 0);
  const spend = sum('spend'); const revenue = sum('revenue'); const orders = sum('orders'); const clicks = sum('clicks');
  const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : null;
  const cpo = orders > 0 ? Math.round(spend / orders) : null;
  const profit = revenue - spend;

  const byPlatform = AD_PLATFORMS.filter((p) => p.key !== 'all').map((p) => {
    const rows = saved.filter((a) => a.platform === p.key);
    const sp = rows.map((a) => a.metrics?.spend).filter((v) => typeof v === 'number').reduce((x, y) => x + y, 0);
    const rv = rows.map((a) => a.metrics?.revenue).filter((v) => typeof v === 'number').reduce((x, y) => x + y, 0);
    return { name: p.label.replace(' Ads', ''), ใช้จ่าย: sp, ยอดขาย: rv, ROAS: sp > 0 ? Math.round((rv / sp) * 100) / 100 : 0, n: rows.length };
  }).filter((r) => r.n > 0);

  const stColor = (s) => (s === 'good' ? C.emerald : s === 'warn' ? C.orange : C.red);
  const money = (n) => (n == null ? '—' : `${fmtNum(Math.round(n))}฿`);

  return (
    <div>
      <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: C.muted }}>
        แนบภาพหน้าจอ Ads Manager จากทุกแพลตฟอร์ม — ระบบอ่านตัวเลขออกมาเป็นข้อมูลจริง คำนวณ ROAS กำไรขาดทุน แล้ววิเคราะห์ว่าคอขวดอยู่ตรงไหน ควรเพิ่มหรือหยุดงบ
      </p>

      {err && <div className="mb-3 p-3 rounded-xl flex items-start gap-2" style={{ background: `${C.red}15`, border: `1px solid ${C.red}55` }}><AlertTriangle size={13} style={{ color: C.red }} className="shrink-0 mt-0.5" /><span className="font-body text-xs" style={{ color: C.text }}>{err}</span></div>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        className="p-5 rounded-2xl mb-4 text-center"
        style={{ background: dragOver ? `${C.orange}15` : C.panel, border: `1.5px dashed ${dragOver ? C.orange : C.border}` }}
      >
        <Megaphone size={22} style={{ color: dragOver ? C.orange : C.muted }} className="mx-auto mb-2" />
        <p className="font-body text-sm mb-1" style={{ color: C.text }}>ลากภาพหน้าจอโฆษณามาวางที่นี่</p>
        <p className="font-body text-xs mb-3" style={{ color: C.muted }}>TikTok Ads · Facebook Ads · Shopee Ads · YouTube Ads — ปนกันได้ ระบบแยกให้เอง</p>
        <label className="inline-flex font-mono text-2xs px-4 py-2 rounded-lg cursor-pointer items-center gap-1.5" style={{ background: C.orange, color: '#231' }}>
          <Upload size={12} /> เลือกรูป
          <input type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} className="hidden" />
        </label>
      </div>

      {images.length > 0 && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
            <span className="font-mono text-2xs" style={{ color: C.blue }}>รูปที่แนบ ({images.length})</span>
            <div className="flex gap-1.5">
              <button onClick={() => setImages([])} className="font-mono text-2xs px-2 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>ล้าง</button>
              <button onClick={readAll} disabled={reading} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: BRAND, color: '#fff', opacity: reading ? 0.6 : 1 }}>
                {reading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {reading ? `อ่าน ${progress.done}/${progress.total}` : 'อ่านตัวเลขทั้งหมด'}
              </button>
            </div>
          </div>
          {reading && <div className="mb-2" style={{ width: '100%', height: 4, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`, height: '100%', background: `linear-gradient(90deg, ${C.orange}, ${C.violet})` }} /></div>}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {images.map((im) => (
              <div key={im.id} className="relative rounded-lg overflow-hidden" style={{ border: `1px solid ${im.status === 'done' ? C.emerald : im.status === 'error' ? C.red : C.border}` }}>
                <img src={im.dataUrl} alt="" className="w-full object-cover" style={{ height: 62 }} />
                <button onClick={() => setImages((p) => p.filter((x) => x.id !== im.id))} className="absolute top-0.5 right-0.5 rounded-full p-0.5" style={{ background: 'rgba(0,0,0,.7)', color: '#fff' }}><X size={10} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {AD_PLATFORMS.map((p) => {
              const n = p.key === 'all' ? saved.length : saved.filter((a) => a.platform === p.key).length;
              if (p.key !== 'all' && n === 0) return null;
              return <button key={p.key} onClick={() => setTab(p.key)} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ background: tab === p.key ? BRAND : 'transparent', color: tab === p.key ? '#fff' : C.muted, border: `1px solid ${tab === p.key ? 'transparent' : C.border}` }}>{p.label} ({n})</button>;
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
            <StatCard label="ใช้จ่ายรวม" value={money(spend)} sub={`${filtered.length} แคมเปญ`} color={C.orange} Icon={Megaphone} />
            <StatCard label="ยอดขายรวม" value={money(revenue)} sub={`${orders} ออเดอร์`} color={C.emerald} Icon={ShoppingCart} />
            <StatCard label="ROAS" value={roas == null ? '—' : `${roas}x`} sub={roas == null ? '' : roas >= 3 ? 'ดีมาก' : roas >= 1.5 ? 'พอไปได้' : 'ขาดทุน'} color={roas == null ? C.muted : roas >= 3 ? C.emerald : roas >= 1.5 ? C.orange : C.red} Icon={Gauge} />
            <StatCard label="กำไรสุทธิ" value={money(profit)} sub={cpo ? `ต้นทุน/ออเดอร์ ${cpo}฿` : ''} color={profit >= 0 ? C.emerald : C.red} Icon={TrendingUp} />
          </div>

          {byPlatform.length > 1 && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เทียบผลแอดข้ามแพลตฟอร์ม</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={byPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={fmtNum} />
                  <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="ใช้จ่าย" fill={C.orange} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ยอดขาย" fill={C.emerald} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {byPlatform.map((p) => (
                  <span key={p.name} className="font-mono text-2xs px-2 py-1 rounded" style={{ color: p.ROAS >= 3 ? C.emerald : p.ROAS >= 1.5 ? C.orange : C.red, border: `1px solid ${p.ROAS >= 3 ? C.emerald : p.ROAS >= 1.5 ? C.orange : C.red}` }}>{p.name} ROAS {p.ROAS}x</span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.orange}44` }}>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2"><Sparkles size={14} style={{ color: C.orange }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>วิเคราะห์แคมเปญเชิงลึก</span></div>
              <button onClick={analyze} disabled={analyzing} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.orange, color: '#231', opacity: analyzing ? 0.6 : 1 }}>
                {analyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} วิเคราะห์
              </button>
            </div>
            {!analysis && !analyzing && <p className="font-body text-xs" style={{ color: C.muted }}>กดเพื่อให้ AI หาคอขวด บอกว่าควรเพิ่มหรือหยุดงบ และต้องแก้คลิปตรงไหน</p>}
            {analysis && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="shrink-0 text-center px-3 py-2 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${analysis.verdict === 'กำไร' ? C.emerald : analysis.verdict === 'ขาดทุน' ? C.red : C.orange}` }}>
                    <div className="font-display text-xl font-bold leading-none" style={{ color: analysis.verdict === 'กำไร' ? C.emerald : analysis.verdict === 'ขาดทุน' ? C.red : C.orange }}>{analysis.healthScore}</div>
                    <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>{analysis.verdict}</div>
                  </div>
                  <p className="font-body text-sm flex-1 min-w-[180px]" style={{ color: C.text }}>{analysis.headline}</p>
                </div>

                {Array.isArray(analysis.keyNumbers) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {analysis.keyNumbers.map((k, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${stColor(k.status)}`, border: `1px solid ${C.border}` }}>
                        <div className="font-mono text-2xs" style={{ color: C.muted, fontSize: 10 }}>{k.label}</div>
                        <div className="font-display text-base font-bold" style={{ color: stColor(k.status) }}>{k.value}</div>
                        <p className="font-body text-xs" style={{ color: C.muted }}>{k.meaning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.bottleneck && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.red}12`, border: `1px solid ${C.red}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.red }}>คอขวดที่แท้จริง</div>
                    <p className="font-body text-xs" style={{ color: C.text }}>{analysis.bottleneck}</p>
                  </div>
                )}

                {Array.isArray(analysis.diagnosis) && analysis.diagnosis.length > 0 && (
                  <div className="space-y-1.5">
                    {analysis.diagnosis.map((dg, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono px-1.5 rounded shrink-0" style={{ fontSize: 9, color: dg.priority === 'high' ? C.red : C.muted, border: `1px solid ${dg.priority === 'high' ? C.red : C.border}` }}>{dg.priority === 'high' ? 'ด่วน' : dg.priority === 'medium' ? 'กลาง' : 'เสริม'}</span>
                          <span className="font-body text-xs" style={{ color: C.text }}>{dg.issue}</span>
                        </div>
                        <p className="font-body text-xs" style={{ color: C.muted }}>หลักฐาน: {dg.evidence}</p>
                        <p className="font-body text-xs mt-0.5" style={{ color: C.emerald }}>แก้: {dg.fix}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-2">
                  {analysis.budgetAdvice && <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}><div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>คำแนะนำเรื่องงบ</div><p className="font-body text-xs" style={{ color: C.text }}>{analysis.budgetAdvice}</p></div>}
                  {analysis.creativeAdvice && <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}><div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>คลิป/ภาพต้องแก้</div><p className="font-body text-xs" style={{ color: C.text }}>{analysis.creativeAdvice}</p></div>}
                  {analysis.scaleReadiness && <div className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}><div className="font-mono text-2xs mb-1" style={{ color: C.cyan }}>พร้อมขยายงบไหม</div><p className="font-body text-xs" style={{ color: C.text }}>{analysis.scaleReadiness}</p></div>}
                  {analysis.breakEvenRoas && <div className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}><div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>ROAS จุดคุ้มทุน</div><p className="font-body text-xs" style={{ color: C.text }}>{analysis.breakEvenRoas}</p></div>}
                </div>

                {analysis.warning && <div className="p-2.5 rounded-xl flex items-start gap-2" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}><AlertTriangle size={13} style={{ color: C.orange }} className="shrink-0 mt-0.5" /><p className="font-body text-xs" style={{ color: C.text }}>{analysis.warning}</p></div>}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>แคมเปญทั้งหมด ({filtered.length})</div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {filtered.slice().reverse().map((a) => {
                const r = a.metrics?.roas ?? (a.metrics?.spend > 0 && a.metrics?.revenue != null ? Math.round((a.metrics.revenue / a.metrics.spend) * 100) / 100 : null);
                return (
                  <div key={a.id} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <div className="font-body text-xs truncate" style={{ color: C.text }}>{a.campaignName || a.fileName}</div>
                        <div className="font-mono" style={{ fontSize: 10, color: C.muted }}>{a.platform} · {a.date}{a.objective ? ` · ${a.objective}` : ''}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {r != null && <span className="font-mono text-2xs px-1.5 py-0.5 rounded" style={{ color: r >= 3 ? C.emerald : r >= 1.5 ? C.orange : C.red, border: `1px solid ${r >= 3 ? C.emerald : r >= 1.5 ? C.orange : C.red}` }}>{r}x</span>}
                        <button onClick={() => setAds(saved.filter((x) => x.id !== a.id))} style={{ color: C.muted }}><X size={12} /></button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {AD_FIELDS.map((f) => (typeof a.metrics?.[f.key] === 'number' ? (
                        <span key={f.key} className="font-mono" style={{ fontSize: 10, color: C.muted }}>{f.label} <span style={{ color: f.color }}>{f.money ? money(a.metrics[f.key]) : fmtNum(a.metrics[f.key])}{f.suffix || ''}</span></span>
                      ) : null))}
                    </div>
                    {a.topNote && <p className="font-body text-xs mt-1" style={{ color: C.muted }}>{a.topNote}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {saved.length === 0 && images.length === 0 && (
        <div className="p-8 rounded-2xl text-center" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <Megaphone size={26} style={{ color: C.muted }} className="mx-auto mb-2" />
          <p className="font-body text-sm mb-1" style={{ color: C.text }}>ยังไม่มีข้อมูลโฆษณา</p>
          <p className="font-body text-xs" style={{ color: C.muted }}>แนบภาพหน้าจอ Ads Manager ด้านบนเพื่อเริ่มติดตามผล</p>
        </div>
      )}
    </div>
  );
}

function CompetitorIntel({ rivals, setRivals, channels, showToast }) {
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [commission, setCommission] = useState('');
  const [rivalPlatform, setRivalPlatform] = useState('tiktok');
  const [rivalStats, setRivalStats] = useState('');
  const [targetChannel, setTargetChannel] = useState(channels[0]?.id || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [openId, setOpenId] = useState(null);

  const list = Array.isArray(rivals) ? rivals : [];
  const active = list.find((r) => r.id === openId) || list[list.length - 1] || null;

  async function addFiles(files) {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith('image/'));
    const newOnes = await Promise.all(arr.map(async (f) => {
      const base64 = await fileToBase64(f);
      const mimeType = f.type || 'image/jpeg';
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: f.name, mimeType, base64, dataUrl: `data:${mimeType};base64,${base64}` };
    }));
    setImages((prev) => [...prev, ...newOnes].slice(0, 8));
  }

  async function analyze() {
    if (images.length === 0) { setErr('แนบภาพจากคลิปคู่แข่งอย่างน้อย 1 ภาพ (แคปช่วงเปิด กลาง จบ จะแม่นที่สุด)'); return; }
    if (!productName.trim()) { setErr('ระบุชื่อสินค้าที่เขาปักตะกร้าก่อน'); return; }
    setBusy(true); setErr('');
    const ch = channels.find((c) => c.id === targetChannel);
    try {
      const text = await callClaude(RIVAL_SYS,
        `ภาพจากคลิปคู่แข่ง ${images.length} ภาพ (เรียงตามลำดับเวลาในคลิป)\n` +
        `แพลตฟอร์มที่เขาลง: ${rivalPlatform}\n` +
        `สินค้าที่เขาปักตะกร้า: ${productName.trim()}\n` +
        `ราคาสินค้า: ${productPrice.trim() || 'ไม่ระบุ'}\n` +
        `ค่าคอมมิชชั่น: ${commission.trim() || 'ไม่ระบุ'}\n` +
        `ยอดของคลิปเขา: ${rivalStats.trim() || 'ไม่ระบุ'}\n\n` +
        `ช่องของผมที่จะเอาไปทำ: ${ch ? ch.name : 'ไม่ระบุ'}\n` +
        `แนวคอนเทนต์ช่องผม: คอนเทนต์ AI เสมือนจริง`,
        images.map((im) => ({ mimeType: im.mimeType, data: im.base64 })), 'rival');
      const json = parseJsonLoose(text);
      const entry = {
        id: `${Date.now()}`, at: Date.now(), date: todayDateStr(),
        productName: productName.trim(), productPrice: productPrice.trim(), commission: commission.trim(),
        rivalPlatform, rivalStats: rivalStats.trim(),
        channelId: targetChannel, channelName: ch?.name || '',
        thumb: images[0]?.dataUrl || null,
        data: json,
      };
      setRivals([...(Array.isArray(rivals) ? rivals : []), entry].slice(-100));
      setOpenId(entry.id);
      setImages([]); setProductName(''); setProductPrice(''); setCommission(''); setRivalStats('');
    } catch (e) {
      setErr(`วิเคราะห์ไม่สำเร็จ: ${e.message || ''}`);
    }
    setBusy(false);
  }

  const d = active?.data;
  const fit = d?.fitScore;
  const fitColor = fit == null ? C.muted : fit >= 8 ? C.emerald : fit >= 5 ? C.orange : C.red;

  return (
    <div>
      <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-1" style={{ color: C.orange }}>ถอดสูตรคู่แข่ง → สร้างของที่ดีกว่า</div>
        <p className="font-body text-xs mb-3 leading-relaxed" style={{ color: C.muted }}>
          แคปภาพจากคลิปคู่แข่ง (ช่วงเปิด/กลาง/จบ) + ใส่สินค้าที่เขาปักตะกร้า → AI ถอดว่าเขาใช้เทคนิคอะไร จุดอ่อนอยู่ไหน แล้วเขียนคลิปเวอร์ชันที่ดีกว่าให้เลย พร้อม Prompt และบทพูด
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          className="p-4 rounded-xl mb-3 text-center"
          style={{ border: `1.5px dashed ${C.border}`, background: C.bgDeep }}
        >
          <Clapperboard size={20} style={{ color: C.muted }} className="mx-auto mb-1.5" />
          <p className="font-body text-xs mb-2" style={{ color: C.muted }}>ลากภาพจากคลิปคู่แข่งมาวาง (สูงสุด 8 ภาพ)</p>
          <label className="inline-flex font-mono text-2xs px-3 py-1.5 rounded-lg cursor-pointer items-center gap-1.5" style={{ background: BRAND, color: '#fff' }}>
            <Upload size={11} /> เลือกภาพ
            <input type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} className="hidden" />
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5 mt-3">
              {images.map((im, i) => (
                <div key={im.id} className="relative rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  <img src={im.dataUrl} alt="" className="w-full object-cover" style={{ height: 54 }} />
                  <span className="absolute bottom-0 left-0 px-1 font-mono" style={{ fontSize: 9, background: 'rgba(0,0,0,.7)', color: '#fff' }}>{i + 1}</span>
                  <button onClick={() => setImages((p) => p.filter((x) => x.id !== im.id))} className="absolute top-0.5 right-0.5 rounded-full p-0.5" style={{ background: 'rgba(0,0,0,.7)', color: '#fff' }}><X size={9} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-2 mb-2">
          <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="ชื่อสินค้าที่เขาปักตะกร้า *" className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
          <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="ราคาสินค้า เช่น 299 บาท" className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
          <input value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="ค่าคอม เช่น 15% หรือ 45 บาท" className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
          <input value={rivalStats} onChange={(e) => setRivalStats(e.target.value)} placeholder="ยอดคลิปเขา เช่น 2.1M วิว 30K ไลก์" className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
          <select value={rivalPlatform} onChange={(e) => setRivalPlatform(e.target.value)} className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>
            <option value="tiktok">TikTok</option><option value="facebook">Facebook</option><option value="shopee">Shopee</option>
            <option value="lemon8">Lemon8</option><option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="other">อื่นๆ</option>
          </select>
          <select value={targetChannel} onChange={(e) => setTargetChannel(e.target.value)} className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>
            <option value="">— เลือกช่องของเราที่จะเอาไปทำ —</option>
            {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {err && <p className="font-mono text-2xs mb-2" style={{ color: C.red }}>{err}</p>}
        <button onClick={analyze} disabled={busy} className="font-mono text-2xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.orange, color: '#231', opacity: busy ? 0.6 : 1 }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ถอดสูตร + สร้างเวอร์ชันที่ดีกว่า
        </button>
      </div>

      {list.length > 0 && (
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {list.slice().reverse().slice(0, 12).map((r) => (
            <button key={r.id} onClick={() => setOpenId(r.id)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg truncate" style={{ maxWidth: 190, background: active?.id === r.id ? C.orange : 'transparent', color: active?.id === r.id ? '#231' : C.muted, border: `1px solid ${active?.id === r.id ? 'transparent' : C.border}` }}>
              {r.productName}
            </button>
          ))}
        </div>
      )}

      {active && d && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${fitColor}55` }}>
            <div className="flex items-start gap-3 flex-wrap">
              {active.thumb && <img src={active.thumb} alt="" className="rounded-lg shrink-0" style={{ width: 54, height: 54, objectFit: 'cover', border: `1px solid ${C.border}` }} />}
              <div className="min-w-0 flex-1">
                <div className="font-body text-sm" style={{ color: C.text }}>{active.productName}</div>
                <div className="font-mono text-2xs" style={{ color: C.muted }}>{active.rivalPlatform} · {active.channelName} · {active.date}{active.commission ? ` · คอม ${active.commission}` : ''}</div>
              </div>
              <div className="text-center shrink-0 px-3 py-1.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${fitColor}` }}>
                <div className="font-display text-xl font-bold leading-none" style={{ color: fitColor }}>{fit}/10</div>
                <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>เหมาะกับช่อง</div>
              </div>
            </div>
            {d.fitReason && <p className="font-body text-xs mt-2" style={{ color: C.muted }}>{d.fitReason}</p>}
            {d.estimatedCommission && <p className="font-body text-xs mt-1.5 p-2 rounded-lg" style={{ color: C.emerald, background: `${C.emerald}10` }}>ประเมินรายได้: {d.estimatedCommission}</p>}
          </div>

          {d.rivalBreakdown && (
            <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.red }}>สูตรที่คู่แข่งใช้</div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl" style={{ background: C.bgDeep }}>
                  <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>ฮุก: {d.rivalBreakdown.hookType}</div>
                  <p className="font-body text-xs" style={{ color: C.text }}>{d.rivalBreakdown.hookSeconds}</p>
                </div>
                {Array.isArray(d.rivalBreakdown.structure) && (
                  <div className="space-y-1">
                    {d.rivalBreakdown.structure.map((st, i) => (
                      <div key={i} className="flex gap-2 p-2 rounded-lg" style={{ background: C.bgDeep }}>
                        <span className="font-mono shrink-0" style={{ fontSize: 10, color: C.blue, width: 52 }}>{st.time}</span>
                        <div className="min-w-0">
                          <p className="font-body text-xs" style={{ color: C.text }}>{st.what}</p>
                          <p className="font-body text-xs" style={{ color: C.muted }}>→ {st.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(d.rivalBreakdown.psychologyUsed) && d.rivalBreakdown.psychologyUsed.length > 0 && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}33` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>จิตวิทยาที่เขาใช้</div>
                    <ul className="space-y-1">{d.rivalBreakdown.psychologyUsed.map((x, i) => <li key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</li>)}</ul>
                  </div>
                )}
                {d.rivalBreakdown.productIntegration && <p className="font-body text-xs p-2.5 rounded-xl" style={{ color: C.text, background: C.bgDeep }}><span style={{ color: C.cyan }}>สอดแทรกสินค้า: </span>{d.rivalBreakdown.productIntegration}</p>}
                {d.rivalBreakdown.ctaMethod && <p className="font-body text-xs p-2.5 rounded-xl" style={{ color: C.text, background: C.bgDeep }}><span style={{ color: C.cyan }}>ผลักให้กดตะกร้า: </span>{d.rivalBreakdown.ctaMethod}</p>}
                {Array.isArray(d.rivalBreakdown.weaknesses) && d.rivalBreakdown.weaknesses.length > 0 && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>จุดอ่อนที่เราแซงได้</div>
                    <ul className="space-y-1">{d.rivalBreakdown.weaknesses.map((x, i) => <li key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {d.ourVersion && (
            <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.emerald}55` }}>
              <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.emerald }}>เวอร์ชันของเรา (ดีกว่า)</div>
              <p className="font-body text-sm mb-1.5" style={{ color: C.text }}>{d.ourVersion.concept}</p>
              {d.ourVersion.whyBetter && <p className="font-body text-xs mb-2.5 p-2 rounded-lg" style={{ color: C.emerald, background: `${C.emerald}10` }}>เหนือกว่าเพราะ: {d.ourVersion.whyBetter}</p>}
              {d.ourVersion.hook && (
                <div className="p-2.5 rounded-xl mb-2" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.orange}` }}>
                  <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>ฮุก 3 วินาทีแรก</div>
                  <p className="font-body text-xs" style={{ color: C.text }}>{d.ourVersion.hook}</p>
                </div>
              )}
              {Array.isArray(d.ourVersion.script) && d.ourVersion.script.length > 0 && (
                <div className="mb-2">
                  <div className="font-mono text-2xs mb-1.5" style={{ color: C.blue }}>สคริปต์ถ่ายทำ</div>
                  <div className="space-y-1.5">
                    {d.ourVersion.script.map((sc, i) => (
                      <div key={i} className="p-2.5 rounded-lg" style={{ background: C.bgDeep }}>
                        <div className="font-mono mb-1" style={{ fontSize: 10, color: C.blue }}>{sc.time}</div>
                        <p className="font-body text-xs" style={{ color: C.text }}>ภาพ: {sc.visual}</p>
                        {sc.voiceover && <p className="font-body text-xs" style={{ color: C.violet }}>พูด: "{sc.voiceover}"</p>}
                        {sc.onScreenText && <p className="font-body text-xs" style={{ color: C.muted }}>ข้อความบนจอ: {sc.onScreenText}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {d.ourVersion.videoPrompt && <PromptCopyRow label="Prompt วิดีโอ" text={d.ourVersion.videoPrompt} color={C.cyan} tools={['flow', 'meta']} showToast={showToast} />}
                {d.ourVersion.coverPrompt && <PromptCopyRow label="Prompt หน้าปก" text={d.ourVersion.coverPrompt} color={C.violet} tools={['meta', 'chatgpt']} showToast={showToast} />}
                {d.ourVersion.caption && <PromptCopyRow label="แคปชั่น" text={`${d.ourVersion.caption}\n\n${d.ourVersion.hashtags || ''}`} color={C.emerald} showToast={showToast} />}
                {d.ourVersion.ctaLine && <PromptCopyRow label="ประโยคผลักตะกร้า" text={d.ourVersion.ctaLine} color={C.orange} showToast={showToast} />}
              </div>
            </div>
          )}

          {d.riskNote && (
            <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}>
              <AlertTriangle size={13} style={{ color: C.orange }} className="shrink-0 mt-0.5" />
              <p className="font-body text-xs" style={{ color: C.text }}>{d.riskNote}</p>
            </div>
          )}
        </div>
      )}

      {/* คลังบทเรียนสะสม */}
      {list.length > 0 && (
        <div className="p-4 rounded-2xl mt-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.cyan }}>คลังบทเรียนที่สะสมไว้ ({list.length})</div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {list.slice().reverse().map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-2 p-2.5 rounded-lg" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <div className="min-w-0">
                  <div className="font-body text-xs truncate" style={{ color: C.text }}>{r.productName} <span className="font-mono" style={{ fontSize: 10, color: C.muted }}>· {r.rivalPlatform}</span></div>
                  {r.data?.lessonForLibrary && <p className="font-body text-xs" style={{ color: C.cyan }}>💡 {r.data.lessonForLibrary}</p>}
                </div>
                <button onClick={() => setRivals(list.filter((x) => x.id !== r.id))} style={{ color: C.muted }} className="shrink-0"><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// แถวแสดง Prompt พร้อมปุ่มคัดลอก/ส่งต่อ
function PromptCopyRow({ label, text, color, tools, showToast }) {
  return (
    <div className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-2xs" style={{ color }}>{label}</span>
        <button onClick={() => copyText(text).then(() => showToast && showToast('คัดลอกแล้ว'))} className="font-mono text-2xs px-2 py-0.5 rounded shrink-0" style={{ border: `1px solid ${color}`, color }}>คัดลอก</button>
      </div>
      <p className="font-body text-xs whitespace-pre-wrap" style={{ color: C.text }}>{text}</p>
      {tools && <SendToTools text={text} tools={tools} />}
    </div>
  );
}

function ProductFitPanel({ channels, showToast }) {
  const [img, setImg] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [commission, setCommission] = useState('');
  const [detail, setDetail] = useState('');
  const [channelId, setChannelId] = useState(channels[0]?.id || '');
  const [platform, setPlatform] = useState('tiktok');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pickFile(f) {
    if (!f) return;
    const base64 = await fileToBase64(f);
    setImg({ base64, mimeType: f.type || 'image/jpeg', dataUrl: `data:${f.type};base64,${base64}` });
  }

  async function run() {
    if (!name.trim()) { setErr('ระบุชื่อสินค้าก่อน'); return; }
    setBusy(true); setErr(''); setRes(null);
    const ch = channels.find((c) => c.id === channelId);
    try {
      const text = await callClaude(PRODUCT_FIT_SYS,
        `สินค้า: ${name.trim()}\nราคา: ${price.trim() || 'ไม่ระบุ'}\nค่าคอม: ${commission.trim() || 'ไม่ระบุ'}\nรายละเอียด: ${detail.trim() || 'ดูจากรูป'}\n\nช่องที่จะเอาไปขาย: ${ch ? ch.name : 'ไม่ระบุ'}\nแพลตฟอร์ม: ${platform}\nแนวช่อง: คอนเทนต์ AI เสมือนจริง`,
        img ? [{ mimeType: img.mimeType, data: img.base64 }] : undefined, 'productFit');
      setRes(parseJsonLoose(text));
    } catch (e) { setErr(`วิเคราะห์ไม่สำเร็จ: ${e.message || ''}`); }
    setBusy(false);
  }

  const fit = res?.fitScore;
  const col = fit == null ? C.muted : fit >= 8 ? C.emerald : fit >= 5 ? C.orange : C.red;

  return (
    <div>
      <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-1" style={{ color: C.emerald }}>วิเคราะห์สินค้าก่อนปักตะกร้า</div>
        <p className="font-body text-xs mb-3" style={{ color: C.muted }}>แนบรูปสินค้า + เลือกช่อง → AI บอกว่าเหมาะไหม ค่าคอมคุ้มไหม และควรทำคอนเทนต์มุมไหน</p>

        <div className="flex gap-2.5 mb-2.5 flex-wrap">
          <label className="rounded-xl cursor-pointer flex items-center justify-center shrink-0" style={{ width: 84, height: 84, background: C.bgDeep, border: `1.5px dashed ${C.border}`, overflow: 'hidden' }}>
            {img ? <img src={img.dataUrl} alt="" className="w-full h-full object-cover" /> : <div className="text-center"><ShoppingCart size={16} style={{ color: C.muted }} className="mx-auto" /><span className="font-mono block mt-1" style={{ fontSize: 9, color: C.muted }}>แนบรูป</span></div>}
            <input type="file" accept="image/*" onChange={(e) => { pickFile(e.target.files[0]); e.target.value = ''; }} className="hidden" />
          </label>
          <div className="flex-1 min-w-[180px] space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อสินค้า *" className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
            <div className="grid grid-cols-2 gap-2">
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="ราคา" className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
              <input value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="ค่าคอม %" className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
            </div>
          </div>
        </div>
        <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={2} placeholder="รายละเอียดสินค้า จุดขาย กลุ่มเป้าหมาย (ไม่ใส่ก็ได้ AI จะดูจากรูป)" className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y mb-2" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <select value={channelId} onChange={(e) => setChannelId(e.target.value)} className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>
            <option value="">— เลือกช่อง —</option>
            {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>
            <option value="tiktok">TikTok Shop</option><option value="facebook">Facebook</option><option value="shopee">Shopee</option><option value="lemon8">Lemon8</option><option value="youtube">YouTube</option>
          </select>
        </div>
        {err && <p className="font-mono text-2xs mb-2" style={{ color: C.red }}>{err}</p>}
        <button onClick={run} disabled={busy} className="font-mono text-2xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.emerald, color: '#062', opacity: busy ? 0.6 : 1 }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} วิเคราะห์ว่าควรทำไหม
        </button>
      </div>

      {res && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${col}55` }}>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="text-center shrink-0 px-3 py-2 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${col}` }}>
                <div className="font-display text-2xl font-bold leading-none" style={{ color: col }}>{fit}/10</div>
              </div>
              <div className="min-w-0">
                <div className="font-body text-base" style={{ color: col }}>{res.verdict}</div>
                <p className="font-body text-xs" style={{ color: C.muted }}>{res.audienceMatch}</p>
              </div>
            </div>
            <p className="font-body text-xs" style={{ color: C.text }}>{res.reason}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {res.commissionEstimate && (
              <div className="p-3 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>ประเมินรายได้</div>
                <p className="font-body text-xs" style={{ color: C.text }}>{res.commissionEstimate}</p>
                {res.breakEven && <p className="font-body text-xs mt-1" style={{ color: C.muted }}>จุดคุ้มทุน: {res.breakEven}</p>}
              </div>
            )}
            {res.pricePositioning && (
              <div className="p-3 rounded-xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs mb-1" style={{ color: C.cyan }}>ราคากับกำลังซื้อคนดู</div>
                <p className="font-body text-xs" style={{ color: C.text }}>{res.pricePositioning}</p>
                {res.bestPlatform && <p className="font-body text-xs mt-1" style={{ color: C.muted }}>ควรลง: {res.bestPlatform}</p>}
              </div>
            )}
          </div>

          {Array.isArray(res.contentAngles) && res.contentAngles.length > 0 && (
            <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.blue }}>มุมคอนเทนต์ที่ควรใช้</div>
              <div className="space-y-2">
                {res.contentAngles.map((a, i) => (
                  <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep }}>
                    <div className="font-body text-xs mb-1" style={{ color: C.text }}>{a.angle}</div>
                    <p className="font-body text-xs p-1.5 rounded mb-1" style={{ color: C.orange, background: `${C.orange}10` }}>ฮุก: {a.hook}</p>
                    <p className="font-body text-xs" style={{ color: C.muted }}>{a.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(res.objections) && res.objections.length > 0 && (
            <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-2" style={{ color: C.violet }}>ข้อโต้แย้งในใจคนดู &amp; วิธีตอบ</div>
              <ul className="space-y-1.5">{res.objections.map((o, i) => <li key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {o}</li>)}</ul>
            </div>
          )}

          {res.warning && (
            <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}>
              <AlertTriangle size={13} style={{ color: C.orange }} className="shrink-0 mt-0.5" />
              <p className="font-body text-xs" style={{ color: C.text }}>{res.warning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StrategyPage({ metrics, plans, setPlans, channels, tasks, setTasks, showToast }) {
  const [horizon, setHorizon] = useState('1m');
  const [goal, setGoal] = useState('');
  const [creating, setCreating] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [err, setErr] = useState('');
  const [openId, setOpenId] = useState(null);
  const [myPlan, setMyPlan] = useState('');   // แผนที่ CEO เขียนเอง
  const [ceoNote, setCeoNote] = useState(''); // คอมเมนต์สั่งแก้แผน
  const [revising, setRevising] = useState(false);

  const list = Array.isArray(plans) ? plans : [];
  const active = list.find((p) => p.id === openId) || list[list.length - 1] || null;
  const saved = Array.isArray(metrics) ? metrics : [];

  // CEO สั่งแก้แผน — AI ปรับให้ตามคอมเมนต์ โดยยังยึดข้อมูลจริงเป็นฐาน
  async function revisePlan() {
    if (!active || !ceoNote.trim()) return;
    setRevising(true); setErr('');
    try {
      const text = await callClaude(PLAN_SYS,
        `นี่คือแผนเดิมที่คุณวางไว้:\n${JSON.stringify(active.data)}\n\n` +
        `CEO สั่งแก้ดังนี้: ${ceoNote.trim()}\n\n` +
        (myPlan.trim() ? `แผนที่ CEO ร่างไว้เอง (ให้นำมาผสาน): ${myPlan.trim()}\n\n` : '') +
        `ช่วงเวลา: ${active.horizonLabel}\nเป้าหมายเดิม: ${active.goal}\n\nข้อมูลฐาน:\n${baselineSummary()}\n\n` +
        `กรุณาปรับแผนใหม่ตามที่ CEO สั่ง แต่ยังต้องอิงข้อมูลจริง ถ้าสิ่งที่ CEO สั่งเสี่ยงหรือไม่สมเหตุสมผล ให้เตือนไว้ใน risks`, undefined, 'plan');
      const json = parseJsonLoose(text);
      setPlans((Array.isArray(plans) ? plans : []).map((p) => (p.id === active.id
        ? { ...p, data: json, revisions: [...(p.revisions || []), { at: Date.now(), note: ceoNote.trim(), prev: active.data }].slice(-10) }
        : p)));
      setCeoNote('');
      showToast('ปรับแผนตามที่สั่งแล้ว');
    } catch (e) { setErr(`ปรับแผนไม่สำเร็จ: ${e.message || ''}`); }
    setRevising(false);
  }

  // สรุปฐานปัจจุบันจากสถิติจริงที่อ่านมา
  function baselineSummary() {
    if (saved.length === 0) return 'ยังไม่มีข้อมูลสถิติจริงในระบบ';
    const views = saved.map((m) => m.metrics?.views).filter((v) => typeof v === 'number');
    const ers = saved.map((m) => engagementRate(m.metrics)).filter((v) => v != null);
    const byPlat = {};
    saved.forEach((m) => { byPlat[m.platform] = (byPlat[m.platform] || 0) + 1; });
    return [
      `จำนวนโพสต์ที่มีข้อมูล: ${saved.length}`,
      views.length ? `วิวรวม: ${views.reduce((a, b) => a + b, 0)} · เฉลี่ยต่อคลิป: ${Math.round(views.reduce((a, b) => a + b, 0) / views.length)}` : 'ยังไม่มีข้อมูลวิว',
      ers.length ? `อัตรามีส่วนร่วมเฉลี่ย: ${(ers.reduce((a, b) => a + b, 0) / ers.length).toFixed(1)}%` : 'ยังไม่มีข้อมูลการมีส่วนร่วม',
      `แพลตฟอร์มที่มีข้อมูล: ${Object.entries(byPlat).map(([k, v]) => `${k} (${v})`).join(', ')}`,
      `ช่องที่ทำอยู่: ${channels.map((c) => c.name).join(', ') || '-'}`,
    ].join('\n');
  }

  async function createPlan() {
    if (!goal.trim()) { setErr('กรุณาระบุเป้าหมายที่ต้องการก่อน'); return; }
    setCreating(true); setErr('');
    const h = HORIZONS.find((x) => x.key === horizon);
    try {
      const text = await callClaude(PLAN_SYS, `ช่วงเวลาของแผน: ${h.label} (${h.days} วัน)\nเป้าหมายที่ผมต้องการ: ${goal.trim()}\n${myPlan.trim() ? `\nแผนที่ CEO ร่างไว้เอง (ให้นำมาผสาน): ${myPlan.trim()}\n` : ''}\nข้อมูลฐานปัจจุบัน:\n${baselineSummary()}`, undefined, 'plan');
      const json = parseJsonLoose(text);
      const start = todayDateStr();
      const end = shiftDateStr(start, h.days);
      const plan = { id: `${Date.now()}`, createdAt: Date.now(), horizon, horizonLabel: h.label, days: h.days, startDate: start, endDate: end, goal: goal.trim(), data: json, checkpoints: [], status: 'active' };
      setPlans([...(Array.isArray(plans) ? plans : []), plan].slice(-30));
      setOpenId(plan.id);
      setGoal('');
    } catch (e) {
      setErr(`สร้างแผนไม่สำเร็จ: ${e.message || ''}`);
    }
    setCreating(false);
  }

  // เทียบผลจริงกับเป้าที่วางไว้
  function actualsFor(plan) {
    const rows = saved.filter((m) => m.date >= plan.startDate);
    const views = rows.map((m) => m.metrics?.views).filter((v) => typeof v === 'number');
    const ers = rows.map((m) => engagementRate(m.metrics)).filter((v) => v != null);
    const nf = rows.map((m) => m.metrics?.newFollowers).filter((v) => typeof v === 'number');
    return {
      posts: rows.length,
      views: views.reduce((a, b) => a + b, 0),
      engagementRate: ers.length ? Math.round((ers.reduce((a, b) => a + b, 0) / ers.length) * 10) / 10 : null,
      newFollowers: nf.reduce((a, b) => a + b, 0),
    };
  }

  async function reviewPlan(plan) {
    setReviewing(true); setErr('');
    const act = actualsFor(plan);
    const daysPassed = Math.max(1, Math.round((Date.now() - new Date(plan.startDate + 'T00:00:00')) / 86400000));
    try {
      const text = await callClaude(PLAN_REVIEW_SYS, `แผน: ${plan.data.planName} (${plan.horizonLabel})\nเป้าหมายที่ตั้งไว้: ${JSON.stringify(plan.data.targets)}\nผ่านมาแล้ว ${daysPassed} จาก ${plan.days} วัน\n\nผลจริงถึงตอนนี้: ${JSON.stringify(act)}\n\nเป้าหมายที่ผู้ใช้ต้องการ: ${plan.goal}`, undefined, 'plan');
      const json = parseJsonLoose(text);
      setPlans((Array.isArray(plans) ? plans : []).map((p) => (p.id === plan.id ? { ...p, checkpoints: [...(p.checkpoints || []), { at: Date.now(), daysPassed, actual: act, review: json }].slice(-20) } : p)));
    } catch (e) {
      setErr(`ตรวจแผนไม่สำเร็จ: ${e.message || ''}`);
    }
    setReviewing(false);
  }

  // ---- จุดเชื่อมสำคัญ: ส่งแนวทางจากแผนไปให้ AI สร้างคอนเทนต์ใช้จริง ----
  function applyDirective(text) {
    if (!text) return;
    setTasks((prev) => prev.map((t) => ({ ...t, styleTemplate: text })));
    showToast('ใส่แนวทางลงงานวันนี้ทุกชิ้นแล้ว — AI จะยึดแนวนี้ตอนคิดโครงเรื่อง');
  }

  function deletePlan(id) {
    if (!window.confirm('ลบแผนนี้?')) return;
    setPlans((Array.isArray(plans) ? plans : []).filter((p) => p.id !== id));
    setOpenId(null);
  }

  const d = active?.data;
  const latestReview = active?.checkpoints?.length ? active.checkpoints[active.checkpoints.length - 1] : null;
  const act = active ? actualsFor(active) : null;

  return (
    <div>
      <p className="font-body text-xs mb-5 leading-relaxed" style={{ color: C.muted }}>
        วางแผนจากข้อมูลจริงที่ระบบเก็บไว้ → ลงมือทำ → ตรวจว่าเป็นไปตามเป้าไหม → ปรับแนวทางแล้วส่งกลับให้ AI สร้างคอนเทนต์ใช้ทันที
      </p>

      {err && (
        <div className="mb-4 p-3 rounded-xl flex items-start gap-2" style={{ background: `${C.red}15`, border: `1px solid ${C.red}55` }}>
          <AlertTriangle size={13} style={{ color: C.red }} className="shrink-0 mt-0.5" />
          <span className="font-body text-xs" style={{ color: C.text }}>{err}</span>
        </div>
      )}

      {/* ---- สองคอลัมน์: แผนของ CEO / แผนของ AI ---- */}
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.cyan}44` }}>
          <div className="flex items-center gap-2 mb-2">
            <UserCog size={14} style={{ color: C.cyan }} />
            <span className="font-mono text-2xs tracking-widest" style={{ color: C.cyan }}>แผนที่คุณเขียนเอง (CEO)</span>
          </div>
          <textarea value={myPlan} onChange={(e) => setMyPlan(e.target.value)} rows={7} placeholder={'เขียนแผนหรือแนวทางที่คุณคิดไว้เอง เช่น\n- อาทิตย์นี้เน้นคลิปสั้น 10 วิ\n- ลองปักตะกร้าสินค้าราคาถูกก่อน\n- อยากได้คนดูกลุ่มแม่บ้าน'} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
          <p className="font-mono text-2xs mt-1.5" style={{ color: C.muted, fontSize: 10 }}>* AI จะนำแผนนี้ไปผสานตอนสร้างหรือปรับแผน</p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.violet}44` }}>
          <div className="flex items-center gap-2 mb-2">
            <Bot size={14} style={{ color: C.violet }} />
            <span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>สั่งแก้แผนของ AI</span>
          </div>
          <textarea value={ceoNote} onChange={(e) => setCeoNote(e.target.value)} rows={7} placeholder={active ? 'สั่งได้เลย เช่น\n- เป้าวิวสูงไป ลดลงครึ่งหนึ่ง\n- เพิ่มเสาหลักคอนเทนต์แนวตลก\n- ตัดเฟสสุดท้ายออก เอาเวลาไปทุ่มเฟสแรก' : 'สร้างแผนก่อนถึงจะสั่งแก้ได้'} disabled={!active} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}`, opacity: active ? 1 : 0.5 }} />
          <button onClick={revisePlan} disabled={!active || revising || !ceoNote.trim()} className="mt-1.5 font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.violet, color: '#fff', opacity: (!active || revising || !ceoNote.trim()) ? 0.5 : 1 }}>
            {revising ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} ให้ AI ปรับแผนตามที่สั่ง
          </button>
          {active?.revisions?.length > 0 && <p className="font-mono text-2xs mt-1.5" style={{ color: C.muted, fontSize: 10 }}>ปรับมาแล้ว {active.revisions.length} ครั้ง</p>}
        </div>
      </div>

      {/* ---- สร้างแผนใหม่ ---- */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>สร้างแผนใหม่</div>
        <label className="font-mono text-2xs block mb-1.5" style={{ color: C.muted }}>เลือกช่วงเวลา</label>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {HORIZONS.map((h) => (
            <button key={h.key} onClick={() => setHorizon(h.key)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg" style={{ background: horizon === h.key ? BRAND : 'transparent', color: horizon === h.key ? '#fff' : C.muted, border: `1px solid ${horizon === h.key ? 'transparent' : C.border}` }}>{h.label}</button>
          ))}
        </div>
        <label className="font-mono text-2xs block mb-1.5" style={{ color: C.muted }}>เป้าหมายที่ต้องการ (ยิ่งระบุชัด แผนยิ่งแม่น)</label>
        <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={3} placeholder="เช่น อยากให้ Whalandia แตะ 1 ล้านวิวต่อเดือน และเริ่มขายของผ่านตะกร้าให้ได้ 50 ออเดอร์" className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y mb-2" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
        <div className="p-2.5 rounded-xl mb-2.5" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs mb-1" style={{ color: C.cyan }}>ฐานข้อมูลที่ AI จะใช้วางแผน</div>
          <pre className="font-mono whitespace-pre-wrap" style={{ fontSize: 10, color: C.muted }}>{baselineSummary()}</pre>
        </div>
        <button onClick={createPlan} disabled={creating} className="font-mono text-2xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: BRAND, color: '#fff', opacity: creating ? 0.6 : 1 }}>
          {creating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI วางแผน {HORIZONS.find((h) => h.key === horizon)?.label}
        </button>
      </div>

      {/* ---- รายการแผน ---- */}
      {list.length > 0 && (
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {list.slice().reverse().map((p) => (
            <button key={p.id} onClick={() => setOpenId(p.id)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg" style={{ background: active?.id === p.id ? C.violet : 'transparent', color: active?.id === p.id ? '#fff' : C.muted, border: `1px solid ${active?.id === p.id ? 'transparent' : C.border}` }}>
              {p.data?.planName || p.horizonLabel} · {p.horizonLabel}
            </button>
          ))}
        </div>
      )}

      {/* ---- รายละเอียดแผน ---- */}
      {active && d && (
        <>
          <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.violet}44` }}>
            <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-body text-lg" style={{ color: C.text }}>{d.planName}</h3>
                <div className="font-mono text-2xs" style={{ color: C.muted }}>{active.startDate} → {active.endDate} · {active.horizonLabel}</div>
              </div>
              <button onClick={() => deletePlan(active.id)} style={{ color: C.muted }}><Trash2 size={14} /></button>
            </div>
            <p className="font-body text-sm mb-3" style={{ color: C.text }}>{d.thesis}</p>

            {/* เป้าหมาย vs ผลจริง */}
            <div className="font-mono text-2xs mb-2" style={{ color: C.blue }}>เป้าหมาย เทียบ ผลจริง</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {[
                { k: 'views', label: 'ยอดวิว', actual: act?.views },
                { k: 'engagementRate', label: 'มีส่วนร่วม %', actual: act?.engagementRate },
                { k: 'newFollowers', label: 'ผู้ติดตามใหม่', actual: act?.newFollowers },
                { k: 'postsTotal', label: 'จำนวนคลิป', actual: act?.posts },
              ].map((row) => {
                const target = d.targets?.[row.k];
                const pct = (typeof target === 'number' && target > 0 && typeof row.actual === 'number') ? Math.min(100, Math.round((row.actual / target) * 100)) : null;
                const col = pct == null ? C.muted : pct >= 80 ? C.emerald : pct >= 40 ? C.orange : C.red;
                return (
                  <div key={row.k} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.muted, fontSize: 10 }}>{row.label}</div>
                    <div className="font-display text-base font-bold leading-none" style={{ color: col }}>{fmtNum(row.actual)}<span className="font-mono" style={{ fontSize: 10, color: C.muted }}> / {fmtNum(target)}</span></div>
                    {pct != null && (
                      <div className="mt-1.5" style={{ width: '100%', height: 3, background: C.panel, borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: col }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {(d.targets?.salesOrders || d.targets?.aov || d.targets?.ctr) && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                {d.targets.salesOrders && <span className="font-mono text-2xs" style={{ color: C.muted }}>เป้าออเดอร์ <span style={{ color: C.emerald }}>{fmtNum(d.targets.salesOrders)}</span></span>}
                {d.targets.aov && <span className="font-mono text-2xs" style={{ color: C.muted }}>ยอดเฉลี่ย/ออเดอร์ <span style={{ color: C.emerald }}>{fmtNum(d.targets.aov)}</span></span>}
                {d.targets.ctr && <span className="font-mono text-2xs" style={{ color: C.muted }}>คลิกไปตะกร้า <span style={{ color: C.emerald }}>{d.targets.ctr}%</span></span>}
              </div>
            )}
            {d.targetRationale && <p className="font-body text-xs" style={{ color: C.muted }}>{d.targetRationale}</p>}
          </div>

          {/* เฟส */}
          {Array.isArray(d.phases) && d.phases.length > 0 && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>แบ่งเฟสการทำงาน</div>
              <div className="space-y-2">
                {d.phases.map((ph, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="rounded-full flex items-center justify-center font-mono font-bold" style={{ width: 22, height: 22, background: C.violet, color: '#fff', fontSize: 10 }}>{i + 1}</div>
                      {i < d.phases.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, marginTop: 3 }} />}
                    </div>
                    <div className="pb-2 min-w-0">
                      <div className="font-body text-xs" style={{ color: C.text }}>{ph.name} <span className="font-mono" style={{ fontSize: 10, color: C.muted }}>· {ph.range}</span></div>
                      <p className="font-body text-xs" style={{ color: C.muted }}>{ph.focus}</p>
                      {ph.successMetric && <p className="font-mono mt-0.5" style={{ fontSize: 10, color: C.emerald }}>วัดผล: {ph.successMetric}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* เสาหลักคอนเทนต์ */}
          {Array.isArray(d.contentPillars) && d.contentPillars.length > 0 && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เสาหลักคอนเทนต์</div>
              <div className="space-y-2">
                {d.contentPillars.map((pl, i) => (
                  <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-body text-xs" style={{ color: C.text }}>{pl.name}</span>
                      <span className="font-mono text-2xs px-1.5 py-0.5 rounded shrink-0" style={{ color: C.violet, border: `1px solid ${C.violet}` }}>{pl.ratio}</span>
                    </div>
                    <p className="font-body text-xs mb-1" style={{ color: C.muted }}>{pl.why}</p>
                    {pl.exampleHook && <p className="font-body text-xs p-1.5 rounded" style={{ color: C.emerald, background: `${C.emerald}10` }}>ฮุกตัวอย่าง: {pl.exampleHook}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ฮุก + จิตวิทยา */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {Array.isArray(d.hookFormulas) && d.hookFormulas.length > 0 && (
              <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.orange }}>สูตรฮุก 3 วินาทีแรก</div>
                <ul className="space-y-1.5">
                  {d.hookFormulas.map((h, i) => <li key={i} className="font-body text-xs flex gap-1.5" style={{ color: C.text }}><span style={{ color: C.orange }}>▸</span>{h}</li>)}
                </ul>
              </div>
            )}
            {Array.isArray(d.psychologyNotes) && d.psychologyNotes.length > 0 && (
              <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.violet }}>หลักจิตวิทยาที่ใช้</div>
                <ul className="space-y-1.5">
                  {d.psychologyNotes.map((h, i) => <li key={i} className="font-body text-xs flex gap-1.5" style={{ color: C.text }}><span style={{ color: C.violet }}>▸</span>{h}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* ตัวเลขที่ต้องจับตา + ความเสี่ยง */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {Array.isArray(d.leadingIndicators) && d.leadingIndicators.length > 0 && (
              <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.cyan }}>ตัวเลขที่ต้องดูทุกวัน</div>
                <ul className="space-y-1.5">
                  {d.leadingIndicators.map((h, i) => <li key={i} className="font-body text-xs flex gap-1.5" style={{ color: C.text }}><Gauge size={11} style={{ color: C.cyan }} className="shrink-0 mt-0.5" />{h}</li>)}
                </ul>
              </div>
            )}
            {Array.isArray(d.risks) && d.risks.length > 0 && (
              <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.red }}>ความเสี่ยง &amp; วิธีรับมือ</div>
                <div className="space-y-2">
                  {d.risks.map((r, i) => (
                    <div key={i}>
                      <div className="font-body text-xs" style={{ color: C.red }}>{r.risk}</div>
                      <div className="font-body text-xs" style={{ color: C.muted }}>→ {r.mitigation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* จุดเชื่อมกับ AI สร้างคอนเทนต์ */}
          {d.contentDirective && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.emerald}55` }}>
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight size={14} style={{ color: C.emerald }} />
                <span className="font-mono text-2xs tracking-widest" style={{ color: C.emerald }}>ส่งแนวทางนี้ให้ AI สร้างคอนเทนต์</span>
              </div>
              <p className="font-body text-xs mb-2 p-2.5 rounded-xl whitespace-pre-wrap" style={{ color: C.text, background: C.bgDeep, border: `1px solid ${C.border}` }}>{d.contentDirective}</p>
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => applyDirective(d.contentDirective)} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.emerald, color: '#062' }}>
                  <ArrowRight size={11} /> ใส่ลงงานวันนี้ทุกชิ้น
                </button>
                <button onClick={() => copyText(d.contentDirective).then(() => showToast('คัดลอกแล้ว'))} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>คัดลอก</button>
              </div>
              <p className="font-mono text-2xs mt-2" style={{ color: C.muted, fontSize: 10 }}>* กดแล้วแนวทางนี้จะไปอยู่ในช่อง "เทมเพลต/สคริปต์อ้างอิง" ของงานทุกชิ้นวันนี้ AI จะยึดแนวนี้ตอนคิดโครงเรื่อง</p>
            </div>
          )}

          {/* ตรวจแผน */}
          <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Activity size={14} style={{ color: C.blue }} />
                <span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>ตรวจว่าเป็นไปตามแผนไหม</span>
              </div>
              <button onClick={() => reviewPlan(active)} disabled={reviewing} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: BRAND, color: '#fff', opacity: reviewing ? 0.6 : 1 }}>
                {reviewing ? <Loader2 size={12} className="animate-spin" /> : <Activity size={12} />} ตรวจเดี๋ยวนี้
              </button>
            </div>
            {d.checkpointEvery && <p className="font-mono text-2xs mb-2" style={{ color: C.muted }}>แนะนำให้ตรวจ: {d.checkpointEvery}</p>}

            {!latestReview ? (
              <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่เคยตรวจ — กดปุ่มด้านบนเพื่อเทียบผลจริงกับเป้าที่วางไว้</p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ background: latestReview.review.onTrack ? `${C.emerald}22` : `${C.red}22`, color: latestReview.review.onTrack ? C.emerald : C.red, border: `1px solid ${latestReview.review.onTrack ? C.emerald : C.red}` }}>
                    {latestReview.review.onTrack ? 'เป็นไปตามแผน' : 'หลุดเป้า'}
                  </span>
                  <span className="font-mono text-2xs" style={{ color: C.muted }}>ความคืบหน้า {latestReview.review.progressPercent}% · ผ่านมา {latestReview.daysPassed} วัน</span>
                </div>
                <p className="font-body text-xs" style={{ color: C.text }}>{latestReview.review.verdict}</p>

                {Array.isArray(latestReview.review.gaps) && latestReview.review.gaps.length > 0 && (
                  <div className="space-y-1.5">
                    {latestReview.review.gaps.map((g, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                        <div className="font-mono text-2xs mb-0.5" style={{ color: C.orange }}>{g.metric} · เป้า {g.target} · จริง {g.actual} ({g.gap})</div>
                        <p className="font-body text-xs" style={{ color: C.muted }}>{g.cause}</p>
                      </div>
                    ))}
                  </div>
                )}

                {Array.isArray(latestReview.review.fixNow) && latestReview.review.fixNow.length > 0 && (
                  <div>
                    <div className="font-mono text-2xs mb-1.5" style={{ color: C.emerald }}>ต้องทำทันที</div>
                    <div className="space-y-1.5">
                      {latestReview.review.fixNow.map((f, i) => (
                        <div key={i} className="p-2.5 rounded-xl flex items-start gap-2" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                          <span className="font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ fontSize: 9, color: f.priority === 'high' ? C.red : C.muted, border: `1px solid ${f.priority === 'high' ? C.red : C.border}` }}>{f.priority === 'high' ? 'ด่วน' : f.priority === 'medium' ? 'ปานกลาง' : 'เสริม'}</span>
                          <div className="min-w-0">
                            <p className="font-body text-xs" style={{ color: C.text }}>{f.action}</p>
                            {f.expectedEffect && <p className="font-body text-xs" style={{ color: C.muted }}>คาดว่า: {f.expectedEffect}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {latestReview.review.planAdjustment && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>ควรปรับแผน</div>
                    <p className="font-body text-xs" style={{ color: C.text }}>{latestReview.review.planAdjustment}</p>
                  </div>
                )}

                {latestReview.review.contentDirectiveUpdate && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>แนวทางคอนเทนต์ใหม่ที่ควรใช้</div>
                    <p className="font-body text-xs mb-2" style={{ color: C.text }}>{latestReview.review.contentDirectiveUpdate}</p>
                    <button onClick={() => applyDirective(latestReview.review.contentDirectiveUpdate)} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.emerald, color: '#062' }}>
                      <ArrowRight size={11} /> ใส่ลงงานวันนี้ทุกชิ้น
                    </button>
                  </div>
                )}

                {active.checkpoints.length > 1 && (
                  <div className="pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="font-mono text-2xs mb-1.5" style={{ color: C.muted }}>ประวัติการตรวจ ({active.checkpoints.length})</div>
                    <ResponsiveContainer width="100%" height={110}>
                      <LineChart data={active.checkpoints.map((c) => ({ d: `วัน ${c.daysPassed}`, p: c.review.progressPercent }))}>
                        <XAxis dataKey="d" tick={{ fill: C.muted, fontSize: 9 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 9 }} />
                        <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                        <Line type="monotone" dataKey="p" name="ความคืบหน้า %" stroke={C.emerald} strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {list.length === 0 && (
        <div className="p-8 rounded-2xl text-center" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <Compass size={26} style={{ color: C.muted }} className="mx-auto mb-2" />
          <p className="font-body text-sm mb-1" style={{ color: C.text }}>ยังไม่มีแผน</p>
          <p className="font-body text-xs" style={{ color: C.muted }}>เลือกช่วงเวลาและระบุเป้าหมายด้านบนเพื่อให้ AI วางแผนให้</p>
        </div>
      )}
    </div>
  );
}

const INTEL_TABS = [
  { key: 'stats', label: 'สถิติผลงาน', Icon: TrendingUp },
  { key: 'plan', label: 'แผน & กลยุทธ์', Icon: Compass },
  { key: 'ads', label: 'ยิงแอด & ROAS', Icon: Megaphone },
  { key: 'rival', label: 'ถอดสูตรคู่แข่ง', Icon: Clapperboard },
  { key: 'product', label: 'วิเคราะห์สินค้า', Icon: ShoppingCart },
];

function AnalyticsPage(props) {
  const isOwner = props.user?.isOwner;
  const f = props.features?.analyticsTabs;
  const tabOn = (k) => isOwner || !f || f[k] !== false;
  const visibleTabs = INTEL_TABS.filter((t) => tabOn(t.key));
  const [tab, setTab] = useState(visibleTabs[0]?.key || 'stats');
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><Gauge size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>INTELLIGENCE CENTER</span></div>
      <h2 className="font-body text-xl mb-4" style={{ color: C.text }}>ศูนย์วิเคราะห์ &amp; วางแผน</h2>
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {visibleTabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: tab === t.key ? BRAND : 'transparent', color: tab === t.key ? '#fff' : C.muted, border: `1px solid ${tab === t.key ? 'transparent' : C.border}` }}>
            <t.Icon size={12} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'stats' && <StatsPanel {...props} />}
      {tab === 'plan' && <StrategyPage {...props} />}
      {tab === 'ads' && <AdsPanel ads={props.ads} setAds={props.setAds} showToast={props.showToast} />}
      {tab === 'rival' && <CompetitorIntel rivals={props.rivals} setRivals={props.setRivals} channels={props.channels} showToast={props.showToast} />}
      {tab === 'product' && <ProductFitPanel channels={props.channels} showToast={props.showToast} />}
    </div>
  );
}

function StatsPanel({ history, tasks, channels, metrics, setMetrics }) {
  const [images, setImages] = useState([]);       // { id, name, base64, mimeType, dataUrl, platform, status, result }
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [deep, setDeep] = useState(null);
  const [deepLoading, setDeepLoading] = useState(false);
  const [tab, setTab] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState('');

  const saved = Array.isArray(metrics) ? metrics : [];
  const filtered = tab === 'all' ? saved : saved.filter((m) => m.platform === tab);

  async function addFiles(files) {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    const newOnes = await Promise.all(arr.map(async (f) => {
      const base64 = await fileToBase64(f);
      const mimeType = f.type || 'image/jpeg';
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: f.name, mimeType, base64, dataUrl: `data:${mimeType};base64,${base64}`, status: 'pending', result: null };
    }));
    setImages((prev) => [...prev, ...newOnes]);
  }

  // อ่านตัวเลขจากทุกรูปทีละใบ (ระบบคิวหน่วงเวลาจัดการให้เองอยู่แล้ว)
  async function readAll() {
    const targets = images.filter((im) => im.status !== 'done');
    if (targets.length === 0) return;
    setReading(true); setErr(''); setProgress({ done: 0, total: targets.length });
    const collected = [];
    for (let i = 0; i < targets.length; i++) {
      const im = targets[i];
      setImages((prev) => prev.map((x) => (x.id === im.id ? { ...x, status: 'reading' } : x)));
      try {
        const text = await callClaude(METRIC_EXTRACT_SYS, 'อ่านตัวเลขทั้งหมดจากภาพหน้าจอสถิตินี้', [{ mimeType: im.mimeType, data: im.base64 }], 'metricRead');
        const json = parseJsonLoose(text);
        const entry = {
          id: im.id,
          at: Date.now(),
          date: todayDateStr(),
          fileName: im.name,
          platform: json.platform || 'other',
          confidence: json.platformConfidence || 'low',
          contentTitle: json.contentTitle || null,
          periodLabel: json.periodLabel || null,
          metrics: json.metrics || {},
          topInsight: json.topInsight || '',
          notes: json.notes || null,
        };
        collected.push(entry);
        setImages((prev) => prev.map((x) => (x.id === im.id ? { ...x, status: 'done', result: entry, platform: entry.platform } : x)));
      } catch (e) {
        setImages((prev) => prev.map((x) => (x.id === im.id ? { ...x, status: 'error', result: { error: e.message } } : x)));
        setErr(`อ่านบางรูปไม่สำเร็จ: ${e.message || ''}`);
      }
      setProgress({ done: i + 1, total: targets.length });
    }
    if (collected.length) setMetrics([...(Array.isArray(metrics) ? metrics : []), ...collected].slice(-500));
    setReading(false);
  }

  async function runDeepAnalysis() {
    if (filtered.length === 0) return;
    setDeepLoading(true); setDeep(null);
    const payload = filtered.slice(-40).map((m) => ({
      date: m.date, platform: m.platform, title: m.contentTitle, period: m.periodLabel,
      ...m.metrics, engagementRate: engagementRate(m.metrics),
    }));
    try {
      const text = await callClaude(DEEP_ANALYSIS_SYS, `ข้อมูลสถิติจริงจากหน้า insights (${payload.length} รายการ):\n${JSON.stringify(payload, null, 1)}`, undefined, 'deepAnalysis');
      setDeep(parseJsonLoose(text));
    } catch (e) {
      setErr(`วิเคราะห์ไม่สำเร็จ: ${e.message || ''}`);
    }
    setDeepLoading(false);
  }

  function removeImage(id) { setImages((prev) => prev.filter((x) => x.id !== id)); }
  function setImagePlatform(id, platform) {
    setImages((prev) => prev.map((x) => (x.id === id ? { ...x, platform, result: x.result ? { ...x.result, platform } : x.result } : x)));
    setMetrics((prev) => (Array.isArray(prev) ? prev : []).map((m) => (m.id === id ? { ...m, platform } : m)));
  }
  function deleteMetric(id) { setMetrics((prev) => (Array.isArray(prev) ? prev : []).filter((m) => m.id !== id)); }

  // ---- สรุปตัวเลขรวม ----
  const totals = METRIC_FIELDS.reduce((acc, f) => {
    const vals = filtered.map((m) => m.metrics && m.metrics[f.key]).filter((v) => typeof v === 'number');
    acc[f.key] = vals.length ? (f.key === 'avgWatchPercent' ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : vals.reduce((a, b) => a + b, 0)) : null;
    return acc;
  }, {});
  const erList = filtered.map((m) => engagementRate(m.metrics)).filter((v) => v != null);
  const avgER = erList.length ? (erList.reduce((a, b) => a + b, 0) / erList.length).toFixed(1) : null;

  // เทียบแพลตฟอร์ม
  const platformCompare = PLATFORM_TABS.filter((t) => t.key !== 'all').map((t) => {
    const rows = saved.filter((m) => m.platform === t.key);
    const views = rows.map((m) => m.metrics?.views).filter((v) => typeof v === 'number');
    const ers = rows.map((m) => engagementRate(m.metrics)).filter((v) => v != null);
    return {
      name: t.label,
      โพสต์: rows.length,
      วิวรวม: views.reduce((a, b) => a + b, 0),
      ปฏิสัมพันธ์: ers.length ? Math.round((ers.reduce((a, b) => a + b, 0) / ers.length) * 10) / 10 : 0,
    };
  }).filter((r) => r.โพสต์ > 0);

  // แนวโน้มตามวัน
  const byDate = {};
  filtered.forEach((m) => {
    const d = m.date;
    if (!byDate[d]) byDate[d] = { date: d.slice(5), views: 0, er: [] };
    if (typeof m.metrics?.views === 'number') byDate[d].views += m.metrics.views;
    const er = engagementRate(m.metrics); if (er != null) byDate[d].er.push(er);
  });
  const trend = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)).slice(-20)
    .map((d) => ({ date: d.date, views: d.views, er: d.er.length ? Math.round((d.er.reduce((a, b) => a + b, 0) / d.er.length) * 10) / 10 : null }));

  // คอนเทนต์ที่ทำได้ดีที่สุด
  const topContent = [...filtered].filter((m) => typeof m.metrics?.views === 'number')
    .sort((a, b) => b.metrics.views - a.metrics.views).slice(0, 5);

  const sevColor = (s) => (s === 'high' ? C.red : s === 'medium' ? C.orange : C.blue);

  return (
    <div>
      <p className="font-body text-xs mb-5 leading-relaxed" style={{ color: C.muted }}>
        แนบภาพหน้าจอสถิติจากทุกแพลตฟอร์มพร้อมกันได้เลย — ระบบจะอ่านตัวเลขออกมาเป็นข้อมูลจริง แยกแพลตฟอร์มให้อัตโนมัติ แล้วสะสมเป็นสถิติเทียบข้ามแพลตฟอร์มและดูแนวโน้มได้
      </p>

      {err && (
        <div className="mb-4 p-3 rounded-xl flex items-start gap-2" style={{ background: `${C.red}15`, border: `1px solid ${C.red}55` }}>
          <AlertTriangle size={13} style={{ color: C.red }} className="shrink-0 mt-0.5" />
          <span className="font-body text-xs" style={{ color: C.text }}>{err}</span>
        </div>
      )}

      {/* ---- โซนอัปโหลด ---- */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        className="p-5 rounded-2xl mb-4 text-center"
        style={{ background: dragOver ? `${C.blue}15` : C.panel, border: `1.5px dashed ${dragOver ? C.blue : C.border}`, transition: 'all .15s' }}
      >
        <Upload size={22} style={{ color: dragOver ? C.blue : C.muted }} className="mx-auto mb-2" />
        <p className="font-body text-sm mb-1" style={{ color: C.text }}>ลากภาพหน้าจอสถิติมาวางที่นี่</p>
        <p className="font-body text-xs mb-3" style={{ color: C.muted }}>แนบหลายรูปพร้อมกันได้ ทุกแพลตฟอร์มปนกันได้เลย ระบบแยกให้เอง</p>
        <label className="inline-flex font-mono text-2xs px-4 py-2 rounded-lg cursor-pointer items-center gap-1.5" style={{ background: BRAND, color: '#fff' }}>
          <Upload size={12} /> เลือกรูปจากเครื่อง
          <input type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} className="hidden" />
        </label>
      </div>

      {/* ---- รายการรูปที่รออ่าน ---- */}
      {images.length > 0 && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>รูปที่แนบ ({images.length})</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setImages([])} className="font-mono text-2xs px-2 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>ล้างทั้งหมด</button>
              <button onClick={readAll} disabled={reading} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: BRAND, color: '#fff', opacity: reading ? 0.6 : 1 }}>
                {reading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {reading ? `กำลังอ่าน ${progress.done}/${progress.total}` : 'อ่านตัวเลขจากรูปทั้งหมด'}
              </button>
            </div>
          </div>
          {reading && (
            <div className="mb-3" style={{ width: '100%', height: 4, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.violet})`, transition: 'width .3s' }} />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {images.map((im) => {
              const st = im.status;
              const stColor = st === 'done' ? C.emerald : st === 'error' ? C.red : st === 'reading' ? C.blue : C.muted;
              const stLabel = st === 'done' ? 'อ่านแล้ว' : st === 'error' ? 'ไม่สำเร็จ' : st === 'reading' ? 'กำลังอ่าน...' : 'รออ่าน';
              return (
                <div key={im.id} className="rounded-xl overflow-hidden relative" style={{ border: `1px solid ${stColor}55`, background: C.bgDeep }}>
                  <img src={im.dataUrl} alt={im.name} className="w-full object-cover" style={{ height: 90 }} />
                  <button onClick={() => removeImage(im.id)} className="absolute top-1 right-1 rounded-full p-0.5" style={{ background: 'rgba(0,0,0,.65)', color: '#fff' }}><X size={11} /></button>
                  <div className="p-1.5">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: stColor }} />
                      <span className="font-mono truncate" style={{ fontSize: 9, color: stColor }}>{stLabel}</span>
                      {im.result && im.result.confidence === 'low' && <span className="font-mono shrink-0" style={{ fontSize: 9, color: C.orange }}>· ไม่ชัด</span>}
                    </div>
                    <select value={im.platform || 'other'} onChange={(e) => setImagePlatform(im.id, e.target.value)} className="w-full font-mono outline-none rounded" style={{ fontSize: 9, background: C.panel, color: C.text, border: `1px solid ${C.border}`, padding: '2px 4px' }}>
                      {PLATFORM_TABS.filter((t) => t.key !== 'all').map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                    {im.result && im.result.metrics && (
                      <div className="font-mono mt-1 truncate" style={{ fontSize: 9, color: C.muted }}>
                        วิว {fmtNum(im.result.metrics.views)} · ไลก์ {fmtNum(im.result.metrics.likes)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- แท็บแพลตฟอร์ม ---- */}
      {saved.length > 0 && (
        <>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {PLATFORM_TABS.map((t) => {
              const n = t.key === 'all' ? saved.length : saved.filter((m) => m.platform === t.key).length;
              if (t.key !== 'all' && n === 0) return null;
              return (
                <button key={t.key} onClick={() => setTab(t.key)} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ background: tab === t.key ? BRAND : 'transparent', color: tab === t.key ? '#fff' : C.muted, border: `1px solid ${tab === t.key ? 'transparent' : C.border}` }}>
                  {t.label} <span style={{ opacity: .7 }}>({n})</span>
                </button>
              );
            })}
          </div>

          {/* ---- การ์ดตัวเลขรวม ---- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {METRIC_FIELDS.slice(0, 4).map((f) => (
              <StatCard key={f.key} label={f.label} value={fmtNum(totals[f.key])} sub={`จาก ${filtered.length} โพสต์`} color={f.color} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {METRIC_FIELDS.slice(4, 7).map((f) => (
              <StatCard key={f.key} label={f.label} value={fmtNum(totals[f.key])} color={f.color} />
            ))}
            <StatCard label="อัตรามีส่วนร่วม" value={avgER == null ? '—' : `${avgER}%`} sub={avgER == null ? '' : avgER >= 5 ? 'ดีมาก' : avgER >= 2 ? 'ปกติ' : 'ต่ำ ควรปรับ'} color={avgER == null ? C.muted : avgER >= 5 ? C.emerald : avgER >= 2 ? C.orange : C.red} Icon={Flame} />
          </div>

          {/* ---- แนวโน้ม ---- */}
          {trend.length > 1 && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>แนวโน้มยอดวิว &amp; การมีส่วนร่วม</div>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis yAxisId="l" tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={fmtNum} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fill: C.muted, fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="l" type="monotone" dataKey="views" name="ยอดวิว" stroke={C.blue} strokeWidth={2} dot={{ r: 2 }} />
                  <Line yAxisId="r" type="monotone" dataKey="er" name="มีส่วนร่วม %" stroke={C.emerald} strokeWidth={2} dot={{ r: 2 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ---- เทียบแพลตฟอร์ม ---- */}
          {platformCompare.length > 1 && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เทียบข้ามแพลตฟอร์ม</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={platformCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={fmtNum} />
                  <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="วิวรวม" fill={C.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="โพสต์" fill={C.violet} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ---- คอนเทนต์ที่ดีที่สุด ---- */}
          {topContent.length > 0 && (
            <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>คอนเทนต์ที่ทำได้ดีที่สุด</div>
              <div className="space-y-2">
                {topContent.map((m, i) => {
                  const er = engagementRate(m.metrics);
                  return (
                    <div key={m.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                      <span className="font-display text-lg font-bold shrink-0" style={{ color: i === 0 ? C.orange : C.muted, width: 22 }}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-body text-xs truncate" style={{ color: C.text }}>{m.contentTitle || m.fileName || '(ไม่มีชื่อ)'}</div>
                        <div className="font-mono text-2xs" style={{ color: C.muted, fontSize: 10 }}>{m.platform} · {m.date}{m.periodLabel ? ` · ${m.periodLabel}` : ''}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-xs" style={{ color: C.blue }}>{fmtNum(m.metrics.views)}</div>
                        {er != null && <div className="font-mono" style={{ fontSize: 10, color: er >= 5 ? C.emerald : C.muted }}>{er}%</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---- วิเคราะห์เชิงลึก ---- */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}44` }}>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: C.violet }} />
                <span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>วิเคราะห์เชิงลึกด้วย AI</span>
              </div>
              <button onClick={runDeepAnalysis} disabled={deepLoading || filtered.length === 0} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.violet, color: '#fff', opacity: (deepLoading || filtered.length === 0) ? 0.5 : 1 }}>
                {deepLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} วิเคราะห์ {tab === 'all' ? 'ทั้งหมด' : PLATFORM_TABS.find((t) => t.key === tab)?.label}
              </button>
            </div>

            {!deep && !deepLoading && <p className="font-body text-xs" style={{ color: C.muted }}>กดปุ่มเพื่อให้ AI วิเคราะห์จากตัวเลขจริงที่อ่านมา พร้อมบอกสิ่งที่ต้องลงมือทำ</p>}

            {deep && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="shrink-0 text-center px-3 py-2 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${deep.healthScore >= 70 ? C.emerald : deep.healthScore >= 40 ? C.orange : C.red}` }}>
                    <div className="font-display text-2xl font-bold leading-none" style={{ color: deep.healthScore >= 70 ? C.emerald : deep.healthScore >= 40 ? C.orange : C.red }}>{deep.healthScore ?? '—'}</div>
                    <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>สุขภาพช่อง</div>
                  </div>
                  <p className="font-body text-sm flex-1 min-w-[180px]" style={{ color: C.text }}>{deep.headline}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  {deep.bestPlatform && (
                    <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                      <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>ทำได้ดีที่สุด</div>
                      <p className="font-body text-xs" style={{ color: C.text }}>{deep.bestPlatform}</p>
                    </div>
                  )}
                  {deep.weakestPlatform && (
                    <div className="p-2.5 rounded-xl" style={{ background: `${C.red}12`, border: `1px solid ${C.red}44` }}>
                      <div className="font-mono text-2xs mb-1" style={{ color: C.red }}>ต้องแก้ด่วน</div>
                      <p className="font-body text-xs" style={{ color: C.text }}>{deep.weakestPlatform}</p>
                    </div>
                  )}
                </div>

                {Array.isArray(deep.findings) && deep.findings.length > 0 && (
                  <div>
                    <div className="font-mono text-2xs mb-1.5" style={{ color: C.blue }}>สิ่งที่พบ</div>
                    <div className="space-y-1.5">
                      {deep.findings.map((f, i) => (
                        <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${sevColor(f.severity)}`, border: `1px solid ${C.border}` }}>
                          <div className="font-body text-xs mb-0.5" style={{ color: sevColor(f.severity) }}>{f.title}</div>
                          <p className="font-body text-xs" style={{ color: C.text }}>{f.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(deep.actions) && deep.actions.length > 0 && (
                  <div>
                    <div className="font-mono text-2xs mb-1.5" style={{ color: C.emerald }}>ลงมือทำต่อ</div>
                    <div className="space-y-1.5">
                      {deep.actions.map((a, i) => (
                        <div key={i} className="p-2.5 rounded-xl flex items-start gap-2" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                          <span className="font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ fontSize: 9, background: a.impact === 'high' ? `${C.emerald}22` : 'transparent', color: a.impact === 'high' ? C.emerald : C.muted, border: `1px solid ${a.impact === 'high' ? C.emerald : C.border}` }}>
                            {a.impact === 'high' ? 'สำคัญ' : a.impact === 'medium' ? 'ปานกลาง' : 'เสริม'}
                          </span>
                          <div className="min-w-0">
                            <p className="font-body text-xs" style={{ color: C.text }}>{a.do}</p>
                            {a.why && <p className="font-body text-xs mt-0.5" style={{ color: C.muted }}>เพราะ: {a.why}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {deep.contentAdvice && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>แนวคอนเทนต์ที่ควรทำต่อ</div>
                    <p className="font-body text-xs" style={{ color: C.text }}>{deep.contentAdvice}</p>
                  </div>
                )}

                {deep.warning && (
                  <div className="p-2.5 rounded-xl flex items-start gap-2" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}>
                    <AlertTriangle size={13} style={{ color: C.orange }} className="shrink-0 mt-0.5" />
                    <p className="font-body text-xs" style={{ color: C.text }}>{deep.warning}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---- ตารางข้อมูลดิบ ---- */}
          <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ข้อมูลที่อ่านมาทั้งหมด ({filtered.length})</div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {filtered.slice().reverse().map((m) => {
                const er = engagementRate(m.metrics);
                return (
                  <div key={m.id} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <div className="font-body text-xs truncate" style={{ color: C.text }}>{m.contentTitle || m.fileName}</div>
                        <div className="font-mono" style={{ fontSize: 10, color: C.muted }}>{m.platform} · {m.date}{m.periodLabel ? ` · ${m.periodLabel}` : ''}</div>
                      </div>
                      <button onClick={() => deleteMetric(m.id)} style={{ color: C.muted }} className="shrink-0"><X size={12} /></button>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {METRIC_FIELDS.map((f) => (typeof m.metrics?.[f.key] === 'number' ? (
                        <span key={f.key} className="font-mono" style={{ fontSize: 10, color: C.muted }}>
                          {f.label} <span style={{ color: f.color }}>{f.key === 'avgWatchPercent' ? `${m.metrics[f.key]}%` : fmtNum(m.metrics[f.key])}</span>
                        </span>
                      ) : null))}
                      {er != null && <span className="font-mono" style={{ fontSize: 10, color: C.muted }}>มีส่วนร่วม <span style={{ color: C.emerald }}>{er}%</span></span>}
                    </div>
                    {m.topInsight && <p className="font-body text-xs mt-1.5" style={{ color: C.muted }}>{m.topInsight}</p>}
                    {m.notes && <p className="font-mono mt-1" style={{ fontSize: 10, color: C.orange }}>หมายเหตุ: {m.notes}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {saved.length === 0 && images.length === 0 && (
        <div className="p-8 rounded-2xl text-center" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <Gauge size={26} style={{ color: C.muted }} className="mx-auto mb-2" />
          <p className="font-body text-sm mb-1" style={{ color: C.text }}>ยังไม่มีข้อมูลสถิติ</p>
          <p className="font-body text-xs" style={{ color: C.muted }}>แนบภาพหน้าจอสถิติจากแพลตฟอร์มด้านบนเพื่อเริ่มเก็บข้อมูล</p>
        </div>
      )}
    </div>
  );
}

const SHORTCUTS = [
  { keys: '1', action: 'ไปหน้างานประจำวัน' },
  { keys: '2', action: 'ไปหน้าปฏิทิน' },
  { keys: '3', action: 'ไปหน้า Directory' },
  { keys: '4', action: 'ไปหน้าแพลตฟอร์ม' },
  { keys: '5', action: 'ไปหน้าการวิเคราะห์' },
  { keys: '6', action: 'ไปหน้า Protocol' },
  { keys: '?', action: 'ไปหน้า Setting' },
  { keys: 'G', action: 'กลับหน้างานประจำวันเร็วๆ' },
  { keys: '⌘Z / Ctrl+Z', action: 'ย้อนกลับการแก้ไขล่าสุด (Undo)' },
  { keys: '⌘⇧Z / Ctrl+Y', action: 'ทำซ้ำสิ่งที่ย้อนไป (Redo)' },
  { keys: '⌘K / Ctrl+K', action: 'เปิดหน้า Setting' },
  { keys: '←  /  →', action: 'ดูงานวันก่อนหน้า / วันถัดไป (ในหน้างานประจำวัน)' },
  { keys: 'T', action: 'กลับมาที่งานของวันนี้' },
  { keys: 'Esc', action: 'ออกจากช่องพิมพ์ที่กำลังกรอกอยู่' },
];

const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// ---------- ถังขยะ: เก็บของที่ลบไว้ 30 วัน กู้คืนได้ ----------
// ---------- ตั้งค่าคีย์ Gemini ส่วนตัว ----------
// ---------- พาผู้ใช้ใหม่เริ่มต้น ----------
function OnboardingCard({ user, tokens, channels, onGoSettings, onGoDaily, onDismiss }) {
  const steps = [
    { done: !!user.hasGeminiKey, label: 'ใส่คีย์ AI ของตัวเอง', desc: 'ฟรี ใช้เวลา 2 นาที — ได้ใช้ AI ไม่จำกัด ไม่เสียโทเค็น', action: onGoSettings, cta: 'ไปตั้งค่า' },
    { done: channels.length > 0, label: 'สร้างช่อง/เพจแรก', desc: 'บอกว่าแต่ละวันต้องลงวิดีโอ/รูปกี่ชิ้น ระบบจะสร้างงานให้อัตโนมัติ', action: onGoDaily, cta: 'ไปสร้างช่อง' },
    { done: channels.length > 0 && (tokens?.used || 0) > 0, label: 'ลองให้ AI คิดโครงเรื่องให้', desc: 'กดปุ่ม "ให้ AI คิดโครงเรื่องให้" ในงานชิ้นแรก', action: onGoDaily, cta: 'ไปลองใช้' },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.blue}55` }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: C.blue }} />
          <span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>เริ่มต้นใช้งาน ({doneCount}/{steps.length})</span>
        </div>
        <button onClick={onDismiss} style={{ color: C.muted }}><X size={13} /></button>
      </div>
      <div className="mb-3" style={{ width: '100%', height: 4, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${(doneCount / steps.length) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.emerald})`, transition: 'width .3s' }} />
      </div>
      <div className="space-y-2">
        {steps.map((st, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ background: st.done ? 'transparent' : C.bgDeep, border: `1px solid ${st.done ? C.border : C.blue}33`, opacity: st.done ? 0.55 : 1 }}>
            {st.done ? <CheckCircle2 size={15} style={{ color: C.emerald }} className="shrink-0 mt-0.5" /> : <span className="font-mono shrink-0 rounded-full flex items-center justify-center mt-0.5" style={{ width: 15, height: 15, background: C.blue, color: '#fff', fontSize: 9 }}>{i + 1}</span>}
            <div className="min-w-0 flex-1">
              <div className="font-body text-xs" style={{ color: C.text, textDecoration: st.done ? 'line-through' : 'none' }}>{st.label}</div>
              <p className="font-body text-xs" style={{ color: C.muted }}>{st.desc}</p>
            </div>
            {!st.done && <button onClick={st.action} className="font-mono text-2xs px-2.5 py-1 rounded-lg shrink-0" style={{ background: C.blue, color: '#fff' }}>{st.cta}</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- ขอโทเค็นเพิ่ม / ขอความช่วยเหลือ ----------
function SupportPanel({ user, tokens, showToast }) {
  const [msg, setMsg] = useState('');
  const [kind, setKind] = useState('tokens');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!msg.trim()) return;
    setBusy(true);
    const { ok } = await apiPost('/api/auth', { action: 'sendSupport', kind, message: msg.trim() });
    setBusy(false);
    if (ok) { setSent(true); setMsg(''); showToast('ส่งถึงผู้ดูแลระบบแล้ว'); setTimeout(() => setSent(false), 4000); }
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-2.5">
        <Mail size={14} style={{ color: C.cyan }} />
        <span className="font-mono text-2xs tracking-widest" style={{ color: C.cyan }}>ติดต่อผู้ดูแลระบบ</span>
      </div>
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {[
          { k: 'tokens', label: 'ขอโทเค็นเพิ่ม' },
          { k: 'bug', label: 'แจ้งปัญหา' },
          { k: 'feature', label: 'ขอฟีเจอร์' },
        ].map((t) => (
          <button key={t.k} onClick={() => setKind(t.k)} className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ background: kind === t.k ? C.cyan : 'transparent', color: kind === t.k ? '#032' : C.muted, border: `1px solid ${kind === t.k ? 'transparent' : C.border}` }}>{t.label}</button>
        ))}
      </div>
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder={kind === 'tokens' ? 'บอกว่าต้องใช้ทำอะไร ต้องการเท่าไหร่' : kind === 'bug' ? 'อธิบายปัญหาที่เจอ อยู่หน้าไหน กดอะไรแล้วเกิดอะไร' : 'อยากได้ฟีเจอร์อะไรเพิ่ม'} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y mb-2" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
      <button onClick={send} disabled={busy || !msg.trim()} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.cyan, color: '#032', opacity: (busy || !msg.trim()) ? 0.5 : 1 }}>
        {busy ? <Loader2 size={11} className="animate-spin" /> : <Mail size={11} />} ส่ง
      </button>
      {sent && <p className="font-mono text-2xs mt-1.5" style={{ color: C.emerald }}>ส่งแล้ว ผู้ดูแลจะเห็นในศูนย์ควบคุม</p>}
    </div>
  );
}

// ---------- ข้อมูลบริษัท/องค์กร + รหัสชวนทีม ----------
function CompanyPanel({ user, showToast }) {
  const [org, setOrg] = useState(null);
  const [role, setRole] = useState('staff');
  const [roles, setRoles] = useState({});
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  async function load() {
    const { ok, data } = await apiPost('/api/auth', { action: 'myOrg' });
    if (ok) { setOrg(data.org); setRole(data.role); setRoles(data.roles || {}); setForm(data.org || {}); }
  }
  useEffect(() => { load(); }, []);
  if (!org) return null;

  const canEdit = role === 'exec' || role === 'dev';

  async function save() {
    setBusy(true);
    const { ok, data } = await apiPost('/api/auth', { action: 'updateOrg', patch: form });
    setBusy(false);
    if (ok) { setOrg(data.org); showToast('บันทึกข้อมูลบริษัทแล้ว'); }
  }
  async function regen() {
    if (!window.confirm('สร้างรหัสองค์กรใหม่? รหัสเดิมจะใช้ไม่ได้ทันที')) return;
    const { ok, data } = await apiPost('/api/auth', { action: 'regenOrgCode' });
    if (ok) { setOrg(data.org); showToast('สร้างรหัสใหม่แล้ว'); }
  }

  const F = [
    { k: 'name', label: 'ชื่อบริษัท/องค์กร', ph: 'บริษัท ครีมมี่ คอสเมท จำกัด' },
    { k: 'business', label: 'ทำธุรกิจอะไร (ยิ่งละเอียด AI ยิ่งช่วยได้ตรง)', ph: 'ผลิตและขายเครื่องสำอาง ทำคอนเทนต์ AI ลงโซเชียล มีทีม 5 คน', big: true },
    { k: 'address', label: 'ที่อยู่', ph: '99/1 หมู่ 5 ต.คลองหนึ่ง' },
    { k: 'province', label: 'อำเภอ/จังหวัด', ph: 'คลองหลวง ปทุมธานี' },
    { k: 'phone', label: 'เบอร์ติดต่อ', ph: '08x-xxx-xxxx' },
    { k: 'email', label: 'อีเมลบริษัท', ph: 'contact@company.com' },
    { k: 'taxId', label: 'เลขผู้เสียภาษี', ph: '0-1234-56789-01-2' },
    { k: 'website', label: 'เว็บไซต์/เพจ', ph: 'facebook.com/yourpage' },
  ];

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.cyan}44` }}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Landmark size={14} style={{ color: C.cyan }} />
          <span className="font-mono text-2xs tracking-widest" style={{ color: C.cyan }}>ข้อมูลบริษัท/องค์กร</span>
        </div>
        <span className="font-mono text-2xs px-2 py-0.5 rounded" style={{ color: C.violet, border: `1px solid ${C.violet}` }}>
          สิทธิ์ของคุณ: {roles[role]?.label || role}
        </span>
      </div>

      {/* รหัสชวนทีม */}
      {(role === 'exec' || role === 'dev') && org.code && (
        <div className="p-2.5 rounded-xl mb-3" style={{ background: C.bgDeep, border: `1px solid ${C.emerald}44` }}>
          <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>รหัสชวนทีมเข้าองค์กรนี้</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-xl font-bold" style={{ color: C.emerald, letterSpacing: 3 }}>{org.code}</span>
            <button onClick={() => { copyText(org.code); showToast('คัดลอกรหัสแล้ว'); }} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ border: `1px solid ${C.emerald}`, color: C.emerald }}>คัดลอก</button>
            <button onClick={regen} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>สร้างรหัสใหม่</button>
          </div>
          <p className="font-mono text-2xs mt-1.5" style={{ color: C.muted, fontSize: 10 }}>ให้ทีมเลือก "เข้าร่วมองค์กรเดิม" ตอนสมัคร แล้วกรอกรหัสนี้ — ข้อมูลจะแชร์กันภายในองค์กรเท่านั้น</p>
        </div>
      )}

      {canEdit ? (
        <>
          <div className="grid sm:grid-cols-2 gap-2 mb-2.5">
            {F.map((f) => (
              <div key={f.k} className={f.big ? 'sm:col-span-2' : ''}>
                <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>{f.label}</label>
                {f.big
                  ? <textarea value={form[f.k] || ''} onChange={(e) => setForm((v) => ({ ...v, [f.k]: e.target.value }))} rows={2} placeholder={f.ph} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
                  : <input value={form[f.k] || ''} onChange={(e) => setForm((v) => ({ ...v, [f.k]: e.target.value }))} placeholder={f.ph} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />}
              </div>
            ))}
          </div>
          <button onClick={save} disabled={busy} className="font-mono text-2xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.cyan, color: '#022', opacity: busy ? 0.6 : 1 }}>
            {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} บันทึกข้อมูลบริษัท
          </button>
          <p className="font-mono text-2xs mt-2" style={{ color: C.muted, fontSize: 10 }}>* ข้อมูลนี้ AI จะใช้ประกอบทุกแผนก เช่น คำนวณเงินเดือนตามค่าครองชีพจังหวัด และคิดแคมเปญให้ตรงธุรกิจ</p>
        </>
      ) : (
        <div className="space-y-1">
          {F.filter((f) => org[f.k]).map((f) => (
            <div key={f.k} className="font-body text-xs" style={{ color: C.text }}>
              <span style={{ color: C.muted }}>{f.label}: </span>{org[f.k]}
            </div>
          ))}
          <p className="font-mono text-2xs mt-2" style={{ color: C.muted, fontSize: 10 }}>* เฉพาะผู้บริหารขององค์กรเท่านั้นที่แก้ข้อมูลนี้ได้</p>
        </div>
      )}
    </div>
  );
}

function GeminiKeyPanel({ user, tokens, onSaved, showToast }) {
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const has = user.hasGeminiKey;

  async function save(remove) {
    setBusy(true); setErr('');
    const { ok, data } = await apiPost('/api/auth', { action: 'saveGeminiKey', key: remove ? '' : key.trim() });
    setBusy(false);
    if (!ok) { setErr(data.error || 'บันทึกไม่สำเร็จ'); return; }
    setKey('');
    showToast(remove ? 'ลบคีย์แล้ว — กลับมาใช้โทเค็นของระบบ' : 'บันทึกคีย์แล้ว ใช้ AI ได้ไม่จำกัดแล้ว');
    onSaved();
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${has ? C.emerald : C.orange}55` }}>
      <div className="flex items-center gap-2 mb-2">
        <KeyRound size={14} style={{ color: has ? C.emerald : C.orange }} />
        <span className="font-mono text-2xs tracking-widest" style={{ color: has ? C.emerald : C.orange }}>คีย์ AI ส่วนตัว</span>
        {has && <span className="font-mono text-2xs px-2 py-0.5 rounded" style={{ color: C.emerald, border: `1px solid ${C.emerald}` }}>ใช้งานอยู่ · ไม่จำกัด</span>}
      </div>

      {has ? (
        <>
          <p className="font-body text-xs mb-2.5 leading-relaxed" style={{ color: C.muted }}>
            คุณใช้คีย์ของตัวเองอยู่ — ใช้ AI ได้<b style={{ color: C.emerald }}>ไม่จำกัดโทเค็น</b> และไม่ต้องรอคิวร่วมกับคนอื่น
          </p>
          <button onClick={() => save(true)} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>ลบคีย์ออก</button>
        </>
      ) : (
        <>
          <div className="p-2.5 rounded-xl mb-2.5" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}>
            <p className="font-body text-xs leading-relaxed" style={{ color: C.text }}>
              <b>ใส่คีย์ของตัวเองแล้วได้อะไร:</b> ใช้ AI ได้ไม่จำกัด · ไม่ต้องรอคิวคนอื่น · ไม่เสียโทเค็น · <b>ฟรี ไม่ต้องผูกบัตร</b>
            </p>
          </div>
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <input value={key} onChange={(e) => setKey(e.target.value)} type="password" placeholder="วางคีย์ Gemini ที่นี่ (ขึ้นต้นด้วย AIza...)" className="flex-1 min-w-[180px] px-2.5 py-2 font-mono text-2xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
            <button onClick={() => save(false)} disabled={busy || !key.trim()} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1 shrink-0" style={{ background: BRAND, color: '#fff', opacity: (busy || !key.trim()) ? 0.5 : 1 }}>
              {busy ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />} ทดสอบ + บันทึก
            </button>
          </div>
          {err && <p className="font-mono text-2xs mb-2" style={{ color: C.red }}>{err}</p>}
          <button onClick={() => setShowGuide((v) => !v)} className="font-mono text-2xs" style={{ color: C.blue }}>
            {showGuide ? 'ซ่อนวิธีขอคีย์' : 'ยังไม่มีคีย์? ดูวิธีขอ (2 นาที ฟรี)'}
          </button>
          {showGuide && (
            <div className="mt-2 p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
              <ol className="space-y-1.5">
                {[
                  'เปิด aistudio.google.com/api-keys แล้วล็อกอินด้วยบัญชี Google',
                  'กดปุ่ม "Create API key" มุมขวาบน',
                  'เลือกโปรเจกต์ (หรือกดสร้างใหม่) แล้วกดยืนยัน',
                  'กดไอคอนคัดลอกคีย์ที่ได้',
                  'กลับมาวางในช่องด้านบน แล้วกด "ทดสอบ + บันทึก"',
                ].map((t, i) => (
                  <li key={i} className="font-body text-xs flex gap-2" style={{ color: C.text }}>
                    <span className="font-mono shrink-0 rounded-full flex items-center justify-center" style={{ width: 16, height: 16, background: C.blue, color: '#fff', fontSize: 9 }}>{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
              <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex font-mono text-2xs px-3 py-1.5 rounded-lg items-center gap-1" style={{ background: C.blue, color: '#fff' }}>
                <Share2 size={10} /> เปิดหน้าขอคีย์
              </a>
              <p className="font-mono text-2xs mt-2" style={{ color: C.muted, fontSize: 10 }}>* คีย์ถูกเก็บเข้ารหัสฝั่งเซิร์ฟเวอร์ ไม่แสดงกลับมาให้ใครเห็นอีก แม้แต่คุณเอง</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------- แถบโทเค็นคงเหลือ ----------
function TokenMeter({ tokens, compact }) {
  if (!tokens) return null;
  if (tokens.unlimited) {
    return <span className="font-mono text-2xs px-2 py-0.5 rounded" style={{ color: C.emerald, border: `1px solid ${C.emerald}` }}>ไม่จำกัด</span>;
  }
  const pct = tokens.quota ? Math.round((tokens.left / tokens.quota) * 100) : 0;
  const col = pct > 40 ? C.emerald : pct > 15 ? C.orange : C.red;
  if (compact) {
    return <span className="font-mono text-2xs" style={{ color: col }}>{tokens.left} โทเค็น</span>;
  }
  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Gauge size={14} style={{ color: col }} />
          <span className="font-mono text-2xs tracking-widest" style={{ color: col }}>โทเค็นคงเหลือ</span>
        </div>
        <span className="font-mono text-2xs" style={{ color: C.muted }}>แพ็ก {tokens.plan?.name} · เหลืออีก {tokens.daysLeft} วัน</span>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="font-display text-2xl font-bold leading-none" style={{ color: col }}>{tokens.left}</span>
        <span className="font-mono text-2xs mb-0.5" style={{ color: C.muted }}>/ {tokens.quota}</span>
      </div>
      <div style={{ width: '100%', height: 6, background: C.bgDeep, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${col}, ${col}99)`, transition: 'width .3s' }} />
      </div>
      {pct <= 20 && <p className="font-body text-xs mt-2" style={{ color: C.orange }}>โทเค็นใกล้หมด — ใส่คีย์ Gemini ของคุณเองด้านล่างเพื่อใช้ได้ไม่จำกัด (ฟรี)</p>}
    </div>
  );
}

// ---------- ขอความช่วยเหลือ / ขอโทเค็นเพิ่ม ----------
function HelpPanel({ tokens, showToast }) {
  const [kind, setKind] = useState('help');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState([]);

  async function load() {
    const { ok, data } = await apiPost('/api/auth', { action: 'myTickets' });
    if (ok) setMine(data.tickets || []);
  }
  useEffect(() => { load(); }, []);

  async function send() {
    if (!msg.trim()) return;
    setBusy(true);
    const { ok, data } = await apiPost('/api/auth', { action: 'submitTicket', kind, message: msg.trim() });
    setBusy(false);
    if (ok) { setMsg(''); showToast('ส่งคำขอแล้ว — ผู้ดูแลระบบจะเห็นทันที'); load(); }
    else showToast(data.error || 'ส่งไม่สำเร็จ');
  }

  const low = tokens && !tokens.unlimited && tokens.left <= tokens.quota * 0.2;

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${low ? C.orange : C.border}` }}>
      <div className="flex items-center gap-2 mb-2.5">
        <Mail size={14} style={{ color: low ? C.orange : C.blue }} />
        <span className="font-mono text-2xs tracking-widest" style={{ color: low ? C.orange : C.blue }}>ติดต่อผู้ดูแลระบบ</span>
      </div>
      {low && <p className="font-body text-xs mb-2 p-2 rounded-lg" style={{ color: C.orange, background: `${C.orange}12` }}>โทเค็นใกล้หมดแล้ว — ขอเพิ่มได้ที่นี่ หรือใส่คีย์ Gemini ของคุณเองเพื่อใช้ไม่จำกัด</p>}
      <div className="flex gap-1.5 mb-2">
        {[{ k: 'help', l: 'ขอความช่วยเหลือ' }, { k: 'tokens', l: 'ขอโทเค็นเพิ่ม' }].map((o) => (
          <button key={o.k} onClick={() => setKind(o.k)} className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ background: kind === o.k ? BRAND : 'transparent', color: kind === o.k ? '#fff' : C.muted, border: `1px solid ${kind === o.k ? 'transparent' : C.border}` }}>{o.l}</button>
        ))}
      </div>
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder={kind === 'tokens' ? 'บอกเหตุผลที่ต้องใช้เพิ่ม เช่น ทำคลิป 20 ชิ้นวันนี้' : 'ติดปัญหาอะไร บอกมาได้เลย'} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y mb-2" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
      <button onClick={send} disabled={busy || !msg.trim()} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: BRAND, color: '#fff', opacity: (busy || !msg.trim()) ? 0.5 : 1 }}>
        {busy ? <Loader2 size={11} className="animate-spin" /> : <Mail size={11} />} ส่งคำขอ
      </button>
      {mine.length > 0 && (
        <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
          {mine.map((t) => (
            <div key={t.id} className="p-2.5 rounded-lg" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-mono px-1.5 rounded" style={{ fontSize: 9, color: t.status === 'open' ? C.orange : C.emerald, border: `1px solid ${t.status === 'open' ? C.orange : C.emerald}` }}>{t.status === 'open' ? 'รอตอบ' : 'ตอบแล้ว'}</span>
                <span className="font-mono" style={{ fontSize: 10, color: C.muted }}>{new Date(t.at).toLocaleString('th-TH')}</span>
              </div>
              <p className="font-body text-xs" style={{ color: C.text }}>{t.message}</p>
              {t.reply && <p className="font-body text-xs mt-1 p-1.5 rounded" style={{ color: C.emerald, background: `${C.emerald}10` }}>ตอบกลับ: {t.reply}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- แผงเจ้าของระบบ: ผู้ใช้ / โทเค็น / งบการเงิน ----------
function OwnerConsole({ user, showToast, onFeaturesChanged }) {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState({});
  const [stats, setStats] = useState({});
  const [busy, setBusy] = useState(false);
  const [grant, setGrant] = useState({});
  const [gate, setGate] = useState(null);
  const [allowEmail, setAllowEmail] = useState('');
  const [codeNote, setCodeNote] = useState('');
  const [tickets, setTickets] = useState([]);
  const [feats, setFeats] = useState(null);
  const [featDefs, setFeatDefs] = useState(null);
  const [presence, setPresence] = useState({});
  const [feed, setFeed] = useState([]);
  const [newPw, setNewPw] = useState({});
  const [sec, setSec] = useState({});
  const [reply, setReply] = useState({});

  async function load() {
    const a = await apiPost('/api/auth', { action: 'adminUsers' });
    if (a.ok) { setUsers(a.data.users || []); setPlans(a.data.plans || {}); }
    const b = await apiPost('/api/auth', { action: 'adminUsage' });
    if (b.ok) setStats(b.data.stats || {});
    const g = await apiPost('/api/auth', { action: 'getGate' });
    if (g.ok) setGate(g.data.gate);
    const tk = await apiPost('/api/auth', { action: 'adminTickets' });
    if (tk.ok) setTickets(tk.data.tickets || []);
    const fe = await apiPost('/api/auth', { action: 'getFeatures' });
    if (fe.ok) { setFeats(fe.data.features); setFeatDefs(fe.data.defs); }
    const pr = await apiPost('/api/auth', { action: 'adminPresence' });
    if (pr.ok) { setPresence(pr.data.presence || {}); setFeed(pr.data.feed || []); }
    const sc = await apiPost('/api/auth', { action: 'getSecurity' });
    if (sc.ok) setSec(sc.data.security || {});
  }
  useEffect(() => { if (user.isOwner) load(); }, [user.isOwner]);
  if (!user.isOwner) return null;

  async function doGrant(email) {
    const amount = Number(grant[email] || 0);
    if (!amount) return;
    setBusy(true);
    const { ok } = await apiPost('/api/auth', { action: 'adminGrantTokens', email, amount });
    setBusy(false);
    if (ok) { showToast(`เติม ${amount} โทเค็นให้ ${email} แล้ว`); setGrant((g) => ({ ...g, [email]: '' })); load(); }
  }
  async function setPlan(email, plan) {
    const { ok } = await apiPost('/api/auth', { action: 'adminSetPlan', email, plan });
    if (ok) { showToast('เปลี่ยนแพ็กเกจแล้ว'); load(); }
  }
  async function suspend(email, val) {
    if (val && !window.confirm(`ระงับบัญชี ${email}?`)) return;
    const { ok } = await apiPost('/api/auth', { action: 'adminSuspend', email, suspended: val });
    if (ok) { showToast(val ? 'ระงับบัญชีแล้ว' : 'ปลดระงับแล้ว'); load(); }
  }

  // ---- งบการเงิน ----
  const revenue = users.reduce((sum, u) => sum + (plans[u.plan]?.price || 0), 0);
  const days = Object.keys(stats).sort();
  const last30 = days.slice(-30);
  const totalTokens30 = last30.reduce((sum, d) => sum + Object.values(stats[d] || {}).reduce((a, u) => a + u.total, 0), 0);
  // ประเมินต้นทุน: 1 โทเค็น ≈ 1 คำขอ AI ≈ 0.06 บาท (อิงราคา Gemini Flash แบบจ่ายเงิน)
  const COST_PER_TOKEN = 0.06;
  const aiCost = Math.round(totalTokens30 * COST_PER_TOKEN);
  const usersWithKey = users.filter((u) => u.hasKey).length;
  const profit = revenue - aiCost;
  const trendData = last30.map((d) => ({ d: d.slice(5), t: Object.values(stats[d] || {}).reduce((a, u) => a + u.total, 0) }));

  const openTickets = tickets.filter((t) => t.status === 'open').length;

  const online = Object.values(presence).filter((p) => Date.now() - p.at < 3 * 60 * 1000).length;
  const PAGE_LABEL = { daily: 'งานประจำวัน', calendar: 'ปฏิทิน', directory: 'Directory', platforms: 'แพลตฟอร์ม', analytics: 'ศูนย์วิเคราะห์', kpi: 'KPI', security: 'Protocol', settings: 'ตั้งค่า', team: 'ทีมงาน', profile: 'โปรไฟล์' };

  // รีเฟรชสถานะสดทุก 20 วินาที
  useEffect(() => {
    if (!user.isOwner) return;
    const id = setInterval(async () => {
      const pr = await apiPost('/api/auth', { action: 'adminPresence' });
      if (pr.ok) { setPresence(pr.data.presence || {}); setFeed(pr.data.feed || []); }
    }, 20000);
    return () => clearInterval(id);
  }, [user.isOwner]);

  async function resetPw(email) {
    const pw = newPw[email];
    if (!pw || pw.length < 8) { showToast('รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัว'); return; }
    const { ok, data } = await apiPost('/api/auth', { action: 'adminResetPassword', email, newPassword: pw });
    if (ok) { showToast(`ตั้งรหัสใหม่ให้ ${email} แล้ว — แจ้งเขาได้เลย`); setNewPw((n) => ({ ...n, [email]: '' })); }
    else showToast(data.error || 'ไม่สำเร็จ');
  }
  async function toggleOtpDisabled() {
    const { ok, data } = await apiPost('/api/auth', { action: 'updateSecurity', otpDisabled: !sec.otpDisabled });
    if (ok) { setSec(data.security); showToast(data.security.otpDisabled ? 'ปิดการยืนยันอีเมลทั้งระบบแล้ว' : 'เปิดการยืนยันอีเมลแล้ว'); }
  }

  async function toggleFeature(group, key, value) {
    const { ok, data } = await apiPost('/api/auth', { action: 'saveFeatures', group, key, value });
    if (ok) { setFeats(data.features); if (onFeaturesChanged) onFeaturesChanged(); }
  }
  async function toggleOtpExempt(email, exempt) {
    const { ok } = await apiPost('/api/auth', { action: 'adminSetOtpExempt', email, exempt });
    if (ok) { showToast(exempt ? 'ยกเว้นการยืนยันอีเมลแล้ว' : 'เปิดการยืนยันอีเมลแล้ว'); load(); }
  }

  async function replyTicket(id) {
    const { ok, data } = await apiPost('/api/auth', { action: 'adminReplyTicket', id, reply: reply[id] || '', status: 'closed' });
    if (ok) { setTickets(data.tickets || []); setReply((r) => ({ ...r, [id]: '' })); showToast('ตอบกลับแล้ว'); }
  }

  async function setGateMode(mode) {
    const { ok, data } = await apiPost('/api/auth', { action: 'saveGate', mode });
    if (ok) { setGate(data.gate); showToast(mode === 'open' ? 'เปิดให้ทุกคนเข้าใช้แล้ว' : mode === 'closed' ? 'ปิดเว็บแล้ว (คุณยังเข้าได้)' : 'เปิดเฉพาะคนที่ได้รับเชิญ'); }
  }
  async function setMax(n) {
    const { ok, data } = await apiPost('/api/auth', { action: 'saveGate', maxAccounts: n });
    if (ok) setGate(data.gate);
  }
  async function allow() {
    if (!allowEmail.trim()) return;
    const { ok, data } = await apiPost('/api/auth', { action: 'gateAllow', email: allowEmail.trim() });
    if (ok) { setGate(data.gate); setAllowEmail(''); showToast('เพิ่มรายชื่อแล้ว'); }
  }
  async function revoke(em) {
    const { ok, data } = await apiPost('/api/auth', { action: 'gateRevoke', email: em });
    if (ok) setGate(data.gate);
  }
  async function newCode() {
    const { ok, data } = await apiPost('/api/auth', { action: 'gateNewCode', note: codeNote });
    if (ok) { setGate(data.gate); setCodeNote(''); copyText(data.code); showToast(`สร้างรหัส ${data.code} และคัดลอกแล้ว`); }
  }
  async function delCode(code) {
    const { ok, data } = await apiPost('/api/auth', { action: 'gateDeleteCode', code });
    if (ok) setGate(data.gate);
  }

  const TABS = [
    { key: 'live', label: `สถานะสด${online ? ` (${online})` : ''}` },
    { key: 'features', label: 'เปิด/ปิดฟีเจอร์' },
    { key: 'tickets', label: `กล่องข้อความ${openTickets ? ` (${openTickets})` : ''}` },
    { key: 'gate', label: 'ล็อกเว็บ' },
    { key: 'users', label: `ผู้ใช้ (${users.length})` },
    { key: 'finance', label: 'งบการเงิน' },
    { key: 'usage', label: 'การใช้งานรายคน' },
  ];

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}55` }}>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <UserCog size={14} style={{ color: C.violet }} />
          <span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>ศูนย์ควบคุมเจ้าของระบบ</span>
        </div>
        <button onClick={load} className="font-mono text-2xs px-2 py-1 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${C.border}`, color: C.muted }}><RefreshCw size={10} /> รีเฟรช</button>
      </div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ background: tab === t.key ? C.violet : 'transparent', color: tab === t.key ? '#fff' : C.muted, border: `1px solid ${tab === t.key ? 'transparent' : C.border}` }}>{t.label}</button>
        ))}
      </div>

      {tab === 'live' && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <p className="font-body text-xs" style={{ color: C.muted }}>อัปเดตอัตโนมัติทุก 20 วินาที · ออนไลน์ตอนนี้ {online} คน</p>
          </div>
          <div className="space-y-1.5 mb-4">
            {Object.keys(presence).length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีใครใช้งาน</p> : (
              Object.entries(presence).sort((a, b) => b[1].at - a[1].at).map(([em, p]) => {
                const mins = Math.round((Date.now() - p.at) / 60000);
                const isOn = mins < 3;
                return (
                  <div key={em} className="flex items-center justify-between gap-2 p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${isOn ? C.emerald : C.border}` }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: isOn ? C.emerald : C.muted, boxShadow: isOn ? `0 0 6px ${C.emerald}` : 'none' }} />
                      <div className="min-w-0">
                        <div className="font-mono truncate" style={{ fontSize: 11, color: C.text }}>{em}</div>
                        <div className="font-mono" style={{ fontSize: 10, color: C.muted }}>{isOn ? `กำลังอยู่หน้า ${PAGE_LABEL[p.page] || p.page || '-'}` : `ออฟไลน์ ${mins < 60 ? `${mins} นาที` : `${Math.round(mins / 60)} ชม.`}ที่แล้ว`}</div>
                      </div>
                    </div>
                    {isOn && <span className="font-mono text-2xs shrink-0" style={{ color: C.emerald }}>ออนไลน์</span>}
                  </div>
                );
              })
            )}
          </div>
          <div className="font-mono text-2xs mb-2" style={{ color: C.blue }}>สิ่งที่ผู้ใช้ทำล่าสุด</div>
          {feed.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูล</p> : (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {feed.map((f, i) => (
                <div key={i} className="font-mono flex items-center gap-2 py-1" style={{ fontSize: 10, color: C.muted, borderBottom: `1px solid ${C.border}` }}>
                  <span className="shrink-0">{new Date(f.at).toLocaleTimeString('th-TH')}</span>
                  <span className="truncate" style={{ color: C.text }}>{f.email}</span>
                  <span className="truncate">{f.what}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'features' && (
        !feats || !featDefs ? <p className="font-body text-xs" style={{ color: C.muted }}>กำลังโหลด...</p> : (
          <div className="space-y-3">
            <p className="font-body text-xs leading-relaxed" style={{ color: C.muted }}>
              ปิดฟีเจอร์ไหน ผู้ใช้จะไม่เห็นเมนูนั้นเลย — <b style={{ color: C.violet }}>คุณในฐานะเจ้าของระบบเห็นทุกอย่างเสมอ</b> ไม่ว่าปิดหรือเปิด
            </p>
            {[
              { g: 'pages', title: 'หน้าหลัก (เมนูซ้าย)', col: C.blue },
              { g: 'analyticsTabs', title: 'แท็บในหน้าวิเคราะห์', col: C.emerald },
              { g: 'departments', title: 'แผนกใน Directory', col: C.orange },
            ].map((sec) => (
              <div key={sec.g} className="p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs mb-2" style={{ color: sec.col }}>{sec.title}</div>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {Object.entries(featDefs[sec.g] || {}).map(([k, def]) => {
                    const val = feats[sec.g]?.[k] !== false;
                    return (
                      <button key={k} onClick={() => toggleFeature(sec.g, k, !val)} className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg" style={{ background: val ? `${sec.col}12` : 'transparent', border: `1px solid ${val ? sec.col : C.border}` }}>
                        <span className="font-body text-xs truncate" style={{ color: val ? C.text : C.muted }}>{def.label}</span>
                        <span className="shrink-0 rounded-full relative" style={{ width: 30, height: 16, background: val ? sec.col : C.border }}>
                          <span className="absolute rounded-full" style={{ top: 2, left: val ? 16 : 2, width: 12, height: 12, background: '#fff', transition: 'left .15s' }} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'tickets' && (
        tickets.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อความ</p> : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tickets.map((t) => (
              <div key={t.id} className="p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${t.status === 'open' ? C.orange : C.border}` }}>
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="font-mono px-1.5 rounded" style={{ fontSize: 9, color: t.kind === 'tokens' ? C.violet : C.blue, border: `1px solid ${t.kind === 'tokens' ? C.violet : C.blue}` }}>{t.kind === 'tokens' ? 'ขอโทเค็น' : 'ขอความช่วยเหลือ'}</span>
                  <span className="font-body text-xs" style={{ color: C.text }}>{t.name}</span>
                  <span className="font-mono" style={{ fontSize: 10, color: C.muted }}>{t.email} · {new Date(t.at).toLocaleString('th-TH')}</span>
                </div>
                <p className="font-body text-xs mb-2" style={{ color: C.text }}>{t.message}</p>
                {t.reply ? (
                  <p className="font-body text-xs p-1.5 rounded" style={{ color: C.emerald, background: `${C.emerald}10` }}>คุณตอบ: {t.reply}</p>
                ) : (
                  <div className="flex gap-1.5 flex-wrap">
                    <input value={reply[t.id] || ''} onChange={(e) => setReply((r) => ({ ...r, [t.id]: e.target.value }))} placeholder="ตอบกลับ..." className="flex-1 min-w-[140px] px-2 py-1.5 font-body text-xs outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }} />
                    <button onClick={() => replyTicket(t.id)} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ background: C.emerald, color: '#062' }}>ตอบ + ปิด</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'gate' && (
        gate == null ? <p className="font-body text-xs" style={{ color: C.muted }}>กำลังโหลด...</p> : (
          <div>
            <p className="font-body text-xs mb-2.5 leading-relaxed" style={{ color: C.muted }}>คุมว่าใครเข้าเว็บได้ — คุณในฐานะเจ้าของระบบเข้าได้เสมอไม่ว่าตั้งค่าแบบไหน</p>
            <div className="grid sm:grid-cols-3 gap-2 mb-3">
              {[
                { k: 'open', label: 'เปิดทุกคน', desc: 'ใครก็สมัครเข้าใช้ได้', col: C.emerald },
                { k: 'invite', label: 'เฉพาะคนที่เชิญ', desc: 'ต้องอยู่ในรายชื่อหรือมีรหัสเชิญ', col: C.orange },
                { k: 'closed', label: 'ปิดเว็บ', desc: 'ไม่มีใครเข้าได้เลย', col: C.red },
              ].map((m) => (
                <button key={m.k} onClick={() => setGateMode(m.k)} className="p-3 rounded-xl text-left" style={{ background: gate.mode === m.k ? `${m.col}18` : C.bgDeep, border: `1.5px solid ${gate.mode === m.k ? m.col : C.border}` }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {gate.mode === m.k ? <CheckCircle2 size={13} style={{ color: m.col }} /> : <Square size={13} style={{ color: C.muted }} />}
                    <span className="font-body text-xs" style={{ color: gate.mode === m.k ? m.col : C.text }}>{m.label}</span>
                  </div>
                  <p className="font-body" style={{ fontSize: 10, color: C.muted }}>{m.desc}</p>
                </button>
              ))}
            </div>

            {/* ปิดยืนยันอีเมลทั้งระบบ — ใช้ตอนยังไม่ได้ยืนยันโดเมนกับผู้ให้บริการอีเมล */}
            <div className="p-3 rounded-xl mb-3" style={{ background: sec.otpDisabled ? `${C.orange}12` : C.bgDeep, border: `1px solid ${sec.otpDisabled ? C.orange : C.border}` }}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-body text-xs" style={{ color: sec.otpDisabled ? C.orange : C.text }}>ปิดการยืนยันรหัสทางอีเมลทั้งระบบ</div>
                  <p className="font-body" style={{ fontSize: 10, color: C.muted }}>เปิดสวิตช์นี้ถ้ายังไม่ได้ยืนยันโดเมนกับผู้ให้บริการอีเมล — ผู้ใช้จะล็อกอินด้วยรหัสผ่านอย่างเดียว</p>
                </div>
                <button onClick={toggleOtpDisabled} className="shrink-0 rounded-full relative" style={{ width: 38, height: 20, background: sec.otpDisabled ? C.orange : C.border }}>
                  <span className="absolute rounded-full" style={{ top: 2, left: sec.otpDisabled ? 20 : 2, width: 16, height: 16, background: '#fff', transition: 'left .15s' }} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-mono text-2xs" style={{ color: C.muted }}>รับสมาชิกสูงสุด</span>
              <input type="number" value={gate.maxAccounts} onChange={(e) => setMax(Number(e.target.value))} className="font-mono text-2xs px-2 py-1 rounded outline-none" style={{ width: 70, background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
              <span className="font-mono text-2xs" style={{ color: C.muted }}>บัญชี (ตอนนี้ {users.length})</span>
            </div>

            {gate.mode === 'invite' && (
              <>
                <div className="p-3 rounded-xl mb-2.5" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="font-mono text-2xs mb-2" style={{ color: C.emerald }}>รายชื่ออีเมลที่อนุญาต ({gate.allowList.length})</div>
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    <input value={allowEmail} onChange={(e) => setAllowEmail(e.target.value)} placeholder="อีเมลที่จะให้เข้าใช้" className="flex-1 min-w-[160px] px-2 py-1.5 font-mono text-2xs outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }} />
                    <button onClick={allow} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ background: C.emerald, color: '#062' }}>เพิ่ม</button>
                  </div>
                  {gate.allowList.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีรายชื่อ</p> : (
                    <div className="space-y-1">
                      {gate.allowList.map((em) => (
                        <div key={em} className="flex items-center justify-between gap-2 py-1">
                          <span className="font-mono truncate" style={{ fontSize: 10, color: C.text }}>{em}</span>
                          <button onClick={() => revoke(em)} style={{ color: C.muted }} className="shrink-0"><X size={11} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="font-mono text-2xs mb-2" style={{ color: C.violet }}>รหัสเชิญ (ใช้ได้ครั้งเดียวต่อรหัส)</div>
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    <input value={codeNote} onChange={(e) => setCodeNote(e.target.value)} placeholder="โน้ต เช่น ให้พี่เอ" className="flex-1 min-w-[140px] px-2 py-1.5 font-mono text-2xs outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }} />
                    <button onClick={newCode} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.violet, color: '#fff' }}><Plus size={11} /> สร้างรหัส</button>
                  </div>
                  {gate.inviteCodes.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีรหัส</p> : (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {gate.inviteCodes.slice().reverse().map((c) => (
                        <div key={c.code} className="flex items-center justify-between gap-2 py-1">
                          <div className="min-w-0">
                            <span className="font-mono" style={{ fontSize: 11, color: c.usedBy ? C.muted : C.violet, textDecoration: c.usedBy ? 'line-through' : 'none' }}>{c.code}</span>
                            <span className="font-mono ml-1.5" style={{ fontSize: 9, color: C.muted }}>{c.usedBy ? `ใช้แล้วโดย ${c.usedBy}` : (c.note || 'ยังไม่ถูกใช้')}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!c.usedBy && <button onClick={() => { copyText(c.code); showToast('คัดลอกรหัสแล้ว'); }} className="font-mono" style={{ fontSize: 9, color: C.blue }}>คัดลอก</button>}
                            <button onClick={() => delCode(c.code)} style={{ color: C.muted }}><X size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {users.map((u) => {
            const tk = u.tokens || {};
            const pct = tk.unlimited ? 100 : (tk.quota ? Math.round((tk.left / tk.quota) * 100) : 0);
            const col = tk.unlimited ? C.emerald : pct > 40 ? C.emerald : pct > 15 ? C.orange : C.red;
            return (
              <div key={u.email} className="p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${u.suspended ? C.red : C.border}` }}>
                <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-body text-xs flex items-center gap-1.5" style={{ color: C.text }}>
                      {u.name} {u.isOwner && <span className="font-mono px-1.5 rounded" style={{ fontSize: 9, color: C.violet, border: `1px solid ${C.violet}` }}>เจ้าของ</span>}
                      {u.hasKey && <span className="font-mono px-1.5 rounded" style={{ fontSize: 9, color: C.emerald, border: `1px solid ${C.emerald}` }}>มีคีย์เอง</span>}
                      {u.suspended && <span className="font-mono px-1.5 rounded" style={{ fontSize: 9, color: C.red, border: `1px solid ${C.red}` }}>ถูกระงับ</span>}
                    </div>
                    <div className="font-mono truncate" style={{ fontSize: 10, color: C.muted }}>{u.email} · เข้าล่าสุด {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('th-TH') : '-'}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs" style={{ color: col }}>{tk.unlimited ? 'ไม่จำกัด' : `${tk.left}/${tk.quota}`}</div>
                    <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>ใช้ไป {tk.used || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select value={u.isOwner ? 'owner' : (u.plan || 'trial')} onChange={(e) => setPlan(u.email, e.target.value)} disabled={u.isOwner} className="font-mono text-2xs px-2 py-1 rounded outline-none" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }}>
                    {Object.entries(plans).map(([k, p]) => <option key={k} value={k}>{p.name}{p.price ? ` (${p.price}฿)` : ''}</option>)}
                  </select>
                  <input value={grant[u.email] || ''} onChange={(e) => setGrant((g) => ({ ...g, [u.email]: e.target.value }))} placeholder="เติมโทเค็น" type="number" className="font-mono text-2xs px-2 py-1 rounded outline-none" style={{ width: 88, background: C.panel, color: C.text, border: `1px solid ${C.border}` }} />
                  <button onClick={() => doGrant(u.email)} disabled={busy} className="font-mono text-2xs px-2 py-1 rounded" style={{ background: C.emerald, color: '#062' }}>เติม</button>
                  {!u.isOwner && (
                    <>
                      <input value={newPw[u.email] || ''} onChange={(e) => setNewPw((n) => ({ ...n, [u.email]: e.target.value }))} placeholder="ตั้งรหัสใหม่" className="font-mono text-2xs px-2 py-1 rounded outline-none" style={{ width: 110, background: C.panel, color: C.text, border: `1px solid ${C.border}` }} />
                      <button onClick={() => resetPw(u.email)} className="font-mono text-2xs px-2 py-1 rounded" style={{ border: `1px solid ${C.violet}`, color: C.violet }}>ตั้งรหัสใหม่</button>
                    </>
                  )}
                  {!u.isOwner && (
                    <button onClick={() => toggleOtpExempt(u.email, !u.otpExempt)} title="ถ้าอีเมลส่งไม่ถึง ให้ยกเว้นการยืนยันอีเมลชั่วคราว" className="font-mono text-2xs px-2 py-1 rounded" style={{ border: `1px solid ${u.otpExempt ? C.orange : C.border}`, color: u.otpExempt ? C.orange : C.muted }}>
                      {u.otpExempt ? 'ยกเว้น OTP อยู่' : 'ยกเว้น OTP'}
                    </button>
                  )}
                  {!u.isOwner && (
                    <button onClick={() => suspend(u.email, !u.suspended)} className="font-mono text-2xs px-2 py-1 rounded" style={{ border: `1px solid ${u.suspended ? C.emerald : C.red}`, color: u.suspended ? C.emerald : C.red }}>
                      {u.suspended ? 'ปลดระงับ' : 'ระงับ'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'finance' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <StatCard label="รายได้/เดือน" value={`${revenue}฿`} sub={`${users.filter((u) => (plans[u.plan]?.price || 0) > 0).length} บัญชีจ่ายเงิน`} color={C.emerald} Icon={Award} />
            <StatCard label="ต้นทุน AI (30 วัน)" value={`~${aiCost}฿`} sub={`${totalTokens30} โทเค็น`} color={C.orange} Icon={Gauge} />
            <StatCard label="กำไรโดยประมาณ" value={`${profit}฿`} sub={profit >= 0 ? 'เป็นบวก' : 'ขาดทุน'} color={profit >= 0 ? C.emerald : C.red} Icon={TrendingUp} />
            <StatCard label="ใช้คีย์ตัวเอง" value={`${usersWithKey}/${users.length}`} sub="ยิ่งเยอะ ต้นทุนยิ่งต่ำ" color={C.cyan} Icon={KeyRound} />
          </div>
          {trendData.length > 1 && (
            <div className="p-3 rounded-xl mb-2" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
              <div className="font-mono text-2xs mb-2" style={{ color: C.blue }}>โทเค็นที่ใช้รายวัน</div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={trendData}>
                  <XAxis dataKey="d" tick={{ fill: C.muted, fontSize: 9 }} />
                  <YAxis tick={{ fill: C.muted, fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                  <Bar dataKey="t" name="โทเค็น" fill={C.blue} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="font-mono text-2xs" style={{ color: C.muted, fontSize: 10 }}>
            * ต้นทุน AI ประเมินที่ {COST_PER_TOKEN} บาท/โทเค็น (อิงราคา Gemini Flash แบบจ่ายเงิน) — ผู้ใช้ที่ใส่คีย์เองไม่คิดต้นทุนฝั่งเรา
          </p>
        </div>
      )}

      {tab === 'usage' && (
        days.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูลการใช้งาน</p> : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {days.slice().reverse().slice(0, 14).map((d) => (
              <div key={d} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs mb-1.5" style={{ color: C.blue }}>{d}</div>
                {Object.entries(stats[d]).map(([em, v]) => (
                  <div key={em} className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-mono truncate" style={{ fontSize: 10, color: C.text }}>{em}</span>
                    <span className="font-mono shrink-0" style={{ fontSize: 10, color: C.muted }}>
                      {v.total} · {Object.entries(v.actions).map(([a, n]) => `${a}:${n}`).join(' ')}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function TrashPanel({ trash, onRestore, onPurge, onEmpty }) {
  const items = (trash || []).filter((t) => Date.now() - t.at < TRASH_TTL_MS);
  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Trash size={14} style={{ color: C.orange }} />
          <span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>ถังขยะ ({items.length})</span>
        </div>
        {items.length > 0 && (
          <button onClick={onEmpty} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ border: `1px solid ${C.red}`, color: C.red }}>ล้างถังขยะ</button>
        )}
      </div>
      <p className="font-body text-xs mb-2.5 leading-relaxed" style={{ color: C.muted }}>ของที่ลบจะเก็บไว้ 30 วันก่อนหายถาวร กดกู้คืนได้ตลอดในช่วงนี้</p>
      {items.length === 0 ? (
        <p className="font-body text-xs" style={{ color: C.muted }}>ถังขยะว่าง</p>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {items.slice().reverse().map((it) => {
            const daysLeft = Math.ceil((TRASH_TTL_MS - (Date.now() - it.at)) / 86400000);
            return (
              <div key={it.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <div className="min-w-0">
                  <div className="font-body text-xs truncate" style={{ color: C.text }}>
                    {it.kind === 'channel' ? '📁 ช่อง: ' : '📄 งาน: '}{it.label}
                  </div>
                  <div className="font-mono text-2xs" style={{ color: C.muted, fontSize: 10 }}>
                    ลบเมื่อ {new Date(it.at).toLocaleDateString('th-TH')} · เหลืออีก {daysLeft} วัน
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onRestore(it.id)} title="กู้คืน" className="font-mono text-2xs px-2 py-1 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${C.emerald}`, color: C.emerald }}>
                    <RotateCcw size={10} /> กู้คืน
                  </button>
                  <button onClick={() => onPurge(it.id)} title="ลบถาวร" style={{ color: C.muted }}><X size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- ตรวจสุขภาพระบบ ----------
function HealthCheckPanel({ user, channels, tasks, history, futureTasks, loadOk, onFixOrphans, onBackupNow }) {
  const [checks, setChecks] = useState(null);
  const [running, setRunning] = useState(false);

  async function runChecks() {
    setRunning(true);
    const out = [];
    const add = (name, ok, detail, warn, fix) => out.push({ name, ok, detail, warn, fix });

    add('เชื่อมต่อฐานข้อมูล', loadOk, loadOk ? 'อ่านข้อมูลได้ปกติ' : 'โหลดข้อมูลไม่สำเร็จ — อย่าเพิ่งแก้ไขอะไร');

    // โทเค็นยังใช้ได้ไหม
    try {
      const { ok } = await apiPost('/api/auth', { action: 'me' });
      add('สถานะการล็อกอิน', ok, ok ? 'โทเค็นใช้งานได้' : 'โทเค็นหมดอายุ ต้องล็อกอินใหม่');
    } catch (e) { add('สถานะการล็อกอิน', false, 'ตรวจไม่สำเร็จ'); }

    // มีชุดสำรองไหม
    try {
      const { data } = await apiPost('/api/auth', { action: 'listBackups' });
      const n = (data.backups || []).length;
      const noData = channels.length === 0;
      add('ชุดสำรองข้อมูล', n > 0 || noData,
        n > 0 ? `มี ${n} ชุด (ล่าสุด ${data.backups[data.backups.length - 1]})`
              : (noData ? 'ยังไม่มีข้อมูลให้สำรอง — สร้างช่องก่อน แล้วระบบจะสำรองให้เองทุกวัน' : 'ยังไม่มีชุดสำรอง — กดปุ่มด้านล่าง'),
        noData && n === 0 ? 'ยังไม่มีข้อมูลให้สำรอง (ไม่ใช่ปัญหา)' : null,
        (!noData && n === 0) ? 'backup' : null);
    } catch (e) { add('ชุดสำรองข้อมูล', false, 'ตรวจไม่สำเร็จ'); }

    // งานที่ไม่มีช่องรองรับ (ข้อมูลกำพร้า)
    const ids = new Set(channels.map((c) => c.id));
    const orphan = tasks.filter((t) => !ids.has(t.channelId)).length;
    add('ความสมบูรณ์ของข้อมูล', orphan === 0, orphan === 0 ? 'ไม่พบงานกำพร้า' : `พบงาน ${orphan} ชิ้นที่ไม่มีช่องรองรับ (เกิดจากลบช่องแล้วงานค้างอยู่)`, null, orphan > 0 ? 'orphan' : null);

    // งาน id ซ้ำ
    const seen = new Set(); let dup = 0;
    tasks.forEach((t) => { if (seen.has(t.id)) dup++; seen.add(t.id); });
    add('รหัสงานไม่ซ้ำ', dup === 0, dup === 0 ? 'ไม่พบรหัสซ้ำ' : `พบรหัสซ้ำ ${dup} รายการ`);

    // ขนาดข้อมูล
    const bytes = new Blob([JSON.stringify({ channels, tasks, history, futureTasks })]).size;
    const mb = bytes / 1024 / 1024;
    add('ขนาดข้อมูล', mb < 4, `${mb.toFixed(2)} MB`, mb >= 2 && mb < 4 ? 'เริ่มใหญ่ ควรล้างประวัติเก่า' : null);

    // AI ใช้งานได้ไหม
    try {
      await callClaude('ตอบสั้นๆ ว่า OK', 'ping', undefined, 'other');
      add('เชื่อมต่อ AI (Gemini)', true, 'เรียกใช้งานได้ปกติ');
    } catch (e) {
      const rate = /ถี่เกินไป|quota|rate/i.test(e.message || '');
      add('เชื่อมต่อ AI (Gemini)', rate, rate ? 'ใช้งานได้ แต่ตอนนี้ชนลิมิตชั่วคราว' : `เรียกไม่สำเร็จ: ${e.message || ''}`);
    }

    setChecks(out);
    setRunning(false);
  }

  const failed = checks ? checks.filter((c) => !c.ok).length : 0;

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: C.cyan }} />
          <span className="font-mono text-2xs tracking-widest" style={{ color: C.cyan }}>ตรวจสุขภาพระบบ</span>
        </div>
        <button onClick={runChecks} disabled={running} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: BRAND, color: '#fff', opacity: running ? 0.6 : 1 }}>
          {running ? <Loader2 size={11} className="animate-spin" /> : <Activity size={11} />} เริ่มตรวจ
        </button>
      </div>
      <p className="font-body text-xs mb-2.5 leading-relaxed" style={{ color: C.muted }}>ตรวจว่าระบบทำงานครบทุกส่วนหรือไม่ — ควรกดทุกครั้งหลังอัปเดตเว็บ</p>
      {!checks ? (
        <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่ได้ตรวจ</p>
      ) : (
        <>
          <div className="mb-2 font-mono text-2xs" style={{ color: failed === 0 ? C.emerald : C.red }}>
            {failed === 0 ? '✓ ผ่านทั้งหมด ระบบพร้อมใช้งาน' : `พบปัญหา ${failed} รายการ`}
          </div>
          <div className="space-y-1">
            {checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                {c.ok ? <CheckCircle2 size={13} style={{ color: c.warn ? C.orange : C.emerald }} className="shrink-0 mt-0.5" /> : <XCircle size={13} style={{ color: C.red }} className="shrink-0 mt-0.5" />}
                <div className="min-w-0 flex-1">
                  <div className="font-body text-xs" style={{ color: C.text }}>{c.name}</div>
                  <div className="font-mono text-2xs" style={{ color: c.warn ? C.orange : C.muted, fontSize: 10 }}>{c.warn || c.detail}</div>
                  {c.fix === 'orphan' && (
                    <button onClick={async () => { await onFixOrphans(); runChecks(); }} className="mt-1 font-mono text-2xs px-2 py-1 rounded-lg" style={{ border: `1px solid ${C.emerald}`, color: C.emerald }}>ลบงานกำพร้าทิ้ง</button>
                  )}
                  {c.fix === 'backup' && (
                    <button onClick={async () => { await onBackupNow(); runChecks(); }} className="mt-1 font-mono text-2xs px-2 py-1 rounded-lg" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>สำรองเดี๋ยวนี้</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SettingsPage({ user, accounts, backupData, onImportBackup, tokens, refreshMe, showToast, onFixOrphans, onBackupNow, trash, onRestoreTrash, onPurgeTrash, onEmptyTrash, channels, tasks, history, futureTasks, loadOk }) {
  const [importMsg, setImportMsg] = useState('');
  const [importing, setImporting] = useState(false);

  function exportBackup() {
    const payload = { exportedAt: new Date().toISOString(), version: 1, ...backupData };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-backup-${todayDateStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function handleImport(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setImporting(true);
    setImportMsg('');
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || !Array.isArray(data.channels)) {
        setImportMsg('ไฟล์นี้ไม่ใช่ไฟล์สำรองของ FORGE');
      } else if (window.confirm('การกู้คืนจะเขียนทับข้อมูลปัจจุบันทั้งหมด (ช่อง งาน ประวัติ) ยืนยันหรือไม่?')) {
        await onImportBackup(data);
        setImportMsg('กู้คืนข้อมูลสำเร็จแล้ว');
      }
    } catch (err) {
      setImportMsg('อ่านไฟล์ไม่สำเร็จ — ไฟล์อาจเสียหาย');
    }
    setImporting(false);
    setTimeout(() => setImportMsg(''), 5000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><SettingsIcon size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>SETTINGS</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>การตั้งค่า</h2>
      <p className="font-body text-xs mb-6" style={{ color: C.muted }}>ตั้งค่าและเครื่องมือดูแลระบบ</p>

      <OwnerConsole user={user} showToast={showToast} onFeaturesChanged={refreshMe} />
      <CompanyPanel user={user} showToast={showToast} />
      <TokenMeter tokens={tokens} />
      <GeminiKeyPanel user={user} tokens={tokens} onSaved={refreshMe} showToast={showToast} />
      <HelpPanel tokens={tokens} showToast={showToast} />
      {user.isOwner && <HealthCheckPanel user={user} channels={channels} tasks={tasks} history={history} futureTasks={futureTasks} loadOk={loadOk} onFixOrphans={onFixOrphans} onBackupNow={onBackupNow} />}
      <TrashPanel trash={trash} onRestore={onRestoreTrash} onPurge={onPurgeTrash} onEmpty={onEmptyTrash} />

      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-3"><Download size={14} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>สำรอง / กู้คืนข้อมูล</span></div>
        <p className="font-body text-xs mb-3 leading-relaxed" style={{ color: C.muted }}>ข้อมูลทั้งหมด (ช่อง งานประจำวัน งานที่เตรียมล่วงหน้า ประวัติย้อนหลัง) เก็บอยู่บนฐานข้อมูลออนไลน์ที่เดียว แนะนำให้ดาวน์โหลดไฟล์สำรองเก็บไว้เป็นระยะ เผื่อข้อมูลมีปัญหาจะได้กู้คืนได้</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportBackup} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: BRAND, color: '#fff' }}>
            <Download size={12} /> ดาวน์โหลดไฟล์สำรอง
          </button>
          <label className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg cursor-pointer" style={{ border: `1px solid ${C.orange}`, color: C.orange, opacity: importing ? 0.6 : 1 }}>
            {importing ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} กู้คืนจากไฟล์สำรอง
            <input type="file" accept="application/json,.json" onChange={handleImport} className="hidden" disabled={importing} />
          </label>
        </div>
        {importMsg && <p className="font-mono text-2xs mt-2" style={{ color: importMsg.includes('สำเร็จ') ? C.emerald : C.red }}>{importMsg}</p>}
      </div>

      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-3"><KeyRound size={14} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>คีย์ลัด</span></div>
        <div className="space-y-1.5">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center gap-3">
              <span className="font-mono text-2xs px-2 py-0.5 rounded-md shrink-0" style={{ border: `1px solid ${C.border}`, color: C.text }}>{s.keys}</span>
              <span className="font-body text-xs" style={{ color: C.muted }}>{s.action}</span>
            </div>
          ))}
        </div>
        <p className="font-mono text-2xs mt-3 leading-relaxed" style={{ color: C.muted }}>* คีย์ตัวเลข/ตัวอักษรใช้ได้เมื่อไม่ได้พิมพ์อยู่ในช่องกรอกข้อความ ส่วน Undo/Redo ใช้ได้ทุกที่ (ยกเว้นตอนพิมพ์ ระบบจะปล่อยให้ช่องข้อความจัดการเอง)</p>
      </div>

      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-2"><Lock size={14} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>การจำการเข้าสู่ระบบ</span></div>
        <p className="font-body text-xs leading-relaxed" style={{ color: C.muted }}>ตอนนี้ระบบจำการเข้าสู่ระบบไว้ 7 วัน รีเฟรชหน้าแล้วไม่ต้องล็อกอินใหม่ · ถ้าใช้เครื่องร่วมกับคนอื่น ให้กด "ออกจากระบบ" ทุกครั้งหลังใช้เสร็จ เพราะการจำนี้ผูกกับเครื่องนั้นๆ</p>
      </div>

      <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-3"><Users size={14} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>ประวัติการเข้าสู่ระบบ</span></div>
        {accounts.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูล</p> : (
          <div className="space-y-2">
            {[...accounts].sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0)).map((a) => (
              <div key={a.email} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-body text-xs truncate block" style={{ color: C.text }}>{a.name} {user.email === a.email && <span style={{ color: C.blue }}>(คุณ)</span>}</span>
                  <span className="font-mono text-2xs truncate block" style={{ color: C.muted }}>@{a.username}</span>
                </div>
                <span className="font-mono text-2xs shrink-0" style={{ color: C.muted }}>{daysAgoLabel(a.lastLogin)}</span>
              </div>
            ))}
          </div>
        )}
        <p className="font-mono text-2xs mt-3 leading-relaxed" style={{ color: C.muted }}>* แสดงเวลาล็อกอินล่าสุดต่อบัญชี ระบบยังไม่ได้เก็บแยกเป็นรายอุปกรณ์/รายครั้ง</p>
      </div>
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
    <div className="p-2 mt-2 rounded-xl" style={{ border: `1px solid ${verdict.passed ? C.emerald : C.red}`, background: verdict.passed ? `${C.emerald}11` : `${C.red}11` }}>
      <div className="flex items-center gap-2 mb-1">
        {verdict.passed ? <CheckCircle2 size={13} style={{ color: C.emerald }} /> : <XCircle size={13} style={{ color: C.red }} />}
        <span className="font-mono text-2xs" style={{ color: verdict.passed ? C.emerald : C.red }}>{verdict.passed ? 'QC ผ่าน' : 'QC ให้แก้ไข'}</span>
      </div>
      <p className="font-body text-xs whitespace-pre-wrap" style={{ color: C.muted }}>{verdict.text}</p>
    </div>
  );
}

// ---------- ปุ่มส่ง Prompt ไปเครื่องมือ AI ภายนอก ----------
// คัดลอก prompt ให้อัตโนมัติ แล้วเปิดแท็บเครื่องมือที่เลือก เหลือแค่วาง (⌘V / Ctrl+V) แล้ว Enter
// หมายเหตุ: ChatGPT รองรับการส่งข้อความไปในลิงก์ได้เลย (?q=) ส่วน Meta AI กับ Google Flow ต้องวางเอง
const AI_TOOLS = {
  meta: { label: 'Meta AI', url: () => 'https://www.meta.ai/', color: '#4A9DFF', prefill: false },
  chatgpt: { label: 'ChatGPT', url: (text) => `https://chatgpt.com/?q=${encodeURIComponent(text.slice(0, 3000))}`, color: '#10A37F', prefill: true },
  flow: { label: 'Google Flow', url: () => 'https://labs.google/fx/tools/flow', color: '#F5A623', prefill: false },
};

function SendToTools({ text, tools, onSent }) {
  const [msg, setMsg] = useState('');
  if (!text) return null;

  function send(key) {
    const tool = AI_TOOLS[key];
    // เปิดแท็บทันทีตอนกดปุ่ม (ถ้ารอ clipboard ก่อน เบราว์เซอร์จะบล็อกป๊อปอัป)
    const win = window.open(tool.url(text), '_blank', 'noopener,noreferrer');
    if (!win) setMsg('เบราว์เซอร์บล็อกการเปิดแท็บ — อนุญาตป๊อปอัปของเว็บนี้ก่อน');
    copyText(text).then((ok) => {
      if (onSent) onSent();
      if (win) setMsg(ok ? (tool.prefill ? `เปิด ${tool.label} แล้ว (ใส่ prompt ให้ในช่องแล้ว)` : `คัดลอกแล้ว — วางใน ${tool.label} ได้เลย (⌘V)`) : `เปิด ${tool.label} แล้ว แต่คัดลอกไม่สำเร็จ`);
      setTimeout(() => setMsg(''), 3500);
    });
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-mono text-2xs" style={{ color: C.muted }}>ส่งไปสร้างที่:</span>
        {tools.map((key) => {
          const tool = AI_TOOLS[key];
          return (
            <button key={key} onClick={() => send(key)} className="font-mono text-2xs px-2 py-1 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${tool.color}`, color: tool.color }}>
              <Share2 size={10} /> {tool.label}
            </button>
          );
        })}
      </div>
      {msg && <p className="font-mono text-2xs mt-1" style={{ color: C.emerald }}>{msg}</p>}
    </div>
  );
}

function PromptBox({ label, color, value, copied, made, onCopiedChange, onMadeChange, tools }) {
  const [copyMsg, setCopyMsg] = useState('');
  if (!value) return null;
  function copyText() {
    navigator.clipboard.writeText(value).then(() => {
      onCopiedChange(true);
      setCopyMsg('คัดลอกแล้ว ✓');
      setTimeout(() => setCopyMsg(''), 1500);
    }).catch(() => {});
  }
  return (
    <div className="p-2.5 rounded-xl mt-2" style={{ background: C.bgDeep, border: `1px solid ${color}` }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-2xs" style={{ color }}>{label}</span>
        <button onClick={copyText} className="font-mono text-2xs px-2 py-1 rounded-lg shrink-0" style={{ border: `1px solid ${color}`, color }}>{copyMsg || 'คัดลอก'}</button>
      </div>
      <p className="font-body text-xs whitespace-pre-wrap mb-2" style={{ color: C.text }}>{value}</p>
      <SendToTools text={value} tools={tools || ['meta', 'chatgpt']} onSent={() => onCopiedChange(true)} />
      <div className="flex items-center gap-4 mt-2">
        <label className="flex items-center gap-1.5 font-mono text-2xs cursor-pointer" style={{ color: copied ? C.emerald : C.muted }}>
          <input type="checkbox" checked={copied} onChange={(e) => onCopiedChange(e.target.checked)} /> คัดลอกแล้ว
        </label>
        <label className="flex items-center gap-1.5 font-mono text-2xs cursor-pointer" style={{ color: made ? C.emerald : C.muted }}>
          <input type="checkbox" checked={made} onChange={(e) => onMadeChange(e.target.checked)} /> สร้างแล้ว
        </label>
      </div>
    </div>
  );
}

function parseScenes(text) {
  if (!text) return null;
  const matches = [...text.matchAll(/Scene\s*(\d+)\s*:\s*/gi)];
  if (matches.length < 2) return null;
  const scenes = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    scenes.push({ number: matches[i][1], text: text.slice(start, end).trim() });
  }
  return scenes;
}

function VideoPromptBox({ value, copied, made, onCopiedChange, onMadeChange }) {
  const [sceneCopyMsg, setSceneCopyMsg] = useState({});
  const [wholeCopyMsg, setWholeCopyMsg] = useState('');
  if (!value) return null;
  const scenes = parseScenes(value);

  if (!scenes) {
    return <PromptBox label="Prompt วิดีโอ" color={C.cyan} value={value} copied={copied} made={made} onCopiedChange={onCopiedChange} onMadeChange={onMadeChange} tools={['flow', 'meta', 'chatgpt']} />;
  }

  function copyWhole() {
    navigator.clipboard.writeText(value).then(() => {
      onCopiedChange(true);
      setWholeCopyMsg('คัดลอกแล้ว ✓');
      setTimeout(() => setWholeCopyMsg(''), 1500);
    }).catch(() => {});
  }
  function copyScene(idx, sceneText) {
    navigator.clipboard.writeText(sceneText).then(() => {
      setSceneCopyMsg((m) => ({ ...m, [idx]: 'คัดลอกแล้ว ✓' }));
      setTimeout(() => setSceneCopyMsg((m) => ({ ...m, [idx]: '' })), 1500);
    }).catch(() => {});
  }

  return (
    <div className="p-2.5 rounded-xl mt-2" style={{ background: C.bgDeep, border: `1px solid ${C.cyan}` }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-2xs" style={{ color: C.cyan }}>Prompt วิดีโอ ({scenes.length} ฉาก)</span>
        <button onClick={copyWhole} className="font-mono text-2xs px-2 py-1 rounded-lg shrink-0" style={{ border: `1px solid ${C.cyan}`, color: C.cyan }}>{wholeCopyMsg || 'คัดลอกทั้งหมด'}</button>
      </div>
      <div className="space-y-2">
        {scenes.map((s, i) => (
          <div key={i} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-2xs" style={{ color: C.text }}>ฉากที่ {s.number}</span>
              <button onClick={() => copyScene(i, s.text)} className="font-mono text-2xs px-1.5 py-0.5 rounded" style={{ border: `1px solid ${C.border}`, color: C.muted }}>{sceneCopyMsg[i] || 'คัดลอก'}</button>
            </div>
            <p className="font-body text-xs whitespace-pre-wrap" style={{ color: C.text }}>{s.text}</p>
            <SendToTools text={s.text} tools={['flow', 'meta']} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <label className="flex items-center gap-1.5 font-mono text-2xs cursor-pointer" style={{ color: copied ? C.emerald : C.muted }}>
          <input type="checkbox" checked={copied} onChange={(e) => onCopiedChange(e.target.checked)} /> คัดลอกครบทุกฉากแล้ว
        </label>
        <label className="flex items-center gap-1.5 font-mono text-2xs cursor-pointer" style={{ color: made ? C.emerald : C.muted }}>
          <input type="checkbox" checked={made} onChange={(e) => onMadeChange(e.target.checked)} /> สร้างครบทุกฉากแล้ว
        </label>
      </div>
    </div>
  );
}

const CAPTION_LANGS = [
  { key: 'Th', label: 'ไทย' },
  { key: 'En', label: 'English' },
  { key: 'Zh', label: '中文' },
];

function DailyTaskCard({ task, onToggle, onUpdate, onGenOutline, onGenPrompts, onGenMeta, onQC, onAnalyzeReview, channelName, onReset, onDelete, loadingAction }) {
  const [expanded, setExpanded] = useState(false);
  const [capLang, setCapLang] = useState('Th');
  const [copiedBundle, setCopiedBundle] = useState('');
  const Icon = task.type === 'video' ? VideoIcon : ImageIcon;
  const platMeta = PLATFORM_META[task.platform];
  const hasMeta = task.titleTh || task.title || task.captionTh;
  const busy = !!loadingAction;
  const statusBits = [];
  if (task.outline) statusBits.push('มีโครงเรื่อง');
  if (task.videoPrompt || task.coverPrompt || task.sourceImagePrompt || task.imagePrompt) statusBits.push('มี Prompt');
  if (hasMeta) statusBits.push('มีชื่อ/คำบรรยาย');
  if (task.link) statusBits.push('ส่งลิงก์แล้ว');
  if (task.qc) statusBits.push(task.qc.passed ? 'QC ผ่าน' : 'QC ให้แก้ไข');

  const templateLinks = (task.templateLinks && task.templateLinks.length) ? task.templateLinks : [''];
  function updateTemplateLink(idx, value) {
    const next = [...templateLinks]; next[idx] = value; onUpdate(task.id, { templateLinks: next });
  }
  function addTemplateLink() { onUpdate(task.id, { templateLinks: [...templateLinks, ''] }); }
  function removeTemplateLink(idx) {
    const next = templateLinks.filter((_, i) => i !== idx);
    onUpdate(task.id, { templateLinks: next.length ? next : [''] });
  }

  // คัดลอกทั้งชุด (ชื่อ + คำบรรยาย + แฮชแท็ก) พร้อมวางลงโพสต์ได้เลย
  function copyBundle(mode) {
    const text = mode === 'all'
      ? CAPTION_LANGS.map((l) => {
          const body = buildPostBundle(task, l.key);
          return body ? `[${l.label}]\n${body}` : '';
        }).filter(Boolean).join('\n\n———\n\n')
      : buildPostBundle(task, capLang);
    copyText(text).then((ok) => {
      setCopiedBundle(ok ? mode : '');
      setTimeout(() => setCopiedBundle(''), 1800);
    });
  }

  return (
    <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task.id)} style={{ color: task.done ? C.emerald : C.muted }} className="mt-0.5 shrink-0">{task.done ? <CheckSquare size={18} /> : <Square size={18} />}</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setExpanded((e) => !e)} className="flex-1 flex items-center gap-2 flex-wrap text-left min-w-0">
              <Icon size={13} style={{ color: C.muted }} className="shrink-0" />
              <span className="font-body text-sm shrink-0" style={{ color: task.done ? C.muted : C.text, textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</span>
              <span className="font-mono text-2xs shrink-0" style={{ color: C.muted }}>({taskLabelEn(task)})</span>
              {platMeta && <span className="font-mono text-2xs px-1.5 py-0.5 rounded shrink-0" style={{ color: platMeta.color, border: `1px solid ${platMeta.color}` }}>{platMeta.label}</span>}
              {!expanded && statusBits.length > 0 && <span className="font-mono text-2xs truncate" style={{ color: C.muted }}>· {statusBits.join(' · ')}</span>}
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onReset(task)} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.muted }}><RefreshCw size={11} /> รีเซ็ต</button>
              {onDelete && <button onClick={() => onDelete(task.id)} aria-label="ลบงานนี้" style={{ color: C.red }}><Trash2 size={13} /></button>}
              <button onClick={() => setExpanded((e) => !e)} style={{ color: C.muted }}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
            </div>
          </div>

          {expanded && (
            <div className="anim-fade">
              <div className="mt-2.5">
                <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>เทมเพลต / สคริปต์อ้างอิง</label>
                <textarea value={task.styleTemplate} onChange={(e) => onUpdate(task.id, { styleTemplate: e.target.value })} rows={3} placeholder="วางสไตล์/สคริปต์ที่ต้องการให้ AI เลียนแบบ" className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
                <div className="mt-1.5 space-y-1.5">
                  <label className="font-mono text-2xs block leading-relaxed" style={{ color: C.muted }}>ลิงก์วิดีโอ/โพสต์ต้นแบบ — ใช้บอก AI ว่ากำลังออกแบบตามสไตล์ไหน (AI อ่านเป็นข้อมูลอ้างอิงเท่านั้น ไม่ได้เปิดดูคลิปจริงจากลิงก์)</label>
                  {templateLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input value={link} onChange={(e) => updateTemplateLink(idx, e.target.value)} placeholder="วางลิงก์วิดีโอ/โพสต์ต้นแบบ" className="flex-1 min-w-0 px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px dashed ${C.border}` }} />
                      {templateLinks.length > 1 && <button onClick={() => removeTemplateLink(idx)} aria-label="ลบลิงก์นี้" style={{ color: C.muted }}><XCircle size={14} /></button>}
                    </div>
                  ))}
                  <button onClick={addTemplateLink} className="font-mono text-2xs flex items-center gap-1" style={{ color: C.blue }}><Plus size={11} /> เพิ่มลิงก์ต้นแบบ</button>
                </div>
              </div>

              <div className="mt-2.5">
                <label className="font-mono text-2xs block mb-1" style={{ color: C.blue }}>โครงเรื่อง / แนวคิดคอนเทนต์</label>
                <textarea value={task.outline} onChange={(e) => onUpdate(task.id, { outline: e.target.value })} rows={3} placeholder="เช่น พาชมฟาร์มปลาหมึกยามเช้า..." className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
                <button onClick={() => onGenOutline(task)} disabled={busy} className="mt-1.5 font-mono text-2xs px-2.5 py-1.5 flex items-center gap-1 rounded-lg" style={{ border: `1px solid ${C.blue}`, color: C.blue, opacity: busy ? 0.6 : 1 }}>
                  {loadingAction === 'outline' ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />} ให้ AI คิดโครงเรื่องให้
                </button>
              </div>

              {task.type === 'video' && (
                <div className="mt-2.5">
                  <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>ความยาววิดีโอ</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DURATION_OPTIONS.map((s) => (
                      <button key={s} onClick={() => onUpdate(task.id, { durationSec: s })} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ background: task.durationSec === s ? BRAND : 'transparent', color: task.durationSec === s ? '#fff' : C.muted, border: `1px solid ${task.durationSec === s ? 'transparent' : C.border}` }}>{s} วิ</button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => onGenPrompts(task)} disabled={busy || !task.outline.trim()} className="mt-2.5 font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: BRAND, color: '#fff', opacity: (busy || !task.outline.trim()) ? 0.5 : 1 }}>
                {loadingAction === 'prompts' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} สร้าง Prompt {task.type === 'video' ? 'วิดีโอ + หน้าปก' : 'รูปภาพ'}
              </button>
              {task.lastError && <p className="font-mono text-2xs mt-1.5" style={{ color: C.red }}>{task.lastError}</p>}

              <PromptBox label="Prompt รูป" color={C.orange} value={task.sourceImagePrompt} copied={task.sourceImagePromptCopied} made={task.sourceImagePromptMade} onCopiedChange={(v) => onUpdate(task.id, { sourceImagePromptCopied: v })} onMadeChange={(v) => onUpdate(task.id, { sourceImagePromptMade: v })} />
              <VideoPromptBox value={task.videoPrompt} copied={task.videoPromptCopied} made={task.videoPromptMade} onCopiedChange={(v) => onUpdate(task.id, { videoPromptCopied: v })} onMadeChange={(v) => onUpdate(task.id, { videoPromptMade: v })} />
              <PromptBox label="Prompt รูปหน้าปก" color={C.violet} value={task.coverPrompt} copied={task.coverPromptCopied} made={task.coverPromptMade} onCopiedChange={(v) => onUpdate(task.id, { coverPromptCopied: v })} onMadeChange={(v) => onUpdate(task.id, { coverPromptMade: v })} />
              <PromptBox label="Prompt รูปภาพ" color={C.violet} value={task.imagePrompt} copied={task.imagePromptCopied} made={task.imagePromptMade} onCopiedChange={(v) => onUpdate(task.id, { imagePromptCopied: v })} onMadeChange={(v) => onUpdate(task.id, { imagePromptMade: v })} />

              <button onClick={() => onGenMeta(task)} disabled={busy || !task.outline.trim()} className="mt-2.5 font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ border: `1px solid ${C.emerald}`, color: C.emerald, opacity: (busy || !task.outline.trim()) ? 0.5 : 1 }}>
                {loadingAction === 'meta' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} สร้างชื่อ + คำบรรยาย + แฮชแท็ก
              </button>

              {hasMeta && (
                <div className="mt-2 p-2.5 rounded-xl space-y-2" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <div className="flex gap-1.5">
                    {CAPTION_LANGS.map((l) => (
                      <button key={l.key} onClick={() => setCapLang(l.key)} className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ background: capLang === l.key ? BRAND : 'transparent', color: capLang === l.key ? '#fff' : C.muted, border: `1px solid ${capLang === l.key ? 'transparent' : C.border}` }}>{l.label}</button>
                    ))}
                  </div>
                  {task[`caption${capLang}`] || task[`title${capLang}`] || (capLang === 'Th' && task.title) ? (
                    <div>
                      {(task[`title${capLang}`] || (capLang === 'Th' && task.title)) && <div><span className="font-mono text-2xs" style={{ color: C.emerald }}>ชื่อ: </span><span className="font-body text-xs" style={{ color: C.text }}>{task[`title${capLang}`] || task.title}</span></div>}
                      <p className="font-body text-xs mt-1" style={{ color: C.text }}>{task[`caption${capLang}`]}</p>
                      {task[`hashtags${capLang}`] && <p className="font-mono text-2xs mt-0.5" style={{ color: C.blue }}>{task[`hashtags${capLang}`]}</p>}
                    </div>
                  ) : (
                    <p className="font-mono text-2xs" style={{ color: C.muted }}>ยังไม่มีชื่อ/คำบรรยายภาษานี้</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1.5" style={{ borderTop: `1px solid ${C.border}` }}>
                    <button onClick={() => copyBundle('one')} className="font-mono text-2xs px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ background: copiedBundle === 'one' ? C.emerald : 'transparent', color: copiedBundle === 'one' ? '#0A0A0F' : C.emerald, border: `1px solid ${C.emerald}` }}>
                      {copiedBundle === 'one' ? <CheckCircle2 size={11} /> : <ClipboardCheck size={11} />} คัดลอกทั้งชุด ({CAPTION_LANGS.find((l) => l.key === capLang)?.label})
                    </button>
                    <button onClick={() => copyBundle('all')} className="font-mono text-2xs px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ background: copiedBundle === 'all' ? C.blue : 'transparent', color: copiedBundle === 'all' ? '#0A0A0F' : C.blue, border: `1px solid ${C.blue}` }}>
                      {copiedBundle === 'all' ? <CheckCircle2 size={11} /> : <ClipboardCheck size={11} />} คัดลอกครบ 3 ภาษา
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                <label className="font-mono text-2xs block mb-1" style={{ color: C.violet }}>ตรวจงาน (QC)</label>
                <QCReviewBox task={task} channelName={channelName} onUpdate={onUpdate} onAnalyze={onAnalyzeReview} loadingAction={loadingAction} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- กล่องตรวจงานด้วย Gemini (3 ขั้นตอน) ----------
// 1) คัดลอกคำสั่งตรวจ + เปิด Gemini แล้วแนบไฟล์คลิปเอง (Gemini ดูวิดีโอได้จริง)
// 2) วางผลวิเคราะห์ที่ได้กลับมาในช่องด้านล่าง
// 3) ให้ระบบสรุปคะแนน + สิ่งที่ต้องแก้ครั้งหน้า แล้วเก็บสถิติไว้ดูรายวัน/รายเดือน
function QCReviewBox({ task, channelName, onUpdate, onAnalyze, loadingAction }) {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const prompt = buildGeminiReviewPrompt(task, channelName);
  const busy = loadingAction === 'review';
  const scoreColor = task.reviewScore == null ? C.muted : task.reviewScore >= 8 ? C.emerald : task.reviewScore >= 5 ? C.orange : C.red;

  function copyPrompt() {
    copyText(prompt).then((ok) => { setCopied(ok); setTimeout(() => setCopied(false), 3000); });
  }
  function copyAndOpen() {
    const win = window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
    copyText(prompt).then((ok) => { setCopied(ok); setTimeout(() => setCopied(false), 4000); });
    if (!win) window.alert('เบราว์เซอร์บล็อกการเปิดแท็บ — อนุญาตป๊อปอัปของเว็บนี้ก่อน');
  }

  return (
    <div className="mt-1">
      {/* ขั้นที่ 1 — คำสั่งตรวจที่ระบบเขียนให้ */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-2xs" style={{ color: C.muted }}>1. คำสั่งตรวจคลิป (ระบบเขียนให้อัตโนมัติ)</span>
        <button onClick={() => setShowPrompt((v) => !v)} className="font-mono text-2xs shrink-0" style={{ color: C.blue }}>
          {showPrompt ? 'ย่อ' : 'ดูคำสั่งเต็ม'}
        </button>
      </div>
      <textarea
        readOnly
        value={showPrompt ? prompt : prompt.slice(0, 180) + ' ...'}
        rows={showPrompt ? 12 : 3}
        onClick={copyPrompt}
        title="คลิกเพื่อคัดลอกคำสั่งทั้งหมด"
        className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y cursor-pointer"
        style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}
      />
      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
        <button onClick={copyPrompt} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${C.violet}`, color: C.violet }}>
          <ClipboardCheck size={11} /> คัดลอกคำสั่ง
        </button>
        <button onClick={copyAndOpen} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.violet, color: '#fff' }}>
          <Share2 size={11} /> คัดลอก + เปิด Gemini
        </button>
        {copied && <span className="font-mono text-2xs" style={{ color: C.emerald }}>คัดลอกแล้ว — ใน Gemini กด + แนบไฟล์คลิป แล้ววาง (⌘V) ส่งพร้อมกัน</span>}
      </div>

      {/* ขั้นที่ 2 — วางผลกลับมา */}
      <div className="mt-3">
        <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>2. วางผลวิเคราะห์ที่ได้จาก Gemini</label>
        <textarea
          value={task.geminiReview}
          onChange={(e) => onUpdate(task.id, { geminiReview: e.target.value })}
          rows={4}
          placeholder="คัดลอกคำตอบทั้งหมดจาก Gemini มาวางตรงนี้..."
          className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg resize-y"
          style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}
        />
      </div>

      {/* ขั้นที่ 3 — ให้ระบบสรุป */}
      <button
        onClick={() => onAnalyze(task)}
        disabled={busy || !task.geminiReview.trim()}
        className="mt-1.5 font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg"
        style={{ background: BRAND, color: '#fff', opacity: (busy || !task.geminiReview.trim()) ? 0.5 : 1 }}
      >
        {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} 3. ให้ระบบสรุป + เก็บสถิติ
      </button>

      {task.reviewSummary && (
        <div className="mt-2 p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${scoreColor}55` }}>
          <div className="font-mono text-2xs mb-1 flex items-center gap-2" style={{ color: scoreColor }}>
            <span>ผลตรวจ · คะแนน {task.reviewScore}/10</span>
            {task.reviewAt && <span style={{ color: C.muted }}>{new Date(task.reviewAt).toLocaleDateString('th-TH')}</span>}
          </div>
          <p className="font-body text-xs whitespace-pre-wrap" style={{ color: C.text }}>{task.reviewSummary}</p>
        </div>
      )}

      {/* ลิงก์ผลงาน (เก็บไว้อ้างอิง) */}
      <div className="mt-3">
        <label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>ลิงก์ผลงานที่โพสต์แล้ว (ไม่บังคับ)</label>
        <input value={task.link} onChange={(e) => onUpdate(task.id, { link: e.target.value })} placeholder="วางลิงก์คลิป/โพสต์ที่เผยแพร่แล้ว" className="w-full px-2.5 py-2 font-mono text-2xs outline-none rounded-lg" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
      </div>
    </div>
  );
}

function getYoutubeEmbedUrl(link) {
  const m = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/i);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function VideoPreviewBox({ link, compact }) {
  const isDirectVideo = /\.(mp4|webm|mov|m3u8)(\?|$)/i.test(link);
  const ytEmbed = getYoutubeEmbedUrl(link);
  return (
    <div className={compact ? 'mt-1.5' : 'mt-2 p-2.5 rounded-xl'} style={compact ? {} : { background: C.bgDeep, border: `1px solid ${C.border}` }}>
      {!compact && <div className="font-mono text-2xs mb-1.5" style={{ color: C.muted }}>ดูงานที่ส่ง</div>}
      {isDirectVideo ? (
        <video src={link} controls className="w-full rounded-lg" style={{ maxHeight: compact ? 160 : 240, background: '#000' }} />
      ) : ytEmbed ? (
        <iframe src={ytEmbed} title="ดูงานที่ส่ง" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full rounded-lg" style={{ aspectRatio: '16/9', border: 'none' }} />
      ) : (
        <div>
          <a href={link} target="_blank" rel="noopener noreferrer" className="font-mono text-2xs px-3 py-1.5 inline-flex items-center gap-1 rounded-lg" style={{ background: BRAND, color: '#fff' }}>
            <PlayCircle size={12} /> เปิดดูงานที่ลิงก์นี้
          </a>
          {!compact && <p className="font-mono text-2xs mt-1" style={{ color: C.muted }}>* ฝังดูในหน้าตรงๆ ได้เฉพาะ YouTube หรือลิงก์ไฟล์วิดีโอโดยตรง แพลตฟอร์มอื่นต้องเปิดลิงก์</p>}
        </div>
      )}
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
      <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เพิ่มช่องใหม่ (หัวข้อ/แบรนด์ใหม่)</div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อช่อง เช่น Whalandia" className="w-full px-3 py-2 font-body text-sm mb-2 outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 font-body text-sm mb-2 outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}>
        {Object.entries(PLATFORM_META).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}
      </select>
      <div className="flex gap-2 mb-3">
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>วิดีโอ/วัน</label><input type="number" min="0" value={videos} onChange={(e) => setVideos(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 font-body text-sm outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} /></div>
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>รูปภาพ/วัน</label><input type="number" min="0" value={images} onChange={(e) => setImages(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 font-body text-sm outline-none rounded-xl" style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }} /></div>
      </div>
      <p className="font-mono text-2xs mb-3 leading-relaxed" style={{ color: C.muted }}>* ปุ่มนี้สร้างช่องใหม่เท่านั้น ถ้าช่องนี้มีอยู่แล้วและแค่อยากเพิ่มแพลตฟอร์มอื่น ให้กด "+ แพลตฟอร์ม" ในการ์ดของช่องนั้นแทน</p>
      <div className="flex gap-2">
        <button onClick={() => { if (name.trim() && (videos > 0 || images > 0)) { onAdd(name.trim(), platform, videos, images); onClose(); } }} className="font-mono text-2xs px-3 py-2 flex items-center gap-1 rounded-xl" style={{ background: BRAND, color: '#fff' }}><Plus size={13} /> เพิ่มช่อง</button>
        <button onClick={onClose} className="font-mono text-2xs px-3 py-2 rounded-xl" style={{ color: C.muted, border: `1px solid ${C.border}` }}>ยกเลิก</button>
      </div>
    </div>
  );
}

function AddPlatformForm({ existingPlatforms, onAdd, onClose }) {
  const available = Object.keys(PLATFORM_META).filter((p) => !existingPlatforms.includes(p));
  const [platform, setPlatform] = useState(available[0] || Object.keys(PLATFORM_META)[0]);
  const [videos, setVideos] = useState(1);
  const [images, setImages] = useState(0);
  if (available.length === 0) {
    return <p className="font-mono text-2xs mt-2" style={{ color: C.muted }}>ช่องนี้มีครบทุกแพลตฟอร์มแล้ว</p>;
  }
  return (
    <div className="p-3 rounded-xl mt-2" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-2.5 py-2 font-body text-xs mb-2 outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }}>
        {available.map((key) => <option key={key} value={key}>{PLATFORM_META[key].label}</option>)}
      </select>
      <div className="flex gap-2 mb-2">
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>วิดีโอ/วัน</label><input type="number" min="0" value={videos} onChange={(e) => setVideos(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }} /></div>
        <div className="flex-1"><label className="font-mono text-2xs block mb-1" style={{ color: C.muted }}>รูปภาพ/วัน</label><input type="number" min="0" value={images} onChange={(e) => setImages(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-2.5 py-2 font-body text-xs outline-none rounded-lg" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}` }} /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (videos > 0 || images > 0) { onAdd(platform, videos, images); onClose(); } }} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ background: BRAND, color: '#fff' }}>เพิ่มแพลตฟอร์ม</button>
        <button onClick={onClose} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ color: C.muted, border: `1px solid ${C.border}` }}>ยกเลิก</button>
      </div>
    </div>
  );
}

function channelStatusLabel(done, total) {
  if (total === 0) return { text: 'ไม่มีงาน', color: C.muted };
  if (done === 0) return { text: 'ยังไม่เริ่ม', color: C.muted };
  if (done === total) return { text: 'เสร็จแล้ว', color: C.emerald };
  return { text: `ทำอยู่ ${done}/${total}`, color: C.orange };
}

function DailyChannelBlock({ channel, tasks, onToggle, onUpdate, onGenOutline, onGenPrompts, onGenMeta, onQC, onAnalyzeReview, onReset, onDeleteTask, loadingMap, onRemove, onAddPlatform, onRemovePlatform, onGenerateAll, generatingAll, onQCAll, qcAllRunning, readOnly }) {
  const [open, setOpen] = useState(false);
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const done = tasks.filter((t) => t.done).length;
  const status = channelStatusLabel(done, tasks.length);
  const qcable = tasks.some((t) => t.link && t.link.trim() && !t.qc);
  const accentColor = channel.color || C.blue;
  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0] || null;

  return (
    <div className="relative mb-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}`, boxShadow: `0 8px 24px -16px ${accentColor}66`, overflow: 'hidden' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 flex-wrap text-left min-w-0">
            <span className="font-body text-sm truncate" style={{ color: C.text }}>{channel.name}</span>
            <span className="font-mono text-2xs px-2 py-0.5 rounded-md shrink-0" style={{ color: status.color, border: `1px solid ${status.color}` }}>{status.text}</span>
          </button>
          {/* ปุ่มแพลตฟอร์ม (Facebook / +แพลตฟอร์ม) ย้ายมาฝั่งขวาของหัวการ์ด */}
          <div className="flex items-center gap-2 flex-wrap justify-end ml-auto">
            <div className="flex items-center gap-1.5 flex-wrap">
              {channel.platforms.map((p) => {
                const meta = PLATFORM_META[p.platform];
                const PlatformIcon = meta.icon;
                return (
                  <span key={p.platform} className="font-mono text-2xs pl-2 pr-1.5 py-1 rounded-md flex items-center gap-1" style={{ color: meta.color, border: `1px solid ${meta.color}` }}>
                    <PlatformIcon size={11} />{meta.label}
                    {!readOnly && channel.platforms.length > 1 && (
                      <button onClick={() => onRemovePlatform(channel.id, p.platform)} aria-label="ลบแพลตฟอร์มนี้ออกจากช่อง" style={{ color: meta.color, opacity: 0.7 }}><XCircle size={11} /></button>
                    )}
                  </span>
                );
              })}
              {!readOnly && (
                <button onClick={() => setShowAddPlatform((s) => !s)} className="font-mono text-2xs px-2 py-1 rounded-md flex items-center gap-1" style={{ color: C.muted, border: `1px dashed ${C.border}` }}>
                  <Plus size={11} /> แพลตฟอร์ม
                </button>
              )}
            </div>
            {!readOnly && <button onClick={() => onRemove(channel.id)} style={{ color: C.muted }} aria-label="ลบช่อง"><Trash2 size={15} /></button>}
            <button onClick={() => setOpen((o) => !o)} style={{ color: C.muted }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
          </div>
        </div>
        {!readOnly && showAddPlatform && <AddPlatformForm existingPlatforms={channel.platforms.map((p) => p.platform)} onAdd={(platform, v, im) => { onAddPlatform(channel.id, platform, v, im); setShowAddPlatform(false); }} onClose={() => setShowAddPlatform(false)} />}
        <div className="max-w-xs"><ProgressBar done={done} total={tasks.length} color={accentColor} /></div>
      </div>
      {open && (
        <div className="anim-fade">
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            <button onClick={() => onGenerateAll(channel)} disabled={generatingAll} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: accentColor, color: '#fff', opacity: generatingAll ? 0.6 : 1 }}>
              {generatingAll ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} เตรียมเนื้อหาให้ครบทุกงานวันนี้
            </button>
            {qcable && (
              <button onClick={() => onQCAll(channel)} disabled={qcAllRunning} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: C.violet, color: '#fff', opacity: qcAllRunning ? 0.6 : 1 }}>
                {qcAllRunning ? <Loader2 size={12} className="animate-spin" /> : <ClipboardCheck size={12} />} ตรวจ QC ทั้งหมด
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <p className="px-3 pb-4 font-body text-xs" style={{ color: C.muted }}>ยังไม่มีงานในช่องนี้ — เพิ่มแพลตฟอร์มด้านบนเพื่อสร้างงาน</p>
          ) : (
            <>
              {/* แท็บสลับดูงานแต่ละชิ้น (วิดีโอ 1 / วิดีโอ 2 / โพสต์ 1 ...) แทนรายการเรียงต่อกันแบบเดิม */}
              <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                {tasks.map((t) => {
                  const isActive = activeTask && activeTask.id === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveTaskId(t.id)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ background: isActive ? accentColor : 'transparent', color: isActive ? '#fff' : (t.done ? C.emerald : C.muted), border: `1px solid ${isActive ? 'transparent' : C.border}` }}>
                      {t.done && <CheckSquare size={10} />} {t.label}
                    </button>
                  );
                })}
              </div>
              {activeTask && (
                <DailyTaskCard key={activeTask.id} task={activeTask} onToggle={onToggle} onUpdate={onUpdate} onGenOutline={onGenOutline} onGenPrompts={onGenPrompts} onGenMeta={onGenMeta} onQC={onQC} onAnalyzeReview={onAnalyzeReview} channelName={channel.name} onReset={onReset} onDelete={onDeleteTask} loadingAction={loadingMap[activeTask.id]} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TodayStatusCard({ tasks, history }) {
  const todayStr = todayDateStr();
  const doneToday = tasks.filter((t) => t.done).length;
  const totalToday = tasks.length;
  const remaining = Math.max(0, totalToday - doneToday);
  const pct = totalToday === 0 ? 0 : Math.round((doneToday / totalToday) * 100);
  const todayEntry = { date: todayStr, totalTasks: totalToday, doneTasks: doneToday };
  const trend = [...history, todayEntry].slice(-7).map((h) => ({ date: h.date.slice(5), pct: h.totalTasks ? Math.round((h.doneTasks / h.totalTasks) * 100) : 0 }));
  const pieData = totalToday === 0 ? [] : [
    { name: 'เสร็จแล้ว', value: doneToday, color: C.emerald },
    { name: 'ยังไม่เสร็จ', value: remaining, color: C.border },
  ];
  const statusText = totalToday === 0
    ? 'ยังไม่มีงานวันนี้'
    : doneToday === totalToday
      ? `เสร็จครบทุกงานแล้ว (${totalToday} งาน) 🎉`
      : `เสร็จแล้ว ${doneToday} จาก ${totalToday} งาน · เหลืออีก ${remaining} งาน`;

  return (
    <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-4">
        <div className="shrink-0 relative" style={{ width: 64, height: 64 }}>
          {pieData.length > 0 ? (
            <ResponsiveContainer width={64} height={64}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={20} outerRadius={30} startAngle={90} endAngle={-270} stroke="none">
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full" style={{ border: `3px solid ${C.border}` }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold" style={{ color: C.emerald }}>{pct}%</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-2xs mb-0.5" style={{ color: C.blue }}>สถานะวันนี้</div>
          <p className="font-body text-xs leading-relaxed" style={{ color: C.text }}>{statusText}</p>
        </div>
      </div>
      <div className="mt-3" style={{ height: 56 }}>
        {trend.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Line type="monotone" dataKey="pct" stroke={C.emerald} strokeWidth={2} dot={{ r: 2, fill: C.emerald }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="font-mono text-2xs" style={{ color: C.muted }}>ยังไม่มีข้อมูลแนวโน้มย้อนหลัง</p>
        )}
      </div>
    </div>
  );
}

function MiniCalendarCard({ history, tasks, activeDate, onSelectDate, onOpenCalendar }) {
  const todayStr = todayDateStr();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const historyByDate = {};
  history.forEach((h) => { historyByDate[h.date] = h; });
  const todayEntry = { totalTasks: tasks.length, doneTasks: tasks.filter((t) => t.done).length };

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

  return (
    <div className="w-full p-5 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs tracking-widest" style={{ color: C.blue }}>{THAI_MONTHS[month]} {year + 543}</span>
        <button onClick={onOpenCalendar} className="font-mono text-2xs" style={{ color: C.muted }}>ดูปฏิทินเต็ม →</button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const isActive = dateStr === activeDate;
          const entry = isToday ? todayEntry : historyByDate[dateStr];
          const hasData = isToday || !!historyByDate[dateStr];
          const color = isToday ? C.blue : entryColor(entry);
          return (
            <button key={i} onClick={() => onSelectDate(dateStr)} className="aspect-square rounded-md flex items-center justify-center font-mono text-xs" style={{ border: `1px solid ${hasData ? color : C.border}`, background: isActive ? `${color}33` : 'transparent', color: hasData ? C.text : C.muted }}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// เติม https:// ให้ลิงก์ที่ผู้ใช้พิมพ์มาแบบไม่มี เพื่อให้กดเปิดได้จริง
function normalizeUrl(link) {
  const t = String(link || '').trim();
  if (!t) return '#';
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function PlatformCheckPanel({ channels, onUpdateCheckLink }) {
  const rows = [];
  channels.forEach((c) => {
    c.platforms.forEach((p) => {
      rows.push({ key: `${c.id}|${p.platform}`, channelId: c.id, channelName: c.name, channelColor: c.color, ...p });
    });
  });
  const [selected, setSelected] = useState('');
  const current = rows.find((r) => r.key === selected) || rows[0];

  if (rows.length === 0) {
    return (
      <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-2" style={{ color: C.blue }}>เช็คงานตามแพลตฟอร์ม</div>
        <p className="font-body text-xs" style={{ color: C.muted }}>เพิ่มช่องก่อนถึงจะเช็คงานตรงนี้ได้</p>
      </div>
    );
  }

  const meta = PLATFORM_META[current.platform];
  const PlatformIcon = meta.icon;
  const hasLink = current.checkLink && current.checkLink.trim();

  return (
    <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="font-mono text-2xs tracking-widest mb-2.5" style={{ color: C.blue }}>เช็คงานตามแพลตฟอร์ม</div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: current.channelColor }} />
        <select
          value={current.key}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 min-w-0 px-2 py-1.5 font-body text-xs outline-none rounded-lg"
          style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}
        >
          {rows.map((r) => (
            <option key={r.key} value={r.key}>{r.channelName} · {PLATFORM_META[r.platform].label}</option>
          ))}
        </select>
        <PlatformIcon size={13} style={{ color: meta.color }} className="shrink-0" />
      </div>
      <input
        value={current.checkLink}
        onChange={(e) => onUpdateCheckLink(current.channelId, current.platform, e.target.value)}
        placeholder="ลิงก์เช็คงาน (เพจ/โปรไฟล์)"
        className="w-full px-2 py-1.5 font-mono text-2xs outline-none rounded-lg"
        style={{ background: C.bgDeep, color: C.text, border: `1px solid ${C.border}` }}
      />
      <a
        href={hasLink ? normalizeUrl(current.checkLink) : undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { if (!hasLink) e.preventDefault(); }}
        className="mt-1.5 w-full font-mono text-2xs px-2 py-1.5 rounded-lg flex items-center justify-center gap-1"
        style={{ background: hasLink ? meta.color : 'transparent', color: hasLink ? '#fff' : C.muted, border: `1px solid ${hasLink ? meta.color : C.border}` }}
      >
        <Share2 size={10} /> เปิดหน้า{meta.label}
      </a>
      <p className="font-mono text-2xs mt-2" style={{ color: C.muted }}>มีทั้งหมด {rows.length} แพลตฟอร์ม — เลือกจากรายการด้านบน</p>
    </div>
  );
}

function DayNavigator({ viewDate, setViewDate }) {
  const today = todayDateStr();
  const active = viewDate || today;
  const diffDays = Math.round((new Date(active + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000);
  const isPast = diffDays < 0;
  const isFuture = diffDays > 0;
  function shift(days) {
    const next = shiftDateStr(active, days);
    setViewDate(next === today ? null : next);
  }
  function labelFor(dateStr, d) {
    if (d === 1) return 'พรุ่งนี้';
    if (d === 2) return 'มะรืนนี้';
    if (d === -1) return 'เมื่อวาน';
    if (d === -2) return 'วานซืน';
    const dt = new Date(dateStr + 'T00:00:00');
    return `${THAI_DAYS[dt.getDay()]} ${dt.getDate()} ${THAI_MONTHS[dt.getMonth()]}`;
  }
  const bannerColor = isPast ? C.violet : isFuture ? C.orange : C.blue;
  const bannerText = isPast ? `กำลังดูงานย้อนหลัง: ${labelFor(active, diffDays)}` : isFuture ? `กำลังเตรียมล่วงหน้า: ${labelFor(active, diffDays)}` : 'วันนี้';
  return (
    <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl" style={{ background: viewDate ? `${bannerColor}18` : C.panel, border: `1px solid ${viewDate ? bannerColor : C.border}` }}>
      <button onClick={() => shift(-1)} className="font-mono text-xs px-2.5 py-1 rounded-lg shrink-0" style={{ color: C.muted, border: `1px solid ${C.border}` }}>← ก่อนหน้า</button>
      <div className="flex-1 text-center min-w-0">
        <span className="font-mono text-xs truncate" style={{ color: viewDate ? bannerColor : C.blue }}>{bannerText}</span>
      </div>
      <button onClick={() => shift(1)} className="font-mono text-xs px-2.5 py-1 rounded-lg shrink-0" style={{ color: C.muted, border: `1px solid ${C.border}` }}>ถัดไป →</button>
    </div>
  );
}

function DailyWork({ channels, setChannels, tasks, setTasks, futureTasks, setFutureTasks, history, setHistory, reminder, onDismissReminder, onOpenCalendar, initialViewDate, onConsumeInitialViewDate, onTrash }) {
  const [showAdd, setShowAdd] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});
  const [generatingAllId, setGeneratingAllId] = useState(null);
  const [qcAllId, setQcAllId] = useState(null);
  const [viewDate, setViewDate] = useState(null); // null = วันนี้, มากกว่าวันนี้ = เตรียมล่วงหน้า, น้อยกว่าวันนี้ = ดูย้อนหลัง
  const todayStr = todayDateStr();

  // เปิดมาจากหน้าปฏิทิน (ดับเบิลคลิกวันที่) — พาไปที่วันนั้นให้อัตโนมัติ
  useEffect(() => {
    if (initialViewDate) {
      setViewDate(initialViewDate === todayStr ? null : initialViewDate);
      if (onConsumeInitialViewDate) onConsumeInitialViewDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialViewDate]);

  // รับคีย์ลัดเลื่อนวัน (← → = วันก่อน/ถัดไป, T = กลับมาวันนี้)
  useEffect(() => {
    function onDayNav(e) {
      const dir = e.detail && e.detail.dir;
      if (dir === 0) { setViewDate(null); return; }
      setViewDate((cur) => {
        const next = shiftDateStr(cur || todayStr, dir);
        return next === todayStr ? null : next;
      });
    }
    window.addEventListener('forge-day-nav', onDayNav);
    return () => window.removeEventListener('forge-day-nav', onDayNav);
  }, [todayStr]);

  const isFutureView = !!viewDate && viewDate > todayStr;
  const isPastView = !!viewDate && viewDate < todayStr;
  const activeDate = viewDate || todayStr;
  const pastEntry = isPastView ? history.find((h) => h.date === viewDate) : null;
  const activeTasks = isFutureView
    ? (futureTasks[viewDate] || buildDefaultTasksForChannels(channels, viewDate))
    : isPastView
      ? ((pastEntry && Array.isArray(pastEntry.tasks)) ? pastEntry.tasks : [])
      : tasks;
  const activeTasksRef = useRef(activeTasks);
  useEffect(() => { activeTasksRef.current = activeTasks; }, [activeTasks]);

  function setActiveTasksUpdater(updater) {
    if (isFutureView) {
      setFutureTasks((prev) => {
        const current = prev[viewDate] || buildDefaultTasksForChannels(channels, viewDate);
        const next = typeof updater === 'function' ? updater(current) : updater;
        return { ...prev, [viewDate]: next };
      });
    } else if (isPastView) {
      setHistory((prev) => prev.map((h) => {
        if (h.date !== viewDate) return h;
        const current = Array.isArray(h.tasks) ? h.tasks : [];
        const next = typeof updater === 'function' ? updater(current) : updater;
        return { ...h, tasks: next, totalTasks: next.length, doneTasks: next.filter((t) => t.done).length };
      }));
    } else {
      setTasks((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    }
  }
  function removeTask(id) {
    const t = activeTasksRef.current.find((x) => x.id === id);
    if (t && onTrash) {
      const ch = channels.find((c) => c.id === t.channelId);
      onTrash('task', `${ch ? ch.name + ' · ' : ''}${t.label}`, { task: t });
    }
    setActiveTasksUpdater((prev) => prev.filter((x) => x.id !== id));
  }

  // คัดลอกสไตล์/เทมเพลต/ความยาว จากวันก่อนหน้าล่าสุดที่มีข้อมูล มาใส่งานของวันที่กำลังดูอยู่
  // (คัดลอกเฉพาะการตั้งค่าที่ใช้ซ้ำได้ ไม่ลอกโครงเรื่อง/พรอมต์/ลิงก์ เพราะต้องเป็นของใหม่ทุกวัน)
  const prevDaySource = (() => {
    const candidates = (history || [])
      .filter((h) => h.date < activeDate && Array.isArray(h.tasks) && h.tasks.length > 0)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    if (candidates.length > 0) return { date: candidates[0].date, tasks: candidates[0].tasks };
    if (activeDate > todayStr && tasks.length > 0) return { date: todayStr, tasks };
    return null;
  })();

  function copySettingsFromPrevDay() {
    if (!prevDaySource) return;
    setActiveTasksUpdater((prev) => prev.map((t) => {
      const match = prevDaySource.tasks.find((p) => p.channelId === t.channelId && p.label === t.label)
        || prevDaySource.tasks.find((p) => p.channelId === t.channelId && p.type === t.type);
      if (!match) return t;
      const links = Array.isArray(match.templateLinks) ? match.templateLinks.filter(Boolean) : [];
      return {
        ...t,
        styleTemplate: match.styleTemplate || t.styleTemplate,
        durationSec: match.durationSec || t.durationSec,
        templateLinks: links.length ? links : t.templateLinks,
      };
    }));
  }

  function setLoading(id, action) { setLoadingMap((prev) => ({ ...prev, [id]: action })); }
  function clearLoading(id) { setLoadingMap((prev) => { const n = { ...prev }; delete n[id]; return n; }); }
  function updateTaskField(id, patch) { setActiveTasksUpdater((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))); }

  function addChannel(name, platform, dailyVideos, dailyImages) {
    const color = CHANNEL_COLORS[channels.length % CHANNEL_COLORS.length];
    const channel = { id: Date.now().toString(), name, color, platforms: [{ platform, dailyVideos, dailyImages, checkLink: '' }] };
    setChannels((prev) => [...prev, channel]);
    setActiveTasksUpdater((prev) => [...prev, ...buildTasksForPlatform(channel.id, channel.platforms[0], 0, 0, activeDate)]);
  }
  function addPlatform(channelId, platform, dailyVideos, dailyImages) {
    const chTasks = activeTasksRef.current.filter((t) => t.channelId === channelId);
    const videoOffset = chTasks.filter((t) => t.type === 'video').length;
    const imageOffset = chTasks.filter((t) => t.type === 'image').length;
    setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, platforms: [...c.platforms, { platform, dailyVideos, dailyImages, checkLink: '' }] } : c)));
    setActiveTasksUpdater((prev) => [...prev, ...buildTasksForPlatform(channelId, { platform, dailyVideos, dailyImages }, videoOffset, imageOffset, activeDate)]);
  }
  function updateCheckLink(channelId, platform, checkLink) {
    setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, platforms: c.platforms.map((p) => (p.platform === platform ? { ...p, checkLink } : p)) } : c)));
  }
  function removePlatform(channelId, platform) {
    setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, platforms: c.platforms.filter((p) => p.platform !== platform) } : c)));
    setTasks((prev) => prev.filter((t) => !(t.channelId === channelId && t.platform === platform)));
    setFutureTasks((prev) => {
      const next = {};
      Object.keys(prev).forEach((d) => { next[d] = prev[d].filter((t) => !(t.channelId === channelId && t.platform === platform)); });
      return next;
    });
  }
  function removeChannel(id) {
    const ch = channels.find((c) => c.id === id);
    const chTasks = tasks.filter((t) => t.channelId === id);
    if (ch && !window.confirm(`ลบช่อง "${ch.name}" และงานทั้งหมดของช่องนี้?\n\n(ยังกู้คืนได้จากถังขยะภายใน 30 วัน)`)) return;
    if (ch && onTrash) onTrash('channel', ch.name, { channel: ch, tasks: chTasks });
    setChannels((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.filter((t) => t.channelId !== id));
    setFutureTasks((prev) => {
      const next = {};
      Object.keys(prev).forEach((d) => { next[d] = prev[d].filter((t) => t.channelId !== id); });
      return next;
    });
  }
  function toggleTask(id) {
    setActiveTasksUpdater((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  function resetTask(task) {
    setActiveTasksUpdater((prev) => prev.map((t) => (t.id === task.id ? emptyTask(t.id, t.channelId, t.platform, t.type, t.label, t.date) : t)));
  }

  async function genOutline(task) {
    setLoading(task.id, 'outline');
    const channel = channels.find((c) => c.id === task.channelId);
    const avoidList = activeTasksRef.current.filter((t) => t.channelId === task.channelId && t.id !== task.id && (t.titleTh || t.outline)).map((t) => t.titleTh || t.outline).slice(0, 10);
    const avoidText = avoidList.length ? `\nเคยทำไปแล้ว (ห้ามซ้ำ): ${avoidList.join(' / ')}` : '';
    const styleLine = task.styleTemplate.trim() ? `\nสไตล์/แนวที่ต้องการ: ${task.styleTemplate.trim()}` : '';
    const templateLinkList = (task.templateLinks || []).map((l) => l.trim()).filter(Boolean);
    const templateLine = templateLinkList.length ? `\nลิงก์วิดีโอ/โพสต์ต้นแบบอ้างอิง (ยึดแนวสไตล์ตามนี้): ${templateLinkList.join(' , ')}` : '';
    try {
      const text = await callClaude(OUTLINE_SYS, `ช่อง/เพจ: ${channel.name} (${PLATFORM_META[task.platform].label})\nประเภทงาน: ${task.type === 'video' ? 'วิดีโอ' : 'รูปภาพ'}${styleLine}${templateLine}${avoidText}`, undefined, 'outline');
      const outline = text.trim();
      updateTaskField(task.id, { outline });
      return outline;
    } catch (e) {
      updateTaskField(task.id, { outline: `เรียก AI ไม่สำเร็จ: ${e.message || 'ไม่ทราบสาเหตุ'}` });
      return null;
    } finally {
      clearLoading(task.id);
    }
  }
  async function genPrompts(task, outlineOverride) {
    const outline = outlineOverride || task.outline;
    if (!outline || !outline.trim()) return;
    setLoading(task.id, 'prompts');
    updateTaskField(task.id, { lastError: '' });
    const channel = channels.find((c) => c.id === task.channelId);
    const sys = task.type === 'video' ? PROMPTS_SYS_VIDEO : PROMPTS_SYS_IMAGE;
    const sceneCount = task.type === 'video' ? (task.durationSec <= 10 ? 1 : Math.max(2, Math.round(task.durationSec / 4))) : 0;
    const durationLine = task.type === 'video' ? `\nความยาว: ${task.durationSec} วินาที\nจำนวนฉากที่ควรแบ่ง: ${sceneCount} ฉาก` : '';
    const styleLine = task.styleTemplate.trim() ? `\nเทมเพลต/สไตล์อ้างอิง: ${task.styleTemplate.trim()}` : '';
    try {
      const text = await callClaude(sys, `ช่อง/เพจ: ${channel.name} (${PLATFORM_META[task.platform].label})\nโครงเรื่อง: ${outline}${durationLine}${styleLine}`, undefined, 'prompts');
      const json = parseJsonLoose(text) || {};
      updateTaskField(task.id, {
        videoPrompt: json.videoPrompt || task.videoPrompt,
        coverPrompt: json.coverPrompt || task.coverPrompt,
        sourceImagePrompt: json.sourceImagePrompt || task.sourceImagePrompt,
        imagePrompt: json.imagePrompt || task.imagePrompt,
        videoPromptCopied: false, videoPromptMade: false,
        coverPromptCopied: false, coverPromptMade: false,
        sourceImagePromptCopied: false, sourceImagePromptMade: false,
        imagePromptCopied: false, imagePromptMade: false,
      });
    } catch (e) {
      updateTaskField(task.id, { lastError: `สร้าง Prompt ไม่สำเร็จ: ${e.message || 'ไม่ทราบสาเหตุ'}` });
    } finally {
      clearLoading(task.id);
    }
  }
  async function genMeta(task, outlineOverride) {
    const outline = outlineOverride || task.outline;
    if (!outline || !outline.trim()) return;
    setLoading(task.id, 'meta');
    updateTaskField(task.id, { lastError: '' });
    const channel = channels.find((c) => c.id === task.channelId);
    try {
      const text = await callClaude(META_SYS, `ช่อง/เพจ: ${channel.name} (${PLATFORM_META[task.platform].label})\nโครงเรื่อง: ${outline}`, undefined, 'meta');
      const json = parseJsonLoose(text) || {};
      updateTaskField(task.id, {
        titleTh: json.titleTh || json.title || '', titleEn: json.titleEn || '', titleZh: json.titleZh || '',
        captionTh: json.captionTh || '', captionEn: json.captionEn || '', captionZh: json.captionZh || '',
        hashtagsTh: json.hashtagsTh || '', hashtagsEn: json.hashtagsEn || '', hashtagsZh: json.hashtagsZh || '',
      });
    } catch (e) {
      updateTaskField(task.id, { lastError: `สร้างชื่อ/คำบรรยายไม่สำเร็จ: ${e.message || 'ไม่ทราบสาเหตุ'}` });
    } finally {
      clearLoading(task.id);
    }
  }
  async function runQC(task) {
    if (!task.link || !task.link.trim()) return;
    setLoading(task.id, 'qc');
    const sys = task.type === 'video' ? QC_SYS_VIDEO : QC_SYS_IMAGE;
    const summary = task.type === 'video'
      ? `โครงเรื่อง: ${task.outline || '-'}\nพรอมต์วิดีโอ: ${task.videoPrompt || '-'}\nพรอมต์หน้าปก: ${task.coverPrompt || '-'}\nชื่อคลิป: ${task.titleTh || '-'}\nคำบรรยาย: ${task.captionTh || '-'}\nลิงก์ที่ส่ง: ${task.link}`
      : `โครงเรื่อง: ${task.outline || '-'}\nพรอมต์รูปภาพ: ${task.imagePrompt || '-'}\nชื่อโพสต์: ${task.titleTh || '-'}\nคำบรรยาย: ${task.captionTh || '-'}\nลิงก์ที่ส่ง: ${task.link}`;
    try {
      const text = await callClaude(sys, summary, undefined, 'prompts');
      const passed = text.trim().startsWith('ผ่าน');
      updateTaskField(task.id, { qc: { passed, text } });
    } catch (e) {
      updateTaskField(task.id, { qc: { passed: false, text: `เรียก AI ตรวจสอบไม่สำเร็จ: ${e.message || 'ไม่ทราบสาเหตุ'}` } });
    } finally {
      clearLoading(task.id);
    }
  }
  async function generateAll(channel) {
    setGeneratingAllId(channel.id);
    const chTasks = activeTasksRef.current.filter((t) => t.channelId === channel.id);
    for (const t of chTasks) {
      const latest = activeTasksRef.current.find((x) => x.id === t.id) || t;
      const outline = await genOutline(latest);
      if (outline) {
        const afterOutline = activeTasksRef.current.find((x) => x.id === t.id) || latest;
        await genPrompts(afterOutline, outline);
        await genMeta(afterOutline, outline);
      }
    }
    setGeneratingAllId(null);
  }
  async function qcAll(channel) {
    setQcAllId(channel.id);
    const chTasks = activeTasksRef.current.filter((t) => t.channelId === channel.id && t.link && t.link.trim() && !t.qc);
    for (const t of chTasks) { await runQC(t); }
    setQcAllId(null);
  }
  async function analyzeReview(task) {
    if (!task.geminiReview || !task.geminiReview.trim()) return;
    setLoading(task.id, 'review');
    const channel = channels.find((c) => c.id === task.channelId);
    const sys = 'คุณคือหัวหน้าฝ่ายผลิตคอนเทนต์ ผมจะให้ผลตรวจคลิปที่ได้จาก AI อีกตัวมา ให้คุณสรุปเป็นภาษาไทยแบบสั้น กระชับ ใช้งานได้จริง ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ ```json รูปแบบ: {"score": ตัวเลข 1-10, "summary": "สรุป 2-4 บรรทัด บอกว่าผ่านหรือควรทำใหม่ และสิ่งที่ต้องแก้ครั้งหน้าเป็นข้อๆ", "promptFix": "ข้อความสั้นๆ บอกว่าควรเพิ่ม/ตัดอะไรใน Prompt ครั้งหน้า"}';
    try {
      const text = await callClaude(sys, `ช่อง: ${channel ? channel.name : '-'}\nงาน: ${task.label}\nโครงเรื่องที่วางไว้: ${task.outline || '-'}\n\nผลตรวจจาก Gemini:\n${task.geminiReview}`, undefined, 'review');
      const json = parseJsonLoose(text);
      const rawScore = Number(json.score);
      const score = Number.isFinite(rawScore) ? Math.max(1, Math.min(10, Math.round(rawScore))) : null;
      const summary = [json.summary || '', json.promptFix ? `\nแก้ Prompt ครั้งหน้า: ${json.promptFix}` : ''].join('').trim();
      updateTaskField(task.id, {
        reviewScore: score,
        reviewSummary: summary || 'สรุปผลไม่สำเร็จ ลองใหม่อีกครั้ง',
        reviewAt: Date.now(),
        qc: score != null ? { passed: score >= 7, text: summary } : task.qc,
      });
    } catch (e) {
      updateTaskField(task.id, { reviewSummary: `สรุปผลไม่สำเร็จ: ${e.message || 'ไม่ทราบสาเหตุ'}` });
    } finally {
      clearLoading(task.id);
    }
  }

  function resetActiveDay() {
    if (isFutureView) {
      setFutureTasks((prev) => ({ ...prev, [viewDate]: buildDefaultTasksForChannels(channels, viewDate) }));
    } else if (isPastView) {
      if (window.confirm('ล้างเนื้อหางานของวันย้อนหลังนี้ทั้งหมด (เริ่มทำใหม่) ยืนยันหรือไม่?')) {
        setActiveTasksUpdater((prev) => prev.map((t) => emptyTask(t.id, t.channelId, t.platform, t.type, t.label, activeDate)));
      }
    } else {
      setTasks((prev) => prev.map((t) => emptyTask(t.id, t.channelId, t.platform, t.type, t.label, todayStr)));
    }
  }

  const totalDone = activeTasks.filter((t) => t.done).length;
  const visibleChannels = channels;

  // สร้างรายการงานของวันย้อนหลังที่มีแต่ยอดสรุป (ข้อมูลเก่าก่อนอัปเดตระบบ) ให้กลับมาแก้ไขได้
  function rebuildPastDay() {
    if (!isPastView) return;
    const rebuilt = buildDefaultTasksForChannels(channels, activeDate);
    if (rebuilt.length === 0) {
      window.alert('ยังไม่มีช่อง/เพจในระบบ — เพิ่มช่องก่อนแล้วค่อยกดสร้างรายการงานอีกครั้ง');
      return;
    }
    setActiveTasksUpdater(rebuilt);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 anim-fade grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1"><Calendar size={14} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>{todayLabel()}</span></div>
        <h2 className="font-body text-xl" style={{ color: C.text }}>งานประจำวัน</h2>
        <div className="mt-3"><ReminderBanner reminder={reminder} onDismiss={onDismissReminder} /></div>

        <div className="mt-4"><DayNavigator viewDate={viewDate} setViewDate={setViewDate} /></div>

        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[140px] max-w-xs"><ProgressBar done={totalDone} total={activeTasks.length} color={C.blue} /></div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {!isPastView && prevDaySource && activeTasks.length > 0 && (
              <button onClick={copySettingsFromPrevDay} className="font-mono text-2xs px-2 py-1.5 flex items-center gap-1 rounded-lg" style={{ color: C.violet, border: `1px solid ${C.violet}` }} title={`คัดลอกสไตล์/เทมเพลต/ความยาว จากวันที่ ${prevDaySource.date}`}>
                <RefreshCw size={11} /> ใช้สไตล์จากวันก่อน
              </button>
            )}
            <button onClick={resetActiveDay} className="font-mono text-2xs px-2 py-1.5 flex items-center gap-1 rounded-lg" style={{ color: C.muted, border: `1px solid ${C.border}` }}>{isFutureView ? 'ล้างงานที่เตรียมไว้' : isPastView ? 'ล้างงานของวันนี้' : 'เริ่มวันใหม่'}</button>
          </div>
        </div>

        {showAdd ? (
          <AddChannelForm onAdd={addChannel} onClose={() => setShowAdd(false)} />
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full mb-4 font-mono text-2xs px-3 py-2.5 flex items-center justify-center gap-2 rounded-xl" style={{ background: BRAND, color: '#fff' }}><Plus size={14} /> เพิ่มช่อง/เพจ</button>
        )}

        {/* วันเก่าที่เคยบันทึกไว้แค่ตัวเลขสรุป (ยังไม่มีรายการงานจริง) — สร้างรายการขึ้นมาให้เคลียร์ได้ */}
        {isPastView && activeTasks.length === 0 && pastEntry && pastEntry.totalTasks > 0 && (
          <div className="mb-4 p-4 rounded-2xl" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}55` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle size={14} style={{ color: C.orange }} className="shrink-0" />
              <span className="font-body text-sm" style={{ color: C.text }}>วันนี้มีงานค้างอยู่ {pastEntry.totalTasks - pastEntry.doneTasks} จาก {pastEntry.totalTasks} งาน</span>
            </div>
            <p className="font-body text-xs leading-relaxed mb-3" style={{ color: C.muted }}>
              แต่ระบบเก็บไว้แค่ยอดสรุป ยังไม่มีรายละเอียดงานรายชิ้น (เป็นข้อมูลที่บันทึกไว้ก่อนอัปเดตระบบ) กดปุ่มด้านล่างเพื่อสร้างรายการงานของวันนั้นขึ้นมาจากช่องที่มีอยู่ตอนนี้ แล้วเข้าไปทำ/ติ๊กเคลียร์ย้อนหลังได้เลย
            </p>
            <button onClick={rebuildPastDay} className="font-mono text-2xs px-3 py-1.5 flex items-center gap-1 rounded-lg" style={{ background: C.orange, color: '#fff' }}>
              <RefreshCw size={12} /> สร้างรายการงานของวันนี้ขึ้นมา
            </button>
          </div>
        )}

        {visibleChannels.length === 0 ? (
          <p className="font-body text-sm text-center py-8" style={{ color: C.muted }}>
            {isPastView ? 'ไม่มีรายการงานสำหรับวันนี้ — เพิ่มช่อง/เพจ หรือกดปุ่มสร้างรายการงานด้านบนเพื่อเริ่มเคลียร์ย้อนหลัง' : 'ยังไม่มีช่อง — เพิ่มช่อง/เพจแรกของคุณ เช่น "ช่องวาฬ" แล้วบอกว่าวันนี้ต้องลงวิดีโอ/รูปกี่ชิ้น'}
          </p>
        ) : (
          visibleChannels.map((c) => (
            <DailyChannelBlock key={c.id} channel={c} tasks={activeTasks.filter((t) => t.channelId === c.id)} onToggle={toggleTask} onUpdate={updateTaskField} onGenOutline={genOutline} onGenPrompts={genPrompts} onGenMeta={genMeta} onQC={runQC} onAnalyzeReview={analyzeReview} onReset={resetTask} onDeleteTask={removeTask} loadingMap={loadingMap} onRemove={removeChannel} onAddPlatform={addPlatform} onRemovePlatform={removePlatform} onGenerateAll={generateAll} generatingAll={generatingAllId === c.id} onQCAll={qcAll} qcAllRunning={qcAllId === c.id} readOnly={false} />
          ))
        )}
        <p className="font-mono text-2xs mt-6 leading-relaxed text-center" style={{ color: C.muted }}>* ข้อมูลบันทึกไว้ในฐานข้อมูลแล้ว ไม่หายเมื่อรีเฟรชหรือกลับมาใหม่ · งานที่เตรียมล่วงหน้าจะขึ้นเป็นงานจริงอัตโนมัติเมื่อถึงวันนั้น · กด "← ก่อนหน้า" เพื่อย้อนกลับไปดู/แก้งานของวันก่อนๆ ได้</p>
      </div>

      <div className="space-y-4 lg:sticky lg:top-6">
        <TodayStatusCard tasks={tasks} history={history} />
        <MiniCalendarCard history={history} tasks={tasks} activeDate={activeDate} onSelectDate={(d) => setViewDate(d === todayStr ? null : d)} onOpenCalendar={onOpenCalendar} />
        <PlatformCheckPanel channels={channels} onUpdateCheckLink={updateCheckLink} />
      </div>
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
  const [loadOk, setLoadOk] = useState(false);   // true เมื่อโหลดข้อมูลจากฐานข้อมูลสำเร็จจริง
  const [trash, setTrash] = useState([]);       // ถังขยะ เก็บของที่ลบไว้ 30 วัน
  const [metrics, setMetrics] = useState([]);   // สถิติจริงที่อ่านมาจากภาพหน้าจอแพลตฟอร์ม
  const [plans, setPlans] = useState([]);       // แผนการเติบโตที่ AI วางให้
  const [rivals, setRivals] = useState([]);     // คลังถอดสูตรคู่แข่ง
  const [tokens, setTokens] = useState(null);   // สถานะโทเค็นของผู้ใช้คนนี้
  const [ads, setAds] = useState([]);           // ข้อมูลแคมเปญโฆษณาที่อ่านมาจากภาพ
  const [features, setFeatures] = useState(null); // ฟีเจอร์ที่เจ้าของระบบเปิดให้ใช้
  const [deptData, setDeptData] = useState([]);   // ผลงานจากเครื่องมือ AI ของแต่ละแผนก
  const [userRole, setUserRole] = useState('staff'); // staff | manager | exec | dev
  const [loadError, setLoadError] = useState('');
  const [history, setHistory] = useState([]);
  const [futureTasks, setFutureTasks] = useState({});
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [pendingViewDate, setPendingViewDate] = useState(null); // เปิดจากหน้าปฏิทิน (ดับเบิลคลิกวันที่) แล้วพาไปหน้างานประจำวันของวันนั้น
  const [toast, setToast] = useState('');
  // ---------- Undo / Redo ----------
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const lastSnapRef = useRef(null);
  const [undoInfo, setUndoInfo] = useState({ undo: 0, redo: 0 });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  // เก็บสแนปช็อตของข้อมูลงานไว้ย้อนกลับ — หน่วงไว้เล็กน้อยเพื่อรวมการพิมพ์รัวๆ ให้เป็นการแก้ครั้งเดียว
  useEffect(() => {
    if (!dataLoaded || !user) return;
    const snap = JSON.stringify({ channels, tasks, futureTasks });
    if (lastSnapRef.current === null) { lastSnapRef.current = snap; return; }
    if (lastSnapRef.current === snap) return;
    const prev = lastSnapRef.current;
    const timer = setTimeout(() => {
      undoStackRef.current = [...undoStackRef.current.slice(-39), prev];
      redoStackRef.current = [];
      lastSnapRef.current = snap;
      setUndoInfo({ undo: undoStackRef.current.length, redo: 0 });
    }, 600);
    return () => clearTimeout(timer);
  }, [channels, tasks, futureTasks, dataLoaded, user]);

  function applySnapshot(raw) {
    const data = JSON.parse(raw);
    lastSnapRef.current = raw;
    setChannels(data.channels || []);
    setTasks(data.tasks || []);
    setFutureTasks(data.futureTasks || {});
  }
  function undo() {
    if (undoStackRef.current.length === 0) { showToast('ไม่มีอะไรให้ย้อนกลับแล้ว'); return; }
    const prev = undoStackRef.current[undoStackRef.current.length - 1];
    undoStackRef.current = undoStackRef.current.slice(0, -1);
    redoStackRef.current = [...redoStackRef.current.slice(-39), JSON.stringify({ channels, tasks, futureTasks })];
    applySnapshot(prev);
    setUndoInfo({ undo: undoStackRef.current.length, redo: redoStackRef.current.length });
    showToast('ย้อนกลับแล้ว');
  }
  function redo() {
    if (redoStackRef.current.length === 0) { showToast('ไม่มีอะไรให้ทำซ้ำ'); return; }
    const next = redoStackRef.current[redoStackRef.current.length - 1];
    redoStackRef.current = redoStackRef.current.slice(0, -1);
    undoStackRef.current = [...undoStackRef.current.slice(-39), JSON.stringify({ channels, tasks, futureTasks })];
    applySnapshot(next);
    setUndoInfo({ undo: undoStackRef.current.length, redo: redoStackRef.current.length });
    showToast('ทำซ้ำแล้ว');
  }

  function handleSignup(account) { setAccounts((prev) => [...prev, account]); }
  function handleLogin(account) {
    setAccounts((prev) => prev.map((a) => (a.email === account.email ? { ...a, lastLogin: account.lastLogin || Date.now() } : a)));
    // โทเค็นถูกบันทึกไว้แล้วตอนล็อกอินสำเร็จ (ในหน้า Terminal)
    setUser({ name: account.name, clearance: account.clearance, email: account.email, isOwner: !!account.isOwner, otpExempt: !!account.otpExempt, hasGeminiKey: !!account.hasGeminiKey });
    setStage('daily');
    setTimeout(refreshMe, 100);
  }
  async function updateAccountClearance(email, clearance) {
    setAccounts((prev) => prev.map((a) => (a.email === email ? { ...a, clearance } : a)));
    try {
      await apiPost('/api/auth', { action: 'updateClearance', email, clearance });
    } catch (err) {}
  }
  // เจ้าของระบบตั้งค่ายกเว้นตัวเองจากการยืนยัน OTP ได้ (ผู้ใช้คนอื่นไม่มีปุ่มนี้ ต้องทำตามกฎปกติเสมอ)
  async function toggleOwnOtpExempt() {
    const next = !user.otpExempt;
    setUser((u) => ({ ...u, otpExempt: next }));
    try {
      await apiPost('/api/auth', { action: 'updateOtpExempt', otpExempt: next });
    } catch (err) {}
  }
  async function updateProfile(patch) {
    setAccounts((prev) => prev.map((a) => (a.email === user.email ? { ...a, ...patch } : a)));
    if (patch.name) setUser((u) => ({ ...u, name: patch.name }));
    try {
      await apiPost('/api/auth', { action: 'updateProfile', patch });
    } catch (err) {}
  }

  // โหลดข้อมูลจากฐานข้อมูลตอนเปิดเว็บ (บัญชี + ช่อง/เพจ + งาน + ประวัติ) ลบบัญชีหมดอายุ และเก็บประวัติวันก่อนหน้าถ้าข้ามวันมาแล้ว
  // โหลดข้อมูลหลังล็อกอินแล้วเท่านั้น (ก่อนหน้านี้โหลดทันทีตอนเปิดหน้า ทำให้โดนปฏิเสธสิทธิ์แล้วได้ค่าว่าง)
  useEffect(() => {
    if (!user) return;
    if (dataLoaded) return;
    async function loadAll() {
      try {
        const [accRes, chRes, taskRes, histRes, dateRes, futureRes, trashRes, metricRes, planRes, rivalRes, adRes, deptRes] = await Promise.all([
          apiPost('/api/auth', { action: 'listAccounts' }),
          api('/api/store?key=channels'),
          api('/api/store?key=tasks'),
          api('/api/store?key=history'),
          api('/api/store?key=lastActiveDate'),
          api('/api/store?key=futureTasks'),
          api('/api/store?key=trash'),
          api('/api/store?key=metrics'),
          api('/api/store?key=plans'),
          api('/api/store?key=rivals'),
          api('/api/store?key=ads'),
          api('/api/store?key=deptData'),
        ]);
        const accData = accRes.data;
        const chData = chRes.data;
        const taskData = taskRes.data;
        const histData = histRes.data;
        const dateData = dateRes.data;
        const futureData = futureRes.data;
        const trashData = trashRes.data;
        const metricData = metricRes.data;
        const planData = planRes.data;
        const rivalData = rivalRes.data;
        const adData = adRes.data;
        const deptD = deptRes.data;

        const rawChannels = Array.isArray(chData.value) ? chData.value : [];
        const rawTasks = Array.isArray(taskData.value) ? taskData.value : [];
        const today = todayDateStr();
        let loadedFutureTasks = (futureData.value && typeof futureData.value === 'object') ? futureData.value : {};
        // ปรับข้อมูลเก่า (ถ้ามีช่อง/งานที่สร้างไว้ก่อนอัปเดตระบบหลายแพลตฟอร์มต่อช่อง / สีประจำช่อง) ให้เข้ารูปแบบใหม่
        const oldPlatformByChannelId = {};
        const loadedChannels = rawChannels.map((c, idx) => {
          const color = c.color || CHANNEL_COLORS[idx % CHANNEL_COLORS.length];
          if (Array.isArray(c.platforms)) return { ...c, color, platforms: c.platforms.map((p) => ({ ...p, checkLink: p.checkLink || '' })) };
          const plat = c.platform || 'other';
          oldPlatformByChannelId[c.id] = plat;
          return { id: c.id, name: c.name, color, platforms: [{ platform: plat, dailyVideos: c.dailyVideos || 0, dailyImages: c.dailyImages || 0, checkLink: '' }] };
        });
        let loadedTasks = rawTasks.map((t) => {
          if (t.platform) return t.date ? t : { ...t, date: today };
          const plat = oldPlatformByChannelId[t.channelId] || 'other';
          return { ...emptyTask(t.id, t.channelId, plat, t.type, t.label, today), done: !!t.done };
        });
        loadedTasks = dedupeTasks(loadedTasks);
        let loadedHistory = Array.isArray(histData.value) ? histData.value : [];
        const loadedLastDate = dateData.value || null;

        if (loadedLastDate && loadedLastDate !== today && loadedTasks.length > 0) {
          const missed = loadedTasks.filter((t) => !t.done).map((t) => {
            const ch = loadedChannels.find((c) => c.id === t.channelId);
            return { channelName: ch ? ch.name : '-', label: t.label };
          });
          // เก็บงานของวันก่อนหน้าแบบเต็ม (ไม่ใช่แค่สรุปตัวเลข) ไว้ใน history เพื่อให้ย้อนกลับไปดู/แก้ไขงานค้างของวันก่อนๆ ได้จริง
          const entry = { date: loadedLastDate, totalTasks: loadedTasks.length, doneTasks: loadedTasks.filter((t) => t.done).length, missed, tasks: loadedTasks };
          if (!loadedHistory.some((h) => h.date === loadedLastDate)) {
            loadedHistory = [...loadedHistory, entry];
          } else {
            loadedHistory = loadedHistory.map((h) => (h.date === loadedLastDate && !Array.isArray(h.tasks) ? { ...h, tasks: loadedTasks } : h));
          }
          if (missed.length > 0) setReminder(entry);
          if (loadedFutureTasks[today]) {
            loadedTasks = loadedFutureTasks[today];
            const { [today]: _omit, ...restFuture } = loadedFutureTasks;
            loadedFutureTasks = restFuture;
          } else {
            loadedTasks = loadedTasks.map((t) => emptyTask(t.id, t.channelId, t.platform, t.type, t.label, today));
          }
        }

        setAccounts(Array.isArray(accData.accounts) ? accData.accounts : []);
        setChannels(loadedChannels);
        setTasks(loadedTasks);
        setHistory(loadedHistory);
        setFutureTasks(loadedFutureTasks);
        // ล้างของในถังขยะที่เกิน 30 วันออกอัตโนมัติ
        const rawTrash = Array.isArray(trashData.value) ? trashData.value : [];
        setTrash(rawTrash.filter((t) => Date.now() - (t.at || 0) < 30 * 24 * 60 * 60 * 1000));
        setMetrics(Array.isArray(metricData.value) ? metricData.value : []);
        setPlans(Array.isArray(planData.value) ? planData.value : []);
        setRivals(Array.isArray(rivalData.value) ? rivalData.value : []);
        setAds(Array.isArray(adData.value) ? adData.value : []);
        setDeptData(Array.isArray(deptD.value) ? deptD.value : []);
        setLastActiveDate(today);
        setLoadOk(true); // โหลดสำเร็จจริงเท่านั้น ถึงจะยอมให้เขียนทับฐานข้อมูลได้
      } catch (err) {
        setLoadError('โหลดข้อมูลไม่สำเร็จ — ระบบจะไม่บันทึกทับข้อมูลเดิม เพื่อกันข้อมูลหาย กรุณารีเฟรชหน้าใหม่');
      } finally {
        setDataLoaded(true);
      }
    }
    loadAll();
  }, [user, dataLoaded]);

  // บันทึกช่อง/เพจ งานประจำวัน และประวัติ ลงฐานข้อมูลทุกครั้งที่เปลี่ยน (หลังโหลดข้อมูลเสร็จแล้วเท่านั้น)
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'channels', value: channels }).catch(() => {});
  }, [channels, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'tasks', value: tasks }).catch(() => {});
  }, [tasks, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'history', value: history }).catch(() => {});
  }, [history, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'futureTasks', value: futureTasks }).catch(() => {});
  }, [futureTasks, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user || !lastActiveDate) return;
    apiPost('/api/store', { key: 'lastActiveDate', value: lastActiveDate }).catch(() => {});
  }, [lastActiveDate, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'trash', value: trash }).catch(() => {});
  }, [trash, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'metrics', value: metrics }).catch(() => {});
  }, [metrics, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'plans', value: plans }).catch(() => {});
  }, [plans, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'rivals', value: rivals }).catch(() => {});
  }, [rivals, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'ads', value: ads }).catch(() => {});
  }, [ads, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'deptData', value: deptData }).catch(() => {});
  }, [deptData, dataLoaded, loadOk, user]);

  function openDept(dept) {
    if (user.clearance < dept.clearance) { setDenied(dept.id); setTimeout(() => setDenied(null), 1200); return; }
    setActiveDept(dept); setStage('department');
  }
  // ลบงานกำพร้า (งานที่ช่องถูกลบไปแล้วแต่ตัวงานยังค้าง)
  async function fixOrphanTasks() {
    const ids = new Set(channels.map((c) => c.id));
    setTasks((prev) => prev.filter((t) => ids.has(t.channelId)));
    setFutureTasks((prev) => {
      const next = {};
      Object.keys(prev).forEach((d) => { next[d] = (prev[d] || []).filter((t) => ids.has(t.channelId)); });
      return next;
    });
    setHistory((prev) => prev.map((h) => (Array.isArray(h.tasks) ? { ...h, tasks: h.tasks.filter((t) => ids.has(t.channelId)) } : h)));
    showToast('ลบงานกำพร้าเรียบร้อย');
  }
  async function runBackupNow() {
    const { ok } = await apiPost('/api/auth', { action: 'runBackup' });
    showToast(ok ? 'สำรองข้อมูลแล้ว' : 'สำรองไม่สำเร็จ');
  }

  // ---------- ถังขยะ ----------
  function sendToTrash(kind, label, payload) {
    setTrash((prev) => [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, label, payload, at: Date.now() }].slice(-200));
  }
  function restoreFromTrash(id) {
    const item = trash.find((t) => t.id === id);
    if (!item) return;
    if (item.kind === 'channel') {
      setChannels((prev) => (prev.some((c) => c.id === item.payload.channel.id) ? prev : [...prev, item.payload.channel]));
      setTasks((prev) => [...prev, ...(item.payload.tasks || []).filter((t) => !prev.some((x) => x.id === t.id))]);
    } else if (item.kind === 'task') {
      setTasks((prev) => (prev.some((t) => t.id === item.payload.task.id) ? prev : [...prev, item.payload.task]));
    }
    setTrash((prev) => prev.filter((t) => t.id !== id));
    showToast('กู้คืนแล้ว');
  }
  function purgeFromTrash(id) {
    if (!window.confirm('ลบถาวร กู้คืนไม่ได้อีก ยืนยันหรือไม่?')) return;
    setTrash((prev) => prev.filter((t) => t.id !== id));
  }
  function emptyTrash() {
    if (!window.confirm('ล้างถังขยะทั้งหมด กู้คืนไม่ได้อีก ยืนยันหรือไม่?')) return;
    setTrash([]);
  }

  // "ไม่ทำแล้ว" — ลบเฉพาะงานที่ยังไม่เสร็จของวันนั้นออก งานที่ทำเสร็จแล้วยังอยู่ครบ
  function dismissOverdueDay(dateStr) {
    setHistory((prev) => prev.map((h) => {
      if (h.date !== dateStr) return h;
      const kept = Array.isArray(h.tasks) ? h.tasks.filter((t) => t.done) : [];
      return { ...h, tasks: kept, missed: [], totalTasks: kept.length, doneTasks: kept.length, dismissed: true };
    }));
  }

  async function refreshMe() {
    const { ok, data } = await apiPost('/api/auth', { action: 'me' });
    if (ok && data.account) {
      setUser((u) => ({ ...u, hasGeminiKey: !!data.account.hasGeminiKey, clearance: data.account.clearance, isOwner: !!data.account.isOwner }));
      setTokens(data.tokens || null);
      setFeatures(data.features || null);
      setUserRole(data.role || 'staff');
      setAiGap(data.account.hasGeminiKey ? 1500 : 13000);
    }
  }
  useEffect(() => {
    function onTok(e) {
      const left = e.detail?.left;
      if (left == null) return;
      setTokens((t) => (t ? { ...t, left: left === -1 ? Infinity : left, used: (t.used || 0) + (e.detail.cost || 0) } : t));
    }
    window.addEventListener('forge-tokens', onTok);
    return () => window.removeEventListener('forge-tokens', onTok);
  }, []);

  function logout() {
    clearSession();
    setUser(null); setStage('terminal'); setActiveDept(null);
    // ล้างสถานะการโหลด เพื่อไม่ให้ข้อมูลของคนก่อนหน้าค้างอยู่ และไม่ให้บันทึกทับตอนยังไม่ได้ล็อกอิน
    setDataLoaded(false); setLoadOk(false); setLoadError('');
    setChannels([]); setTasks([]); setHistory([]); setFutureTasks({});
  }

  // กู้คืนการล็อกอินเดิมตอนเปิดหน้าใหม่ (รีเฟรชแล้วไม่ต้องล็อกอินซ้ำ)
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      // ไม่เชื่อข้อมูลในเบราว์เซอร์ — ถามเซิร์ฟเวอร์ว่าโทเค็นนี้เป็นของใครและมีสิทธิ์แค่ไหน
      apiPost('/api/auth', { action: 'me' })
        .then(({ ok, data }) => {
          if (ok && data.account) {
            setUser({
              name: data.account.name,
              email: data.account.email,
              clearance: data.account.clearance,
              isOwner: !!data.account.isOwner,
              otpExempt: !!data.account.otpExempt,
              hasGeminiKey: !!data.account.hasGeminiKey,
            });
            setTokens(data.tokens || null);
            setFeatures(data.features || null);
            setUserRole(data.role || 'staff');
            if (data.account.hasGeminiKey) setAiGap(1500);
            setStage('daily');
          } else {
            clearSession();
          }
        })
        .catch(() => clearSession());
    }
  }, []);

  // ส่งสถานะว่ากำลังอยู่หน้าไหน ทุก 45 วินาที (ให้เจ้าของเห็นแบบเรียลไทม์)
  useEffect(() => {
    if (!user) return;
    const send = () => { apiPost('/api/auth', { action: 'presence', page: stage }).catch(() => {}); };
    send();
    const id = setInterval(send, 45000);
    return () => clearInterval(id);
  }, [user, stage]);

  // โทเค็นหมดอายุหรือถูกเพิกถอน — เด้งกลับหน้าล็อกอินทันที
  useEffect(() => {
    function onExpired() { setUser(null); setStage('terminal'); setActiveDept(null); }
    window.addEventListener('forge-session-expired', onExpired);
    return () => window.removeEventListener('forge-session-expired', onExpired);
  }, []);

  // เขียนทับข้อมูลทั้งหมดจากไฟล์สำรอง (ระบบบันทึกขึ้นฐานข้อมูลให้เองอัตโนมัติหลังจากนี้)
  async function importBackup(data) {
    setChannels(Array.isArray(data.channels) ? data.channels : []);
    setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    setFutureTasks((data.futureTasks && typeof data.futureTasks === 'object') ? data.futureTasks : {});
    setHistory(Array.isArray(data.history) ? data.history : []);
  }

  // คีย์ลัดเปลี่ยนหน้า (ใช้ได้เมื่อไม่ได้พิมพ์อยู่ในช่องกรอกข้อความ)
  useEffect(() => {
    function handleKey(e) {
      if (!user || stage === 'terminal') return;
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;

      // ---- คีย์ลัดที่ใช้ได้แม้กำลังพิมพ์อยู่ (ต้องกดร่วมกับ Cmd/Ctrl) ----
      if (mod) {
        const k = (e.key || '').toLowerCase();
        if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
        if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); redo(); return; }
        if (k === 's') { e.preventDefault(); showToast('ระบบบันทึกให้อัตโนมัติอยู่แล้ว ไม่ต้องกดบันทึก'); return; }
        if (k === 'k') { e.preventDefault(); setStage('settings'); return; }
        return;
      }

      if (typing) {
        if (e.key === 'Escape') e.target.blur(); // กด Esc เพื่อออกจากช่องพิมพ์
        return;
      }

      // ---- คีย์ลัดตัวเลข: สลับหน้า ----
      const map = { '1': 'daily', '2': 'calendar', '3': 'directory', '4': 'platforms', '5': 'analytics', '6': 'security', '?': 'settings' };
      if (map[e.key]) { setStage(map[e.key]); return; }
      if (e.key === 'g' || e.key === 'G') { setStage('daily'); return; } // g = กลับหน้างานประจำวัน

      // ---- เลื่อนวัน (ใช้ได้เฉพาะหน้างานประจำวัน) ----
      if (stage === 'daily') {
        if (e.key === 'ArrowLeft') { e.preventDefault(); window.dispatchEvent(new CustomEvent('forge-day-nav', { detail: { dir: -1 } })); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); window.dispatchEvent(new CustomEvent('forge-day-nav', { detail: { dir: 1 } })); return; }
        if (e.key === 't' || e.key === 'T') { window.dispatchEvent(new CustomEvent('forge-day-nav', { detail: { dir: 0 } })); return; }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [user, stage, channels, tasks, futureTasks]);

  if (user && !dataLoaded) {
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
        <div className="flex">
          <Sidebar user={user} stage={stage} setStage={setStage} logout={logout} accounts={accounts} tasks={tasks} history={history} tokens={tokens} features={features} onOpenDay={(dateStr) => { setPendingViewDate(dateStr); setStage('daily'); }} onDismissDay={dismissOverdueDay} />
          <div className="flex-1 min-w-0">
            {stage === 'daily' && <DailyWork channels={channels} setChannels={setChannels} tasks={tasks} setTasks={setTasks} futureTasks={futureTasks} setFutureTasks={setFutureTasks} history={history} setHistory={setHistory} reminder={reminder} onDismissReminder={() => setReminder(null)} onOpenCalendar={() => setStage('calendar')} initialViewDate={pendingViewDate} onConsumeInitialViewDate={() => setPendingViewDate(null)} onTrash={sendToTrash} />}
            {stage === 'directory' && <Directory user={user} denied={denied} onOpen={openDept} features={features} />}
            {stage === 'department' && activeDept && <DepartmentView dept={activeDept} onBack={() => setStage('directory')} records={deptData} setRecords={setDeptData} showToast={showToast} />}
            {stage === 'calendar' && <CalendarPage history={history} tasks={tasks} channels={channels} futureTasks={futureTasks} onOpenDay={(dateStr) => { setPendingViewDate(dateStr); setStage('daily'); }} />}
            {stage === 'platforms' && <PlatformsPanel />}
            {stage === 'team' && user.clearance === 3 && <TeamPanel accounts={accounts} onUpdateClearance={updateAccountClearance} />}
            {stage === 'analytics' && <AnalyticsPage user={user} features={features} history={history} tasks={tasks} channels={channels} metrics={metrics} setMetrics={setMetrics} plans={plans} setPlans={setPlans} setTasks={setTasks} rivals={rivals} setRivals={setRivals} ads={ads} setAds={setAds} showToast={showToast} />}
            {stage === 'kpi' && <KpiPage history={history} tasks={tasks} channels={channels} />}
            {stage === 'settings' && <SettingsPage user={user} accounts={accounts} backupData={{ channels, tasks, futureTasks, history, lastActiveDate }} onImportBackup={importBackup} tokens={tokens} refreshMe={refreshMe} showToast={showToast} onFixOrphans={fixOrphanTasks} onBackupNow={runBackupNow} trash={trash} onRestoreTrash={restoreFromTrash} onPurgeTrash={purgeFromTrash} onEmptyTrash={emptyTrash} channels={channels} tasks={tasks} history={history} futureTasks={futureTasks} loadOk={loadOk} />}
            {stage === 'profile' && <ProfilePage user={user} accounts={accounts} tasks={tasks} history={history} onUpdateProfile={updateProfile} />}
            {stage === 'security' && <SecurityProtocol user={user} onToggleOwnOtpExempt={toggleOwnOtpExempt} />}
          </div>

          {/* แถบย้อนกลับ/ทำซ้ำ ลอยมุมขวาล่าง (⌘Z / ⌘⇧Z) */}
          <div className="fixed bottom-4 right-4 flex items-center gap-1.5 px-1.5 py-1.5 rounded-xl z-40" style={{ background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 8px 24px -12px rgba(0,0,0,0.8)' }}>
            <button onClick={undo} disabled={undoInfo.undo === 0} title="ย้อนกลับ (⌘Z / Ctrl+Z)" aria-label="ย้อนกลับ" className="p-1.5 rounded-lg" style={{ color: undoInfo.undo === 0 ? C.border : C.text }}>
              <Undo2 size={15} />
            </button>
            <button onClick={redo} disabled={undoInfo.redo === 0} title="ทำซ้ำ (⌘⇧Z / Ctrl+Y)" aria-label="ทำซ้ำ" className="p-1.5 rounded-lg" style={{ color: undoInfo.redo === 0 ? C.border : C.text }}>
              <Redo2 size={15} />
            </button>
          </div>
        </div>
      )}

      {/* แจ้งเตือนเมื่อโหลดข้อมูลไม่สำเร็จ — สำคัญมาก เพราะถ้าไม่บอก จะดูเหมือนข้อมูลหายทั้งที่ยังอยู่ */}
      {loadError && (
        <div className="fixed top-3 left-1/2 z-50" style={{ transform: 'translateX(-50%)' }}>
          <div className="px-4 py-2.5 rounded-xl font-body text-xs flex items-center gap-2" style={{ background: `${C.red}22`, color: C.text, border: `1px solid ${C.red}` }}>
            <AlertTriangle size={14} style={{ color: C.red }} className="shrink-0" />
            <span>{loadError}</span>
            <button onClick={() => window.location.reload()} className="font-mono text-2xs px-2 py-1 rounded-lg shrink-0" style={{ border: `1px solid ${C.red}`, color: C.red }}>รีเฟรช</button>
          </div>
        </div>
      )}

      {/* ข้อความแจ้งสั้นๆ กลางล่างจอ */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 anim-fade" style={{ transform: 'translateX(-50%)' }}>
          <div className="px-3.5 py-2 rounded-xl font-body text-xs whitespace-nowrap" style={{ background: C.panel, color: C.text, border: `1px solid ${C.border}`, boxShadow: '0 8px 24px -12px rgba(0,0,0,0.8)' }}>{toast}</div>
        </div>
      )}
    </div>
  );
}
