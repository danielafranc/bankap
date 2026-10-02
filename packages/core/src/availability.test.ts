import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setNow, slotStatus, slotsFor, BookingStore, seedBookings, addDays, type Booking } from './index.ts';

setNow({ today: '2026-10-01', minutes: 615 }); // jueves 10:15

const b = (date: string, start: number, dur: number, id = 'b1'): Booking => ({ id, date, start, dur, serviceId: 's1', client: 'A B', phone: '1', email: 'a@b.c' });

test('los turnos arrancan en punto o y media (RN-01)', () => {
  assert.ok(slotsFor([], '2026-10-02', 30).every(s => s.t % 30 === 0));
});

test('pasado, almuerzo y domingo', () => {
  assert.equal(slotStatus([], '2026-10-01', 600, 30), 'passed');
  assert.equal(slotStatus([], '2026-10-01', 630, 30), 'free');
  assert.equal(slotStatus([], '2026-10-02', 750, 60), 'busy'); // pisa el almuerzo
  assert.equal(slotStatus([], '2026-10-04', 600, 30), 'closed');
});

test('ocupa la duración completa (RN-02) y no se superpone (RN-07)', () => {
  const bs = [b('2026-10-02', 600, 90)];
  assert.equal(slotStatus(bs, '2026-10-02', 660, 30), 'busy');
  assert.equal(slotStatus(bs, '2026-10-02', 570, 60), 'busy');
  assert.equal(slotStatus(bs, '2026-10-02', 690, 30), 'free');
});

test('sobreturnos: alcanza con empezar dentro del horario (RN-06)', () => {
  assert.equal(slotStatus([], '2026-10-02', 1110, 60), 'busy');
  assert.equal(slotStatus([], '2026-10-02', 1110, 60, { overbook: true }), 'free');
});

test('al guardar gana la primera reserva (RF-15)', async () => {
  const store = new BookingStore([], { simulateConflictOnce: true });
  const nb = { date: '2026-10-02', start: 600, serviceId: 's1', client: 'Sofía M', phone: '1123456789', email: 's@g.com' };
  assert.deepEqual(await store.create(nb), { ok: false, reason: 'taken' });
  const ok = await store.create({ ...nb, start: 630 });
  assert.equal(ok.ok, true);
});

test('reprogramar no choca consigo mismo', () => {
  const store = new BookingStore([b('2026-10-02', 600, 60)]);
  assert.equal(store.reschedule('b1', '2026-10-02', 630), true);
  assert.equal(store.getAll()[0].start, 630);
});

test('la agenda de ejemplo no tiene superposiciones', () => {
  const all = seedBookings('2026-10-01');
  for (const x of all)
    for (const y of all)
      if (x.id !== y.id && x.date === y.date) assert.ok(x.start >= y.start + y.dur || x.start + x.dur <= y.start, `${x.id} pisa ${y.id}`);
});
