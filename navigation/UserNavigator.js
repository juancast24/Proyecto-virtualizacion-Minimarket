import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboard from '../screens/user/UserDashboard';
import AccountScreen from '../screens/user/AccountScreen';
import OrdersScreen from '../screens/user/OrdersScreen';
import ProductsScreen from '../screens/user/ProductsScreen';
import CartScreen from '../screens/public/CartScreen';
import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import HomeScreen from '../screens/public/HomeScreen';
import OrderHistory from '../screens/user/OrderHistory';
import SuccessScreen from '../screens/public/SuccessScreen';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="OrderScreen" component={OrdersScreen} />
      <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
      <Stack.Screen name ="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="FormPay" component={FormPay} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
