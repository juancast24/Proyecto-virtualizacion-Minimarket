import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboard from '../screens/user/UserDashboard';
import AccountScreen from '../screens/user/AccountScreen';
import OrdersScreen from '../screens/user/OrdersScreen';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="OrderScreen" component={OrdersScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
