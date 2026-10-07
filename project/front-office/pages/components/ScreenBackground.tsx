import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors, degradados } from '../../../global-styles/colors';

/** `--fondo-degradado`: soft lila/durazno background shared by every client screen. */
export function ScreenBackground() {
  const [top, middle, bottom] = degradados.fondo;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        {/* Base at 170°: almost vertical, slightly tilted to the right. */}
        <LinearGradient id="bgBase" x1={0.41} y1={0} x2={0.59} y2={1}>
          <Stop offset={0} stopColor={top} />
          <Stop offset={0.5} stopColor={middle} />
          <Stop offset={1} stopColor={bottom} />
        </LinearGradient>
        {/* Glows fade from the variable's color to transparent at 70%. */}
        <RadialGradient id="bgDurazno" cx="85%" cy="8%" r={360} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={colors.fondoBrilloDurazno} />
          <Stop offset={0.7} stopColor={colors.fondoBrilloDurazno} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="bgLila" cx="0%" cy="40%" r={400} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={colors.fondoBrilloLila} />
          <Stop offset={0.7} stopColor={colors.fondoBrilloLila} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#bgBase)" />
      <Rect width="100%" height="100%" fill="url(#bgLila)" />
      <Rect width="100%" height="100%" fill="url(#bgDurazno)" />
    </Svg>
  );
}
