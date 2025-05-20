import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import Layout from "../../components/Layout";

const db = getFirestore(firebaseApp);

const EditProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [quantityPerUnit, setQuantityPerUnit] = useState("");
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const productDoc = await getDoc(doc(db, "products", productId));
      if (productDoc.exists()) {
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
    fetchProduct();
  }, [productId]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "products", productId), {
        name,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        quantity_per_unit: quantityPerUnit,
        unit,
        image,
      });
      Alert.alert("Éxito", "Producto actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el producto.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Producto</Text>
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Categoría" value={category} onChangeText={setCategory} />
        <TextInput style={styles.input} placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Cantidad por unidad" value={quantityPerUnit} onChangeText={setQuantityPerUnit} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Unidad" value={unit} onChangeText={setUnit} />
        <TextInput style={styles.input} placeholder="URL Imagen" value={image} onChangeText={setImage} />
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