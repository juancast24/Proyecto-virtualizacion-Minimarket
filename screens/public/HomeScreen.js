import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import Header from '../../components/Header';
import ProductCard from '../../components/productCard';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const categories = ['Aseo hogar', 'Despensa', 'Frutas Verduras', 'Carnes', 'Lacteos', 'Aseo personal'];

const HomeScreen = () => {
    const navigation = useNavigation();
    const handleMenuPress = () => {
        alert('Menu');
    };
    const handleProfilePress = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            {/* Header estático */}
            <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />

            {/* Contenido encima de la lista */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    <Text>Empieza, </Text>
                    <Text style={{ color: '#4A90E2' }}>Elije, </Text>
                    <Text>lleva</Text>
                </Text>

                <TextInput placeholder="Buscar productos" style={styles.searchInput} />

                <View style={styles.categoryList}>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Pressable style={styles.categoryButton}>
                                <Text style={styles.categoryText}>{item}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            </View>

            {/* Lista de productos */}
            <ProductCard />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    content: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },
    searchInput: {
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        marginTop: 15,
        fontSize: 16,
    },
    categoryList: {
    },
    categoryButton: {
        backgroundColor: '#E0E7FF',
        borderRadius: 20,
        marginRight: 10,
        marginTop: 20,
        padding: 10,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});

export default HomeScreen;
