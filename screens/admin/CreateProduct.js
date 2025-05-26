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
import * as ImagePicker from "expo-image-picker"; // Para acceder a la cámara y galería
import { Picker } from "@react-native-picker/picker"; // Selector de opciones (categoría, unidad)
import { useNavigation } from "@react-navigation/native"; // Navegación entre pantallas
import { MaterialIcons } from "@expo/vector-icons"; // Iconos para el botón de cámara
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestore para guardar productos
import { firebaseApp } from "../../firebase.config"; // Configuración de Firebase

const db = getFirestore(firebaseApp); // Instancia de Firestore

const CreateProduct = () => {
  const navigation = useNavigation(); // Hook para navegación
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(""); // URL de la imagen seleccionada/capturada
  const [quantityPerUnit, setQuantityPerUnit] = useState("");
  const [unit, setUnit] = useState("");

  // Solicita permisos de cámara al montar el componente
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

  // Abre la cámara y permite capturar una imagen
  const handleOpenCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
        allowsEditing: true, // Permite recortar
        aspect: [4, 3], // Relación de aspecto
        quality: 0.7, // Calidad de la imagen
      });

      if (!result.canceled) {
        // Si el usuario toma una foto, guarda la URI local en el estado
        setImage(result.assets[0].uri);
        Alert.alert("Éxito", "Imagen capturada correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
      console.error(error);
    }
  };

  // Maneja la creación del producto en Firestore
  const handleCreateProduct = async () => {
    // Valida que todos los campos estén completos
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

    // Construye el objeto producto
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
      // Guarda el producto en la colección "products" de Firestore
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

  // Opciones de categorías disponibles
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
      {/* Botón flotante para abrir la cámara */}
      <Pressable style={styles.scanButton} onPress={handleOpenCamera}>
        <MaterialIcons name="camera-alt" size={24} color="white" />
      </Pressable>

      {/* Título de la pantalla */}
      <Text style={styles.title}>Crear Nuevo Producto</Text>
      {/* Campo para el nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={name}
        onChangeText={setName}
      />
      {/* Campo para la descripción */}
      <TextInput
        style={styles.input}
        placeholder="Descripción del producto"
        value={description}
        onChangeText={setDescription}
      />
      {/* Selector de categoría */}
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={[styles.Picker]}
      >
        <Picker.Item label="Selecciona una categoría" value="" />
        {categories.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>
      {/* Campo para el precio */}
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      {/* Campo para el stock */}
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      {/* Campo para la cantidad por unidad */}
      <TextInput
        style={styles.input}
        placeholder="Cantidad por unidad (ej: 6, 500, 1)"
        value={quantityPerUnit}
        onChangeText={setQuantityPerUnit}
        keyboardType="numeric"
      />
      {/* Selector de unidad de medida */}
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
      {/* Campo para la URL de la imagen (rellenado automáticamente al tomar foto) */}
      <TextInput
        style={styles.input}
        placeholder="URL de la Imagen"
        value={image}
        onChangeText={setImage}
      />
      {/* Vista previa de la imagen seleccionada o mensaje si no hay imagen */}
      {image ? (
        <Image
          source={{ uri: `${image}?timestamp=${new Date().getTime()}` }}
          style={styles.imagePreview}
        />
      ) : (
        <Text style={styles.imagePlaceholder}>Vista previa de la imagen</Text>
      )}
      {/* Botones para crear producto o volver atrás */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Pressable
          style={[styles.button, { marginRight: 10 }]}
          onPress={handleCreateProduct}
        >
          <Text style={styles.buttonText}>Crear Producto</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={() => navigation.navigate("AdminDashboard")}
        >
          <Text style={styles.buttonText}>Atras</Text>
        </Pressable>
      </View>
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
