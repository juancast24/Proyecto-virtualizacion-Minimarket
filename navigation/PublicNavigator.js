import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import CartScreen from '../screens/user/CartScreen';
import OrdersScreen from '../screens/user/OrdersScreen';
import PaymentScreen from '../screens/user/PaymentScreen';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';

const Stack = createStackNavigator();

const PublicNavigator = () => {
  const { authState } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Rutas públicas */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* Rutas de usuario */}
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />

      {/* Rutas protegidas según rol */}
      {authState?.role === 'admin' && (
        <Stack.Screen name="AdminDashboard" component={AdminNavigator} />
      )}
      {authState?.role === 'user' && (
        <Stack.Screen name="UserDashboard" component={UserNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default PublicNavigator;
