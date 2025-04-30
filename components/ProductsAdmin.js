import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { products } from "../data/products";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";

const ProductsAdmin = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda

  // Filtrar los datos según el texto de búsqueda
  const filteredData = products.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (productName) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el producto "${productName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteProduct(productName); // Llama a la función para eliminar el producto
            Alert.alert(
              "Éxito",
              `El producto "${productName}" ha sido eliminado.`
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.search}>
          <Ionicons
            name="search"
            size={24}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre del producto"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.tabla}>
          {/* Encabezado */}
          <View style={[styles.fila, styles.encabezado]}>
            <Text style={styles.columna}>Producto</Text>
            <Text style={styles.columna}>Categoria</Text>
            <Text style={styles.columna}>Precio</Text>
            <Text style={styles.columna}>Descripcion</Text>
            <Text style={styles.columna}>Stock</Text>
            <Text style={styles.columna}>Imagen</Text>
            <Text style={styles.columna}>Aciones</Text>
          </View>

          {/* Filas de datos */}
          {filteredData.map((item, index) => (
            <View key={index} style={styles.fila}>
              <Text style={styles.columna}>{item.name}</Text>
              <Text style={styles.columna}>{item.category}</Text>
              <Text style={styles.columna}>{item.price}</Text>
              <Text style={styles.columna}>{item.description}</Text>
              <Text style={styles.columna}>{item.stock}</Text>
              <View style={styles.columna}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View style={styles.columna}>
                <Pressable onPress={() => handleEdit(item.name)}>
                  <Feather name="edit" size={24} color="#2980b9" />
                </Pressable>
                <Pressable onPress={() => handleDelete(item.name)}>
                  <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  searchContainer: {
  paddingBottom: 10,
  },
  search: {
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
  tabla: {
    borderColor: "transparent",
  },
  fila: {
    flexDirection: "row",
    padding: 10,
    borderColor: "trnsparent",
    borderRadius: 8,
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  encabezado: {
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#2980b9",
  },
  columna: {
    flex: 1,
    fontSize: 10,
    textAlign: "center",
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 8,
  },
});

export default ProductsAdmin;
