function normalizeOrigin(origin) {
  return (origin || '').trim().replace(/\/$/, '');
}

export function parseAllowedOrigins(frontendUrls, frontendUrlFallback = 'http://localhost:5173') {
  const csv = (frontendUrls || '').trim();
  const fallback = normalizeOrigin(frontendUrlFallback);

  if (!csv) {
    return fallback ? [fallback] : [];
  }

  return csv
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
}

export function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  return allowedOrigins.includes(normalizedOrigin);
}

export function createCorsOriginChecker(allowedOrigins) {
  return (origin, callback) => {
    if (isAllowedOrigin(origin, allowedOrigins)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  };
}
