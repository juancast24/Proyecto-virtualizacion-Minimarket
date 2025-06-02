import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
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
      <View style={[styles.headerProductWrapper, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={handlePressBack} style={styles.headerButton}>
            <Ionicons name="chevron-back-outline" size={28} color="black" />
          </Pressable>
          <Pressable onPress={handleCartPress} style={styles.headerButton}>
            <Ionicons name="cart-outline" size={28} color="black" />
          </Pressable>
        </View>

        <View style={styles.productContainer}>
          {/* Imagen con lógica de sin stock, en promoción y pocos en stock */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: product.image }}
              style={[styles.image, product.stock === 0 && styles.imageOutOfStock]}
            />
            {product.stock === 0 && (
              <View style={styles.overlay}>
                <Text style={styles.outOfStockText}>Sin stock</Text>
              </View>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <View style={styles.overlay}>
                <Text style={styles.lowStockText}>¡Ultimas unidades!</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.quantityControl}>
            <Pressable onPress={decreaseQuantity} style={styles.quantityButton} disabled={product.stock === 0}>
              <Ionicons name="remove-outline" size={24} color={product.stock === 0 ? '#aaa' : '#333'} />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable onPress={increaseQuantity} style={styles.quantityButton} disabled={product.stock === 0}>
              <Ionicons name="add-outline" size={24} color={product.stock === 0 ? '#aaa' : '#333'} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <View style={styles.sectionHeader}>
            <Image source={{ uri: 'https://i.imgur.com/H9LTHyB.png' }} style={styles.imageSectionHeader} />
            <Text style={styles.sectionContent}>{product.quantity_per_unit} {product.unit}</Text>
          </View>
          <View style={styles.sectionHeader}>
            <Image source={{ uri: 'https://i.imgur.com/PRWE0fh.png' }} style={styles.imageSectionHeader} />
            <Text style={styles.sectionContent}>Disponible: {product.stock}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.sectionContent}>{product.description}</Text>
      </ScrollView>

      <View style={[styles.sectionBottom, { paddingBottom: insets.bottom }]}>
        <Text style={styles.totalPriceText}>${totalPrice.toLocaleString('es-CL')}</Text>
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.addToCartButton,
            {
              backgroundColor:
                product.stock === 0 ? '#ccc' : pressed ? '#2563EB' : '#4A90E2',
              flexDirection: 'row',
              gap: 6,
            },
          ]}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? (
            <>
              <Ionicons name="sad-outline" size={20} color="white" />
              <Text style={styles.addToCartButtonText}>Sin stock</Text>
            </>
          ) : (
            <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
          )}
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
    elevation: 12,
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
  imageWrapper: {
    position: 'relative',
    width: 250,
    height: 250,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageOutOfStock: {
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  outOfStockText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lowStockText: {
    color: '#FFA51F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productName: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  quantityControl: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 5,
    elevation: 10,
  },
  quantityButton: {
    padding: 8,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  imageSectionHeader: {
    width: 55,
    height: 45,
  },
  sectionHeader: {
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 15,
  },
  totalPriceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    maxWidth: '50%',
  },
  addToCartButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
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
