import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Service } from '../../logic/types';
import { useServiceSelection } from '../../logic/useServiceSelection';
import { AppText } from '../components/AppText';
import { BOTTOM_ACTION_BAR_SPACE, BottomActionBar } from '../components/BottomActionBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { colors } from '../../../global-styles/colors';
import { spacing } from '../theme';
import { CategoryFilter } from './CategoryFilter';
import { ProviderHeader } from './ProviderHeader';
import { ServiceCard } from './ServiceCard';

interface Props {
  providerSlug: string;
  onContinue: (service: Service) => void;
}

/** Step 1 of the booking flow: the client picks a service from the provider's page. */
export function ServiceSelectionPage({ providerSlug, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const state = useServiceSelection(providerSlug);

  if (state.status !== 'ready' || !state.provider) {
    return (
      <View style={styles.center}>
        <ScreenBackground />
        {state.status === 'error' ? (
          <>
            <AppText style={styles.errorText}>No pudimos cargar los servicios.</AppText>
            <Pressable onPress={state.retry} accessibilityRole="button" style={styles.retry}>
              <AppText weight="medium">Reintentar</AppText>
            </Pressable>
          </>
        ) : (
          <ActivityIndicator color={colors.textoPrincipal} />
        )}
      </View>
    );
  }

  const { provider, categories, activeCategory, selectCategory, visibleServices, selectedService, selectService } = state;

  return (
    <View style={styles.screen}>
      <ScreenBackground />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: BOTTOM_ACTION_BAR_SPACE + insets.bottom },
        ]}
      >
        <ProviderHeader provider={provider} />

        <AppText weight="semibold" style={styles.sectionTitle} accessibilityRole="header">Elegí un servicio</AppText>
        <CategoryFilter categories={categories} active={activeCategory} onSelect={selectCategory} />

        <View style={styles.list} accessibilityRole="radiogroup">
          {visibleServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={service.id === selectedService?.id}
              onPress={() => selectService(service.id)}
            />
          ))}
        </View>
      </ScrollView>

      <BottomActionBar>
        <PrimaryButton
          label="Elegir horario"
          disabled={!selectedService}
          onPress={() => selectedService && onContinue(selectedService)}
        />
      </BottomActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  content: { paddingHorizontal: spacing.screenX },
  sectionTitle: { marginTop: 26, fontSize: 16, letterSpacing: -0.16 },
  list: { marginTop: 14, gap: 10 },
  errorText: { fontSize: 14, color: colors.textoSecundario },
  retry: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: colors.superficie },
});
