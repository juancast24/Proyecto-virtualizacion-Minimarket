import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CartContext } from '../../context/CartContext';
import Layout from '../../components/Layout';

const PaymentScreen = ({ navigation }) => {
    const { cartItems, clearCart } = useContext(CartContext);

    const totalAmount = cartItems.reduce((total, item) => total + (item.quantity * 10), 0); // Precio fijo por item

    const handlePayment = () => {
        Alert.alert('Pago Exitoso', 'Tu pedido está en proceso.');
        clearCart();
        navigation.navigate('Orders'); // Usamos el nombre corregido
    };

    return (
        <Layout>
            <View style={styles.container}>
                <Text style={styles.title}>Resumen de Pedido</Text>
                <Text>Total a pagar: ${totalAmount}</Text>
                {cartItems.map((item, index) => (
                    <Text key={index}>{item.name} x {item.quantity}</Text>
                ))}
                <Button title="Pagar ahora" onPress={handlePayment} />
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default PaymentScreen;
