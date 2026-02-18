function normalizeEmail(value) {
  return (value || '').trim().toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isAllowedMailboxEmail(email, domain) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedDomain = normalizeEmail(domain);

  if (!normalizedEmail || !normalizedDomain) return false;

  const pattern = new RegExp(`^[a-z0-9._%+-]+@${escapeRegExp(normalizedDomain)}$`);
  return pattern.test(normalizedEmail);
}

export function getEmailFromPathname(pathname) {
  const normalizedPathname = (pathname || '').trim();
  if (!normalizedPathname || normalizedPathname === '/') return null;

  const segments = normalizedPathname.replace(/^\/+|\/+$/g, '').split('/');
  if (segments.length !== 1) return null;

  const decoded = decodeURIComponent(segments[0]);
  return normalizeEmail(decoded) || null;
}

export function getInitialMailboxEmail({ pathname, search, savedEmail, generatedEmail, domain }) {
  const fromPath = getEmailFromPathname(pathname);
  if (isAllowedMailboxEmail(fromPath, domain)) return fromPath;

  const params = new URLSearchParams(search || '');
  const fromQuery = normalizeEmail(params.get('email'));
  if (isAllowedMailboxEmail(fromQuery, domain)) return fromQuery;

  const normalizedSaved = normalizeEmail(savedEmail);
  if (isAllowedMailboxEmail(normalizedSaved, domain)) return normalizedSaved;

  return normalizeEmail(generatedEmail);
}

export function buildMailboxUrl(origin, email) {
  const normalizedOrigin = (origin || '').replace(/\/+$/, '');
  const normalizedEmail = normalizeEmail(email);
  return `${normalizedOrigin}/${normalizedEmail}`;
}
