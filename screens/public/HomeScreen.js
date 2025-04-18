import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
                    <Text >Empieza{"\n"}</Text>
                    <Text style={ {color: '#4A90E2'} }>Elije, </Text>
                    <Text >lleva</Text>
                </Text>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar productos"
                        style={styles.searchInput}
                        placeholderTextColor="gray"
                    />
                </View>

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
        backgroundColor: '#grey',
    },
    content: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 60,
        paddingTop: 30,
        paddingBottom: 30,
        fontWeight : '900',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
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
        marginTop: 30,
        marginBottom: 30,
    },
    categoryButton: {
        backgroundColor: '#E0E7FF',
        borderRadius: 20,
        marginRight: 10,
        padding: 10,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});

export default HomeScreen;
