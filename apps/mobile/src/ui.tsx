import { C } from '@bankap/core';
import { LinearGradient } from 'expo-linear-gradient';
import { useId, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextProps, type ViewStyle } from 'react-native';
import Svg, { Defs, Line, LinearGradient as SvgLinear, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

const FAMILY = { 400: 'DMSans_400Regular', 500: 'DMSans_500Medium', 600: 'DMSans_600SemiBold', 700: 'DMSans_700Bold' } as const;

/** Texto con DM Sans en el peso pedido (RN no sintetiza pesos de fuentes cargadas). */
export function T({ w = 400, mono, style, ...p }: TextProps & { w?: keyof typeof FAMILY; mono?: boolean }) {
  return <Text {...p} style={[{ fontFamily: mono ? 'DMMono_400Regular' : FAMILY[w], color: C.ink }, style]} />;
}

/** Fondo de pantalla: degradado a 170° más una mancha durazno arriba a la derecha y una lila a la izquierda. */
export function ScreenBackground() {
  return (
    <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
      <Defs>
        <SvgLinear id="base" x1="0.41" y1="0" x2="0.59" y2="1">
          <Stop offset="0" stopColor="#f1e9f6" />
          <Stop offset="0.5" stopColor="#f8eff2" />
          <Stop offset="1" stopColor="#fbefe8" />
        </SvgLinear>
        <RadialGradient id="peach" cx="85%" cy="8%" rx="420" ry="360" gradientUnits="userSpaceOnUse" fx="85%" fy="8%">
          <Stop offset="0" stopColor="#fbe2d6" stopOpacity={0.9} />
          <Stop offset="0.7" stopColor="#fbe2d6" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="lilac" cx="0%" cy="40%" rx="400" ry="400" gradientUnits="userSpaceOnUse" fx="0%" fy="40%">
          <Stop offset="0" stopColor="#e8dcf6" stopOpacity={0.95} />
          <Stop offset="0.7" stopColor="#e8dcf6" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#base)" />
      <Rect width="100%" height="100%" fill="url(#lilac)" />
      <Rect width="100%" height="100%" fill="url(#peach)" />
    </Svg>
  );
}

/**
 * Rayado diagonal a 135° (el `repeating-linear-gradient` del diseño).
 * `line` es el grosor de la raya y `period` la distancia entre rayas.
 */
export function Hatch({ color, line, period, base }: { color: string; line: number; period: number; base?: string }) {
  const id = 'h' + useId().replace(/\W/g, '');
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id={id} patternUnits="userSpaceOnUse" width={period} height={period} patternTransform="rotate(45)">
          <Line x1={line / 2} y1={0} x2={line / 2} y2={period} stroke={color} strokeWidth={line} />
        </Pattern>
      </Defs>
      {base && <Rect width="100%" height="100%" fill={base} />}
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/** Degradado de "elegido": lila → rosa → durazno, a 120°. */
export function Grad({ style, children }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  return (
    <LinearGradient colors={['#e9d6f4', '#f8dbe5', '#fbe4d6']} start={{ x: 0, y: 0.21 }} end={{ x: 1, y: 0.79 }} style={style}>
      {children}
    </LinearGradient>
  );
}

export const Avatar = ({ size, label, tint, border }: { size: number; label: string; tint?: string; border?: boolean }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: tint, borderWidth: border ? 2 : 0, borderColor: '#fff' }}>
    {!tint && <Hatch color="rgba(123,79,163,.14)" line={5} period={10} base="rgba(123,79,163,.05)" />}
    <T w={600} style={{ fontSize: size > 48 ? 15 : 12, color: tint ? C.ink2 : C.muted2 }}>{label}</T>
  </View>
);
