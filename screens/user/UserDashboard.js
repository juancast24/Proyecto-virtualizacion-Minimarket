import React from 'react';
import Header from '../../components/Header';
import HomeScreen from '../public/HomeScreen';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = ({ navigation }) => {


  const { authState } = useAuth();

    const handleCartPress = () => {
        navigation.navigate('CartScreen'); // Redirigir al carrito
    };

    return (
        <HomeScreen>
            <Header
                onMenuPress={() => console.log('Menu pressed')}
                onProfilePress={() => console.log('Profile pressed')}
                onCartPress={handleCartPress}  // Pasar la función aquí
            />
        </HomeScreen>
    );
};

export default UserDashboard;
