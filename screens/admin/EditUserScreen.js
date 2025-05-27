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
        {/* Título de la pantalla */}
        <Text style={styles.title}>Editar Usuario</Text>
        {/* Campo para el nombre */}
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        {/* Campo para el correo */}
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
        />
        {/* Campo para el teléfono */}
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
        />
        {/* Campo para el rol */}
        <TextInput
          style={styles.input}
          placeholder="Rol (user/admin)"
          value={rol}
          onChangeText={setRol}
        />
        {/* Botón para actualizar el usuario */}
        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar</Text>
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
  button: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default EditUserScreen;
