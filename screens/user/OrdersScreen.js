import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import Layout from "../../components/Layout";
import { useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

const OrdersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;

  const getStatusStyle = (estado) => ({
    backgroundColor:
      estado === "Entregado"
        ? "#28a745" 
        : estado === "Pendiente"
        ? "#ffc107" 
        : estado === "En camino"
        ? "#009688" 
        : "#6c757d", 
  });

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "Entregado":
        return "check-circle";
      case "Pendiente":
        return "clock-time-four";
      case "En camino":
        return "truck-delivery-outline";
      default:
        return "information-outline";
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productRow}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
        <Text style={styles.productQuantity}>Precio unitario: ${item.price.toLocaleString("es-CL")}</Text>
      </View>
    </View>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Detalles del Pedido</Text>

        <View style={styles.section}>
          {/* Fecha y total alineados */}
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}><Icon name="calendar-month" size={20} color={"gray"} /> Fecha:</Text>
              <Text style={styles.value}>
                {format(new Date(order.fecha), "dd/MM/yyyy HH:mm")}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.label}><Icon name="cash-multiple" size={20} color={"gray"} /> Total:</Text>
              <Text style={styles.total}>
                ${Number(order.total || 0).toLocaleString("es-CL")}
              </Text>
            </View>
          </View>

          {/* Dirección si existe */}
          {order?.direccion && (
            <View style={styles.infoItem}>
              <Text style={styles.label}><Icon name="map-marker" size={20} color={"gray"} /> Dirección:</Text>
              <Text style={styles.value}>{order.direccion}</Text>
            </View>
          )}

          {/* Estado */}
          <View style={styles.infoItem}>
            <Text style={styles.label}><Icon name="tag" size={20} color={"gray"} /> Estado:</Text>
            <Text style={[styles.badge, getStatusStyle(order.estado)]}>
              <Icon name={getStatusIcon(order.estado)} size={16} color="#fff" /> {order.estado}
            </Text>
          </View>

          {/* Botón Generar recibo */}
          <Pressable
          style={({ pressed }) => [
            styles.generateReceiptButton,
            { backgroundColor: pressed ? "#2563EB" : "#4A90E2" }
          ]}
          onPress={() => navigation.navigate("ReciboScreen", { pedidoId: order.id })}
        >
          <Icon name="receipt" size={22} color="#fff" />
          <Text style={styles.generateReceiptText}>Generar recibo</Text>
        </Pressable>
        </View>

        {/* Lista de productos */}
        <View style={styles.section}>
          <Text style={styles.label}><Icon name="cart-outline" size={20} color={"gray"} /> Productos:</Text>
          <FlatList
            data={order.productos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderProduct}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  generateReceiptButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 16,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  generateReceiptText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 4,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#C5C5C5",
    marginVertical: 8,
  },
});

export default OrdersScreen;
