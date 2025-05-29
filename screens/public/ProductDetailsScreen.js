import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../context/CartContext';

const ProductDetails = () => {
  // Obtiene los márgenes seguros del dispositivo
  const insets = useSafeAreaInsets();
  // Obtiene los parámetros de la ruta (producto)
  const route = useRoute();
  const { product } = route.params;
  // Navegación
  const navigation = useNavigation();
  // Obtiene la función para agregar al carrito desde el contexto
  const { addToCart } = useContext(CartContext);

  // Maneja el botón de volver atrás
  const handlePressBack = () => {
    navigation.goBack();
  };

  // Maneja el botón para ir al carrito
  const handleCartPress = () => {
    navigation.navigate('CartScreen');
  };

  // Estado para la cantidad seleccionada
  const [quantity, setQuantity] = useState(1);

  // Aumenta la cantidad (hasta el stock disponible)
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      alert('No hay más stock disponible.');
    }
  };

  // Disminuye la cantidad (mínimo 1)
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Calcula el precio total según la cantidad
  const totalPrice = quantity * product.price;

  // Maneja la acción de agregar al carrito
  const handleAddToCart = () => {
    addToCart(product, quantity, totalPrice);
    navigation.navigate('CartScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header con SafeArea */}
      <View style={[styles.headerProductWrapper, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          {/* Botón para volver atrás */}
          <Pressable onPress={handlePressBack} style={styles.headerButton}>
            <Ionicons name="chevron-back-outline" size={28} color="black" />
          </Pressable>
          {/* Botón para ir al carrito */}
          <Pressable onPress={handleCartPress} style={styles.headerButton}>
            <Ionicons name="cart-outline" size={28} color="black" />
          </Pressable>
        </View>

        {/* Contenido principal del producto (imagen, nombre, cantidad) */}
        <View style={styles.productContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
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
      <ScrollView style={styles.infoContainer}>
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

      {/* Barra inferior de Precio y Añadir al Carrito */}
      <View style={[styles.sectionBottom, { paddingBottom: insets.bottom }]}>
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
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 15,
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