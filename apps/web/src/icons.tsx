export const Back = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="icon" strokeWidth={2} aria-hidden><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const Check = ({ size = 18, w = 2.4 }: { size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="icon" strokeWidth={w} aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="icon" strokeWidth={2} style={{ stroke: 'var(--muted)' }} aria-hidden><path d="M9 6l6 6-6 6" /></svg>
);
