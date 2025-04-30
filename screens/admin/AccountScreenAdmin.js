import React from 'react';
import { Text, StyleSheet, Button, View, Pressable } from 'react-native';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';  // Custom hook para carrito y sesión

const AccountScreen = ({ navigation }) => {
    const { onLogout } = useAuth(); // Obtén la función logout del contexto
    
    const handleLogout = async () => {
        try {
            onLogout(); // Llama al método logout del contexto para limpiar la sesión
            // Redirige al HomeScreen
            navigation.navigate('Home');
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
                <Pressable style={styles.button} 
                    onPress={() => navigation.navigate('UserManagement')}
                >
                    <Text style={styles.buttonText}>Gestionar Usuarios</Text>
                </Pressable>
            </View>

            <View style={styles.logoutContainer}>
                <Pressable style={styles.button_logout} title="Cerrar sesión" onPress={handleLogout}> 
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </Pressable> 
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    logoutContainer: {
        marginTop: "65%",
        marginBottom: 50,
        width: '65%',
        alignSelf: 'center',
    },button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        width: '60%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },button_logout: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        width: '60%',
        alignSelf: 'center',
    },
});

export default AccountScreen;
