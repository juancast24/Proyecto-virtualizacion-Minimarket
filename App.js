// App.js
import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import PublicNavigator from './navigation/PublicNavigator';

// Componente interno que utiliza el contexto de autenticación
const AppInner = () => {
  // Obtiene el estado de autenticación (incluye el rol del usuario)
  const { authState } = useContext(AuthContext);

  return (
    // Contenedor de navegación principal de React Navigation
    <NavigationContainer>
      {/* Navigator público, recibe el rol para redirigir según el tipo de usuario */}
      <PublicNavigator role={authState?.role} />
    </NavigationContainer>
  );
};

// Componente principal de la aplicación
export default function App() {
  return (
    // Proveedor de autenticación envuelve toda la app
    <AuthProvider>
      {/* Proveedor de carrito envuelve la navegación y provee el contexto del carrito */}
      <CartProvider>
        {/* Componente que maneja la navegación y el acceso al contexto de autenticación */}
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
