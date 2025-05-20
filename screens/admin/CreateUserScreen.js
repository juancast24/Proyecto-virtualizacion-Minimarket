import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { Picker } from "@react-native-picker/picker";
import Layout from "../../components/Layout";

const db = getFirestore(firebaseApp);

const CreateUserScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  const handleCreate = async () => {
    if (!nombre || !correo) {
      Alert.alert("Error", "Nombre y correo son obligatorios.");
      return;
    }
    try {
      // Genera un ID único (puedes usar uuid o similar)
      const userId = Date.now().toString();
      await setDoc(doc(db, "usuarios", userId), {
        nombre,
        correo,
        telefono,
        rol,
      });
      Alert.alert("Éxito", "Usuario creado correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el usuario.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
        />
        <Picker
          selectedValue={rol}
          style={styles.picker}
          onValueChange={(itemValue) => setRol(itemValue)}
        >
          <Picker.Item label="Selecciona un rol..." value="" />
          <Picker.Item label="Usuario" value="user" />
          <Picker.Item label="Administrador" value="admin" />
        </Picker>
        <Pressable style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Crear</Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 50,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default CreateUserScreen;
