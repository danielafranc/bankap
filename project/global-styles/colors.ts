/**
 * bankap — color variables for React Native.
 *
 * Mirror of `colors.css` (the source of truth): same variables, same values, camelCase names
 * (`--texto-principal` → `colors.textoPrincipal`). React Native can't read CSS files or `var()`,
 * so components import from here. If you change a color, change it in both files.
 */
export const colors = {
  // Texto
  textoPrincipal: '#1d1a21', // títulos, cuerpo, botón principal
  textoSecundario: '#5f5664', // etiquetas de formularios, descripciones
  textoTerciario: '#6f6574', // textos de apoyo
  textoSuave: '#8b8190', // subtítulos, horas, notas
  textoSobreTinte: '#3d3542', // texto sobre las tarjetas de categoría
  textoInvertido: '#ffffff', // texto sobre fondo oscuro

  // Marca
  marca: '#7b4fa3', // links, ícono de check
  marcaHover: '#5c3482',
  marcaLila: '#b893cf', // puntos y detalles
  marcaDurazno: '#e9a98f',

  // Selección (horario o servicio elegido)
  seleccion1: '#e9d6f4',
  seleccion2: '#f8dbe5',
  seleccion3: '#fbe4d6',
  seleccionBorde: '#e3bfd8',

  // Fondo de la app
  fondo1: '#f1e9f6',
  fondo2: '#f8eff2',
  fondo3: '#fbefe8',
  fondoBrilloLila: 'rgba(232, 220, 246, 0.95)',
  fondoBrilloDurazno: 'rgba(251, 226, 214, 0.9)',

  // Superficies (tarjetas, inputs, chips)
  superficie: 'rgba(255, 255, 255, 0.7)',
  superficieFuerte: 'rgba(255, 255, 255, 0.8)',
  superficieSuave: 'rgba(255, 255, 255, 0.45)',
  superficieBorde: 'rgba(255, 255, 255, 0.9)',
  superficieHoja: '#fbf8fb', // bottom sheets
  superficieBarra: 'rgba(252, 248, 250, 0.82)', // barra de pestañas
  superficieSolida: '#ffffff',

  // Líneas y overlays
  linea: 'rgba(29, 26, 33, 0.07)',
  lineaFuerte: 'rgba(29, 26, 33, 0.12)',
  overlay: 'rgba(29, 20, 30, 0.32)',

  // Estados
  error: '#b2365c',
  errorBorde: '#d98aa5',
  exito: '#3aa86b', // WhatsApp
  exitoClaro: '#5fd08f',
  ahora: '#d4577e', // línea de hora actual en la agenda
  aviso: '#e8789a', // punto de notificación
  ocupado: 'rgba(29, 26, 33, 0.07)', // rayado de horarios ocupados
  deshabilitado: 'rgba(29, 26, 33, 0.3)',

  // Categorías de servicio (agenda). React Native doesn't support oklch(), so these are the
  // hex equivalents of the CSS values.
  catCejas: '#ebdefd', // oklch(0.92 0.045 305)
  catPestanas: '#ffddca', // oklch(0.92 0.045 50)
  catUnas: '#fed9e6', // oklch(0.92 0.045 355)
  catCombos: '#cfe8ff', // oklch(0.92 0.045 250)
} as const;

/**
 * The CSS gradients (`--seleccion-degradado`, `--fondo-degradado`) as lists of colors.
 * React Native has no CSS gradients; components draw them with SVG using these stops.
 */
export const degradados = {
  /** 120°. */
  seleccion: [colors.seleccion1, colors.seleccion2, colors.seleccion3],
  /** Linear base at 170°, plus a durazno glow (top right) and a lila glow (left). */
  fondo: [colors.fondo1, colors.fondo2, colors.fondo3],
};
