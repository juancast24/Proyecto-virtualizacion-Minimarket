// App.js
import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import PublicNavigator from './navigation/PublicNavigator';

const AppInner = () => {
  const { authState } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <PublicNavigator role={authState?.role} />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
