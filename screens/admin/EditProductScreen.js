import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import Layout from "../../components/Layout";

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
        quantity_per_unit: quantityPerUnit,
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
      <View style={styles.container}>
        {/* Título de la pantalla */}
        <Text style={styles.title}>Editar Producto</Text>
        {/* Campo para el nombre */}
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
        {/* Campo para la descripción */}
        <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} />
        {/* Campo para la categoría */}
        <TextInput style={styles.input} placeholder="Categoría" value={category} onChangeText={setCategory} />
        {/* Campo para el precio */}
        <TextInput style={styles.input} placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" />
        {/* Campo para el stock */}
        <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
        {/* Campo para la cantidad por unidad */}
        <TextInput style={styles.input} placeholder="Cantidad por unidad" value={quantityPerUnit} onChangeText={setQuantityPerUnit} keyboardType="numeric" />
        {/* Campo para la unidad de medida */}
        <TextInput style={styles.input} placeholder="Unidad" value={unit} onChangeText={setUnit} />
        {/* Campo para la URL de la imagen */}
        <TextInput style={styles.input} placeholder="URL Imagen" value={image} onChangeText={setImage} />
        {/* Botón para actualizar el producto */}
        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#2980b9',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default EditProductScreen;