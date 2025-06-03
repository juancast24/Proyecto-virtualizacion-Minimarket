import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const BottomBarLayout = ({ children }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { authState } = useAuth();
  const userRole = authState?.role || authState?.user?.role || "";
  const isAdmin =
    userRole &&
    (userRole === "admin" ||
      userRole.toLowerCase() === "admin" ||
      userRole === "ADMIN");

  // No mostrar la barra para admin
  if (isAdmin) return <>{children}</>;

  // Detecta si es invitado
  const isGuest = !authState.authenticated;

  const goTo = (screen) => navigation.navigate(screen);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
        {/* Inicio */}
        <TouchableOpacity style={styles.tabItem} onPress={() => goTo("Home")}>
          <Ionicons name="home-outline" size={28} color="#4A90E2" />
          <Text style={styles.tabLabel}>Inicio</Text>
        </TouchableOpacity>
        {/* Carrito */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => goTo("CartScreen")}
        >
          <Ionicons name="cart-outline" size={28} color="#4A90E2" />
          <Text style={styles.tabLabel}>Carrito</Text>
        </TouchableOpacity>
        {/* Menú hamburguesa */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() =>
            isGuest
              ? goTo("Login")
              : goTo("AccountScreen")
          }
        >
          <Ionicons name="menu-outline" size={28} color="#4A90E2" />
          <Text style={styles.tabLabel}>Menú</Text>
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
  },
  tabLabel: {
    fontSize: 12,
    color: "#4A90E2",
    marginTop: 2,
  },
});

export default BottomBarLayout;