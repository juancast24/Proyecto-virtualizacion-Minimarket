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
import BottomBarLayout from "../../components/BottomBarLayout";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

// Pantalla principal para la gestión de usuarios
const UserManagementScreen = () => {
  // Estado para el texto de búsqueda
  const [searchText, setSearchText] = useState("");
  // Estado para almacenar todos los usuarios obtenidos de Firestore
  const [users, setUsers] = useState([]);
  // Estado para mostrar indicador de carga mientras se obtienen los usuarios
  const [loading, setLoading] = useState(true);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Obtiene el estado de autenticación del usuario
  const { authState } = useAuth();
  // Hook de navegación para cambiar de pantalla
  const navigation = useNavigation();

  // useEffect para obtener los usuarios de Firestore al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Obtiene todos los documentos de la colección "usuarios"
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usersArray = [];
        // Recorre cada documento y lo agrega al array de usuarios
        querySnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersArray); // Actualiza el estado con los usuarios obtenidos
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los usuarios.");
        console.error(error);
      } finally {
        setLoading(false); // Oculta el indicador de carga
      }
    };
    fetchUsers();
  }, []);

  // Filtra los usuarios según el texto de búsqueda (por nombre)
  const filteredData = users.filter(
    (item) =>
      (item.nombre || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.correo || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.telefono || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.rol || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginación: calcula los datos a mostrar en la página actual
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reinicia la página si el filtro cambia
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Elimina un usuario de Firestore y del estado local
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
              // Elimina el documento del usuario en Firestore
              await deleteDoc(doc(db, "usuarios", userId));
              // Actualiza el estado local eliminando el usuario
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

  // Navega a la pantalla de edición de usuario
  const handleEdit = (userId) => {
    navigation.navigate("EditUserScreen", { userId });
  };

  return (
    <BottomBarLayout> 
      <View style={styles.container}>
        {/* Título de la pantalla */}
        <Text style={styles.title}>Gestión de Usuarios</Text>
        {/* Buscador de usuarios */}
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
        {/* Tabla de usuarios */}
        <View style={styles.tabla}>
          {/* Encabezado de la tabla */}
          <View style={[styles.fila, styles.encabezado]}>
            <Text
              style={[styles.columna, { color: "white", fontWeight: "bold" }]}
            >
              Nombre
            </Text>
            <Text
              style={[styles.columna, { color: "white", fontWeight: "bold" }]}
            >
              Correo
            </Text>
            <Text
              style={[styles.columna, { color: "white", fontWeight: "bold" }]}
            >
              Teléfono
            </Text>
            <Text
              style={[styles.columna, { color: "white", fontWeight: "bold" }]}
            >
              Rol
            </Text>
            <Text
              style={[styles.columna, { color: "white", fontWeight: "bold" }]}
            >
              Acciones
            </Text>
          </View>
          {/* Muestra mensaje de carga, sin usuarios o la lista filtrada */}
          {loading ? (
            <Text style={{ textAlign: "center", margin: 10 }}>Cargando...</Text>
          ) : filteredData.length === 0 ? (
            <Text style={{ textAlign: "center", margin: 10 }}>
              No hay usuarios.
            </Text>
          ) : (
            // Renderiza cada usuario en una fila con acciones de editar y eliminar
            paginatedData.map((item, index) => (
              <View key={item.id} style={styles.fila}>
                <Text style={styles.columna}>{item.nombre}</Text>
                <Text style={styles.columna}>{item.correo}</Text>
                <Text style={styles.columna}>{item.telefono}</Text>
                <Text style={styles.columna}>{item.rol}</Text>
                <View style={[styles.columna, styles.actions]}>
                  {/* Botón para editar usuario */}
                  <Pressable onPress={() => handleEdit(item.id)}>
                    <Feather name="edit" size={24} color="#2980b9" />
                  </Pressable>
                  {/* Botón para eliminar usuario */}
                  <Pressable onPress={() => handleDelete(item.id, item.nombre)}>
                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
        {/* Controles de paginación */}
        {totalPages > 1 && (
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 8 }}>
            <Pressable
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: 8,
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#2980b9" />
            </Pressable>
            <Text style={{ marginHorizontal: 12 }}>
              Página {currentPage} de {totalPages}
            </Text>
            <Pressable
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: 8,
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              <Ionicons name="chevron-forward" size={24} color="#2980b9" />
            </Pressable>
          </View>
        )}
        {/* Botón para navegar a la pantalla de creación de usuario */}
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
    </BottomBarLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  tabla: {
    margin: 5,
    borderRadius: 12,
    backgroundColor: "#f4f8fb",
    overflow: "hidden",
    elevation: 2,
  },
  fila: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ef",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  encabezado: {
    backgroundColor: "#2980b9",
    borderBottomWidth: 2,
  },
  columna: {
    flex: 1,
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
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
    marginBottom: 10,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    fontSize: 16,
    color: "#000",
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    backgroundColor: "#F6FDFF",
  },
});

export default UserManagementScreen;