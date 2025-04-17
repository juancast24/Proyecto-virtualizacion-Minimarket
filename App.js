import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import PublicNavigator from './navigation/PublicNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <PublicNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
