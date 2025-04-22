import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboard from '../screens/user/UserDashboard';
import AccountScreen from '../screens/user/AccountScreen';
import CartScreen from '../screens/user/CartScreen';  // Importar CartScreen
import OrdersScreen from '../screens/user/OrdersScreen';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />  {/* Asegúrate que esta pantalla esté registrada */}
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
