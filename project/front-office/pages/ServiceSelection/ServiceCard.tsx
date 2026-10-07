import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { formatDuration, formatPrice } from '../../logic/formatters';
import type { Service } from '../../logic/types';
import { AppText } from '../components/AppText';
import { GradientFill, evenStops } from '../components/GradientFill';
import { colors, degradados } from '../../../global-styles/colors';
import { radius } from '../theme';

interface Props {
  service: Service;
  selected: boolean;
  onPress: () => void;
}

export function ServiceCard({ service, selected, onPress }: Props) {
  const duration = formatDuration(service.durationMinutes);
  const price = formatPrice(service.price);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${service.name}, ${duration}, ${price}`}
      style={[styles.card, selected && styles.cardSelected]}
    >
      {/* 120° gradient, approximated for a wide card. */}
      {selected && <GradientFill stops={evenStops(degradados.seleccion)} from={{ x: 0, y: 0.2 }} to={{ x: 1, y: 0.8 }} />}

      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected && (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.marca} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12.5l4.5 4.5L19 7.5" />
          </Svg>
        )}
      </View>

      <View style={styles.body}>
        <AppText weight="medium" style={styles.name}>{service.name}</AppText>
        <AppText style={styles.meta}>{duration} · {service.description}</AppText>
      </View>

      <AppText weight="semibold" style={styles.price}>{price}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.superficieBorde,
    backgroundColor: colors.superficie,
    overflow: 'hidden',
  },
  cardSelected: { borderColor: colors.seleccionBorde },
  check: {
    width: 26,
    height: 26,
    marginHorizontal: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.linea,
  },
  checkSelected: { backgroundColor: colors.superficie },
  body: { flex: 1, gap: 3 },
  name: { fontSize: 15 },
  meta: { fontSize: 12.5, color: colors.textoSuave },
  price: { fontSize: 15 },
});
