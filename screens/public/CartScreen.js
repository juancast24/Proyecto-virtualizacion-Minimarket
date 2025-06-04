import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomBarLayout from '../../components/BottomBarLayout';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext, useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CartScreen = () => {
  const { cartItems, clearCart, updateItemQuantity, removeItemFromCart, calculateCartTotal } = useCart();
  const navigation = useNavigation();
  const { authState } = useAuth();
  const insets = useSafeAreaInsets();
  const totalCartPrice = calculateCartTotal ? calculateCartTotal() : cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    console.log("Renderizando carrito, productos:", cartItems);
  }, [cartItems]);

  const renderItem = ({ item }) => {
    if (!item?.name) return null;

    const totalPriceForItem = item.price * item.quantity;

    const handlePressItem = () => {
      navigation.navigate('ProductDetails', { product: item });
    };

    return (
      <Pressable onPress={handlePressItem} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <View style={styles.cartItem}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.itemPriceUnit}>Precio: ${item.price?.toLocaleString('es-CL') || 'N/A'}</Text>
            <Text style={styles.itemTotalPrice}>Subtotal: ${totalPriceForItem?.toLocaleString('es-CL') || 'N/A'}</Text>
          </View>
          <View style={styles.itemDetails}>
            <View style={styles.quantityButtons}>
              <Pressable
                onPress={() =>
                  item.quantity > 1 &&
                  updateItemQuantity(item.name, item.quantity - 1)
                }
                style={styles.quantityButton}
              >
                <Text><Ionicons name="remove-outline" size={20} color="#333" /></Text>
              </Pressable>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
              <Pressable
                onPress={() => {
                  if (item.quantity < item.stock) {
                    updateItemQuantity(item.name, item.quantity + 1);
                  } else {
                    Alert.alert('Stock Insuficiente', 'No hay más stock disponible para este producto.');
                  }
                }}
                style={styles.quantityButton}
              >
                <Text><Ionicons name="add-outline" size={20} color="#333" /></Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => removeItemFromCart(item.name)}
              style={styles.removeButton}
            >
              <View style={styles.removeButtonContent}>
                <Text style={styles.removeButtonText}>Eliminar </Text>
                <Ionicons name="trash-outline" size={20} color="white" style={styles.trashIcon} />
              </View>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleCheckout = () => {
    navigation.navigate('FormPay', { cartItems });
  };

  return (
    <BottomBarLayout>   
        <Text style={styles.title}>Mi Carrito</Text>
        {cartItems.length > 0 ? (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item?.name ? item.name + index : index.toString()}
            contentContainerStyle={{ ...styles.list, paddingBottom: 160 + insets.bottom }}
          />
        ) : (
          <View style={styles.emptyCartContainer}>
            <Image source={{ uri: 'https://i.imgur.com/kRhJKyd.png' }} style={styles.emptyCartImage} />
            <Text style={styles.emptyCartText}>Tu carrito está vacío.</Text>
            <Pressable onPress={() => authState.authenticated ? navigation.navigate('ProductsScreen') : navigation.navigate('Home')} style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Ir a la tienda</Text>
            </Pressable>
          </View>
        )}

        {cartItems.length > 0 && (
          <View style={[styles.containerBottomFixed]}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Total:</Text>
              <Text style={styles.summaryPrice}>${totalCartPrice.toLocaleString('es-CL')}</Text>
            </View>
            <View style={styles.buttonGroup}>
              <Pressable
                onPress={clearCart}
                style={({ pressed }) => [
                  styles.clearCartButton,
                  { backgroundColor: pressed ? '#C62828' : '#EF5350' }
                ]}
              >
                <Text style={styles.buttonText}>Limpiar carrito</Text>
              </Pressable>
              <Pressable
                onPress={handleCheckout}
                style={({ pressed }) => [
                  styles.checkoutButton,
                  { backgroundColor: pressed ? '#388E3C' : '#4CAF50' }
                ]}
              >
                <Text style={styles.buttonText}>Finalizar compra</Text>
              </Pressable>
            </View>
          </View>
        )}
    </BottomBarLayout>  
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPriceUnit: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  itemDetails: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#EF5350',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  removeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  shopButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerBottom: {
    backgroundColor: '#F6FDFF',
    marginBottom: 20,
  },
  containerBottomFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearCartButton: {
    flex: 1,
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#43A047',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
