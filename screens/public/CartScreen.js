import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import Layout from '../../components/Layout';
import { CartContext } from '../../context/CartContext';

const CartScreen = ({ navigation }) => {
    const { cartItems, clearCart, isLoggedIn } = useContext(CartContext);

    useEffect(() => {
        console.log("Renderizando carrito, productos:", cartItems);
    }, [cartItems]);

    const renderItem = ({ item }) => {
        if (!item?.name) return null;
        
        const totalPrice = item.price * item.quantity;

        return (
            <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
                    <Text style={styles.itemTotalPrice}>Total: ${totalPrice}</Text>
                </View>
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
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item?.name ? item.name + index : index.toString()}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.emptyText}>El carrito está vacío</Text>
            )}

            {cartItems.length > 0 && (
                <View style={styles.buttonGroup}>
                    <Pressable onPress={clearCart} style={({ pressed }) => [styles.clearCart,{ backgroundColor: pressed ? '#D13E3E' : '#D21A1A' }]}>
                        <Text style={{color:'white', fontWeight:800, fontSize:20}} >Limpiar carrito</Text>
                    </Pressable>
                    <Pressable onPress={handleCheckout} style={({ pressed }) => [styles.checkout,{ backgroundColor: pressed ? '#5CC25F' : '#4CAF50' }]}>
                        <Text style={{color:'white', fontWeight:800, fontSize:20}}>Finalizar compra</Text>
                    </Pressable>
                </View>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    list: {
        paddingBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    itemQuantity: {
        fontSize: 17,
        color: '#777',
    },
    itemTotalPrice: {
        fontSize: 17,
        color: '#333',
        marginTop: 5,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#999',
        marginTop: 30,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    clearCart: {
        padding: 10,
        borderRadius: 30,
        flex: 1,
        alignItems: 'center',
        marginRight: 10,
    },
    checkout: {
        padding: 10,
        borderRadius: 30,
        flex: 1,
        alignItems: 'center',
    },
});

export default CartScreen;
