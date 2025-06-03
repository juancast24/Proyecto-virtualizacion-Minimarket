import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const BottomBarLayout = ({ children }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { authState } = useAuth();
  const userRole = authState?.role || authState?.user?.role || "";
  const isAdmin =
    userRole &&
    (userRole === "admin" ||
      userRole.toLowerCase() === "admin" ||
      userRole === "ADMIN");
  const isGuest = !authState.authenticated;
  const isUser = !isGuest && !isAdmin;

  const goTo = (screen) => navigation.navigate(screen);

  // Helper para saber si la pestaña está activa
  const isActive = (screen) => route.name === screen;

  // Vista para admin
  if (isAdmin) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{children}</View>
        <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("AdminDashboard") && styles.tabItemActive,
            ]}
            onPress={() => goTo("AdminDashboard")}
          >
            <Ionicons
              name="pricetags-outline"
              size={28}
              color={isActive("AdminDashboard") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("AdminDashboard") && styles.tabLabelActive,
              ]}
            >
              Productos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("UserManagement") && styles.tabItemActive,
            ]}
            onPress={() => goTo("UserManagement")}
          >
            <Ionicons
              name="people-outline"
              size={28}
              color={isActive("UserManagement") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("UserManagement") && styles.tabLabelActive,
              ]}
            >
              Usuarios
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("OrdersScreen") && styles.tabItemActive,
            ]}
            onPress={() => goTo("OrdersScreen")}
          >
            <Ionicons
              name="receipt-outline"
              size={28}
              color={isActive("OrdersScreen") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("OrdersScreen") && styles.tabLabelActive,
              ]}
            >
              Pedidos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("AccountScreenAdmin") && styles.tabItemActive,
            ]}
            onPress={() => goTo("AccountScreenAdmin")}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color={isActive("AccountScreenAdmin") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("AccountScreenAdmin") && styles.tabLabelActive,
              ]}
            >
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Vista para usuario logeado
  if (isUser) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{children}</View>
        <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
          <TouchableOpacity
            style={[styles.tabItem, isActive("Home") && styles.tabItemActive]}
            onPress={() => goTo("Home")}
          >
            <Ionicons
              name="home-outline"
              size={28}
              color={isActive("Home") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("Home") && styles.tabLabelActive,
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("ProductsScreen") && styles.tabItemActive,
            ]}
            onPress={() => goTo("ProductsScreen")}
          >
            <Ionicons
              name="pricetags-outline"
              size={28}
              color={isActive("ProductsScreen") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("ProductsScreen") && styles.tabLabelActive,
              ]}
            >
              Productos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("OrderHistory") && styles.tabItemActive,
            ]}
            onPress={() => goTo("OrderHistory")}
          >
            <Ionicons
              name="receipt-outline"
              size={28}
              color={isActive("OrderHistory") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("OrderHistory") && styles.tabLabelActive,
              ]}
            >
              Pedidos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("CartScreen") && styles.tabItemActive,
            ]}
            onPress={() => goTo("CartScreen")}
          >
            <Ionicons
              name="cart-outline"
              size={28}
              color={isActive("CartScreen") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("CartScreen") && styles.tabLabelActive,
              ]}
            >
              Carrito
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              isActive("AccountScreen") && styles.tabItemActive,
            ]}
            onPress={() => goTo("AccountScreen")}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color={isActive("AccountScreen") ? "#fff" : "#4A90E2"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive("AccountScreen") && styles.tabLabelActive,
              ]}
            >
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Vista para invitado (no logeado)
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
        <TouchableOpacity
          style={[styles.tabItem, isActive("Home") && styles.tabItemActive]}
          onPress={() => goTo("Home")}
        >
          <Ionicons
            name="home-outline"
            size={28}
            color={isActive("Home") ? "#fff" : "#4A90E2"}
          />
          <Text
            style={[styles.tabLabel, isActive("Home") && styles.tabLabelActive]}
          >
            Inicio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            isActive("CartScreen") && styles.tabItemActive,
          ]}
          onPress={() => goTo("CartScreen")}
        >
          <Ionicons
            name="cart-outline"
            size={28}
            color={isActive("CartScreen") ? "#fff" : "#4A90E2"}
          />
          <Text
            style={[
              styles.tabLabel,
              isActive("CartScreen") && styles.tabLabelActive,
            ]}
          >
            Carrito
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, isActive("Login") && styles.tabItemActive]}
          onPress={() => goTo("Login")}
        >
          <Ionicons
            name="log-in-outline"
            size={28}
            color={isActive("Login") ? "#fff" : "#4A90E2"}
          />
          <Text
            style={[
              styles.tabLabel,
              isActive("Login") && styles.tabLabelActive,
            ]}
          >
            Ingresar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 4,
    minHeight: 64,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    borderRadius: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  tabItemActive: {
    backgroundColor: "#4A90E2",
  },
  tabLabel: {
    fontSize: 12,
    color: "#4A90E2",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BottomBarLayout;
