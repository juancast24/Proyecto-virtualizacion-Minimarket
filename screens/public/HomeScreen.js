import React, { useState } from 'react';
import SearchAndCategory from '../../components/SearchAndCategory';
import Layout from '../../components/Layout';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { showMessage } from "react-native-flash-message";

const HomeScreen = () => {
    // Estado para la categoría seleccionada
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Estado para la búsqueda
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Layout>
            <View style={styles.container}>
                {/* Encabezado con título y logo */}
                <View style={styles.content}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>
                            Empieza{"\n"}
                            <Text style={{ color: '#4A90E2' }}>Elije, </Text>
                            lleva
                        </Text>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../assets/logo-market.png')} style={styles.logo} />
                        </View>
                    </View>
                </View>
                {/* Componente de búsqueda y categorías */}
                <SearchAndCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Muestra los productos filtrados por categoría y búsqueda */}
                <ProductCard selectedCategory={selectedCategory} searchQuery={searchQuery} />
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6FDFF',
    },
    content: {
        paddingHorizontal: 10,
    },
    containerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 45,
        fontWeight: '900',
    },
});

export default HomeScreen;
