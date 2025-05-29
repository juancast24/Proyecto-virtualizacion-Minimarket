import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import SearchAndCategory from '../../components/SearchAndCategory';

export default function ProductsScreen() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <Layout>
            <SearchAndCategory
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
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