import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

const db = getFirestore(firebaseApp);

const generarHTMLRecibo = (pedido, pedidoId) => {
  const impuesto = pedido?.total ? pedido.total * 0.19 : 0;
  const subtotal = pedido?.total ? pedido.total - impuesto : 0;
  const productosHtml = Array.isArray(pedido.productos)
    ? pedido.productos
        .map(
          (item) =>
            `<tr>
            <td style="text-align:left;">${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toLocaleString("es-CL")}</td>
            <td>$${(item.price * item.quantity).toLocaleString("es-CL")}</td>
          </tr>`
        )
        .join("")
    : "";

  return `
    <html>
      <head>
        <style>
          @page {
            size: 80mm 200mm;
            margin: 0;
          }
          html, body {
            width: 80mm;
            height: 200mm;
            margin: 0;
            padding: 0;
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            color: #222;
            background: #fff;
          }
          .recibo-box {
            width: 100%;
            border: 1px dashed #888;
            padding: 10px 8px 18px 8px;
            background: #fff;
            box-sizing: border-box;
          }
          .logo {
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 6px;
            letter-spacing: 2px;
          }
          .separator {
            border-top: 1px dashed #888;
            margin: 8px 0;
          }
          .info {
            margin-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 8px;
          }
          th, td {
            padding: 2px 4px;
            font-size: 13px;
          }
          th {
            border-bottom: 1px solid #888;
            text-align: left;
            font-weight: bold;
            background: #f8f8f8;
          }
          td {
            border-bottom: 1px dotted #ccc;
          }
          .total {
            font-size: 17px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
            margin-bottom: 6px;
          }
          .footer {
            text-align: center;
            margin-top: 16px;
            font-size: 13px;
            font-style: italic;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="recibo-box">
          <div class="logo">La Economia</div>
          <div class="separator"></div>
          <div class="info"><b>Código del Recibo:</b> ${pedidoId}</div>
          <div class="info"><b>Cliente:</b> ${pedido.usuario?.nombre || ""}</div>
          <div class="info"><b>Tel:</b> ${pedido.usuario?.telefono || ""}</div>
          <div class="info"><b>Correo:</b> ${pedido.usuario?.correo || ""}</div>
          <div class="info"><b>Barrio:</b> ${pedido.usuario?.barrio || ""}</div>
          <div class="info"><b>Dirección:</b> ${pedido.usuario?.direccion || ""}</div>
          <div class="info"><b>Método de pago:</b> ${pedido.usuario?.metodoPago || ""}</div>
          <div class="info"><b>Fecha:</b> ${pedido.fecha ? new Date(pedido.fecha).toLocaleString() : ""}</div>
          <div class="separator"></div>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant</th>
                <th>P/U</th>
                <th>Subt</th>
              </tr>
            </thead>
            <tbody>
              ${productosHtml}
            </tbody>
          </table>
          <div class="separator"></div>
          <div class="total">SUBTOTAL: $${subtotal.toLocaleString("es-CL")}</div>
          <div class="total">IVA (19%): $${impuesto.toLocaleString("es-CL")}</div>
          <div class="total">TOTAL: $${pedido.total?.toLocaleString("es-CL") || "0"}</div>
          <div class="info"><b>Estado:</b> ${pedido.estado || ""}</div>
          <div class="footer">¡Gracias por su compra!</div>
        </div>
      </body>
    </html>
  `;
};

const ReciboScreen = () => {
  const route = useRoute();
  const { pedidoId } = route.params || {};
  const navigation = useNavigation();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      if (!pedidoId) return;
      try {
        const pedidoRef = doc(db, "pedidos", pedidoId);
        const pedidoSnap = await getDoc(pedidoRef);
        if (pedidoSnap.exists()) {
          setPedido(pedidoSnap.data());
        }
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [pedidoId]);

  const handleDescargarPDF = async () => {
    if (!pedido) return;
    const html = generarHTMLRecibo(pedido, pedidoId);
    const { uri } = await Print.printToFileAsync({
      html,
      pageSize: { width: 80, height: 200, unit: "mm" },
    });
    await Sharing.shareAsync(uri);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando recibo...</Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró el pedido.</Text>
      </View>
    );
  }

  // Calcular impuestos y subtotal
  const impuesto = pedido?.total ? pedido.total * 0.19 : 0;
  const subtotal = pedido?.total ? pedido.total - impuesto : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          borderRadius: 30,
          backgroundColor: "#fff",
          elevation: 8,
          shadowColor: "#0288D1",
          shadowOpacity: 0.1,
          shadowRadius: 30,
          marginBottom: 20,
          marginHorizontal: 10,
        }}
      >
        <View style={styles.unic}>
          <Text style={styles.title}>Recibo de compra</Text>
          <Text style={styles.label}>
            Codigo del Recibo: <Text style={styles.value}>{pedidoId}</Text>
          </Text>
          <Text style={styles.label}>
            Cliente: <Text style={styles.value}>{pedido.usuario?.nombre || ""}</Text>
          </Text>
          <Text style={styles.label}>
            Teléfono: <Text style={styles.value}>{pedido.usuario?.telefono || ""}</Text>
          </Text>
          <Text style={styles.label}>
            Correo: <Text style={styles.value}>{pedido.usuario?.correo || ""}</Text>
          </Text>
          <Text style={styles.label}>
            Barrio: <Text style={styles.value}>{pedido.usuario?.barrio || ""}</Text>
          </Text>
          <Text style={styles.label}>
            Dirección: <Text style={styles.value}>{pedido.usuario?.direccion || ""}</Text>
          </Text>
          <Text style={styles.label}>
            Método de pago: <Text style={styles.value}>{pedido.usuario?.metodoPago || ""}</Text>
          </Text>
          <Text style={styles.label}>
            Fecha:{" "}
            <Text style={styles.value}>
              {pedido.fecha ? new Date(pedido.fecha).toLocaleString() : ""}
            </Text>
          </Text>
          <Text style={[styles.label, { marginTop: 16 }]}>Productos:</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Producto</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Cantidad</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Precio/u</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Subtotal</Text>
          </View>
          {Array.isArray(pedido.productos) &&
            pedido.productos.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>
                  ${item.price.toLocaleString("es-CL")}
                </Text>
                <Text style={styles.tableCell}>
                  ${(item.price * item.quantity).toLocaleString("es-CL")}
                </Text>
              </View>
            ))}
          <Text style={styles.total}>
            Subtotal: ${subtotal.toLocaleString("es-CL")}
          </Text>
          <Text style={styles.total}>
            IVA (19%): ${impuesto.toLocaleString("es-CL")}
          </Text>
          <Text style={styles.total}>
            Total: ${pedido.total?.toLocaleString("es-CL") || "0"}
          </Text>
          <Text style={styles.label}>
            Estado: <Text style={styles.value}>{pedido.estado || ""}</Text>
          </Text>
          <Pressable style={styles.button} onPress={handleDescargarPDF}>
            <Text style={styles.buttonText}>Descargar PDF</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: "#1976D2", marginTop: 12 }]}
            onPress={() => navigation.navigate("Tabs", { screen: "OrderHistory" })}
          >
            <Text style={styles.buttonText}>Volver a mis pedidos</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#F6FDFF",
    height: "100%",
  },
  unic: {
    padding: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 4,
  },
  value: {
    fontWeight: "normal",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "right",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReciboScreen;