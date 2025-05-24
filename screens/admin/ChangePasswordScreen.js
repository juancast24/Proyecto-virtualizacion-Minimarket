import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import Layout from "../../components/Layout";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

const ChangePasswordScreen = ({ navigation }) => {
  const { authState } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Reautentica al usuario antes de cambiar la contraseña
  const reauthenticate = async (currentPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await reauthenticate(currentPassword);
      const auth = getAuth();
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Éxito", "Contraseña actualizada correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      let msg = "Error al cambiar la contraseña.";
      if (error.code === "auth/wrong-password") msg = "La contraseña actual es incorrecta.";
      if (error.code === "auth/weak-password") msg = "La nueva contraseña es muy débil.";
      Alert.alert("Error", msg);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Cambiar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña actual"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Pressable style={styles.button} onPress={handleChangePassword} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Cambiando..." : "Cambiar contraseña"}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16,
  },
  button: {
    backgroundColor: "#0077B6", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelText: { color: "#0077B6", textAlign: "center", marginTop: 8 },
});

export default ChangePasswordScreen;