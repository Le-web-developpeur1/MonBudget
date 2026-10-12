import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/theme/color';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false, // Cache la barre blanche
          contentStyle: { backgroundColor: COLORS.background }, // Applique ton bleu nuit universel
                    
          // animation: 'fade', // Option A : Un fondu super fluide et discret (Recommandé pour ton design sombre)
          
          // animation: 'none', // Option B : Coupe complètement l'animation (Changement instantané sans effet)
          
          animation: 'slide_from_right', // Option C : Glissement standard Android bien géré
          
          animationDuration: 200, // Rend la transition très rapide pour éviter l'effet de lourdeur
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="history" />
        <Stack.Screen name="add" />
      </Stack>
    </>
  );
}
