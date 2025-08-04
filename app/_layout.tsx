import { Stack } from "expo-router";
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import './globals.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View className="flex-1 justify-center items-center">
              <Text>Loading...</Text>
            </View>
          }
          persistor={persistor}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
