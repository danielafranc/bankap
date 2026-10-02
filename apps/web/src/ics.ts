import { PROVIDER, SV, pad, parse, type Booking } from '@bankap/core';

const stamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

/** Hora de Argentina (UTC-3) → instante UTC. */
const toUtc = (k: string, minutes: number) => {
  const d = parse(k);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, minutes + 180));
};

const esc = (s: string) => s.replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');

/** Descarga un .ics con el link de gestión en la descripción (RF-13). */
export function downloadIcs(b: Booking, manageUrl: string) {
  const sv = SV[b.serviceId];
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//bankap//turnos//ES', 'BEGIN:VEVENT',
    `UID:${b.id}@bankap.app`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(toUtc(b.date, b.start))}`,
    `DTEND:${stamp(toUtc(b.date, b.start + b.dur))}`,
    `SUMMARY:${esc(`${sv.name} con ${PROVIDER.name}`)}`,
    `LOCATION:${esc(PROVIDER.address)}`,
    `DESCRIPTION:${esc(`Para cancelar o reprogramar (hasta 24 h antes): ${manageUrl}`)}`,
    `URL:${manageUrl}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'turno-bankap.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
