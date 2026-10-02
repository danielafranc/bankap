import { SERVICES, SV, hoursOf } from './catalog.ts';
import { slotStatus, type Booking } from './availability.ts';
import { addDays, mondayOf, type DayKey } from './dates.ts';

const PEOPLE: [string, string][] = [
  ['Camila López', '11 5432 1098'], ['Lucía Fernández', '11 6021 4477'], ['Martina Díaz', '11 3398 2210'],
  ['Julieta Romero', '11 4870 6612'], ['Valentina Gómez', '11 2290 8743'], ['Agustina Pérez', '11 5567 0921'],
  ['Florencia Ruiz', '11 6633 1485'], ['Micaela Sosa', '11 4012 7756'], ['Carla Benítez', '11 3176 9054'],
  ['Rocío Acosta', '11 2845 3302'],
];

/** Agenda de ejemplo: días en relación al lunes de la semana actual, más relleno pseudoaleatorio. */
const HAND: Record<number, [number, string][]> = {
  0: [[600, 's3'], [690, 's1'], [870, 's5'], [1020, 's6']],
  1: [[570, 's4'], [900, 's2'], [1050, 's1']],
  2: [[540, 's6'], [630, 's3'], [870, 's7'], [1020, 's2']],
  3: [[570, 's2'], [660, 's4'], [840, 's1'], [900, 's5'], [1050, 's1']],
  4: [[540, 's3'], [630, 's1'], [720, 's6'], [900, 's4'], [1020, 's2']],
  5: [[540, 's5'], [690, 's1'], [720, 's3']],
  7: [[600, 's7'], [870, 's3']],
  8: [[540, 's4'], [690, 's2'], [960, 's5']],
  9: [[630, 's1'], [840, 's6'], [960, 's3']],
};

export function seedBookings(today: DayKey): Booking[] {
  let id = 1, pi = 0;
  const out: Booking[] = [];
  const add = (date: DayKey, start: number, sid: string) => {
    const [client, phone] = PEOPLE[pi++ % PEOPLE.length];
    out.push({ id: 'b' + id++, date, start, dur: SV[sid].dur, serviceId: sid, client, phone, email: client.split(' ')[0].toLowerCase() + '@gmail.com' });
  };
  const monday = mondayOf(today), handDays = new Set<DayKey>();
  for (const off in HAND) {
    const k = addDays(monday, Number(off));
    handDays.add(k);
    for (const [t, s] of HAND[off]) add(k, t, s);
  }
  let a = 7;
  const r = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Relleno sin "ahora": son días futuros y no deben marcarse como pasados.
  for (let i = 7; i <= 40; i++) {
    const k = addDays(today, i), h = hoursOf(k);
    if (!h || handDays.has(k)) continue;
    const p = i === 8 ? 1 : 0.3; // un día completo, para mostrar el caso "sin horarios"
    let t = h.open;
    while (t < h.close) {
      if (r() < p) {
        const s = SERVICES[Math.floor(r() * SERVICES.length)];
        if (slotStatus(out, k, t, s.dur) === 'free') { add(k, t, s.id); t += s.dur; continue; }
      }
      t += 30;
    }
  }
  return out;
}
