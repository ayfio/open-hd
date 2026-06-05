/**
 * Location & timezone resolution for birth data.
 *
 * Thin re-export of natalengine's timezone module — Open-Meteo geocoding
 * (returns IANA zone) + historical UTC offset resolution via the Intl API.
 * Birth charts are extremely time-sensitive; this handles historical DST,
 * wartime time, and half-hour zones correctly.
 */

import { searchPlaces, resolveUtcOffset, formatUtcOffset } from 'natalengine';

export { searchPlaces };
export const offsetForZone = resolveUtcOffset;
export const formatOffset = formatUtcOffset;
