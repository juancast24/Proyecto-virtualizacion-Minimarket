import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";
import BottomBarLayout from "../../components/BottomBarLayout";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { showMessage } from "react-native-flash-message";

const db = getFirestore(firebaseApp);

// Pantalla para crear un nuevo usuario
const CreateUserScreen = ({ navigation }) => {
  const { onRegister } = useAuth(); // Obtiene la función de registro del contexto de autenticación

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState(""); // Nombre del usuario
  const [correo, setCorreo] = useState(""); // Correo electrónico
  const [telefono, setTelefono] = useState(""); // Teléfono
  const [rol, setRol] = useState(""); // Rol del usuario (admin/user)
  const [password, setPassword] = useState(""); // Contraseña
  const [direccion, setDireccion] = useState(""); // Dirección del usuario
  const [barrio, setBarrio] = useState(""); // Barrio del usuario
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const registerUser = async (
    correo,
    password,
    telefono,
    rol,
    nombre,
    direccion,
    barrio
  ) => {
    const auth = getAuth();
    const db = getFirestore();
    try {
      // Crea el usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );
      const user = userCredential.user;

      // Guarda datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        correo,
        telefono,
        rol,
        direccion,
        barrio,
        uid: user.uid,
        creadoEn: new Date(),
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Función que maneja la creación del usuario
  const handleCreate = async () => {
    animateButton();
    if (!nombre || !correo || !password || !rol || !direccion || !barrio) {
      showMessage({
        message: "Todos los campos son obligatorios.",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    setLoading(true);
    try {
      const ok = await registerUser(
        correo,
        password,
        telefono,
        rol,
        nombre,
        direccion,
        barrio
      );
      if (ok) {
        showMessage({
          message: "Usuario creado correctamente.",
          type: "success",
          icon: "success",
        });
        navigation.navigate("UserManagement");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showMessage({
          message: "El correo electrónico ya está registrado. Intenta con otro.",
          type: "warning",
          icon: "warning",
        });
      } else {
        showMessage({
          message: "No se pudo crear el usuario.",
          type: "danger",
          icon: "danger",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomBarLayout>
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
        {/* Campo para la dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={direccion}
          onChangeText={setDireccion}
        />
        {/* Campo para el barrio */}
        <Text style={styles.label}>Barrio</Text>
        <TextInput
          style={styles.input}
          placeholder="Barrio"
          value={barrio}
          onChangeText={setBarrio}
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
         <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
        >
          <Animated.View style={{ flex: 1, marginTop: 10, marginRight: 5, transform: [{ scale: scaleAnim }] }}>
            <Pressable
              style={styles.button}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creando..." : "Crear"}
              </Text>
            </Pressable>
          </Animated.View>
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: "#e74c3c",
                flex: 1,
                marginTop: 20,
                marginLeft: 5,
              },
            ]}
            onPress={() => navigation.navigate("UserManagement")}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </BottomBarLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F6FDFF",
    marginTop: 20,
    height: "100%",
  },
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
