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
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { Picker } from "@react-native-picker/picker";
import BottomBarLayout from "../../components/BottomBarLayout";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

const DeliveredOrders = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Traer pedidos entregados y mapear campos igual que OrdersScreen
  useEffect(() => {
    const ordersCollection = collection(db, "pedidos");
    const deliveredQuery = query(ordersCollection, where("estado", "==", "entregado"));
    const unsubscribe = onSnapshot(
      deliveredQuery,
      (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.usuario?.nombre || data.name || "Sin nombre",
            date: data.fecha || data.date || null,
            status: data.estado || data.status || "entregado",
            address: data.direccion || data.address || "Sin dirección",
            products: data.productos || data.products || [],
            total: data.total || 0,
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
          };
        });
        setOrders(ordersData);
      },
      (error) => {
        console.error("Error fetching orders:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filtrado por búsqueda
  const filteredOrders = orders.filter(
    (order) =>
      (order.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (order.status || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const paginatedOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Color según estado
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pendiente":
        return "#f1c40f";
      case "enviado":
        return "#2980b9";
      case "entregado":
        return "#27ae60";
      default:
        return "#bbb";
    }
  };

  // Abrir modal con pedido seleccionado
  const handlePressOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
    setEditingStatus(false);
  };

  // Actualizar estado del pedido en Firestore
  const updateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      const orderDocRef = doc(db, "pedidos", selectedOrder.id);
      await updateDoc(orderDocRef, { estado: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setEditingStatus(false);
      Alert.alert("Éxito", "Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  // Reiniciar página si cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  return (
    <BottomBarLayout>
      <View style={styles.container}>
        <FlatList
          data={paginatedOrders}
          renderItem={({ item }) => (
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
              <Pressable
                style={styles.actionButton}
                onPress={() => handlePressOrder(item)}
              >
                <Text style={styles.actionButtonText}>Ver</Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tableContent}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Pedidos Entregados</Text>
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
              <View className="tableHeader" style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 1.5 }]}>Cliente</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Fecha</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Estado</Text>
                <Text style={[styles.headerCell, { flex: 2 }]}>Dirección</Text>
                <Text style={[styles.headerCell, { flex: 0.8 }]}>Acción</Text>
              </View>
            </>
          }
          ListFooterComponent={
            <>
              <View style={styles.paginationContainer}>
                <Text style={styles.paginationText}>
                  Mostrando {filteredOrders.length === 0 ? 0 : indexOfFirstOrder + 1}-
                  {Math.min(indexOfLastOrder, filteredOrders.length)} de{" "}
                  {filteredOrders.length} pedidos
                </Text>
                <View style={styles.paginationControls}>
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
                  <Text style={styles.pageIndicator}>
                    {currentPage} de {totalPages}
                  </Text>
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
              {selectedOrder && (
                <Modal
                  visible={modalVisible}
                  animationType="slide"
                  transparent={true}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Detalles del Pedido</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ID:</Text>
                        <Text style={styles.detailValue}>{selectedOrder.id}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Cliente:</Text>
                        <Text style={styles.detailValue}>{selectedOrder.name}</Text>
                      </View>
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
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total:</Text>
                        <Text style={styles.detailValue}>
                          $
                          {selectedOrder.total
                            ? selectedOrder.total.toLocaleString()
                            : "0"}
                        </Text>
                      </View>
                      <Text style={styles.detailValue}>
                        {selectedOrder.date && selectedOrder.date.seconds
                          ? new Date(
                              selectedOrder.date.seconds * 1000
                            ).toLocaleDateString()
                          : selectedOrder.date || ""}
                      </Text>
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
            </>
          }
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("OrdersScreen")}
      >
        <Text style={styles.buttonText}>Atras</Text>
      </Pressable>
    </BottomBarLayout>
  );
};

const styles = StyleSheet.create({
  // ...existing styles...
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 30,
    textAlign: "center",
    color: "#333",
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 1,
    backgroundColor: "#F6FDFF",
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
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
    flex: 1,
  },
  tableContent: {
    paddingVertical: 5,
  },
  cell: {
    fontSize: 11,
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
    paddingHorizontal: 5,
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
    backgroundColor: "#F6FDFF",
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
  },
  modalContent: {
    backgroundColor: "#f9f9f9",
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
    borderRadius: 30,
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
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 30,
    marginTop: 20,
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

export default DeliveredOrders;