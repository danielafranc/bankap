import { hoursOf } from './catalog.ts';
import { getNow } from './clock.ts';
import type { DayKey } from './dates.ts';

export interface Booking {
  id: string;
  date: DayKey;
  start: number;
  dur: number;
  serviceId: string;
  client: string;
  phone: string;
  email: string;
}

export type SlotStatus = 'free' | 'busy' | 'passed' | 'closed';

export interface StatusOptions {
  /** Sobreturnos: alcanza con empezar dentro del horario (RN-06). */
  overbook?: boolean;
  /** Turno a ignorar (al reprogramarlo no choca consigo mismo). */
  exclude?: string;
}

export function slotStatus(bookings: Booking[], k: DayKey, start: number, dur: number, opt: StatusOptions = {}): SlotStatus {
  const h = hoursOf(k);
  if (!h) return 'closed';
  const now = getNow();
  if (k < now.today || (k === now.today && start <= now.minutes)) return 'passed';
  const end = start + dur;
  if (opt.overbook ? start >= h.close : end > h.close) return 'busy';
  for (const b of h.blocks) if (start < b.e && end > b.s) return 'busy';
  for (const b of bookings) if (b.date === k && b.id !== opt.exclude && start < b.start + b.dur && end > b.start) return 'busy';
  return 'free';
}

/** Todos los inicios posibles del día, en punto o y media (RN-01). */
export function slotsFor(bookings: Booking[], k: DayKey, dur: number, opt: StatusOptions = {}) {
  const h = hoursOf(k);
  if (!h) return [];
  const out: { t: number; st: SlotStatus }[] = [];
  for (let t = h.open; t < h.close; t += 30) out.push({ t, st: slotStatus(bookings, k, t, dur, opt) });
  return out;
}

export const freeCount = (bookings: Booking[], k: DayKey, dur: number, opt?: StatusOptions) =>
  slotsFor(bookings, k, dur, opt).filter(x => x.st === 'free').length;
