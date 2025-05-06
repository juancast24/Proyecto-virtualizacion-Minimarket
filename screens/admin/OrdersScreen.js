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

const OrdersScreen = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const orders = [
    {
      id: "1",
      name: "Juan Pérez",
      date: "2025-04-17",
      status: "Pendiente",
      items: ["Manzana", "Pan"],
      total: 4500,
      address: "Calle Falsa 123",
    },
    {
      id: "2",
      name: "Ana López",
      date: "2025-04-16",
      status: "Enviado",
      items: ["Leche", "Huevos"],
      total: 18000,
      address: "Calle Falsa 12143",
    },
    {
      id: "3",
      name: "Carlos Mendez",
      date: "2025-04-15",
      status: "Entregado",
      items: ["Arroz", "Pasta"],
      total: 8500,
      address: "Av. Principal 45",
    },
    {
      id: "4",
      name: "María González",
      date: "2025-04-14",
      status: "Pendiente",
      items: ["Detergente", "Jabón"],
      total: 12000,
      address: "Calle 10 #23-45",
    },
    {
      id: "5",
      name: "Roberto Silva",
      date: "2025-04-13",
      status: "Cancelado",
      items: ["Cerveza", "Snacks"],
      total: 22500,
      address: "Carrera 7 #80-54",
    },
    {
      id: "6",
      name: "Laura Torres",
      date: "2025-04-12",
      status: "Enviado",
      items: ["Carne", "Pollo"],
      total: 35000,
      address: "Diagonal 45 #12-34",
    },
    {
      id: "7",
      name: "Javier Ruiz",
      date: "2025-04-11",
      status: "Entregado",
      items: ["Frutas variadas"],
      total: 15000,
      address: "Calle 80 #45-12",
    },
    {
      id: "8",
      name: "Carmen Díaz",
      date: "2025-04-10",
      status: "Pendiente",
      items: ["Cereal", "Yogurt"],
      total: 9800,
      address: "Av. Circunvalar #10-20",
    },
    {
      id: "9",
      name: "Fernando Páez",
      date: "2025-04-09",
      status: "Enviado",
      items: ["Aceite", "Sal", "Azúcar"],
      total: 11200,
      address: "Calle 127 #15-41",
    },
    {
      id: "10",
      name: "Sofía Martínez",
      date: "2025-04-08",
      status: "Pendiente",
      items: ["Papel higiénico", "Toallas"],
      total: 28000,
      address: "Carrera 15 #93-40",
    },
  ];

  // Filtrar pedidos según el texto de búsqueda
  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calcular página actual de pedidos
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Resetear a la primera página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const handlePressOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Navegar entre páginas
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
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

  const renderOrder = ({ item }) => (
    <View style={styles.row}>

      <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
      <Text style={styles.cell}>{item.date}</Text>
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
  );

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Pedidos</Text>

        {/* Buscador */}
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

        {/* Tabla mejorada */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
  
            <Text style={[styles.headerCell, { flex: 1.5 }]}>Cliente</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Fecha</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Estado</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Dirección</Text>
            <Text style={[styles.headerCell, { flex: 0.8 }]}>Acción</Text>
          </View>

          <FlatList
            data={currentOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tableContent}
          />

          {/* Paginación */}
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>
              Mostrando {indexOfFirstOrder + 1}-
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
        </View>

        {/* Modal de detalles */}
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
                  <Text style={styles.detailLabel}>Artículos:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.items.join(", ")}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={styles.detailValue}>
                    ${selectedOrder.total.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.date}</Text>
                </View>

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

                <Pressable
                  style={styles.editButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.editButtonText}>Editar estado</Text>
                </Pressable>

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
