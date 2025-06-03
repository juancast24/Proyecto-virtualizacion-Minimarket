import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import CartScreen from '../screens/public/CartScreen'; 
import SuccessScreen from '../screens/public/SuccessScreen';
import ReciboScreen from '../screens/public/ReciboScreen';
import OrdersScreen from '../screens/user/OrdersScreen';

const Stack = createStackNavigator();

// Navigator público que gestiona las rutas accesibles sin autenticación
const PublicNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="FormPay" component={FormPay} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="ReciboScreen" component={ReciboScreen} />
      <Stack.Screen name="OrderScreen" component={OrdersScreen} />
    </Stack.Navigator>
  );
};


export default PublicNavigator;
