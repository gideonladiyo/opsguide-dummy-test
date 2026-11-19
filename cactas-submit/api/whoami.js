// Returns (and logs to the Vercel function log) the IP that reached the site.
// Used to check that form automation runs through the fixed-IP proxy, including retries.
const clip = (value, max) => String(value ?? '').slice(0, max);

export default function handler(request, response) {
  const headers = request.headers || {};
  const forwarded = clip(headers['x-forwarded-for'], 200).split(',')[0].trim();
  const query = new URL(request.url || '/', 'http://localhost').searchParams;
  const entry = {
    ts: new Date().toISOString(),
    ip: forwarded || clip(headers['x-real-ip'], 64) || clip(request.socket?.remoteAddress, 64),
    page: clip(query.get('page'), 64),
    event: clip(query.get('event'), 16),
    btn: clip(query.get('btn'), 64),
    ua: clip(headers['user-agent'], 200),
  };
  console.log('[cactas-whoami]', JSON.stringify(entry));
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(entry));
}
