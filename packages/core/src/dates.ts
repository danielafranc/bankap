/** Fechas como claves `YYYY-MM-DD` y horas como minutos desde la medianoche (hora de Argentina). */
export type DayKey = string;

export const pad = (n: number) => String(n).padStart(2, '0');
export const key = (d: Date): DayKey => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (k: DayKey) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (k: DayKey, n: number): DayKey => {
  const d = parse(k);
  d.setDate(d.getDate() + n);
  return key(d);
};
export const mondayOf = (k: DayKey): DayKey => addDays(k, -((parse(k).getDay() + 6) % 7));

export const DS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const MS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
export const hm = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
/** `$ 18.000` — sin depender de Intl, que no siempre está completo en Hermes. */
export const money = (n: number) => '$ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const durL = (m: number) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`);
export const longDate = (k: DayKey) => {
  const d = parse(k);
  return `${cap(DL[d.getDay()])} ${d.getDate()} de ${MS[d.getMonth()]}`;
};
export const shortDate = (k: DayKey) => {
  const d = parse(k);
  return `${DS[d.getDay()].toLowerCase()} ${d.getDate()}`;
};
