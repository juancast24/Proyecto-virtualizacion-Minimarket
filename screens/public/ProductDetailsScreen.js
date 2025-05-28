import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../context/CartContext'; 

const ProductDetails = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  
  const { product } = route.params;
  const navigation = useNavigation();
  const { addToCart } = useContext(CartContext);

  const handlePressBack = () => {
    navigation.goBack();
  };

  const handleCartPress = () => {
    navigation.navigate('CartScreen'); 
  };

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      alert('No hay más stock disponible.');
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const totalPrice = quantity * product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, totalPrice);
    navigation.navigate('CartScreen'); 
  };

  return (
    <View style={styles.container}>
      {/* Header con SafeArea */}
      <View style={[styles.headerProductWrapper, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={handlePressBack} style={styles.headerButton}>
            <Ionicons name="chevron-back-outline" size={28} color="black" />
          </Pressable>
          <Pressable onPress={handleCartPress} style={styles.headerButton}>
            <Ionicons name="cart-outline" size={28} color="black" />
          </Pressable>
        </View>

        {/* Contenido principal del producto (imagen, nombre, cantidad) */}
        <View style={styles.productContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.quantityControl}>
            <Pressable onPress={decreaseQuantity} style={styles.quantityButton}>
              <Ionicons name="remove-outline" size={24} color="#333" />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable onPress={increaseQuantity} style={styles.quantityButton}>
              <Ionicons name="add-outline" size={24} color="#333" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Información del producto (Presentación y Descripción) */}
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Presentación</Text>
        <Text style={styles.sectionContent}>{product.quantity_per_unit} {product.unit}</Text>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.sectionContent}>{product.description}</Text>
      </ScrollView>

      {/* Barra inferior de Precio y Añadir al Carrito */}
      <View style={[styles.addToCartBar, { paddingBottom: insets.bottom }]}>
        <Text style={styles.totalPriceText}>${totalPrice.toLocaleString('es-CL')}</Text>
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.addToCartButton,
            { backgroundColor: pressed ? '#2563EB' : '#4A90E2' }, 
          ]}
        >
          <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FDFF',
  },
  headerProductWrapper: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 60, 
    borderBottomRightRadius: 60,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  headerButton: {
    padding: 10,
    borderRadius: 50, 
  },
  productContainer: {
    alignItems: 'center',
    paddingBottom: 70, 
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  productName: {
    fontSize: 34, 
    fontWeight: 'bold', 
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  quantityControl: {
    position: 'absolute',
    bottom: -25, 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  quantityButton: {
    padding: 10,
    borderRadius: 20, 
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30, 
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 35, 
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15, 
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  addToCartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 }, 
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  totalPriceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  addToCartButton: {
    paddingVertical: 14, 
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ProductDetails;