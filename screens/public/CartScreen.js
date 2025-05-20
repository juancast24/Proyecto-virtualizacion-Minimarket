import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Platform } from 'react-native';
import Layout from '../../components/Layout'; // Asegúrate de que esta ruta sea correcta
import { CartContext } from '../../context/CartContext'; // Asegúrate de que esta ruta sea correcta
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigation = useNavigation();

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
          <View style={styles.itemQuantityContainer}>
            <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
            <Text style={styles.itemTotalPrice}>${totalPrice.toLocaleString('es-CL')}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleCheckout = () => {
    navigation.navigate('FormPay', { cartItems }); 
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
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Tu carrito está vacío.</Text>
        </View>
      )}

      {cartItems.length > 0 && (
        <View style={styles.buttonGroup}>
          <Pressable onPress={clearCart} style={({ pressed }) => [styles.clearCartButton, { backgroundColor: pressed ? '#C62828' : '#D32F2F' }]}>
            <Text style={styles.buttonText}>Limpiar carrito</Text>
          </Pressable>
          <Pressable onPress={handleCheckout} style={({ pressed }) => [styles.checkoutButton, { backgroundColor: pressed ? '#388E3C' : '#43A047' }]}>
            <Text style={styles.buttonText}>Finalizar compra</Text>
          </Pressable>
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between', 
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#777',
  },
  itemTotalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    color: '#999',
    marginTop: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  clearCartButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  checkoutButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CartScreen;