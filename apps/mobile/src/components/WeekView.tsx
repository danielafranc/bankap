import { C, CATEGORIES, DS, SV, TINT, addDays, hm, hoursOf, parse, type Booking } from '@bankap/core';
import { Pressable, StyleSheet, View } from 'react-native';
import { Hatch, T } from '../ui';

const WH = 20, OPEN = 540, CLOSE = 1140; // grilla común 9 a 19
const y = (m: number) => ((m - OPEN) / 30) * WH;

interface Props { monday: string; today: string; bookings: Booking[]; highlight: string | null; onOpen: (b: Booking) => void; onPickDay: (k: string) => void }

export function WeekView({ monday, today, bookings, highlight, onOpen, onPickDay }: Props) {
  const days = [...Array(6)].map((_, i) => addDays(monday, i)); // lunes a sábado
  const marks: number[] = [];
  for (let t = OPEN; t <= CLOSE; t += 60) marks.push(t);

  return (
    <>
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <View style={{ width: 34 }} />
        {days.map(k => {
          const d = parse(k), on = k === today;
          return (
            <Pressable key={k} onPress={() => onPickDay(k)} style={[s.head, on && { backgroundColor: C.ink }]} accessibilityRole="button">
              <T style={{ fontSize: 11, opacity: 0.7, color: on ? '#fff' : C.ink }}>{DS[d.getDay()]}</T>
              <T w={500} style={{ fontSize: 15, color: on ? '#fff' : C.ink }}>{d.getDate()}</T>
            </Pressable>
          );
        })}
      </View>
      <View style={{ marginTop: 10, height: y(CLOSE) }}>
        {marks.map(t => (
          <View key={t} style={[s.mark, { top: y(t) - 6 }]}>
            <T mono style={s.markLabel}>{Math.floor(t / 60)}</T>
            <View style={s.markLine} />
          </View>
        ))}
        <View style={s.cols}>
          {days.map(k => {
            const h = hoursOf(k);
            const blocks = h ? [...h.blocks.map(b => [b.s, b.e]), ...(h.close < CLOSE ? [[h.close, CLOSE]] : [])] : [];
            return (
              <View key={k} style={s.col}>
                {blocks.map(([a, b]) => (
                  <View key={a} style={[s.block, { top: y(a) + 1, height: ((b - a) / 30) * WH - 2 }]}>
                    <Hatch color="rgba(29,26,33,.08)" line={1.5} period={5} />
                  </View>
                ))}
                {bookings.filter(b => b.date === k).map(b => (
                  <Pressable key={b.id} onPress={() => onOpen(b)} accessibilityRole="button"
                    accessibilityLabel={`${hm(b.start)}, ${SV[b.serviceId].name}, ${b.client}`}
                    style={[s.item, { top: y(b.start) + 1, height: (Math.min(b.dur, CLOSE - b.start) / 30) * WH - 2, backgroundColor: TINT[SV[b.serviceId].cat] }, highlight === b.id && s.ring]}>
                    <T mono w={600} style={{ fontSize: 10, color: C.ink2 }}>{hm(b.start)}</T>
                  </Pressable>
                ))}
              </View>
            );
          })}
        </View>
      </View>
      <View style={s.legend}>
        {CATEGORIES.map(c => (
          <View key={c} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: TINT[c], borderWidth: 1, borderColor: 'rgba(29,26,33,.08)' }} />
            <T style={{ fontSize: 12, color: C.muted2 }}>{c}</T>
          </View>
        ))}
      </View>
    </>
  );
}

const s = StyleSheet.create({
  head: { flex: 1, marginLeft: 3, paddingVertical: 6, borderRadius: 12, alignItems: 'center', gap: 1 },
  mark: { position: 'absolute', left: 0, right: 0, height: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  markLabel: { width: 30, fontSize: 10, color: C.muted },
  markLine: { flex: 1, height: 1, backgroundColor: 'rgba(29,26,33,.07)' },
  cols: { position: 'absolute', left: 37, right: 0, top: 0, bottom: 0, flexDirection: 'row' },
  col: { flex: 1, marginRight: 3 },
  block: { position: 'absolute', left: 0, right: 0, borderRadius: 8, overflow: 'hidden' },
  item: { position: 'absolute', left: 0, right: 0, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', paddingVertical: 3, paddingHorizontal: 4, overflow: 'hidden' },
  ring: { borderWidth: 2, borderColor: C.ink },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
});
