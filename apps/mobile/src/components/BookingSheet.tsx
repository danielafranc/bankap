import { C, DS, SV, TINT, addDays, durL, hm, hoursOf, longDate, money, parse, shortDate, slotsFor, waLink, type Booking } from '@bankap/core';
import { useEffect, useState } from 'react';
import { Animated, Linking, Modal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { store, useBookings } from '../data';
import { Avatar, Grad, T } from '../ui';

type Mode = 'detalle' | 'cancelar' | 'reprogramar';

interface Props {
  booking: Booking | null;
  today: string;
  onClose: () => void;
  onCancelled: (b: Booking) => void;
  onMoved: (b: Booking, date: string, start: number) => void;
}

export function BookingSheet({ booking, ...rest }: Props) {
  return (
    <Modal visible={!!booking} transparent animationType="fade" onRequestClose={rest.onClose} statusBarTranslucent>
      <Pressable style={s.backdrop} onPress={rest.onClose} accessibilityLabel="Cerrar" />
      {/* Con key, cada turno abre la hoja desde "detalle" y con su propia animación. */}
      {booking && <Sheet key={booking.id} b={booking} {...rest} />}
    </Modal>
  );
}

function Sheet({ b, today, onCancelled, onMoved }: Omit<Props, 'booking' | 'onClose'> & { b: Booking }) {
  const [mode, setMode] = useState<Mode>('detalle');
  const [rDate, setRDate] = useState(today);
  const [rStart, setRStart] = useState<number | null>(null);
  const [y] = useState(() => new Animated.Value(600));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.spring(y, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 220 }).start();
  }, [y]);

  const x = SV[b.serviceId], first = b.client.split(' ')[0];
  const initials = b.client.split(' ').map(w => w[0]).join('').slice(0, 2);

  const toReprog = () => {
    setRDate(b.date >= today && b.date <= addDays(today, 6) ? b.date : today);
    setRStart(null);
    setMode('reprogramar');
  };

  return (
      <Animated.View style={[s.sheet, { paddingBottom: Math.max(34, insets.bottom + 12), transform: [{ translateY: y }] }]}>
        <ScrollView contentContainerStyle={{ gap: 14 }} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={s.grab} />
          {mode === 'detalle' && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar size={50} label={initials} tint={TINT[x.cat]} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T w={600} style={{ fontSize: 18, letterSpacing: -0.18 }}>{b.client}</T>
                  <T style={{ fontSize: 13, color: C.muted }} numberOfLines={1}>{b.phone} · {b.email}</T>
                </View>
              </View>
              <View style={s.card}>
                <View style={s.row}>
                  <View style={{ gap: 3, flex: 1 }}><T w={500} style={{ fontSize: 15 }}>{x.name}</T><T style={s.sub}>{durL(x.dur)}</T></View>
                  <T w={600} style={{ fontSize: 15 }}>{money(x.price)}</T>
                </View>
                <View style={s.row}>
                  <View style={s.half}><T style={s.lbl}>Fecha</T><T w={500} style={{ fontSize: 14 }}>{longDate(b.date)}</T></View>
                  <View style={s.half}><T style={s.lbl}>Hora</T><T w={500} style={{ fontSize: 14 }}>{hm(b.start)} – {hm(b.start + b.dur)}</T></View>
                </View>
              </View>
              <Pressable style={s.primary} onPress={() => Linking.openURL(waLink(b.phone))} accessibilityRole="button">
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.whatsappLight }} />
                <T w={500} style={s.primaryText}>Escribirle por WhatsApp</T>
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable style={s.outline} onPress={toReprog} accessibilityRole="button"><T style={{ fontSize: 15 }}>Reprogramar</T></Pressable>
                <Pressable style={[s.outline, { borderColor: 'rgba(178,54,92,.25)' }]} onPress={() => setMode('cancelar')} accessibilityRole="button">
                  <T style={{ fontSize: 15, color: C.danger }}>Cancelar turno</T>
                </Pressable>
              </View>
            </>
          )}
          {mode === 'cancelar' && (
            <>
              <T w={600} style={{ fontSize: 22, letterSpacing: -0.44, marginTop: 4 }}>¿Cancelar el turno de {first}?</T>
              <T style={{ fontSize: 14.5, lineHeight: 21, color: C.body }}>
                {x.name}, {longDate(b.date).toLowerCase()} a las {hm(b.start)}. Le enviamos un email automático avisándole. El horario queda libre para otras clientas.
              </T>
              <Pressable style={[s.primary, { backgroundColor: C.danger, marginTop: 4 }]} onPress={() => { store.cancel(b.id); onCancelled(b); }} accessibilityRole="button">
                <T w={500} style={s.primaryText}>Sí, cancelar turno</T>
              </Pressable>
              <Pressable style={s.ghost} onPress={() => setMode('detalle')} accessibilityRole="button"><T style={{ fontSize: 15 }}>Volver</T></Pressable>
            </>
          )}
          {mode === 'reprogramar' && (
            <Reprogramar booking={b} today={today} rDate={rDate} rStart={rStart}
              setDate={k => { setRDate(k); setRStart(null); }} setStart={setRStart}
              save={() => { if (rStart != null && store.reschedule(b.id, rDate, rStart)) onMoved(b, rDate, rStart); }}
              back={() => setMode('detalle')} />
          )}
        </ScrollView>
      </Animated.View>
  );
}

