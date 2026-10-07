import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export interface GradientStop {
  offset: number;
  color: string;
  opacity?: number;
}

interface Props {
  stops: GradientStop[];
  /** Start and end points, from 0 to 1 relative to the parent's box. */
  from: { x: number; y: number };
  to: { x: number; y: number };
}

/** Fills its parent with a linear gradient. The parent needs `overflow: 'hidden'` to clip rounded corners. */
export function GradientFill({ stops, from, to }: Props) {
  const id = 'g' + useId().replace(/\W/g, '');
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
          {stops.map(s => (
            <Stop key={s.offset} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/** Spreads a list of colors evenly from 0 to 1. */
export const evenStops = (colorList: string[]): GradientStop[] =>
  colorList.map((color, i) => ({ offset: i / (colorList.length - 1), color }));
