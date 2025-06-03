import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from "../../context/AuthContext";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { showMessage } from "react-native-flash-message";
import { useCart } from "../../context/CartContext";
import { isColor } from "react-native-reanimated";
import KeyboardAwareLayout from "../../components/KeyboardAwareLayout";

const db = getFirestore(firebaseApp);
const FormPay = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Obtiene los productos del carrito desde los parámetros de navegación
  const { cartItems } = route.params || { cartItems: [] };
  const { clearCart } = useCart();
  const { authState } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedWhatsApp, setIsCheckedWhatsApp] = useState(false);
  // Estado para el formulario de datos de envío y pago
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    barrio: "",
    direccion: "",
    metodoPago: "contra_entrega",
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Renderiza cada producto del carrito en el resumen
  const renderItem = ({ item }) => {
    const totalItemPrice = item.price * item.quantity;
    return (
      <View style={styles.cartItemCard}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemDetailText}>Cantidad: {item.quantity}</Text>
          <Text style={styles.itemDetailText}>
            Precio/u: ${item.price.toLocaleString("es-CL")}
          </Text>
        </View>
        <Text style={styles.itemSubtotal}>
          Subtotal: ${totalItemPrice.toLocaleString("es-CL")}
        </Text>
      </View>
    );
  };

  // Calcula el total general del pedido
  const calcularTotalGeneral = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleConfirmOrder = async () => {
    if (
      (!authState.user && (!form.nombre || !form.telefono || !form.correo || !form.barrio || !form.direccion)) ||
      cartItems.length === 0 ||!isChecked 
    ) {
      showMessage({
        message: "Todos los campos son obligatorios",
        type: "warning",
        duration: 1500,
        titleStyle: { fontSize: 20, fontWeight: "bold" },
        style: {
          marginTop: 25,
          paddingVertical: 24,
          paddingHorizontal: 32,
          minWidth: 350,
          alignSelf: "center",
          borderRadius: 10,
        },
        icon: "warning",
      });
      return;
    }
    try {
      const userData = authState.user
        ? {
          uid: authState.user.uid,
          nombre: authState.user.nombre,
          telefono: authState.user.telefono,
          correo: authState.user.correo,
          barrio: authState.user.barrio || form.barrio,
          direccion: authState.user.direccion || form.direccion,
          metodoPago: form.metodoPago,
        }
        : { ...form };

      const orderData = {
        usuario: userData,
        productos: cartItems,
        total: calcularTotalGeneral(),
        fecha: new Date().toISOString(),
        estado: "Pendiente"
      };

      // Guarda el pedido y obtén el ID
    const docRef = await addDoc(collection(db, "pedidos"), orderData);
    const pedidoId = docRef.id;
      // Siempre usa addDoc para generar un ID único, tanto para usuarios logueados como no logueados
      await addDoc(collection(db, "pedidos"), orderData);


      // Actualiza el stock de cada producto
      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock || 0;
          const newStock = Math.max(currentStock - item.quantity, 0);
          await updateDoc(productRef, { stock: newStock });
        }
      }
      // Limpia el carrito después de confirmar el pedido
      clearCart();
      navigation.navigate("SuccessScreen", { pedidoId });
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      showMessage({
        message: "Hubo un error al guardar el pedido.",
        type: "danger",
        duration: 2000,
        titleStyle: { fontSize: 18, fontWeight: "bold" },
      });
    }
  };
  return (
    <KeyboardAwareLayout>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de la pantalla de pago */}
        <View style={styles.header}>
          <Text style={styles.title}>Resumen del Pedido</Text>
        </View>

        {/* Resumen de los Productos */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item?.name ? item.name + index : index.toString()
            }
            scrollEnabled={false}
          />
          <View style={styles.totalSummary}>
            <Text style={styles.totalLabel}>Total General:</Text>
            <Text style={styles.totalAmount}>
              ${calcularTotalGeneral().toLocaleString("es-CL")}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Formulario de Datos de Envío */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Datos de Envío</Text>
          <Text style={styles.deliveryInfo}>
            <Icon
              name="information-off-outline"
              size={16}
              color="#666"
            />{" "}
            Solo se realizan envíos a Santander de Quilichao.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
            onChangeText={(text) => handleChange("nombre", text)}
            value={authState.user ? authState.user.nombre : form.nombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
            value={authState.user ? authState.user.telefono : form.telefono}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            onChangeText={(text) => handleChange("correo", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            value={authState.user ? authState.user.correo : form.correo}
          />
          <TextInput
            style={styles.input}
            placeholder="Barrio"
            placeholderTextColor="#999"
            onChangeText={(text) => handleChange("barrio", text)}
            value={authState.user ? authState.user.barrio : form.barrio}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección (Calle, número de casa/apto)"
            placeholderTextColor="#999"
            onChangeText={(text) => handleChange("direccion", text)}
            value={authState.user ? authState.user.direccion : form.direccion}
          />
          <Pressable onPress={() => setIsCheckedWhatsApp(!isCheckedWhatsApp)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={isCheckedWhatsApp ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
              size={20}
              color={isCheckedWhatsApp ? '#4A90E2' : '#aaa'}
            />
            <Text style={isCheckedWhatsApp ? styles.textCheckDisabled : styles.textCheck}>{'Deseo recibir notificaciones al WhatsApp'}</Text>
          </Pressable>
          <Pressable onPress={() => setIsChecked(!isChecked)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={isChecked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
              size={20}
              color={isChecked ? '#4A90E2' : '#aaa'}
            />
            <Text style={isChecked ? styles.textCheckDisabled : styles.textCheck}>{'Acepto los términos y condiciones'}</Text>
          </Pressable>
        </View>

        <View style={styles.separator} />

        {/* Método de Pago */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.metodoPago}
              onValueChange={(itemValue) =>
                handleChange("metodoPago", itemValue)
              }
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Contra entrega" value="contra_entrega" />
              <Picker.Item label="PSE " value="pse" />
            </Picker>
          </View>
        </View>

        {/* Botón Confirmar Pedido */}
        <Pressable
          onPress={handleConfirmOrder}
          style={({ pressed }) => [
            styles.confirmButton,
            { backgroundColor: pressed ? "#388E3C" : "#4CAF50" },
          ]}
        >
          <Text style={styles.confirmButtonText}>Confirmar pedido</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAwareLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  sectionWrapper: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 15,

  },

  cartItemCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  itemDetailText: {
    fontSize: 14,
    color: "#666",
  },
  itemSubtotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
    marginTop: 5,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
  totalSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  separator: {
    height: 2,
    backgroundColor: "#EEE",
    marginVertical: 10,
    marginHorizontal: 10,
  },

  deliveryInfo: {
    fontSize: 15,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#FFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
    color: "#333",
  },

  confirmButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  textCheck: {
    fontSize: 15,
    color: "#666",
    marginLeft: 10,
    fontStyle: 'italic',
  },
  textCheckDisabled: {
    fontSize: 15,
    color: "#4A90E2",
    marginLeft: 10,
    fontStyle: 'italic',
  },
});

export default FormPay;
