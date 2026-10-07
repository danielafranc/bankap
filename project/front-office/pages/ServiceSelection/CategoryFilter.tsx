import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { AppText } from '../components/AppText';
import { colors } from '../../../global-styles/colors';
import { radius, spacing } from '../theme';

interface Props {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, active, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityRole="tablist"
    >
      {categories.map(category => {
        const isActive = category === active;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <AppText style={[styles.label, isActive && styles.labelActive]}>{category}</AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Bleeds to the screen edges so chips scroll under the side padding.
  scroll: { marginHorizontal: -spacing.screenX, marginTop: 12, flexGrow: 0 },
  content: { paddingHorizontal: spacing.screenX, gap: 8 },
  chip: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.superficieBorde,
    backgroundColor: colors.superficie,
  },
  chipActive: { backgroundColor: colors.textoPrincipal },
  label: { fontSize: 14 },
  labelActive: { color: colors.textoInvertido },
});
