import { BookingStore, getNow, seedBookings } from '@bankap/core';
import { useEffect, useState, useSyncExternalStore } from 'react';

// Hasta que exista el backend (ASP.NET Core + PostgreSQL, ver PRD), la agenda vive en memoria.
export const store = new BookingStore(seedBookings(getNow().today), { overbooking: false });

export const useBookings = () => useSyncExternalStore(store.subscribe, store.getAll);

/** Re-renderiza cada minuto para mover la línea de "ahora". */
export function useNow() {
  const [now, setNow] = useState(getNow);
  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
