import { pad, type DayKey } from './dates.ts';

export interface Now {
  /** Día de hoy en Argentina. */
  today: DayKey;
  /** Minutos desde la medianoche en Argentina. */
  minutes: number;
}

// Argentina no usa horario de verano: UTC-3 todo el año (RNF-03).
const AR_OFFSET_MS = -3 * 60 * 60 * 1000;

let fixed: Now | null = null;

/** Fija "ahora" (demos y tests). `null` vuelve a la hora real. */
export function setNow(n: Now | null) {
  fixed = n;
}

export function getNow(): Now {
  if (fixed) return fixed;
  const d = new Date(Date.now() + AR_OFFSET_MS);
  return {
    today: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}
