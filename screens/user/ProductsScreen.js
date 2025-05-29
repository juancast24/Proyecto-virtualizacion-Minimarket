import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import SearchAndCategory from '../../components/SearchAndCategory';

export default function ProductsScreen() {
    // Estado para la categoría seleccionada
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Estado para la búsqueda
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Layout>
            {/* Componente de búsqueda y selección de categorías */}
            <SearchAndCategory
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {/* Muestra los productos filtrados por categoría y búsqueda */}
            <ProductCard selectedCategory={selectedCategory} searchQuery={searchQuery} />
        </Layout>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F6FDFF',
//     },
// });