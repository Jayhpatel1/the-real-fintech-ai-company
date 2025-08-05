import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import { theme } from './src/theme';
import MainNavigator from './src/navigation/MainNavigator';
import { initializeFirebase } from './src/services/firebase';
import { LogBox } from 'react-native';

// Ignore specific warnings for demo
LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Setting a timer',
  'Remote debugger'
]);

export default function App() {
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <MainNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
