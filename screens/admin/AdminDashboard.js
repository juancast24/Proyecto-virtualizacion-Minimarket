import {
  View,
  Text,
  Pressable,
  StyleSheet,
  BackHandler,
  TextInput,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import ProductsAdmin from "../../components/ProductsAdmin";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomBarLayout from "../../components/BottomBarLayout";
import { StatusBar } from "react-native";

const AdminDashboard = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda

  const { filteredData } = ProductsAdmin;

  const handleCreateProductPress = () => {
    navigation.navigate("CreateProduct"); // Navegar a la pantalla de creación de productos.
  };

  return (
    <>
      <StatusBar backgroundColor="#F6FDFF" barStyle="dark-content" />
      <BottomBarLayout>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Productos</Text>
            <ProductsAdmin />
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.button}
                onPress={handleCreateProductPress}
              >
                <Text style={styles.buttonText}>Crear Producto</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => navigation.navigate("RankingProductos")}
              >
                <Text style={styles.buttonText}> Ventas de Productos</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </BottomBarLayout>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F6FDFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContainer: {
    marginTop: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 0,
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 30,
    marginVertical: 1,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 1,
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
