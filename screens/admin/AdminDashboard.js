import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {useAuth} from '../../context/AuthContext';
import TablaEjemplo from '../../components/ProductsAdmin';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();

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

  const handleCreateProductPress = () => {
    navigation.navigate('CreateProduct'); // Navegar a la pantalla de creación de productos.
  };

  const handleOrdersPress = () => {
    navigation.navigate('OrdersScreen'); // Navegar a la pantalla de pedidos.
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#grey' }}>
      <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />
      <Text style={styles.title}>Productos</Text>
      <TablaEjemplo />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleCreateProductPress}>
          <Text style={styles.buttonText}>Crear Producto</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleOrdersPress}>
          <Text style={styles.buttonText}>Ver Pedidos</Text>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row', // Alineación horizontal
    justifyContent: 'space-between', // Espaciado entre los botones
    marginHorizontal: 10, // Margen horizontal para el contenedor
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    flex: 1, // Para que ambos botones tengan el mismo ancho
    marginHorizontal: 5, // Espaciado entre los botones
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AdminDashboard;
