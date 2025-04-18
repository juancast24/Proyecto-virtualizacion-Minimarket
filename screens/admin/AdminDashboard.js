import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import TablaEjemplo from '../../components/ProductsAdmin';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    alert('Menu');
  };
  const handleProfilePress = () => {
    alert('Perfil');
  };

  const handleCreateProductPress = () => {
    navigation.navigate('CreateProduct'); // Asegúrate de que 'CreateProduct' esté registrado en AdminNavigator
  };
  return (

    <View style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
      <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />
      <View>
        <Pressable style={styles.button} onPress={handleCreateProductPress}>
          <Text style={styles.buttonText}>Crear Nuevo Producto</Text>
        </Pressable>
      </View>
      <TablaEjemplo />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
