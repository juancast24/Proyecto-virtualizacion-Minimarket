import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

// Pantalla principal para visualizar y gestionar pedidos
const OrdersScreen = () => {
  // Obtiene el estado de autenticación del usuario
  const { authState } = useAuth();
  // Hook de navegación para cambiar de pantalla
  const navigation = useNavigation();
  // Estado para controlar la visibilidad del modal de detalles
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para almacenar el pedido seleccionado en el modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Estado para el texto de búsqueda
  const [searchText, setSearchText] = useState("");
  // Estado para almacenar todos los pedidos obtenidos de Firestore
  const [orders, setOrders] = useState([]);
  // Estado para mostrar indicador de carga mientras se obtienen los pedidos
  const [loading, setLoading] = useState(true);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Cantidad de pedidos por página

  // useEffect para obtener los pedidos de Firestore al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Obtiene todos los documentos de la colección "pedidos"
        const querySnapshot = await getDocs(collection(db, "pedidos"));
        const ordersArray = [];
        // Recorre cada documento y lo agrega al array de pedidos
        querySnapshot.forEach((doc) => {
          ordersArray.push({ id: doc.id, ...doc.data() });
        });
        setOrders(ordersArray); // Actualiza el estado con los pedidos obtenidos
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      } finally {
        setLoading(false); // Oculta el indicador de carga
      }
    };
    fetchOrders();
  }, []);

  // Filtra los pedidos según el texto de búsqueda (por nombre)
  const filteredOrders = orders.filter((order) =>
    (order.name || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Calcula los índices para mostrar solo los pedidos de la página actual
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  // Calcula el total de páginas según la cantidad de pedidos filtrados
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // useEffect para resetear la página a la primera cuando cambia el filtro de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Maneja la selección de un pedido para mostrar sus detalles en el modal
  const handlePressOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Función para avanzar a la siguiente página de pedidos
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para retroceder a la página anterior de pedidos
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Devuelve un color según el estado del pedido
  const getStatusColor = (status) => {
    if (!status) return "#9E9E9E";
    switch (status.toLowerCase()) {
      case "pendiente":
        return "#FFC107"; // amarillo
      case "enviado":
        return "#2196F3"; // azul
      case "entregado":
        return "#4CAF50"; // verde
      case "cancelado":
        return "#F44336"; // rojo
      default:
        return "#9E9E9E"; // gris
    }
  };

  // Renderiza cada fila de la tabla de pedidos
  const renderOrder = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
      <Text style={styles.cell}>
        {item.date && item.date.seconds
          ? new Date(item.date.seconds * 1000).toLocaleDateString()
          : item.date || ""}
      </Text>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <Text style={styles.cell}>{item.status}</Text>
      </View>
      <Text
        style={[styles.cell, styles.addressCell]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.address}
      </Text>
      {/* Botón para ver detalles del pedido */}
      <Pressable
        style={styles.actionButton}
        onPress={() => handlePressOrder(item)}
      >
        <Text style={styles.actionButtonText}>Ver</Text>
      </Pressable>
    </View>
  );

  return (
    <Layout>
      <View style={styles.container}>
        {/* Título de la pantalla */}
        <Text style={styles.title}>Pedidos</Text>

        {/* Buscador de pedidos */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o estado"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Tabla de pedidos */}
        <View style={styles.tableContainer}>
          {/* Encabezado de la tabla */}
          <View className="tableHeader" style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 1.5 }]}>Cliente</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Fecha</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Estado</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Dirección</Text>
            <Text style={[styles.headerCell, { flex: 0.8 }]}>Acción</Text>
          </View>

          {/* Lista de pedidos paginada */}
          <FlatList
            data={currentOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tableContent}
          />

          {/* Controles de paginación */}
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>
              Mostrando {indexOfFirstOrder + 1}-
              {Math.min(indexOfLastOrder, filteredOrders.length)} de{" "}
              {filteredOrders.length} pedidos
            </Text>
            <View style={styles.paginationControls}>
              {/* Botón página anterior */}
              <Pressable
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                onPress={goToPrevPage}
                disabled={currentPage === 1}
              >
                <AntDesign
                  name="left"
                  size={18}
                  color={currentPage === 1 ? "#BBBBBB" : "#2980b9"}
                />
              </Pressable>
              {/* Indicador de página actual */}
              <Text style={styles.pageIndicator}>
                {currentPage} de {totalPages}
              </Text>
              {/* Botón página siguiente */}
              <Pressable
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <AntDesign
                  name="right"
                  size={18}
                  color={currentPage === totalPages ? "#BBBBBB" : "#2980b9"}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Modal para mostrar detalles del pedido seleccionado */}
        {selectedOrder && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Detalles del Pedido</Text>

                {/* ID del pedido */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.id}</Text>
                </View>

                {/* Nombre del cliente */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cliente:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.name}</Text>
                </View>

                {/* Lista de productos del pedido */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Productos:</Text>
                  <View style={styles.detailValue}>
                    {selectedOrder.products ? (
                      Array.isArray(selectedOrder.products) ? (
                        selectedOrder.products.length > 0 ? (
                          selectedOrder.products.map((prod, idx) => (
                            <Text key={idx} style={{ fontSize: 15 }}>
                              • {prod.name} (x{prod.quantity})
                            </Text>
                          ))
                        ) : (
                          <Text style={{ fontSize: 15 }}>Sin productos</Text>
                        )
                      ) : Object.keys(selectedOrder.products).length > 0 ? (
                        Object.entries(selectedOrder.products).map(
                          ([key, prod]) => (
                            <Text key={key} style={{ fontSize: 15 }}>
                              • {prod.name} (x{prod.quantity})
                            </Text>
                          )
                        )
                      ) : (
                        <Text style={{ fontSize: 15 }}>Sin productos</Text>
                      )
                    ) : (
                      <Text style={{ fontSize: 15 }}>Sin productos</Text>
                    )}
                  </View>
                </View>

                {/* Total del pedido */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={styles.detailValue}>
                    $
                    {selectedOrder.total
                      ? selectedOrder.total.toLocaleString()
                      : "0"}
                  </Text>
                </View>

                {/* Fecha del pedido */}
                <Text style={styles.detailValue}>
                  {selectedOrder.date && selectedOrder.date.seconds
                    ? new Date(
                        selectedOrder.date.seconds * 1000
                      ).toLocaleDateString()
                    : selectedOrder.date || ""}
                </Text>

                {/* Estado del pedido con indicador de color */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado:</Text>
                  <View style={styles.statusBadge}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: getStatusColor(selectedOrder.status),
                        },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {selectedOrder.status}
                    </Text>
                  </View>
                </View>

                {/* Botón para editar el estado del pedido (a implementar) */}
                <Pressable
                  style={styles.editButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.editButtonText}>Editar estado</Text>
                </Pressable>

                {/* Botón para cerrar el modal */}
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {/* Botón para regresar al dashboard de administrador */}
        <Pressable
          style={[styles.button, { backgroundColor: "red", marginTop: 20 }]}
          onPress={() => navigation.navigate("AdminDashboard")}
        >
          <Text style={styles.buttonText}>Atrás</Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2980b9",
    padding: 12,
    alignItems: "center",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#fff",
    textAlign: "left",
    flex: 1,
  },
  tableContent: {
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cell: {
    fontSize: 6,
    color: "#333",
    flex: 1,
  },
  nameCell: {
    flex: 1.5,
    fontWeight: "500",
  },
  addressCell: {
    flex: 2,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  actionButton: {
    backgroundColor: "#2980b9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 0.8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  paginationText: {
    fontSize: 13,
    color: "#666",
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginationButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    opacity: 0.5,
  },
  pageIndicator: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: "bold",
    width: "30%",
    fontSize: 16,
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrdersScreen;
