import React from 'react';
import { Text, StyleSheet, Button, View } from 'react-native';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';  // Custom hook para carrito y sesión

const AccountScreen = ({ navigation }) => {
    const { logout } = useCart();  // función para cerrar sesión y limpiar carrito

    const handleLogout = () => {
        logout();  // limpia carrito y usuario
        navigation.navigate('Login');  // redirige al login
    };

    return (
        <Layout>
            <Text style={styles.title}>Mi Cuenta</Text>
            <Text>Nombre: Juan Pérez</Text>
            <Text>Email: juan@example.com</Text>
            <Text>Teléfono: +123456789</Text>

            <View style={styles.logoutContainer}>
                <Button title="Cerrar sesión" onPress={handleLogout} />
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    logoutContainer: {
        marginTop: 20,
    }
});

export default AccountScreen;