interface ReprogProps {
  booking: Booking; today: string; rDate: string; rStart: number | null;
  setDate: (k: string) => void; setStart: (t: number) => void; save: () => void; back: () => void;
}

function Reprogramar({ booking: b, today, rDate, rStart, setDate, setStart, save, back }: ReprogProps) {
  const bookings = useBookings();
  const { width } = useWindowDimensions();
  const slotW = (width - 40 - 24) / 4;
  const x = SV[b.serviceId], first = b.client.split(' ')[0];
  // Solo horarios libres; el propio turno no cuenta como ocupado.
  const free = slotsFor(bookings, rDate, b.dur, { overbook: store.opts.overbooking, exclude: b.id }).filter(t => t.st === 'free');

  return (
    <>
      <View style={{ gap: 3, marginTop: 2 }}>
        <T w={600} style={{ fontSize: 20, letterSpacing: -0.4 }}>Reprogramar a {first}</T>
        <T style={s.sub}>{x.name} · {durL(x.dur)} · ahora {shortDate(b.date)} {hm(b.start)}</T>
      </View>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {[...Array(7)].map((_, i) => {
          const k = addDays(today, i), d = parse(k), on = k === rDate;
          return (
            <Pressable key={k} onPress={() => setDate(k)} style={[s.day, { backgroundColor: on ? C.ink : '#fff' }]} accessibilityRole="button" accessibilityState={{ selected: on }}>
              <T style={{ fontSize: 11, color: on ? 'rgba(255,255,255,.6)' : C.muted }}>{DS[d.getDay()]}</T>
              <T w={500} style={{ fontSize: 16, color: on ? '#fff' : C.ink }}>{d.getDate()}</T>
            </Pressable>
          );
        })}
      </View>
      {free.length === 0 && (
        <View style={{ padding: 18, borderRadius: 18, backgroundColor: '#fff' }}>
          <T style={{ fontSize: 14, color: C.muted2, textAlign: 'center' }}>{hoursOf(rDate) ? 'No hay horarios libres ese día.' : 'Los domingos no atendés.'}</T>
        </View>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {free.map(t => {
          const on = t.t === rStart;
          const inner = <T w={on ? 600 : 400} style={{ fontSize: 14.5 }}>{hm(t.t)}</T>;
          return (
            <Pressable key={t.t} onPress={() => setStart(t.t)} style={{ width: slotW }} accessibilityRole="button" accessibilityState={{ selected: on }}>
              {on ? <Grad style={[s.slot, { borderColor: C.selBorder }]}>{inner}</Grad> : <View style={[s.slot, { backgroundColor: '#fff' }]}>{inner}</View>}
            </Pressable>
          );
        })}
      </View>
      <Pressable style={[s.primary, { marginTop: 4, opacity: rStart != null ? 1 : 0.35 }]} onPress={save} disabled={rStart == null} accessibilityRole="button">
        <T w={500} style={s.primaryText}>Guardar cambio</T>
      </Pressable>
      <Pressable style={[s.ghost, { height: 44 }]} onPress={back} accessibilityRole="button"><T style={{ fontSize: 15 }}>Volver</T></Pressable>
    </>
  );
}

const s = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(29,20,30,.32)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88%', paddingTop: 12, paddingHorizontal: 20,
    borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: C.sheet,
  },
  grab: { alignSelf: 'center', width: 38, height: 5, borderRadius: 3, backgroundColor: 'rgba(29,26,33,.15)' },
  card: { padding: 16, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(29,26,33,.06)', gap: 12 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  half: { flex: 1, gap: 3 },
  sub: { fontSize: 13, color: C.muted },
  lbl: { fontSize: 12, color: C.muted },
  primary: { height: 54, borderRadius: 999, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: '#fff', fontSize: 15.5 },
  outline: { flex: 1, height: 50, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(29,26,33,.12)', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  ghost: { height: 50, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  day: { flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: 'center', gap: 2 },
  slot: { height: 44, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(29,26,33,.08)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
