import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import Layout from "../../components/Layout";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";

const db = getFirestore(firebaseApp);

const UserManagementScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { authState } = useAuth();
  const navigation = useNavigation();

  // Leer usuarios desde Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usersArray = [];
        querySnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersArray);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los usuarios.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrar los datos según el texto de búsqueda
  const filteredData = users.filter((item) =>
    (item.nombre || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (userId, userName) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar a "${userName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "usuarios", userId));
              setUsers((prev) => prev.filter((u) => u.id !== userId));
              Alert.alert(
                "Éxito",
                `El usuario "${userName}" ha sido eliminado.`
              );
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  // Editar usuario (puedes navegar a una pantalla de edición)
  const handleEdit = (userId) => {
    navigation.navigate("EditUserScreen", { userId });
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Busqueda por nombre..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {/* Tabla */}
        <View style={styles.tabla}>
          <View style={[styles.fila, styles.encabezado]}>
            <Text style={[styles.columna]}>Nombre</Text>
            <Text style={[styles.columna]}>Correo</Text>
            <Text style={[styles.columna]}>Teléfono</Text>
            <Text style={[styles.columna]}>Rol</Text>
            <Text style={[styles.columna]}>Acciones</Text>
          </View>
          {loading ? (
            <Text style={{ textAlign: "center", margin: 10 }}>Cargando...</Text>
          ) : filteredData.length === 0 ? (
            <Text style={{ textAlign: "center", margin: 10 }}>
              No hay usuarios.
            </Text>
          ) : (
            filteredData.map((item, index) => (
              <View key={item.id} style={styles.fila}>
                <Text style={styles.columna}>{item.nombre}</Text>
                <Text style={styles.columna}>{item.correo}</Text>
                <Text style={styles.columna}>{item.telefono}</Text>
                <Text style={styles.columna}>{item.rol}</Text>
                <View style={[styles.columna, styles.actions]}>
                  <Pressable onPress={() => handleEdit(item.id)}>
                    <Feather name="edit" size={24} color="#2980b9" />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(item.id, item.nombre)}>
                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
        <Pressable
          style={{
            backgroundColor: "#2980b9",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
            marginVertical: 10,
          }}
          onPress={() => navigation.navigate("CreateUserScreen")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Crear Usuario
          </Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  tabla: {
    margin: 5,
    borderColor: "transparent",
    borderRadius: 10,
  },
  fila: {
    flexDirection: "row",
    padding: 10,
    borderColor: "trnsparent",
    borderRadius: 8,
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  encabezado: {
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#2980b9",
  },
  columna: {
    flex: 1,
    fontSize: 10,
    textAlign: "center",
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 5,
    width: 60,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    fontSize: 16,
    color: "#000",
  },
});

export default UserManagementScreen;
