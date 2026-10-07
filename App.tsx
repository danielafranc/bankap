import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, useFonts } from '@expo-google-fonts/dm-sans';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ServiceSelectionPage } from './project/front-office/pages/ServiceSelection/ServiceSelectionPage';

export default function App() {
  const [fontsLoaded] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ServiceSelectionPage
        providerSlug="daniela"
        onContinue={() => {
          // Next step: the date & time screen (not built yet).
        }}
      />
    </SafeAreaProvider>
  );
}
