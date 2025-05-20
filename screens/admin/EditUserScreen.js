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

const db = getFirestore(firebaseApp);

const EditUserScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      navigation.navigate("UserManagement");
      return true;
    };
    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, [navigation])
);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "usuarios", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNombre(data.nombre || "");
        setCorreo(data.correo || "");
        setTelefono(data.telefono || "");
        setRol(data.rol || "user");
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "usuarios", userId), {
        nombre,
        correo,
        telefono,
        rol,
      });
      Alert.alert("Éxito", "Usuario actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Usuario</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Rol (user/admin)"
          value={rol}
          onChangeText={setRol}
        />
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
