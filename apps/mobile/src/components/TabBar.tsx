import { C } from '@bankap/core';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../ui';

const TABS = ['Agenda', 'Servicios', 'Horarios', 'Perfil'];

/** Solo "Agenda" está implementada; el resto avisa con un toast, como en el diseño. */
export function TabBar({ onSoon }: { onSoon: (label: string) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { height: 62 + Math.max(insets.bottom, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
      {TABS.map((l, i) => {
        const active = i === 0, color = active ? C.ink : C.muted;
        return (
          <Pressable key={l} style={s.tab} onPress={() => !active && onSoon(l)} accessibilityRole="tab" accessibilityState={{ selected: active }}>
            <View style={{ width: 22, height: 22, borderRadius: 7, borderWidth: 1.8, borderColor: color, backgroundColor: active ? C.ink : 'transparent' }} />
            <T w={500} style={{ fontSize: 11, color }}>{l}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 12, flexDirection: 'row', paddingTop: 10, paddingHorizontal: 8,
    backgroundColor: 'rgba(252,248,250,.94)', borderTopWidth: 1, borderTopColor: 'rgba(29,26,33,.06)',
  },
  tab: { flex: 1, alignItems: 'center', gap: 5 },
});
