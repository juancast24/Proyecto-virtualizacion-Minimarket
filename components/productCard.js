import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({products}) => {
    const navigation = useNavigation();
    
    const handlePressProduct = (product) => {
        navigation.navigate('ProductDetails', { product });
    };
    return (
        <FlatList style={styles.content}
            data={products}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={(item) => item.name}
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
                    <Text style={styles.cardDescription}>{item.description}</Text>
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