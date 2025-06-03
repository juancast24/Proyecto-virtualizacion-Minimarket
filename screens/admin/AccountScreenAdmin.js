import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import { getAuth, updatePassword } from "firebase/auth";
import BottomBarLayout from "../../components/BottomBarLayout";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

const AccountScreen = ({ navigation }) => {
  const { authState, onLogout, setUser } = useAuth();

  // Modal editar info
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    nombre: authState.user?.nombre || "",
    telefono: authState.user?.telefono || "",
    direccion: authState.user?.direccion || "",
    barrio: authState.user?.barrio || "",
  });

  const openEditModal = () => {
    setEditData({
      nombre: authState.user?.nombre || "",
      telefono: authState.user?.telefono || "",
      direccion: authState.user?.direccion || "",
      barrio: authState.user?.barrio || "",
    });
    setEditModalVisible(true);
  };

  const closeEditModal = () => setEditModalVisible(false);

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, "usuarios", authState.user.uid);
      await updateDoc(userRef, editData);
      // Actualiza el usuario en el contexto si tienes setUser
      if (setUser) setUser({ ...authState.user, ...editData });
      alert("Información actualizada correctamente.");
      closeEditModal();
    } catch (e) {
      alert("Error al actualizar: " + e.message);
    }
  };

  // Modal cambiar contraseña
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const openPasswordModal = () => setModalVisible(true);
  const closePasswordModal = () => {
    setModalVisible(false);
    setNewPassword("");
  };

  const handleChangePassword = async (newPassword) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        alert(
          "Contraseña actualizada correctamente. Por seguridad, debes volver a iniciar sesión con tu nueva contraseña."
        );
        onLogout();
      } else {
        alert("No hay usuario autenticado.");
      }
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        alert(
          "Por seguridad, debes volver a iniciar sesión para cambiar la contraseña. Se cerrará tu sesión."
        );
        onLogout();
      } else {
        alert("Error al cambiar la contraseña: " + error.message);
      }
    }
  };

  const onConfirmChangePassword = async () => {
    if (newPassword.trim().length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    await handleChangePassword(newPassword);
    closePasswordModal();
  };

  const handleLogout = () => {
    onLogout();
  };

  if (!authState.user) {
    return (
      <BottomBarLayout>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0077B6" />
        </View>
      </BottomBarLayout>
    );
  }

  return (
    <BottomBarLayout>
      <> 
      {/* MODAL PARA CAMBIO DE CONTRASEÑA */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePasswordModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 12,
              width: "80%",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
            >
              Cambiar contraseña
            </Text>
            <TextInput
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Pressable
                onPress={onConfirmChangePassword}
                style={({ pressed }) => [
                  styles.buttonPrimary,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.buttonTextPrimary}>Guardar</Text>
              </Pressable>
              <Pressable
                onPress={closePasswordModal}
                style={({ pressed }) => [
                  styles.buttonSecondary,
                  { marginLeft: 8, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.buttonTextSecondary}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* FIN MODAL */}

      {/* MODAL PARA EDITAR INFORMACIÓN */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 12,
              width: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Editar información
            </Text>
            <Text style={{ fontSize: 14, color: "#4A6572", marginBottom: 4 }}>
              Nombre
            </Text>
            <TextInput
              placeholder="Nombre"
              value={editData.nombre}
              onChangeText={(text) => handleEditChange("nombre", text)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />

            <Text style={{ fontSize: 14, color: "#4A6572", marginBottom: 4 }}>
              Teléfono
            </Text>
            <TextInput
              placeholder="Teléfono"
              value={editData.telefono}
              onChangeText={(text) => handleEditChange("telefono", text)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
              keyboardType="phone-pad"
            />

            <Text style={{ fontSize: 14, color: "#4A6572", marginBottom: 4 }}>
              Dirección
            </Text>
            <TextInput
              placeholder="Dirección"
              value={editData.direccion}
              onChangeText={(text) => handleEditChange("direccion", text)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            />
            <Text style={{ fontSize: 14, color: "#4A6572", marginBottom: 4 }}>
              Barrio
            </Text>
            <TextInput
              placeholder="Barrio"
              value={editData.barrio}
              onChangeText={(text) => handleEditChange("barrio", text)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Pressable
                onPress={handleSaveEdit}
                style={({ pressed }) => [
                  styles.buttonPrimary,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.buttonTextPrimary}>Guardar</Text>
              </Pressable>
              <Pressable
                onPress={closeEditModal}
                style={({ pressed }) => [
                  styles.buttonSecondary,
                  { marginLeft: 8, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.buttonTextSecondary}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* FIN MODAL */}

      <View style={styles.container}>
        {/* Encabezado del perfil con avatar, nombre y rol */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {authState.user.nombre
                ? authState.user.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "US"}
            </Text>
          </View>
          <Text style={styles.title}>{authState.user.nombre || "Usuario"}</Text>
        </View>

        {/* Tarjeta con información personal */}
        <View style={styles.card}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            {/* Fila de email */}
            <View style={styles.infoRow}>
              <MaterialIcons
                name="email"
                size={20}
                color="#4A6572"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>
                {authState.user.correo || authState.user.email}
              </Text>
            </View>

            {/* Fila de teléfono */}
            <View style={styles.infoRow}>
              <MaterialIcons
                name="phone"
                size={20}
                color="#4A6572"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>
                {authState.user.telefono || "-"}
              </Text>
            </View>
            {/* Fila de dirección */}
            <View style={styles.infoRow}>
              <MaterialIcons
                name="home"
                size={20}
                color="#4A6572"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>
                {authState.user.direccion || "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons
                name="location-city"
                size={20}
                color="#4A6572"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Barrio:</Text>
              <Text style={styles.infoValue}>
                {authState.user.barrio || "-"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#0077B6",
              padding: 10,
              borderRadius: 30,
              alignItems: "center",
              marginBottom: 5,
              marginTop: 10,
            }}
            onPress={openEditModal}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Editar información
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección de seguridad */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}> Seguridad</Text>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#4A6572"
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Clave de acceso:</Text>
            <Text style={styles.infoValue}>***********</Text>
            {/* Botón para cambiar la contraseña */}
            <Pressable onPress={openPasswordModal}>
              <Feather name="edit" size={20} color="#4A6572" />
            </Pressable>
          </View>
        </View>

        {/* Botón para cerrar sesión */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons
            name="logout"
            size={20}
            color="#ffffff"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
      </>
      </BottomBarLayout>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 1,
    backgroundColor: "#F6FDFF",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0077B6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#263238",
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A6572",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  infoSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#263238",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4A6572",
    width: 75,
  },
  infoValue: {
    fontSize: 16,
    color: "#263238",
    flex: 1,
  },
  menuSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#0077B6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuText: {
    fontSize: 16,
    color: "#263238",
    fontWeight: "500",
    flex: 1,
  },
  menuArrow: {
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: "auto",
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "#0077B6",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#0077B6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  buttonSecondary: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonTextSecondary: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default AccountScreen;
