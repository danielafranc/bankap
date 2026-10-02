import { C, SV, TINT, hm, hoursOf, type Booking, type Now } from '@bankap/core';
import { Pressable, StyleSheet, View } from 'react-native';
import { Hatch, T } from '../ui';

const SH = 46; // alto de media hora
const y = (m: number, open: number) => ((m - open) / 30) * SH;

interface Props { date: string; bookings: Booking[]; now: Now; highlight: string | null; onOpen: (b: Booking) => void }

export function DayView({ date, bookings, now, highlight, onOpen }: Props) {
  const h = hoursOf(date);
  if (!h) {
    return (
      <View style={s.closed}><T style={{ fontSize: 14, color: C.muted2, textAlign: 'center' }}>Los domingos no atendés.</T></View>
    );
  }
  // Con sobreturnos un turno puede terminar después del cierre: el timeline se estira.
  const span = Math.max(h.close, ...bookings.map(b => b.start + b.dur)) - h.open;
  const marks: number[] = [];
  for (let t = h.open; t <= h.open + span; t += 60) marks.push(t);
  const showNow = date === now.today && now.minutes > h.open && now.minutes < h.close;

  return (
    <View style={{ marginTop: 12, height: (span / 30) * SH }}>
      {marks.map(t => (
        <View key={t} style={[s.mark, { top: y(t, h.open) - 7 }]}>
          <T mono style={s.markLabel}>{hm(t)}</T>
          <View style={s.markLine} />
        </View>
      ))}
      {h.blocks.map(b => (
        <View key={b.s} style={[s.block, { top: y(b.s, h.open) + 2, height: ((b.e - b.s) / 30) * SH - 4 }]}>
          <Hatch color="rgba(29,26,33,.07)" line={1.5} period={7} />
          <T style={{ fontSize: 12.5, color: C.muted }}>{b.label}</T>
        </View>
      ))}
      {bookings.map(b => {
        const x = SV[b.serviceId], compact = b.dur <= 30, on = highlight === b.id;
        return (
          <Pressable key={b.id} onPress={() => onOpen(b)} accessibilityRole="button"
            accessibilityLabel={`${hm(b.start)}, ${x.name}, ${b.client}`}
            style={[s.item, { top: y(b.start, h.open) + 2, height: (b.dur / 30) * SH - 4, backgroundColor: TINT[x.cat] }, on && s.ring]}>
            {compact ? (
              <T numberOfLines={1} style={{ fontSize: 13 }}>
                <T w={600}>{hm(b.start)}</T>  {x.name}  <T style={{ color: C.muted2 }}>· {b.client}</T>
              </T>
            ) : (
              <>
                <T mono style={{ fontSize: 11.5, color: C.muted2 }}>{hm(b.start)} – {hm(b.start + b.dur)}</T>
                <T w={600} style={{ fontSize: 14.5 }} numberOfLines={1}>{x.name}</T>
                <T style={{ fontSize: 13, color: C.body }} numberOfLines={1}>{b.client}</T>
              </>
            )}
          </Pressable>
        );
      })}
      {showNow && (
        <View pointerEvents="none" style={[s.now, { top: y(now.minutes, h.open) }]}>
          <View style={s.nowDot} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  closed: { marginTop: 12, paddingVertical: 28, paddingHorizontal: 20, borderRadius: 22, backgroundColor: 'rgba(255,255,255,.5)' },
  mark: { position: 'absolute', left: 0, right: 0, height: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  markLabel: { width: 40, fontSize: 11, color: C.muted },
  markLine: { flex: 1, height: 1, backgroundColor: 'rgba(29,26,33,.07)' },
  block: {
    position: 'absolute', left: 52, right: 0, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', paddingHorizontal: 14,
    borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(29,26,33,.15)',
  },
  item: {
    position: 'absolute', left: 52, right: 0, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,.9)',
    paddingVertical: 8, paddingHorizontal: 12, overflow: 'hidden', justifyContent: 'center', gap: 2,
  },
  ring: { borderWidth: 2, borderColor: C.ink },
  now: { position: 'absolute', left: 44, right: 0, height: 2, marginTop: -1, borderRadius: 1, backgroundColor: C.rose, zIndex: 3 },
  nowDot: { position: 'absolute', left: -4, top: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: C.rose },
});
