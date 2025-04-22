import React from 'react';
import { View, Text } from 'react-native';
import Header from '../../components/Header';

const UserDashboard = ({ navigation }) => {
    const handleCartPress = () => {
        navigation.navigate('CartScreen'); // Redirigir al carrito
    };

    return (
        <View>
            <Header 
                onMenuPress={() => console.log('Menu pressed')}
                onProfilePress={() => console.log('Profile pressed')}
                onCartPress={handleCartPress}  // Pasar la función aquí
            />
            <Text>Bienvenido al Dashboard del Usuario</Text>
        </View>
    );
};

export default UserDashboard;
