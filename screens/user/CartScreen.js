import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import Layout from '../../components/Layout';
import { CartContext } from '../../context/CartContext';

const CartScreen = ({ navigation }) => {
    const { cartItems, clearCart, isLoggedIn } = useContext(CartContext);

    useEffect(() => {
        console.log("Renderizando carrito, productos:", cartItems);
    }, [cartItems]);

    const renderItem = ({ item }) => {
        if (!item?.name) return null;
        return (
            <View style={styles.cartItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
            </View>
        );
    };

    const handleCheckout = () => {
        if (isLoggedIn) {
            console.log("Compra realizada ✅");
            clearCart();
            alert("¡Compra exitosa!");
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <Layout>
            <Text style={styles.title}>Mi Carrito</Text>

            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item?.name ? item.name + index : index.toString()}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.emptyText}>El carrito está vacío</Text>
            )}

            {cartItems.length > 0 && (
                <View style={styles.buttonGroup}>
                    <Button title="Vaciar carrito" onPress={clearCart} />
                    <View style={{ height: 10 }} />
                    <Button title="Finalizar compra" onPress={handleCheckout} />
                </View>
            )}
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
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    itemName: {
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#555',
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#999',
    },
    buttonGroup: {
        marginTop: 20,
    }
});

export default CartScreen;
