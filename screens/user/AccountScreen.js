import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const AccountScreen = ({ navigation }) => {
    const { clearCart } = useCart();
    const { authState, onLogout } = useAuth();

    const handleLogout = () => {
        clearCart?.();
        onLogout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <Layout>
            <View style={styles.container}>
                <Text style={styles.title}>Mi Cuenta</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>{authState.username || 'No disponible'}</Text>

                    <Text style={styles.label}>Rol</Text>
                    <Text style={styles.value}>{authState.role || 'No asignado'}</Text>
                </View>

                <Animatable.View animation="fadeInUp" duration={600} delay={200}>
                    <Animatable.TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        animation="pulse"
                        iterationCount="infinite"
                        iterationDelay={3000}
                        useNativeDriver
                    >
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </Animatable.TouchableOpacity>
                </Animatable.View>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 40,
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
        fontWeight: '600',
    },
    value: {
        fontSize: 18,
        marginBottom: 16,
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccountScreen;
