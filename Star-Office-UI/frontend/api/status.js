function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach(pair => {
    const [key, value] = pair.trim().split('=').map(s => s.trim());
    if (key && value) out[key] = decodeURIComponent(value);
  });
  return out;
}

export default function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const state = cookies.star_office_state || 'idle';
  const detail = cookies.star_office_detail || 'Waiting...';
  const valid = ['idle', 'writing', 'researching', 'executing', 'syncing', 'error'];
  const safeState = valid.includes(state) ? state : 'idle';

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    state: safeState,
    detail: detail || 'Waiting...',
    progress: 0,
    updated_at: new Date().toISOString()
  });
}
