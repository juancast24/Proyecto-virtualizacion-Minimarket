import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions, useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import RegisterScreen from '../screens/public/RegisterScreen';
import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import CartScreen from '../screens/public/CartScreen'; 
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';

const Stack = createStackNavigator();

// Navigator público que gestiona las rutas accesibles sin autenticación
const PublicNavigator = ({ role }) => {
  const navigation = useNavigation();

  // Redirige automáticamente al navigator correspondiente cuando el rol está definido
  useEffect(() => {
    if (role === 'admin') {
      // Si el usuario es admin, redirige al stack de administrador
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AdminRoot' }],
        })
      );
    } else if (role === 'user') {
      // Si el usuario es user, redirige al stack de usuario
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UserRoot' }],
        })
      );
    }
  }, [role]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Rutas públicas accesibles siempre */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="FormPay" component={FormPay} />

      {/* Rutas protegidas, disponibles según el rol */}
      {role === 'admin' && (
        <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      )}
      {role === 'user' && (
        <Stack.Screen name="UserRoot" component={UserNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default PublicNavigator;
