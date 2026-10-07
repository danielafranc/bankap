import { Image, StyleSheet, View } from 'react-native';
import type { Provider } from '../../logic/types';
import { AppText } from '../components/AppText';
import { StripedFill } from '../components/StripedFill';
import { colors } from '../../../global-styles/colors';
import { radius } from '../theme';

// The photo placeholder's stripes (--marca at 10% / 4%) aren't in the palette yet.
const PLACEHOLDER_STRIPE = 'rgba(123,79,163,0.10)';
const PLACEHOLDER_BASE = 'rgba(123,79,163,0.04)';

export function ProviderHeader({ provider }: { provider: Provider }) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <View style={styles.titles}>
          <AppText weight="semibold" style={styles.name} accessibilityRole="header">{provider.name}</AppText>
          <AppText style={styles.tagline}>{provider.tagline}</AppText>
        </View>
        <View style={styles.facts}>
          <Fact dotColor={colors.marcaLila} text={provider.area} />
          <Fact dotColor={colors.marcaDurazno} text={provider.hoursLabel} />
        </View>
      </View>

      <View style={styles.photo}>
        {provider.photoUrl ? (
          <Image source={{ uri: provider.photoUrl }} style={StyleSheet.absoluteFill} accessibilityLabel={`Foto de ${provider.name}`} />
        ) : (
          <>
            <StripedFill stripeColor={PLACEHOLDER_STRIPE} baseColor={PLACEHOLDER_BASE} stripeWidth={8} period={16} />
            <AppText style={styles.photoLabel}>foto de perfil</AppText>
          </>
        )}
      </View>
    </View>
  );
}

function Fact({ dotColor, text }: { dotColor: string; text: string }) {
  return (
    <View style={styles.fact}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <AppText style={styles.factText}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  info: { flex: 1, gap: 10, paddingBottom: 6 },
  titles: { gap: 4 },
  name: { fontSize: 26, lineHeight: 27, letterSpacing: -0.78 },
  tagline: { fontSize: 14, color: colors.textoSuave },
  facts: { gap: 6 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  factText: { flexShrink: 1, fontSize: 12.5, color: colors.textoSecundario },
  photo: {
    width: 168,
    height: 212,
    borderRadius: radius.photo,
    borderWidth: 1,
    borderColor: colors.superficieFuerte,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 14,
  },
  photoLabel: { fontSize: 10.5, color: colors.textoSuave },
});
