import { parse, type DayKey } from './dates.ts';

export type Category = 'Cejas' | 'Pestañas' | 'Uñas' | 'Combos';
export const CATEGORIES: Category[] = ['Cejas', 'Pestañas', 'Uñas', 'Combos'];

export interface Service {
  id: string;
  name: string;
  cat: Category;
  /** Minutos, múltiplo de 30 (RF-02). */
  dur: number;
  price: number;
  desc: string;
}

export const PROVIDER = {
  slug: 'daniela',
  name: 'Daniela Ríos',
  first: 'Daniela',
  initials: 'DR',
  tagline: 'Cejas, pestañas y uñas',
  area: 'Palermo, CABA',
  address: 'Gorriti 4820, Palermo',
  hoursLabel: 'Lun a vie 9–19 · Sáb 9–14',
  /** Dato de ejemplo hasta que exista el perfil real. */
  phone: '11 5555 0000',
};

export const SERVICES: Service[] = [
  { id: 's1', name: 'Perfilado de cejas', cat: 'Cejas', dur: 30, price: 9000, desc: 'Diseño con pinza y cera' },
  { id: 's2', name: 'Laminado de cejas', cat: 'Cejas', dur: 60, price: 18000, desc: 'Incluye perfilado' },
  { id: 's3', name: 'Lifting de pestañas', cat: 'Pestañas', dur: 60, price: 20000, desc: 'Con tinte, dura 6 a 8 semanas' },
  { id: 's4', name: 'Extensiones clásicas', cat: 'Pestañas', dur: 90, price: 32000, desc: 'Pelo a pelo, primera colocación' },
  { id: 's6', name: 'Esmaltado semipermanente', cat: 'Uñas', dur: 60, price: 15000, desc: 'Manos, con retirado' },
  { id: 's7', name: 'Kapping gel', cat: 'Uñas', dur: 90, price: 22000, desc: 'Refuerzo sobre uña natural' },
  { id: 's5', name: 'Combo cejas + pestañas', cat: 'Combos', dur: 120, price: 36000, desc: 'Laminado y lifting' },
];
export const SV: Record<string, Service> = Object.fromEntries(SERVICES.map(s => [s.id, s]));

export interface Block {
  s: number;
  e: number;
  label: string;
}
export interface DayHours {
  open: number;
  close: number;
  blocks: Block[];
}

/** Horario semanal menos bloqueos recurrentes (RN-04, RN-05). `null` = no atiende. */
export function hoursOf(k: DayKey): DayHours | null {
  const dow = parse(k).getDay();
  if (dow === 0) return null;
  return { open: 540, close: dow === 6 ? 840 : 1140, blocks: dow === 6 ? [] : [{ s: 780, e: 840, label: 'Almuerzo' }] };
}
