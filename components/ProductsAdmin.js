import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { getFirestore, collection, getDocs, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { firebaseApp } from "../firebase.config";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

// Componente principal para la administración de productos
const ProductsAdmin = () => {
  const navigation = useNavigation(); // Hook para navegación entre pantallas
  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación
  const [itemsPerPage, setItemsPerPage] = useState(3); // Cantidad de productos por página
  const [products, setProducts] = useState([]); // Lista de productos obtenidos de Firestore
  const [loading, setLoading] = useState(true); // Estado de carga

  // Obtener productos de Firestore al montar el componente
  useEffect(() => {
  setLoading(true);
  const unsubscribe = onSnapshot(collection(db, "products"), (querySnapshot) => {
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push({ id: doc.id, ...doc.data() });
    });
    setProducts(productsArray);
    setLoading(false);
  }, (error) => {
    console.error("Error al obtener productos:", error);
    setLoading(false);
  });

  // Limpia el listener al desmontar
  return () => unsubscribe();
}, []);

  // Filtrar los productos según el texto de búsqueda
  const filteredData = products.filter((product) => {
    const query = searchText.toLowerCase().trim();
    return Object.values(product).some((value) =>
      String(value).toLowerCase().includes(query)
    );
  });

  // Calcular el total de páginas basado en los productos filtrados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Resetear a la primera página cuando cambie el texto de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Obtener los productos de la página actual
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Eliminar un producto de Firestore y del estado local
  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el producto.");
      console.error(error);
    }
  };

  // Mostrar alerta de confirmación antes de eliminar un producto
  const handleDelete = (productId, productName) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el producto "${productName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteProduct(productId);
            Alert.alert(
              "Éxito",
              `El producto "${productName}" ha sido eliminado.`
            );
          },
        },
      ]
    );
  };

  // Navegar a la pantalla de edición de producto
  const handleEdit = (productId) => {
    navigation.navigate("EditProductScreen", { productId });
  };

  // Cambiar de página en la paginación
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
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
      {/* Indicador de carga mientras se obtienen los productos */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView>
          <View style={styles.tabla}>
            {/* Encabezado de la tabla */}
            <View style={[styles.fila, styles.encabezado]}>
              <Text style={[styles.columna, styles.columnaHeader]}>
                Producto
              </Text>
              <Text style={[styles.columna, styles.columnaHeader]}>
                Categoria
              </Text>
              <Text style={[styles.columna, styles.columnaHeader]}>
                Descripción
              </Text>
              <Text style={[styles.columna, styles.columnaHeader]}>Precio</Text>
              <Text style={[styles.columna, styles.columnaHeader]}>Stock</Text>
              <Text style={[styles.columna, styles.columnaHeader]}>Imagen</Text>
              <Text style={[styles.columna, styles.columnaHeader]}>
                Acciones
              </Text>
            </View>

            {/* Filas de productos paginados */}
            {getCurrentItems().map((item, index) => (
              <View key={item.id} style={styles.fila}>
                <Text style={styles.columna}>{item.name}</Text>
                <Text style={styles.columna}>{item.category}</Text>
                <Text style={styles.columna}>{item.description}</Text>
                <Text style={styles.columna}>{item.price}</Text>
                <Text style={styles.columna}>{item.stock}</Text>
                <View style={styles.columna}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
                <View style={styles.columna}>
                  {/* Botón para editar producto */}
                  <Pressable
                    onPress={() =>
                      navigation.navigate("EditProductScreen", {
                        productId: item.id,
                      })
                    }
                  >
                    <Feather name="edit" size={24} color="#2980b9" />
                  </Pressable>
                  {/* Botón para eliminar producto */}
                  <Pressable onPress={() => handleDelete(item.id, item.name)}>
                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Controles de paginación */}
      <View style={styles.paginationContainer}>
        <View style={styles.paginationInfo}>
          <Text>
            {filteredData.length > 0
              ? `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                filteredData.length
              )} de ${filteredData.length} productos`
              : "No hay productos que coincidan con la búsqueda"}
          </Text>
        </View>
        <View style={styles.paginationControls}>
          {/* Botón para ir a la primera página */}
          <Pressable
            onPress={() => handlePageChange(1)}
            disabled={currentPage === 1}
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton,
            ]}
          >
            <Text style={styles.paginationText}>{"<<"}</Text>
          </Pressable>
          {/* Botón para ir a la página anterior */}
          <Pressable
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton,
            ]}
          >
            <Text style={styles.paginationText}>{"<"}</Text>
          </Pressable>

          {/* Información de la página actual */}
          <Text style={styles.pageInfo}>{`${currentPage} de ${totalPages || 1
            }`}</Text>

          {/* Botón para ir a la página siguiente */}
          <Pressable
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            style={[
              styles.paginationButton,
              (currentPage === totalPages || totalPages === 0) &&
              styles.disabledButton,
            ]}
          >
            <Text style={styles.paginationText}>{">"}</Text>
          </Pressable>
          {/* Botón para ir a la última página */}
          <Pressable
            onPress={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            style={[
              styles.paginationButton,
              (currentPage === totalPages || totalPages === 0) &&
              styles.disabledButton,
            ]}
          >
            <Text style={styles.paginationText}>{">>"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
    fontSize: 14,
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
    borderTopWidth: 2,
    borderTopColor: "#2980b9",
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
  columnaHeader: {
    fontWeight: "bold",
    fontSize: 7,
    color: "#2980b9",
  },
  paginationContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  paginationInfo: {
    alignItems: "center",
    marginBottom: 10,
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  paginationButton: {
    padding: 8,
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 40,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  paginationText: {
    color: "white",
    fontWeight: "bold",
  },
  pageInfo: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  itemsPerPageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  itemsPerPageButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 40,
    alignItems: "center",
  },
  selectedItemsPerPage: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  selectedItemsText: {
    color: "white",
  },
});

export default ProductsAdmin;
