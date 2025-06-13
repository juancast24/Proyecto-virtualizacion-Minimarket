import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const TabButton = ({ label, icon, isActive, onPress, cartCount }) => (
  <TouchableOpacity
    style={[styles.tabItem, isActive && styles.tabItemActive]}
    onPress={onPress}
  >
    <View style={{ position: 'relative' }}>
      <Ionicons name={icon} size={28} color={isActive ? "#fff" : "#4A90E2"} />
      {icon === "cart-outline" && cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </View>
    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const BottomBarLayout = ({ children, disableInsets = false }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { authState } = useAuth();
  const { getCartTotal } = useCart();

  const userRole = authState?.role || authState?.user?.role || "";
  const isAdmin = userRole?.toLowerCase() === "admin";
  const isGuest = !authState?.authenticated;
  const isUser = !isGuest && !isAdmin;

  const goTo = (screen) => navigation.navigate(screen);
  const isActive = (screen) => route.name === screen;

  const tabsByRole = {
    admin: [
      { screen: "AdminDashboard", label: "Productos", icon: "pricetags-outline" },
      { screen: "UserManagement", label: "Usuarios", icon: "people-outline" },
      { screen: "OrdersScreen", label: "Pedidos", icon: "receipt-outline" },
      { screen: "AccountScreenAdmin", label: "Perfil", icon: "person-outline" },
    ],
    user: [
      { screen: "Home", label: "Inicio", icon: "home-outline" },
      { screen: "ProductsScreen", label: "Productos", icon: "pricetags-outline" },
      { screen: "OrderHistory", label: "Pedidos", icon: "receipt-outline" },
      { screen: "CartScreen", label: "Carrito", icon: "cart-outline" },
      { screen: "AccountScreen", label: "Perfil", icon: "person-outline" },
    ],
    guest: [
      { screen: "Home", label: "Inicio", icon: "home-outline" },
      { screen: "CartScreen", label: "Carrito", icon: "cart-outline" },
      { screen: "Login", label: "Ingresar", icon: "log-in-outline" },
    ],
  };

  const currentTabs = isAdmin
    ? tabsByRole.admin
    : isUser
      ? tabsByRole.user
      : tabsByRole.guest;

  return (
    <View style={{ flex: 1, paddingTop: disableInsets ? 0 : insets.top, backgroundColor: '#F6FDFF' }}>
      <View style={{ flex: 1 }}>{children}</View>
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {currentTabs.map(({ screen, label, icon }) => (
          <TabButton
            key={screen}
            screen={screen}
            label={label}
            icon={icon}
            isActive={isActive(screen)}
            onPress={() => goTo(screen)}
            cartCount={icon === "cart-outline" ? getCartTotal() : 0}
          />
        ))}
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BottomBarLayout;
