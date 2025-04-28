import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput } from 'react-native';
import Header from '../../components/Header';
import {useAuth} from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const OrdersScreen = () => {

  const { authState } = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchText, setSearchText] = useState('');

  const orders = [
    { id: '1', name: 'Juan Pérez', date: '2025-04-17', status: 'Pendiente', items: ['Manzana', 'Pan'], total: 4500, address: 'Calle Falsa 123' },
    { id: '2', name: 'Ana López', date: '2025-04-16', status: 'Enviado', items: ['Leche', 'Huevos'], total: 18000, address: 'Calle Falsa 12143' },
    // Agrega más pedidos aquí
  ];

   // Filtrar pedidos según el texto de búsqueda
   const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePressOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleMenuPress = () => {
    alert('Menu');
  };
  const handleProfilePress = () => {
    if (authState.authenticated) {
        navigation.navigate('AccountScreenAdmin'); // si ya está logueado, ve al perfil
    }else{  
        navigation.navigate('Login');// si no está logueado, ve al login
    }
};
  
  const renderOrder = ({ item }) => (
    
            <View style={styles.row}>
                <Text style={styles.cell}>{item.id}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.date}</Text>
                <Text style={styles.cell}>{item.status}</Text>
                <Text style={styles.cell}>{item.address}</Text>
                <Pressable style={styles.actionButton} onPress={() => handlePressOrder(item)}>
                    <Text style={styles.actionButtonText}>Ver</Text>
                </Pressable>
            </View>
    
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#grey', padding: 10 }}>
        <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />
      <Text style={styles.title}>Pedidos</Text>

      {/* Buscador */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Nombre</Text>
        <Text style={styles.headerCell}>Fecha</Text>
        <Text style={styles.headerCell}>Estado</Text>
        <Text style={styles.headerCell}>Dirección</Text>
        <Text style={styles.headerCell}>Acción</Text>
      </View>
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
      />
      {selectedOrder && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles del Pedido</Text>
              <Text>ID: {selectedOrder.id}</Text>
              <Text>Nombre: {selectedOrder.name}</Text>
              <Text>Artículos: {selectedOrder.items.join(', ')}</Text>
              <Text>Total: ${selectedOrder.total.toFixed(2)}</Text>
              <Text>Fecha: {selectedOrder.date}</Text>
              <Text>Estado: {selectedOrder.status}</Text>
              <Pressable
                style={styles.editButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.editButtonText}>Editar estado</Text>
              </Pressable>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 9,
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: '#2980b9',
    padding: 5,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default OrdersScreen;