import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Importa Firestore
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../firebase.config';

const db = getFirestore(firebaseApp);

const ProductCard = ({ selectedCategory, searchQuery }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsArray = [];
                querySnapshot.forEach((doc) => {
                    productsArray.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productsArray);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filtrar productos por categoría
    const filteredByCategory = selectedCategory
        ? products.filter(product =>
            (product.category || '').toLowerCase().trim() === selectedCategory.toLowerCase().trim()
        )
        : products;

    // Filtrar productos por búsqueda
    const filteredProducts = filteredByCategory.filter(product =>
        product.name.toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    const handlePressProduct = (product) => {
        navigation.navigate('ProductDetails', { product });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />;
    }

    return (
        <FlatList
            style={styles.content}
            data={filteredProducts}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <Pressable
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => handlePressProduct(item)}
                >
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                    </View>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardPrice}>${item.price}</Text>
                    <Text style={styles.cardDescription}>Presentacion: {item.quantity_per_unit} {item.unit}</Text>
                </Pressable>
            )}
        />
    );
};
const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 10,
    },
    card: {
        marginBottom: 10,
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 25,
        marginRight: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,

    },
    cardPressed: {
        transform: [{ scale: 1.05 }],
    },
    imageContainer: {
        alignItems: 'center',
    },
    cardImage: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    cardName: {
        fontSize: 19,
        alignItems: 'center',
        fontWeight: '900',
        textAlign: 'center',
    },
    cardPrice: {
        fontSize: 20,
        color: '#4A90E2',
        marginTop: 10,
        fontWeight: '800',

    },
    cardDescription: {
        fontSize: 12,
    },
});
export default ProductCard;