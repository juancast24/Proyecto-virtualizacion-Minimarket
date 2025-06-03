import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import CartScreen from '../screens/public/CartScreen';

const Tab = createMaterialTopTabNavigator();

const PublicTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBar={() => null} 
    screenOptions={{
      swipeEnabled: true,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="CartScreen" component={CartScreen}/>
    <Tab.Screen name="Login" component={LoginScreen}/>
  </Tab.Navigator>
);

export default PublicTabNavigator;