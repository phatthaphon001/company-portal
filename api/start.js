import crypto from 'crypto';
import { requireUser, isBanned, clientIp, saveCanvaOAuthState, rateLimit } from '../_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = clientIp(req);
  try { if (await isBanned(ip)) return res.status(403).json({ error: 'การเข้าถึงจากอุปกรณ์นี้ถูกระงับ' }); } catch (e) {}

  const session = await requireUser(req);
  if (!session) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบใหม่' });
  const me = session.account;

  const rl = await rateLimit(`canvastart_${me.email}`, 10, 10 * 60 * 1000);
  if (!rl.allowed) return res.status(429).json({ error: `ลองใหม่ใน ${rl.retrySec} วินาที` });

  const CLIENT_ID = process.env.CANVA_CLIENT_ID;
  if (!CLIENT_ID) return res.status(500).json({ error: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า CANVA_CLIENT_ID' });

  // ต้องได้ origin จริงของเว็บ ไม่ใช่เดามาเอง ไม่งั้น redirect_uri จะไม่ตรงกับที่ตั้งไว้ใน Canva แล้วเชื่อมไม่ผ่าน
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = process.env.PUBLIC_BASE_URL || `${proto}://${req.headers.host}`;

  // PKCE: code_verifier เก็บไว้ที่เซิร์ฟเวอร์เท่านั้น ไม่ส่งให้เบราว์เซอร์เห็น
  const codeVerifier = crypto.randomBytes(96).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  // state ผูกกับอีเมลผู้ใช้ตั้งแต่ตอนนี้ — ทำให้ /callback รู้ว่าเป็นใครโดยไม่ต้องพึ่ง cookie/session ตอนถูก redirect กลับมา
  const state = crypto.randomBytes(48).toString('base64url');
  await saveCanvaOAuthState(state, { email: me.email, codeVerifier });

  const redirectUri = `${baseUrl}/api/canva/callback`;
  const scope = ['profile:read', 'asset:read', 'asset:write', 'design:meta:read', 'design:content:read', 'brandtemplate:meta:read'].join(' ');

  const url = new URL('https://www.canva.com/api/oauth/authorize');
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 's256');
  url.searchParams.set('scope', scope);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('state', state);
  url.searchParams.set('redirect_uri', redirectUri);

  return res.status(200).json({ url: url.toString() });
}
