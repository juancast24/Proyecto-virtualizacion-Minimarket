import React from 'react';
import { Text, StyleSheet, Button, View, Pressable } from 'react-native';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';  // Custom hook para carrito y sesión

const AccountScreen = ({ navigation }) => {
    
    const { logout } = useCart();

    const handleLogout = async () => {
        try {
            await logout();  // limpia carrito y usuario
            navigation.navigate('Login');  // redirige al login
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <Layout>
            <Text style={styles.title}>Mi Cuenta</Text>
            <Text>Nombre: Daniel Alejandro</Text>
            <Text>Email: danie@example.com</Text>
            <Text>Teléfono: +123456789</Text>
            <View style={{ marginTop: 20 }}>
                <Pressable 
                    style={styles.button} 
                    onPress={() => navigation.navigate('AdminDashboard')}
                >
                    <Text style={styles.buttonText}>Productos</Text>
                </Pressable>
            </View>
            <View style={{ marginTop: 20 }}>
                <Pressable 
                    style={styles.button} 
                    onPress={() => navigation.navigate('UserManagement')}
                >
                    <Text style={styles.buttonText}>Gestionar Usuarios</Text>
                </Pressable>
            </View>

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
    },button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    }
});

export default AccountScreen;
