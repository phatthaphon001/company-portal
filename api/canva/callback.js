import { consumeCanvaOAuthState, saveCanvaTokens, logActivity } from '../_lib.js';

const CANVA_TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token';

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = process.env.PUBLIC_BASE_URL || `${proto}://${req.headers.host}`;

  function backToApp(status, extra) {
    // พากลับหน้าเว็บพร้อมสถานะ — หน้าเว็บอ่านค่านี้จาก URL แล้วเคลียร์ทิ้งเอง ไม่ค้างใน address bar
    const u = new URL(baseUrl);
    u.searchParams.set('canva', status);
    if (extra) u.searchParams.set('canvaReason', extra);
    res.writeHead(302, { Location: u.toString() });
    res.end();
  }

  const { code, state, error } = req.query || {};
  if (error) return backToApp('error', String(error).slice(0, 60));
  if (!code || !state) return backToApp('error', 'missing_params');

  // ตรวจ state กับที่เก็บไว้ตอนเริ่ม — ถ้าไม่ตรงหรือหมดอายุ ต้องหยุดทันที กัน CSRF
  const pending = await consumeCanvaOAuthState(String(state));
  if (!pending) return backToApp('error', 'state_mismatch');

  try {
    const basic = Buffer.from(`${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`).toString('base64');
    const redirectUri = `${baseUrl}/api/canva/callback`;
    const tokenRes = await fetch(CANVA_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${basic}` },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: String(code),
        code_verifier: pending.codeVerifier,
        redirect_uri: redirectUri,
      }),
    });
    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.access_token) return backToApp('error', 'token_exchange_failed');

    await saveCanvaTokens(pending.email, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in || 14400) * 1000,
      connectedAt: Date.now(),
    });
    await logActivity({ type: 'canva_connected', email: pending.email }).catch(() => {});
    return backToApp('connected');
  } catch (e) {
    return backToApp('error', 'exception');
  }
}
