const COOKIE_OPTS = 'Path=/; Max-Age=86400; SameSite=Lax';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'Method Not Allowed' });
  }
  const body = req.body || {};
  const state = (body.state || 'idle').toString().trim();
  const detail = (body.detail || '').toString().trim();
  const valid = ['idle', 'writing', 'researching', 'executing', 'syncing', 'error'];
  const safeState = valid.includes(state) ? state : 'idle';

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Set-Cookie', [
    `star_office_state=${encodeURIComponent(safeState)}; ${COOKIE_OPTS}`,
    `star_office_detail=${encodeURIComponent(detail)}; ${COOKIE_OPTS}`
  ]);
  res.status(200).json({ ok: true });
}
