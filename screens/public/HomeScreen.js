import React, { useState } from 'react';
import SearchAndCategory from '../../components/SearchAndCategory';
import Layout from '../../components/Layout';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProductCard from '../../components/ProductCard';

const HomeScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <Layout>
            <View style={styles.container}>
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
                <SearchAndCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Solo pasa los filtros, no los productos */}
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 45,
        paddingBottom: 20,
        fontWeight: '900',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        fontSize: 16,
        color: '#000',
    },
    categoryList: {
        marginTop: 15,
        marginBottom: 15,
    },
    categoryButton: {
        borderRadius: 20,
        marginRight: 10,
        padding: 8,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    categoryImage: {
        width: 40,
        height: 40,
    },
    categoryText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    selectedCategoryButton: {
        backgroundColor: '#4A90E2',
    },

    selectedCategoryText: {
        color: '#fff',
    },
});

export default HomeScreen;
