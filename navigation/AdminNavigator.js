import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminDashboard from "../screens/admin/AdminDashboard";
import CreateProduct from "../screens/admin/CreateProduct";
import OrdersScreen from "../screens/admin/OrdersScreen";
import AccountScreenAdmin from "../screens/admin/AccountScreenAdmin";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import EditProductScreen from "../screens/admin/EditProductScreen";
import CreateUserScreen from "../screens/admin/CreateUserScreen";
import EditUserScreen from "../screens/admin/EditUserScreen";
import ChangePasswordScreen from "../screens/admin/ChangePasswordScreen";
import HomeScreen from "../screens/public/HomeScreen";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    // stack navigator contiene las pantallas accesibles para el admin
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='AdminDashboard'>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="CreateProduct" component={CreateProduct} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="AccountScreenAdmin" component={AccountScreenAdmin} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: "Cambiar contraseña" }} />
      <Stack.Screen

        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: "Crear Usuario" }}
      />
      <Stack.Screen
        name="EditUserScreen"
        component={EditUserScreen}
        options={{ title: "Editar Usuario" }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
