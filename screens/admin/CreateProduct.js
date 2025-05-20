import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { addProduct } from "../../data/products";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";

const db = getFirestore(firebaseApp);

const CreateProduct = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [quantityPerUnit, setQuantityPerUnit] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Se requieren permisos",
          "Necesitas dar permisos para usar la cámara"
        );
      }
    };
    getCameraPermission();
  }, []);

  // Función para abrir la cámara
  const handleOpenCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        // Aquí podrías subir la imagen a un servidor y obtener una URL
        // Por ahora solo mostramos la URI de la imagen local
        setImage(result.assets[0].uri);
        Alert.alert("Éxito", "Imagen capturada correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
      console.error(error);
    }
  };

  const handleCreateProduct = async () => {
    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !stock ||
      !image ||
      !quantityPerUnit ||
      !unit
    ) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const newProduct = {
      name,
      description,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image,
      quantity_per_unit: quantityPerUnit,
      unit,
    };

    try {
      await addDoc(collection(db, "products"), newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente.");
      // Limpia los campos después de crear el producto
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setStock("");
      setImage("");
      setQuantityPerUnit("");
      setUnit("");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al crear el producto.");
      console.error(error);
    }
  };

  const categories = [
    "Aseo hogar",
    "Despensa",
    "Frutas Verduras",
    "Carnes",
    "Lacteos",
    "Higiene Personal",
  ];

  return (
    <View style={styles.container}>
      {/* Botón de cámara */}
      <Pressable style={styles.scanButton} onPress={handleOpenCamera}>
        <MaterialIcons name="camera-alt" size={24} color="white" />
      </Pressable>

      <Text style={styles.title}>Crear Nuevo Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del producto"
        value={description}
        onChangeText={setDescription}
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={[styles.Picker]} // Combina estilos
      >
        <Picker.Item label="Selecciona una categoría" value="" />
        {categories.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Cantidad por unidad (ej: 6, 500, 1)"
        value={quantityPerUnit}
        onChangeText={setQuantityPerUnit}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={unit}
        style={styles.Picker}
        onValueChange={(itemValue) => setUnit(itemValue)}
      >
        <Picker.Item label="Selecciona unidad de medida" value="" />
        <Picker.Item label="unidad" value="unidad" />
        <Picker.Item label="unidades" value="unidades" />
        <Picker.Item label="kg" value="kg" />
        <Picker.Item label="ml" value="ml" />
        <Picker.Item label="lb" value="lb" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="URL de la Imagen"
        value={image}
        onChangeText={setImage}
      />
      {image ? (
        <Image
          source={{ uri: `${image}?timestamp=${new Date().getTime()}` }}
          style={styles.imagePreview}
        />
      ) : (
        <Text style={styles.imagePlaceholder}>Vista previa de la imagen</Text>
      )}
      <Pressable style={styles.button} onPress={handleCreateProduct}>
        <Text style={styles.buttonText}>Crear Producto</Text>
      </Pressable>
      {/* Nuevo botón para ir a AdminDashboard */}
      <Pressable
        style={[styles.button, { backgroundColor: "red", marginTop: 10 }]} // Estilo adicional
        onPress={() => navigation.navigate("AdminDashboard")} // Navega a AdminDashboard
      >
        <Text style={styles.buttonText}>Atras</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6FDFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    marginTop: 1,
    width: "50%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  Picker: {
    color: "#000",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  imagePlaceholder: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: 15,
  },
  scanButton: {
    position: "absolute",
    top: 30,
    right: 15,
    backgroundColor: "#2980b9",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    elevation: 3, // para sombra en Android
    shadowColor: "#000", // para sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default CreateProduct;
