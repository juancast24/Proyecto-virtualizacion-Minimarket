
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Image } from 'react-native';


const categories = [
    { name: 'Todas', image: { uri: 'https://i.imgur.com/2hDMKvt.png' } },
    { name: 'Aseo hogar', image: { uri: 'https://i.imgur.com/t1KbWt7.png' } },
    { name: 'Despensa', image: { uri: 'https://i.imgur.com/WAFeXKf.png' } },
    { name: 'Frutas Verduras', image: { uri: 'https://i.imgur.com/QK3goB8.png' } },
    { name: 'Carnes', image: { uri: 'https://i.imgur.com/tdd9GPB.png' } },
    { name: 'Lacteos', image: { uri: 'https://i.imgur.com/TQw6Gxv.png' } },
    { name: 'Higiene Personal', image: { uri: 'https://i.imgur.com/ynGOwqT.png' } },
];

export default function SearchAndCategory({ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) {

    const handleCategoryPress = (category) => {
        if (category === 'Todas') {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
                <TextInput
                    placeholder="Buscar productos"
                    style={styles.searchInput}
                    placeholderTextColor="gray"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.categoryList}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => {
                        const isSelected = selectedCategory === item.name || (item.name === 'Todas' && selectedCategory === null);
                        return (
                            <Pressable
                                style={[
                                    styles.categoryButton,
                                    isSelected && styles.selectedCategoryButton
                                ]}
                                onPress={() => handleCategoryPress(item.name)}
                            >
                                <View style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.categoryImage} />
                                </View>
                                <Text style={[
                                    styles.categoryText,
                                    isSelected && styles.selectedCategoryText
                                ]}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginTop: 5,
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