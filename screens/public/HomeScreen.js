import { useState } from 'react';
import SearchAndCategory from '../../components/SearchAndCategory';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomBarLayout from '../../components/BottomBarLayout';

const HomeScreen = () => {
    // Estado para la categoría seleccionada
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Estado para la búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

    return (
        <BottomBarLayout>
            <StatusBar backgroundColor="#F6FDFF" barStyle="dark-content" />
            <View style={styles.content}>
                {/* Encabezado con título y logo */}
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
                {/* Barra de categorías al fondo */}
                <SearchAndCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </View>
            {/* Muestra los productos filtrados por categoría y búsqueda */}
            <ProductCard selectedCategory={selectedCategory} searchQuery={searchQuery} />
        </BottomBarLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
    },
    bottomBar: {
        height: 'auto',
        backgroundColor: 'auto',
        width: '100%',
    },
    containerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
