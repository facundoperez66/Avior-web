const { Resend } = require('resend');

const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - record.start > RATE_LIMIT_WINDOW) {
    record.count = 0;
    record.start = now;
  }
  record.count += 1;
  rateLimitMap.set(ip, record);
  return record.count > RATE_LIMIT_MAX;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || (req.socket && req.socket.remoteAddress)
    || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const body = req.body || {};
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const contacto = typeof body.contacto === 'string' ? body.contacto.trim() : '';
  const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';
  const honeypot = body._honeypot;

  // Honeypot: si está completo, es bot. Devolvemos 200 pero no enviamos.
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (nombre.length < 2 || nombre.length > 200) {
    return res.status(400).json({ ok: false, error: 'invalid_nombre' });
  }
  if (contacto.length < 5 || contacto.length > 200) {
    return res.status(400).json({ ok: false, error: 'invalid_contacto' });
  }
  if (mensaje.length < 5 || mensaje.length > 5000) {
    return res.status(400).json({ ok: false, error: 'invalid_mensaje' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
if (!apiKey || !to) {
    console.error('Faltan variables de entorno: RESEND_API_KEY o CONTACT_EMAIL');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  const resend = new Resend(apiKey);

  const subject = 'Nueva consulta — ' + nombre;
  const text = [
    'Nombre: ' + nombre,
    'Email / WhatsApp: ' + contacto,
    '',
    'Mensaje:',
    mensaje
  ].join('\n');

  const html = ''
    + '<div style="font-family: Helvetica, Arial, sans-serif; max-width: 560px; color: #131110;">'
    +   '<h2 style="margin: 0 0 16px; font-size: 18px;">Nueva consulta desde Avior</h2>'
    +   '<p style="margin: 0 0 8px;"><strong>Nombre:</strong> ' + escapeHtml(nombre) + '</p>'
    +   '<p style="margin: 0 0 8px;"><strong>Email / WhatsApp:</strong> ' + escapeHtml(contacto) + '</p>'
    +   '<p style="margin: 16px 0 8px;"><strong>Mensaje:</strong></p>'
    +   '<p style="margin: 0; white-space: pre-wrap;">' + escapeHtml(mensaje) + '</p>'
    + '</div>';

  const replyTo = isValidEmail(contacto) ? contacto : undefined;

  try {
    const payload = {
      from: 'Avior <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      text: text,
      html: html
    };
    if (replyTo) payload.replyTo = replyTo;

    const result = await resend.emails.send(payload);

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({ ok: false, error: 'send_failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send exception:', err);
    return res.status(500).json({ ok: false, error: 'send_failed' });
  }
};
