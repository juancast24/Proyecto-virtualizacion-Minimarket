import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import Layout from '../../components/Layout';
import { CartContext } from '../../context/CartContext';

const orders = [
    { id: '1', date: '2025-04-10', status: 'Entregado', total: '$12.50', products: ['Manzanas', 'Leche'] },
    { id: '2', date: '2025-04-05', status: 'En camino', total: '$8.20', products: ['Pan', 'Huevos'] },
    { id: '3', date: '2025-04-18', status: 'En proceso', total: '$15.30', products: ['Tomates', 'Jugo'] },
];

const OrdersScreen = () => {
    const { addToCart } = useContext(CartContext);

    const repeatOrder = (order) => {
        order.products.forEach(product => {
            addToCart({ name: product, quantity: 1 });
        });
        alert(`Productos de Pedido #${order.id} añadidos al carrito 🛒`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.orderText}>Pedido #{item.id}</Text>
                <Text>Fecha: {item.date}</Text>
                <Text>Estado: {item.status}</Text>
                <Text>Total: {item.total}</Text>
            </View>
            <Button title="Repetir" onPress={() => repeatOrder(item)} />
        </View>
    );

    return (
        <Layout>
            <Text style={styles.title}>Mis Pedidos</Text>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        paddingBottom: 20,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    orderText: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

export default OrdersScreen;
