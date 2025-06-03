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
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { Camera, CameraView } from "expo-camera";

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
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [cameraRef, setCameraRef] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setScanning(false);
    setBarcode(data);

    // 1. Consultar Open Food Facts
    try {
      const response = await fetch(
        `https://co.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const result = await response.json();
      if (result.status === 1) {
        setName(result.product.product_name || "");
        setDescription(result.product.generic_name || "");
        Alert.alert(
          "Producto encontrado",
          "Nombre y descripción rellenados automáticamente (Open Food Facts)."
        );
        setTimeout(() => setScanned(false), 1000);
        return;
      }
    } catch (error) {
      // Si hay error, sigue con el siguiente API
    }

    // 2. Consultar UPCitemdb (requiere API Key gratuita)
    try {
      const upcApiKey = "TU_API_KEY"; 
      const upcResponse = await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${data}`,
        {
          headers: {
            "Content-Type": "application/json",
            user_key: upcApiKey,
          },
        }
      );
      const upcResult = await upcResponse.json();
      if (upcResult && upcResult.items && upcResult.items.length > 0) {
        const item = upcResult.items[0];
        setName(item.title || "");
        setDescription(item.description || "");
        Alert.alert(
          "Producto encontrado",
          "Nombre y descripción rellenados automáticamente (UPCitemdb)."
        );
      } else {
        Alert.alert(
          "No encontrado",
          "No se encontró el producto en ninguna base de datos."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo buscar el producto en internet.");
    }

    setTimeout(() => setScanned(false), 1000);
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
      barcode,
    };

    try {
      await addDoc(collection(db, "products"), newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente.");
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setStock("");
      setImage("");
      setQuantityPerUnit("");
      setUnit("");
      setBarcode("");
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

  if (scanning) {
    const cameraType = Camera.Constants?.Type?.back ?? "back";
    const barCodeTypes = [
      Camera.Constants?.BarCodeType?.ean13 ?? "ean13",
      Camera.Constants?.BarCodeType?.ean8 ?? "ean8",
      Camera.Constants?.BarCodeType?.upc_a ?? "upc_a",
      Camera.Constants?.BarCodeType?.upc_e ?? "upc_e",
      Camera.Constants?.BarCodeType?.code39 ?? "code39",
      Camera.Constants?.BarCodeType?.code128 ?? "code128",
    ];

    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing={cameraType}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: barCodeTypes,
          }}
          ref={(ref) => setCameraRef(ref)}
        />
        <Pressable
          style={[
            styles.button,
            { position: "absolute", bottom: 40, alignSelf: "center" },
          ]}
          onPress={() => setScanning(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón flotante para abrir la cámara */}
      <Pressable style={styles.scanButton} onPress={() => setScanning(true)}>
        <MaterialIcons name="qr-code-scanner" size={24} color="white" />
      </Pressable>

      <Text style={styles.title}>Crear Nuevo Producto</Text>

      <Text style={styles.label}>Nombre del producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Descripción del producto</Text>
      <TextInput
        style={[styles.input]}
        placeholder="Descripción del producto"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Categoría</Text>
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

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            placeholder="Precio"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Cantidad por unidad</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad(ej: 6, 500, 1)"
            value={quantityPerUnit}
            onChangeText={setQuantityPerUnit}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Unidad de medida</Text>
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
      </View>

      <View
        style={{
          flexDirection: "column",
          gap: 10,
          marginBottom: 1,
          marginTop: -25,
        }}
      >
        <Text style={styles.label}>Imagen</Text>
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
      </View>
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
          onPress={() => navigation.navigate("Tabs" , { screen: "AdminDashboard" })}
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
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 2,
    color: "#333",
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
    elevation: 3,
    shadowColor: "#000",
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
