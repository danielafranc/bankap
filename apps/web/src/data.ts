import { BookingStore, getNow, seedBookings, setNow } from '@bankap/core';
import { useSyncExternalStore } from 'react';

// Flags de demo por query string, en lugar del panel de Tweaks del prototipo:
//   ?conflicto       → otra clienta toma el horario al confirmar (RF-15)
//   ?sobreturnos     → el turno solo tiene que empezar dentro del horario (RN-06)
//   ?ahora=2026-10-01T10:15 → fija la fecha y hora (para demos reproducibles)
const q = new URLSearchParams(location.search);
const fixed = q.get('ahora')?.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/);
if (fixed) setNow({ today: fixed[1], minutes: Number(fixed[2]) * 60 + Number(fixed[3]) });

export const store = new BookingStore(seedBookings(getNow().today), {
  overbooking: q.has('sobreturnos'),
  simulateConflictOnce: q.has('conflicto'),
  latencyMs: 1000,
});

export const useBookings = () => useSyncExternalStore(store.subscribe, store.getAll);
