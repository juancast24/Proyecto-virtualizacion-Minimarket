import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminTabNavigator from "./AdminTabNavigator";
import CreateProduct from "../screens/admin/CreateProduct";
import EditProductScreen from "../screens/admin/EditProductScreen";
import CreateUserScreen from "../screens/admin/CreateUserScreen";
import EditUserScreen from "../screens/admin/EditUserScreen";
import ChangePasswordScreen from "../screens/admin/ChangePasswordScreen";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='AdminDashboard'>
      <Stack.Screen name="Tabs" component={AdminTabNavigator} />
      <Stack.Screen name="CreateProduct" component={CreateProduct} />
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