import { C, DL, DS, MS, PROVIDER, addDays, cap, hm, hoursOf, mondayOf, parse, shortDate, type Booking } from '@bankap/core';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { BookingSheet } from '../components/BookingSheet';
import { DayView } from '../components/DayView';
import { TabBar } from '../components/TabBar';
import { Toast, useToast } from '../components/Toast';
import { WeekView } from '../components/WeekView';
import { useBookings, useNow } from '../data';
import { Avatar, ScreenBackground, T } from '../ui';

const Arrow = ({ d }: { d: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><Path d={d} /></Svg>
);

export default function Agenda() {
  const insets = useSafeAreaInsets();
  const now = useNow();
  const bookings = useBookings();
  const [view, setView] = useState<'dia' | 'semana'>('dia');
  const [date, setDate] = useState(now.today);
  const [week, setWeek] = useState(mondayOf(now.today));
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [toast, say] = useToast();

  const byDay = (k: string) => bookings.filter(b => b.date === k).sort((a, b) => a.start - b.start);
  const open = (b: Booking) => { setSheetId(b.id); setHighlight(null); };
  const shift = (n: number) => { setWeek(addDays(week, n)); setDate(addDays(date, n)); };

  const d = parse(date), ws = parse(week), we = parse(addDays(week, 5));
  const title = view === 'dia' ? `${cap(DL[d.getDay()])} ${d.getDate()}` : 'Semana';
  const sub = view === 'dia'
    ? (date === now.today ? `Hoy · ${MS[d.getMonth()]} ${d.getFullYear()}` : `${cap(MS[d.getMonth()])} ${d.getFullYear()}`)
    : `${ws.getDate()} ${MS[ws.getMonth()].slice(0, 3)} – ${we.getDate()} ${MS[we.getMonth()].slice(0, 3)}`;

  const todays = byDay(date), h = hoursOf(date);
  const hours = todays.reduce((a, b) => a + b.dur, 0) / 60;
  const summary = todays.length
    ? `${todays.length} ${todays.length === 1 ? 'turno' : 'turnos'} · ${String(hours).replace('.', ',')} h reservadas`
    : h ? 'Sin turnos este día' : 'Cerrado';

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 120 + insets.bottom }}>
        <View style={s.header}>
          <View style={{ gap: 2 }}>
            <T style={s.muted13}>Hola, {PROVIDER.first}</T>
            <T w={500} style={s.title}>{title}</T>
            <T style={s.muted13}>{sub}</T>
          </View>
          <Avatar size={46} label={PROVIDER.initials} border />
        </View>

        <View style={s.controls}>
          <View style={s.seg}>
            {(['dia', 'semana'] as const).map(v => (
              <Pressable key={v} onPress={() => setView(v)} style={[s.segBtn, view === v && { backgroundColor: C.ink }]} accessibilityRole="button" accessibilityState={{ selected: view === v }}>
                <T w={500} style={{ fontSize: 13, color: view === v ? '#fff' : C.ink }}>{v === 'dia' ? 'Día' : 'Semana'}</T>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable onPress={() => { setDate(now.today); setWeek(mondayOf(now.today)); }} style={s.todayBtn} accessibilityRole="button">
              <T style={{ fontSize: 13 }}>Hoy</T>
            </Pressable>
            <Pressable onPress={() => shift(-7)} style={s.round} accessibilityRole="button" accessibilityLabel="Semana anterior"><Arrow d="M15 6l-6 6 6 6" /></Pressable>
            <Pressable onPress={() => shift(7)} style={s.round} accessibilityRole="button" accessibilityLabel="Semana siguiente"><Arrow d="M9 6l6 6-6 6" /></Pressable>
          </View>
        </View>

        {view === 'dia' ? (
          <>
            <View style={s.strip}>
              {[...Array(7)].map((_, i) => {
                const k = addDays(week, i), dd = parse(k), on = k === date, n = byDay(k).length;
                const bg = on ? C.ink : k === now.today ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.6)';
                const subC = on ? 'rgba(255,255,255,.6)' : C.muted;
                return (
                  <Pressable key={k} onPress={() => setDate(k)} style={[s.stripBtn, { backgroundColor: bg }]} accessibilityRole="button" accessibilityState={{ selected: on }}>
                    <T style={{ fontSize: 11.5, color: subC }}>{DS[dd.getDay()]}</T>
                    <T w={500} style={{ fontSize: 17, color: on ? '#fff' : C.ink }}>{dd.getDate()}</T>
                    <T style={{ fontSize: 10, height: 12, lineHeight: 12, color: subC }}>{n ? n : ''}</T>
                  </Pressable>
                );
              })}
            </View>
            <View style={s.summary}>
              <T style={{ fontSize: 13, color: C.muted2 }}>{summary}</T>
              <T style={{ fontSize: 13, color: C.muted }}>{h ? `${hm(h.open)} – ${hm(h.close)}` : ''}</T>
            </View>
            <DayView date={date} bookings={todays} now={now} highlight={highlight} onOpen={open} />
          </>
        ) : (
          <WeekView monday={week} today={now.today} bookings={bookings} highlight={highlight} onOpen={open}
            onPickDay={k => { setView('dia'); setDate(k); }} />
        )}
      </ScrollView>

      <TabBar onSoon={l => say(`"${l}" todavía no está disponible.`)} />
      <Toast msg={toast} />

      <BookingSheet
        booking={bookings.find(b => b.id === sheetId) ?? null}
        today={now.today}
        onClose={() => setSheetId(null)}
        onCancelled={b => { setSheetId(null); say(`Turno cancelado. Le enviamos un email a ${b.client.split(' ')[0]}.`); }}
        onMoved={(b, k, t) => {
          setSheetId(null); setDate(k); setWeek(mondayOf(k)); setHighlight(b.id);
          say(`Turno movido al ${shortDate(k)} a las ${hm(t)}. ${b.client.split(' ')[0]} recibe un email.`);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muted13: { fontSize: 13, color: C.muted },
  title: { fontSize: 30, lineHeight: 33, letterSpacing: -1.05 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, gap: 10 },
  seg: { flexDirection: 'row', gap: 3, padding: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.6)' },
  segBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999 },
  todayBtn: { height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.7)', justifyContent: 'center' },
  round: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.7)', alignItems: 'center', justifyContent: 'center' },
  strip: { flexDirection: 'row', gap: 5, marginTop: 14 },
  stripBtn: { flex: 1, paddingTop: 9, paddingBottom: 8, borderRadius: 999, alignItems: 'center', gap: 2 },
  summary: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
