import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { BottomTabNavigator } from './src/navigation';
import { AuthScreen } from './src/screens';
import { useStore } from './src/store';
import { COLORS } from './src/theme/colors';

// Configure reanimated
import 'react-native-reanimated';

export default function App() {
  const user = useStore((state: any) => state.user);
  
  // Initialize default user if none exists (for demo purposes)
  useEffect(() => {
    if (!user) {
      // You can uncomment this to auto-login as guest for development
      // useStore.setState({
      //   user: {
      //     id: 'demo',
      //     email: 'demo@example.com',
      //     name: 'Demo User',
      //     currency: 'INR',
      //     theme: 'dark',
      //     createdAt: new Date().toISOString(),
      //   },
      // });
    }
  }, [user]);
  
  if (!user) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <AuthScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: COLORS.primary[500],
              background: COLORS.dark[400],
              card: COLORS.dark[300],
              text: COLORS.text.primary,
              border: COLORS.dark[200],
              notification: COLORS.primary[500],
            },
          }}
        >
          <BottomTabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
  },
});
