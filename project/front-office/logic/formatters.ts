/** 18000 → "$ 18.000". Built by hand because Intl locale data isn't guaranteed on every RN engine. */
export function formatPrice(amount: number): string {
  return '$ ' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 30 → "30 min", 60 → "1 h", 90 → "1 h 30 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}
