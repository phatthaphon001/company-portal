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
  Compass, ShoppingCart, Mic2, Clapperboard, ArrowRight, Clock,
  Layers, Building2, Zap, Shield, Check, FileSpreadsheet, ExternalLink, BadgeCheck,
  BarChart3, Swords, Handshake, MessageSquare, Package,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

// ---------- ธีมสี ----------
// ค่าสีต้องเป็นรหัส hex จริง เพราะทั้งไฟล์มีการต่อความโปร่งใสท้ายสี เช่น `${C.violet}44`
// ถ้าใช้ CSS variable จะพังทันที จึงใช้วิธีเขียนทับค่าในตัวแปรแล้วสั่งวาดใหม่ทั้งหน้าแทน
const THEMES = {
  dark: {
    label: 'ดำ (ค่าเริ่มต้น)', isLight: false,
    bg: '#0A0A0F', bgDeep: '#050506', panel: '#15161D', panelAlt: '#1B1C26',
    border: 'rgba(255,255,255,0.08)', text: '#F5F5F7', muted: '#9195A3',
    blue: '#3B82F6', cyan: '#22D3EE', violet: '#A78BFA', pink: '#F472B6',
    emerald: '#34D399', orange: '#FB923C', teal: '#2DD4BF', red: '#F87171',
  },
  navy: {
    label: 'กรมท่า', isLight: false,
    bg: '#0C1524', bgDeep: '#070D18', panel: '#132135', panelAlt: '#1A2B42',
    border: 'rgba(190,210,235,0.12)', text: '#EEF3FA', muted: '#93A4BD',
    blue: '#5B9BF8', cyan: '#3EC9E5', violet: '#9D8CF0', pink: '#EF7FAF',
    emerald: '#3FBF92', orange: '#EE9A4C', teal: '#35BFB4', red: '#EE7A7A',
  },
  slate: {
    label: 'เทา', isLight: false,
    bg: '#15171A', bgDeep: '#0E1012', panel: '#1E2126', panelAlt: '#262A31',
    border: 'rgba(255,255,255,0.10)', text: '#F0F1F3', muted: '#9BA1AB',
    blue: '#5E9CF5', cyan: '#3FC7DE', violet: '#A292EE', pink: '#EC85AE',
    emerald: '#46BE92', orange: '#EC9A55', teal: '#3BBDB2', red: '#EC7C7C',
  },
  light: {
    label: 'ขาว-กรมท่า (สว่าง)', isLight: true,
    bg: '#F4F6FA', bgDeep: '#E9EDF4', panel: '#FFFFFF', panelAlt: '#F7F9FC',
    border: 'rgba(20,40,70,0.14)', text: '#16233A', muted: '#5C6B84',
    blue: '#1D5FD0', cyan: '#0E8FA8', violet: '#6D4FD0', pink: '#C43F7C',
    emerald: '#127A55', orange: '#B4600E', teal: '#0E7C73', red: '#C23B3B',
  },
};

const C = { ...THEMES.dark };
let BRAND = `linear-gradient(135deg, ${C.blue}, ${C.violet})`;

// เขียนทับค่าสีทั้งชุด แล้วรีเฟรชค่าที่คำนวณไว้ตอนโหลดไฟล์ด้วย
// ถ้าลืมรีเฟรชพวกนี้ สีของระดับสิทธิ์และไอคอนแพลตฟอร์มจะค้างเป็นธีมเดิม
function applyTheme(key) {
  const t = THEMES[key] || THEMES.dark;
  Object.assign(C, t);
  BRAND = `linear-gradient(135deg, ${C.blue}, ${C.violet})`;
  if (typeof CLEARANCE !== 'undefined') {
    CLEARANCE[1].color = C.cyan; CLEARANCE[2].color = C.orange; CLEARANCE[3].color = C.red;
  }
  if (typeof PLATFORM_META !== 'undefined') {
    PLATFORM_META.tiktok.color = C.pink; PLATFORM_META.facebook.color = C.blue;
    PLATFORM_META.youtube.color = C.red; PLATFORM_META.instagram.color = C.orange;
    PLATFORM_META.shopee.color = C.orange; PLATFORM_META.other.color = C.teal;
  }
  return t;
}

