import {
  View,
  Text,
  Pressable,
  StyleSheet,
  BackHandler,
  TextInput,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomBarLayout from "../../components/BottomBarLayout";
import { StatusBar } from "react-native";
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";

const db = getFirestore(firebaseApp);

const RankingProductos = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "pedidos"),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          return;
        }
        const productosPorMes = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const fecha = data.fecha ? new Date(data.fecha) : null;
          if (!fecha || !Array.isArray(data.productos)) return;

          const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];

          // Formato: "MM-YYYY"
          const mes = `${meses[fecha.getMonth()]}-${String(
            fecha.getFullYear()
          ).padStart(2, "0")}`;

          data.productos.forEach((producto) => {
            const nombre = producto.name;
            const cantidad = producto.quantity || 0;

            if (!productosPorMes[mes]) productosPorMes[mes] = {};
            if (!productosPorMes[mes][nombre]) productosPorMes[mes][nombre] = 0;

            productosPorMes[mes][nombre] += cantidad;
          });
        });

        // Convierte el objeto a un array para la tabla
        const resultado = [];
        Object.entries(productosPorMes).forEach(([mes, productos]) => {
          Object.entries(productos).forEach(([nombre, cantidad]) => {
            resultado.push({ mes, nombre, cantidad });
          });
        });

        setProducts(resultado);
      },
      (error) => {
        console.error("Error al obtener productos:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const mesesUnicos = [
    ...new Set(products.map((item) => item.mes.split("-")[0])),
  ];
  const aniosUnicos = [
    ...new Set(products.map((item) => item.mes.split("-")[1])),
  ];

  // Filtrado
  const filteredProducts = products
    .filter(
      (item) =>
        item.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        item.mes.includes(searchText)
    )
    .filter(
      (item) =>
        (selectedMes === "" || item.mes.split("-")[0] === selectedMes) &&
        (selectedAnio === "" || item.mes.split("-")[1] === selectedAnio)
    );

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <StatusBar backgroundColor="#F6FDFF" barStyle="dark-content" />
      <BottomBarLayout>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Ventas de Productos</Text>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#000"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar producto..."
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  setCurrentPage(1); // Reiniciar página al buscar
                }}
              />
            </View>
            {/* Filtros de mes y año */}
            <View style={{ flexDirection: "row", marginVertical: 8 }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text>Mes:</Text>
                <ScrollView horizontal>
                  <Pressable
                    style={[
                      styles.button,
                      selectedMes === "" && { backgroundColor: "#7f8c8d" },
                    ]}
                    onPress={() => {
                      setSelectedMes("");
                      setCurrentPage(1);
                    }}
                  >
                    <Text style={styles.buttonText}>Todos</Text>
                  </Pressable>
                  {mesesUnicos.map((mes) => (
                    <Pressable
                      key={mes}
                      style={[
                        styles.button,
                        selectedMes === mes && { backgroundColor: "#16a085" },
                      ]}
                      onPress={() => {
                        setSelectedMes(mes);
                        setCurrentPage(1);
                      }}
                    >
                      <Text style={styles.buttonText}>{mes}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text>Año:</Text>
                <ScrollView horizontal>
                  <Pressable
                    style={[
                      styles.button,
                      selectedAnio === "" && { backgroundColor: "#7f8c8d" },
                    ]}
                    onPress={() => {
                      setSelectedAnio("");
                      setCurrentPage(1);
                    }}
                  >
                    <Text style={styles.buttonText}>Todos</Text>
                  </Pressable>
                  {aniosUnicos.map((anio) => (
                    <Pressable
                      key={anio}
                      style={[
                        styles.button,
                        selectedAnio === anio && { backgroundColor: "#16a085" },
                      ]}
                      onPress={() => {
                        setSelectedAnio(anio);
                        setCurrentPage(1);
                      }}
                    >
                      <Text style={styles.buttonText}>{anio}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.tabla}>
              {/* Encabezado de la tabla */}
              <View style={[styles.fila, styles.encabezado]}>
                <Text style={[styles.columna, styles.columnaHeader]}>
                  Producto
                </Text>
                <Text style={[styles.columna, styles.columnaHeader]}>
                  Cantidad Vendida
                </Text>
                <Text style={[styles.columna, styles.columnaHeader]}>Mes</Text>
              </View>
              {/* Filas de productos */}
              {paginatedProducts.map((item, idx) => (
                <View key={idx} style={styles.fila}>
                  <Text style={styles.columna}>{item.nombre}</Text>
                  <Text style={styles.columna}>{item.cantidad}</Text>
                  <Text style={styles.columna}>{item.mes}</Text>
                </View>
              ))}
            </View>
            {/* Controles de paginación */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 10,
              }}
            >
              <Pressable
                style={[styles.button, { marginHorizontal: 5 }]}
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <Text style={styles.buttonText}>Anterior</Text>
              </Pressable>
              <Text style={{ alignSelf: "center", marginHorizontal: 10 }}>
                Página {currentPage} de {totalPages}
              </Text>
              <Pressable
                style={[styles.button, { marginHorizontal: 5 }]}
                onPress={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <Text style={styles.buttonText}>Siguiente</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </BottomBarLayout>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F6FDFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContainer: {
    marginTop: 1,
    flexDirection: "row", // Alineación horizontal
    justifyContent: "space-between", // Espaciado entre los botones
    marginHorizontal: 10, // Margen horizontal para el contenedor
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    flex: 1, // Para que ambos botones tengan el mismo ancho
    marginHorizontal: 5, // Espaciado entre los botones
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 1,
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
  tabla: {
    borderColor: "transparent",
  },
  tabla: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 5,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    minHeight: 54,
  },
  encabezado: {
    flexDirection: "row",
    backgroundColor: "#2980b9",
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  columna: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  columnaHeader: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
});

export default RankingProductos;
