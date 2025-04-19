import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Layout from '../../components/Layout';

const AccountScreen = () => {
    return (
        <Layout>
            <Text style={styles.title}>Mi Cuenta</Text>
            <Text>Nombre: Juan Pérez</Text>
            <Text>Email: juan@example.com</Text>
            <Text>Teléfono: +123456789</Text>
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    }
});

export default AccountScreen;
