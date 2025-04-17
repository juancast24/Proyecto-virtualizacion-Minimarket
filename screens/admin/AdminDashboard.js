import React from 'react';
import { View, Text, Image } from 'react-native';
import TablaEjemplo from '../../components/ProductsAdmin';
import Header from '../../components/Header';

const AdminDashboard = () => {

  const handleMenuPress = () => {
    alert('Menu');
};
const handleProfilePress = () => {
    alert('Perfil');
};
  return (

    
    <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress}>
            <View>
                <Text>Bienvenido administrador</Text>
            </View>
            <TablaEjemplo />
        </Header>
  );
};

export default AdminDashboard;
