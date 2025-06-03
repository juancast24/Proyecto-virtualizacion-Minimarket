import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Image,
  Linking,
  Alert,
} from "react-native";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { Picker } from "@react-native-picker/picker";

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

  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("pendiente");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Cantidad de pedidos por página

  // useEffect para obtener los pedidos de Firestore al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "pedidos"));
        const ordersArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersArray.push({
            id: doc.id,
            name: data.usuario?.nombre || data.name || "Sin nombre",
            date: data.fecha || data.date || null,
            status: data.estado || data.status || "pendiente",
            address: data.direccion || data.address || "Sin dirección",
            products: data.productos || data.products || [],
            total: data.total || 0,
            products: data.productos || data.products || [],
            total: data.total || 0,
            // Asegura que el teléfono sea string y sin espacios
            telefono: (
              data.telefono ||
              data.phone ||
              (data.usuario && data.usuario.telefono) ||
              (Array.isArray(data.productos) && data.productos[0]?.telefono) ||
              (Array.isArray(data.products) && data.products[0]?.telefono) ||
              ""
            )
              .toString()
              .replace(/\s+/g, ""),
          });
        });
        setOrders(ordersArray);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const sendWhatsAppNotification = (order, newStatus) => {
    // Intenta obtener el teléfono del pedido
    const phone =
      order.telefono ||
      order.phone ||
      (order.usuario && order.usuario.telefono) ||
      (order.products && order.products[0] && order.products[0].telefono);

    if (!phone) {
      Alert.alert("Error", "No se encontró el número de teléfono del cliente.");
      return;
    }

    const message = `Hola ${order.name}, tu pedido (${order.id}) ha cambiado de estado a: ${newStatus}. ¡Gracias por tu compra!`;
    const url = `https://wa.me/${phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "No se pudo abrir WhatsApp.")
    );
  };

  // Función para actualizar el estado en Firestore
  const updateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      const db = getFirestore(firebaseApp);
      const orderDocRef = doc(db, "pedidos", selectedOrder.id);
      await updateDoc(orderDocRef, { estado: newStatus });

      // Actualiza el estado localmente
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setEditingStatus(false);
      // Notifica por WhatsApp
      sendWhatsAppNotification(selectedOrder, newStatus);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

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
          ? (() => {
              const d = new Date(item.date.seconds * 1000);
              const day = String(d.getDate()).padStart(2, "0");
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const year = d.getFullYear();
              return `${day}-${month}-${year}`;
            })()
          : typeof item.date === "string" &&
            item.date.match(/^\d{4}-\d{2}-\d{2}/)
          ? (() => {
              // Si viene como "yyyy-mm-dd", lo convertimos a "dd-mm-yyyy"
              const [year, month, day] = item.date.split("T")[0].split("-");
              return `${day}-${month}-${year}`;
            })()
          : ""}
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
                  <View style={styles.detailProductsList}>
                    {Array.isArray(selectedOrder.products) &&
                    selectedOrder.products.length > 0 ? (
                      selectedOrder.products.map((prod, idx) =>
                        typeof prod === "object" && prod !== null ? (
                          <View
                            key={idx}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 4,
                            }}
                          >
                            {prod.image && (
                              <Image
                                source={{ uri: prod.image }}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 6,
                                  marginRight: 8,
                                  backgroundColor: "#eee",
                                }}
                              />
                            )}
                            <Text style={styles.productText}>
                              {prod.name} x{prod.quantity}
                            </Text>
                          </View>
                        ) : (
                          <Text key={idx} style={styles.productText}>
                            • {prod}
                          </Text>
                        )
                      )
                    ) : (
                      <Text style={styles.productText}>Sin productos</Text>
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
                {editingStatus ? (
                  <>
                    <Picker
                      selectedValue={newStatus}
                      onValueChange={setNewStatus}
                      style={{ marginVertical: 10 }}
                    >
                      <Picker.Item label="Pendiente" value="pendiente" />
                      <Picker.Item label="Enviado" value="enviado" />
                      <Picker.Item label="Entregado" value="entregado" />
                    </Picker>
                    <Pressable
                      style={styles.editButton}
                      onPress={updateOrderStatus}
                    >
                      <Text style={styles.editButtonText}>Guardar estado</Text>
                    </Pressable>
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setEditingStatus(false)}
                    >
                      <Text style={styles.closeButtonText}>Cancelar</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    style={styles.editButton}
                    onPress={() => {
                      setNewStatus(selectedOrder.status || "pendiente");
                      setEditingStatus(true);
                    }}
                  >
                    <Text style={styles.editButtonText}>Editar estado</Text>
                  </Pressable>
                )}

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
          style={[styles.button, { backgroundColor: "red"}]}
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
    padding: 14,
    alignItems: "center",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 15, // Más grande
    color: "#fff",
    textAlign: "left",
    flex: 1,
  },
  tableContent: {
    paddingVertical: 5,
  },
  cell: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    backgroundColor: "#fff",
    minHeight: 54,
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Más oscuro para mejor enfoque
    padding: 10,
  },
  modalContent: {
    backgroundColor: "#f9f9f9", // Más suave
    padding: 30,
    borderRadius: 18,
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#2980b9",
    textAlign: "center",
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontWeight: "bold",
    width: "32%",
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  productText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 2,
    marginLeft: 2,
  },
  detailProductsList: {
    flex: 1,
    flexDirection: "column",
    gap: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#eaf6fb",
    alignSelf: "flex-start",
    marginLeft: 2,
  },
  statusDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    marginRight: 7,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2980b9",
  },
  editButton: {
    backgroundColor: "#3498db",
    padding: 13,
    borderRadius: 8,
    marginTop: 22,
    alignItems: "center",
    shadowColor: "#2980b9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 13,
    borderRadius: 8,
    marginTop: 14,
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
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
