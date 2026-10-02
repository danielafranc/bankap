import { C } from '@bankap/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { T } from '../ui';

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const say = useCallback((m: string) => {
    clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(null), 3000);
  }, []);
  return [msg, say] as const;
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <View style={s.wrap} pointerEvents="none" accessibilityLiveRegion="polite">
      <View style={s.toast}><T style={{ color: '#fff', fontSize: 13.5, lineHeight: 19, textAlign: 'center' }}>{msg}</T></View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, bottom: 110, zIndex: 80, alignItems: 'center' },
  toast: {
    paddingVertical: 12, paddingHorizontal: 18, borderRadius: 18, backgroundColor: C.ink,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
});
