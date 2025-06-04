import 'react-native-gesture-handler';
import { useAuth } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PedidosProvider } from './context/PedidosContext';
import PublicNavigator from './navigation/PublicNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import UserNavigator from './navigation/UserNavigator';
import FlashMessage from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaProvider } from 'react-native-safe-area-context';



// Componente interno que utiliza el contexto de autenticación
const AppInner = () => {
  const { authState } = useAuth(); 
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      {authState.authenticated ? (
        authState.role === 'admin' ? (
          <AdminNavigator />
        ) : (
          <UserNavigator />
        )
      ) : (
        <PublicNavigator />
      )}
      <FlashMessage position="top" statusBarHeight={insets.top} />
    </NavigationContainer>
  );
};

// Componente principal de la aplicación
export default function App() {
  return (
    <SafeAreaProvider>
 
    <AuthProvider>
      {/* Proveedor de carrito envuelve la navegación y provee el contexto del carrito */}
      <CartProvider>
        <PedidosProvider>
          <AppInner />
          
        </PedidosProvider>
      </CartProvider>
    </AuthProvider>
    </SafeAreaProvider>
  );
}
