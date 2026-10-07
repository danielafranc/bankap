import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../global-styles/colors';
import { spacing } from '../theme';
import { GradientFill } from './GradientFill';

/** Fixed bar at the bottom of the screen for the main action, fading into the content above it. */
export function BottomActionBar({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(34, insets.bottom + 12) }]}>
      <GradientFill
        from={{ x: 0, y: 0 }}
        to={{ x: 0, y: 1 }}
        stops={[
          { offset: 0, color: colors.fondo3, opacity: 0 },
          { offset: 0.45, color: colors.fondo3, opacity: 1 },
        ]}
      />
      {children}
    </View>
  );
}

/** Space the scroll content must leave at the bottom so the bar doesn't cover it. */
export const BOTTOM_ACTION_BAR_SPACE = 130;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 28,
    paddingHorizontal: spacing.screenX,
  },
});
