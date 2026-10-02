import type { Category } from './catalog.ts';

export const C = {
  ink: '#1d1a21',
  ink2: '#3d3542',
  body: '#5f5664',
  muted2: '#6f6574',
  muted: '#8b8190',
  accent: '#7b4fa3',
  lilac: '#b893cf',
  peach: '#e9a98f',
  rose: '#d4577e',
  danger: '#b2365c',
  dangerBorder: '#d98aa5',
  selBorder: '#e3bfd8',
  sheet: '#fbf8fb',
  cream: '#fbefe8',
  whatsapp: '#3aa86b',
  whatsappLight: '#5fd08f',
};

/** Degradado de "elegido": lila → rosa → durazno, a 120°. */
export const GRAD_STOPS = ['#e9d6f4', '#f8dbe5', '#fbe4d6'];
export const GRAD = `linear-gradient(120deg,${GRAD_STOPS.join(',')})`;
/** Fondo de pantalla: base a 170° más dos manchas radiales. */
export const BG_STOPS = ['#f1e9f6', '#f8eff2', '#fbefe8'];

export const TINT: Record<Category, string> = {
  Cejas: '#ebdefd',
  Pestañas: '#ffddca',
  Uñas: '#fed9e6',
  Combos: '#cfe8ff',
};
