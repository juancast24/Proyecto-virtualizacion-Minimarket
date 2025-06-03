import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Obtener productos de Firestore al montar el componente
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (querySnapshot) => {
        const productsArray = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsArray);
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      }
    );

    // Limpia el listener al desmontar
    return () => unsubscribe();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  // Botón editar desde modal
  const handleEditFromModal = () => {
    setModalVisible(false);
    navigation.navigate("EditProductScreen", {
      productId: selectedProduct.id,
    });
  };
  // Botón eliminar desde modal
  const handleDeleteFromModal = () => {
    setModalVisible(false);
    handleDelete(selectedProduct.id, selectedProduct.name);
  };

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
        <Ionicons name="search" size={20} color="#4A90E2" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    </View>
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
              <Text style={[styles.columna, styles.columnaHeader]}>Precio</Text>
              <Text style={[styles.columna, styles.columnaHeader]}>Stock</Text>
              <Text style={[styles.columna, styles.columnaHeader]}>Imagen</Text>
              <Text style={[styles.columna, styles.columnaHeader]}>
                Acciones
              </Text>
            </View>

            {/* Filas de productos paginados */}
            {getCurrentItems().map((item) => (
              <View key={item.id} style={styles.fila}>
                <Text style={styles.columna}>{item.name}</Text>
                <Text style={styles.columna}>
                  {`$${Number(item.price).toLocaleString("es-CL", {
                    minimumFractionDigits: 0,
                  })}`}
                </Text>
                <Text style={styles.columna}>{item.stock}</Text>
                <View style={styles.columna}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 50, borderRadius: 6 }}
                  />
                </View>
                <View
                  style={[
                    styles.columna,
                    { flexDirection: "row", justifyContent: "center" },
                  ]}
                >
                  {/* Botón Ver */}
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleViewProduct(item)}
                  >
                    <Feather name="search" size={22} color="#fff" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Modal de información del producto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Botón cerrar (equis) */}
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <AntDesign name="close" size={26} color="#333" />
            </Pressable>
            <Text style={styles.modalTitle}>Información del Producto</Text>
            {selectedProduct && (
              <View style={styles.modalFields}>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Nombre:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedProduct.name}
                    editable={false}
                  />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Categoría:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedProduct.category}
                    editable={false}
                  />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Descripción:</Text>
                  <TextInput
                    style={[styles.modalInput, { height: 60 }]}
                    value={selectedProduct.description}
                    editable={false}
                    multiline
                  />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Unidad:</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={
                        selectedProduct.unit ? String(selectedProduct.unit) : ""
                      }
                      editable={false}
                    />
                  </View>
                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Cantidad por unidad:</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={
                        selectedProduct.quantity_per_unit
                          ? String(selectedProduct.quantity_per_unit)
                          : ""
                      }
                      editable={false}
                    />
                  </View>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Precio:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={`$${Number(selectedProduct.price).toLocaleString(
                      "es-CL",
                      { minimumFractionDigits: 0 }
                    )}`}
                    editable={false}
                  />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Stock:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={String(selectedProduct.stock)}
                    editable={false}
                  />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Imagen:</Text>
                  <Image
                    source={{ uri: selectedProduct.image }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      alignSelf: "center",
                    }}
                  />
                </View>
              </View>
            )}
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.editButton}
                onPress={handleEditFromModal}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={handleDeleteFromModal}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
          <Text style={styles.pageInfo}>{`${currentPage} de ${
            totalPages || 1
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
  tabla: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    minHeight: 54,
  },
  encabezado: {
    flexDirection: "row",
    backgroundColor: "#2980b9",
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  columna: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  columnaHeader: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  paginationContainer: {
    padding: 10,
    backgroundColor: "#F6FDFF",
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
  actionButton: {
    backgroundColor: "#2980b9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    width: "90%",
    elevation: 8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    color: "#2980b9",
  },
  modalFields: {
    marginBottom: 18,
  },
  modalField: {
    marginBottom: 12,
  },
  modalLabel: {
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
  },
  modalInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#2980b9",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProductsAdmin;