const CLEARANCE = {
  1: { label: 'ระดับ 1 · ทั่วไป', code: 'LV-1 STAFF', color: C.cyan },
  2: { label: 'ระดับ 2 · หัวหน้างาน', code: 'LV-2 MANAGER', color: C.orange },
  3: { label: 'ระดับ 3 · ผู้บริหาร', code: 'LV-3 EXECUTIVE', color: C.red },
};

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: C.pink, icon: Music2 },
  facebook: { label: 'Facebook', color: C.blue, icon: Share2 },
  youtube: { label: 'YouTube', color: C.red, icon: PlayCircle },
  instagram: { label: 'Instagram', color: C.pink, icon: Camera },
  threads: { label: 'Threads', color: C.text, icon: AtSign },
  lemon8: { label: 'Lemon8', color: C.emerald, icon: Sparkles },
  x: { label: 'X (Twitter)', color: C.text, icon: AtSign },
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
  {
    id: 'stock', th: 'ฝ่ายคลังสินค้า', en: 'STOCK & WAREHOUSE', clearance: 1,
    icon: Package, accent: '#22D3EE', manager: 'ผู้จัดการคลังสินค้า',
    brief: 'ดูแลสต๊อกสินค้าทั้งหมด รับเข้า จ่ายออก ของตีกลับ ของเสีย และคุมยอดคงเหลือให้ตรงกับความจริง',
    roles: [
      { title: 'เจ้าหน้าที่รับเข้า', en: 'Inbound Officer', duty: 'ตรวจรับสินค้าเข้าคลัง เทียบกับใบสั่งซื้อ และบันทึกจำนวนจริง' },
      { title: 'เจ้าหน้าที่จ่ายออก', en: 'Outbound Officer', duty: 'จัดของตามออเดอร์ แพ็ก และตัดสต๊อกให้ตรงกับที่ส่งจริง' },
      { title: 'เจ้าหน้าที่ตรวจนับ', en: 'Stock Auditor', duty: 'นับสต๊อกตามรอบ เทียบกับตัวเลขในระบบ และหาสาเหตุที่ไม่ตรง' },
      { title: 'ดูแลของตีกลับ', en: 'Returns Officer', duty: 'ตรวจของที่ลูกค้าส่งคืน แยกของขายต่อได้กับของเสีย' },
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
  { name: 'Instagram', icon: Camera, note: 'สำหรับโพสต์ภาพ รีล และสตอรี่' },
  { name: 'Threads', icon: AtSign, note: 'สำหรับโพสต์ข้อความสั้นและสร้างการสนทนา' },
  { name: 'Lemon8', icon: Sparkles, note: 'สำหรับคอนเทนต์ไลฟ์สไตล์ รีวิว และบิวตี้' },
  { name: 'Shopee', icon: ShoppingBag, note: 'สำหรับซิงค์สินค้าและออเดอร์' },
  { name: 'YouTube', icon: PlayCircle, note: 'สำหรับอัปโหลดและจัดการวิดีโอ' },
  { name: 'X (Twitter)', icon: AtSign, note: 'สำหรับโพสต์และติดตามการมีส่วนร่วม' },
];

const OUTLINE_SYS = 'คุณคือฝ่ายคิดคอนเทนต์ ช่วยคิดโครงเรื่อง/แนวคิดคอนเทนต์สั้นๆ (2-4 บรรทัด) เป็นภาษาไทย ถ้าผู้ใช้ระบุสไตล์หรือแนวที่ต้องการมา ต้องยึดตามนั้นเป็นหลักเสมอ (เช่น ถ้าขอการ์ตูนเด็ก โครงเรื่องต้องเป็นการ์ตูนเด็ก ไม่ใช่แค่พูดถึงหัวข้อช่องเฉยๆ) ห้ามซ้ำกับหัวข้อที่เคยทำไปแล้วที่ผู้ใช้แจ้งมาในข้อความ ตอบเฉพาะเนื้อหาโครงเรื่องเท่านั้น ห้ามทักทาย ห้ามใส่หัวข้อกำกับ ห้ามใส่เครื่องหมายคำพูด';
const PROMPTS_SYS_VIDEO = 'คุณคือฝ่ายคิดคอนเทนต์คลิปวิดีโอสั้น จากโครงเรื่องและรายละเอียดที่ให้มา ให้สร้าง 3 อย่างแยกกันชัดเจน ห้ามปนกัน: (1) videoPrompt = prompt สำหรับ AI สร้างวิดีโอ/ความเคลื่อนไหวโดยตรง ถ้าข้อความระบุ "จำนวนฉากที่ควรแบ่ง" มากกว่า 1 ฉาก ให้แบ่งเป็นฉากลำดับชัดเจนรูปแบบ "Scene 1: ... Scene 2: ... Scene 3: ..." แต่ละฉากยาวประมาณ 3-5 วินาที บรรยายแยกฉากละเอียดพอเอาไปสร้างทีละฉากแล้วต่อกันได้จริง ถ้าแค่ 1 ฉากให้เขียนต่อเนื่องปกติ (2) coverPrompt = prompt สำหรับสร้างภาพหน้าปก/thumbnail ที่จะโชว์บนแพลตฟอร์ม เป็นภาพนิ่งภาพเดียว (3) sourceImagePrompt = prompt สำหรับสร้างภาพนิ่งตั้งต้นภาพเดียว (ไม่ใช่หน้าปก) ที่จะเอาไปใช้กับ AI แบบ image-to-video เพื่อสร้างความเคลื่อนไหวต่อ เขียน prompt ทั้ง 3 เป็นภาษาอังกฤษที่ AI สร้างภาพ/วิดีโอเข้าใจง่าย ระบุสไตล์ให้ชัดเจน กติกาเพิ่มเติมที่ต้องทำตามเสมอ: (ก) ถ้าคลิปมีตัวละครที่พูดหรือปรากฏหลายฉาก ต้องล็อกลักษณะตัวละครไว้ในตอนต้นของ videoPrompt เป็นบล็อก "CHARACTER LOCK:" ระบุเพศ ช่วงอายุ ทรงผม สีผม เสื้อผ้า สีเสื้อผ้า และลักษณะเด่นบนใบหน้า แล้วอ้างถึงตัวละครด้วยชื่อเดิมทุกฉาก เพื่อไม่ให้ AI สร้างหน้าตาหรือชุดเปลี่ยนไปมาระหว่างฉาก (ข) ถ้ามีบทพูด ต้องระบุในแต่ละฉากว่าใครพูด น้ำเสียงแบบไหน และอารมณ์ขณะพูด ห้ามปล่อยให้ AI สลับบทพูดกันเอง (ค) การเปลี่ยนฉากต้องต่อเนื่องทางกายภาพ ถ้าตัวละครย้ายสถานที่ต้องมีฉากเชื่อม เช่น ฉากเปิดประตูหรือฉากเดิน ห้ามตัดจากห้องหนึ่งไปอีกห้องหนึ่งทันทีโดยไม่มีที่มา (ง) ห้ามใส่ข้อความกล่าวอ้างสรรพคุณเกินจริงลงในภาพหรือวิดีโอ เช่น คำว่า รักษา หายขาด ลดได้แน่นอน เห็นผลใน 7 วัน เพราะผิดกฎแพลตฟอร์มและกฎหมายโฆษณา ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอก JSON ห้ามใส่ ```json รูปแบบ: {"videoPrompt": "...", "coverPrompt": "...", "sourceImagePrompt": "..."}';
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
// ข้อมูลการค้นเว็บของคำขอล่าสุด — อ่านได้ทันทีหลัง callClaude คืนค่า
let lastSearchInfo = { sources: [], searchUsed: false, searchNote: null };
function getLastSearchInfo() { return lastSearchInfo; }

let aiChain = Promise.resolve();
let aiLastCallAt = 0;

function callClaude(system, content, images, action, opts) {
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
      body: JSON.stringify({ system, content, images, action, search: !!(opts && opts.search) }),
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
    // เก็บแหล่งอ้างอิงของการค้นเว็บครั้งล่าสุดไว้ต่างหาก
    // คืนค่าเป็นข้อความธรรมดาเหมือนเดิม เพื่อไม่ให้โค้ดเดิมทุกจุดต้องแก้ตาม
    lastSearchInfo = {
      sources: Array.isArray(data.sources) ? data.sources : [],
      searchUsed: !!data.searchUsed,
      searchNote: data.searchNote || null,
    };
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
    assignedTo: null,        // อีเมลคนที่ติ๊กงานนี้ว่าเสร็จล่าสุด — ใช้ในระบบติดตามทีม (เริ่มเก็บนับจากตอนนี้เป็นต้นไป)
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

// รายการหน้าที่ผู้ใช้คนนี้เข้าถึงได้ — ใช้ทั้งในเมนูข้างและแถบค้นหาคำสั่ง
function buildNavItems(user, features) {
  // เจ้าของระบบเข้าได้ทุกหน้าเสมอ แม้ฟีเจอร์นั้นจะถูกปิดไว้ (ตรงกับตรรกะเดิมของเมนู)
  const on = (k) => user.isOwner || !features || features.pages?.[k] !== false;
  return [
    { key: 'daily', label: 'งานประจำวัน', Icon: ClipboardCheck },
    ...(on('calendar') ? [{ key: 'calendar', label: 'ปฏิทิน', Icon: Calendar }] : []),
    ...(on('directory') ? [{ key: 'directory', label: 'Directory', Icon: FileText }] : []),
    ...(on('platforms') ? [{ key: 'platforms', label: 'แพลตฟอร์ม', Icon: Share2 }] : []),
    ...(user.clearance === 3 ? [{ key: 'team', label: 'ทีมงาน', Icon: Users }] : []),
    ...(on('analytics') ? [{ key: 'analytics', label: 'การวิเคราะห์', Icon: TrendingUp }] : []),
    ...(on('kpi') ? [{ key: 'kpi', label: 'KPI / รายเดือน', Icon: Target }] : []),
    ...(on('files') ? [{ key: 'files', label: 'ไฟล์ & เชื่อมต่อ', Icon: FileSpreadsheet }] : []),
    ...(on('security') ? [{ key: 'security', label: 'Protocol', Icon: ScrollText }] : []),
    { key: 'settings', label: 'Setting', Icon: SettingsIcon },
  ];
}

function Sidebar({ user, stage, setStage, logout, accounts, tasks, history, onOpenDay, onDismissDay, tokens, features, onOpenPalette }) {
  const account = (accounts || []).find((a) => a.email === user.email);
  const totalToday = tasks.length;
  const doneToday = tasks.filter((t) => t.done).length;
  const pct = totalToday === 0 ? 0 : Math.round((doneToday / totalToday) * 100);

  // เจ้าของระบบเห็นทุกหน้าเสมอ ส่วนคนอื่นเห็นเฉพาะหน้าที่เจ้าของเปิดให้
  const navItems = buildNavItems(user, features);

  return (
    <div className="w-16 sm:w-56 shrink-0 flex flex-col sticky top-0" style={{ height: '100vh', background: C.bgDeep, borderRight: `1px solid ${C.border}` }}>
      <button onClick={() => setStage('daily')} className="p-4 flex items-center justify-center sm:justify-start" aria-label="กลับหน้างานประจำวัน">
        <Wordmark fontSize={15} />
      </button>
      <div className="px-2 pb-2">
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
          aria-label="ค้นหาหน้าและเครื่องมือ"
          title="ค้นหา (Ctrl+K)"
        >
          <Search size={14} style={{ color: C.muted }} className="shrink-0" />
          <span className="font-body text-xs hidden sm:block flex-1 text-left" style={{ color: C.muted }}>ค้นหา…</span>
          <span className="font-mono hidden sm:block shrink-0 px-1.5 rounded" style={{ fontSize: 9, color: C.muted, border: `1px solid ${C.border}` }}>⌘K</span>
        </button>
      </div>
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

// แถบวัดความแข็งแรงของรหัสผ่าน — ช่วยให้ผู้ใช้ตั้งรหัสที่เดายาก โดยไม่บังคับจนน่ารำคาญ
function PasswordStrength({ value }) {
  const v = String(value || '');
  const checks = [
    { ok: v.length >= 8, label: 'อย่างน้อย 8 ตัว' },
    { ok: /[a-z]/.test(v) && /[A-Z]/.test(v), label: 'พิมพ์เล็ก+ใหญ่' },
    { ok: /[0-9]/.test(v), label: 'มีตัวเลข' },
    { ok: /[^A-Za-z0-9]/.test(v), label: 'มีอักขระพิเศษ' },
  ];
  const score = checks.filter((c) => c.ok).length;
  const color = score <= 1 ? C.red : score === 2 ? C.orange : score === 3 ? C.cyan : C.emerald;
  const label = score <= 1 ? 'อ่อนมาก' : score === 2 ? 'พอใช้' : score === 3 ? 'ดี' : 'แข็งแรง';
  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="flex-1 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < score ? color : C.border }} />
          ))}
        </div>
        <span className="font-mono shrink-0" style={{ fontSize: 9, color }}>{label}</span>
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
        {checks.map((c, i) => (
          <span key={i} className="font-mono" style={{ fontSize: 9, color: c.ok ? C.emerald : C.muted }}>
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Terminal({ accounts, onSignup, onLogin }) {
  const [mode, setMode] = useState('login');
  const [loginStep, setLoginStep] = useState('credentials');
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', code: '' });
  const [loginError, setLoginError] = useState('');
  const [otpRef, setOtpRef] = useState(''); // ตัวอ้างอิงแบบสุ่ม ไม่มีรหัสอยู่ข้างใน
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingAccount, setPendingAccount] = useState(null); // เก็บไว้แสดงชื่อระหว่างรอ OTP
  const [inviteCode, setInviteCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [joinMode, setJoinMode] = useState('create'); // create = สร้างองค์กรใหม่, join = เข้าร่วมองค์กรเดิม
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [gateMode, setGateMode] = useState(null);
  const [signupForm, setSignupForm] = useState({ nameTh: '', nameEn: '', username: '', email: '', password: '', confirm: '' });
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
      if (!sendOk || !data.ref) {
        // ส่งอีเมลไม่ได้ (เช่น ยังไม่ได้ยืนยันโดเมนใน Resend) — บอกให้ชัด อย่าปล่อยค้าง
        setLoginError((data.error || 'ส่งรหัสยืนยันไม่สำเร็จ') + ' — กรุณาแจ้งผู้ดูแลระบบให้ยกเว้นการยืนยันอีเมลให้บัญชีนี้');
        return;
      }
      setOtpRef(data.ref);
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
      const { ok, data } = await apiPost('/api/auth', { action: 'completeOtpLogin', otpRef, code: loginForm.code.trim() });
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
    if (!signupForm.nameTh.trim() || !signupForm.username.trim() || !signupForm.email.trim() || !signupForm.password) { setSignupError('กรอกข้อมูลให้ครบ'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email.trim())) { setSignupError('รูปแบบอีเมลไม่ถูกต้อง'); return; }
    if (signupForm.password.length < 8) { setSignupError('รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร'); return; }
    if (signupForm.password !== signupForm.confirm) { setSignupError('รหัสผ่านไม่ตรงกัน'); return; }
    if (!birthDate) { setSignupError('กรุณาระบุวันเกิดจริง (ใช้กับฟีเจอร์ในฝ่ายบุคคล)'); return; }
    if (joinMode === 'join' && !orgCode.trim()) { setSignupError('กรุณากรอกรหัสองค์กรที่ได้รับจากผู้ดูแล'); return; }
    setSignupLoading(true);
    try {
      const { ok, data } = await apiPost('/api/auth', { action: 'signup', name: signupForm.nameTh.trim(), nameEn: signupForm.nameEn.trim(), username: signupForm.username.trim(), email: signupForm.email.trim(), password: signupForm.password, birthDate, orgName: joinMode === 'create' ? orgName.trim() : '', orgCode: joinMode === 'join' ? orgCode.trim() : '', inviteCode: inviteCode.trim(), fingerprint: deviceFingerprint() });
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
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label="ชื่อ-นามสกุล (ไทย)" value={signupForm.nameTh} onChange={(e) => setSignupForm({ ...signupForm, nameTh: e.target.value })} placeholder="สมชาย ใจดี" required />
              <TextField label="ชื่อ-นามสกุล (อังกฤษ)" value={signupForm.nameEn} onChange={(e) => setSignupForm({ ...signupForm, nameEn: e.target.value })} placeholder="Somchai Jaidee" />
            </div>
            <TextField label="ชื่อผู้ใช้ / ชื่อเล่น (ใช้ล็อกอิน)" value={signupForm.username} onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value.replace(/\s/g, '') })} placeholder="ไทยหรืออังกฤษก็ได้ เช่น ชาย หรือ forge_admin" required />
            <TextField label="อีเมล" type="email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} placeholder="you@email.com" required />
            <div>
              <TextField label="รหัสผ่าน" type="password" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} placeholder="อย่างน้อย 8 ตัวอักษร" required />
              {signupForm.password && <PasswordStrength value={signupForm.password} />}
            </div>
            <div>
              <TextField label="ยืนยันรหัสผ่าน" type="password" value={signupForm.confirm} onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })} placeholder="พิมพ์รหัสผ่านอีกครั้ง" required />
              {signupForm.confirm && (
                <p className="font-mono mt-1" style={{ fontSize: 10, color: signupForm.password === signupForm.confirm ? C.emerald : C.red }}>
                  {signupForm.password === signupForm.confirm ? '✓ รหัสผ่านตรงกัน' : '✕ รหัสผ่านยังไม่ตรงกัน'}
                </p>
              )}
            </div>
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
      key: 'crossCheck', label: 'ตรวจงานข้ามแผนก', Icon: ClipboardCheck, color: '#FB923C',
      desc: 'วางผลงานจากแผนกไหนก็ได้มาตรวจ — ตรวจความถูกต้อง ความสอดคล้องกับแบรนด์ และความเสี่ยงผิดกฎ ก่อนส่งมอบหรือเผยแพร่',
      action: 'crossCheck', images: 6, useBrand: true,
      fields: [
        { k: 'from', label: 'งานจากแผนกไหน', ph: 'คอนเทนต์ / การตลาด / ฝ่ายขาย / วิเคราะห์', required: true },
        { k: 'work', label: 'เนื้องานที่จะตรวจ', ph: 'วางสคริปต์ แคปชั่น ใบเสนอราคา หรือผลวิเคราะห์มาตรงนี้', required: true, big: true },
        { k: 'standard', label: 'เกณฑ์ที่ต้องผ่าน', ph: 'ถ้ามีเกณฑ์เฉพาะขององค์กร', big: true },
      ],
      sys: `คุณคือฝ่ายตรวจสอบคุณภาพที่เข้มงวดและตรงไปตรงมา ตรวจงานจากแผนกอื่นก่อนปล่อยออก
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ผลตรวจคุณภาพ",
 "verdict":"ผ่าน|ผ่านแบบมีเงื่อนไข|ไม่ผ่าน",
 "score":0-10,
 "metrics":[{"label":"ความถูกต้อง","value":"8/10","note":"พบจุดต้องแก้ 2 จุด","trend":"เท่าเดิม"}],
 "charts":[{"type":"bar","title":"คะแนนรายด้าน (เต็ม 10)","data":[{"name":"ความถูกต้อง","value":8},{"name":"ตรงแบรนด์","value":6},{"name":"ความเสี่ยงกฎ","value":9}]}],
 "issues":[{"severity":"สูง|กลาง|ต่ำ","where":"จุดไหนของงาน","problem":"ปัญหาคืออะไร","fix":"แก้เป็นอะไร","whoFixes":"แผนกไหนต้องแก้"}],
 "brandFit":"งานนี้ตรงกับภาพลักษณ์แบรนด์ไหม อธิบาย",
 "legalRisk":"ความเสี่ยงด้านกฎแพลตฟอร์มและกฎหมายโฆษณา ถ้าไม่มีให้ใส่ ไม่พบ",
 "passConditions":["ถ้าผ่านแบบมีเงื่อนไข ต้องแก้อะไรก่อนถึงจะปล่อยได้"]
}
กติกาเข้มงวด: ตรวจจากเนื้องานจริงที่ให้มาเท่านั้น ห้ามสมมติเนื้อหาที่ไม่เห็น · ถ้าพบความเสี่ยงผิดกฎต้องให้ verdict เป็นไม่ผ่านเสมอ ห้ามผ่านให้เพราะเนื้องานดูดี · ทุก issue ต้องระบุว่าแผนกไหนต้องแก้ เพื่อส่งกลับได้ถูกคน · ห้ามชมลอยๆ ถ้าไม่มีอะไรต้องแก้จริงให้บอกสั้นๆ`,
    },
    {
      key: 'systemFeedback', label: 'แจ้งปัญหาระบบให้ผู้พัฒนา', Icon: ShieldAlert, color: '#F87171',
      desc: 'เจอจุดที่ระบบทำงานผิดพลาดหรือใช้ยาก เขียนมาตรงนี้ AI จะเรียบเรียงเป็นรายงานที่ผู้พัฒนาแก้ตามได้ทันที พร้อมประเมินความรุนแรง',
      action: 'review', images: 4,
      fields: [
        { k: 'what', label: 'เจอปัญหาอะไร', ph: 'กดปุ่มนี้แล้วไม่มีอะไรเกิดขึ้น', required: true, big: true },
        { k: 'where', label: 'หน้าไหน ตอนไหน', ph: 'หน้างานประจำวัน ตอนกดสร้าง Prompt' },
        { k: 'expected', label: 'คาดว่าควรเป็นยังไง', ph: 'ควรขึ้นผลลัพธ์ให้', big: true },
      ],
      sys: `คุณคือผู้ช่วยเขียนรายงานบั๊กให้ทีมพัฒนา แปลงคำบ่นของผู้ใช้เป็นรายงานที่แก้ตามได้
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"รายงานปัญหาระบบ",
 "severity":"วิกฤต|สูง|กลาง|ต่ำ",
 "severityReason":"ทำไมถึงให้ระดับนี้ กระทบผู้ใช้แค่ไหน",
 "summary":"สรุปปัญหาใน 1 ประโยคที่ผู้พัฒนาอ่านแล้วเข้าใจทันที",
 "stepsToReproduce":["ขั้นตอนทำซ้ำให้เกิดปัญหา เรียงเป็นข้อ"],
 "expected":"ควรเกิดอะไร",
 "actual":"เกิดอะไรจริง",
 "guessedCause":"เดาสาเหตุที่เป็นไปได้ พร้อมบอกว่านี่เป็นการเดา ไม่ใช่ข้อสรุป",
 "workaround":"วิธีเลี่ยงชั่วคราวระหว่างรอแก้ ถ้าไม่มีให้ใส่ ยังไม่มีวิธีเลี่ยง",
 "missingInfo":["ข้อมูลที่ผู้พัฒนาน่าจะต้องถามเพิ่ม"]
}
กติกา: เรียบเรียงจากสิ่งที่ผู้ใช้เล่าเท่านั้น ห้ามแต่งขั้นตอนที่เขาไม่ได้บอก ถ้าข้อมูลไม่พอให้ระบุใน missingInfo · การเดาสาเหตุต้องบอกชัดว่าเป็นการเดา ห้ามเขียนเหมือนเป็นข้อเท็จจริง · ระดับวิกฤตใช้เฉพาะกรณีข้อมูลหายหรือใช้งานไม่ได้ทั้งระบบ`,
    },
  ],
  rnd: [
    {
      key: 'backendRead', label: 'อ่านสถิติหลังบ้าน (แนบรวมได้ ไม่ต้องแยก)', Icon: BarChart3, color: '#3B82F6',
      desc: 'แคปสถิติหลังบ้านจากทุกแพลตฟอร์มมารวมกันได้เลย ไม่ต้องแยกไฟล์ — AI จะแยกให้เองว่าภาพไหนของแพลตฟอร์มไหน แล้วอ่านตัวเลขออกมาเป็นตารางและกราฟ ถ้ามีเกิน 10 รูปให้ส่งเป็นชุดๆ แล้วบอกว่ายังไม่ครบ',
      action: 'backendRead', images: 10, useBrand: true,
      fields: [
        { k: 'period', label: 'ช่วงเวลาของข้อมูล', ph: '1-31 ส.ค. 2569', required: true },
        { k: 'more', label: 'ยังมีอีกชุดไหม', ph: 'ชุดนี้ 10 รูป ยังเหลืออีก 12 รูป / ครบแล้ว' },
        { k: 'focus', label: 'อยากให้เน้นดูอะไร', ph: 'ยอดขาย / คนติดตาม / อัตราดูจบ', big: true },
      ],
      sys: `คุณคือนักวิเคราะห์ข้อมูลหลังบ้านโซเชียลและอีคอมเมิร์ซ อ่านตัวเลขจากภาพที่แนบมาอย่างละเอียด
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ผลอ่านสถิติหลังบ้าน",
 "platformsFound":["แพลตฟอร์มที่ตรวจพบจากภาพ แยกเอง"],
 "metrics":[{"label":"ชื่อตัวเลข","value":"ค่าที่อ่านได้","note":"เทียบหรือหมายเหตุสั้นๆ","trend":"ขึ้น|ลง|เท่าเดิม"}],
 "byPlatform":[{"platform":"ชื่อ","views":"-","engagement":"-","orders":"-","revenue":"-","note":"สิ่งที่สังเกตได้"}],
 "charts":[{"type":"bar","title":"เทียบยอดวิวรายแพลตฟอร์ม","data":[{"name":"TikTok","value":12000}]},{"type":"pie","title":"สัดส่วนยอดขายตามแพลตฟอร์ม","data":[{"name":"Shopee","value":60}]}],
 "dataGaps":["ตัวเลขที่อ่านไม่ได้หรือขาดไป ระบุให้ชัดว่าต้องแคปหน้าไหนเพิ่ม"],
 "needMoreSets":"ถ้าผู้ใช้บอกว่ายังมีอีกชุด ให้ระบุว่ายังสรุปภาพรวมไม่ได้ ต้องรอครบก่อน ถ้าครบแล้วให้ใส่ ครบแล้ว",
 "readSummary":"สรุปสิ่งที่อ่านได้ทั้งหมดใน 2-3 ประโยค"
}
กติกาเข้มงวด: อ่านเลขจากภาพจริงเท่านั้น ห้ามแต่งตัวเลขเด็ดขาด อ่านไม่ออกใส่ "-" · ตัวเลขใน charts ต้องเป็นตัวเลขล้วนที่มาจากภาพจริง ถ้าไม่มีข้อมูลพอให้ส่ง charts เป็นลิสต์ว่าง · ถ้าภาพไม่ใช่สถิติให้บอกตรงๆ`,
    },
    {
      key: 'behaviour', label: 'วิเคราะห์พฤติกรรมลูกค้าเชิงลึก', Icon: Users, color: '#8B5CF6',
      desc: 'เอาตัวเลขที่อ่านได้มาวิเคราะห์ต่อว่าลูกค้าดูแล้วซื้อหรือไม่ซื้อเพราะอะไร ดูถึงวินาทีที่เท่าไหร่ ทำไมไม่ดูจบ ค่าเฉลี่ยต่อหัวเท่าไหร่ พร้อมกราฟและเปอร์เซ็นต์',
      action: 'deepAnalysis', images: 8, useBrand: true,
      fields: [
        { k: 'data', label: 'ตัวเลขที่มี (วางจากเครื่องมือก่อนหน้าได้)', ph: 'ยอดวิว อัตราดูจบ ยอดคลิกตะกร้า ยอดสั่งซื้อ', big: true },
        { k: 'product', label: 'สินค้าที่ขาย', ph: 'ชื่อและราคา' },
      ],
      sys: `คุณคือนักวิเคราะห์พฤติกรรมผู้บริโภคบนโซเชียลคอมเมิร์ซ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"พฤติกรรมลูกค้า",
 "metrics":[{"label":"อัตราดูจบ","value":"32%","note":"ต่ำกว่าค่ากลางของคลิปสั้น","trend":"ลง"}],
 "funnel":[{"stage":"เห็นคลิป","value":"ตัวเลข","dropReason":"ทำไมคนหลุดจากขั้นนี้"}],
 "charts":[{"type":"bar","title":"ผู้ชมหลุดที่ขั้นไหนมากที่สุด","data":[{"name":"3 วินาทีแรก","value":45}]}],
 "whyBuy":["เหตุผลที่คนซื้อ อ้างตัวเลขประกอบ"],
 "whyNotBuy":[{"reason":"เหตุผลที่ไม่ซื้อ","evidence":"ดูจากตัวเลขไหน","fix":"แก้ยังไงเป็นรูปธรรม"}],
 "avgPerHead":"ค่าเฉลี่ยต่อหัว ถ้าคำนวณได้จากข้อมูลที่ให้มา ถ้าไม่พอให้บอกว่าต้องการข้อมูลอะไรเพิ่ม",
 "segments":[{"group":"กลุ่มลูกค้า","behaviour":"พฤติกรรมเด่น","howToWin":"เข้าหายังไง"}],
 "summary":"สรุปที่หัวหน้าอ่านแล้วตัดสินใจได้ทันที"
}
กติกา: คำนวณจากตัวเลขที่ให้มาเท่านั้น ห้ามสมมติตัวเลขที่ไม่มี · ถ้าข้อมูลไม่พอสำหรับข้อไหน ให้เขียนตรงๆ ว่าต้องการข้อมูลอะไรเพิ่ม ห้ามเดา · ห้ามเขียนคำแนะนำกว้างๆ แบบ "ควรทำคอนเทนต์ให้ดีขึ้น"`,
    },
    {
      key: 'rivalDeep', label: 'เทียบคู่แข่ง + จับพิรุธรีวิวปลอม', Icon: Swords, color: '#F87171',
      desc: 'แนบรูปสินค้าคู่แข่ง รายละเอียด และรีวิวลูกค้า → เทียบกับสินค้าเรา พร้อมตรวจว่ารีวิวมีพิรุธปั่นยอดไหม',
      action: 'rivalSearch', images: 10, useBrand: true, useSearch: true,
      fields: [
        { k: 'mine', label: 'สินค้าของเรา', ph: 'ชื่อ ราคา จุดขาย', required: true, big: true },
        { k: 'theirs', label: 'คู่แข่งที่จะเทียบ', ph: 'ชื่อแบรนด์ ราคา ที่เห็นในภาพ', big: true },
      ],
      sys: `คุณคือนักวิเคราะห์คู่แข่งที่ตาแหลม ดูออกว่ารีวิวไหนจริงรีวิวไหนปั่น
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"เทียบคู่แข่ง",
 "metrics":[{"label":"ส่วนต่างราคา","value":"+120 บาท","note":"เราแพงกว่า","trend":"ลง"}],
 "comparison":[{"หัวข้อ":"ราคา","ของเรา":"-","ของคู่แข่ง":"-","ใครได้เปรียบ":"เรา|คู่แข่ง|พอกัน"}],
 "charts":[{"type":"bar","title":"เทียบจุดแข็งเป็นคะแนน 1-10","data":[{"name":"ราคา","value":7}]}],
 "reviewAudit":{"verdict":"น่าเชื่อถือ|มีพิรุธ|ปั่นชัดเจน","signals":["สัญญาณที่พบ เช่น รีวิวมาพร้อมกันวันเดียว ข้อความคล้ายกันผิดปกติ รูปซ้ำ บัญชีไม่มีประวัติ"],"realComplaints":["คำบ่นที่ดูเป็นของจริง เอาไปแก้สินค้าได้"]},
 "ourGaps":[{"gap":"จุดที่เราแพ้","why":"เพราะอะไร","closeIt":"ไล่ตามยังไง"}],
 "attackAngle":"ช่องว่างที่คู่แข่งยังไม่ได้จับ เราเข้าตรงนี้ได้",
 "summary":"สรุปว่าควรสู้ด้วยอะไร"
}
กติกา: วิเคราะห์จากภาพและข้อมูลที่แนบมาเท่านั้น ห้ามแต่งข้อมูลคู่แข่งที่ไม่เห็นในภาพ · การตัดสินว่ารีวิวปั่นต้องอ้างสัญญาณที่เห็นจริง ห้ามกล่าวหาลอยๆ · ถ้าไม่มีภาพรีวิวให้ใส่ verdict ว่าไม่มีข้อมูลให้ตรวจ`,
    },
    {
      key: 'marketRecap', label: 'สรุปตลาด + ทิศทาง 5-10 ปี', Icon: Compass, color: '#22D3EE',
      desc: 'ภาพรวมตลาดที่เราอยู่ แนวโน้มระยะยาว และเราควรวางตัวยังไง — อิงจากข้อมูลที่คุณให้และความรู้ทั่วไป ไม่ใช่ข้อมูลสดจากอินเทอร์เน็ต',
      action: 'planSearch', useBrand: true, useSearch: true,
      fields: [
        { k: 'market', label: 'ตลาด/หมวดสินค้า', ph: 'อาหารเสริมผิวขาว ตลาดไทย', required: true },
        { k: 'observed', label: 'สิ่งที่คุณสังเกตเห็นเองตอนนี้', ph: 'คู่แข่งเยอะขึ้น ราคาตัดกันหนัก', big: true },
      ],
      sys: `คุณคือที่ปรึกษากลยุทธ์ธุรกิจ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"สรุปตลาดและทิศทาง",
 "marketNow":"สภาพตลาดตอนนี้ตามที่ประเมินได้",
 "charts":[{"type":"bar","title":"แรงกดดันในตลาด (คะแนน 1-10)","data":[{"name":"การแข่งขันด้านราคา","value":8}]}],
 "drivers":[{"factor":"ปัจจัยที่ขับเคลื่อนตลาด","effect":"ส่งผลยังไงกับธุรกิจนี้"}],
 "horizon":[{"period":"1-2 ปี","expect":"คาดว่าจะเป็นยังไง","prepare":"ควรเตรียมอะไร"},{"period":"5 ปี","expect":"-","prepare":"-"},{"period":"10 ปี","expect":"-","prepare":"-"}],
 "positioning":"เราควรวางตัวตรงไหนในตลาด",
 "caveat":"เตือนตรงๆ ว่านี่คือการประเมินจากความรู้ทั่วไปและข้อมูลที่ผู้ใช้ให้ ไม่ใช่ข้อมูลตลาดสดหรือรายงานวิจัย ควรตรวจกับข้อมูลจริงก่อนตัดสินใจลงทุน"
}
กติกา: คุณค้นเว็บได้ ให้ค้นข้อมูลตลาดจริงมาประกอบ และอ้างเฉพาะตัวเลขที่ค้นเจอจริงพร้อมบอกว่ามาจากแหล่งไหน · ห้ามแต่งตัวเลขส่วนแบ่งตลาดหรือชื่อรายงานวิจัยที่ค้นไม่เจอ ถ้าหาไม่เจอให้บอกตรงๆ · การคาดการณ์ 5-10 ปีเป็นการประเมิน ไม่ใช่ข้อเท็จจริง ต้องระบุใน caveat เสมอว่าเป็นการคาดการณ์และควรตรวจกับข้อมูลจริงก่อนตัดสินใจลงทุน`,
    },
  ],
  marketing: [
    {
      key: 'campaignCal', label: 'ปฏิทินแคมเปญแพลตฟอร์ม', Icon: Calendar, color: '#FB923C',
      desc: 'แคมเปญใหญ่ของแต่ละแพลตฟอร์ม (Payday, Double Day, ครบรอบ) ที่กำลังจะมา พร้อมบอกว่าต้องเตรียมอะไรกี่วันก่อน',
      action: 'planSearch', useBrand: true, useSearch: true,
      fields: [
        { k: 'platforms', label: 'แพลตฟอร์มที่ขาย', ph: 'TikTok Shop, Shopee, Lazada', required: true },
        { k: 'month', label: 'เดือนที่จะวางแผน', ph: 'กันยายน 2569', required: true },
        { k: 'budget', label: 'งบที่มี', ph: 'ถ้ามี' },
      ],
      sys: `คุณคือนักการตลาดที่ดูแลแคมเปญบนแพลตฟอร์มอีคอมเมิร์ซ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ปฏิทินแคมเปญ",
 "campaigns":[{"name":"ชื่อแคมเปญ","when":"ช่วงวันที่","platform":"แพลตฟอร์ม","prepDaysBefore":"ต้องเริ่มเตรียมกี่วันก่อน","whatToPrep":"เตรียมอะไรบ้าง","priority":"สูง|กลาง|ต่ำ"}],
 "charts":[{"type":"bar","title":"ความสำคัญของแต่ละแคมเปญ (1-10)","data":[{"name":"Double Day","value":9}]}],
 "budgetSplit":[{"campaign":"ชื่อ","percent":"กี่เปอร์เซ็นต์ของงบ","why":"เพราะอะไร"}],
 "cautions":["ข้อควรระวัง เช่น ค่าโฆษณาแพงขึ้นช่วงไหน หรือกฎการร่วมแคมเปญ"],
 "note":"แคมเปญของแพลตฟอร์มเปลี่ยนได้ตลอด ให้ยืนยันวันที่จริงในหลังบ้านของแพลตฟอร์มก่อนวางแผนจริง"
}
กติกา: คุณค้นเว็บได้ ให้ค้นแคมเปญที่ประกาศจริงของแต่ละแพลตฟอร์มในช่วงเดือนที่ถาม · ห้ามแต่งชื่อแคมเปญหรือวันที่ที่ค้นไม่เจอ ถ้าไม่เจอให้ระบุเฉพาะวันที่เป็นรูปแบบแน่นอน (เลขเบิ้ล วันเงินเดือนออก) แล้วบอกว่าแคมเปญอื่นหาข้อมูลยืนยันไม่ได้ · ใส่ note เตือนให้ยืนยันในหลังบ้านแพลตฟอร์มเสมอ เพราะวันที่อาจเปลี่ยน`,
    },
    {
      key: 'wowCampaign', label: 'คิดแคมเปญที่คนพูดถึง', Icon: Flame, color: '#F472B6',
      desc: 'ให้ AI คิดกิจกรรมการตลาดที่แปลกใหม่พอจะเป็นกระแส ไม่ใช่แค่ลดราคา — ผูกกับสินค้าและกลุ่มลูกค้าของคุณโดยเฉพาะ',
      action: 'plan', useBrand: true,
      fields: [
        { k: 'goal', label: 'เป้าหมายของแคมเปญ', ph: 'อยากให้คนรู้จักแบรนด์ / อยากได้ยอดขาย / อยากได้ UGC', required: true },
        { k: 'budget', label: 'งบประมาณ', ph: '20000 บาท' },
        { k: 'constraint', label: 'ข้อจำกัด', ph: 'ไม่มีหน้าร้าน ทำออนไลน์อย่างเดียว', big: true },
      ],
      sys: `คุณคือครีเอทีฟการตลาดที่กล้าคิดนอกกรอบ แต่คิดบนพื้นฐานที่ทำได้จริงด้วยงบที่มี
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"แคมเปญที่เสนอ",
 "campaigns":[{"no":1,"name":"ชื่อแคมเปญที่ติดหู","bigIdea":"แก่นของแคมเปญใน 1 ประโยค","howItWorks":"ลูกค้าต้องทำอะไร อธิบายเป็นขั้นตอนที่ชัดเจน","whyShareable":"ทำไมคนถึงอยากถ่ายลงโซเชียลเอง","costEstimate":"ประมาณการค่าใช้จ่าย","risk":"เสี่ยงตรงไหน เช่น คนโกงกติกา หรือดราม่า","fitsBrand":"เข้ากับแบรนด์นี้ยังไง"}],
 "charts":[{"type":"bar","title":"ประเมินแต่ละแคมเปญ (คะแนนความคุ้มค่า 1-10)","data":[{"name":"แคมเปญ 1","value":8}]}],
 "pickOne":"ถ้าเลือกได้อันเดียวควรทำอันไหน เพราะอะไร",
 "measure":["วัดผลยังไง ตัวเลขอะไรที่ต้องเก็บ"]
}
กติกา: คิด 3 แคมเปญ · ต้องผูกกับสินค้าและกลุ่มลูกค้าของแบรนด์ที่ให้มา ห้ามเสนอแคมเปญกลางๆ ที่ใช้กับแบรนด์ไหนก็ได้ · ต้องอยู่ในงบที่ผู้ใช้บอก ถ้าเกินงบให้บอกตรงๆ · ต้องระบุความเสี่ยงจริงทุกแคมเปญ โดยเฉพาะโอกาสโดนโกงกติกาและโอกาสเกิดดราม่า`,
    },
    {
      key: 'partners', label: 'บริหารพันธมิตร / Affiliate', Icon: Handshake, color: '#34D399',
      desc: 'ประเมินพันธมิตรและ affiliate ว่าใครทำได้ดี ใครควรผลักดัน ใครควรตัด พร้อมเสนอรางวัลที่เหมาะและเตือนวันสำคัญ',
      action: 'plan', useBrand: true,
      fields: [
        { k: 'partners', label: 'รายชื่อพันธมิตรและยอดขาย', ph: 'สมชาย 45000 / สมหญิง 12000 / บริษัท A 300000', required: true, big: true },
        { k: 'terms', label: 'ค่าคอมที่ให้ตอนนี้', ph: '10% ทุกคน' },
        { k: 'budget', label: 'งบรางวัล', ph: '50000 บาท' },
      ],
      sys: `คุณคือผู้จัดการฝ่ายพันธมิตรที่ดูแลเครือข่ายผู้ขาย
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"บริหารพันธมิตร",
 "metrics":[{"label":"ยอดรวมจากพันธมิตร","value":"357,000","note":"จาก 3 ราย","trend":"เท่าเดิม"}],
 "charts":[{"type":"bar","title":"ยอดขายรายพันธมิตร","data":[{"name":"สมชาย","value":45000}]},{"type":"pie","title":"สัดส่วนยอดขาย","data":[{"name":"สมชาย","value":45000}]}],
 "tiers":[{"partner":"ชื่อ","tier":"ดาวเด่น|กำลังโต|ต้องกระตุ้น|ควรตัด","share":"คิดเป็นกี่เปอร์เซ็นต์ของยอดรวม","action":"ควรทำอะไรกับคนนี้","reward":"รางวัลที่เหมาะ ในงบที่มี"}],
 "riskConcentration":"ถ้ายอดกระจุกอยู่ที่คนเดียวมากเกินไป ให้เตือนความเสี่ยงพร้อมตัวเลข",
 "commissionAdvice":"ควรปรับโครงสร้างค่าคอมยังไง ให้เหตุผลด้วยตัวเลข",
 "reminders":["สิ่งที่ควรตั้งเตือน เช่น ทักไปหาคนที่ยอดตก หรือส่งของขวัญวันสำคัญ"]
}
กติกา: คำนวณเปอร์เซ็นต์จากตัวเลขที่ผู้ใช้ให้มาจริงเท่านั้น · รางวัลที่เสนอต้องรวมแล้วไม่เกินงบที่บอก ถ้าเกินให้บอกตรงๆ · ถ้ายอดกระจุกที่คนเดียวเกิน 50% ต้องเตือนความเสี่ยงเสมอ`,
    },
  ],
  sales: [
    {
      key: 'replyHelper', label: 'ช่วยตอบลูกค้า / ปิดการขาย', Icon: MessageSquare, color: '#22D3EE',
      desc: 'วางคำถามลูกค้ามา ระบบเขียนคำตอบให้สุภาพ สั้น อ่านง่าย ตรงกับกลุ่มลูกค้าของแบรนด์คุณ พร้อมประโยคปิดการขายที่ไม่กดดัน',
      action: 'plan', useBrand: true,
      fields: [
        { k: 'question', label: 'ลูกค้าถามว่าอะไร', ph: 'วางข้อความลูกค้ามาตรงๆ', required: true, big: true },
        { k: 'product', label: 'สินค้าที่ถามถึง', ph: 'ชื่อ ราคา จุดขาย', big: true },
        { k: 'customerType', label: 'ลูกค้าแบบไหน', ph: 'ผู้หญิง 30-45 ไม่ชอบอ่านยาว' },
        { k: 'stage', label: 'อยู่ขั้นไหน', ph: 'เพิ่งทัก / ถามราคาแล้ว / ลังเล / ขอส่วนลด' },
      ],
      sys: `คุณคือพนักงานขายออนไลน์ที่เก่งเรื่องตอบแชท ตอบสั้น สุภาพ เป็นธรรมชาติ อ่านแล้วรู้เรื่องทันที
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "readCustomer":"อ่านใจลูกค้าจากข้อความ เขากังวลอะไรจริงๆ",
 "replies":[{"style":"สั้นกระชับ|อบอุ่นเป็นกันเอง|ให้ข้อมูลละเอียด","text":"ข้อความที่ก๊อปไปวางตอบได้เลย ห้ามยาวเกิน 4 บรรทัด","whenToUse":"ใช้แบบนี้ตอนไหน"}],
 "closeLine":"ประโยคปิดการขายที่ไม่กดดัน ใช้ต่อท้ายได้",
 "objections":[{"ifSays":"ถ้าลูกค้าตอบกลับมาแบบนี้","reply":"ให้ตอบแบบนี้"}],
 "avoid":["คำที่ห้ามใช้ตอบลูกค้ารายนี้ เช่น คำที่กล่าวอ้างสรรพคุณเกินจริง หรือคำที่ทำให้รู้สึกถูกไล่ให้ซื้อ"]
}
กติกา: เขียนคำตอบ 3 แบบให้เลือก · ทุกคำตอบต้องสั้น อ่านจบใน 5 วินาที เพราะลูกค้าแชทไม่อ่านยาว · ห้ามใช้คำรับประกันผลกับสินค้าสุขภาพและความงาม · ห้ามแต่งข้อมูลสินค้าที่ผู้ใช้ไม่ได้ให้มา ถ้าไม่รู้ให้เขียนเป็นช่องว่างให้ผู้ใช้เติม`,
    },
    {
      key: 'followUp', label: 'ตามลูกค้าเก่า / ซื้อซ้ำ', Icon: RefreshCw, color: '#A78BFA',
      desc: 'วางรายชื่อลูกค้าที่เคยซื้อพร้อมวันที่ → ระบบบอกว่าควรทักใครวันนี้ ทักว่าอะไร และคำนวณว่าของน่าจะหมดเมื่อไหร่',
      action: 'plan', useBrand: true,
      fields: [
        { k: 'customers', label: 'ลูกค้าที่เคยซื้อ (ชื่อ + วันที่ซื้อ + สินค้า)', ph: 'สมหญิง 1 ก.ค. ครีม 1 กระปุก / สมชาย 15 ก.ค. อาหารเสริม 2 กระปุก', required: true, big: true },
        { k: 'usageLife', label: 'สินค้าใช้ได้นานเท่าไหร่ต่อชิ้น', ph: 'ครีม 1 กระปุกใช้ได้ประมาณ 45 วัน', required: true },
        { k: 'today', label: 'วันนี้วันที่', ph: '29 ส.ค. 2569', required: true },
        { k: 'promo', label: 'โปรที่มีตอนนี้', ph: 'ซื้อ 2 แถม 1' },
      ],
      sys: `คุณคือฝ่ายดูแลลูกค้าที่ตามเรื่องการซื้อซ้ำ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"รายการที่ควรทักวันนี้",
 "metrics":[{"label":"ควรทักวันนี้","value":"3 คน","note":"จากทั้งหมด 8 คน","trend":"เท่าเดิม"}],
 "callToday":[{"name":"ชื่อ","boughtOn":"วันที่ซื้อ","daysSince":"ผ่านมากี่วัน","estRunOut":"ของน่าจะหมดประมาณวันไหน","urgency":"ทักวันนี้|สัปดาห์นี้|ยังไม่ต้อง","message":"ข้อความที่ทักไปได้เลย สั้นๆ ไม่กดดัน"}],
 "charts":[{"type":"bar","title":"จำนวนวันตั้งแต่ซื้อล่าสุด","data":[{"name":"สมหญิง","value":59}]}],
 "atRisk":[{"name":"ชื่อ","why":"ทำไมน่าจะไม่กลับมาซื้อ","tryThis":"ลองวิธีนี้"}],
 "note":"การประเมินวันที่ของหมดคำนวณจากอายุการใช้งานที่ผู้ใช้ระบุ ไม่ใช่ข้อมูลการใช้จริงของลูกค้า"
}
กติกา: คำนวณวันจากวันที่ที่ผู้ใช้ให้มาจริงเท่านั้น ห้ามเดาวันที่ · ถ้าข้อมูลวันที่ไม่ครบให้ระบุว่าคนไหนขาดข้อมูล · ข้อความที่ทักต้องไม่ทำให้ลูกค้ารู้สึกถูกตาม ต้องดูเหมือนความหวังดี`,
    },
    {
      key: 'quotation', label: 'ทำใบเสนอราคา', Icon: FileText, color: '#34D399',
      desc: 'กรอกรายการสินค้าและข้อมูลลูกค้า → ได้ใบเสนอราคาที่คำนวณราคา ส่วนลด ภาษี และยอดรวมให้ครบ พร้อมเงื่อนไขมาตรฐาน',
      action: 'plan', useBrand: true,
      fields: [
        { k: 'client', label: 'ลูกค้า (ชื่อ/บริษัท/ที่อยู่)', ph: 'บริษัท ตัวอย่าง จำกัด', required: true, big: true },
        { k: 'items', label: 'รายการสินค้า (ชื่อ จำนวน ราคาต่อหน่วย)', ph: 'ครีมกลาสสกิน 100 ชิ้น ชิ้นละ 250', required: true, big: true },
        { k: 'discount', label: 'ส่วนลด', ph: '5% หรือ 3000 บาท' },
        { k: 'vat', label: 'ภาษีมูลค่าเพิ่ม', ph: 'รวม 7% / ไม่มี' },
        { k: 'terms', label: 'เงื่อนไขพิเศษ', ph: 'ส่งภายใน 7 วัน จ่าย 50% มัดจำ' },
      ],
      sys: `คุณคือเจ้าหน้าที่ฝ่ายขายที่ทำใบเสนอราคา คำนวณเลขต้องเป๊ะ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ใบเสนอราคา",
 "client":{"name":"-","address":"-"},
 "items":[{"no":1,"description":"ชื่อสินค้า","qty":100,"unitPrice":250,"amount":25000}],
 "summary":{"subtotal":25000,"discount":1250,"afterDiscount":23750,"vat":1662.5,"grandTotal":25412.5,"inWords":"ยอดรวมเป็นตัวอักษรภาษาไทย"},
 "terms":["เงื่อนไขการชำระเงิน","ระยะเวลาส่งมอบ","ใบเสนอราคานี้ยืนราคาถึงวันที่ ..."],
 "checkBeforeSend":["สิ่งที่ต้องตรวจก่อนส่งให้ลูกค้า"],
 "calcNote":"อธิบายวิธีคิดเลขทีละขั้น เพื่อให้ผู้ใช้ตรวจตามได้"
}
กติกาเข้มงวด: ตัวเลขทุกช่องต้องเป็นตัวเลขล้วน ไม่ใส่เครื่องหมายคั่นหลักหรือหน่วย · amount ต้องเท่ากับ qty คูณ unitPrice เป๊ะๆ · ยอดรวมต้องบวกลบถูกต้อง ตรวจซ้ำก่อนตอบ · ต้องแสดงวิธีคิดใน calcNote ทุกครั้งเพื่อให้ผู้ใช้ตรวจได้ · ถ้าข้อมูลไม่พอให้ใส่ - แล้วระบุใน checkBeforeSend ว่าต้องเติมอะไร ห้ามเดาราคาเอง`,
    },
  ],
  stock: [
    {
      key: 'stockRead', label: 'อ่านสต๊อกจากไฟล์/ภาพ แล้วสรุปให้', Icon: Package, color: '#22D3EE',
      desc: 'แนบภาพหรือวางตารางสต๊อกมา ระบบจะอ่านตัวเลขออกมาเป็นตาราง แยกยอดรับเข้า จ่ายออก ตีกลับ ของเสีย และคงเหลือ พร้อมกราฟและจุดที่ต้องระวัง',
      action: 'stockRead', images: 6, useBrand: true,
      fields: [
        { k: 'period', label: 'ช่วงเวลาของข้อมูล', ph: '1-31 ส.ค. 2569', required: true },
        { k: 'raw', label: 'วางตารางสต๊อก (ถ้ามี)', ph: 'ชื่อสินค้า / รับเข้า / จ่ายออก / ตีกลับ / ของเสีย / คงเหลือ', big: true },
      ],
      sys: `คุณคือเจ้าหน้าที่คลังสินค้าที่อ่านข้อมูลสต๊อกอย่างละเอียดและคิดเลขแม่น
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"สรุปสต๊อก",
 "metrics":[{"label":"มูลค่าสต๊อกคงเหลือ","value":"ตัวเลขที่คำนวณได้","note":"หมายเหตุสั้นๆ","trend":"ขึ้น|ลง|เท่าเดิม"}],
 "items":[{"sku":"ชื่อ/รหัสสินค้า","opening":"ยกมา","inbound":"รับเข้า","outbound":"จ่ายออก","returned":"ตีกลับ","damaged":"ของเสีย","closing":"คงเหลือ","checkSum":"ยกมา+รับเข้า-จ่ายออก+ตีกลับ-ของเสีย ต้องเท่ากับคงเหลือไหม ถ้าไม่เท่าให้ระบุส่วนต่าง"}],
 "charts":[{"type":"bar","title":"สินค้าคงเหลือมากที่สุด","data":[{"name":"สินค้า A","value":120}]},{"type":"pie","title":"สัดส่วนของเสีย/ตีกลับ/ขายออก","data":[{"name":"ขายออก","value":80}]}],
 "mismatches":[{"sku":"สินค้าที่ตัวเลขไม่ตรง","expected":"ควรเป็นเท่าไหร่","actual":"ในระบบเท่าไหร่","gap":"ส่วนต่าง","possibleCause":"สาเหตุที่เป็นไปได้ เช่น ลืมบันทึกจ่ายออก ของหาย นับผิด"}],
 "lowStock":[{"sku":"สินค้าที่ใกล้หมด","left":"เหลือเท่าไหร่","note":"ควรสั่งเพิ่มไหม"}],
 "deadStock":[{"sku":"สินค้าที่ค้างนาน ขายไม่ออก","left":"เหลือเท่าไหร่","suggestion":"ควรทำอย่างไร เช่น จัดโปร ลดราคา"}],
 "dataGaps":["ข้อมูลที่อ่านไม่ได้หรือขาดไป ระบุให้ชัดว่าต้องการอะไรเพิ่ม"]
}
กติกาเข้มงวด:
- อ่านตัวเลขจากภาพหรือตารางที่ให้มาเท่านั้น ห้ามแต่งตัวเลขเด็ดขาด อ่านไม่ออกใส่ "-"
- ต้องตรวจสมการสต๊อกทุกรายการ: ยกมา + รับเข้า − จ่ายออก + ตีกลับ − ของเสีย = คงเหลือ ถ้าไม่ตรงต้องรายงานใน mismatches เสมอ เพราะแปลว่ามีของหายหรือบันทึกผิด
- ตัวเลขใน charts ต้องเป็นตัวเลขล้วนที่มาจากข้อมูลจริง ถ้าข้อมูลไม่พอให้ส่ง charts เป็นลิสต์ว่าง`,
    },
    {
      key: 'stockForecast', label: 'พยากรณ์ของหมด + ควรสั่งเท่าไหร่', Icon: TrendingUp, color: '#A78BFA',
      desc: 'ใส่ยอดขายย้อนหลังกับสต๊อกคงเหลือ ระบบจะคำนวณว่าของจะหมดเมื่อไหร่ ควรสั่งเพิ่มกี่ชิ้น และสั่งเมื่อไหร่ถึงจะไม่ขาดของช่วงพีค',
      action: 'deepAnalysis', useBrand: true,
      fields: [
        { k: 'sales', label: 'ยอดขายย้อนหลัง (ต่อสินค้า)', ph: 'ครีม A ขายเดือนละ 120 ชิ้น 3 เดือนล่าสุด 100/130/140', required: true, big: true },
        { k: 'onHand', label: 'สต๊อกคงเหลือตอนนี้', ph: 'ครีม A เหลือ 85 ชิ้น', required: true, big: true },
        { k: 'leadTime', label: 'สั่งของแล้วกี่วันถึงจะได้ของ', ph: '14 วัน', required: true },
        { k: 'upcoming', label: 'มีแคมเปญ/ช่วงพีคอะไรไหม', ph: 'Double Day 9.9 คาดว่าขายเพิ่ม 3 เท่า' },
      ],
      sys: `คุณคือนักวางแผนสต๊อกที่คิดเลขแม่นและระวังของขาดเป็นพิเศษ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"พยากรณ์สต๊อก",
 "metrics":[{"label":"สินค้าเสี่ยงขาด","value":"3 รายการ","note":"ภายใน 30 วัน","trend":"ลง"}],
 "forecast":[{"sku":"ชื่อสินค้า","avgPerDay":"ขายเฉลี่ยวันละกี่ชิ้น คิดจากข้อมูลจริง","onHand":"เหลือเท่าไหร่","daysLeft":"จะหมดในกี่วัน","runOutDate":"ประมาณวันไหน","reorderBy":"ต้องสั่งภายในวันไหนถึงจะทัน (คิดจาก lead time)","suggestQty":"ควรสั่งกี่ชิ้น","reason":"อธิบายวิธีคิดให้ตรวจตามได้"}],
 "charts":[{"type":"bar","title":"จำนวนวันที่ของจะอยู่ได้","data":[{"name":"ครีม A","value":21}]}],
 "urgent":[{"sku":"ต้องสั่งด่วน","why":"เพราะอะไร","ifNotOrdered":"ถ้าไม่สั่งจะเกิดอะไร"}],
 "campaignImpact":"ถ้ามีแคมเปญที่ระบุมา ให้คำนวณเพิ่มว่าต้องเผื่อของอีกเท่าไหร่ ถ้าไม่มีให้ใส่ ไม่มีแคมเปญที่ต้องเผื่อ",
 "calcNote":"อธิบายสูตรที่ใช้คิดทีละขั้น เพื่อให้ผู้ใช้ตรวจตามได้เอง"
}
กติกาเข้มงวด:
- คำนวณจากตัวเลขที่ผู้ใช้ให้มาเท่านั้น ห้ามสมมติยอดขายที่ไม่มีในข้อมูล
- ต้องแสดงวิธีคิดใน calcNote ทุกครั้ง เพราะเป็นเรื่องเงินและของจริง ผู้ใช้ต้องตรวจได้
- ถ้าข้อมูลไม่พอสำหรับสินค้าไหน ให้ระบุตรงๆ ว่าต้องการข้อมูลอะไรเพิ่ม ห้ามเดา
- วันที่ต้องสั่ง ต้องเผื่อ lead time เสมอ ถ้าคำนวณแล้วต้องสั่งไปแล้วในอดีต ให้เตือนว่าสายแล้ว`,
    },
    {
      key: 'returnAnalysis', label: 'วิเคราะห์ของตีกลับ / ของเสีย', Icon: RotateCcw, color: '#F87171',
      desc: 'ของตีกลับเยอะแปลว่ามีปัญหาที่ต้นทาง — ระบบจะหาว่าเป็นเพราะสินค้า การแพ็ก การส่ง หรือคำโฆษณาเกินจริง แล้วบอกวิธีลด',
      action: 'deepAnalysis', images: 6, useBrand: true,
      fields: [
        { k: 'returns', label: 'ข้อมูลของตีกลับ', ph: 'สินค้า / จำนวน / เหตุผลที่ลูกค้าคืน', required: true, big: true },
        { k: 'totalSold', label: 'ยอดขายรวมช่วงเดียวกัน', ph: 'ขายไป 1200 ชิ้น ตีกลับ 84 ชิ้น' },
      ],
      sys: `คุณคือนักวิเคราะห์คุณภาพสินค้าและกระบวนการจัดส่ง
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"วิเคราะห์ของตีกลับ",
 "metrics":[{"label":"อัตราตีกลับ","value":"7%","note":"เทียบกับยอดขายรวม","trend":"ขึ้น"}],
 "charts":[{"type":"pie","title":"สาเหตุการตีกลับ","data":[{"name":"สินค้าชำรุด","value":40}]},{"type":"bar","title":"สินค้าที่ตีกลับมากที่สุด","data":[{"name":"ครีม A","value":30}]}],
 "rootCauses":[{"cause":"สาเหตุ","share":"คิดเป็นกี่เปอร์เซ็นต์","where":"เกิดที่ขั้นตอนไหน เช่น ผลิต แพ็ก ขนส่ง หรือโฆษณาเกินจริง","fix":"แก้ยังไงเป็นรูปธรรม","costToFix":"แก้แล้วคุ้มไหม"}],
 "worstProducts":[{"sku":"สินค้าที่มีปัญหาสุด","returnRate":"อัตราตีกลับของตัวนี้","action":"ควรทำอะไร เช่น หยุดขายชั่วคราว เปลี่ยนแพ็กเกจ แก้คำโฆษณา"}],
 "resellable":"ของที่ตีกลับมา เอามาขายต่อได้กี่เปอร์เซ็นต์ ควรจัดการยังไงกับส่วนที่ขายต่อไม่ได้",
 "moneyLost":"ประเมินมูลค่าที่เสียไป ถ้าข้อมูลพอคำนวณ ถ้าไม่พอให้บอกว่าต้องการอะไรเพิ่ม",
 "priority":"ถ้าแก้ได้เรื่องเดียว ควรแก้อะไรก่อน เพราะอะไร"
}
กติกา: คำนวณเปอร์เซ็นต์จากตัวเลขจริงที่ให้มาเท่านั้น · ถ้าเหตุผลการคืนชี้ว่าโฆษณาเกินจริง ต้องเตือนเรื่องความเสี่ยงผิดกฎโฆษณาด้วย · ห้ามเดาสาเหตุที่ไม่มีหลักฐานในข้อมูล`,
    },
    {
      key: 'stockCount', label: 'ช่วยตรวจนับสต๊อก / หาของหาย', Icon: ClipboardCheck, color: '#34D399',
      desc: 'เทียบตัวเลขที่นับได้จริงกับตัวเลขในระบบ หาว่าต่างกันตรงไหน มูลค่าเท่าไหร่ และน่าจะหายไปที่ขั้นตอนไหน',
      action: 'stockCount', images: 8,
      fields: [
        { k: 'system', label: 'ตัวเลขในระบบ', ph: 'ครีม A 120 / ครีม B 85', required: true, big: true },
        { k: 'counted', label: 'ตัวเลขที่นับได้จริง', ph: 'ครีม A 117 / ครีม B 85', required: true, big: true },
        { k: 'value', label: 'ราคาต่อชิ้น (ถ้ามี)', ph: 'ครีม A 250 บาท', big: true },
      ],
      sys: `คุณคือผู้ตรวจสอบสต๊อกที่ละเอียดและตรงไปตรงมา
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ผลตรวจนับสต๊อก",
 "verdict":"ตรงทั้งหมด|ต่างเล็กน้อย|ต่างมากต้องสอบสวน",
 "metrics":[{"label":"รายการที่ไม่ตรง","value":"3 จาก 20","note":"คิดเป็น 15%","trend":"ขึ้น"}],
 "charts":[{"type":"bar","title":"ส่วนต่างรายสินค้า (ติดลบ=ของหาย)","data":[{"name":"ครีม A","value":-3}]}],
 "diffs":[{"sku":"ชื่อสินค้า","system":"ในระบบ","counted":"นับได้","gap":"ส่วนต่าง","valueLost":"มูลค่าส่วนต่าง ถ้ามีราคา","likelyCause":"สาเหตุที่เป็นไปได้"}],
 "totalValueGap":"มูลค่ารวมที่หายไป ถ้าคำนวณได้",
 "investigate":["รายการที่ควรสอบสวนเพิ่ม พร้อมเหตุผล"],
 "preventNext":["วิธีป้องกันไม่ให้เกิดซ้ำ เป็นรูปธรรม"]
}
กติกาเข้มงวด: เทียบทีละรายการจากข้อมูลจริง ห้ามข้าม · คิดเลขส่วนต่างให้ถูกต้อง ตรวจซ้ำก่อนตอบ · ถ้าส่วนต่างเยอะผิดปกติต้องให้ verdict เป็นต้องสอบสวน ห้ามผ่านให้เพราะดูเป็นเรื่องเล็ก · likelyCause ต้องอิงจากรูปแบบที่เห็นในข้อมูล ห้ามกล่าวหาคนโดยไม่มีหลักฐาน`,
    },
  ],
  content: [

    {
      key: 'autoIdeas', label: 'ให้ AI เสนอคอนเทนต์ให้เอง', Icon: Sparkles, color: '#4A9DFF',
      desc: 'ไม่ต้องคิดเอง — AI อ่านข้อมูลแบรนด์และช่องของคุณจากระบบ แล้วเสนอคอนเทนต์ที่ควรทำพร้อมเหตุผลว่าทำไมถึงเหมาะกับแบรนด์นี้ และเช็คไม่ให้ซ้ำกับคลิปที่เคยทำ',
      action: 'plan', useBrand: true, useHistory: true,
      fields: [
        { k: 'goal', label: 'เป้าหมายตอนนี้', ph: 'อยากได้ยอดขาย / อยากได้คนติดตาม / อยากให้คนรู้จักแบรนด์' },
        { k: 'count', label: 'อยากได้กี่ไอเดีย', ph: '5' },
        { k: 'note', label: 'ข้อจำกัด/สิ่งที่อยากเลี่ยง', ph: 'ไม่มีนักแสดง ถ่ายเองคนเดียว งบน้อย', big: true },
      ],
      sys: `คุณคือครีเอทีฟไดเรกเตอร์คอนเทนต์สั้นที่ทำงานให้แบรนด์นี้โดยเฉพาะ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"คอนเทนต์ที่ควรทำ",
 "brandRead":"สรุปว่าคุณเข้าใจแบรนด์นี้ว่าเป็นอะไร ขายใคร จากข้อมูลที่ได้รับ (ถ้าข้อมูลไม่พอให้บอกตรงๆ ว่าขาดอะไร)",
 "ideas":[{"no":1,"concept":"แนวคิดคลิป","whyThisBrand":"ทำไมไอเดียนี้ถึงเหมาะกับแบรนด์นี้โดยเฉพาะ ไม่ใช่แบรนด์ทั่วไป","target":"คลิปนี้พูดกับใคร","hook":"ฮุก 3 วินาทีแรก เขียนให้เห็นภาพและได้ยินเสียง","story":"เล่าเรื่องยังไงตั้งแต่ต้นจนจบ","cta":"ปิดท้ายยังไงให้เกิดการกระทำ","effort":"ง่าย|กลาง|ยาก","notDuplicate":"ต่างจากคลิปเก่าที่เคยทำยังไง"}],
 "priority":"ถ้าทำได้แค่ 1 อันควรทำอันไหนก่อน เพราะอะไร",
 "missingInfo":"ข้อมูลอะไรที่ถ้ามีเพิ่มจะช่วยให้คิดได้ตรงกว่านี้"
}
กติกาเข้มงวด:
- ต้องอิงข้อมูลแบรนด์ที่ให้มาเท่านั้น ห้ามเสนอไอเดียที่ไม่เกี่ยวกับสินค้า/บริการของเขา เช่น ถ้าเขาขายรถ ห้ามเสนอคอนเทนต์เสื้อผ้า
- ถ้าไม่มีข้อมูลแบรนด์เลย ห้ามเดาว่าเขาขายอะไร ให้เขียนใน brandRead ว่าข้อมูลไม่พอและใน missingInfo ให้บอกว่าต้องกรอกอะไรเพิ่ม
- ห้ามเสนอไอเดียซ้ำหรือใกล้เคียงกับรายการคลิปเก่าที่ให้มา
- ฮุกต้องเป็นรูปธรรม เห็นภาพจริง ห้ามเขียนกว้างๆ แบบ "เปิดด้วยภาพสวยๆ ดึงดูดสายตา"`,
    },
    {
      key: 'customIdeas', label: 'บอกแนวที่อยากได้ → AI คิดให้', Icon: Target, color: '#8B5CF6',
      desc: 'พิมพ์บอกว่าอยากได้คอนเทนต์แนวไหน AI จะคิดให้ตรงแนวนั้น แต่ปรับให้เข้ากับกลุ่มลูกค้าและสินค้าของคุณ ไม่ใช่ลอกแนวมาดื้อๆ',
      action: 'plan', useBrand: true, useHistory: true,
      fields: [
        { k: 'style', label: 'แนวที่อยากได้', ph: 'แนวตลก / แนวดราม่าสั้น / แนวรีวิวจริงใจ / แนวเล่าเรื่องผี', required: true, big: true },
        { k: 'reference', label: 'มีคลิปต้นแบบในใจไหม (เล่าให้ฟัง)', ph: 'แบบคลิปที่พูดกับกล้องแล้วมีซับใหญ่ๆ ตัดเร็วๆ', big: true },
        { k: 'audience', label: 'อยากให้ใครดู', ph: 'ผู้หญิง 25-40 ทำงานออฟฟิศ' },
        { k: 'count', label: 'อยากได้กี่ไอเดีย', ph: '5' },
      ],
      sys: `คุณคือครีเอทีฟที่เก่งเรื่องดัดแปลงแนวคอนเทนต์ให้เข้ากับแบรนด์
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ไอเดียตามแนวที่ขอ",
 "styleRead":"สรุปว่าแนวที่เขาขอคือแนวอะไร มีลักษณะเด่นอะไร",
 "fitCheck":{"verdict":"เข้ากันดี|ต้องปรับ|ไม่เหมาะ","reason":"แนวนี้เข้ากับสินค้าและกลุ่มลูกค้าของแบรนด์นี้แค่ไหน ถ้าไม่เหมาะให้บอกตรงๆ พร้อมเสนอแนวที่ใกล้เคียงกว่า"},
 "ideas":[{"no":1,"concept":"แนวคิดคลิป","howStyleApplied":"เอาแนวที่เขาขอมาใช้ตรงไหนบ้าง","hook":"ฮุก 3 วินาทีแรก เห็นภาพและได้ยินเสียง","story":"โครงเรื่องตั้งแต่ต้นจนจบ","productMoment":"สินค้าโผล่ตอนไหน แบบไม่ยัดเยียด","cta":"ปิดท้ายยังไง","effort":"ง่าย|กลาง|ยาก"}],
 "warning":"ข้อควรระวังของแนวนี้ เช่น เสี่ยงโดนแบน เสี่ยงคนเข้าใจผิด หรือทำพลาดง่ายตรงไหน"
}
กติกา:
- ต้องผูกกับสินค้า/กลุ่มลูกค้าของแบรนด์ที่ให้มาเสมอ ห้ามคิดลอยๆ ตามแนวอย่างเดียว
- ถ้าแนวที่ขอไม่เหมาะกับแบรนด์จริงๆ ต้องบอกตรงๆ ใน fitCheck ห้ามฝืนตอบให้ผ่านๆ
- ห้ามซ้ำกับคลิปเก่าที่ให้มา`,
    },
    {
      key: 'trendAdapt', label: 'ถอดเทรนด์ที่เห็น → ปรับเข้าแบรนด์', Icon: Flame, color: '#F59E0B',
      desc: 'แคปหน้าจอคลิปหรือเทรนด์ที่กำลังดังมาแนบ (สูงสุด 6 รูป) AI จะถอดว่าทำไมมันดัง แล้วปรับให้เข้ากับสินค้าของคุณ — ระบบเห็นเฉพาะสิ่งที่คุณแนบมา ไม่ได้ต่อเน็ตไปดูเทรนด์เอง',
      action: 'rivalSearch', images: 6, useBrand: true, useHistory: true, useSearch: true,
      fields: [
        { k: 'whatTrend', label: 'เทรนด์ที่เห็นคืออะไร (เล่าเพิ่มได้)', ph: 'เพลงนี้กำลังดัง คนเอามาเต้นท่านี้ / มุกนี้กำลังฮิต', big: true },
        { k: 'where', label: 'เห็นจากที่ไหน', ph: 'TikTok หน้า For You' },
      ],
      sys: `คุณคือนักถอดสูตรคอนเทนต์ไวรัล วิเคราะห์จากภาพและคำอธิบายที่ผู้ใช้แนบมาเท่านั้น
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ถอดเทรนด์และปรับใช้",
 "whatISee":"อธิบายสิ่งที่เห็นในภาพที่แนบมาจริงๆ ถ้าภาพไม่ชัดหรือไม่มีข้อมูลพอให้บอกตรงๆ",
 "whyViral":[{"factor":"ปัจจัยที่ทำให้ดัง","explain":"อธิบายกลไก ทำไมคนถึงหยุดดูหรือแชร์"}],
 "reusablePattern":"สูตรที่ถอดออกมาแล้วเอาไปใช้ซ้ำได้ เขียนเป็นขั้นตอน",
 "adaptations":[{"no":1,"idea":"เอาสูตรนี้มาทำกับสินค้าของแบรนด์นี้ยังไง","hook":"ฮุก 3 วินาทีแรกฉบับของแบรนด์นี้","whyFits":"ทำไมถึงยังเวิร์กเมื่อเปลี่ยนมาเป็นสินค้านี้","risk":"เสี่ยงตรงไหน"}],
 "timing":"เทรนด์แบบนี้มักอยู่ได้นานแค่ไหน ควรรีบทำภายในกี่วัน",
 "legalRisk":"ข้อควรระวังเรื่องลิขสิทธิ์เพลง/คลิปต้นฉบับ และกฎแพลตฟอร์ม"
}
กติกาเข้มงวด:
- คุณค้นเว็บได้ ให้ค้นหาว่าตอนนี้มีเทรนด์อะไรที่เกี่ยวข้องกับสิ่งที่ผู้ใช้แนบมาบ้าง แล้วอ้างอิงจากสิ่งที่ค้นเจอจริงเท่านั้น
- ถ้าค้นแล้วไม่เจอข้อมูลยืนยัน ห้ามแต่งชื่อเพลง ชื่อเทรนด์ หรือตัวเลขยอดวิวขึ้นมาเอง ให้บอกตรงๆ ว่าหาข้อมูลยืนยันไม่ได้
- แยกให้ชัดว่าข้อมูลส่วนไหนมาจากภาพที่ผู้ใช้แนบ ส่วนไหนมาจากการค้นเว็บ
- ถ้าภาพที่แนบมาไม่พอให้วิเคราะห์ ให้เขียนใน whatISee ว่าต้องการภาพแบบไหนเพิ่ม แทนที่จะเดา
- การปรับใช้ต้องผูกกับสินค้าจริงของแบรนด์ที่ให้มา`,
    },
    {
      key: 'ideas', label: 'คลังไอเดียคอนเทนต์', Icon: Layers, color: '#06B6D4',
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
    {
      key: 'safeScript', label: 'ตรวจสินค้าอ่อนไหว + เขียนสคริปต์ปลอดภัย', Icon: ShieldAlert, color: '#EF4444',
      desc: 'สินค้าบางประเภท (อาหารเสริม ยาลดน้ำหนัก ครีม เครื่องสำอาง) พูดผิดคำเดียวโดนปิดการมองเห็นหรือแบนช่อง เครื่องมือนี้ตรวจก่อนว่าสินค้าอ่อนไหวระดับไหน แล้วเขียนสคริปต์ที่ขายได้จริงโดยไม่ผิดกฎ',
      action: 'safeScript', useBrand: true,
      fields: [
        { k: 'product', label: 'สินค้าที่จะขาย', ph: 'อาหารเสริมลดน้ำหนัก / ครีมทาหน้า / เครื่องสำอาง', required: true },
        { k: 'claims', label: 'สรรพคุณที่อยากสื่อ (เขียนตามที่อยากพูดจริงๆ)', ph: 'กินแล้วผอม ลดพุง 7 วันเห็นผล ขาวใสไวมาก', big: true, required: true },
        { k: 'platform', label: 'จะลงแพลตฟอร์มไหน', ph: 'TikTok / Shopee / Facebook' },
        { k: 'duration', label: 'ความยาวคลิป', ph: '30 วินาที' },
        { k: 'hasFda', label: 'มีเลข อย. / จดแจ้งไหม', ph: 'มี เลขที่ xx-x-xxxxxxxxx / ยังไม่มี' },
      ],
      sys: `คุณคือผู้เชี่ยวชาญกฎหมายโฆษณาไทยและกฎแพลตฟอร์มโซเชียล ที่ช่วยเขียนสคริปต์ขายของให้ปลอดภัย
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ตรวจความเสี่ยงและสคริปต์ปลอดภัย",
 "riskLevel":"อ่อนไหวสูงมาก|อ่อนไหวสูง|อ่อนไหวปานกลาง|ทั่วไป",
 "category":"จัดหมวดสินค้า เช่น อาหารเสริม เครื่องสำอาง ยา อุปกรณ์การแพทย์ สินค้าทั่วไป",
 "whyRisky":"อธิบายว่าสินค้าหมวดนี้ถูกควบคุมเพราะอะไร และพลาดแล้วเกิดอะไรขึ้น (ปิดการมองเห็น ลบคลิป แบนช่อง หรือมีโทษตามกฎหมาย)",
 "bannedClaims":[{"original":"คำที่ผู้ใช้อยากพูด ยกมาตรงๆ","whyBanned":"ผิดตรงไหน อ้างเหตุผลให้ชัด","safeVersion":"เขียนใหม่ให้สื่อใกล้เคียงที่สุดแต่ไม่ผิดกฎ","stillEffective":"เวอร์ชันใหม่ยังขายได้อยู่ไหม เพราะอะไร"}],
 "safeScript":{"hook":"3 วินาทีแรก พูดว่าอะไร","body":"เนื้อหากลางคลิป เขียนเป็นบทพูดจริงที่อ่านแล้วพูดตามได้เลย","cta":"ปิดท้ายชวนซื้อยังไงโดยไม่การันตีผล","totalWords":"ประมาณกี่คำ เหมาะกับความยาวที่ขอไหม"},
 "mustShow":["สิ่งที่ต้องขึ้นบนจอหรือในแคปชั่น เช่น เลข อย. ข้อความกำกับ ผลลัพธ์แตกต่างกันในแต่ละบุคคล"],
 "mustAvoid":["สิ่งที่ห้ามทำเด็ดขาดในคลิปนี้ เช่น ห้ามใช้ภาพก่อนหลัง ห้ามใส่ชุดกาวน์ ห้ามอ้างว่าหมอแนะนำ"],
 "beforeAfterRule":"อธิบายกฎเรื่องภาพเปรียบเทียบก่อน-หลังสำหรับสินค้าหมวดนี้",
 "finalCheck":["เช็คลิสต์ก่อนโพสต์ ติ๊กทีละข้อ"]
}
กติกาเข้มงวด:
- ต้องยกคำเสี่ยงที่ผู้ใช้เขียนมาทุกคำ มาใส่ใน bannedClaims อย่าข้าม แม้เขาจะเขียนมาหลายคำ
- คำอย่าง รักษา หาย ลดได้แน่นอน เผาผลาญ กระชับสัดส่วน ขาวขึ้นภายในกี่วัน เห็นผลไว ปลอดภัย 100% หมอแนะนำ ล้วนเป็นคำต้องห้ามสำหรับอาหารเสริมและเครื่องสำอาง ต้องจับให้ครบ
- safeVersion ต้องยังขายได้จริง ห้ามเขียนจนจืดจนขายไม่ออก ให้เน้นความรู้สึก ประสบการณ์ส่วนตัว และการบรรยายลักษณะสินค้าแทนการรับประกันผล
- ถ้าสินค้าต้องมี อย. แต่ผู้ใช้บอกว่ายังไม่มี ต้องเตือนชัดเจนว่าห้ามโฆษณาสรรพคุณจนกว่าจะได้เลขจดแจ้ง
- คุณไม่ใช่ทนายความ ให้ระบุใน finalCheck ข้อสุดท้ายเสมอว่าควรตรวจกับผู้เชี่ยวชาญด้านกฎหมายโฆษณาก่อนลงจริงหากเป็นสินค้าอ่อนไหวสูง`,
    },
    {
      key: 'storyboard', label: 'สตอรี่บอร์ด + แผนถ่ายทำละเอียด', Icon: Clapperboard, color: '#10B981',
      desc: 'เอาไอเดียที่เลือกแล้วมาแตกเป็นสตอรี่บอร์ดทีละช็อต พร้อมฮุก 6 เฟรมแรก ใช้คนกี่คน เพศ อายุ โทนเสียง อารมณ์ การเชื่อมฉาก และเพลงประกอบที่ควรใช้',
      action: 'prompts', useBrand: true,
      fields: [
        { k: 'idea', label: 'ไอเดีย/โครงเรื่องที่เลือก', ph: 'วางไอเดียที่ได้จากเครื่องมือก่อนหน้ามาตรงนี้', required: true, big: true },
        { k: 'duration', label: 'ความยาวคลิป', ph: '30 วินาที' },
        { k: 'mode', label: 'รูปแบบการผลิต', ph: 'ถ่ายเอง / พากย์เสียงใส่ภาพ / สร้างด้วย AI ทั้งหมด' },
        { k: 'cast', label: 'นักแสดงที่มี', ph: 'มีแค่ตัวเอง 1 คน หญิง อายุ 30' },
      ],
      sys: `คุณคือผู้กำกับคลิปสั้นที่วางแผนถ่ายทำละเอียดจนทีมงานเอาไปทำตามได้ทันที
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"สตอรี่บอร์ดและแผนถ่ายทำ",
 "logline":"สรุปคลิปนี้ใน 1 ประโยค",
 "hookFrames":[{"frame":1,"visual":"เห็นอะไรในเฟรมนี้ บอกมุมกล้องและระยะภาพ","audio":"ได้ยินอะไร คำพูดหรือเสียงประกอบ","seconds":"0.0-0.5","why":"เฟรมนี้ทำหน้าที่อะไรในการหยุดนิ้วคนดู"}],
 "cast":[{"role":"ชื่อตัวละคร","gender":"ชาย|หญิง","ageRange":"ช่วงอายุ","look":"หน้าตา ทรงผม เสื้อผ้า ต้องล็อกให้เหมือนกันทุกช็อต","voice":"โทนเสียง เช่น เสียงหญิงสดใส พูดเร็ว","personality":"นิสัยที่ต้องแสดงออก"}],
 "shots":[{"no":1,"scene":"สถานที่","action":"ตัวละครทำอะไร","dialogue":"บทพูด (ระบุว่าใครพูด)","emotion":"อารมณ์ขณะพูด เช่น ตื่นเต้น|หงุดหงิด|เฉยๆ","camera":"มุมกล้องและการเคลื่อนกล้อง","seconds":"ช่วงเวลา","transition":"เชื่อมไปช็อตถัดไปยังไงให้ต่อเนื่อง ห้ามกระโดดข้ามสถานที่แบบไม่มีที่มา"}],
 "continuityCheck":["จุดที่ต้องระวังเรื่องความต่อเนื่อง เช่น เสื้อผ้าเปลี่ยน แสงเปลี่ยน ฉากกระโดด"],
 "audio":{"musicStyle":"แนวเพลงที่เข้ากับคลิปนี้ อธิบายเป็นลักษณะ ไม่ต้องระบุชื่อเพลงจริง","sfx":["เสียงประกอบที่ควรมี"],"voiceNote":"ข้อแนะนำการพากย์"},
 "production":{"peopleNeeded":"ใช้คนกี่คนหน้ากล้องและหลังกล้อง","equipment":"อุปกรณ์ขั้นต่ำที่ต้องมี","location":"สถานที่ถ่าย","estimatedTime":"ใช้เวลาถ่ายประมาณเท่าไหร่"},
 "captionSuggestion":"แคปชั่นที่ควรใช้ตอนโพสต์",
 "riskCheck":"ตรวจว่าบทนี้มีคำพูดที่เสี่ยงผิดกฎแพลตฟอร์มไหม โดยเฉพาะการกล่าวอ้างสรรพคุณเกินจริง ถ้ามีให้บอกว่าต้องแก้คำไหนเป็นคำไหน ถ้าไม่มีให้ใส่ ไม่พบความเสี่ยง"
}
กติกาเข้มงวด:
- hookFrames ต้องมี 6 เฟรม ครอบคลุม 3 วินาทีแรก
- ต้องล็อกหน้าตาและเสียงของตัวละครไว้ชัดเจนใน cast แล้วอ้างถึงตัวละครเดิมทุกช็อต ห้ามสลับบทพูดหรือเปลี่ยนหน้าตากลางเรื่อง
- ทุกช็อตต้องระบุอารมณ์ของบทพูด และการเชื่อมฉากต้องต่อเนื่องทางกายภาพ ห้ามกระโดดจากห้องน้ำไปโต๊ะเครื่องแป้งโดยไม่มีช็อตเชื่อม
- ห้ามระบุชื่อเพลงจริงหรือศิลปินจริง ให้บอกเป็นลักษณะเพลงแทน เพราะเสี่ยงลิขสิทธิ์
- riskCheck ต้องตรวจจริงจัง โดยเฉพาะสินค้าอาหารเสริมและความงาม ห้ามใช้คำว่า รักษา หาย ลดได้แน่นอน`,
    },
    {
      key: 'prodPack', label: 'ชุด Prompt ผลิตคลิป (ล็อกตัวละคร)', Icon: VideoIcon, color: '#8B5CF6',
      desc: 'แปลงสคริปต์เป็นชุด Prompt พร้อมใช้ — ล็อกหน้าตา เสื้อผ้า เสียง อารมณ์ของตัวละครไม่ให้เปลี่ยนกลางเรื่อง แยก Prompt ภาพทีละฉาก Prompt วิดีโอทีละฉาก และฉากเชื่อมไม่ให้ภาพกระโดด แนบภาพอ้างอิงได้เพื่อให้ AI เห็นสไตล์ที่ต้องการ',
      action: 'prodPack', images: 4, useBrand: true,
      fields: [
        { k: 'script', label: 'สคริปต์/โครงเรื่อง', ph: 'วางสคริปต์ที่ได้จากเครื่องมือก่อนหน้ามาตรงนี้', required: true, big: true },
        { k: 'style', label: 'สไตล์ภาพที่ต้องการ', ph: 'สมจริงเหมือนถ่ายด้วยมือถือ / การ์ตูน 3D / ซีเนมาติก' },
        { k: 'sceneCount', label: 'อยากได้กี่ฉาก', ph: '6' },
        { k: 'tool', label: 'จะเอาไปใช้กับ AI ตัวไหน', ph: 'Google Flow / Kling / Seedance / Sora' },
      ],
      sys: `คุณคือผู้เชี่ยวชาญการเขียน Prompt สำหรับ AI สร้างภาพและวิดีโอ ที่รู้ว่าปัญหาใหญ่สุดคือตัวละครหน้าเปลี่ยนและฉากกระโดด
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ชุด Prompt ผลิตคลิป",
 "characterLock":[{"id":"CHAR_A","nameInStory":"ชื่อในเรื่อง","lockPromptEN":"ประโยคภาษาอังกฤษที่ต้องคัดลอกไปวางซ้ำทุกฉาก บรรยายเพศ ช่วงอายุ เชื้อชาติหน้าตา ทรงผม สีผม สีตา รูปหน้า เสื้อผ้าและสีเสื้อผ้า ให้ละเอียดพอที่ AI จะสร้างหน้าเดิมได้ทุกครั้ง","voice":"โทนเสียง เช่น หญิงไทย อายุประมาณ 28 เสียงใส พูดเร็ว","note":"สิ่งที่ต้องคงเดิมตลอดเรื่อง"}],
 "scenes":[{"no":1,"summary":"ฉากนี้เกิดอะไร","location":"สถานที่","charactersInScene":["CHAR_A"],"imagePromptEN":"Prompt ภาษาอังกฤษสำหรับสร้างภาพนิ่งฉากนี้ ต้องมี lockPromptEN ของตัวละครที่อยู่ในฉากแทรกอยู่ด้วยเสมอ ระบุมุมกล้อง แสง องค์ประกอบภาพ อัตราส่วน 9:16","videoPromptEN":"Prompt ภาษาอังกฤษสำหรับแปลงภาพนิ่งฉากนี้เป็นวิดีโอ ระบุการเคลื่อนไหวของตัวละครและกล้อง ความยาว 3-5 วินาที","dialogue":"บทพูดในฉากนี้ (ระบุว่าใครพูด)","emotion":"อารมณ์ขณะพูด","transitionToNext":"เชื่อมไปฉากถัดไปยังไงให้ต่อเนื่อง ถ้าเปลี่ยนสถานที่ต้องอธิบายฉากเชื่อม"}],
 "continuityWarnings":["จุดที่เสี่ยงภาพไม่ต่อเนื่อง พร้อมวิธีแก้"],
 "coverPromptEN":"Prompt ภาษาอังกฤษสำหรับภาพหน้าปก 9:16 ที่ดึงดูดให้คนกด",
 "negativePromptEN":"สิ่งที่ต้องใส่ในช่อง negative prompt เพื่อกันภาพเสีย เช่น นิ้วเกิน หน้าเบี้ยว ตัวหนังสือมั่ว เสื้อผ้าหลุด",
 "audioPlan":{"musicStyle":"แนวเพลงที่เข้ากับคลิปนี้ อธิบายเป็นลักษณะและจังหวะ ห้ามระบุชื่อเพลงจริงเพราะเสี่ยงลิขสิทธิ์","sfx":[{"scene":1,"sound":"เสียงประกอบที่ควรใส่"}],"voiceDirection":"แนวทางการพากย์เสียง"},
 "checkBeforeRender":["สิ่งที่ต้องตรวจก่อนกดสร้างจริง เพื่อไม่ให้เสียเครดิตฟรี"]
}
กติกาเข้มงวด:
- lockPromptEN ของแต่ละตัวละครต้องถูกแทรกอยู่ใน imagePromptEN ของทุกฉากที่ตัวละครนั้นปรากฏ ห้ามละไว้ในฐานที่เข้าใจ เพราะ AI สร้างภาพไม่มีความจำข้ามครั้ง
- ถ้าฉากติดกันเปลี่ยนสถานที่ ต้องเสนอฉากเชื่อมใน transitionToNext เสมอ ห้ามให้ภาพกระโดด
- Prompt ทั้งหมดต้องเป็นภาษาอังกฤษ ยกเว้นบทพูดที่เป็นภาษาไทยได้
- ห้ามใส่คำที่ทำให้ AI สร้างภาพโป๊หรือเสื้อผ้าหลุด และให้ใส่การป้องกันไว้ใน negativePromptEN เสมอ
- ห้ามระบุชื่อเพลงจริง ชื่อศิลปินจริง หรือชื่อแบรนด์ที่ไม่ใช่ของผู้ใช้`,
    },
    {
      key: 'imageQC', label: 'ตรวจภาพที่ AI สร้าง ก่อนเอาไปทำวิดีโอ', Icon: ClipboardCheck, color: '#F59E0B',
      desc: 'แนบภาพที่ AI สร้างออกมา (สูงสุด 8 รูป) ให้ตรวจก่อนเอาไปทำวิดีโอ — หน้าตัวละครเหมือนกันทุกภาพไหม เสื้อผ้าหลุดไหม นิ้วเกินไหม องค์ประกอบภาพใช้ได้ไหม ภาพไหนต้องสร้างใหม่',
      action: 'imageQC', images: 8,
      fields: [
        { k: 'expect', label: 'ภาพชุดนี้ควรเป็นอะไร', ph: 'ตัวละครหญิงคนเดิม 6 ฉาก ในบ้าน', big: true },
        { k: 'charLock', label: 'ลักษณะตัวละครที่ล็อกไว้', ph: 'วางบล็อก CHARACTER LOCK ที่ได้จากเครื่องมือก่อนหน้ามาตรงนี้', big: true },
      ],
      sys: `คุณคือฝ่ายตรวจคุณภาพภาพที่สร้างจาก AI ก่อนนำไปผลิตวิดีโอ ตรวจอย่างละเอียดทีละภาพ
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "title":"ผลตรวจภาพก่อนทำวิดีโอ",
 "overall":"ผ่านทั้งหมด|ต้องแก้บางภาพ|ต้องสร้างใหม่เกือบหมด",
 "perImage":[{"no":1,"whatISee":"อธิบายสิ่งที่เห็นในภาพนี้จริงๆ","faceConsistent":"เหมือนภาพอื่น|ไม่เหมือน|ตัดสินไม่ได้","clothingOk":"เรียบร้อย|เสื้อผ้าหลุดหรือโป๊|เปลี่ยนชุดจากภาพอื่น","anatomyOk":"ปกติ|นิ้วเกินหรือขาด|แขนขาผิดรูป|ใบหน้าเบี้ยว","textArtifact":"ไม่มีตัวหนังสือ|มีตัวหนังสือมั่ว","composition":"ประเมินองค์ประกอบภาพและพื้นที่สำหรับใส่ซับ","verdict":"ใช้ได้|ต้องแก้|ต้องสร้างใหม่","fixHint":"ถ้าต้องแก้ ให้บอกว่าควรเพิ่มอะไรใน prompt หรือ negative prompt"}],
 "consistencyReport":"สรุปว่าตัวละครหน้าเดียวกันตลอดชุดไหม ถ้าไม่ ให้ระบุว่าภาพไหนหลุด",
 "safetyFlags":["ปัญหาที่ทำให้โพสต์ไม่ได้ เช่น เสื้อผ้าหลุด ท่าทางสื่อไปทางเพศ ภาพเด็กในบริบทไม่เหมาะสม ถ้าไม่มีให้ใส่ ไม่พบ"],
 "nextStep":"สรุปว่าควรทำอะไรต่อ ไปทำวิดีโอได้เลย หรือต้องสร้างภาพไหนใหม่ก่อน"
}
กติกาเข้มงวด:
- ตรวจทีละภาพจริงๆ ห้ามตอบรวมๆ ต้องมี perImage ครบตามจำนวนภาพที่แนบมา
- ถ้าภาพไม่ชัดหรือดูไม่ออก ให้ใส่ตัดสินไม่ได้ ห้ามเดา
- เรื่องเสื้อผ้าหลุดและความเหมาะสมต้องตรวจเข้มเป็นพิเศษ เพราะโพสต์ไปแล้วโดนแบนทันที
- ถ้าผู้ใช้ให้ลักษณะตัวละครที่ล็อกไว้มา ต้องเทียบกับภาพจริงว่าตรงไหม เช่น สีเสื้อ ทรงผม`,
    },
    {
      key: 'finalQC', label: 'ตรวจก่อนโพสต์ (ด่านสุดท้าย)', Icon: BadgeCheck, color: '#22D3EE',
      desc: 'ตัดต่อเสร็จแล้วแต่ยังไม่โพสต์ — แคปหน้าจอคลิปที่ตัดเสร็จมา (ช่วงที่มีซับ) พร้อมวางแคปชั่นที่จะใช้จริง ระบบจะตรวจคำสะกดผิดในซับ คำที่ผิดกฎแพลตฟอร์ม ซับบังหน้าหรือล้นจอ และความสอดคล้องของแคปชั่นกับคลิป',
      action: 'finalQC', images: 6, useBrand: true,
      fields: [
        { k: 'caption', label: 'แคปชั่นที่จะใช้จริง', ph: 'วางแคปชั่นเต็มพร้อมแฮชแท็กที่จะโพสต์', required: true, big: true },
        { k: 'product', label: 'สินค้าในคลิป', ph: 'ชื่อสินค้า ถ้ามี' },
        { k: 'platform', label: 'จะลงที่ไหน', ph: 'TikTok / Facebook / Instagram / Threads / Lemon8 / Shopee / YouTube' },
        { k: 'spoken', label: 'บทพูดในคลิป (ถ้ามี)', ph: 'วางบทพูดเพื่อให้เทียบกับซับว่าตรงกันไหม', big: true },
      ],
      sys: `คุณคือด่านตรวจสุดท้ายก่อนโพสต์คลิปลงโซเชียล ตรวจอย่างละเอียดเหมือนคนที่รู้ว่าโพสต์ผิดแล้วช่องโดนปิดการมองเห็น
คุณจะได้รับภาพหน้าจอจากคลิปที่ตัดเสร็จแล้ว และแคปชั่นที่จะใช้จริง
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "verdict":"โพสต์ได้เลย|แก้ก่อนโพสต์|ห้ามโพสต์",
 "summary":"สรุปเหตุผล 1-2 ประโยค ตรงไปตรงมา",
 "subtitleIssues":[{"frame":"ภาพที่เท่าไหร่","found":"ข้อความที่อ่านได้จากภาพ ยกมาตรงๆ","problem":"สะกดผิด|คำผิดกฎ|อ่านไม่ทัน|ซับบังหน้าหรือล้นจอ|ซับไม่ตรงกับบทพูด","fix":"แก้เป็นอะไร"}],
 "captionCheck":{"spelling":["คำสะกดผิดในแคปชั่น พร้อมคำที่ถูก ถ้าไม่มีให้เป็นลิสต์ว่าง"],"riskyWords":[{"word":"คำเสี่ยงผิดกฎในแคปชั่น","why":"ผิดตรงไหน","replaceWith":"ใช้คำนี้แทน"}],"hashtags":"ประเมินแฮชแท็กที่ใช้ เหมาะสมไหม ควรเพิ่มหรือตัดอันไหน","aiLabel":"ถ้าคลิปสร้างด้วย AI ต้องระบุกำกับไหม บอกให้ชัด"},
 "visualCheck":["ปัญหาที่เห็นในภาพ เช่น เสื้อผ้าไม่เรียบร้อย โลโก้แบรนด์อื่นโผล่ ข้อความบนจออ่านไม่ออก ถ้าไม่พบให้ใส่ ไม่พบปัญหา"],
 "mustFixBeforePost":["สิ่งที่ต้องแก้ก่อนโพสต์เท่านั้น เรียงตามความสำคัญ ถ้าไม่มีให้เป็นลิสต์ว่าง"],
 "readyChecklist":["เช็คลิสต์สุดท้าย ติ๊กทีละข้อก่อนกดโพสต์"]
}
กติกาเข้มงวด:
- อ่านข้อความในภาพจริงๆ แล้วยกมาตรงๆ ห้ามเดาว่าซับเขียนว่าอะไร ถ้าอ่านไม่ออกให้บอกว่าอ่านไม่ออกและขอภาพที่ชัดกว่า
- ตรวจคำสะกดภาษาไทยอย่างละเอียด โดยเฉพาะสระและวรรณยุกต์ที่มักพิมพ์ผิด
- คำที่ห้ามใช้กับสินค้าอาหารเสริมและความงาม เช่น รักษา หาย ลดได้แน่นอน เผาผลาญ ขาวขึ้นภายในกี่วัน ปลอดภัย 100% ต้องจับให้ครบทั้งในซับและแคปชั่น
- ถ้าเห็นว่าคลิปสร้างด้วย AI ต้องเตือนเรื่องการติดป้ายกำกับเนื้อหา AI ตามกฎแพลตฟอร์ม
- verdict ต้องเป็น "ห้ามโพสต์" ถ้าพบเนื้อหาที่ผิดกฎชัดเจน ห้ามผ่านให้เพราะเกรงใจ`,
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

  // สีวนสำหรับชุดข้อมูลในกราฟ
  const CHART_COLORS = [C.blue, C.violet, C.emerald, C.orange, C.cyan, C.pink, C.teal, C.red];

  // AI ส่ง charts / metrics กลับมา ให้วาดเป็นกราฟและการ์ดเปอร์เซ็นต์
  // รูปแบบที่รองรับ: { type:'bar'|'line'|'pie', title, data:[{name, value}] }
  function renderChart(ch, i) {
    const rows = Array.isArray(ch?.data) ? ch.data.filter((d) => d && d.name != null && !Number.isNaN(Number(d.value))) : [];
    if (rows.length === 0) return null;
    const data = rows.map((d) => ({ name: String(d.name).slice(0, 22), value: Number(d.value) }));
    const t = String(ch.type || 'bar').toLowerCase();
    return (
      <div key={i} className="p-3 rounded-xl mb-2" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
        {ch.title && <div className="font-mono text-2xs mb-2" style={{ color: C.blue }}>{ch.title}</div>}
        <ResponsiveContainer width="100%" height={t === 'pie' ? 180 : Math.max(150, data.length * 26)}>
          {t === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={38} outerRadius={68} stroke="none">
                {data.map((d, j) => <Cell key={j} fill={CHART_COLORS[j % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          ) : t === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Line type="monotone" dataKey="value" stroke={C.blue} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={92} tick={{ fill: C.muted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((d, j) => <Cell key={j} fill={CHART_COLORS[j % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }

  function renderVal(key, val) {
    if (val == null || val === '') return null;

    // ชุดกราฟที่ AI ส่งกลับมา
    if (key === 'charts' && Array.isArray(val)) {
      const out = val.map(renderChart).filter(Boolean);
      return out.length ? <div>{out}</div> : null;
    }

    // การ์ดตัวเลข/เปอร์เซ็นต์
    if (key === 'metrics' && Array.isArray(val)) {
      const items = val.filter((m) => m && m.label != null && m.value != null);
      if (!items.length) return null;
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {items.map((m, i) => {
            const dir = String(m.trend || '').toLowerCase();
            const tc = dir.includes('ขึ้น') || dir === 'up' ? C.emerald : dir.includes('ลง') || dir === 'down' ? C.red : C.muted;
            return (
              <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <div className="font-mono mb-0.5" style={{ fontSize: 9, color: C.muted }}>{m.label}</div>
                <div className="font-display text-lg font-bold leading-none" style={{ color: C.text }}>{m.value}</div>
                {m.note && <div className="font-body mt-0.5" style={{ fontSize: 10, color: tc }}>{m.note}</div>}
              </div>
            );
          })}
        </div>
      );
    }

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

function DeptTool({ tool, deptId, records, setRecords, showToast, ctx }) {
  const [vals, setVals] = useState({});
  const [imgs, setImgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [openId, setOpenId] = useState(null);
  const [canvaTemplates, setCanvaTemplates] = useState(null); // null=ยังไม่โหลด, []=ไม่มี/ไม่ได้เชื่อม

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

  // ให้ AI อ่านรูปแล้วกรอกช่องข้อมูลให้อัตโนมัติ — ผิดตรงไหนค่อยแก้เอง
  const [filling, setFilling] = useState(false);
  async function autoFill() {
    if (imgs.length === 0) { setErr('แนบรูปก่อน แล้วระบบจะกรอกให้อัตโนมัติ'); return; }
    setFilling(true); setErr('');
    const spec = (tool.fields || []).map((f) => `"${f.k}": "${f.label}${f.ph ? ` (ตัวอย่าง: ${f.ph})` : ''}"`).join(',\n ');
    const sys = `คุณคือระบบอ่านข้อมูลจากภาพเอกสาร อ่านทุกอย่างที่เห็นในภาพที่แนบมา แล้วกรอกลงช่องข้อมูลให้ครบที่สุด
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ code fence
รูปแบบ (key ต้องตรงเป๊ะ ค่าเป็นข้อความภาษาไทยหรือตัวเลข):
{
 ${spec}
}
กติกา: อ่านไม่เจอข้อมูลช่องไหนให้ใส่ "" · ห้ามเดาหรือแต่งข้อมูลขึ้นเอง · ถ้าเป็นวันที่ให้เขียนแบบ วว/ดด/ปปปป · ตัวเลขเงินไม่ต้องใส่หน่วย`;
    try {
      const text = await callClaude(sys, 'อ่านข้อมูลจากภาพที่แนบมาแล้วกรอกลงช่องให้ครบ',
        imgs.map((i) => ({ mimeType: i.mimeType, data: i.base64 })), 'metricRead');
      const json = parseJsonLoose(text);
      const next = { ...vals };
      let n = 0;
      (tool.fields || []).forEach((f) => {
        const v = json[f.k];
        if (v != null && String(v).trim() !== '') { next[f.k] = String(v); n++; }
      });
      setVals(next);
      showToast(n > 0 ? `กรอกให้แล้ว ${n} ช่อง — ตรวจดูอีกทีแล้วแก้ตรงที่ผิดได้เลย` : 'อ่านข้อมูลจากรูปไม่ได้ ลองแนบรูปที่ชัดกว่านี้');
    } catch (e) { setErr(`กรอกอัตโนมัติไม่สำเร็จ: ${e.message || ''}`); }
    setFilling(false);
  }

  // สร้างบริบทของแบรนด์จากโปรไฟล์องค์กรของผู้ใช้เอง — ข้อมูลนี้มาจากบัญชีที่ล็อกอินอยู่เท่านั้น
  // จึงเป็นของแต่ละองค์กรโดยอัตโนมัติ ไม่มีทางปนกับองค์กรอื่น
  function brandContext() {
    const u = ctx?.user || {};
    const org = u.org || {};
    const lines = [];
    if (org.companyName) lines.push(`ชื่อกิจการ: ${org.companyName}`);
    if (org.businessDesc) lines.push(`ธุรกิจทำอะไร: ${org.businessDesc}`);
    if (org.website) lines.push(`เว็บไซต์: ${org.website}`);
    const chs = (ctx?.channels || []).map((c) => `${c.name}${c.platform ? ` (${c.platform})` : ''}${c.niche ? ` แนว${c.niche}` : ''}`);
    if (chs.length) lines.push(`ช่อง/เพจที่ดูแล: ${chs.join(' · ')}`);
    if (canvaTemplates && canvaTemplates.length) {
      lines.push(`เทมเพลตแบรนด์ที่มีอยู่จริงใน Canva (อ้างอิงชื่อเหล่านี้ได้เวลาเสนอไอเดีย): ${canvaTemplates.map((t) => t.title).filter(Boolean).join(', ')}`);
    }
    return lines.length ? lines.join('\n') : null;
  }

  // โหลดรายชื่อเทมเพลตแบรนด์จาก Canva มาครั้งเดียว (ถ้าเชื่อมต่อไว้และเครื่องมือนี้ต้องใช้ข้อมูลแบรนด์)
  useEffect(() => {
    if (!tool.useBrand || canvaTemplates !== null) return;
    apiPost('/api/canva/actions', { action: 'listBrandTemplates' }).then((r) => {
      setCanvaTemplates(r.ok ? (r.data.items || []).slice(0, 20) : []);
    });
  }, [tool.useBrand]);

  // ชื่อคลิปที่เคยทำจริง ใช้กันไม่ให้ AI เสนอไอเดียซ้ำของเดิม
  function pastClips(limit = 40) {
    const fromHistory = (ctx?.history || []).flatMap((h) => Array.isArray(h.tasks) ? h.tasks : []);
    const all = [...fromHistory, ...(ctx?.tasks || [])]
      .map((t) => String(t?.label || '').trim())
      .filter(Boolean);
    return [...new Set(all)].slice(-limit);
  }

  async function run() {
    const missing = (tool.fields || []).filter((f) => f.required && !String(vals[f.k] || '').trim());
    if (missing.length) { setErr(`กรุณากรอก: ${missing.map((m) => m.label).join(', ')}`); return; }
    if (tool.images && imgs.length === 0 && (tool.fields || []).length === 0) { setErr('กรุณาแนบรูปอย่างน้อย 1 รูป'); return; }
    setBusy(true); setErr('');
    const parts = [];
    if (tool.useBrand) {
      const bc = brandContext();
      parts.push(bc
        ? `[ข้อมูลแบรนด์ของผู้ใช้ — ต้องอิงข้อมูลนี้เท่านั้น ห้ามเสนอสิ่งที่ไม่เกี่ยวกับธุรกิจนี้]\n${bc}`
        : '[ยังไม่มีข้อมูลแบรนด์ในระบบ — ให้ถามกลับว่าต้องการให้อิงอะไร แทนที่จะเดาเอง]');
    }
    if (tool.useHistory) {
      const past = pastClips();
      parts.push(past.length
        ? `[คลิปที่เคยทำไปแล้ว — ห้ามเสนอซ้ำหรือใกล้เคียงของเดิม]\n${past.join(' | ')}`
        : '[ยังไม่มีประวัติคลิปเก่าในระบบ]');
    }
    const fieldBody = (tool.fields || []).map((f) => `${f.label}: ${vals[f.k] || '-'}`).join('\n');
    if (fieldBody) parts.push(fieldBody);
    const body = parts.join('\n\n');
    try {
      const text = await callClaude(tool.sys, body || 'วิเคราะห์จากภาพที่แนบมา',
        imgs.length ? imgs.map((i) => ({ mimeType: i.mimeType, data: i.base64 })) : undefined, tool.action,
        tool.useSearch ? { search: true } : undefined);
      const json = parseJsonLoose(text);
      // เก็บแหล่งอ้างอิงจากการค้นเว็บไว้คู่กับผลลัพธ์ เพื่อให้ตรวจย้อนได้ว่าข้อมูลมาจากไหน
      const si = tool.useSearch ? getLastSearchInfo() : null;
      const rec = { id: `${Date.now()}`, at: Date.now(), date: todayDateStr(), dept: deptId, tool: tool.key, toolLabel: tool.label, input: { ...vals }, thumb: imgs[0]?.dataUrl || null, imageCount: imgs.length, data: json,
        sources: si?.sources || [], searchUsed: !!si?.searchUsed, searchNote: si?.searchNote || null };
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
          <div className="mt-2.5 flex justify-center">
            <CanvaBridge
              imageDataUrl={imgs[0]?.dataUrl}
              imageName={`${tool.label}-${todayDateStr()}`}
              showToast={showToast}
              onPulledImage={(dataUrl, name) => {
                if (imgs.length >= (tool.images || 6)) { setErr('แนบรูปครบแล้ว ลบรูปเก่าก่อนดึงเข้ามาใหม่'); return; }
                const [head, base64] = dataUrl.split(',');
                const mimeType = (head.match(/data:(.*);base64/) || [])[1] || 'image/png';
                setImgs((p) => [...p, { id: `${Date.now()}-canva`, mimeType, base64, dataUrl }]);
              }}
            />
          </div>
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
      <div className="flex gap-1.5 flex-wrap">
        {tool.images > 0 && (tool.fields || []).length > 0 && (
          <button onClick={autoFill} disabled={filling || imgs.length === 0} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.cyan}`, color: C.cyan, opacity: (filling || imgs.length === 0) ? 0.5 : 1 }}>
            {filling ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />} ให้ AI กรอกช่องให้จากรูป
          </button>
        )}
        <button onClick={run} disabled={busy} className="font-mono text-2xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: tool.color, color: '#111', opacity: busy ? 0.6 : 1 }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI วิเคราะห์
        </button>
      </div>

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
                <span className="font-mono text-2xs" style={{ color: C.muted }}>
                  บันทึกเมื่อ {new Date(active.at).toLocaleString('th-TH')}{active.imageCount ? ` · ${active.imageCount} รูป` : ''}
                  {active.searchUsed && <span style={{ color: C.emerald }}> · ค้นเว็บแล้ว</span>}
                </span>
                <button onClick={() => { setRecords((records || []).filter((x) => x.id !== active.id)); setOpenId(null); }} style={{ color: C.muted }}><Trash2 size={12} /></button>
              </div>
              <AutoResult data={active.data} />

              {active.searchNote && (
                <p className="font-body text-xs mt-2 p-2 rounded-lg" style={{ color: C.orange, background: `${C.orange}12` }}>{active.searchNote}</p>
              )}
              {Array.isArray(active.sources) && active.sources.length > 0 && (
                <div className="mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="font-mono text-2xs mb-1.5" style={{ color: C.emerald }}>แหล่งอ้างอิงจากการค้นเว็บ · กดเปิดเพื่อตรวจเองได้</div>
                  <div className="space-y-1">
                    {active.sources.slice(0, 8).map((src, i) => {
                      const url = typeof src === 'string' ? src : (src.uri || src.url || '');
                      const title = typeof src === 'string' ? src : (src.title || src.uri || src.url || 'แหล่งอ้างอิง');
                      if (!url) return null;
                      return (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="font-body text-xs flex items-start gap-1.5" style={{ color: C.cyan }}>
                          <ExternalLink size={10} className="shrink-0 mt-0.5" />
                          <span className="break-all">{String(title).slice(0, 110)}</span>
                        </a>
                      );
                    })}
                  </div>
                  <p className="font-body mt-1.5" style={{ fontSize: 10, color: C.muted }}>AI สรุปจากหน้าเหล่านี้ ควรกดเข้าไปตรวจเองก่อนใช้ตัดสินใจจริง</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DeptWorkspace({ dept, records, setRecords, showToast, ctx, initialTool, onConsumeInitialTool }) {
  const tools = DEPT_TOOLS[dept.id] || [];
  const [active, setActive] = useState(tools[0]?.key || null);
  // เปิดเครื่องมือที่เลือกมาจากแถบค้นหาคำสั่งทันที แล้วล้างค่าทิ้ง
  useEffect(() => {
    if (initialTool && tools.some((t) => t.key === initialTool)) {
      setActive(initialTool);
      onConsumeInitialTool && onConsumeInitialTool();
    }
  }, [initialTool]);
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
      <DeptTool tool={tool} deptId={dept.id} records={records} setRecords={setRecords} showToast={showToast} ctx={ctx} />
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

function DepartmentView({ dept, onBack, records, setRecords, showToast, ctx, initialTool, onConsumeInitialTool }) {
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
      <DeptWorkspace dept={dept} records={records} setRecords={setRecords} showToast={showToast} ctx={ctx} initialTool={initialTool} onConsumeInitialTool={onConsumeInitialTool} />

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

const PLAN_AHEAD_SYS = `คุณคือผู้ช่วยวางแผนงานล่วงหน้าของทีมผลิตคอนเทนต์ หน้าที่คือเตือนล่วงหน้าไม่ให้งานชนกับธุระที่จดไว้
คุณจะได้รับ: งานที่ต้องทำในแต่ละวันข้างหน้า + โน้ตธุระที่ผู้ใช้จดไว้ + วันที่ทำเครื่องหมายว่า "ไม่ว่าง"
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ \`\`\`json
{
 "headline":"สรุปสถานการณ์ข้างหน้า 1 ประโยค ตรงไปตรงมา",
 "riskLevel":"ปลอดภัย|ต้องระวัง|เสี่ยงสูง",
 "conflicts":[{"date":"YYYY-MM-DD","what":"วันนั้นมีธุระอะไรชนกับงานอะไร","impact":"ถ้าไม่ทำอะไรจะเกิดอะไรขึ้น"}],
 "actions":[{"when":"ควรทำเมื่อไหร่ เช่น วันนี้ / พรุ่งนี้ / ก่อนวันที่ X","do":"ทำอะไรให้ชัดเจนเป็นรูปธรรม","why":"ทำไมต้องทำตอนนั้น"}],
 "lightDays":["วันที่งานเบา เหมาะเอาไว้ทำงานล่วงหน้า พร้อมเหตุผล"],
 "advice":"คำแนะนำหลัก 1 ข้อที่สำคัญที่สุด"
}
กติกา: อ้างวันที่และจำนวนงานจริงจากข้อมูลที่ให้มาเสมอ ห้ามสมมติวันหรือธุระที่ไม่มีในข้อมูล · ถ้าไม่มีธุระชนกันเลยให้บอกตรงๆ ว่าปลอดภัย ไม่ต้องหาปัญหาให้ · เน้นบอกว่า "ควรดันงานวันไหนมาทำก่อน" เป็นรูปธรรม`;

const PROGRESS_SYS = `คุณคือผู้ตรวจผลงานคอนเทนต์ที่เข้มงวดและตรงไปตรงมา อ่านตัวเลขจากภาพหน้าจอสถิติที่แนบมา แล้วประเมินผลงานของวันนั้น
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ \`\`\`json
{
 "readNumbers":[{"clip":"ชื่อคลิปหรือคำอธิบายสั้นๆ ที่เห็นในภาพ","platform":"แพลตฟอร์มที่เห็นในภาพ ถ้าไม่เห็นให้ใส่ ไม่ระบุ","views":"ยอดวิวที่อ่านได้ ถ้าไม่เห็นใส่ -","likes":"-","comments":"-","shares":"-","watchTime":"เวลาดูเฉลี่ย/อัตราดูจบ ถ้าเห็น"}],
 "verdict":"ดีมาก|ดี|พอใช้|ต่ำกว่าเป้า",
 "verdictReason":"อธิบายด้วยตัวเลขจริงที่อ่านได้เท่านั้น ว่าทำไมถึงตัดสินแบบนี้",
 "compareLast":"เทียบกับครั้งก่อนดีขึ้นหรือแย่ลงอย่างไร ใช้ตัวเลขเทียบ ถ้าไม่มีข้อมูลครั้งก่อนให้ใส่ ยังไม่มีข้อมูลเทียบ",
 "whatWorked":["สิ่งที่ได้ผล อ้างตัวเลขประกอบ"],
 "whatToFix":[{"issue":"ปัญหาที่เห็นจากตัวเลข","fix":"แก้ยังไงให้เป็นรูปธรรม ทำได้จริงพรุ่งนี้"}],
 "nextAction":"สิ่งที่ควรทำต่อวันพรุ่งนี้ ชัดเจนเป็นรูปธรรม 1 อย่าง"
}
กติกาเข้มงวด:
- ห้ามแต่งตัวเลขขึ้นเองเด็ดขาด อ่านได้เท่าไหร่ใส่เท่านั้น อ่านไม่ออกใส่ "-"
- ห้ามเขียนคำแนะนำกว้างๆ แบบ "ควรทำคอนเทนต์ให้ดีขึ้น" หรือ "ควรโพสต์สม่ำเสมอ" — ต้องบอกเป็นรูปธรรมว่าทำอะไร เช่น "3 วินาทีแรกตอนนี้เป็นภาพนิ่ง ให้เปลี่ยนเป็นภาพเคลื่อนไหวหรือคำถาม"
- ถ้าภาพที่แนบมาอ่านตัวเลขไม่ได้เลย หรือไม่ใช่ภาพสถิติ ให้ตอบ verdict เป็น "ต่ำกว่าเป้า" แล้วเขียน verdictReason ว่าอ่านภาพไม่ได้ ขอภาพที่ชัดกว่านี้ ห้ามเดาผลลัพธ์
- ถ้ามีหลายคลิปในภาพ ให้แยกออกมาทีละคลิปใน readNumbers`;

// ---------- Onboarding: ยินยอม PDPA → กรอกโปรไฟล์ → คู่มือแนะนำการใช้งาน ----------
// ขยับเลขนี้เมื่อแก้ข้อความยินยอม เพื่อให้ผู้ใช้เดิมต้องกดยอมรับใหม่ (ต้องตรงกับ CONSENT_VERSION ใน api/auth.js)
const CONSENT_VERSION = 'v1-2026-08';
// ขยับเลขนี้เมื่อเพิ่มฟีเจอร์ใหม่ ผู้ใช้เดิมจะเห็นหน้า "มีอะไรใหม่" อัตโนมัติ
const TOUR_VERSION = 'v1';

const OCCUPATION_OPTIONS = [
  { k: 'employee', label: 'พนักงานบริษัท' },
  { k: 'student', label: 'นักเรียน / นักศึกษา' },
  { k: 'freelancer', label: 'ฟรีแลนซ์' },
  { k: 'business_owner', label: 'เจ้าของกิจการ' },
  { k: 'other', label: 'อื่นๆ' },
];

// เนื้อหาคู่มือ — เพิ่มฟีเจอร์ใหม่ให้เพิ่มการ์ดตรงนี้ แล้วขยับ TOUR_VERSION
const TOUR_SLIDES = [
  {
    icon: Layers, color: '#3B82F6', title: 'หน้างานประจำวัน',
    body: 'ศูนย์กลางการทำงานทุกวัน สร้างช่อง/เพจที่ดูแล แล้วระบบจะสร้างงานประจำวันให้อัตโนมัติ ติ๊กเสร็จทีละงาน งานที่ทำไม่ทันจะถูกยกไปวันถัดไปให้เอง',
    tips: ['กดปุ่ม AI ในแต่ละงานเพื่อให้ช่วยคิดโครงเรื่องและสร้าง Prompt', 'ติ๊กงานเสร็จแล้วระบบจะบันทึกว่าใครเป็นคนทำ'],
  },
  {
    icon: Calendar, color: '#06B6D4', title: 'ปฏิทินงาน',
    body: 'ดูภาพรวมทั้งเดือนว่าวันไหนทำครบ วันไหนหลุด พร้อมนาฬิกาเวลาโลกสำหรับวางแผนโพสต์ข้ามประเทศ และปฏิทินวันสำคัญไทย/สากลล่วงหน้า 90 วัน',
    tips: ['จดธุระในปฏิทินไว้ แล้วกด "AI เตือนล่วงหน้า" จะช่วยคำนวณว่าควรดันงานวันไหนมาทำก่อน', 'แคปสถิติคลิปมาให้ AI อ่านเพื่อติดตามความคืบหน้าได้'],
  },
  {
    icon: Building2, color: '#8B5CF6', title: 'แผนกต่างๆ',
    body: 'เครื่องมือ AI แยกตามแผนก ทั้งคอนเทนต์ วิเคราะห์ข้อมูล การตลาด ฝ่ายขาย และตรวจสอบคุณภาพ แต่ละแผนกมีเครื่องมือเฉพาะทางของตัวเอง',
    tips: ['สิทธิ์การเข้าถึงแต่ละแผนกขึ้นกับระดับบัญชีของคุณ'],
  },
  {
    icon: Activity, color: '#10B981', title: 'วิเคราะห์และสถิติ',
    body: 'แนบภาพหน้าจอสถิติจากหลังบ้านแพลตฟอร์มต่างๆ ให้ AI อ่านตัวเลขและวิเคราะห์ให้ พร้อมเปรียบเทียบคู่แข่งและวางแผนกลยุทธ์',
    tips: ['ยิ่งแนบภาพที่ชัดและครบ ผลวิเคราะห์จะยิ่งแม่น'],
  },
  {
    icon: Zap, color: '#F59E0B', title: 'ระบบโทเค็น',
    body: 'ทุกครั้งที่เรียกใช้ AI จะหักโทเค็นตามความหนักของงาน ถ้าใส่คีย์ Gemini ของคุณเองในหน้าตั้งค่า จะใช้ได้ไม่จำกัดและไม่ต้องรอคิวร่วมกับคนอื่น',
    tips: ['คีย์ Gemini ขอฟรีได้ ใช้เวลาประมาณ 2 นาที', 'ดูโทเค็นคงเหลือได้ที่แถบด้านซ้าย'],
  },
  {
    icon: Shield, color: '#EF4444', title: 'ความปลอดภัยและข้อมูล',
    body: 'ข้อมูลขององค์กรคุณถูกแยกออกจากองค์กรอื่นอย่างสมบูรณ์ เพื่อนร่วมองค์กรเห็นข้อมูลส่วนกลางร่วมกัน แต่คนนอกองค์กรเข้าถึงไม่ได้',
    tips: ['อย่าแชร์รหัสผ่านกับใคร', 'ถ้าสงสัยว่าบัญชีถูกใช้งานผิดปกติ ให้เปลี่ยนรหัสผ่านทันที — ระบบจะเตะอุปกรณ์อื่นออกให้'],
  },
];

function ConsentDoc() {
  return (
    <div className="space-y-3 font-body" style={{ fontSize: 12, color: C.muted, lineHeight: 1.75 }}>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>1. ผู้ให้บริการและผู้ควบคุมข้อมูลส่วนบุคคล</div>
        <p>ระบบ FORGE เป็นเครื่องมือบริหารงานผลิตคอนเทนต์ ผู้ให้บริการทำหน้าที่เป็นผู้ควบคุมข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) หากคุณอยู่ในเขตเศรษฐกิจยุโรป ผู้ให้บริการจะดำเนินการตามหลักการของ GDPR ประกอบด้วย ช่องทางติดต่อเรื่องข้อมูลส่วนบุคคลอยู่ในหน้าตั้งค่าของระบบ</p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>2. ข้อมูลที่เก็บรวบรวม</div>
        <p>• ข้อมูลบัญชี: ชื่อ ชื่อผู้ใช้ อีเมล รหัสผ่านที่เข้ารหัสแล้ว วันเดือนปีเกิด อาชีพ เบอร์ติดต่อ<br />
        • ข้อมูลองค์กร (เฉพาะผู้สมัครในนามนิติบุคคล): ชื่อบริษัท เลขประจำตัวผู้เสียภาษี ที่อยู่ ที่ตั้งสำนักงาน/โกดัง ช่องทางติดต่อ รายละเอียดธุรกิจ ชื่อและวันเกิดของเจ้าของกิจการ<br />
        • ข้อมูลการใช้งาน: หมายเลข IP ลายนิ้วมืออุปกรณ์อย่างง่าย เวลาเข้าใช้งาน หน้าที่เปิด และประวัติการเรียกใช้ AI<br />
        • เนื้อหาที่คุณสร้างหรืออัปโหลด: งาน ช่อง โน้ต รูปภาพหน้าจอ และข้อความที่ส่งให้ระบบ AI ประมวลผล</p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>3. วัตถุประสงค์และฐานทางกฎหมาย</div>
        <p>• เพื่อให้บริการตามสัญญาการใช้งาน (ฐานสัญญา): สร้างบัญชี ยืนยันตัวตน บันทึกงานและผลลัพธ์<br />
        • เพื่อความปลอดภัยของระบบ (ฐานประโยชน์อันชอบด้วยกฎหมาย): ตรวจจับการใช้งานผิดปกติ จำกัดการเรียกใช้ที่ถี่ผิดปกติ และป้องกันการสมัครซ้ำเพื่อเลี่ยงข้อจำกัด<br />
        • เพื่อประมวลผลด้วยปัญญาประดิษฐ์ (ฐานความยินยอม): ส่งเนื้อหาที่คุณกรอกหรืออัปโหลดไปยังผู้ให้บริการ AI เพื่อสร้างผลลัพธ์ให้คุณ<br />
        • เพื่อสื่อสารเรื่องบริการและข่าวสาร (ฐานความยินยอม เฉพาะกรณีที่คุณเลือก)</p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>4. การเปิดเผยและการส่งข้อมูลไปต่างประเทศ</div>
        <p>เมื่อคุณกดใช้ฟังก์ชัน AI ระบบจะส่งข้อความและรูปภาพที่เกี่ยวข้องไปยัง Google (Gemini API) ซึ่งประมวลผลบนเซิร์ฟเวอร์ในต่างประเทศ ระบบยังใช้ผู้ให้บริการภายนอกสำหรับฐานข้อมูล การส่งอีเมลยืนยันตัวตน และการโฮสต์เว็บไซต์ ซึ่งอาจอยู่นอกประเทศไทย <span style={{ color: C.text }}>กรุณาหลีกเลี่ยงการอัปโหลดข้อมูลที่มีความอ่อนไหวสูง เช่น เลขบัตรประชาชน ข้อมูลสุขภาพ หรือข้อมูลทางการเงินของบุคคลอื่น</span></p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>5. ระยะเวลาการเก็บรักษา</div>
        <p>ข้อมูลบัญชีและเนื้อหาจะถูกเก็บตลอดระยะเวลาที่บัญชียังใช้งานอยู่ บันทึกกิจกรรมและข้อมูลความปลอดภัยจะถูกเก็บเท่าที่จำเป็นตามวัตถุประสงค์ เมื่อคุณขอลบบัญชี ข้อมูลจะถูกลบหรือทำให้ไม่สามารถระบุตัวบุคคลได้ เว้นแต่มีหน้าที่ต้องเก็บตามกฎหมาย</p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>6. สิทธิของเจ้าของข้อมูลส่วนบุคคล</div>
        <p>คุณมีสิทธิขอเข้าถึงและขอสำเนาข้อมูล ขอแก้ไขให้ถูกต้อง ขอลบหรือทำลาย ขอให้ระงับการใช้ ขอให้โอนย้ายข้อมูล คัดค้านการประมวลผล และถอนความยินยอมได้ตลอดเวลา การถอนความยินยอมไม่กระทบการประมวลผลที่ทำไปแล้วโดยชอบ แต่อาจทำให้ใช้ฟังก์ชัน AI ต่อไม่ได้ หากเห็นว่าการประมวลผลไม่ชอบด้วยกฎหมาย คุณมีสิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.blue }}>7. ข้อกำหนดการใช้บริการโดยสรุป</div>
        <p>• ห้ามใช้ระบบเพื่อสร้างเนื้อหาที่ผิดกฎหมาย ละเมิดลิขสิทธิ์ หลอกลวง หรือสร้างความเสียหายแก่ผู้อื่น<br />
        • คุณเป็นผู้รับผิดชอบเนื้อหาที่สร้างขึ้นและการนำไปเผยแพร่ รวมถึงการปฏิบัติตามกฎของแพลตฟอร์มปลายทางและกฎหมายโฆษณาที่เกี่ยวข้อง<br />
        • ผลลัพธ์จาก AI อาจคลาดเคลื่อนได้ ควรตรวจสอบก่อนนำไปใช้จริงเสมอ โดยเฉพาะข้อมูลตัวเลข ข้อมูลทางการแพทย์ และคำกล่าวอ้างสรรพคุณสินค้า<br />
        • ห้ามแบ่งปันบัญชีให้ผู้อื่น และห้ามพยายามเข้าถึงข้อมูลขององค์กรอื่น</p>
      </div>
      <div>
        <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>8. ผู้เยาว์</div>
        <p>หากคุณอายุต่ำกว่า 20 ปีบริบูรณ์ การให้ความยินยอมอาจต้องได้รับความเห็นชอบจากผู้ปกครองตามที่กฎหมายกำหนด กรุณาแจ้งผู้ปกครองก่อนใช้งานต่อ</p>
      </div>
    </div>
  );
}

function OnboardingFlow({ user, onUpdateUser, showToast }) {
  const needConsent = !user.consent || user.consent.version !== CONSENT_VERSION;
  const needProfile = !user.onboardedAt;
  const [step, setStep] = useState(needConsent || needProfile ? 0 : 1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const [c, setC] = useState({ terms: false, privacy: false, aiTransfer: false, marketing: false });
  const [p, setP] = useState({
    accountType: 'personal', occupation: 'employee',
    birthDate: user.birthDate || '', displayName: user.name || '', phone: '',
    companyName: '', taxId: '', address: '', warehouse: '', office: '',
    orgPhone: '', orgEmail: '', facebook: '', line: '', website: '', businessDesc: '',
    owners: [{ name: '', birthDate: '' }],
  });
  const [polishing, setPolishing] = useState(false);
  const [slide, setSlide] = useState(0);

  const allTicked = c.terms && c.privacy && c.aiTransfer;
  const set = (k, v) => setP((s) => ({ ...s, [k]: v }));

  async function polishDesc() {
    if (!String(p.businessDesc).trim()) { setErr('พิมพ์รายละเอียดธุรกิจคร่าวๆ ก่อน แล้วให้ AI ช่วยเรียบเรียง'); return; }
    setPolishing(true); setErr('');
    try {
      const sys = `คุณคือผู้ช่วยเรียบเรียงข้อความแนะนำธุรกิจให้อ่านเข้าใจง่ายและเป็นมืออาชีพ
เขียนใหม่จากข้อความที่ผู้ใช้ให้มาเท่านั้น ห้ามเพิ่มข้อมูลที่เขาไม่ได้บอก ห้ามแต่งตัวเลขหรือรางวัลขึ้นเอง
ตอบกลับเป็นข้อความล้วนอย่างเดียว ไม่ต้องมีหัวข้อหรือเครื่องหมายคำพูด ความยาวไม่เกิน 4 ประโยค`;
      const text = await callClaude(sys, `เรียบเรียงข้อความนี้ให้ดีขึ้น:\n${p.businessDesc}`, undefined, 'other');
      set('businessDesc', String(text).trim());
    } catch (e) { setErr(e.message || 'เรียบเรียงไม่สำเร็จ'); }
    setPolishing(false);
  }

  async function submit() {
    if (!allTicked) { setErr('ต้องติ๊กยอมรับให้ครบทั้ง 3 ข้อก่อน'); return; }
    if (!String(p.displayName).trim()) { setErr('กรุณากรอกชื่อ-นามสกุล'); return; }
    if (!p.birthDate) { setErr('กรุณากรอกวันเดือนปีเกิด'); return; }
    if (p.accountType === 'org' && !String(p.companyName).trim()) { setErr('กรุณากรอกชื่อบริษัท/องค์กร'); return; }
    setBusy(true); setErr('');
    const r = await apiPost('/api/auth', { action: 'saveOnboarding', consent: c, profile: p });
    if (r.ok) { onUpdateUser(r.data.account); setStep(1); }
    else setErr(r.data.error || 'บันทึกไม่สำเร็จ');
    setBusy(false);
  }

  const isDevUser = !!(user.isDeveloper || user.isOwner || user.role === 'dev');

  async function devSkip() {
    setBusy(true); setErr('');
    const r = await apiPost('/api/auth', { action: 'devSkipOnboarding' });
    if (r.ok) { onUpdateUser(r.data.account); showToast && showToast('ข้ามขั้นตอนแนะนำแล้ว'); }
    else setErr(r.data.error || 'ข้ามไม่สำเร็จ');
    setBusy(false);
  }

  async function finishTour() {
    setBusy(true);
    const r = await apiPost('/api/auth', { action: 'markTourSeen', version: TOUR_VERSION });
    if (r.ok) { onUpdateUser(r.data.account); showToast && showToast('เริ่มใช้งานได้เลย'); }
    else setErr(r.data.error || 'บันทึกไม่สำเร็จ');
    setBusy(false);
  }

  const inputCls = 'w-full font-body text-xs px-2.5 py-2 rounded-xl outline-none';
  const inputSty = { background: C.bgDeep, border: `1px solid ${C.border}`, color: C.text };
  const Field = ({ label, k, ph, type = 'text', full }) => (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="font-mono block mb-1" style={{ fontSize: 9, color: C.muted }}>{label}</label>
      <input type={type} value={p[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph} className={inputCls} style={inputSty} />
    </div>
  );

  // ---------- ขั้นที่ 0: ยินยอม + โปรไฟล์ ----------
  if (step === 0) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ background: C.bg }}>
        <div className="max-w-2xl mx-auto anim-fade">
          <div className="flex items-center gap-2 mb-1"><Shield size={18} style={{ color: C.blue }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.blue }}>ขั้นตอนที่ 1 จาก 2</span></div>
          <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>ข้อกำหนดและข้อมูลของคุณ</h2>
          <p className="font-body text-xs mb-5" style={{ color: C.muted }}>อ่านและยอมรับให้ครบ 3 ข้อ พร้อมกรอกข้อมูลเบื้องต้น จึงจะเริ่มใช้งานได้</p>

          <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เอกสารข้อกำหนดและนโยบายความเป็นส่วนตัว</div>
            <div className="p-3 rounded-xl" style={{ background: C.bgDeep, maxHeight: 260, overflowY: 'auto' }}>
              <ConsentDoc />
            </div>
          </div>

          <div className="p-4 rounded-2xl mb-4 space-y-2.5" style={{ background: C.panel, border: `1px solid ${allTicked ? C.emerald : C.orange}44` }}>
            {[
              { k: 'terms', label: 'ฉันได้อ่านและยอมรับข้อกำหนดการใช้บริการ', req: true },
              { k: 'privacy', label: 'ฉันรับทราบนโยบายความเป็นส่วนตัว และยินยอมให้เก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของฉันตามวัตถุประสงค์ที่ระบุไว้', req: true },
              { k: 'aiTransfer', label: 'ฉันยินยอมให้ส่งข้อความและรูปภาพที่ฉันกรอกหรืออัปโหลด ไปประมวลผลกับผู้ให้บริการ AI ซึ่งอยู่ในต่างประเทศ', req: true },
              { k: 'marketing', label: 'ยินดีรับข่าวสารและอัปเดตฟีเจอร์ใหม่ทางอีเมล (ไม่บังคับ)', req: false },
            ].map((row) => (
              <label key={row.k} className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={c[row.k]} onChange={(e) => setC((s) => ({ ...s, [row.k]: e.target.checked }))} className="mt-0.5 shrink-0" style={{ accentColor: C.blue, width: 15, height: 15 }} />
                <span className="font-body text-xs" style={{ color: c[row.k] ? C.text : C.muted }}>
                  {row.label}{row.req && <span style={{ color: C.red }}> *</span>}
                </span>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ข้อมูลของคุณ</div>
            <div className="flex gap-1.5 mb-3">
              {[{ k: 'personal', label: 'บุคคลธรรมดา' }, { k: 'org', label: 'นิติบุคคล / องค์กร' }].map((t) => (
                <button key={t.k} onClick={() => set('accountType', t.k)} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ color: p.accountType === t.k ? '#0A0A0F' : C.muted, background: p.accountType === t.k ? C.blue : 'transparent', border: `1px solid ${p.accountType === t.k ? C.blue : C.border}` }}>{t.label}</button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5 mb-3">
              <Field label="ชื่อ-นามสกุล *" k="displayName" ph="ชื่อจริงของคุณ" />
              <Field label="วันเดือนปีเกิด *" k="birthDate" type="date" />
              <Field label="เบอร์ติดต่อ" k="phone" ph="08x-xxx-xxxx" />
              <div>
                <label className="font-mono block mb-1" style={{ fontSize: 9, color: C.muted }}>อาชีพ</label>
                <select value={p.occupation} onChange={(e) => set('occupation', e.target.value)} className={inputCls} style={inputSty}>
                  {OCCUPATION_OPTIONS.map((o) => <option key={o.k} value={o.k}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {p.accountType === 'org' && (
              <div className="pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="font-mono text-2xs mb-2.5" style={{ color: C.violet }}>ข้อมูลองค์กร</div>
                <div className="grid sm:grid-cols-2 gap-2.5 mb-2.5">
                  <Field label="ชื่อบริษัท/องค์กร *" k="companyName" ph="บริษัท ตัวอย่าง จำกัด" />
                  <Field label="เลขประจำตัวผู้เสียภาษี" k="taxId" ph="13 หลัก" />
                  <Field label="ที่อยู่จดทะเบียน" k="address" ph="ที่อยู่ตามหนังสือรับรอง" full />
                  <Field label="ที่ตั้งสำนักงาน" k="office" ph="ถ้ามี" />
                  <Field label="ที่ตั้งโกดังสินค้า" k="warehouse" ph="ถ้ามี" />
                  <Field label="เบอร์ติดต่อองค์กร" k="orgPhone" ph="02-xxx-xxxx" />
                  <Field label="อีเมลองค์กร" k="orgEmail" ph="contact@example.com" />
                  <Field label="เพจ Facebook" k="facebook" ph="ลิงก์เพจ" />
                  <Field label="LINE" k="line" ph="@lineid" />
                  <Field label="เว็บไซต์" k="website" ph="https://" full />
                </div>

                <div className="mb-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono" style={{ fontSize: 9, color: C.muted }}>ธุรกิจของคุณทำอะไร</label>
                    <button onClick={polishDesc} disabled={polishing} className="font-mono px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ fontSize: 9, border: `1px solid ${C.violet}`, color: C.violet, opacity: polishing ? 0.5 : 1 }}>
                      {polishing ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />} ให้ AI ช่วยเรียบเรียง
                    </button>
                  </div>
                  <textarea value={p.businessDesc} onChange={(e) => set('businessDesc', e.target.value)} rows={3} placeholder="เขียนคร่าวๆ ก็ได้ เช่น ขายอาหารเสริมผ่านติ๊กต๊อกและช้อปปี้ กลุ่มลูกค้าผู้หญิงอายุ 25-40" className={inputCls + ' resize-none'} style={inputSty} />
                </div>

                <div>
                  <label className="font-mono block mb-1" style={{ fontSize: 9, color: C.muted }}>เจ้าของกิจการ</label>
                  {p.owners.map((o, i) => (
                    <div key={i} className="flex gap-1.5 mb-1.5">
                      <input value={o.name} onChange={(e) => setP((s) => { const ow = [...s.owners]; ow[i] = { ...ow[i], name: e.target.value }; return { ...s, owners: ow }; })} placeholder={`ชื่อเจ้าของคนที่ ${i + 1}`} className={inputCls} style={inputSty} />
                      <input type="date" value={o.birthDate} onChange={(e) => setP((s) => { const ow = [...s.owners]; ow[i] = { ...ow[i], birthDate: e.target.value }; return { ...s, owners: ow }; })} className={inputCls} style={{ ...inputSty, maxWidth: 150 }} />
                      {p.owners.length > 1 && (
                        <button onClick={() => setP((s) => ({ ...s, owners: s.owners.filter((_, x) => x !== i) }))} className="px-2 rounded-xl shrink-0" style={{ border: `1px solid ${C.border}`, color: C.muted }}><X size={12} /></button>
                      )}
                    </div>
                  ))}
                  {p.owners.length < 10 && (
                    <button onClick={() => setP((s) => ({ ...s, owners: [...s.owners, { name: '', birthDate: '' }] }))} className="font-mono text-2xs px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
                      <Plus size={10} /> เพิ่มเจ้าของ
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {err && <p className="font-mono text-2xs mb-3" style={{ color: C.red }}>{err}</p>}
          <button onClick={submit} disabled={busy || !allTicked} className="w-full font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-1.5" style={{ background: allTicked ? C.blue : C.border, color: allTicked ? '#0A0A0F' : C.muted, opacity: busy ? 0.6 : 1, cursor: allTicked ? 'pointer' : 'not-allowed' }}>
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} ยอมรับและไปต่อ
          </button>
          {!allTicked && <p className="font-body text-xs text-center mt-2" style={{ color: C.muted }}>ต้องติ๊กยอมรับข้อ 1-3 ให้ครบก่อนจึงจะกดต่อได้</p>}
          {isDevUser && (
            <div className="mt-3 pt-3 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={devSkip} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ border: `1px solid ${C.violet}`, color: C.violet, opacity: busy ? 0.5 : 1 }}>
                <Zap size={11} /> ข้ามทั้งหมด (ผู้พัฒนา)
              </button>
              <p className="font-body mt-1.5" style={{ fontSize: 10, color: C.muted }}>ปุ่มนี้เห็นเฉพาะบัญชีผู้พัฒนา ระบบจะบันทึกว่าเป็นการข้ามโดยผู้พัฒนา ไม่นับเป็นการยินยอมจริง</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- ขั้นที่ 1: คู่มือแนะนำการใช้งาน ----------
  const isReturning = !!user.tourSeen && user.tourSeen !== TOUR_VERSION;
  const s = TOUR_SLIDES[slide];
  const last = slide >= TOUR_SLIDES.length - 1;
  return (
    <div className="min-h-screen py-8 px-4 flex items-center" style={{ background: C.bg }}>
      <div className="max-w-lg mx-auto w-full anim-fade">
        <div className="flex items-center gap-2 mb-1"><Compass size={18} style={{ color: C.violet }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>{isReturning ? 'มีอะไรใหม่' : 'ขั้นตอนที่ 2 จาก 2'}</span></div>
        <h2 className="font-body text-xl mb-4" style={{ color: C.text }}>{isReturning ? 'ระบบมีการอัปเดต' : 'แนะนำการใช้งาน'}</h2>

        <div className="p-5 rounded-2xl mb-3" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${s.color}44`, minHeight: 250 }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl shrink-0" style={{ background: `${s.color}18` }}><s.icon size={20} style={{ color: s.color }} /></div>
            <div className="font-body text-base" style={{ color: C.text }}>{s.title}</div>
          </div>
          <p className="font-body text-xs mb-3 leading-relaxed" style={{ color: C.muted }}>{s.body}</p>
          {s.tips.map((t, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-1.5">
              <span className="shrink-0 mt-0.5" style={{ color: s.color }}>▸</span>
              <span className="font-body text-xs" style={{ color: C.text }}>{t}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-4">
          {TOUR_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 18 : 6, height: 6, borderRadius: 999, background: i === slide ? C.violet : C.border, transition: 'width .2s' }} />
          ))}
        </div>

        {err && <p className="font-mono text-2xs mb-2 text-center" style={{ color: C.red }}>{err}</p>}
        {isDevUser && (
          <div className="text-center mb-2">
            <button onClick={devSkip} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ border: `1px solid ${C.violet}`, color: C.violet, opacity: busy ? 0.5 : 1 }}>
              <Zap size={11} /> ข้ามคู่มือ (ผู้พัฒนา)
            </button>
          </div>
        )}
        <div className="flex gap-2">
          {slide > 0 && (
            <button onClick={() => setSlide((v) => v - 1)} className="font-mono text-xs px-4 py-3 rounded-xl shrink-0" style={{ border: `1px solid ${C.border}`, color: C.muted }}>ย้อนกลับ</button>
          )}
          {!last ? (
            <button onClick={() => setSlide((v) => v + 1)} className="flex-1 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-1.5" style={{ background: C.violet, color: '#fff' }}>
              ถัดไป <ArrowRight size={13} />
            </button>
          ) : (
            <button onClick={finishTour} disabled={busy} className="flex-1 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-1.5" style={{ background: C.emerald, color: '#0A0A0F', opacity: busy ? 0.6 : 1 }}>
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} เข้าใจแล้ว เริ่มใช้งาน
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- ศูนย์แจ้งเตือน / Protocol: ปัญหาล่วงหน้า · กำลังเกิด · ตามหลัง ----------
const PROTOCOL_SYS = `คุณคือวิศวกรระบบที่ดูแลความเรียบร้อยของแพลตฟอร์ม อ่านรายการปัญหาที่ระบบตรวจพบจริง แล้วสรุปให้เจ้าของระบบเข้าใจว่าต้องทำอะไรก่อนหลัง
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "headline":"สรุปสถานะระบบใน 1 ประโยค ตรงไปตรงมา",
 "healthScore":0-100,
 "doFirst":[{"what":"ทำอะไร ให้ชัดเจนเป็นรูปธรรม","why":"ถ้าไม่ทำจะเกิดอะไร","urgency":"วันนี้|สัปดาห์นี้|เมื่อว่าง"}],
 "predicted":[{"risk":"ปัญหาที่กำลังจะเกิดถ้าปล่อยไว้","basedOn":"อ้างจากสัญญาณไหนในข้อมูลที่ให้มา","prevent":"ป้องกันยังไง"}],
 "ignorable":["เรื่องที่ยังไม่ต้องรีบ พร้อมเหตุผลสั้นๆ"],
 "note":"ข้อสังเกตเพิ่มเติม ถ้าไม่มีให้ใส่ -"
}
กติกาเข้มงวด:
- วิเคราะห์จากรายการปัญหาที่ให้มาเท่านั้น ห้ามสมมติปัญหาที่ไม่มีในข้อมูล
- ถ้าไม่พบปัญหาอะไรเลย ให้บอกตรงๆ ว่าระบบปกติ ห้ามหาเรื่องมาเติมให้ดูเยอะ
- doFirst ต้องเรียงตามความเร่งด่วนจริง และต้องเป็นสิ่งที่ลงมือทำได้ทันที ห้ามเขียนกว้างๆ แบบ "ควรดูแลระบบให้ดี"
- healthScore ต้องสอดคล้องกับจำนวนและความรุนแรงของปัญหา ถ้ามีปัญหาระดับสูงค้างอยู่ ห้ามให้คะแนนเกิน 60`;

function ProtocolPage({ user, showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [ai, setAi] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState('');
  const [mailBusy, setMailBusy] = useState(false);
  const [tab, setTab] = useState('current');

  async function scan() {
    setLoading(true); setErr('');
    const r = await apiPost('/api/auth', { action: 'protocolScan' });
    if (r.ok) setData(r.data); else setErr(r.data.error || 'ตรวจระบบไม่สำเร็จ');
    setLoading(false);
  }
  useEffect(() => { scan(); const id = setInterval(scan, 120000); return () => clearInterval(id); }, []);

  async function runAi() {
    if (!data) return;
    setAiBusy(true); setAiErr(''); setAi(null);
    const payload = {
      ปัญหาที่กำลังเกิด: data.current, ปัญหาล่วงหน้า: data.ahead, ปัญหาที่ตามหลัง: data.trailing,
    };
    try {
      const text = await callClaude(PROTOCOL_SYS, `รายการปัญหาที่ระบบตรวจพบจริง:\n${JSON.stringify(payload)}`, undefined, 'protocolAnalysis');
      setAi(parseJsonLoose(text));
    } catch (e) { setAiErr(e.message || 'วิเคราะห์ไม่สำเร็จ'); }
    setAiBusy(false);
  }

  async function mailMe() {
    if (!data) return;
    setMailBusy(true);
    const r = await apiPost('/api/auth', { action: 'protocolEmail', ahead: data.ahead, current: data.current, trailing: data.trailing });
    if (r.ok) showToast && showToast(`ส่งสรุปไปที่ ${r.data.to} แล้ว`);
    else showToast && showToast(r.data.error || 'ส่งอีเมลไม่สำเร็จ');
    setMailBusy(false);
  }

  const sevColor = (s) => s === 'สูง' ? C.red : s === 'กลาง' ? C.orange : C.muted;
  const TABS = [
    { k: 'current', label: 'กำลังเกิด', color: C.red, list: data?.current || [] },
    { k: 'ahead', label: 'ล่วงหน้า', color: C.orange, list: data?.ahead || [] },
    { k: 'trailing', label: 'ตามหลัง', color: C.cyan, list: data?.trailing || [] },
  ];
  const shown = TABS.find((t) => t.k === tab) || TABS[0];
  const totalHigh = (data ? [...data.current, ...data.ahead, ...data.trailing] : []).filter((x) => x.severity === 'สูง').length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><ShieldAlert size={18} style={{ color: C.red }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.red }}>PROTOCOL</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>ศูนย์แจ้งเตือนปัญหา</h2>
      <p className="font-body text-xs mb-5" style={{ color: C.muted }}>
        ระบบตรวจสัญญาณจริงทุก 2 นาที แล้วแยกเป็น 3 กลุ่ม · ขอบเขต: {data?.scope || '-'}
      </p>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className="p-3 rounded-2xl text-left" style={{ background: C.panel, border: `1px solid ${tab === t.k ? t.color : C.border}` }}>
            <div className="font-mono text-2xs mb-1" style={{ color: t.color }}>{t.label}</div>
            <div className="font-display text-2xl font-bold" style={{ color: t.list.length ? C.text : C.muted }}>{t.list.length}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={scan} disabled={loading} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.border}`, color: C.muted, opacity: loading ? 0.5 : 1 }}>
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} ตรวจใหม่
        </button>
        <button onClick={runAi} disabled={aiBusy || !data} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.violet, color: '#fff', opacity: (aiBusy || !data) ? 0.5 : 1 }}>
          {aiBusy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI สรุปว่าต้องทำอะไรก่อน
        </button>
        <button onClick={mailMe} disabled={mailBusy || !data} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.cyan}`, color: C.cyan, opacity: (mailBusy || !data) ? 0.5 : 1 }}>
          {mailBusy ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />} ส่งสรุปเข้าอีเมลผม
        </button>
      </div>

      {err && <p className="font-mono text-2xs mb-3" style={{ color: C.red }}>{err}</p>}

      {totalHigh > 0 && (
        <div className="p-3 rounded-2xl mb-4 flex items-start gap-2" style={{ background: `${C.red}12`, border: `1px solid ${C.red}44` }}>
          <AlertTriangle size={14} style={{ color: C.red }} className="shrink-0 mt-0.5" />
          <p className="font-body text-xs" style={{ color: C.text }}>มีปัญหาระดับสูง {totalHigh} เรื่องที่ควรจัดการก่อน</p>
        </div>
      )}

      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: shown.color }}>
          {shown.k === 'current' ? 'ปัญหาที่กำลังเกิด — ต้องแก้ตอนนี้' : shown.k === 'ahead' ? 'ปัญหาล่วงหน้า — ยังไม่เกิดแต่กำลังจะเกิด' : 'ปัญหาที่ตามหลัง — เกิดไปแล้วรอตามเก็บ'}
        </div>
        {loading && !data ? (
          <p className="font-mono text-2xs" style={{ color: C.muted }}>กำลังตรวจระบบ...</p>
        ) : shown.list.length === 0 ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} style={{ color: C.emerald }} />
            <p className="font-body text-xs" style={{ color: C.muted }}>ไม่พบปัญหาในกลุ่มนี้</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shown.list.map((x, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${sevColor(x.severity)}`, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono px-1.5 py-0.5 rounded shrink-0" style={{ fontSize: 9, color: sevColor(x.severity), border: `1px solid ${sevColor(x.severity)}` }}>{x.severity}</span>
                  <span className="font-mono" style={{ fontSize: 9, color: C.muted }}>{x.area}</span>
                </div>
                <p className="font-body text-xs mb-1" style={{ color: C.text }}>{x.what}</p>
                {x.detail && <p className="font-body text-xs mb-1" style={{ color: C.muted }}>{x.detail}</p>}
                {x.action && <p className="font-body text-xs" style={{ color: C.cyan }}>→ {x.action}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {aiErr && <p className="font-mono text-2xs mb-3" style={{ color: C.orange }}>{aiErr}</p>}
      {ai && (
        <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}44` }}>
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            {typeof ai.healthScore === 'number' && (
              <div className="shrink-0 text-center px-3 py-1.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${ai.healthScore >= 80 ? C.emerald : ai.healthScore >= 50 ? C.orange : C.red}` }}>
                <div className="font-display text-lg font-bold leading-none" style={{ color: ai.healthScore >= 80 ? C.emerald : ai.healthScore >= 50 ? C.orange : C.red }}>{ai.healthScore}</div>
                <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>สุขภาพระบบ</div>
              </div>
            )}
            <p className="font-body text-sm flex-1 min-w-[180px]" style={{ color: C.text }}>{ai.headline}</p>
          </div>
          {Array.isArray(ai.doFirst) && ai.doFirst.length > 0 && (
            <div className="mb-3">
              <div className="font-mono text-2xs mb-1.5" style={{ color: C.red }}>ทำก่อน</div>
              <div className="space-y-1.5">
                {ai.doFirst.map((d, i) => (
                  <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono px-1.5 rounded shrink-0" style={{ fontSize: 9, color: C.orange, border: `1px solid ${C.orange}` }}>{d.urgency}</span>
                      <span className="font-body text-xs" style={{ color: C.text }}>{d.what}</span>
                    </div>
                    {d.why && <p className="font-body text-xs" style={{ color: C.muted }}>{d.why}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(ai.predicted) && ai.predicted.length > 0 && (
            <div className="mb-3">
              <div className="font-mono text-2xs mb-1.5" style={{ color: C.orange }}>คาดว่าจะเกิดถ้าปล่อยไว้</div>
              {ai.predicted.map((p, i) => (
                <div key={i} className="p-2.5 rounded-xl mb-1.5" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.orange}` }}>
                  <div className="font-body text-xs" style={{ color: C.orange }}>{p.risk}</div>
                  {p.basedOn && <div className="font-body text-xs" style={{ color: C.muted }}>ดูจาก: {p.basedOn}</div>}
                  {p.prevent && <div className="font-body text-xs" style={{ color: C.cyan }}>→ {p.prevent}</div>}
                </div>
              ))}
            </div>
          )}
          {Array.isArray(ai.ignorable) && ai.ignorable.length > 0 && (
            <div className="p-2.5 rounded-xl" style={{ background: C.bgDeep }}>
              <div className="font-mono text-2xs mb-1" style={{ color: C.muted }}>ยังไม่ต้องรีบ</div>
              {ai.ignorable.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.muted }}>▸ {x}</p>)}
            </div>
          )}
          {ai.note && ai.note !== '-' && <p className="font-body text-xs mt-2" style={{ color: C.muted }}>{ai.note}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- เชื่อมต่อไฟล์: Excel / CSV / Word / Canva ----------
// โหลดไลบรารีตอนใช้งานจริงจาก CDN — ไม่ต้องเพิ่ม dependency ใน package.json
// ถ้าโหลดไม่สำเร็จ (เน็ตมีปัญหา หรือ CDN ล่ม) จะบอกผู้ใช้ตรงๆ ให้ใช้ CSV แทน
const CDN_SHEETJS = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
const CDN_MAMMOTH = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js';

function loadScriptOnce(src, globalName) {
  return new Promise((resolve, reject) => {
    if (window[globalName]) return resolve(window[globalName]);
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => window[globalName] ? resolve(window[globalName]) : reject(new Error('โหลดไลบรารีไม่สำเร็จ')));
      existing.addEventListener('error', () => reject(new Error('โหลดไลบรารีไม่สำเร็จ')));
      return;
    }
    const el = document.createElement('script');
    el.src = src; el.async = true; el.setAttribute('data-src', src);
    el.onload = () => window[globalName] ? resolve(window[globalName]) : reject(new Error('โหลดไลบรารีไม่สำเร็จ'));
    el.onerror = () => reject(new Error('โหลดไลบรารีไม่สำเร็จ — ตรวจอินเทอร์เน็ตแล้วลองใหม่ หรือบันทึกไฟล์เป็น .csv แทน'));
    document.head.appendChild(el);
  });
}

function downloadBlob(content, filename, mime) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// แปลงตารางเป็น CSV — ทำเองไม่ต้องพึ่งไลบรารี ใช้ได้เสมอ
// ใส่ BOM ไว้ข้างหน้า ไม่งั้น Excel เปิดภาษาไทยเป็นตัวยึกยือ
function toCsv(rows) {
  if (!rows || !rows.length) return '\uFEFF';
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '\uFEFF' + [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n');
}

// อ่าน CSV แบบรองรับเครื่องหมายคำพูดและคอมมาในเซลล์
function parseCsv(text) {
  const clean = String(text).replace(/^\uFEFF/, '');
  const rows = []; let row = []; let cur = ''; let q = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (q) {
      if (ch === '"' && clean[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cur); cur = ''; }
    else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (ch !== '\r') cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map((h) => String(h).trim());
  return rows.slice(1).filter((r) => r.some((c) => String(c).trim())).map((r) => {
    const o = {}; head.forEach((h, i) => { o[h || `คอลัมน์${i + 1}`] = r[i] != null ? r[i] : ''; }); return o;
  });
}

function FileBridgePage({ user, channels, setChannels, tasks, history, showToast }) {
  // ข้อมูลช่องเป็นข้อมูลส่วนกลางขององค์กร ต้องระดับหัวหน้าขึ้นไปถึงบันทึกได้ (ตรงกับกติกาใน store.js)
  const canEditOrgData = (user?.clearance || 1) >= 2 || ['manager', 'exec', 'dev'].includes(user?.role) || user?.isOwner;
  const [rows, setRows] = useState(null);
  const [fileName, setFileName] = useState('');
  const [docText, setDocText] = useState('');
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [ai, setAi] = useState(null);

  // ---------- ส่งออก ----------
  const EXPORTS = [
    {
      k: 'channels', label: 'ช่อง/เพจทั้งหมด',
      build: () => channels.flatMap((c) => (c.platforms || []).map((p) => ({
        ชื่อช่อง: c.name, แพลตฟอร์ม: p.platform,
        คลิปต่อวัน: p.dailyVideos, ภาพต่อวัน: p.dailyImages, ลิงก์ตรวจงาน: p.checkLink || '',
      }))),
    },
    {
      k: 'tasks', label: 'งานวันนี้',
      build: () => (tasks || []).map((t) => ({
        งาน: t.label, ช่อง: (channels.find((c) => c.id === t.channelId) || {}).name || '',
        ประเภท: t.type, สถานะ: t.done ? 'เสร็จ' : 'ยังไม่เสร็จ',
        คะแนนคุณภาพ: t.reviewScore != null ? t.reviewScore : '', ลิงก์: t.link || '',
      })),
    },
    {
      k: 'history', label: 'ประวัติย้อนหลังทั้งหมด',
      build: () => (history || []).map((h) => {
        const ts = Array.isArray(h.tasks) ? h.tasks : [];
        return { วันที่: h.date, งานทั้งหมด: ts.length, ทำเสร็จ: ts.filter((t) => t.done).length,
          อัตราสำเร็จ: ts.length ? Math.round((ts.filter((t) => t.done).length / ts.length) * 100) + '%' : '-' };
      }),
    },
  ];

  function exportCsv(item) {
    const data = item.build();
    if (!data.length) { setErr('ยังไม่มีข้อมูลให้ส่งออก'); return; }
    downloadBlob(toCsv(data), `forge-${item.k}-${todayDateStr()}.csv`, 'text/csv;charset=utf-8');
    showToast && showToast('ดาวน์โหลดแล้ว เปิดด้วย Excel ได้เลย');
  }

  async function exportXlsx(item) {
    const data = item.build();
    if (!data.length) { setErr('ยังไม่มีข้อมูลให้ส่งออก'); return; }
    setBusy('xlsx-' + item.k); setErr('');
    try {
      const XLSX = await loadScriptOnce(CDN_SHEETJS, 'XLSX');
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, item.label.slice(0, 30));
      const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      downloadBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `forge-${item.k}-${todayDateStr()}.xlsx`);
      showToast && showToast('ดาวน์โหลดไฟล์ Excel แล้ว');
    } catch (e) { setErr(e.message); }
    setBusy('');
  }

  // ---------- นำเข้า ----------
  async function handleFile(file) {
    if (!file) return;
    setErr(''); setRows(null); setDocText(''); setAi(null); setFileName(file.name);
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    setBusy('read');
    try {
      if (ext === 'csv' || ext === 'txt') {
        setRows(parseCsv(await file.text()));
      } else if (ext === 'xlsx' || ext === 'xls') {
        const XLSX = await loadScriptOnce(CDN_SHEETJS, 'XLSX');
        const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setRows(XLSX.utils.sheet_to_json(ws, { defval: '' }));
      } else if (ext === 'docx') {
        const mammoth = await loadScriptOnce(CDN_MAMMOTH, 'mammoth');
        const r = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        setDocText(String(r.value || '').trim());
      } else if (ext === 'doc') {
        setErr('ไฟล์ .doc รุ่นเก่าอ่านไม่ได้ — เปิดใน Word แล้ว Save As เป็น .docx ก่อน');
      } else {
        setErr('รองรับ .xlsx .xls .csv .docx เท่านั้น');
      }
    } catch (e) { setErr(e.message || 'อ่านไฟล์ไม่สำเร็จ'); }
    setBusy('');
  }

  // เดาว่าคอลัมน์ไหนคือชื่อช่อง/แพลตฟอร์ม จากหัวตารางที่ผู้ใช้ใส่มา
  function pick(row, names) {
    const keys = Object.keys(row);
    for (const n of names) {
      const k = keys.find((x) => String(x).toLowerCase().replace(/\s/g, '').includes(n));
      if (k && String(row[k]).trim()) return String(row[k]).trim();
    }
    return '';
  }

  function importAsChannels() {
    if (!rows || !rows.length) return;
    const made = [];
    rows.forEach((r, i) => {
      const name = pick(r, ['ชื่อช่อง', 'ช่อง', 'name', 'channel']);
      if (!name) return;
      const platform = pick(r, ['แพลตฟอร์ม', 'platform']) || 'TikTok';
      const dv = Number(pick(r, ['คลิปต่อวัน', 'คลิป', 'video'])) || 1;
      const di = Number(pick(r, ['ภาพต่อวัน', 'ภาพ', 'image'])) || 0;
      made.push({
        id: `${Date.now()}${i}`, name,
        color: CHANNEL_COLORS[(channels.length + made.length) % CHANNEL_COLORS.length],
        platforms: [{ platform, dailyVideos: dv, dailyImages: di, checkLink: '' }],
      });
    });
    if (!made.length) { setErr('ไม่พบคอลัมน์ชื่อช่อง — ตั้งหัวตารางว่า "ชื่อช่อง" แล้วลองใหม่'); return; }
    setChannels((prev) => [...prev, ...made]);
    showToast && showToast(`เพิ่ม ${made.length} ช่องแล้ว — งานประจำวันจะสร้างให้พรุ่งนี้`);
    setRows(null); setFileName('');
  }

  async function analyzeWithAi() {
    const content = docText
      ? `เอกสาร Word "${fileName}":\n${docText.slice(0, 6000)}`
      : `ตารางจากไฟล์ "${fileName}" (${rows.length} แถว):\n${JSON.stringify(rows.slice(0, 60))}`;
    setBusy('ai'); setErr(''); setAi(null);
    try {
      const sys = `คุณคือนักวิเคราะห์ข้อมูลที่อ่านไฟล์ที่ผู้ใช้อัปโหลดมา แล้วสรุปให้ใช้งานได้จริง
ตอบเป็น JSON เท่านั้น ห้ามใส่ \`\`\`json
{
 "whatIsThis":"ไฟล์นี้คือข้อมูลอะไร อธิบายจากสิ่งที่เห็นจริง",
 "keyFindings":["สิ่งที่น่าสนใจที่พบ อ้างตัวเลขหรือข้อความจริงจากไฟล์"],
 "dataQuality":["ปัญหาของข้อมูล เช่น ช่องว่าง ข้อมูลซ้ำ รูปแบบไม่ตรงกัน ถ้าไม่มีให้ใส่ ไม่พบปัญหา"],
 "suggestedUse":"ข้อมูลชุดนี้เอาไปใช้ต่อในระบบยังไงได้บ้าง",
 "nextStep":"สิ่งที่ควรทำต่อ 1 อย่าง"
}
กติกา: วิเคราะห์จากข้อมูลที่ให้มาเท่านั้น ห้ามแต่งตัวเลขหรือสมมติข้อมูลที่ไม่มีในไฟล์`;
      const text = await callClaude(sys, content, undefined, 'deepAnalysis');
      setAi(parseJsonLoose(text));
    } catch (e) { setErr(e.message || 'วิเคราะห์ไม่สำเร็จ'); }
    setBusy('');
  }

  const cols = rows && rows.length ? [...new Set(rows.flatMap((r) => Object.keys(r)))].slice(0, 6) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-fade">
      <div className="flex items-center gap-2 mb-1"><FileSpreadsheet size={18} style={{ color: C.emerald }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.emerald }}>ไฟล์ & เชื่อมต่อ</span></div>
      <h2 className="font-body text-xl mb-1" style={{ color: C.text }}>Excel · Word · Canva</h2>
      <p className="font-body text-xs mb-5" style={{ color: C.muted }}>ดึงข้อมูลออกไปทำต่อใน Excel หรือเอาข้อมูลที่มีอยู่แล้วเข้าระบบ</p>

      {/* ส่งออก */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>ส่งออกข้อมูลจากระบบ</div>
        <div className="space-y-2">
          {EXPORTS.map((item) => {
            const n = item.build().length;
            return (
              <div key={item.k} className="flex items-center gap-2 p-2.5 rounded-xl flex-wrap" style={{ background: C.bgDeep }}>
                <div className="flex-1 min-w-[130px]">
                  <div className="font-body text-xs" style={{ color: C.text }}>{item.label}</div>
                  <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>{n} แถว</div>
                </div>
                <button onClick={() => exportCsv(item)} disabled={!n} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg shrink-0" style={{ border: `1px solid ${C.border}`, color: C.muted, opacity: n ? 1 : 0.4 }}>CSV</button>
                <button onClick={() => exportXlsx(item)} disabled={!n || busy === 'xlsx-' + item.k} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1" style={{ background: C.emerald, color: '#0A0A0F', opacity: n ? 1 : 0.4 }}>
                  {busy === 'xlsx-' + item.k ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />} Excel
                </button>
              </div>
            );
          })}
        </div>
        <p className="font-body mt-2" style={{ fontSize: 10, color: C.muted }}>CSV เปิดด้วย Excel ได้เหมือนกัน และไม่ต้องโหลดอะไรเพิ่ม — ถ้าปุ่ม Excel มีปัญหาให้ใช้ CSV แทนได้เลย</p>
      </div>

      {/* นำเข้า */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.violet }}>นำเข้าไฟล์</div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
          className="p-4 rounded-xl text-center mb-3"
          style={{ background: C.bgDeep, border: `1.5px dashed ${C.border}` }}
        >
          <Upload size={18} style={{ color: C.muted }} className="mx-auto mb-1.5" />
          <p className="font-body text-xs mb-2" style={{ color: C.muted }}>ลากไฟล์มาวาง หรือกดเลือก · รองรับ .xlsx .xls .csv .docx</p>
          <label className="inline-flex font-mono text-2xs px-3 py-1.5 rounded-lg cursor-pointer items-center gap-1.5" style={{ background: C.violet, color: '#fff' }}>
            {busy === 'read' ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />} เลือกไฟล์
            <input type="file" accept=".xlsx,.xls,.csv,.docx,.txt" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} className="hidden" />
          </label>
          {fileName && <p className="font-mono mt-2" style={{ fontSize: 9, color: C.cyan }}>{fileName}</p>}
        </div>

        {rows && rows.length > 0 && (
          <>
            <div className="font-mono text-2xs mb-1.5" style={{ color: C.emerald }}>อ่านได้ {rows.length} แถว · แสดง 5 แถวแรก</div>
            <div className="overflow-x-auto mb-3 rounded-xl" style={{ background: C.bgDeep }}>
              <table className="w-full" style={{ fontSize: 10 }}>
                <thead><tr style={{ color: C.muted }}>{cols.map((c) => <th key={c} className="font-mono text-left py-1.5 px-2" style={{ fontWeight: 400 }}>{c}</th>)}</tr></thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      {cols.map((c) => <td key={c} className="font-body py-1.5 px-2" style={{ color: C.text }}>{String(r[c] ?? '').slice(0, 40)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 flex-wrap">
              {canEditOrgData ? (
                <button onClick={importAsChannels} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.emerald, color: '#0A0A0F' }}>
                  <Plus size={11} /> นำเข้าเป็นช่อง
                </button>
              ) : (
                <span className="font-body text-xs px-3 py-2" style={{ color: C.muted }}>สิทธิ์ของคุณนำเข้าช่องไม่ได้ — ให้หัวหน้าเป็นคนนำเข้า</span>
              )}
              <button onClick={analyzeWithAi} disabled={busy === 'ai'} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.violet, color: '#fff', opacity: busy === 'ai' ? 0.6 : 1 }}>
                {busy === 'ai' ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />} ให้ AI วิเคราะห์
              </button>
            </div>
            <p className="font-body mt-2" style={{ fontSize: 10, color: C.muted }}>นำเข้าเป็นช่อง: ต้องมีคอลัมน์ชื่อ "ชื่อช่อง" · เพิ่มได้อีก "แพลตฟอร์ม" "คลิปต่อวัน" "ภาพต่อวัน"</p>
          </>
        )}

        {docText && (
          <>
            <div className="font-mono text-2xs mb-1.5" style={{ color: C.emerald }}>อ่านข้อความจาก Word ได้ {docText.length.toLocaleString()} ตัวอักษร</div>
            <div className="p-2.5 rounded-xl mb-3 font-body text-xs" style={{ background: C.bgDeep, color: C.muted, maxHeight: 130, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>{docText.slice(0, 800)}{docText.length > 800 ? '…' : ''}</div>
            <button onClick={analyzeWithAi} disabled={busy === 'ai'} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.violet, color: '#fff', opacity: busy === 'ai' ? 0.6 : 1 }}>
              {busy === 'ai' ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />} ให้ AI สรุปเอกสารนี้
            </button>
          </>
        )}
      </div>

      {err && <p className="font-mono text-2xs mb-3" style={{ color: C.orange }}>{err}</p>}

      {ai && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}44` }}>
          <p className="font-body text-sm mb-2" style={{ color: C.text }}>{ai.whatIsThis}</p>
          {Array.isArray(ai.keyFindings) && ai.keyFindings.length > 0 && (
            <div className="mb-2">
              <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>สิ่งที่พบ</div>
              {ai.keyFindings.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
            </div>
          )}
          {Array.isArray(ai.dataQuality) && ai.dataQuality.length > 0 && (
            <div className="p-2.5 rounded-xl mb-2" style={{ background: C.bgDeep }}>
              <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>คุณภาพข้อมูล</div>
              {ai.dataQuality.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.muted }}>▸ {x}</p>)}
            </div>
          )}
          {ai.suggestedUse && <p className="font-body text-xs mb-1" style={{ color: C.text }}><span style={{ color: C.cyan }}>ใช้ต่อได้: </span>{ai.suggestedUse}</p>}
          {ai.nextStep && <p className="font-body text-xs" style={{ color: C.violet }}>→ {ai.nextStep}</p>}
        </div>
      )}

      {/* Canva */}
      <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.orange}44` }}>
        <div className="flex items-center gap-2 mb-2"><Palette size={14} style={{ color: C.orange }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>Canva</span></div>
        <p className="font-body text-xs mb-3" style={{ color: C.muted }}>
          การเชื่อม Canva แบบดึงงานออกแบบเข้ามาในระบบโดยตรง ต้องสมัคร Canva Developer แล้วขออนุมัติแอปก่อน ซึ่งเป็นขั้นตอนที่ต้องทำจากบัญชี Canva ของคุณเอง ผมทำแทนให้ไม่ได้ ตอนนี้จึงยังเชื่อมอัตโนมัติไม่ได้
        </p>
        <p className="font-body text-xs mb-3" style={{ color: C.text }}>
          ระหว่างนี้ใช้วิธีนี้แทนได้: ส่งออกข้อมูลเป็น CSV จากด้านบน แล้วใช้ฟีเจอร์ Bulk Create ของ Canva อัปโหลด CSV เข้าไป มันจะสร้างงานออกแบบตามจำนวนแถวให้อัตโนมัติ เหมาะกับการทำภาพหลายชิ้นที่เปลี่ยนแค่ข้อความ
        </p>
        <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-2xs px-3 py-2 rounded-lg inline-flex items-center gap-1.5" style={{ border: `1px solid ${C.orange}`, color: C.orange }}>
          <ExternalLink size={11} /> เปิด Canva
        </a>
      </div>
    </div>
  );
}

const WEEKDAY_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

// ---------- ปฏิทินวันสำคัญ ไทย / สากล / อีคอมเมิร์ซ ----------
// วันที่ตายตัวทุกปี — คำนวณได้แน่นอน ไม่มีวันคลาดเคลื่อน
const FIXED_DAYS = [
  // ไทย
  { m: 1, d: 1, name: 'วันขึ้นปีใหม่', cat: 'th' },
  { m: 1, d: 16, name: 'วันครู', cat: 'th' },
  { m: 4, d: 6, name: 'วันจักรี', cat: 'th' },
  { m: 4, d: 13, name: 'สงกรานต์ (วันที่ 1)', cat: 'th' },
  { m: 4, d: 14, name: 'สงกรานต์ · วันครอบครัว', cat: 'th' },
  { m: 4, d: 15, name: 'สงกรานต์ (วันสุดท้าย)', cat: 'th' },
  { m: 5, d: 1, name: 'วันแรงงานแห่งชาติ', cat: 'th' },
  { m: 5, d: 4, name: 'วันฉัตรมงคล', cat: 'th' },
  { m: 6, d: 3, name: 'วันเฉลิมฯ สมเด็จพระนางเจ้าฯ พระบรมราชินี', cat: 'th' },
  { m: 7, d: 28, name: 'วันเฉลิมพระชนมพรรษา ร.10', cat: 'th' },
  { m: 8, d: 12, name: 'วันแม่แห่งชาติ', cat: 'th' },
  { m: 10, d: 13, name: 'วันคล้ายวันสวรรคต ร.9', cat: 'th' },
  { m: 10, d: 23, name: 'วันปิยมหาราช', cat: 'th' },
  { m: 12, d: 5, name: 'วันพ่อแห่งชาติ · วันชาติ', cat: 'th' },
  { m: 12, d: 10, name: 'วันรัฐธรรมนูญ', cat: 'th' },
  { m: 12, d: 31, name: 'วันสิ้นปี', cat: 'th' },
  // สากล
  { m: 2, d: 14, name: 'วันวาเลนไทน์', cat: 'intl' },
  { m: 3, d: 8, name: 'วันสตรีสากล', cat: 'intl' },
  { m: 4, d: 1, name: 'April Fools', cat: 'intl' },
  { m: 4, d: 22, name: 'วันคุ้มครองโลก (Earth Day)', cat: 'intl' },
  { m: 6, d: 5, name: 'วันสิ่งแวดล้อมโลก', cat: 'intl' },
  { m: 10, d: 31, name: 'ฮาโลวีน', cat: 'intl' },
  { m: 11, d: 11, name: 'Singles Day (11.11)', cat: 'intl' },
  { m: 12, d: 24, name: 'คริสต์มาสอีฟ', cat: 'intl' },
  { m: 12, d: 25, name: 'วันคริสต์มาส', cat: 'intl' },
];

// วันตามปฏิทินจันทรคติ — คำนวณสูตรตายตัวไม่ได้ ต้องอ้างตารางรายปี
// ⚠ ตรุษจีนคำนวณทางดาราศาสตร์ แม่นยำสูง · วันพระใหญ่ของไทยอิงประกาศทางการ ควรยืนยันอีกครั้งก่อนวางแผนจริง
const LUNAR_DAYS = {
  '2026-02-17': { name: 'ตรุษจีน (ปีมะเมีย)', cat: 'intl', verify: false },
  '2027-02-06': { name: 'ตรุษจีน (ปีมะแม)', cat: 'intl', verify: false },
  '2028-01-26': { name: 'ตรุษจีน (ปีวอก)', cat: 'intl', verify: false },
  '2026-03-03': { name: 'วันมาฆบูชา', cat: 'th', verify: true },
  '2026-05-31': { name: 'วันวิสาขบูชา', cat: 'th', verify: true },
  '2026-07-29': { name: 'วันอาสาฬหบูชา', cat: 'th', verify: true },
  '2026-07-30': { name: 'วันเข้าพรรษา', cat: 'th', verify: true },
  '2026-10-26': { name: 'วันออกพรรษา', cat: 'th', verify: true },
  '2026-11-24': { name: 'วันลอยกระทง', cat: 'th', verify: true },
};

// หาวันที่ n ของ weekday ในเดือนนั้น (n เริ่มที่ 1)
function nthWeekday(year, month0, weekday, n) {
  const first = new Date(year, month0, 1).getDay();
  const day = 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
  return day > new Date(year, month0 + 1, 0).getDate() ? null : day;
}

// วันสำคัญที่ต้องคำนวณจากลำดับวันในสัปดาห์
function computedDays(year) {
  const out = [];
  const pad = (n) => String(n).padStart(2, '0');
  const childrenDay = nthWeekday(year, 0, 6, 2);        // วันเด็ก = เสาร์ที่ 2 ของ ม.ค.
  if (childrenDay) out.push({ date: `${year}-01-${pad(childrenDay)}`, name: 'วันเด็กแห่งชาติ', cat: 'th' });
  const motherIntl = nthWeekday(year, 4, 0, 2);          // Mother's Day สากล = อาทิตย์ที่ 2 ของ พ.ค.
  if (motherIntl) out.push({ date: `${year}-05-${pad(motherIntl)}`, name: "Mother's Day (สากล)", cat: 'intl' });
  const fatherIntl = nthWeekday(year, 5, 0, 3);          // Father's Day สากล = อาทิตย์ที่ 3 ของ มิ.ย.
  if (fatherIntl) out.push({ date: `${year}-06-${pad(fatherIntl)}`, name: "Father's Day (สากล)", cat: 'intl' });
  const thanks = nthWeekday(year, 10, 4, 4);             // Thanksgiving = พฤหัสที่ 4 ของ พ.ย.
  if (thanks) {
    out.push({ date: `${year}-11-${pad(thanks)}`, name: 'Thanksgiving', cat: 'intl' });
    const bf = thanks + 1;
    if (bf <= 30) out.push({ date: `${year}-11-${pad(bf)}`, name: 'Black Friday', cat: 'ecom' });
    const cm = thanks + 4;
    if (cm <= 30) out.push({ date: `${year}-11-${pad(cm)}`, name: 'Cyber Monday', cat: 'ecom' });
  }
  return out;
}

// วันขายของอีคอมเมิร์ซ — เลขเบิ้ล / วันเงินเดือนออก / กลางเดือน
function ecomDays(year, month1) {
  const pad = (n) => String(n).padStart(2, '0');
  const out = [];
  const lastDay = new Date(year, month1, 0).getDate();
  if (month1 <= lastDay) out.push({ date: `${year}-${pad(month1)}-${pad(month1)}`, name: `Double Day ${month1}.${month1}`, cat: 'ecom' });
  if (15 <= lastDay) out.push({ date: `${year}-${pad(month1)}-15`, name: 'Mid-Month Sale', cat: 'ecom' });
  if (25 <= lastDay) out.push({ date: `${year}-${pad(month1)}-25`, name: 'Payday Sale (เงินเดือนออก)', cat: 'ecom' });
  return out;
}

// รวมวันสำคัญทั้งหมดในช่วงวันที่ที่กำหนด
function importantDaysBetween(fromStr, toStr) {
  const pad = (n) => String(n).padStart(2, '0');
  const from = new Date(fromStr + 'T00:00:00');
  const to = new Date(toStr + 'T00:00:00');
  const map = {};
  const push = (date, item) => {
    if (date < fromStr || date > toStr) return;
    if (!map[date]) map[date] = [];
    if (!map[date].some((x) => x.name === item.name)) map[date].push(item);
  };
  const years = new Set([from.getFullYear(), to.getFullYear()]);
  for (const y of years) {
    FIXED_DAYS.forEach((h) => push(`${y}-${pad(h.m)}-${pad(h.d)}`, { name: h.name, cat: h.cat }));
    computedDays(y).forEach((h) => push(h.date, { name: h.name, cat: h.cat }));
    for (let m = 1; m <= 12; m++) ecomDays(y, m).forEach((h) => push(h.date, { name: h.name, cat: h.cat }));
  }
  Object.entries(LUNAR_DAYS).forEach(([date, h]) => push(date, { name: h.name, cat: h.cat, verify: h.verify }));
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => ({ date, items }));
}

const HOLIDAY_IDEA_SYS = `คุณคือครีเอทีฟคอนเทนต์ที่คิดไอเดียคลิปสำหรับวันสำคัญ ให้ตรงกับช่องและสินค้าของผู้ใช้เท่านั้น
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ \`\`\`json
{
 "angle":"มุมที่ควรเล่นสำหรับวันนี้ อธิบายสั้นๆ ว่าทำไมถึงเหมาะกับช่องนี้",
 "ideas":[{"title":"ชื่อคลิปที่ใช้ได้จริง","hook":"3 วินาทีแรกพูดหรือเห็นอะไร ต้องเจาะจงเป็นรูปธรรม","format":"รูปแบบคลิป เช่น พากย์เสียง/ถ่ายจริง/ตัดต่อภาพนิ่ง","why":"ทำไมไอเดียนี้ถึงเวิร์กกับวันนี้และกับช่องนี้"}],
 "prepDays":"ควรเริ่มเตรียมกี่วันก่อนถึงวันจริง และเพราะอะไร",
 "caution":"ข้อควรระวังสำหรับวันนี้ เช่น วันที่มีความอ่อนไหวทางศาสนาหรือการไว้อาลัย ห้ามเล่นมุกหรือขายของแบบไหน ถ้าไม่มีข้อควรระวังให้ใส่ -"
}
กติกา: คิดไอเดีย 3 อัน · ต้องอิงกับช่อง/สินค้าที่ให้มาเท่านั้น ห้ามเสนอไอเดียที่ไม่เกี่ยวกับสินค้าของเขา · ถ้าเป็นวันไว้อาลัยหรือวันทางศาสนาต้องเตือนเรื่องความเหมาะสมเสมอ ห้ามเสนอมุกตลกหรือการลดราคาแบบครึกครื้นในวันแบบนั้น`;

function ImportantDaysPanel({ channels, notes }) {
  const todayStr = todayDateStr();
  const [filter, setFilter] = useState('all');
  const [picked, setPicked] = useState(null);
  const [ideas, setIdeas] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const rangeEnd = shiftDateStr(todayStr, 90);
  const all = importantDaysBetween(todayStr, rangeEnd);
  const rows = all
    .map((r) => ({ ...r, items: r.items.filter((i) => filter === 'all' || i.cat === filter) }))
    .filter((r) => r.items.length > 0)
    .slice(0, 24);

  const CATS = [
    { k: 'all', label: 'ทั้งหมด', color: C.blue },
    { k: 'th', label: 'ไทย', color: C.orange },
    { k: 'intl', label: 'สากล', color: C.cyan },
    { k: 'ecom', label: 'ขายของ', color: C.emerald },
  ];
  const catColor = (c) => c === 'th' ? C.orange : c === 'intl' ? C.cyan : C.emerald;

  async function runIdeas(date, item) {
    setBusy(true); setErr(''); setIdeas(null); setPicked(`${date}|${item.name}`);
    const daysLeft = Math.round((new Date(date + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / 86400000);
    const body = [
      `วันสำคัญ: ${item.name}`,
      `วันที่: ${date} (อีก ${daysLeft} วัน)`,
      `ช่อง/เพจที่ดูแล: ${channels.map((c) => `${c.name}${c.niche ? ` (${c.niche})` : ''}`).join(', ') || 'ยังไม่ได้ตั้งค่าช่อง'}`,
      `ธุระที่จดไว้ช่วงนั้น: ${(notes || {})[date]?.text || 'ไม่มี'}`,
    ].join('\n');
    try {
      const text = await callClaude(HOLIDAY_IDEA_SYS, body, undefined, 'holidayIdeas');
      setIdeas(parseJsonLoose(text));
    } catch (e) { setErr(e.message || 'คิดไอเดียไม่สำเร็จ'); }
    setBusy(false);
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.orange}44` }}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2"><Award size={14} style={{ color: C.orange }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>วันสำคัญ 90 วันข้างหน้า</span></div>
        <div className="flex gap-1">
          {CATS.map((c) => (
            <button key={c.k} onClick={() => setFilter(c.k)} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ color: filter === c.k ? '#0A0A0F' : C.muted, background: filter === c.k ? c.color : 'transparent', border: `1px solid ${filter === c.k ? c.color : C.border}` }}>{c.label}</button>
          ))}
        </div>
      </div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>กดปุ่ม AI ข้างวันที่ เพื่อให้ช่วยคิดไอเดียคลิปที่ตรงกับช่องของคุณสำหรับวันนั้น</p>

      <div className="space-y-1.5 mb-3" style={{ maxHeight: 260, overflowY: 'auto' }}>
        {rows.length === 0 && <p className="font-body text-xs" style={{ color: C.muted }}>ไม่มีวันสำคัญในหมวดนี้ช่วง 90 วันข้างหน้า</p>}
        {rows.map((r) => {
          const daysLeft = Math.round((new Date(r.date + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / 86400000);
          return (
            <div key={r.date} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-2xs shrink-0" style={{ color: C.blue }}>{r.date.slice(5)}</span>
                <span className="font-mono shrink-0" style={{ fontSize: 9, color: daysLeft <= 7 ? C.orange : C.muted }}>
                  {daysLeft === 0 ? 'วันนี้' : `อีก ${daysLeft} วัน`}
                </span>
              </div>
              {r.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: catColor(it.cat) }} />
                  <span className="font-body text-xs flex-1 min-w-0" style={{ color: C.text }}>
                    {it.name}
                    {it.verify && <span title="วันตามปฏิทินจันทรคติ ควรตรวจสอบกับประกาศทางการอีกครั้ง" style={{ color: C.orange }}> ⚠</span>}
                  </span>
                  <button onClick={() => runIdeas(r.date, it)} disabled={busy} className="font-mono shrink-0 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ fontSize: 9, border: `1px solid ${C.violet}`, color: C.violet, opacity: busy ? 0.5 : 1 }}>
                    {busy && picked === `${r.date}|${it.name}` ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />} ไอเดีย
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <p className="font-body mb-3" style={{ fontSize: 10, color: C.muted }}>
        ⚠ วันที่มีเครื่องหมายเตือนคือวันตามปฏิทินจันทรคติ (วันพระใหญ่ ลอยกระทง) ระบบอ้างจากตารางที่ฝังไว้ ควรตรวจสอบกับประกาศทางการอีกครั้งก่อนวางแผนจริง · วันสำคัญแบบตายตัวและวันขายของคำนวณอัตโนมัติ ไม่คลาดเคลื่อน
      </p>

      {err && <p className="font-mono text-2xs mb-2" style={{ color: C.orange }}>{err}</p>}
      {ideas && (
        <div className="space-y-2.5 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs" style={{ color: C.violet }}>ไอเดียสำหรับ {String(picked || '').split('|')[1]}</div>
          {ideas.angle && <p className="font-body text-xs" style={{ color: C.text }}>{ideas.angle}</p>}
          {Array.isArray(ideas.ideas) && ideas.ideas.map((d, i) => (
            <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
              <div className="font-body text-xs mb-1" style={{ color: C.text }}>{i + 1}. {d.title}</div>
              <div className="font-body text-xs" style={{ color: C.cyan }}>ฮุก: <span style={{ color: C.muted }}>{d.hook}</span></div>
              {d.format && <div className="font-body text-xs" style={{ color: C.muted }}>รูปแบบ: {d.format}</div>}
              {d.why && <div className="font-body text-xs" style={{ color: C.muted }}>{d.why}</div>}
            </div>
          ))}
          {ideas.prepDays && (
            <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
              <span className="font-mono text-2xs" style={{ color: C.emerald }}>ควรเริ่มเตรียม: </span>
              <span className="font-body text-xs" style={{ color: C.text }}>{ideas.prepDays}</span>
            </div>
          )}
          {ideas.caution && ideas.caution !== '-' && (
            <div className="p-2.5 rounded-xl" style={{ background: `${C.red}12`, border: `1px solid ${C.red}44` }}>
              <span className="font-mono text-2xs" style={{ color: C.red }}>ข้อควรระวัง: </span>
              <span className="font-body text-xs" style={{ color: C.text }}>{ideas.caution}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ---------- นาฬิกาเวลาโลก + วิเคราะห์เวลาโพสต์ข้ามประเทศ ----------
const WORLD_CLOCK_COUNTRIES = [
  { code: 'TH', label: 'ไทย', flag: '🇹🇭', tz: 'Asia/Bangkok' },
  { code: 'US_ET', label: 'สหรัฐฯ (ตะวันออก)', flag: '🇺🇸', tz: 'America/New_York' },
  { code: 'US_PT', label: 'สหรัฐฯ (ตะวันตก)', flag: '🇺🇸', tz: 'America/Los_Angeles' },
  { code: 'GB', label: 'อังกฤษ', flag: '🇬🇧', tz: 'Europe/London' },
  { code: 'JP', label: 'ญี่ปุ่น', flag: '🇯🇵', tz: 'Asia/Tokyo' },
  { code: 'KR', label: 'เกาหลีใต้', flag: '🇰🇷', tz: 'Asia/Seoul' },
  { code: 'CN', label: 'จีน', flag: '🇨🇳', tz: 'Asia/Shanghai' },
  { code: 'VN', label: 'เวียดนาม', flag: '🇻🇳', tz: 'Asia/Ho_Chi_Minh' },
  { code: 'ID', label: 'อินโดนีเซีย', flag: '🇮🇩', tz: 'Asia/Jakarta' },
  { code: 'PH', label: 'ฟิลิปปินส์', flag: '🇵🇭', tz: 'Asia/Manila' },
  { code: 'IN', label: 'อินเดีย', flag: '🇮🇳', tz: 'Asia/Kolkata' },
  { code: 'AU', label: 'ออสเตรเลีย', flag: '🇦🇺', tz: 'Australia/Sydney' },
  { code: 'DE', label: 'เยอรมนี', flag: '🇩🇪', tz: 'Europe/Berlin' },
  { code: 'FR', label: 'ฝรั่งเศส', flag: '🇫🇷', tz: 'Europe/Paris' },
  { code: 'AE', label: 'สหรัฐอาหรับเอมิเรตส์', flag: '🇦🇪', tz: 'Asia/Dubai' },
  { code: 'SG', label: 'สิงคโปร์', flag: '🇸🇬', tz: 'Asia/Singapore' },
];

const POST_TIME_SYS = `คุณคือที่ปรึกษาด้านจังหวะเวลาโพสต์คอนเทนต์โซเชียลมีเดียข้ามประเทศ
คุณจะได้รับตัวเลขเวลาที่คำนวณไว้ให้แล้วอย่างแม่นยำ (ส่วนต่างเวลา, เวลาที่ตรงกับประเทศเป้าหมาย) ให้ใช้ตัวเลขนั้นตรงๆ ห้ามคำนวณเวลาใหม่เองเด็ดขาดเพราะอาจผิดพลาด
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ \`\`\`json
{
 "headline":"สรุปสถานการณ์ 1 ประโยค ตรงไปตรงมา",
 "timeDiff":{"thTime":"เวลาไทยที่จะโพสต์ (คัดลอกจากข้อมูลที่ให้มา)","targetLabel":"ชื่อประเทศเป้าหมาย","targetTime":"เวลาที่ตรงกันในประเทศเป้าหมาย (คัดลอกจากข้อมูลที่ให้มา)"},
 "verdict":"ดี|พอใช้|ควรปรับ",
 "verdictReason":"อธิบายว่าเวลานั้นตกช่วงไหนของวันในประเทศเป้าหมาย (เช้า/บ่าย/เย็น/ดึก) และเหมาะกับพฤติกรรมเปิดโซเชียลทั่วไปของคนช่วงนั้นแค่ไหน",
 "recommendation":"ถ้าควรปรับ ให้บอกว่าควรโพสต์เวลาไทยกี่โมงถึงจะตรงช่วงที่คนในประเทศเป้าหมายมักเล่นโซเชียล (เย็น-ค่ำตามเวลาท้องถิ่น) ถ้าเวลาปัจจุบันดีอยู่แล้วให้บอกว่าคงเดิมได้พร้อมเหตุผล",
 "caveat":"เตือนตรงๆ ว่านี่คือแนวทางทั่วไปจากพฤติกรรมการใช้โซเชียลโดยเฉลี่ยเท่านั้น ไม่ใช่ข้อมูลอัลกอริทึมจริงของแพลตฟอร์ม (ซึ่งไม่มีใครรู้แน่ชัดจากภายนอก) แนะนำให้เทียบกับสถิติจริงที่หน้าวิเคราะห์เพื่อความแม่นยำ"
}
กติกา: ห้ามอ้างว่ารู้อัลกอริทึมจริงของ TikTok/Facebook/YouTube ว่าดันฟีดตามประเทศต้นทางหรือประเทศผู้ชม ให้พูดในเชิงพฤติกรรมผู้ใช้ทั่วไปเท่านั้นอย่างตรงไปตรงมา`;

function WorldClockPostAdvisor({ channels }) {
  const [now, setNow] = useState(new Date());
  const [selected, setSelected] = useState(['TH']);
  const [showPicker, setShowPicker] = useState(false);
  const [targetCode, setTargetCode] = useState('US_ET');
  const [postHour, setPostHour] = useState(new Date().getHours());
  const [postMinute, setPostMinute] = useState(new Date().getMinutes());
  const [advice, setAdvice] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState('');

  // นาฬิกาจริง อัปเดตทุกวินาที
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function timeInTz(tz) {
    return new Intl.DateTimeFormat('th-TH', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  }
  function dateInTz(tz) {
    return new Intl.DateTimeFormat('th-TH', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' }).format(now);
  }
  // ส่วนต่างชั่วโมงจริง คำนวณจาก Intl ไม่ใช้ตารางที่จำไว้เอง (กันพลาดเรื่อง DST)
  function hourDiff(tz) {
    const thH = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Bangkok', hour: 'numeric', hour12: false }).format(now)) % 24;
    const tgH = Number(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(now)) % 24;
    let diff = tgH - thH;
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    return diff;
  }

  function addCountry(code) { if (!selected.includes(code)) setSelected((s) => [...s, code]); setShowPicker(false); }
  function removeCountry(code) { if (code !== 'TH') setSelected((s) => s.filter((c) => c !== code)); }

  async function runAdvice() {
    setAiLoading(true); setAiErr(''); setAdvice(null);
    const target = WORLD_CLOCK_COUNTRIES.find((c) => c.code === targetCode);
    const diff = hourDiff(target.tz);
    const thTimeStr = `${String(postHour).padStart(2, '0')}:${String(postMinute).padStart(2, '0')}`;
    let targetHour = postHour + diff;
    let dayShift = 0;
    if (targetHour >= 24) { targetHour -= 24; dayShift = 1; }
    if (targetHour < 0) { targetHour += 24; dayShift = -1; }
    const targetTimeStr = `${String(targetHour).padStart(2, '0')}:${String(postMinute).padStart(2, '0')}${dayShift === 1 ? ' (วันถัดไป)' : dayShift === -1 ? ' (วันก่อนหน้า)' : ''}`;
    const payload = {
      เวลาไทยที่จะโพสต์: thTimeStr,
      ประเทศเป้าหมาย: target.label,
      ส่วนต่างเวลาจากไทย_ชั่วโมง: diff,
      เวลาที่ตรงกันในประเทศเป้าหมาย: targetTimeStr,
      ช่องที่เกี่ยวข้อง: channels.map((c) => c.name).join(', ') || '-',
    };
    try {
      const text = await callClaude(POST_TIME_SYS, `ข้อมูลที่คำนวณมาแล้วอย่างแม่นยำ (ใช้ตัวเลขนี้เป๊ะๆ ห้ามคำนวณเอง):\n${JSON.stringify(payload)}`, undefined, 'postTimeAdvice');
      setAdvice(parseJsonLoose(text));
    } catch (e) { setAiErr(e.message || 'วิเคราะห์ไม่สำเร็จ'); }
    setAiLoading(false);
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.cyan}44` }}>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2"><Clock size={14} style={{ color: C.cyan }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.cyan }}>นาฬิกาเวลาโลก · วิเคราะห์เวลาโพสต์</span></div>
        <div className="relative">
          <button onClick={() => setShowPicker((s) => !s)} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
            <Plus size={11} /> เพิ่มประเทศ
          </button>
          {showPicker && (
            <div className="absolute right-0 mt-1 p-1.5 rounded-xl z-10 max-h-64 overflow-y-auto" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, minWidth: 190 }}>
              {WORLD_CLOCK_COUNTRIES.filter((c) => !selected.includes(c.code)).map((c) => (
                <button key={c.code} onClick={() => addCountry(c.code)} className="w-full text-left px-2.5 py-1.5 rounded-lg font-body text-xs flex items-center gap-1.5" style={{ color: C.text }}>
                  <span>{c.flag}</span>{c.label}
                </button>
              ))}
              {WORLD_CLOCK_COUNTRIES.every((c) => selected.includes(c.code)) && <p className="font-mono text-2xs px-2.5 py-1.5" style={{ color: C.muted }}>เพิ่มครบทุกประเทศแล้ว</p>}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-4">
        {selected.map((code) => {
          const c = WORLD_CLOCK_COUNTRIES.find((x) => x.code === code);
          if (!c) return null;
          return (
            <div key={code} className="px-3 py-2.5 rounded-xl relative" style={{ background: C.bgDeep, border: `1px solid ${code === 'TH' ? C.cyan : C.border}`, minWidth: 118 }}>
              {code !== 'TH' && (
                <button onClick={() => removeCountry(code)} className="absolute top-1 right-1" style={{ color: C.muted }}><X size={11} /></button>
              )}
              <div className="font-body text-xs flex items-center gap-1 mb-0.5" style={{ color: C.muted }}><span>{c.flag}</span>{c.label}</div>
              <div className="font-display text-lg font-bold tabular-nums" style={{ color: code === 'TH' ? C.cyan : C.text }}>{timeInTz(c.tz)}</div>
              <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>{dateInTz(c.tz)}</div>
            </div>
          );
        })}
      </div>

      {/* วิเคราะห์เวลาโพสต์ */}
      <div className="pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs tracking-widest mb-2" style={{ color: C.blue }}>วิเคราะห์เวลาโพสต์ให้ตรงกลุ่มเป้าหมาย</div>
        <div className="flex flex-wrap items-end gap-2.5 mb-3">
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: 9, color: C.muted }}>โพสต์เวลา (ไทย)</label>
            <div className="flex items-center gap-1">
              <input type="number" min={0} max={23} value={postHour} onChange={(e) => setPostHour(Math.max(0, Math.min(23, Number(e.target.value) || 0)))} className="w-14 font-mono text-xs px-2 py-1.5 rounded-lg outline-none" style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.text }} />
              <span style={{ color: C.muted }}>:</span>
              <input type="number" min={0} max={59} value={postMinute} onChange={(e) => setPostMinute(Math.max(0, Math.min(59, Number(e.target.value) || 0)))} className="w-14 font-mono text-xs px-2 py-1.5 rounded-lg outline-none" style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.text }} />
            </div>
          </div>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: 9, color: C.muted }}>กลุ่มเป้าหมาย</label>
            <select value={targetCode} onChange={(e) => setTargetCode(e.target.value)} className="font-mono text-xs px-2 py-1.5 rounded-lg outline-none" style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.text }}>
              {WORLD_CLOCK_COUNTRIES.filter((c) => c.code !== 'TH').map((c) => <option key={c.code} value={c.code}>{c.flag} {c.label}</option>)}
            </select>
          </div>
          <button onClick={runAdvice} disabled={aiLoading} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1" style={{ background: C.cyan, color: '#0A0A0F', opacity: aiLoading ? 0.6 : 1 }}>
            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} วิเคราะห์
          </button>
        </div>
        {aiErr && <p className="font-mono text-2xs mb-2" style={{ color: C.orange }}>{aiErr}</p>}
        {advice && (
          <div className="space-y-2.5">
            <p className="font-body text-sm" style={{ color: C.text }}>{advice.headline}</p>
            {advice.timeDiff && (
              <div className="p-2.5 rounded-xl flex items-center gap-3" style={{ background: C.bgDeep }}>
                <div className="text-center">
                  <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>ไทย</div>
                  <div className="font-display text-sm font-bold" style={{ color: C.cyan }}>{advice.timeDiff.thTime}</div>
                </div>
                <ArrowRight size={14} style={{ color: C.muted }} />
                <div className="text-center">
                  <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>{advice.timeDiff.targetLabel}</div>
                  <div className="font-display text-sm font-bold" style={{ color: C.violet }}>{advice.timeDiff.targetTime}</div>
                </div>
              </div>
            )}
            {advice.verdict && (
              <div className="p-2.5 rounded-xl" style={{ background: `${advice.verdict === 'ดี' ? C.emerald : advice.verdict === 'พอใช้' ? C.orange : C.red}12`, border: `1px solid ${(advice.verdict === 'ดี' ? C.emerald : advice.verdict === 'พอใช้' ? C.orange : C.red)}44` }}>
                <span className="font-mono text-2xs" style={{ color: advice.verdict === 'ดี' ? C.emerald : advice.verdict === 'พอใช้' ? C.orange : C.red }}>{advice.verdict}</span>
                <p className="font-body text-xs mt-1" style={{ color: C.text }}>{advice.verdictReason}</p>
              </div>
            )}
            {advice.recommendation && (
              <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}>
                <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>คำแนะนำ</div>
                <p className="font-body text-xs" style={{ color: C.text }}>{advice.recommendation}</p>
              </div>
            )}
            {advice.caveat && <p className="font-body text-xs" style={{ color: C.muted }}>⚠ {advice.caveat}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- ติดตามความคืบหน้า: แคปสถิติคลิปมาให้ AI อ่านและประเมิน ----------
function ProgressTracker({ dayMap, channels, logs, setLogs, user }) {
  const todayStr = todayDateStr();
  const [reviewDate, setReviewDate] = useState(shiftDateStr(todayStr, -1)); // ค่าเริ่มต้น = เมื่อวาน
  const [imgs, setImgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [openId, setOpenId] = useState(null);

  const allLogs = Array.isArray(logs) ? logs : [];
  const dateLogs = allLogs.filter((l) => l.date === reviewDate).sort((a, b) => b.at - a.at);
  const active = allLogs.find((l) => l.id === openId) || dateLogs[0] || null;
  const recent = allLogs.slice().sort((a, b) => b.at - a.at).slice(0, 8);

  async function addFiles(files) {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith('image/')).slice(0, 6);
    if (arr.length === 0) return;
    const out = await Promise.all(arr.map(async (f) => {
      const base64 = await fileToBase64(f);
      const mimeType = f.type || 'image/jpeg';
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, mimeType, base64, dataUrl: `data:${mimeType};base64,${base64}` };
    }));
    setImgs((p) => [...p, ...out].slice(0, 6));
  }

  async function runReview() {
    if (imgs.length === 0) { setErr('แนบภาพหน้าจอสถิติของคลิปก่อน แล้วค่อยกดประเมิน'); return; }
    setBusy(true); setErr('');
    const v = dayMap[reviewDate];
    const planned = v ? v.tasks.map((t) => ({
      งาน: t.label,
      ช่อง: (channels.find((c) => c.id === t.channelId) || {}).name || '-',
      ทำเสร็จ: !!t.done,
    })) : [];
    // ผลครั้งก่อนของช่วงเดียวกัน ให้ AI เทียบว่าดีขึ้นหรือแย่ลง
    const prev = allLogs.filter((l) => l.date < reviewDate).sort((a, b) => b.at - a.at)[0];
    const prevSummary = prev ? { วันที่: prev.date, ผลตรวจ: prev.data?.verdict, ตัวเลขที่อ่านได้: prev.data?.readNumbers } : null;
    const body = [
      `วันที่ประเมิน: ${reviewDate} (${WEEKDAY_FULL[new Date(reviewDate + 'T00:00:00').getDay()]})`,
      `งานที่วางไว้วันนั้น: ${planned.length ? JSON.stringify(planned) : 'ไม่มีบันทึกงานของวันนั้น'}`,
      `ผลการประเมินครั้งก่อน: ${prevSummary ? JSON.stringify(prevSummary) : 'ยังไม่มี'}`,
      'อ่านตัวเลขจากภาพหน้าจอที่แนบมาแล้วประเมินตามรูปแบบที่กำหนด',
    ].join('\n');
    try {
      const text = await callClaude(PROGRESS_SYS, body, imgs.map((i) => ({ mimeType: i.mimeType, data: i.base64 })), 'progressReview');
      const data = parseJsonLoose(text);
      // ไม่เก็บรูปลงฐานข้อมูล — เก็บแค่ผลที่อ่านได้ เพื่อไม่ให้ข้อมูลบวมจนบันทึกไม่ผ่าน
      const rec = { id: `${Date.now()}`, at: Date.now(), date: reviewDate, imageCount: imgs.length, by: user?.email || '', data };
      setLogs((prevLogs) => [...(Array.isArray(prevLogs) ? prevLogs : []), rec].slice(-120));
      setOpenId(rec.id);
      setImgs([]);
    } catch (e) { setErr(e.message || 'ประเมินไม่สำเร็จ'); }
    setBusy(false);
  }

  const vColor = (v) => v === 'ดีมาก' ? C.emerald : v === 'ดี' ? C.cyan : v === 'พอใช้' ? C.orange : C.red;

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.emerald}44` }}>
      <div className="flex items-center gap-2 mb-1"><Activity size={14} style={{ color: C.emerald }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.emerald }}>ติดตามความคืบหน้า · ให้ AI อ่านสถิติคลิป</span></div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>แคปหน้าจอสถิติของคลิป (ยอดวิว ไลก์ คอมเมนต์ อัตราดูจบ) แล้วให้ AI อ่านตัวเลขจริงมาประเมินว่าวันนั้นเป็นยังไง ควรแก้อะไรต่อ</p>

      <div className="flex flex-wrap items-end gap-2.5 mb-3">
        <div>
          <label className="font-mono block mb-1" style={{ fontSize: 9, color: C.muted }}>ประเมินผลของวันที่</label>
          <input type="date" value={reviewDate} max={todayStr} onChange={(e) => { setReviewDate(e.target.value); setOpenId(null); }} className="font-mono text-xs px-2 py-1.5 rounded-lg outline-none" style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.text }} />
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => { setReviewDate(shiftDateStr(todayStr, -1)); setOpenId(null); }} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>เมื่อวาน</button>
          <button onClick={() => { setReviewDate(todayStr); setOpenId(null); }} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted }}>วันนี้</button>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        className="p-3.5 rounded-xl mb-2.5 text-center"
        style={{ background: C.bgDeep, border: `1.5px dashed ${C.border}` }}
      >
        <Upload size={18} style={{ color: C.muted }} className="mx-auto mb-1.5" />
        <p className="font-body text-xs mb-2" style={{ color: C.muted }}>ลากภาพหน้าจอสถิติมาวาง หรือกดเลือก (สูงสุด 6 รูป)</p>
        <label className="inline-flex font-mono text-2xs px-3 py-1.5 rounded-lg cursor-pointer items-center gap-1.5" style={{ background: C.emerald, color: '#0A0A0F' }}>
          <Upload size={11} /> เลือกรูป
          <input type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} className="hidden" />
        </label>
        {imgs.length > 0 && (
          <div className="grid grid-cols-6 gap-1.5 mt-2.5">
            {imgs.map((im) => (
              <div key={im.id} className="relative rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <img src={im.dataUrl} alt="" className="w-full object-cover" style={{ height: 46 }} />
                <button onClick={() => setImgs((p) => p.filter((x) => x.id !== im.id))} className="absolute top-0.5 right-0.5 rounded-full p-0.5" style={{ background: 'rgba(0,0,0,.7)', color: '#fff' }}><X size={9} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <button onClick={runReview} disabled={busy} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1" style={{ background: C.emerald, color: '#0A0A0F', opacity: busy ? 0.6 : 1 }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} ให้ AI ประเมินผล
        </button>
        {dateLogs.length > 0 && <span className="font-mono text-2xs" style={{ color: C.muted }}>วันนี้ประเมินไปแล้ว {dateLogs.length} ครั้ง</span>}
      </div>
      {err && <p className="font-mono text-2xs mb-2" style={{ color: C.orange }}>{err}</p>}

      {active && active.data && (
        <div className="space-y-2.5 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-2xs px-2.5 py-1 rounded-lg shrink-0" style={{ color: vColor(active.data.verdict), border: `1px solid ${vColor(active.data.verdict)}` }}>{active.data.verdict}</span>
            <span className="font-mono text-2xs" style={{ color: C.muted }}>ผลของ {active.date} · อ่านจาก {active.imageCount} รูป</span>
          </div>
          {active.data.verdictReason && <p className="font-body text-xs" style={{ color: C.text }}>{active.data.verdictReason}</p>}

          {Array.isArray(active.data.readNumbers) && active.data.readNumbers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 11 }}>
                <thead>
                  <tr style={{ color: C.muted }}>
                    <th className="font-mono text-left py-1 pr-2" style={{ fontWeight: 400 }}>คลิป</th>
                    <th className="font-mono text-right py-1 px-1.5" style={{ fontWeight: 400 }}>วิว</th>
                    <th className="font-mono text-right py-1 px-1.5" style={{ fontWeight: 400 }}>ไลก์</th>
                    <th className="font-mono text-right py-1 px-1.5" style={{ fontWeight: 400 }}>คอมเมนต์</th>
                    <th className="font-mono text-right py-1 pl-1.5" style={{ fontWeight: 400 }}>ดูจบ</th>
                  </tr>
                </thead>
                <tbody>
                  {active.data.readNumbers.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td className="font-body py-1.5 pr-2" style={{ color: C.text }}>{r.clip}{r.platform && r.platform !== 'ไม่ระบุ' ? <span style={{ color: C.muted }}> · {r.platform}</span> : null}</td>
                      <td className="font-mono text-right py-1.5 px-1.5 tabular-nums" style={{ color: C.cyan }}>{r.views}</td>
                      <td className="font-mono text-right py-1.5 px-1.5 tabular-nums" style={{ color: C.muted }}>{r.likes}</td>
                      <td className="font-mono text-right py-1.5 px-1.5 tabular-nums" style={{ color: C.muted }}>{r.comments}</td>
                      <td className="font-mono text-right py-1.5 pl-1.5 tabular-nums" style={{ color: C.muted }}>{r.watchTime || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {active.data.compareLast && (
            <div className="p-2.5 rounded-xl" style={{ background: C.bgDeep }}>
              <span className="font-mono text-2xs" style={{ color: C.violet }}>เทียบครั้งก่อน: </span>
              <span className="font-body text-xs" style={{ color: C.text }}>{active.data.compareLast}</span>
            </div>
          )}
          {Array.isArray(active.data.whatWorked) && active.data.whatWorked.length > 0 && (
            <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
              <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>สิ่งที่ได้ผล</div>
              {active.data.whatWorked.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
            </div>
          )}
          {Array.isArray(active.data.whatToFix) && active.data.whatToFix.length > 0 && (
            <div className="space-y-1.5">
              {active.data.whatToFix.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.orange}`, border: `1px solid ${C.border}` }}>
                  <div className="font-body text-xs" style={{ color: C.orange }}>{f.issue}</div>
                  <div className="font-body text-xs" style={{ color: C.muted }}>→ {f.fix}</div>
                </div>
              ))}
            </div>
          )}
          {active.data.nextAction && (
            <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}>
              <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>ทำต่อพรุ่งนี้</div>
              <p className="font-body text-xs" style={{ color: C.text }}>{active.data.nextAction}</p>
            </div>
          )}
        </div>
      )}

      {recent.length > 0 && (
        <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs mb-2" style={{ color: C.blue }}>ประวัติการประเมินล่าสุด</div>
          <div className="flex flex-wrap gap-1.5">
            {recent.map((l) => (
              <button key={l.id} onClick={() => { setOpenId(l.id); setReviewDate(l.date); }} className="font-mono text-2xs px-2 py-1 rounded-lg" style={{ border: `1px solid ${active && active.id === l.id ? vColor(l.data?.verdict) : C.border}`, color: vColor(l.data?.verdict) }}>
                {l.date.slice(5)} · {l.data?.verdict || '-'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarPage({ user, history, tasks, channels, onOpenDay, futureTasks, notes, setNotes, progressLogs, setProgressLogs }) {
  const todayStr = todayDateStr();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [insight, setInsight] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [err, setErr] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [planAhead, setPlanAhead] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planErr, setPlanErr] = useState('');

  const noteMap = notes || {};
  // โหลดโน้ตของวันที่เลือกมาใส่ช่องแก้ไข เมื่อเปลี่ยนวัน
  useEffect(() => { setNoteDraft((noteMap[selectedDate] || {}).text || ''); }, [selectedDate, notes]);

  function saveNote(dateStr, text, busy) {
    setNotes((prev) => {
      const next = { ...(prev || {}) };
      const trimmed = String(text || '').trim();
      const wasBusy = busy != null ? busy : (next[dateStr] || {}).busy || false;
      if (!trimmed && !wasBusy) delete next[dateStr];
      else next[dateStr] = { text: trimmed, busy: wasBusy, at: Date.now() };
      return next;
    });
  }
  function toggleBusy(dateStr) {
    setNotes((prev) => {
      const next = { ...(prev || {}) };
      const cur = next[dateStr] || { text: '', busy: false };
      const nextBusy = !cur.busy;
      if (!cur.text && !nextBusy) delete next[dateStr];
      else next[dateStr] = { ...cur, busy: nextBusy, at: Date.now() };
      return next;
    });
  }

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

  // ---- แนวโน้มรายวันทั้งเดือน (ทำเสร็จ % + คะแนนคุณภาพเฉลี่ย x10 ให้สเกลใกล้กัน) ----
  const dailyTrend = monthDays.slice().sort(([a], [b]) => a.localeCompare(b)).map(([d, v]) => {
    const scored = v.tasks.filter((t) => typeof t.reviewScore === 'number');
    return {
      date: d.slice(8),
      pct: v.total ? Math.round((v.done / v.total) * 100) : 0,
      score: scored.length ? Math.round((scored.reduce((a, t) => a + t.reviewScore, 0) / scored.length) * 10) : null,
    };
  });

  // ---- เทียบผลงานรายช่องในเดือนนี้ ----
  const byChannelMonth = channels.map((c) => {
    const ts = monthDays.flatMap(([, v]) => v.tasks.filter((t) => t.channelId === c.id));
    return { name: c.name, color: c.color, total: ts.length, done: ts.filter((t) => t.done).length };
  }).filter((c) => c.total > 0);

  // ---- สัดส่วนงาน: เสร็จแล้ว / กำลังทำ (มีเนื้อหาแล้วแต่ยังไม่ติ๊ก) / ยังไม่เริ่ม ----
  const allMonthTasks = monthDays.flatMap(([, v]) => v.tasks);
  const doneCount = allMonthTasks.filter((t) => t.done).length;
  const inProgressCount = allMonthTasks.filter((t) => !t.done && (t.outline || t.videoPrompt || t.imagePrompt)).length;
  const notStartedCount = Math.max(0, allMonthTasks.length - doneCount - inProgressCount);
  const statusPie = [
    { name: 'เสร็จแล้ว', value: doneCount, color: C.emerald },
    { name: 'กำลังทำ', value: inProgressCount, color: C.orange },
    { name: 'ยังไม่เริ่ม', value: notStartedCount, color: C.red },
  ].filter((s) => s.value > 0);

  // ---- เทียบเดือนนี้กับเดือนก่อน ----
  const prevYm = ym.m === 0 ? { y: ym.y - 1, m: 11 } : { y: ym.y, m: ym.m - 1 };
  const prevPrefix = `${prevYm.y}-${String(prevYm.m + 1).padStart(2, '0')}`;
  const prevMonthDays = Object.entries(dayMap).filter(([d]) => d.startsWith(prevPrefix));
  const prevTotal = prevMonthDays.reduce((s, [, v]) => s + v.total, 0);
  const prevDone = prevMonthDays.reduce((s, [, v]) => s + v.done, 0);
  const prevPct = prevTotal ? Math.round((prevDone / prevTotal) * 100) : null;
  const monthDelta = prevPct == null ? null : mPct - prevPct;

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

  async function runPlanAhead() {
    setPlanLoading(true); setPlanErr(''); setPlanAhead(null);
    // มองไปข้างหน้า 14 วันจากวันนี้
    const upcoming = [];
    for (let i = 0; i < 14; i++) {
      const d = shiftDateStr(todayStr, i);
      const v = dayMap[d];
      const n = noteMap[d];
      upcoming.push({
        วันที่: d,
        วัน: WEEKDAY_FULL[new Date(d + 'T00:00:00').getDay()],
        งานทั้งหมด: v ? v.total : 0,
        ทำเสร็จแล้ว: v ? v.done : 0,
        ธุระที่จดไว้: n && n.text ? n.text : null,
        ทำเครื่องหมายว่าไม่ว่าง: !!(n && n.busy),
      });
    }
    const hasAnyNote = upcoming.some((u) => u.ธุระที่จดไว้ || u.ทำเครื่องหมายว่าไม่ว่าง);
    if (!hasAnyNote) {
      setPlanErr('ยังไม่มีโน้ตธุระในช่วง 14 วันข้างหน้า — จดธุระในปฏิทินก่อน แล้ว AI จะช่วยคำนวณว่าควรดันงานวันไหนมาทำก่อน');
      setPlanLoading(false); return;
    }
    try {
      const text = await callClaude(PLAN_AHEAD_SYS, `วันนี้คือ ${todayStr}\nตารางงานและธุระ 14 วันข้างหน้า:\n${JSON.stringify(upcoming)}`, undefined, 'planAhead');
      setPlanAhead(parseJsonLoose(text));
    } catch (e) { setPlanErr(e.message || 'วางแผนล่วงหน้าไม่สำเร็จ'); }
    setPlanLoading(false);
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

      {/* นาฬิกาเวลาโลก + วิเคราะห์เวลาโพสต์ */}
      <WorldClockPostAdvisor channels={channels} />

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
                    {noteMap[ds] && (
                      <span className="absolute" title={noteMap[ds].busy ? 'ไม่ว่าง' : 'มีโน้ต'} style={{ bottom: 2, left: 3, width: 5, height: 5, borderRadius: 999, background: noteMap[ds].busy ? C.red : C.orange }} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              {[
                { c: C.emerald, l: 'ทำครบ' }, { c: C.orange, l: 'ทำบางส่วน' },
                { c: C.red, l: 'ยังไม่ได้ทำ' }, { c: C.violet, l: 'เตรียมล่วงหน้า' }, { c: C.cyan, l: 'วันนี้' },
                { c: C.orange, l: 'มีโน้ต' },
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

          {/* โน้ต/ธุระของวันที่เลือก */}
          <div className="p-4 rounded-2xl mt-4" style={{ background: C.panel, border: `1px solid ${(noteMap[selectedDate] || {}).busy ? C.red : C.border}` }}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5"><FileText size={13} style={{ color: C.orange }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>โน้ต / ธุระวันนี้</span></div>
              <button onClick={() => toggleBusy(selectedDate)} className="font-mono text-2xs px-2 py-1 rounded-lg shrink-0" style={{ color: (noteMap[selectedDate] || {}).busy ? '#fff' : C.muted, background: (noteMap[selectedDate] || {}).busy ? C.red : 'transparent', border: `1px solid ${(noteMap[selectedDate] || {}).busy ? C.red : C.border}` }}>
                {(noteMap[selectedDate] || {}).busy ? 'ไม่ว่างวันนี้' : 'ทำเครื่องหมายไม่ว่าง'}
              </button>
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onBlur={() => saveNote(selectedDate, noteDraft)}
              placeholder="เช่น ติดประชุมทั้งบ่าย / ไปต่างจังหวัด / วันหยุดยาว — จดไว้แล้ว AI จะช่วยคำนวณให้ทำงานล่วงหน้า"
              rows={3}
              className="w-full font-body text-xs p-2.5 rounded-xl outline-none resize-none"
              style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.text }}
            />
            <p className="font-mono mt-1" style={{ fontSize: 9, color: C.muted }}>บันทึกอัตโนมัติเมื่อคลิกออกจากช่อง</p>
          </div>

          {/* AI วางแผนล่วงหน้า กันงานชนธุระ */}
          <div className="p-4 rounded-2xl mt-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.orange}44` }}>
            <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
              <div className="flex items-center gap-2"><AlertTriangle size={14} style={{ color: C.orange }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>AI เตือนล่วงหน้า 14 วัน</span></div>
              <button onClick={runPlanAhead} disabled={planLoading} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.orange, color: '#0A0A0F', opacity: planLoading ? 0.6 : 1 }}>
                {planLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} คำนวณ
              </button>
            </div>
            {planErr && <p className="font-body text-xs mb-2" style={{ color: C.muted }}>{planErr}</p>}
            {!planAhead && !planLoading && !planErr && (
              <p className="font-body text-xs" style={{ color: C.muted }}>จดธุระในปฏิทินไว้ก่อน แล้วกดคำนวณ — AI จะดูว่าวันไหนงานจะชนธุระ แล้วบอกว่าควรดันงานวันไหนมาทำก่อน</p>
            )}
            {planAhead && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {planAhead.riskLevel && (
                    <span className="font-mono text-2xs px-2.5 py-1 rounded-lg shrink-0" style={{ color: planAhead.riskLevel === 'ปลอดภัย' ? C.emerald : planAhead.riskLevel === 'ต้องระวัง' ? C.orange : C.red, border: `1px solid ${planAhead.riskLevel === 'ปลอดภัย' ? C.emerald : planAhead.riskLevel === 'ต้องระวัง' ? C.orange : C.red}` }}>{planAhead.riskLevel}</span>
                  )}
                  <p className="font-body text-xs flex-1 min-w-[150px]" style={{ color: C.text }}>{planAhead.headline}</p>
                </div>
                {Array.isArray(planAhead.conflicts) && planAhead.conflicts.length > 0 && (
                  <div className="space-y-1.5">
                    {planAhead.conflicts.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.red}`, border: `1px solid ${C.border}` }}>
                        <div className="font-mono text-2xs" style={{ color: C.red }}>{c.date}</div>
                        <div className="font-body text-xs" style={{ color: C.text }}>{c.what}</div>
                        {c.impact && <div className="font-body text-xs" style={{ color: C.muted }}>→ {c.impact}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(planAhead.actions) && planAhead.actions.length > 0 && (
                  <div>
                    <div className="font-mono text-2xs mb-1.5" style={{ color: C.emerald }}>ต้องทำอะไรบ้าง</div>
                    <div className="space-y-1">
                      {planAhead.actions.map((a, i) => (
                        <div key={i} className="p-2 rounded-lg" style={{ background: C.bgDeep }}>
                          <span className="font-mono" style={{ fontSize: 10, color: C.cyan }}>{a.when}</span>
                          <div className="font-body text-xs" style={{ color: C.text }}>{a.do}</div>
                          {a.why && <div className="font-body text-xs" style={{ color: C.muted }}>{a.why}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(planAhead.lightDays) && planAhead.lightDays.length > 0 && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>วันที่ว่างพอจะทำงานล่วงหน้า</div>
                    {planAhead.lightDays.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
                  </div>
                )}
                {planAhead.advice && (
                  <div className="p-2.5 rounded-xl" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44` }}>
                    <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>คำแนะนำหลัก</div>
                    <p className="font-body text-xs" style={{ color: C.text }}>{planAhead.advice}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ผู้ช่วย AI — ย้ายมาไว้ต่อจากกล่องรายละเอียดวันที่เลือก */}
          <div className="p-4 rounded-2xl mt-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}44` }}>
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
      </div>

      {/* ติดตามความคืบหน้า — ให้ AI อ่านสถิติคลิปจากภาพหน้าจอ */}
      <ProgressTracker dayMap={dayMap} channels={channels} logs={progressLogs} setLogs={setProgressLogs} user={user} />

      {/* วันสำคัญไทย/สากล + AI คิดไอเดียคลิป */}
      <ImportantDaysPanel channels={channels} notes={notes} />

      {/* แนวโน้มรายวันทั้งเดือน */}
      {dailyTrend.length > 1 && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>แนวโน้มรายวันทั้งเดือน</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis yAxisId="l" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="l" type="monotone" dataKey="pct" name="ทำเสร็จ %" stroke={C.emerald} strokeWidth={2} dot={{ r: 2 }} connectNulls />
              <Line yAxisId="r" type="monotone" dataKey="score" name="คะแนนคุณภาพ (x10)" stroke={C.violet} strokeWidth={2} dot={{ r: 2 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* เทียบผลงานรายช่องในเดือนนี้ */}
      {byChannelMonth.length > 0 && (
        <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เทียบผลงานรายช่องในเดือนนี้</div>
          <ResponsiveContainer width="100%" height={Math.max(140, byChannelMonth.length * 40)}>
            <BarChart data={byChannelMonth} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fill: C.muted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="total" name="งานทั้งหมด" fill={C.border} radius={[0, 4, 4, 0]} />
              <Bar dataKey="done" name="ทำเสร็จ" radius={[0, 4, 4, 0]}>
                {byChannelMonth.map((c, i) => <Cell key={i} fill={c.color || C.emerald} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* สัดส่วนงานเดือนนี้ */}
        <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>สัดส่วนงานเดือนนี้</div>
          {statusPie.length === 0 ? <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูลเดือนนี้</p> : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={statusPie} dataKey="value" innerRadius={30} outerRadius={50} stroke="none">
                    {statusPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {statusPie.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    <span className="font-body text-xs" style={{ color: C.text }}>{d.name}</span>
                    <span className="font-mono text-2xs" style={{ color: C.muted }}>({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* เทียบเดือนนี้กับเดือนก่อน */}
        <div className="p-4 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="font-mono text-2xs tracking-widest mb-3" style={{ color: C.blue }}>เทียบกับเดือนก่อน</div>
          {prevPct == null ? (
            <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีข้อมูลเดือนก่อนให้เทียบ</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center">
                <div className="font-mono text-2xs mb-1" style={{ color: C.muted }}>เดือนก่อน</div>
                <div className="font-display text-2xl font-bold" style={{ color: C.text }}>{prevPct}%</div>
              </div>
              <ArrowRight size={16} style={{ color: C.muted }} className="shrink-0" />
              <div className="flex-1 text-center">
                <div className="font-mono text-2xs mb-1" style={{ color: C.muted }}>เดือนนี้</div>
                <div className="font-display text-2xl font-bold" style={{ color: mPct >= prevPct ? C.emerald : C.red }}>{mPct}%</div>
              </div>
              <div className="shrink-0 px-2.5 py-1 rounded-lg font-mono text-2xs" style={{ color: monthDelta >= 0 ? C.emerald : C.red, border: `1px solid ${monthDelta >= 0 ? C.emerald : C.red}` }}>
                {monthDelta >= 0 ? '+' : ''}{monthDelta}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ระบบติดตามทีม — เห็นเฉพาะเจ้าของระบบ/ผู้บริหาร */}
      {user && user.clearance === 3 && <TeamTrackingPanel user={user} tasks={tasks} history={history} />}
    </div>
  );
}

const TEAM_SYS = `คุณคือหัวหน้าฝ่ายบุคคลที่ดูแลทีมผลิตคอนเทนต์ วิเคราะห์จากข้อมูลกิจกรรมจริงของทีมที่ให้มา
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ \`\`\`json
{
 "headline":"สรุปภาพรวมทีม 1 ประโยค ตรงไปตรงมา",
 "teamScore":{"score":0-100,"comment":"ทีมโดยรวมทำงานดีแค่ไหน"},
 "standouts":[{"name":"ชื่อหรืออีเมลที่ปรากฏในข้อมูลเท่านั้น","why":"ทำไมควรได้รับคำชม อ้างตัวเลขจริง"}],
 "needsSupport":[{"name":"ชื่อหรืออีเมลที่ปรากฏในข้อมูลเท่านั้น","issue":"ปัญหาที่สังเกตได้จากตัวเลข","suggestion":"ควรช่วยยังไง"}],
 "workloadAdvice":"ควรจัดสรรงานใหม่ยังไงให้สมดุลขึ้น",
 "advice":"คำแนะนำหลัก 1 ข้อสำหรับหัวหน้าทีม"
}
กติกา: ใช้เฉพาะชื่อ/อีเมลที่มีอยู่ในข้อมูลจริงเท่านั้น ห้ามเดาหรือสมมติคนขึ้นมา · อ้างตัวเลขจริงเสมอ · ถ้าข้อมูลยังน้อยเกินไปให้บอกตรงๆ ใน headline`;

// แปลงเวลาล่าสุดเป็นข้อความแบบละเอียด (นาที/ชม./วัน) — ใช้ในระบบติดตามทีม
function lastSeenLabel(ts) {
  if (!ts) return 'ไม่เคยใช้งาน';
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 3) return 'ออนไลน์ตอนนี้';
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ชม.ที่แล้ว`;
  return `${Math.floor(diffHr / 24)} วันที่แล้ว`;
}

// ---------- ระบบติดตามทีม (เห็นเฉพาะเจ้าของระบบ/ผู้บริหาร — ฝังอยู่ท้ายหน้าปฏิทิน) ----------
function TeamTrackingPanel({ user, tasks, history }) {
  const [accounts, setAccounts] = useState([]);
  const [presence, setPresence] = useState({});
  const [feed, setFeed] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState('');

  async function load() {
    setLoading(true); setErr('');
    const [au, pr, us] = await Promise.all([
      apiPost('/api/auth', { action: 'adminUsers' }),
      apiPost('/api/auth', { action: 'adminPresence' }),
      apiPost('/api/auth', { action: 'adminUsage' }),
    ]);
    if (au.ok) setAccounts(au.data.users || []); else setErr(au.data.error || 'โหลดรายชื่อทีมไม่สำเร็จ');
    if (pr.ok) { setPresence(pr.data.presence || {}); setFeed(pr.data.feed || []); }
    if (us.ok) setStats(us.data.stats || {});
    setLoading(false);
  }
  useEffect(() => { load(); const id = setInterval(load, 30000); return () => clearInterval(id); }, []);

  const members = accounts.filter((a) => a.email !== user.email);

  // งานที่มีข้อมูล assignedTo — เก็บนับตั้งแต่อัปเดตนี้เป็นต้นไป งานเก่ายังไม่มีข้อมูลนี้
  const allDays = collectAllDays(history, tasks);
  const allTasksFlat = allDays.flatMap((d) => d.tasks);

  const days30 = Object.keys(stats).sort().slice(-30);
  const days7 = days30.slice(-7);

  const rows = members.map((m) => {
    const p = presence[m.email];
    const tokens7 = days7.reduce((s, d) => s + (stats[d]?.[m.email]?.total || 0), 0);
    const actions7 = feed.filter((f) => f.email === m.email && Date.now() - f.at < 7 * 24 * 3600 * 1000).length;
    const myTasks = allTasksFlat.filter((t) => t.assignedTo === m.email);
    return {
      email: m.email, name: m.name || m.email, clearance: m.clearance,
      lastAt: p ? p.at : (m.lastLogin || null),
      lastPage: p ? p.page : null,
      online: p ? Date.now() - p.at < 3 * 60 * 1000 : false,
      tokens7, actions7,
      assignedDone: myTasks.filter((t) => t.done).length, assignedTotal: myTasks.length,
      inactive: !p || Date.now() - p.at > 7 * 24 * 3600 * 1000,
    };
  }).sort((a, b) => b.tokens7 - a.tokens7);

  const chartData = rows.map((r) => ({ name: r.name.split(' ')[0] || r.email.split('@')[0], โทเค็น: r.tokens7 }));

  async function runTeamAi() {
    setAiLoading(true); setAiErr(''); setAiResult(null);
    const payload = rows.map((r) => ({
      ชื่อ: r.name, อีเมล: r.email, ระดับ: (CLEARANCE[r.clearance] || {}).label || '-',
      ออนไลน์ตอนนี้: r.online, ใช้งานล่าสุด: lastSeenLabel(r.lastAt),
      โทเค็นที่ใช้7วันล่าสุด: r.tokens7, จำนวนครั้งที่ใช้AI7วันล่าสุด: r.actions7,
      งานที่ติ๊กเสร็จ_มีข้อมูลตั้งแต่วันนี้เท่านั้น: r.assignedDone,
    }));
    try {
      const text = await callClaude(TEAM_SYS, `ข้อมูลกิจกรรมทีม (ไม่รวมตัวเอง):\n${JSON.stringify(payload)}`, undefined, 'teamAnalysis');
      setAiResult(parseJsonLoose(text));
    } catch (e) { setAiErr(e.message || 'วิเคราะห์ทีมไม่สำเร็จ'); }
    setAiLoading(false);
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.red}33` }}>
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center gap-2"><Users size={14} style={{ color: C.red }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.red }}>ระบบติดตามทีม · เห็นเฉพาะเจ้าของ/ผู้บริหาร</span></div>
        <button onClick={runTeamAi} disabled={aiLoading || members.length === 0} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.red, color: '#fff', opacity: (aiLoading || members.length === 0) ? 0.5 : 1 }}>
          {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI วิเคราะห์ทีม
        </button>
      </div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>
        "ติ๊กเสร็จ" เริ่มเก็บข้อมูลจากอัปเดตนี้เป็นต้นไป — งานเก่าก่อนหน้านี้ยังไม่มีการบันทึกว่าใครทำ ส่วนอันดับกิจกรรม/โทเค็นใช้ข้อมูลจริงที่มีอยู่แล้วทั้งหมด
      </p>

      {loading ? (
        <p className="font-mono text-2xs" style={{ color: C.muted }}>กำลังโหลด...</p>
      ) : err ? (
        <p className="font-mono text-2xs" style={{ color: C.red }}>{err}</p>
      ) : members.length === 0 ? (
        <p className="font-body text-xs" style={{ color: C.muted }}>องค์กรนี้ยังมีแค่คุณคนเดียว — ชวนเพื่อนร่วมทีมด้วยรหัสองค์กรได้ที่หน้า Setting</p>
      ) : (
        <>
          <div className="space-y-1.5 mb-4">
            {rows.map((r, i) => (
              <div key={r.email} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <span className="font-mono shrink-0 w-5 text-center" style={{ fontSize: 10, color: i === 0 ? C.orange : C.muted }}>{i + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.online ? C.emerald : C.border }} />
                <div className="min-w-0 flex-1">
                  <div className="font-body text-xs truncate" style={{ color: C.text }}>{r.name} <span style={{ color: C.muted }}>· {(CLEARANCE[r.clearance] || {}).label || '-'}</span></div>
                  <div className="font-mono flex items-center gap-1" style={{ fontSize: 9, color: r.inactive ? C.red : C.muted }}>
                    <Clock size={9} /> {r.online ? 'ออนไลน์ตอนนี้' : lastSeenLabel(r.lastAt)}{r.lastPage ? ` · ${r.lastPage}` : ''}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-2xs" style={{ color: C.violet }}>{r.tokens7} โทเค็น/7วัน</div>
                  <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>
                    {r.assignedTotal > 0 ? `ติ๊กเสร็จ ${r.assignedDone}/${r.assignedTotal}` : 'ยังไม่มีข้อมูลงาน'}
                  </div>
                </div>
                {r.inactive && <AlertTriangle size={13} style={{ color: C.red }} className="shrink-0" />}
              </div>
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="mb-4">
              <div className="font-mono text-2xs tracking-widest mb-2" style={{ color: C.blue }}>เทียบกิจกรรม 7 วันล่าสุด (โทเค็นที่ใช้)</div>
              <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 36)}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fill: C.muted, fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, fontSize: 11 }} />
                  <Bar dataKey="โทเค็น" fill={C.violet} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {aiErr && <p className="font-mono text-2xs mb-2" style={{ color: C.orange }}>{aiErr}</p>}
          {aiResult && (
            <div className="space-y-2.5 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2.5 flex-wrap">
                {aiResult.teamScore && (
                  <div className="shrink-0 text-center px-2.5 py-1.5 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${aiResult.teamScore.score >= 70 ? C.emerald : aiResult.teamScore.score >= 40 ? C.orange : C.red}` }}>
                    <div className="font-display text-lg font-bold leading-none" style={{ color: aiResult.teamScore.score >= 70 ? C.emerald : aiResult.teamScore.score >= 40 ? C.orange : C.red }}>{aiResult.teamScore.score}</div>
                    <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>คะแนนทีม</div>
                  </div>
                )}
                <p className="font-body text-sm flex-1 min-w-[180px]" style={{ color: C.text }}>{aiResult.headline}</p>
              </div>
              {aiResult.teamScore?.comment && <p className="font-body text-xs" style={{ color: C.muted }}>{aiResult.teamScore.comment}</p>}
              {Array.isArray(aiResult.standouts) && aiResult.standouts.length > 0 && (
                <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                  <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>ควรได้รับคำชม</div>
                  {aiResult.standouts.map((s, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {s.name}: {s.why}</p>)}
                </div>
              )}
              {Array.isArray(aiResult.needsSupport) && aiResult.needsSupport.length > 0 && (
                <div className="space-y-1.5">
                  {aiResult.needsSupport.map((s, i) => (
                    <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.orange}`, border: `1px solid ${C.border}` }}>
                      <div className="font-body text-xs" style={{ color: C.orange }}>{s.name} — {s.issue}</div>
                      <div className="font-body text-xs" style={{ color: C.muted }}>→ {s.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
              {aiResult.workloadAdvice && (
                <p className="font-body text-xs p-2.5 rounded-xl" style={{ color: C.text, background: C.bgDeep }}><span style={{ color: C.cyan }}>จัดสรรงาน: </span>{aiResult.workloadAdvice}</p>
              )}
              {aiResult.advice && (
                <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}>
                  <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>คำแนะนำหลัก</div>
                  <p className="font-body text-xs" style={{ color: C.text }}>{aiResult.advice}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
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

const KPI_SYS = 'คุณคือที่ปรึกษาด้านประสิทธิภาพการทำงาน วิเคราะห์จากตัวชี้วัดจริงที่ให้มา ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามใส่ code fence รูปแบบ: {"headline":"สรุปสถานการณ์ 1 ประโยค ตรงไปตรงมา","grade":"ต้องปรับปรุงด่วน|พอใช้|ดี|ดีเยี่ยม","strengths":["จุดแข็งที่เห็นจากตัวเลข"],"problems":[{"problem":"ปัญหา","evidence":"อ้างตัวเลขจริง","impact":"กระทบอะไร","fix":"แก้ยังไงให้เห็นผลใน 7 วัน"}],"channelAdvice":[{"channel":"ชื่อช่อง","status":"ดี|ต้องดู|วิกฤต","action":"ควรทำอะไรกับช่องนี้"}],"qualityVsQuantity":"ทำเยอะกับทำดีสมดุลกันไหม อธิบายจากตัวเลข","nextMonthTarget":{"completion":"เป้าอัตราทำเสร็จเดือนหน้า","quality":"เป้าคะแนนคุณภาพ","reasoning":"ตั้งเป้านี้เพราะอะไร"},"topPriority":"สิ่งเดียวที่ควรโฟกัสที่สุดตอนนี้"}';

function KpiPage({ history, tasks, channels }) {
  const allDays = collectAllDays(history, tasks);
  const months = Array.from(new Set(allDays.map((d) => monthKey(d.date)))).sort().reverse();
  const [selMonth, setSelMonth] = useState(months[0] || monthKey(todayDateStr()));
  const [query, setQuery] = useState('');
  const [kpiAi, setKpiAi] = useState(null);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [kpiErr, setKpiErr] = useState('');

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

  async function runKpiAi() {
    setKpiLoading(true); setKpiErr(''); setKpiAi(null);
    const payload = {
      เดือน: thaiMonthLabel(selMonth),
      อัตราทำเสร็จ: `${completion}% (${doneTasks}/${totalTasks})`,
      คะแนนคุณภาพเฉลี่ย: avgScore == null ? 'ยังไม่มีผลตรวจ' : avgScore.toFixed(1),
      จำนวนคลิปที่ส่งตรวจ: scored.length,
      วันทำครบติดกัน: streak,
      วันที่ทำครบ: `${perfectDays}/${activeDays}`,
      แนวโน้มรายวัน: dailyTrend,
      แยกตามช่อง: byChannel,
      เทียบรายเดือน: monthCompare,
    };
    try {
      const text = await callClaude(KPI_SYS, `ตัวชี้วัดจริง:\n${JSON.stringify(payload, null, 1)}`, undefined, 'deepAnalysis');
      setKpiAi(parseJsonLoose(text));
    } catch (e) { setKpiErr(e.message || 'วิเคราะห์ไม่สำเร็จ'); }
    setKpiLoading(false);
  }

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

      {/* วิเคราะห์ด้วย AI */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.violet}44` }}>
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <div className="flex items-center gap-2"><Sparkles size={14} style={{ color: C.violet }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>AI วิเคราะห์ตัวชี้วัด</span></div>
          <button onClick={runKpiAi} disabled={kpiLoading || totalTasks === 0} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.violet, color: '#fff', opacity: (kpiLoading || totalTasks === 0) ? 0.5 : 1 }}>
            {kpiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} วิเคราะห์เดือนนี้
          </button>
        </div>
        {kpiErr && <p className="font-mono text-2xs mb-2" style={{ color: C.red }}>{kpiErr}</p>}
        {!kpiAi && !kpiLoading && (
          <p className="font-body text-xs" style={{ color: C.muted }}>
            {totalTasks === 0 ? 'ยังไม่มีข้อมูลเดือนนี้ — เริ่มทำงานก่อนแล้วค่อยให้ AI วิเคราะห์' : 'AI จะดูตัวเลขทั้งหมดแล้วบอกว่าปัญหาอยู่ตรงไหน ต้องแก้อะไรก่อน และควรตั้งเป้าเดือนหน้าเท่าไหร่'}
          </p>
        )}
        {kpiAi && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-2xs px-2.5 py-1 rounded-lg" style={{ color: /ดีเยี่ยม/.test(kpiAi.grade) ? C.emerald : /^ดี/.test(kpiAi.grade) ? C.cyan : /พอใช้/.test(kpiAi.grade) ? C.orange : C.red, border: `1px solid ${/ดีเยี่ยม/.test(kpiAi.grade) ? C.emerald : /^ดี/.test(kpiAi.grade) ? C.cyan : /พอใช้/.test(kpiAi.grade) ? C.orange : C.red}` }}>{kpiAi.grade}</span>
              <p className="font-body text-sm flex-1 min-w-[180px]" style={{ color: C.text }}>{kpiAi.headline}</p>
            </div>
            {kpiAi.topPriority && (
              <div className="p-2.5 rounded-xl" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}55` }}>
                <div className="font-mono text-2xs mb-1" style={{ color: C.orange }}>โฟกัสสิ่งนี้ก่อน</div>
                <p className="font-body text-xs" style={{ color: C.text }}>{kpiAi.topPriority}</p>
              </div>
            )}
            {Array.isArray(kpiAi.problems) && kpiAi.problems.length > 0 && (
              <div className="space-y-1.5">
                {kpiAi.problems.map((p, i) => (
                  <div key={i} className="p-2.5 rounded-xl" style={{ background: C.bgDeep, borderLeft: `3px solid ${C.red}`, border: `1px solid ${C.border}` }}>
                    <div className="font-body text-xs" style={{ color: C.red }}>{p.problem}</div>
                    <p className="font-body text-xs" style={{ color: C.muted }}>หลักฐาน: {p.evidence}</p>
                    {p.impact && <p className="font-body text-xs" style={{ color: C.muted }}>กระทบ: {p.impact}</p>}
                    <p className="font-body text-xs mt-0.5" style={{ color: C.emerald }}>แก้: {p.fix}</p>
                  </div>
                ))}
              </div>
            )}
            {Array.isArray(kpiAi.strengths) && kpiAi.strengths.length > 0 && (
              <div className="p-2.5 rounded-xl" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
                <div className="font-mono text-2xs mb-1" style={{ color: C.emerald }}>จุดแข็ง</div>
                {kpiAi.strengths.map((x, i) => <p key={i} className="font-body text-xs" style={{ color: C.text }}>▸ {x}</p>)}
              </div>
            )}
            {Array.isArray(kpiAi.channelAdvice) && kpiAi.channelAdvice.length > 0 && (
              <div className="space-y-1">
                {kpiAi.channelAdvice.map((c, i) => {
                  const col = c.status === 'ดี' ? C.emerald : c.status === 'วิกฤต' ? C.red : C.orange;
                  return (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: C.bgDeep }}>
                      <span className="font-mono shrink-0 px-1.5 rounded" style={{ fontSize: 9, color: col, border: `1px solid ${col}` }}>{c.status}</span>
                      <div className="min-w-0"><span className="font-body text-xs" style={{ color: C.text }}>{c.channel}: </span><span className="font-body text-xs" style={{ color: C.muted }}>{c.action}</span></div>
                    </div>
                  );
                })}
              </div>
            )}
            {kpiAi.qualityVsQuantity && <p className="font-body text-xs p-2.5 rounded-xl" style={{ color: C.text, background: C.bgDeep }}><span style={{ color: C.cyan }}>ทำเยอะ vs ทำดี: </span>{kpiAi.qualityVsQuantity}</p>}
            {kpiAi.nextMonthTarget && (
              <div className="p-2.5 rounded-xl" style={{ background: `${C.violet}12`, border: `1px solid ${C.violet}44` }}>
                <div className="font-mono text-2xs mb-1" style={{ color: C.violet }}>เป้าเดือนหน้า</div>
                <p className="font-body text-xs" style={{ color: C.text }}>ทำเสร็จ {kpiAi.nextMonthTarget.completion} · คุณภาพ {kpiAi.nextMonthTarget.quality}</p>
                <p className="font-body text-xs" style={{ color: C.muted }}>{kpiAi.nextMonthTarget.reasoning}</p>
              </div>
            )}
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

// ---------- ตั้งค่าหน้าตา: ธีมสี + ลายน้ำโลโก้บริษัท ----------
function AppearancePanel({ user, theme, onChangeTheme, company, setCompany, showToast }) {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  // โลโก้เป็นข้อมูลส่วนกลางขององค์กร ต้องระดับหัวหน้าขึ้นไปถึงแก้ได้ (ตรงกับกติกาใน store.js)
  const canEditOrg = (user?.clearance || 1) >= 2 || ['manager', 'exec', 'dev'].includes(user?.role) || user?.isOwner;

  // ย่อรูปก่อนเก็บ — โลโก้ต้นฉบับมักใหญ่หลายเมกะไบต์ ถ้าเก็บดิบๆ ข้อมูลองค์กรจะบวมจนบันทึกไม่ผ่าน
  async function handleLogo(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('ต้องเป็นไฟล์รูปภาพ'); return; }
    setBusy(true); setErr('');
    try {
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => rej(new Error('อ่านไฟล์ไม่สำเร็จ'));
        r.readAsDataURL(file);
      });
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error('ไฟล์รูปเสียหรือเปิดไม่ได้'));
        i.src = dataUrl;
      });
      const MAX = 360;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      // ใช้ PNG เพื่อเก็บพื้นหลังโปร่งใสของโลโก้ไว้
      const out = cv.toDataURL('image/png');
      if (out.length > 400000) { setErr('ไฟล์ใหญ่เกินไปแม้ย่อแล้ว — ลองใช้โลโก้ที่เรียบกว่านี้หรือไฟล์ PNG ที่เล็กลง'); setBusy(false); return; }
      setCompany((p) => ({ ...(p || {}), logo: out }));
      showToast && showToast('ตั้งลายน้ำแล้ว');
    } catch (e) { setErr(e.message || 'อัปโหลดไม่สำเร็จ'); }
    setBusy(false);
  }

  const opacity = company?.logoOpacity != null ? company.logoOpacity : 5;

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-3"><Palette size={14} style={{ color: C.violet }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>หน้าตาระบบ</span></div>

      <div className="font-mono text-2xs mb-2" style={{ color: C.muted }}>ธีมสี (เฉพาะของคุณ ไม่กระทบคนอื่น)</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {Object.entries(THEMES).map(([key, t]) => (
          <button key={key} onClick={() => onChangeTheme(key)} className="p-2.5 rounded-xl text-left" style={{ background: t.panel, border: `2px solid ${theme === key ? t.blue : t.border}` }}>
            <div className="flex gap-1 mb-1.5">
              {[t.blue, t.violet, t.emerald, t.orange].map((c, i) => (
                <span key={i} style={{ width: 11, height: 11, borderRadius: 3, background: c }} />
              ))}
            </div>
            <div className="font-body" style={{ fontSize: 11, color: t.text }}>{t.label}</div>
            {theme === key && <div className="font-mono mt-0.5" style={{ fontSize: 9, color: t.blue }}>ใช้อยู่</div>}
          </button>
        ))}
      </div>

      <div className="pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="font-mono text-2xs mb-1" style={{ color: C.muted }}>ลายน้ำโลโก้บริษัท (ทุกคนในองค์กรเห็นเหมือนกัน)</div>
        {!canEditOrg ? (
          <p className="font-body text-xs" style={{ color: C.muted }}>สิทธิ์ของคุณเปลี่ยนโลโก้องค์กรไม่ได้ — ให้หัวหน้าเป็นคนตั้ง</p>
        ) : (
          <>
            <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
              {company?.logo && (
                <div className="p-2 rounded-xl shrink-0" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                  <img src={company.logo} alt="โลโก้" style={{ height: 40, maxWidth: 110, objectFit: 'contain' }} />
                </div>
              )}
              <label className="font-mono text-2xs px-3 py-2 rounded-lg cursor-pointer inline-flex items-center gap-1.5" style={{ background: C.violet, color: '#fff', opacity: busy ? 0.6 : 1 }}>
                {busy ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />} {company?.logo ? 'เปลี่ยนโลโก้' : 'อัปโหลดโลโก้'}
                <input type="file" accept="image/*" onChange={(e) => { handleLogo(e.target.files?.[0]); e.target.value = ''; }} className="hidden" />
              </label>
              {company?.logo && (
                <button onClick={() => setCompany((p) => { const n = { ...(p || {}) }; delete n.logo; return n; })} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
                  <X size={11} /> เอาออก
                </button>
              )}
            </div>

            {company?.logo && (
              <div className="space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono" style={{ fontSize: 9, color: C.muted }}>ความจาง</span>
                    <span className="font-mono" style={{ fontSize: 9, color: C.cyan }}>{opacity}%</span>
                  </div>
                  <input
                    type="range" min={1} max={20} value={opacity}
                    onChange={(e) => setCompany((p) => ({ ...(p || {}), logoOpacity: Number(e.target.value) }))}
                    className="w-full" style={{ accentColor: C.violet }}
                  />
                  <p className="font-body" style={{ fontSize: 10, color: C.muted }}>แนะนำไม่เกิน 8% — เข้มกว่านี้จะอ่านตัวหนังสือลำบาก</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!company?.logoTile} onChange={(e) => setCompany((p) => ({ ...(p || {}), logoTile: e.target.checked }))} style={{ accentColor: C.violet, width: 14, height: 14 }} />
                  <span className="font-body text-xs" style={{ color: C.text }}>เรียงซ้ำเต็มหน้าจอ (ไม่ติ๊ก = โลโก้ใหญ่อันเดียวกลางจอ)</span>
                </label>
              </div>
            )}
          </>
        )}
        {err && <p className="font-mono text-2xs mt-2" style={{ color: C.orange }}>{err}</p>}
      </div>
    </div>
  );
}

// ---------- จัดการแพ็กองค์กร (เฉพาะผู้พัฒนา) + แผนกพนักงาน (ผู้บริหารองค์กร) ----------
function OrgPlanPanel({ user, showToast }) {
  const [orgs, setOrgs] = useState([]);
  const [plans, setPlans] = useState({});
  const [tiers, setTiers] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState('');
  const isDevUser = !!(user.isDeveloper || user.isOwner || user.role === 'dev');

  async function load() {
    setLoading(true); setMsg('');
    const [o, m] = await Promise.all([
      apiPost('/api/auth', { action: 'devListOrgs' }),
      apiPost('/api/auth', { action: 'me' }),
    ]);
    if (o.ok) setOrgs(o.data.orgs || []); else setMsg(o.data.error || 'โหลดรายชื่อองค์กรไม่สำเร็จ');
    if (m.ok) { setPlans(m.data.plans || {}); setTiers(m.data.tiers || {}); }
    setLoading(false);
  }
  useEffect(() => { if (isDevUser) load(); }, []);
  if (!isDevUser) return null;

  async function setPlan(orgId, plan) {
    setSaving(orgId); setMsg('');
    const r = await apiPost('/api/auth', { action: 'adminSetOrgPlan', orgId, plan });
    if (r.ok) {
      showToast && showToast('เปลี่ยนแพ็กแล้ว');
      if (r.data.warning) setMsg(r.data.warning);
      await load();
    } else setMsg(r.data.error || 'เปลี่ยนแพ็กไม่สำเร็จ');
    setSaving('');
  }

  // จัดกลุ่มแพ็กตามประเภทผู้ใช้ เพื่อไม่ให้เผลอให้แพ็กบุคคลกับองค์กรที่มีพนักงานหลายคน
  const grouped = {};
  Object.entries(plans).forEach(([k, p]) => {
    const t = p.tier || 'personal';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push([k, p]);
  });

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.violet}44` }}>
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center gap-2"><Building2 size={14} style={{ color: C.violet }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>แพ็กขององค์กรลูกค้า</span></div>
        <button onClick={load} disabled={loading} className="font-mono text-2xs px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
          {loading ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />} รีเฟรช
        </button>
      </div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>
        แพ็กนิติบุคคลและองค์กรใช้โทเค็นกองกลาง พนักงานทุกคนดึงจากถังเดียวกัน — ตั้งที่นี่เท่านั้น อย่าไปตั้งรายบุคคล
      </p>

      {msg && <p className="font-mono text-2xs mb-2 p-2 rounded-lg" style={{ color: C.orange, background: `${C.orange}12` }}>{msg}</p>}

      {loading && orgs.length === 0 ? (
        <p className="font-mono text-2xs" style={{ color: C.muted }}>กำลังโหลด...</p>
      ) : orgs.length === 0 ? (
        <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีองค์กรในระบบ</p>
      ) : (
        <div className="space-y-2">
          {orgs.map((o) => {
            const cur = plans[o.plan];
            const seats = cur?.seats || 1;
            const over = (o.members || 0) > seats;
            return (
              <div key={o.id} className="p-3 rounded-xl" style={{ background: C.bgDeep, border: `1px solid ${over ? C.orange : C.border}` }}>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-body text-xs flex-1 min-w-[120px]" style={{ color: C.text }}>{o.name || o.id}</span>
                  <span className="font-mono px-1.5 py-0.5 rounded shrink-0" style={{ fontSize: 9, color: over ? C.orange : C.muted, border: `1px solid ${over ? C.orange : C.border}` }}>
                    {o.members || 0}/{seats} ที่นั่ง
                  </span>
                </div>
                <div className="font-mono mb-2" style={{ fontSize: 9, color: C.muted }}>
                  แพ็กปัจจุบัน: {cur ? `${cur.name} · ${(tiers[cur.tier] || {}).label || cur.tier}` : 'ยังไม่ได้ตั้ง (ใช้โควตารายคน)'}
                  {o.tokensUsed != null && cur && cur.tokens > 0 ? ` · ใช้ไป ${o.tokensUsed}/${cur.tokens}` : ''}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select
                    value={o.plan || ''}
                    onChange={(e) => e.target.value && setPlan(o.id, e.target.value)}
                    disabled={saving === o.id}
                    className="font-mono text-2xs px-2 py-1.5 rounded-lg outline-none"
                    style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }}
                  >
                    <option value="">— เลือกแพ็ก —</option>
                    {Object.entries(grouped).map(([tier, list]) => (
                      <optgroup key={tier} label={(tiers[tier] || {}).label || tier}>
                        {list.map(([k, p]) => <option key={k} value={k}>{p.name} · {p.tokens === -1 ? 'ไม่จำกัด' : `${p.tokens.toLocaleString()} โทเค็น`} · {p.seats} ที่นั่ง</option>)}
                      </optgroup>
                    ))}
                  </select>
                  {saving === o.id && <Loader2 size={12} className="animate-spin" style={{ color: C.violet }} />}
                </div>
                {over && <p className="font-body mt-1.5" style={{ fontSize: 10, color: C.orange }}>คนเกินที่นั่ง — คนเดิมยังใช้ได้ แต่เพิ่มคนใหม่ไม่ได้จนกว่าจะอัปเกรด</p>}
              </div>
            );
          })}
        </div>
      )}
      <p className="font-body mt-2" style={{ fontSize: 10, color: C.muted }}>เปลี่ยนแพ็กแล้วรอบการใช้งานจะเริ่มนับใหม่ทันที และโทเค็นที่ใช้ไปแล้วจะถูกล้างเป็นศูนย์</p>
    </div>
  );
}

function MemberDeptPanel({ user, accounts, showToast }) {
  const [saving, setSaving] = useState('');
  const [drafts, setDrafts] = useState({});
  const [msg, setMsg] = useState('');
  const canManage = user.clearance === 3 || ['exec', 'dev'].includes(user.role) || user.isOwner;
  if (!canManage) return null;

  const myOrg = user.orgId;
  // ผู้พัฒนาเห็นทุกคน ผู้บริหารเห็นเฉพาะคนในองค์กรตัวเอง
  const isDevUser = !!(user.isDeveloper || user.isOwner || user.role === 'dev');
  const members = (accounts || []).filter((a) => (isDevUser || a.orgId === myOrg) && a.email !== user.email);

  async function save(email) {
    const dept = drafts[email] != null ? drafts[email] : '';
    setSaving(email); setMsg('');
    const r = await apiPost('/api/auth', { action: 'setMemberDept', email, dept });
    if (r.ok) showToast && showToast('บันทึกแผนกแล้ว');
    else setMsg(r.data.error || 'บันทึกไม่สำเร็จ');
    setSaving('');
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-1"><Users size={14} style={{ color: C.cyan }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.cyan }}>แผนกของพนักงาน</span></div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>ระบุแผนกให้พนักงานแต่ละคน เพื่อให้รู้ว่าใครดูแลงานส่วนไหน</p>
      {msg && <p className="font-mono text-2xs mb-2" style={{ color: C.orange }}>{msg}</p>}
      {members.length === 0 ? (
        <p className="font-body text-xs" style={{ color: C.muted }}>ยังไม่มีพนักงานคนอื่นในองค์กร — ชวนเข้าร่วมด้วยรหัสองค์กรได้</p>
      ) : (
        <div className="space-y-1.5">
          {members.map((m) => {
            const val = drafts[m.email] != null ? drafts[m.email] : (m.dept || '');
            const changed = val !== (m.dept || '');
            return (
              <div key={m.email} className="flex items-center gap-2 p-2.5 rounded-xl flex-wrap" style={{ background: C.bgDeep, border: `1px solid ${C.border}` }}>
                <div className="flex-1 min-w-[130px]">
                  <div className="font-body text-xs truncate" style={{ color: C.text }}>{m.name || m.email}</div>
                  <div className="font-mono" style={{ fontSize: 9, color: C.muted }}>{(CLEARANCE[m.clearance] || {}).label || '-'}</div>
                </div>
                <input
                  value={val}
                  onChange={(e) => setDrafts((d) => ({ ...d, [m.email]: e.target.value }))}
                  placeholder="เช่น คอนเทนต์ / การตลาด"
                  className="font-body text-xs px-2 py-1.5 rounded-lg outline-none shrink-0"
                  style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, width: 160 }}
                />
                <button
                  onClick={() => save(m.email)}
                  disabled={!changed || saving === m.email}
                  className="font-mono text-2xs px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1"
                  style={{ background: changed ? C.cyan : 'transparent', color: changed ? '#0A0A0F' : C.muted, border: `1px solid ${changed ? C.cyan : C.border}`, opacity: saving === m.email ? 0.6 : 1 }}
                >
                  {saving === m.email ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />} บันทึก
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- แถบค้นหาคำสั่ง — กด Ctrl+K เพื่อกระโดดไปหน้าหรือเครื่องมือไหนก็ได้ ----------
// ระบบมีหน้ากับเครื่องมือรวมกันเกิน 40 จุด การไล่หาในเมนูเริ่มช้ากว่าการพิมพ์ชื่อ
function CommandPalette({ open, onClose, navItems, departments, user, onGoPage, onGoDept }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  // รวมทุกปลายทางไว้ที่เดียว — หน้า + แผนก + เครื่องมือในแต่ละแผนก
  const items = [];
  navItems.forEach((n) => items.push({ kind: 'หน้า', label: n.label, Icon: n.Icon, color: C.blue, go: () => onGoPage(n.key) }));
  departments.forEach((d) => {
    const locked = user.clearance < d.clearance;
    items.push({ kind: 'แผนก', label: d.th, sub: d.en, Icon: d.icon, color: d.accent, locked, go: () => onGoDept(d) });
    (DEPT_TOOLS[d.id] || []).forEach((t) => {
      items.push({ kind: 'เครื่องมือ', label: t.label, sub: d.th, Icon: t.Icon, color: t.color, locked, go: () => onGoDept(d, t.key) });
    });
  });

  const norm = (v) => String(v || '').toLowerCase();
  const term = norm(q).trim();
  const filtered = term
    ? items.filter((i) => norm(i.label).includes(term) || norm(i.sub).includes(term) || norm(i.kind).includes(term))
    : items;
  const shown = filtered.slice(0, 40);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-i="${sel}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [sel, open]);

  function choose(i) {
    const it = shown[i];
    if (!it || it.locked) return;
    it.go(); onClose();
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(sel); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 16px 16px' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full anim-fade"
        style={{ maxWidth: 560, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center gap-2 px-3.5" style={{ borderBottom: `1px solid ${C.border}`, height: 50 }}>
          <Search size={15} style={{ color: C.muted }} className="shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="พิมพ์ชื่อหน้าหรือเครื่องมือ…"
            className="flex-1 font-body text-sm bg-transparent outline-none"
            style={{ color: C.text }}
          />
          <span className="font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ fontSize: 9, color: C.muted, border: `1px solid ${C.border}` }}>ESC</span>
        </div>

        <div ref={listRef} style={{ maxHeight: '52vh', overflowY: 'auto' }}>
          {shown.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-body text-xs" style={{ color: C.muted }}>ไม่พบ "{q}"</p>
              <p className="font-body mt-1" style={{ fontSize: 10, color: C.muted }}>ลองพิมพ์คำสั้นลง เช่น ปฏิทิน, คอนเทนต์, ตรวจ</p>
            </div>
          ) : shown.map((it, i) => (
            <button
              key={i}
              data-i={i}
              onMouseEnter={() => setSel(i)}
              onClick={() => choose(i)}
              disabled={it.locked}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left"
              style={{ background: i === sel ? `${it.color}14` : 'transparent', opacity: it.locked ? 0.4 : 1, cursor: it.locked ? 'not-allowed' : 'pointer' }}
            >
              <span className="shrink-0 flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${it.color}18` }}>
                <it.Icon size={13} style={{ color: it.color }} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-body text-xs block truncate" style={{ color: C.text }}>{it.label}</span>
                {it.sub && <span className="font-mono block truncate" style={{ fontSize: 9, color: C.muted }}>{it.sub}</span>}
              </span>
              {it.locked
                ? <span className="font-mono shrink-0" style={{ fontSize: 9, color: C.muted }}>สิทธิ์ไม่ถึง</span>
                : <span className="font-mono shrink-0 px-1.5 rounded" style={{ fontSize: 9, color: it.color, border: `1px solid ${it.color}44` }}>{it.kind}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 px-3.5 py-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="font-mono" style={{ fontSize: 9, color: C.muted }}>↑↓ เลื่อน</span>
          <span className="font-mono" style={{ fontSize: 9, color: C.muted }}>↵ เปิด</span>
          <span className="font-mono ml-auto" style={{ fontSize: 9, color: C.muted }}>{filtered.length} รายการ</span>
        </div>
      </div>
    </div>
  );
}

// ---------- เชื่อมต่อ Canva (บัญชีส่วนตัวของแต่ละคน) ----------
function CanvaConnectPanel({ showToast }) {
  const [status, setStatus] = useState(null); // null = กำลังโหลด
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function loadStatus() {
    const r = await apiPost('/api/canva/actions', { action: 'status' });
    if (r.ok) setStatus(r.data);
    else setStatus({ connected: false });
  }
  useEffect(() => { loadStatus(); }, []);

  // เว็บ Canva ส่งเรากลับมาพร้อม ?canva=connected หรือ ?canva=error ต่อท้าย URL — อ่านครั้งเดียวแล้วเคลียร์ทิ้ง
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('canva');
    if (!c) return;
    if (c === 'connected') { showToast && showToast('เชื่อมต่อ Canva สำเร็จ'); loadStatus(); }
    else if (c === 'error') { setErr('เชื่อมต่อ Canva ไม่สำเร็จ ลองใหม่อีกครั้ง'); }
    params.delete('canva'); params.delete('canvaReason');
    const q = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (q ? `?${q}` : ''));
  }, []);

  async function connect() {
    setBusy(true); setErr('');
    const r = await apiPost('/api/canva/start', {});
    if (r.ok && r.data.url) window.location.href = r.data.url;
    else { setErr(r.data.error || 'เริ่มการเชื่อมต่อไม่สำเร็จ'); setBusy(false); }
  }

  async function disconnect() {
    if (!window.confirm('ยกเลิกการเชื่อมต่อ Canva? ต้องเชื่อมต่อใหม่ถึงจะใช้ได้อีกครั้ง')) return;
    setBusy(true); setErr('');
    const r = await apiPost('/api/canva/actions', { action: 'disconnect' });
    if (r.ok) { showToast && showToast('ยกเลิกการเชื่อมต่อแล้ว'); await loadStatus(); }
    else setErr(r.data.error || 'ยกเลิกไม่สำเร็จ');
    setBusy(false);
  }

  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-1"><Palette size={14} style={{ color: C.orange }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.orange }}>Canva</span></div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>
        เชื่อมบัญชี Canva ของคุณเอง (Pro/Teams/Enterprise ที่มีอยู่แล้ว) เพื่อส่งรูปเข้าคลัง ดึงงานออกแบบกลับมา และดูเทมเพลตแบรนด์ตอนคิดคอนเทนต์ — เป็นการเชื่อมต่อส่วนตัวของคุณ เพื่อนร่วมงานไม่เห็นและไม่ใช้ร่วมกัน
      </p>

      {status === null ? (
        <p className="font-mono text-2xs" style={{ color: C.muted }}>กำลังตรวจสอบ...</p>
      ) : status.connected ? (
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${C.emerald}12`, border: `1px solid ${C.emerald}44` }}>
            <CheckCircle2 size={13} style={{ color: C.emerald }} />
            <span className="font-body text-xs" style={{ color: C.text }}>เชื่อมต่อแล้ว{status.displayName ? ` · ${status.displayName}` : ''}</span>
          </div>
          <button onClick={disconnect} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${C.border}`, color: C.muted, opacity: busy ? 0.5 : 1 }}>
            ยกเลิกการเชื่อมต่อ
          </button>
        </div>
      ) : (
        <button onClick={connect} disabled={busy} className="font-mono text-2xs px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: C.orange, color: '#0A0A0F', opacity: busy ? 0.6 : 1 }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Palette size={12} />} เชื่อมต่อ Canva
          {status.expired && <span style={{ fontSize: 9 }}> (หมดอายุ เชื่อมใหม่)</span>}
        </button>
      )}
      {err && <p className="font-mono text-2xs mt-2" style={{ color: C.orange }}>{err}</p>}
    </div>
  );
}

// ---------- ส่งรูปเข้า Canva / ดึงงานออกแบบกลับมา — ใช้ซ้ำได้หลายจุดในระบบ ----------
function CanvaBridge({ imageDataUrl, imageName, onPulledImage, showToast }) {
  const [connected, setConnected] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState('');
  const [sentOk, setSentOk] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [designs, setDesigns] = useState(null);
  const [pulling, setPulling] = useState('');
  const [pullErr, setPullErr] = useState('');

  useEffect(() => {
    apiPost('/api/canva/actions', { action: 'status' }).then((r) => setConnected(r.ok && r.data.connected));
  }, []);

  async function sendToCanva() {
    if (!imageDataUrl) return;
    setSending(true); setSendErr(''); setSentOk(false);
    try {
      const base64 = imageDataUrl.split(',')[1] || imageDataUrl;
      const r = await apiPost('/api/canva/actions', { action: 'uploadAsset', base64, name: imageName || `FORGE-${todayDateStr()}` });
      if (!r.ok) { setSendErr(r.data.error || 'ส่งเข้า Canva ไม่สำเร็จ'); setSending(false); return; }
      const jobId = r.data.job?.id;
      // งานอัปโหลดเป็นแบบ asynchronous — ต้องถามซ้ำจนกว่าจะเสร็จ ไม่เกิน ~20 วินาที
      for (let i = 0; i < 10; i++) {
        await new Promise((res) => setTimeout(res, 1500));
        const c = await apiPost('/api/canva/actions', { action: 'getUploadJob', jobId });
        const st = c.data?.job?.status;
        if (st === 'success') { setSentOk(true); showToast && showToast('ส่งเข้า Canva แล้ว'); break; }
        if (st === 'failed') { setSendErr(c.data?.job?.error?.message || 'อัปโหลดไม่สำเร็จ'); break; }
      }
    } catch (e) { setSendErr('ส่งเข้า Canva ไม่สำเร็จ'); }
    setSending(false);
  }

  async function openPicker() {
    setShowPicker(true); setPullErr('');
    if (designs) return;
    const r = await apiPost('/api/canva/actions', { action: 'listDesigns' });
    if (r.ok) setDesigns(r.data.items || []);
    else { setPullErr(r.data.error || 'ดึงรายการไม่สำเร็จ'); setDesigns([]); }
  }

  async function pullDesign(design) {
    setPulling(design.id); setPullErr('');
    try {
      const ex = await apiPost('/api/canva/actions', { action: 'exportDesign', designId: design.id, format: 'png' });
      if (!ex.ok) { setPullErr(ex.data.error || 'ส่งออกไม่สำเร็จ'); setPulling(''); return; }
      const jobId = ex.data.job?.id;
      let url = null;
      for (let i = 0; i < 12; i++) {
        await new Promise((res) => setTimeout(res, 1500));
        const c = await apiPost('/api/canva/actions', { action: 'getExportJob', jobId });
        const st = c.data?.job?.status;
        if (st === 'success') { url = c.data?.job?.urls?.[0]; break; }
        if (st === 'failed') { setPullErr('สร้างไฟล์ส่งออกไม่สำเร็จ'); break; }
      }
      if (url) {
        // ลิงก์ดาวน์โหลดของ Canva หมดอายุใน 24 ชม. — ดึงมาแปลงเป็น dataURL เก็บไว้ในงานทันที
        const imgRes = await fetch(url);
        const blob = await imgRes.blob();
        const dataUrl = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
        onPulledImage && onPulledImage(dataUrl, design.title?.trim() || 'canva-design');
        showToast && showToast('ดึงจาก Canva แล้ว');
        setShowPicker(false);
      } else if (!pullErr) setPullErr('ยังไม่เสร็จ ลองอีกครั้ง');
    } catch (e) { setPullErr('ดึงงานไม่สำเร็จ'); }
    setPulling('');
  }

  if (connected === null) return null;
  if (!connected) {
    return <p className="font-body" style={{ fontSize: 10, color: C.muted }}>เชื่อมต่อ Canva ในหน้าตั้งค่าเพื่อส่งรูปเข้า/ดึงงานออกแบบจาก Canva ได้</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {imageDataUrl && (
        <button onClick={sendToCanva} disabled={sending} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.orange}`, color: sentOk ? C.emerald : C.orange, opacity: sending ? 0.6 : 1 }}>
          {sending ? <Loader2 size={11} className="animate-spin" /> : sentOk ? <CheckCircle2 size={11} /> : <Palette size={11} />}
          {sentOk ? 'ส่งเข้า Canva แล้ว' : 'ส่งเข้า Canva'}
        </button>
      )}
      <div className="relative">
        <button onClick={openPicker} className="font-mono text-2xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
          <Download size={11} /> ดึงจาก Canva
        </button>
        {showPicker && (
          <div className="absolute left-0 mt-1 rounded-xl z-20 overflow-hidden" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, width: 260, maxHeight: 320, overflowY: 'auto' }}>
            <div className="flex items-center justify-between px-2.5 py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="font-mono text-2xs" style={{ color: C.muted }}>งานออกแบบล่าสุด</span>
              <button onClick={() => setShowPicker(false)}><X size={12} style={{ color: C.muted }} /></button>
            </div>
            {pullErr && <p className="font-mono text-2xs p-2" style={{ color: C.orange }}>{pullErr}</p>}
            {designs === null ? (
              <p className="font-mono text-2xs p-2.5" style={{ color: C.muted }}>กำลังโหลด...</p>
            ) : designs.length === 0 ? (
              <p className="font-body text-xs p-2.5" style={{ color: C.muted }}>ยังไม่มีงานออกแบบใน Canva</p>
            ) : designs.map((d) => (
              <button key={d.id} onClick={() => pullDesign(d)} disabled={!!pulling} className="w-full flex items-center gap-2 px-2.5 py-2 text-left" style={{ opacity: pulling && pulling !== d.id ? 0.5 : 1 }}>
                {d.thumbnail?.url ? <img src={d.thumbnail.url} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6 }} /> : <span style={{ width: 32, height: 32, borderRadius: 6, background: C.bgDeep }} />}
                <span className="font-body text-xs flex-1 truncate" style={{ color: C.text }}>{d.title || 'ไม่มีชื่อ'}</span>
                {pulling === d.id && <Loader2 size={11} className="animate-spin" style={{ color: C.orange }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// แผงเครื่องมือผู้พัฒนา — ใช้ทดสอบ flow ที่ผู้ใช้ใหม่จะเจอ
function DevOnboardingPanel({ user, showToast, refreshMe }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const isDevUser = !!(user.isDeveloper || user.isOwner || user.role === 'dev');
  if (!isDevUser) return null;

  async function replay() {
    if (!window.confirm('จะกลับไปหน้ายินยอมและคู่มืออีกครั้ง เพื่อดูว่าผู้ใช้ใหม่เจออะไร — ยืนยันไหม')) return;
    setBusy(true); setMsg('');
    const r = await apiPost('/api/auth', { action: 'resetMyOnboarding' });
    if (r.ok) { showToast && showToast('รีเซ็ตแล้ว กำลังพากลับไปหน้าแรกของ flow'); refreshMe && refreshMe(); }
    else setMsg(r.data.error || 'รีเซ็ตไม่สำเร็จ');
    setBusy(false);
  }

  const c = user.consent || {};
  return (
    <div className="p-4 rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.violet}44` }}>
      <div className="flex items-center gap-2 mb-2"><Zap size={14} style={{ color: C.violet }} /><span className="font-mono text-2xs tracking-widest" style={{ color: C.violet }}>เครื่องมือผู้พัฒนา · หน้าต้อนรับผู้ใช้ใหม่</span></div>
      <p className="font-body text-xs mb-3" style={{ color: C.muted }}>
        สถานะของคุณ: {c.at ? (c.devBypass ? 'ข้ามด้วยสิทธิ์ผู้พัฒนา' : `ยินยอมแล้ว (รุ่น ${c.version || '-'})`) : 'ยังไม่ได้ยินยอม'} · คู่มือ: {user.tourSeen ? `อ่านรุ่น ${user.tourSeen} แล้ว` : 'ยังไม่ได้อ่าน'}
      </p>
      <button onClick={replay} disabled={busy} className="font-mono text-2xs px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ border: `1px solid ${C.violet}`, color: C.violet, opacity: busy ? 0.5 : 1 }}>
        {busy ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />} ดูหน้าต้อนรับใหม่ (ทดสอบมุมผู้ใช้)
      </button>
      {msg && <p className="font-mono text-2xs mt-2" style={{ color: C.orange }}>{msg}</p>}
    </div>
  );
}

function SettingsPage({ user, accounts, backupData, onImportBackup, tokens, refreshMe, showToast, onFixOrphans, onBackupNow, trash, onRestoreTrash, onPurgeTrash, onEmptyTrash, channels, tasks, history, futureTasks, loadOk, theme, onChangeTheme, company, setCompany }) {
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

      <OrgPlanPanel user={user} showToast={showToast} />
      <MemberDeptPanel user={user} accounts={accounts} showToast={showToast} />
      <CanvaConnectPanel showToast={showToast} />
      <AppearancePanel user={user} theme={theme} onChangeTheme={onChangeTheme} company={company} setCompany={setCompany} showToast={showToast} />
      <DevOnboardingPanel user={user} showToast={showToast} refreshMe={refreshMe} />
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

function DailyWork({ user, channels, setChannels, tasks, setTasks, futureTasks, setFutureTasks, history, setHistory, reminder, onDismissReminder, onOpenCalendar, initialViewDate, onConsumeInitialViewDate, onTrash }) {
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
    setActiveTasksUpdater((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const nowDone = !t.done;
      // ติ๊กว่าเสร็จ → บันทึกว่าใครเป็นคนติ๊ก (ใช้ในระบบติดตามทีมที่หน้าปฏิทิน) · ติ๊กออก → ไม่ลบประวัติเดิม
      return { ...t, done: nowDone, assignedTo: nowDone ? (user?.email || t.assignedTo || null) : t.assignedTo };
    }));
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
  const [calendarNotes, setCalendarNotes] = useState({}); // โน้ต/ธุระรายวันในปฏิทิน { 'YYYY-MM-DD': { text, busy } }
  const [progressLogs, setProgressLogs] = useState([]); // ผลประเมินความคืบหน้ารายวันที่ AI อ่านจากภาพสถิติ
  const [company, setCompany] = useState({});      // ข้อมูลแบรนด์ขององค์กร เช่น โลโก้ลายน้ำ
  const [theme, setTheme] = useState('dark');     // ธีมสีของผู้ใช้แต่ละคน
  const [themeTick, setThemeTick] = useState(0);  // ใช้บังคับให้วาดใหม่ทั้งหน้าเมื่อเปลี่ยนธีม
  const [paletteOpen, setPaletteOpen] = useState(false); // แถบค้นหาคำสั่ง (Ctrl+K)
  const [pendingDeptTool, setPendingDeptTool] = useState(null); // เครื่องมือที่จะเปิดทันทีเมื่อเข้าแผนก

  // ใช้ธีมที่ผู้ใช้เคยเลือกไว้ทันทีที่รู้ว่าเป็นใคร
  useEffect(() => {
    const pref = user?.themePref;
    if (pref && THEMES[pref] && pref !== theme) { applyTheme(pref); setTheme(pref); setThemeTick((n) => n + 1); }
  }, [user?.themePref]);

  // Ctrl+K / Cmd+K เปิดแถบค้นหาคำสั่งได้จากทุกหน้า
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function changeTheme(key) {
    if (!THEMES[key]) return;
    applyTheme(key);
    setTheme(key);
    setThemeTick((n) => n + 1); // เปลี่ยน key ของ root เพื่อบังคับวาดใหม่ทั้งหน้า
    apiPost('/api/auth', { action: 'updateProfile', patch: { themePref: key } }).catch(() => {});
  }
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
        const [accRes, chRes, taskRes, histRes, dateRes, futureRes, trashRes, metricRes, planRes, rivalRes, adRes, deptRes, noteRes, progRes, compRes] = await Promise.all([
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
          api('/api/store?key=calendarNotes'),
          api('/api/store?key=progressLogs'),
          api('/api/store?key=company'),
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
        const noteVal = noteRes.data;
        setCalendarNotes((noteVal.value && typeof noteVal.value === 'object' && !Array.isArray(noteVal.value)) ? noteVal.value : {});
        setProgressLogs(Array.isArray(progRes.data.value) ? progRes.data.value : []);
        setCompany((compRes.data.value && typeof compRes.data.value === 'object') ? compRes.data.value : {});
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
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'calendarNotes', value: calendarNotes }).catch(() => {});
  }, [calendarNotes, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'progressLogs', value: progressLogs }).catch(() => {});
  }, [progressLogs, dataLoaded, loadOk, user]);
  useEffect(() => {
    if (!dataLoaded || !loadOk || !user) return;
    apiPost('/api/store', { key: 'company', value: company }).catch(() => {});
  }, [company, dataLoaded, loadOk, user]);

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

  // ---- ต้องยินยอมและอ่านคู่มือก่อนถึงจะเข้าใช้งานได้ ----
  // ถ้าขยับ CONSENT_VERSION หรือ TOUR_VERSION ผู้ใช้เดิมจะถูกพามาหน้านี้อีกครั้งโดยอัตโนมัติ
  const needsOnboarding = user && (
    !user.consent || user.consent.version !== CONSENT_VERSION || !user.onboardedAt || user.tourSeen !== TOUR_VERSION
  );
  if (user && dataLoaded && needsOnboarding) {
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
          @media (prefers-reduced-motion: reduce){ .anim-fade { animation: none; } }
        `}</style>
        <OnboardingFlow user={user} onUpdateUser={setUser} showToast={showToast} />
      </div>
    );
  }

  return (
    <div key={`theme-${themeTick}`} className="min-h-screen font-body" style={{ background: C.bg, position: 'relative' }}>
      {/* ลายน้ำโลโก้บริษัท — อยู่หลังทุกอย่าง คลิกทะลุได้ ไม่รบกวนการใช้งาน */}
      {company.logo && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
            backgroundImage: `url(${company.logo})`,
            backgroundRepeat: company.logoTile ? 'repeat' : 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: company.logoTile ? '190px' : 'min(52vw, 460px)',
            opacity: (company.logoOpacity != null ? company.logoOpacity : 5) / 100,
            filter: THEMES[theme]?.isLight ? 'none' : 'grayscale(1) brightness(1.7)',
          }}
        />
      )}
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
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          navItems={buildNavItems(user, features)}
          departments={DEPARTMENTS}
          user={user}
          onGoPage={(k) => setStage(k)}
          onGoDept={(d, toolKey) => { setActiveDept(d); setPendingDeptTool(toolKey || null); setStage('department'); }}
        />
      )}

      {stage !== 'terminal' && user && (
        <div className="flex" style={{ position: 'relative', zIndex: 1 }}>
          <Sidebar user={user} stage={stage} setStage={setStage} logout={logout} accounts={accounts} tasks={tasks} history={history} tokens={tokens} features={features} onOpenDay={(dateStr) => { setPendingViewDate(dateStr); setStage('daily'); }} onDismissDay={dismissOverdueDay} onOpenPalette={() => setPaletteOpen(true)} />
          <div className="flex-1 min-w-0">
            {stage === 'daily' && <DailyWork user={user} channels={channels} setChannels={setChannels} tasks={tasks} setTasks={setTasks} futureTasks={futureTasks} setFutureTasks={setFutureTasks} history={history} setHistory={setHistory} reminder={reminder} onDismissReminder={() => setReminder(null)} onOpenCalendar={() => setStage('calendar')} initialViewDate={pendingViewDate} onConsumeInitialViewDate={() => setPendingViewDate(null)} onTrash={sendToTrash} />}
            {stage === 'directory' && <Directory user={user} denied={denied} onOpen={openDept} features={features} />}
            {stage === 'department' && activeDept && <DepartmentView dept={activeDept} onBack={() => setStage('directory')} records={deptData} setRecords={setDeptData} showToast={showToast} ctx={{ user, channels, tasks, history }} initialTool={pendingDeptTool} onConsumeInitialTool={() => setPendingDeptTool(null)} />}
            {stage === 'calendar' && <CalendarPage user={user} history={history} tasks={tasks} channels={channels} futureTasks={futureTasks} notes={calendarNotes} setNotes={setCalendarNotes} progressLogs={progressLogs} setProgressLogs={setProgressLogs} onOpenDay={(dateStr) => { setPendingViewDate(dateStr); setStage('daily'); }} />}
            {stage === 'platforms' && <PlatformsPanel />}
            {stage === 'files' && <FileBridgePage user={user} channels={channels} setChannels={setChannels} tasks={tasks} history={history} showToast={showToast} />}
            {stage === 'team' && user.clearance === 3 && <TeamPanel accounts={accounts} onUpdateClearance={updateAccountClearance} />}
            {stage === 'analytics' && <AnalyticsPage user={user} features={features} history={history} tasks={tasks} channels={channels} metrics={metrics} setMetrics={setMetrics} plans={plans} setPlans={setPlans} setTasks={setTasks} rivals={rivals} setRivals={setRivals} ads={ads} setAds={setAds} showToast={showToast} />}
            {stage === 'kpi' && <KpiPage history={history} tasks={tasks} channels={channels} />}
            {stage === 'settings' && <SettingsPage theme={theme} onChangeTheme={changeTheme} company={company} setCompany={setCompany} user={user} accounts={accounts} backupData={{ channels, tasks, futureTasks, history, lastActiveDate }} onImportBackup={importBackup} tokens={tokens} refreshMe={refreshMe} showToast={showToast} onFixOrphans={fixOrphanTasks} onBackupNow={runBackupNow} trash={trash} onRestoreTrash={restoreFromTrash} onPurgeTrash={purgeFromTrash} onEmptyTrash={emptyTrash} channels={channels} tasks={tasks} history={history} futureTasks={futureTasks} loadOk={loadOk} />}
            {stage === 'profile' && <ProfilePage user={user} accounts={accounts} tasks={tasks} history={history} onUpdateProfile={updateProfile} />}
            {stage === 'security' && (
              <>
                {(user.clearance === 3 || user.role === 'exec' || user.role === 'dev' || user.isOwner) && <ProtocolPage user={user} showToast={showToast} />}
                <SecurityProtocol user={user} onToggleOwnOtpExempt={toggleOwnOtpExempt} />
              </>
            )}
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
