import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PublicNavigator from './navigation/PublicNavigator';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <PublicNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
