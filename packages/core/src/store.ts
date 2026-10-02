import { slotStatus, type Booking } from './availability.ts';
import { SV } from './catalog.ts';
import type { DayKey } from './dates.ts';

export interface NewBooking {
  date: DayKey;
  start: number;
  serviceId: string;
  client: string;
  phone: string;
  email: string;
}

export type CreateResult = { ok: true; booking: Booking } | { ok: false; reason: 'taken' };

export interface StoreOptions {
  overbooking?: boolean;
  /** Para demos de RF-15: otra clienta toma el horario justo antes de guardar. */
  simulateConflictOnce?: boolean;
  latencyMs?: number;
}

/**
 * Agenda en memoria con la misma forma que tendría la API. La verificación de
 * "¿sigue libre?" ocurre al guardar (RN-07); en producción la hace la base de datos.
 */
export class BookingStore {
  private bookings: Booking[];
  private listeners = new Set<() => void>();
  private conflictPending: boolean;
  private seq = 0;
  readonly opts: StoreOptions;

  constructor(initial: Booking[], opts: StoreOptions = {}) {
    this.bookings = initial;
    this.opts = opts;
    this.conflictPending = !!opts.simulateConflictOnce;
  }

  getAll = () => this.bookings;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  };

  private set(next: Booking[]) {
    this.bookings = next;
    this.listeners.forEach(fn => fn());
  }

  private nextId(prefix: string) {
    return `${prefix}${Date.now().toString(36)}${(this.seq++).toString(36)}`;
  }

  private wait() {
    return new Promise(res => setTimeout(res, this.opts.latencyMs ?? 0));
  }

  async create(nb: NewBooking): Promise<CreateResult> {
    await this.wait();
    const dur = SV[nb.serviceId].dur;
    if (this.conflictPending) {
      this.conflictPending = false;
      this.set([...this.bookings, { id: this.nextId('x'), date: nb.date, start: nb.start, dur, serviceId: nb.serviceId, client: 'Rocío Acosta', phone: '11 2845 3302', email: 'rocio@gmail.com' }]);
    }
    if (slotStatus(this.bookings, nb.date, nb.start, dur, { overbook: this.opts.overbooking }) !== 'free') return { ok: false, reason: 'taken' };
    const booking: Booking = { id: this.nextId('n'), dur, ...nb };
    this.set([...this.bookings, booking]);
    return { ok: true, booking };
  }

  cancel(id: string) {
    this.set(this.bookings.filter(b => b.id !== id));
  }

  reschedule(id: string, date: DayKey, start: number): boolean {
    const b = this.bookings.find(x => x.id === id);
    if (!b || slotStatus(this.bookings, date, start, b.dur, { overbook: this.opts.overbooking, exclude: id }) !== 'free') return false;
    this.set(this.bookings.map(x => (x.id === id ? { ...x, date, start } : x)));
    return true;
  }
}
