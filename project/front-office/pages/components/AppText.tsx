import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors } from '../../../global-styles/colors';
import { fonts } from '../theme';

type Weight = keyof typeof fonts;

/** Text with DM Sans. Use `weight` instead of `fontWeight` so the right font file is used. */
export function AppText({ weight = 'regular', style, ...rest }: TextProps & { weight?: Weight }) {
  return <Text {...rest} style={[styles.base, { fontFamily: fonts[weight] }, style]} />;
}

const styles = StyleSheet.create({
  base: { color: colors.textoPrincipal },
});
