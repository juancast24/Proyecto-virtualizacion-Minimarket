import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { useFocusEffect } from "@react-navigation/native";
import Layout from "../../components/Layout";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

// Pantalla para editar un usuario existente
const EditUserScreen = ({ route, navigation }) => {
  // Obtiene el ID del usuario desde los parámetros de navegación
  const { userId } = route.params;

  // Estados para los campos del formulario del usuario
  const [nombre, setNombre] = useState("");     // Nombre del usuario
  const [correo, setCorreo] = useState("");     // Correo electrónico del usuario
  const [telefono, setTelefono] = useState(""); // Teléfono del usuario
  const [rol, setRol] = useState("");           // Rol del usuario (user/admin)

  // useFocusEffect para manejar el botón físico "Atrás" en Android
  useFocusEffect(
    React.useCallback(() => {
      // Cuando se presiona "Atrás", navega a la pantalla de gestión de usuarios
      const onBackPress = () => {
        navigation.navigate("UserManagement");
        return true; // Evita el comportamiento por defecto
      };
      // Suscribe el evento al montar la pantalla
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      // Limpia la suscripción al desmontar la pantalla
      return () => subscription.remove();
    }, [navigation])
  );

  // useEffect para cargar los datos actuales del usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      // Obtiene el documento del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "usuarios", userId));
      if (userDoc.exists()) {
        // Si el usuario existe, actualiza los estados con los datos actuales
        const data = userDoc.data();
        setNombre(data.nombre || "");
        setCorreo(data.correo || "");
        setTelefono(data.telefono || "");
        setRol(data.rol || "user");
      }
    };
    fetchUser(); // Llama a la función para cargar los datos
  }, [userId]);

  // Función para actualizar el usuario en Firestore
  const handleUpdate = async () => {
    try {
      // Actualiza el documento del usuario con los nuevos valores
      await updateDoc(doc(db, "usuarios", userId), {
        nombre,
        correo,
        telefono,
        rol,
      });
      // Muestra alerta de éxito y regresa a la pantalla anterior
      Alert.alert("Éxito", "Usuario actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      // Muestra alerta de error si falla la actualización
      Alert.alert("Error", "No se pudo actualizar el usuario.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Usuario</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Rol</Text>
          <TextInput
            style={styles.input}
            placeholder="Rol (user/admin)"
            value={rol}
            onChangeText={setRol}
            placeholderTextColor="#aaa"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: "#206090" },
          ]}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && { backgroundColor: "#b71c1c" },
          ]}
          onPress={() => navigation.navigate("UserManagement")}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7fafd",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#2980b9",
    letterSpacing: 1,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: "#2980b9",
    marginBottom: 4,
    fontWeight: "600",
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b5c9d6",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#222",
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    elevation: 2,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default EditUserScreen;
