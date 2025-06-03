import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProductCard from '../../components/ProductCard';
import SearchAndCategory from '../../components/SearchAndCategory';
import BottomBarLayout from '../../components/BottomBarLayout';

export default function ProductsScreen() {
    // Estado para la categoría seleccionada
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Estado para la búsqueda
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <BottomBarLayout>
            {/* Componente de búsqueda y selección de categorías */}
            <SearchAndCategory
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {/* Muestra los productos filtrados por categoría y búsqueda */}
            <ProductCard selectedCategory={selectedCategory} searchQuery={searchQuery} />
        </BottomBarLayout>
    );
}
