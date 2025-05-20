import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Layout from '../../components/Layout'; // Asegúrate de que esta ruta sea correcta
import { Ionicons } from '@expo/vector-icons'; // Para añadir iconos si lo deseas

const FormPay = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Obtener navigation para volver atrás si es necesario
  const { cartItems } = route.params || { cartItems: [] };

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    // ciudad: '', // Eliminado si solo se envía a Santander de Quilichao
    barrio: '',
    direccion: '',
    metodoPago: 'contra_entrega'
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const renderItem = ({ item }) => {
    const totalItemPrice = item.price * item.quantity;
    return (
      <View style={styles.cartItemCard}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemDetailText}>Cantidad: {item.quantity}</Text>
          <Text style={styles.itemDetailText}>Precio/u: ${item.price.toLocaleString('es-CL')}</Text>
        </View>
        <Text style={styles.itemSubtotal}>Subtotal: ${totalItemPrice.toLocaleString('es-CL')}</Text>
      </View>
    );
  };

  const calcularTotalGeneral = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleConfirmOrder = () => {

    console.log('Pedido confirmado con los siguientes datos:', form, 'y productos:', cartItems);
    alert('¡Pedido confirmado con éxito!'); 
  };

  return (
    <Layout>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header de la pantalla de pago */}
          <View style={styles.header}>
            <Text style={styles.title}>Resumen del Pedido</Text>
          </View>

          {/* Resumen de los Productos */}
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Productos</Text>
            <FlatList
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={(item, index) => item?.name ? item.name + index : index.toString()}
              scrollEnabled={false} 
            />
            <View style={styles.totalSummary}>
              <Text style={styles.totalLabel}>Total General:</Text>
              <Text style={styles.totalAmount}>${calcularTotalGeneral().toLocaleString('es-CL')}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Formulario de Datos de Envío */}
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Datos de Envío</Text>
            <Text style={styles.deliveryInfo}>
              <Ionicons name="information-circle-outline" size={16} color="#666" /> Solo se realizan envíos a Santander de Quilichao.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              onChangeText={text => handleChange('nombre', text)}
              value={form.nombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#999"
              onChangeText={text => handleChange('telefono', text)}
              keyboardType="phone-pad"
              value={form.telefono}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              onChangeText={text => handleChange('correo', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.correo}
            />
            <TextInput
              style={styles.input}
              placeholder="Barrio"
              placeholderTextColor="#999"
              onChangeText={text => handleChange('barrio', text)}
              value={form.barrio}
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección (Calle, número de casa/apto)"
              placeholderTextColor="#999"
              onChangeText={text => handleChange('direccion', text)}
              value={form.direccion}
            />
          </View>

          <View style={styles.separator} />

          {/* Método de Pago */}
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Método de Pago</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.metodoPago}
                onValueChange={(itemValue) => handleChange('metodoPago', itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem} 
              >
                <Picker.Item label="Contra entrega" value="contra_entrega" />
                <Picker.Item label="PSE " value="pse"/>
              </Picker>
            </View>
          </View>

          {/* Botón Confirmar Pedido */}
          <Pressable
            onPress={handleConfirmOrder}
            style={({ pressed }) => [
              styles.confirmButton,
              { backgroundColor: pressed ? '#388E3C' : '#4CAF50' },
            ]}
          >
            <Text style={styles.confirmButtonText}>Confirmar pedido</Text>
          </Pressable>
        </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, 
    textAlign: 'center', 
    marginRight: 45, 
  },
  sectionWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  cartItemCard: {
    backgroundColor: '#F9F9F9', 
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemDetailText: {
    fontSize: 14,
    color: '#666',
  },
  itemSubtotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    marginTop: 5,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', 
  },

  separator: {
    height: 2,
    backgroundColor: '#EEE',
    marginVertical: 10,
    marginHorizontal: 10,
  },

  deliveryInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  picker: {
    height: 50, 
    width: '100%',
  },
  pickerItem: { 
    fontSize: 16,
    color: '#333',
  },

  confirmButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FormPay;