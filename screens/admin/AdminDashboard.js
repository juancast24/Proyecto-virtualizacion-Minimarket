import {
  View,
  Text,
  Pressable,
  StyleSheet,
  BackHandler,
  TextInput,  
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from "react";
import ProductsAdmin from "../../components/ProductsAdmin";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const AdminDashboard = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda

  const { filteredData } = ProductsAdmin;



  const handleCreateProductPress = () => {
    navigation.navigate("CreateProduct"); // Navegar a la pantalla de creación de productos.
  };

  const handleOrdersPress = () => {
    navigation.navigate("OrdersScreen"); // Navegar a la pantalla de pedidos.
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Productos</Text>

        <ProductsAdmin />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleCreateProductPress}>
            <Text style={styles.buttonText}>Crear Producto</Text>
          </Pressable>
        </View>
      </View>
    </Layout>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // Alineación horizontal
    justifyContent: "space-between", // Espaciado entre los botones
    marginHorizontal: 10, // Margen horizontal para el contenedor
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
    flex: 1, // Para que ambos botones tengan el mismo ancho
    marginHorizontal: 5, // Espaciado entre los botones
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    fontSize: 16,
    color: "#000",
  },
});

export default AdminDashboard;
