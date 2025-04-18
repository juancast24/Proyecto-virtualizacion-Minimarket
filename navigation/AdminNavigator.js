import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import CreateProduct from '../screens/admin/CreateProduct';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    // stack navigator contiene las pantallas accesibles para el admin
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="CreateProduct" component={CreateProduct} /> 
    </Stack.Navigator>
  );
};

export default AdminNavigator;
