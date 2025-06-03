import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '../screens/public/HomeScreen';
import ProductsScreen from '../screens/user/ProductsScreen';
import OrderHistory from '../screens/user/OrderHistory';
import CartScreen from '../screens/public/CartScreen';
import AccountScreen from '../screens/user/AccountScreen';

const Tab = createMaterialTopTabNavigator();

const UserTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    swipeEnabled={true}
    tabBar={() => null} 
    screenOptions={{
      tabBarStyle: { height: 0 },
      tabBarIndicatorStyle: { height: 0 },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="ProductsScreen" component={ProductsScreen} />
    <Tab.Screen name="OrderHistory" component={OrderHistory} />
    <Tab.Screen name="CartScreen" component={CartScreen} />
    <Tab.Screen name="AccountScreen" component={AccountScreen} />
  </Tab.Navigator>
);

export default UserTabNavigator;