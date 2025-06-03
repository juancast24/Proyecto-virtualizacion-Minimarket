import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import BottomBarLayout from "../../components/BottomBarLayout";

// Pantalla para crear un nuevo usuario
const CreateUserScreen = ({ navigation }) => {
  
  const { onRegister } = useAuth(); // Obtiene la función de registro del contexto de autenticación

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState(""); // Nombre del usuario
  const [correo, setCorreo] = useState(""); // Correo electrónico
  const [telefono, setTelefono] = useState(""); // Teléfono
  const [rol, setRol] = useState(""); // Rol del usuario (admin/user)
  const [password, setPassword] = useState(""); // Contraseña

  // Función que maneja la creación del usuario
  const handleCreate = async () => {
    // Valida que los campos obligatorios estén completos
    if (!nombre || !correo || !password || !rol) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    try {
      // Llama a la función de registro del contexto de autenticación
      // El último argumento ("") es para la foto, que aquí no se usa
      const ok = await onRegister(correo, password, telefono, rol, nombre, "");
      if (ok) {
        Alert.alert("Éxito", "Usuario creado correctamente.");
        navigation.navigate("UserManagement"); // Vuelve a la pantalla anterior si se crea el usuario
      } else {
        Alert.alert("Error", "No se pudo crear el usuario.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el usuario.");
      console.error(error);
    }
  };

  return (
      <View style={styles.container}>
        {/* Título de la pantalla */}
        <Text style={styles.title}>Crear Usuario</Text>
        {/* Campo para el nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        {/* Campo para el correo electrónico */}
       <Text style={styles.label}>Corrreo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
        />
        {/* Campo para la contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {/* Campo para el teléfono */}
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
        />
        {/* Selector de rol */}
        <Text style={styles.label}>Rol</Text>
        <Picker
          selectedValue={rol}
          style={styles.picker}
          onValueChange={(itemValue) => setRol(itemValue)}
        >
          <Picker.Item label="Selecciona un rol..." value="" />
          <Picker.Item label="Usuario" value="user" />
          <Picker.Item label="Administrador" value="admin" />
        </Picker>
        {/* Botón para crear el usuario */}
        <Pressable style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Crear</Text>
        </Pressable>
        {/* Botón para volver a la pantalla de gestión de usuarios */}
        <Pressable
          style={[styles.button, { backgroundColor: "#e74c3c" }]}
          onPress={() => navigation.navigate("Tabs" , { screen: "UserManagement" })}
        >
          <Text style={styles.buttonText}>Atras</Text>
        </Pressable>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F6FDFF", marginTop: 20, height: "100%" },


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
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 2,
    color: "#333",
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
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default CreateUserScreen;
