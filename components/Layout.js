import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Header from "./Header";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { auth, firebaseApp } from "../firebase.config";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.6;

const db = getFirestore(firebaseApp);

// Componente principal de Layout que envuelve la aplicación
const Layout = ({ children }) => {
  const navigation = useNavigation();
  const { authState, onLogout} = useAuth();
  // Obtiene el rol del usuario autenticado
  const userRole = authState?.role || authState?.user?.role || "";
  const [userData, setUserData] = useState(null);
  // Efecto para obtener datos adicionales del usuario desde Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (authState.user?.uid) {
        const userDoc = await getDoc(doc(db, "usuarios", authState.user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [authState.user]);

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Función para abrir el menú lateral
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Función para cerrar el menú lateral
  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };
  const handleLogout = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      onLogout();
    });
  };

  // Alterna la visibilidad del menú
  const handleMenuPress = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Navega a la pantalla de perfil según el rol
  const handleProfilePress = () => {
    const isAdmin =
      userRole &&
      (userRole === "admin" ||
        userRole.toLowerCase() === "admin" ||
        userRole === "ADMIN");

    if (isAdmin) {
      navigation.navigate("AccountScreenAdmin");
    } else if (userRole) {
      navigation.navigate("AccountScreen");
    } else {
      navigation.navigate("Login");
    }
  };

  // Navega a una pantalla y cierra el menú
  const navigateTo = (screenName, params = {}) => {
    closeMenu();
    navigation.navigate(screenName, params);
  };

  // Renderiza los elementos del menú según el estado de autenticación y rol
  const renderMenuItems = () => {
    const isAdmin =
      userRole &&
      (userRole === "admin" ||
        userRole.toLowerCase() === "admin" ||
        userRole === "ADMIN");

    if (!authState.authenticated) {
      // Opciones para usuarios no autenticados
      return (
        <>
          <MenuItem
            icon="home-outline"
            label="Inicio"
            onPress={() => navigateTo("Home")}
          />
          <MenuItem
            icon="cart-outline"
            label="Carrito"
            onPress={() => navigateTo("CartScreen")}
          />
          <MenuItem
            icon="log-in-outline"
            label="Iniciar Sesión"
            onPress={() => navigateTo("Login")}
          /> 
        </>
      );
    } else if (isAdmin) {
      // Opciones para administradores
      return (
        <>
          <MenuItem
            icon="grid-outline"
            label="Productos"
            onPress={() => navigateTo("AdminDashboard")}
          />
          <MenuItem
            icon="document-text-outline"
            label="Pedidos"
            onPress={() => navigateTo("OrdersScreen")}
          />
          <MenuItem
            icon="people-outline"
            label="Gestión de Usuarios"
            onPress={() => navigateTo("UserManagement")}
          />
          <MenuItem
            icon="person-circle-outline"
            label="Mi Cuenta"
            onPress={() => navigateTo("AccountScreenAdmin")}
          />
          <MenuItem
            icon="log-out-outline"
            label="Cerrar Sesión"
            onPress={() => {
              handleLogout();
            }}
          />
        </>
      );
    } else {
      // Opciones para usuarios autenticados
      return (
        <>
          <MenuItem
            icon="home-outline"
            label="Inicio"
            onPress={() => navigateTo("UserDashboard")}
          />
          <MenuItem
            icon="cart-outline"
            label="Productos"
            onPress={() => navigateTo("ProductsScreen")}
          />
          <MenuItem
            icon="basket-outline"
            label="Carrito"
            onPress={() => navigateTo("CartScreen")}
          />
          <MenuItem
            icon="list-outline"
            label="Mis Pedidos"
            onPress={() => navigateTo("OrderHistory")}
          />
          <MenuItem
            icon="person-circle-outline"
            label="Mi Cuenta"
            onPress={() => navigateTo("AccountScreen")}
          />
          <MenuItem
            icon="log-out-outline"
            label="Cerrar Sesión"
            onPress={() => {
              handleLogout();
            }}
          />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de estado */}
      <StatusBar style="dark"/>
      {/* Header con botones de menú y perfil */}
      <Header
        onMenuPress={handleMenuPress}
        onProfilePress={handleProfilePress}
      />
      {/* Contenido principal de la pantalla */}
      <View style={styles.content}>{children}</View>

      {/* Overlay para cerrar el menú al tocar fuera */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Menú lateral animado */}
      {menuVisible && (
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>La Economia</Text>
            <Image
              source={require("../assets/logo-market.png")} // Ajusta la ruta si tu logo está en otra carpeta
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.drawerSubtitle}>
              {/* Mensaje de bienvenida según autenticación y rol */}
              {!authState.authenticated
                ? "Bienvenido, Invitado"
                : userRole &&
                  (userRole === "admin" ||
                    userRole.toLowerCase() === "admin" ||
                    userRole === "ADMIN")
                  ? `Bienvenido, `
                  : `Bienvenido, `}
            </Text>
          </View>
          <View style={styles.drawerContent}>{renderMenuItems()}</View>
        </Animated.View>
      )}
    </View>
  );
};

// Componente para cada elemento del menú lateral
const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text style={styles.menuItemText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FDFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#F6FDFF",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "#FFF",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: "#7BB6E9",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  drawerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
  },
  drawerContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "left",
    marginVertical: 10,
    position: "absolute",
    top: 0,
    right: 15,
  },
});

export default Layout;
