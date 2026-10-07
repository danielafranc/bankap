import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

interface Props {
  stripeColor: string;
  baseColor?: string;
  /** Width of each stripe. */
  stripeWidth: number;
  /** Distance from one stripe to the next. */
  period: number;
}

/** Diagonal stripes (↗) filling the parent. Used for photo placeholders and unavailable states. */
export function StripedFill({ stripeColor, baseColor, stripeWidth, period }: Props) {
  const id = 'p' + useId().replace(/\W/g, '');
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id={id} patternUnits="userSpaceOnUse" width={period} height={period} patternTransform="rotate(45)">
          <Line x1={stripeWidth / 2} y1={0} x2={stripeWidth / 2} y2={period} stroke={stripeColor} strokeWidth={stripeWidth} />
        </Pattern>
      </Defs>
      {baseColor && <Rect width="100%" height="100%" fill={baseColor} />}
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
