import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AdminDashboard from "../screens/admin/AdminDashboard";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import OrdersScreen from "../screens/admin/OrdersScreen";
import AccountScreenAdmin from "../screens/admin/AccountScreenAdmin";

const Tab = createMaterialTopTabNavigator();

const AdminTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="AdminDashboard"
    swipeEnabled={true}
    tabBar={() => null} // Oculta la barra, solo gestos
    screenOptions={{
      tabBarStyle: { height: 0 },
      tabBarIndicatorStyle: { height: 0 },
    }}
  >
    <Tab.Screen name="AdminDashboard" component={AdminDashboard} />
    <Tab.Screen name="UserManagement" component={UserManagementScreen} />
    <Tab.Screen name="OrdersScreen" component={OrdersScreen} />
    <Tab.Screen name="AccountScreenAdmin" component={AccountScreenAdmin} />
  </Tab.Navigator>
);

export default AdminTabNavigator;