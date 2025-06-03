import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import Layout from "../../components/Layout";
import { Picker } from "@react-native-picker/picker";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

// Pantalla para editar un producto existente
const EditProductScreen = ({ route, navigation }) => {
  // Obtiene el ID del producto desde los parámetros de navegación
  const { productId } = route.params;

  // Estados para los campos del formulario del producto
  const [name, setName] = useState(""); // Nombre del producto
  const [description, setDescription] = useState(""); // Descripción del producto
  const [category, setCategory] = useState(""); // Categoría del producto
  const [price, setPrice] = useState(""); // Precio del producto (string para TextInput)
  const [stock, setStock] = useState(""); // Stock disponible (string para TextInput)
  const [quantityPerUnit, setQuantityPerUnit] = useState(""); // Cantidad por unidad
  const [unit, setUnit] = useState(""); // Unidad de medida
  const [image, setImage] = useState(""); // URL de la imagen del producto

  // useEffect para cargar los datos actuales del producto al montar el componente
  useEffect(() => {
    const fetchProduct = async () => {
      // Obtiene el documento del producto desde Firestore
      const productDoc = await getDoc(doc(db, "products", productId));
      if (productDoc.exists()) {
        // Si el producto existe, actualiza los estados con los datos actuales
        const data = productDoc.data();
        setName(data.name || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setPrice(data.price ? String(data.price) : "");
        setStock(data.stock ? String(data.stock) : "");
        setQuantityPerUnit(data.quantity_per_unit || "");
        setUnit(data.unit || "");
        setImage(data.image || "");
      }
    };
    fetchProduct(); // Llama a la función para cargar los datos
  }, [productId]);

  // Función para actualizar el producto en Firestore
  const handleUpdate = async () => {
    try {
      // Actualiza el documento del producto con los nuevos valores
      await updateDoc(doc(db, "products", productId), {
        name,
        description,
        category,
        price: parseFloat(price), // Convierte el precio a número
        stock: parseInt(stock, 10), // Convierte el stock a número entero
        quantity_per_unit: parseInt(quantityPerUnit, 10),
        unit,
        image,
      });
      // Muestra alerta de éxito y regresa a la pantalla anterior
      Alert.alert("Éxito", "Producto actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      // Muestra alerta de error si falla la actualización
      Alert.alert("Error", "No se pudo actualizar el producto.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Editar Producto</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Categoría"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cantidad por unidad</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[
                  styles.input,
                  { width: 200, textAlign: "center", marginHorizontal: 8 },
                ]}
                value={quantityPerUnit}
                onChangeText={(text) => {
                  // Solo permitir números
                  if (/^\d*$/.test(text)) setQuantityPerUnit(text);
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              <Pressable
                style={styles.counterButton}
                onPress={() => {
                  const value = parseInt(quantityPerUnit) || 0;
                  setQuantityPerUnit(String(value + 1));
                }}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
              <Pressable
                style={styles.counterButton}
                onPress={() => {
                  const value = parseInt(quantityPerUnit) || 0;
                  if (value > 1) setQuantityPerUnit(String(value - 1));
                }}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Unidad</Text>
            <Picker
              selectedValue={unit}
              style={styles.Picker}
              onValueChange={(itemValue) => setUnit(itemValue)}
            >
              <Picker.Item label="Selecciona unidad de medida" value="" />
              <Picker.Item label="unidad" value="unidad" />
              <Picker.Item label="unidades" value="unidades" />
              <Picker.Item label="Kg" value="kg" />
              <Picker.Item label="Ml" value="ml" />
              <Picker.Item label="Lb" value="lb" />
              <Picker.Item label="g" value="g" />
              <Picker.Item label="L" value="l" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>URL Imagen</Text>
            <TextInput
              style={styles.input}
              placeholder="URL Imagen"
              value={image}
              onChangeText={setImage}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            <Pressable
              style={[
                styles.button,
                { marginBottom: 0, marginRight: 10, width: 140 },
              ]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>Actualizar</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: "#e74c3c",
                  marginBottom: 0,
                  marginLeft: 10,
                  width: 140,
                },
              ]}
              onPress={() => navigation.navigate("Tabs" , { screen: "AdminDashboard" })}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F6FDFF",
  },
  counterButton: {
    backgroundColor: "#dfe6e9",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  counterButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2980b9",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  Picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#b2bec3",
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2980b9",
    marginBottom: 24,
    alignSelf: "center",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b2bec3",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 14,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 30,
    width: "60%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2980b9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default EditProductScreen;
