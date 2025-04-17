import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboard from '../screens/user/UserDashboard'; 

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
