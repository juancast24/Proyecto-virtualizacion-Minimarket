import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../context/CartContext';
import BottomBarLayout from '../../components/BottomBarLayout';
import { showMessage } from "react-native-flash-message";

const isTablet = Dimensions.get('window').width >= 600;

const ProductDetails = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { product } = route.params;
  const navigation = useNavigation();
  const { addToCart } = useContext(CartContext);


  const handlePressBack = () => {
    navigation.goBack();
  };
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      showMessage({
        message: "No hay mas stock disponible",
        type: "warning",
        duration: 1500,
        titleStyle: { fontSize: 20, fontWeight: "bold" },
        style: {
          marginTop: 25,
          paddingVertical: 24,
          paddingHorizontal: 32,
          minWidth: 350,
          alignSelf: "center",
          borderRadius: 10,
        },
        icon: "warning",
      });
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
    <BottomBarLayout disableInsets={true}>
      {/* Header con SafeArea */}
      <View style={[styles.headerProductWrapper]}>
        <View style={styles.header}>
          {/* Botón para volver atrás */}
          <Pressable onPress={handlePressBack} style={styles.headerButton}>
            <Ionicons name="chevron-back-outline" size={28} color="black" />
          </Pressable>
        </View>

        {/* Contenido principal del producto (imagen, nombre, cantidad) */}
        <View style={styles.productContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: product.image }} style={styles.image} />
          </View>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.quantityControl}>
            {/* Botón para disminuir cantidad */}
            <Pressable onPress={decreaseQuantity} style={styles.quantityButton}>
              <Ionicons name="remove-outline" size={24} color="#333" />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            {/* Botón para aumentar cantidad */}
            <Pressable onPress={increaseQuantity} style={styles.quantityButton}>
              <Ionicons name="add-outline" size={24} color="#333" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Información del producto (Presentación y Descripción) */}
      <ScrollView
        style={styles.infoContainer}
      >
        <View style={styles.infoHeader}>
          {/* Presentación del producto */}
          <View style={styles.sectionHeader}>
            <Image source={{ uri: 'https://i.imgur.com/H9LTHyB.png' }} style={styles.imageSectionHeader} />
            <Text style={styles.sectionContent}>{product.quantity_per_unit} {product.unit}</Text>
          </View>
          {/* Stock disponible */}
          <View style={styles.sectionHeader}>
            <Image source={{ uri: 'https://i.imgur.com/PRWE0fh.png' }} style={styles.imageSectionHeader} />
            <Text style={styles.sectionContent}>Disponible: {product.stock}</Text>
          </View>
        </View>
        {/* Título y descripción del producto */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.sectionContent}>{product.description}</Text>
      </ScrollView>

      {/* Barra inferior fija */}
      <View
        style={[
          styles.sectionBottomFixed
        ]}
      >
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
    </BottomBarLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerProductWrapper: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    shadowColor: "#0288D1",
    elevation: 10,
    paddingTop: 20,
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
    paddingBottom: 50,
    position: 'relative',
    zIndex: 2,
  },
  imageWrapper: {
    position: 'relative',
    width: isTablet ? 400 : 240,
    height: isTablet ? 380 : 140,
    marginBottom: isTablet ? 30 : 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
    shadowColor: "#0288D1",
    elevation: 12,
    zIndex: 2,
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
    position: 'relative',
    zIndex: 0,
  },
  sectionHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 0,
  },
  imageSectionHeader: {
    width: 55,
    height: 45,
    zIndex: 0,
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
  sectionBottomFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
