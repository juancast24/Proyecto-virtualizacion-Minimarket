import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const HomeScreen = () => {
    const handleMenuPress = () => {
        alert('Menu');
    };
    const handleProfilePress = () => {
        alert('Perfil');
    };

    return (
        <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress}>
            <View>
                <Text>Bienvenidos a la tienda</Text>
            </View>
        </Header>
    );
};

export default HomeScreen;
