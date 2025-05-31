import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { useAuth } from "../../context/AuthContext";

const db = getFirestore(firebaseApp);

const OrderHistory = () => {
  const { authState } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.user) return;

    const q = query(
      collection(db, "pedidos"),
      where("usuario.uid", "==", authState.user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authState.user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No tienes pedidos aún.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Pedidos</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderProductsTitle}>Productos:</Text>
            {item.productos.map((prod, idx) => (
              <View key={idx} style={styles.productRow}>
                {prod.image && (
                  <Image
                    source={{ uri: prod.image }}
                    style={styles.productImage}
                  />
                )}
                <Text style={styles.productItem}>
                  {prod.name} x{prod.quantity}
                </Text>
              </View>
            ))}
            <Text style={styles.orderDate}>
              Fecha: {new Date(item.fecha).toLocaleString()}
            </Text>
            <Text style={styles.orderTotal}>
              Total: ${item.total.toLocaleString("es-CL")}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f4f8" },
  header: {
    backgroundColor: "#4CAF50",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  listContent: { paddingBottom: 16 },
  orderCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderDate: { fontSize: 16, marginBottom: 4, color: "#333" },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#388e3c",
  },
  orderProductsTitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
  },
  productItem: { fontSize: 14, marginLeft: 8, color: "#444" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#888" },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#eee",
  },
});

export default OrderHistory;
