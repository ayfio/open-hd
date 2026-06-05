/**
 * Shareable chart links.
 *
 * Encodes birth data in URL query params so a chart can be bookmarked,
 * shared, or opened directly:
 *
 *   ?d=1990-06-15&t=14:30&tz=-6&n=Alex&place=Denver,+Colorado,+United+States
 *    &lat=39.7392&lon=-104.9847&iana=America/Denver
 *
 * Only `d` is required; everything else has sensible fallbacks.
 */

export function birthToParams(birth) {
  const p = new URLSearchParams();
  p.set('d', birth.birthDate);
  if (birth.birthTime) p.set('t', birth.birthTime);
  if (birth.timezone !== undefined && birth.timezone !== null) p.set('tz', String(birth.timezone));
  if (birth.name) p.set('n', birth.name);
  if (birth.timeUnknown) p.set('tu', '1');
  if (birth.location) {
    if (birth.location.name) p.set('place', birth.location.name);
    if (birth.location.lat !== undefined && birth.location.lat !== null) p.set('lat', String(birth.location.lat));
    if (birth.location.lon !== undefined && birth.location.lon !== null) p.set('lon', String(birth.location.lon));
    if (birth.location.iana) p.set('iana', birth.location.iana);
  }
  return p;
}

export function paramsToBirth(searchParams) {
  const p = typeof searchParams === 'string' ? new URLSearchParams(searchParams) : searchParams;
  const d = p.get('d');
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;

  const t = p.get('t');
  const birthTime = t && /^\d{1,2}:\d{2}$/.test(t) ? t : '12:00';
  const tz = p.get('tz');
  const timezone = tz !== null && tz !== '' && !Number.isNaN(parseFloat(tz)) ? parseFloat(tz) : 0;

  const lat = parseFloat(p.get('lat'));
  const lon = parseFloat(p.get('lon'));
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon);
  const placeName = p.get('place');
  const iana = p.get('iana');

  return {
    name: p.get('n') || null,
    birthDate: d,
    birthTime,
    timeUnknown: p.get('tu') === '1',
    timezone,
    location: (hasCoords || placeName || iana) ? {
      lat: hasCoords ? lat : null,
      lon: hasCoords ? lon : null,
      timezone,
      iana: iana || null,
      name: placeName || null
    } : null
  };
}

/** Full shareable URL for the current page. */
export function shareUrl(birth) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?${birthToParams(birth)}`;
}
