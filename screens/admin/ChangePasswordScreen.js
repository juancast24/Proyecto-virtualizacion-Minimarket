import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

// Pantalla para cambiar la contraseña del usuario autenticado
const ChangePasswordScreen = ({ navigation }) => {
  const { authState } = useAuth(); // Obtiene el estado de autenticación del contexto
  const [currentPassword, setCurrentPassword] = useState(""); // Estado para la contraseña actual
  const [newPassword, setNewPassword] = useState(""); // Estado para la nueva contraseña
  const [loading, setLoading] = useState(false); // Estado para mostrar indicador de carga

  // Función para reautenticar al usuario antes de cambiar la contraseña
  const reauthenticate = async (currentPassword) => {
    const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
    const user = auth.currentUser; // Obtiene el usuario actual
    // Crea las credenciales con el email y la contraseña actual
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    // Reautentica al usuario con las credenciales
    return reauthenticateWithCredential(user, credential);
  };

  // Maneja el proceso de cambio de contraseña
  const handleChangePassword = async () => {
    // Valida que ambos campos estén completos
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }
    setLoading(true); // Muestra indicador de carga
    try {
      // Reautentica al usuario antes de cambiar la contraseña
      await reauthenticate(currentPassword);
      const auth = getAuth();
      // Cambia la contraseña del usuario autenticado
      await updatePassword(auth.currentUser, newPassword);
      // Muestra mensaje de éxito y regresa a la pantalla anterior
      Alert.alert("Éxito", "Contraseña actualizada correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // Maneja errores comunes de autenticación y muestra mensajes apropiados
      let msg = "Error al cambiar la contraseña.";
      if (error.code === "auth/wrong-password")
        msg = "La contraseña actual es incorrecta.";
      if (error.code === "auth/weak-password")
        msg = "La nueva contraseña es muy débil.";
      Alert.alert("Error", msg);
    }
    setLoading(false); // Oculta indicador de carga
  };

  return (
    <View>
      <View style={styles.container}>
        {/* Título de la pantalla */}
        <Text style={styles.title}>Cambiar contraseña</Text>
        {/* Campo para la contraseña actual */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña actual"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        {/* Campo para la nueva contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        {/* Botón para cambiar la contraseña */}
        <Pressable
          style={styles.button}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </Text>
        </Pressable>
        {/* Botón para cancelar y volver atrás */}
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0077B6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelText: { color: "#0077B6", textAlign: "center", marginTop: 8 },
});

export default ChangePasswordScreen;
