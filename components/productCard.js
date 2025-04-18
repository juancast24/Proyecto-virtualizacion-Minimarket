import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const products = [
    {
        id: 1,
        name: 'Manzana',
        price: 1000,
        image: 'https://www.frutality.es/wp-content/uploads/manzana-royal.png',
        description: 'Manazana de primera calidad',
    },
    {
        id: 2,
        name: 'Pera',
        price: 1000,
        image: 'https://www.frutality.es/wp-content/uploads/frutality-fruta_pera_verde.png',
        description: 'Esta manzana Pera de primera calidad',
    },
    {
        id: 3,
        name: 'Banana',
        price: 800,
        image: 'https://www.frutality.es/pruebas/wp-content/uploads/frutality-fruta_platano.png',
        description: 'Potasio para recuperar fuerzas',
    },
    {
        id: 4,
        name: 'Cepillo',
        price: 5000,
        image: 'https://images.ctfassets.net/tdc24j4ik3zq/2w8gKlB93j9V2DpiiVwtiZ/6c818cf88567ff058a945acdde1ca82b/file.png?fm=webp&q=75',
        description: 'Cepillo de cerdas suaves',
    },
    {
        id: 5,
        name: 'Enjuague Bucal',
        price: 6000,
        image: 'https://cdn-prod.scalefast.com/resize/459x-/public/assets/user/20430613/image/97a947660a16986e439c217e80600ae7.png',
        description: 'Enjuague bucal Oral B',
    },
    {
        id: 6,
        name: 'Jabon Rey',
        price: 1200,
        image: 'https://exitocol.vtexassets.com/arquivos/ids/27122734/Oferta-Jabon-Azul-900-gr-263056_a.jpg?v=638786995386530000',
        description: 'Jabon rey para ropa',
    },
    {
        id: 7,
        name: 'Arroz Diana',
        price: 4200,
        image: 'https://exitocol.vtexassets.com/arquivos/ids/27182449/Arroz-Diana-1000-gr-552155_a.jpg?v=638794015588570000',
        description: 'Arroz diana para el desayuno',
    },
    {
        id: 8,
        name: 'Lomo de Cerdo',
        price: 15000,
        image: 'https://exitocol.vtexassets.com/arquivos/ids/26699896/LOMO-DE-CERDO-CC-372437_a.jpg?v=638742826968330000',
        description: 'Lomo de cerdo para fritar, precio por kilo',
    },
    {
        id: 9,
        name: 'Leche Deslactosada',
        price: 32000,
        image: 'https://exitocol.vtexassets.com/arquivos/ids/25622815/Leche-Deslactosada-Sixpack-En-Bolsa-X-11-Litros-Cu-576258_a.jpg?v=638682600996870000',
        description: 'Leche Deslactosada ALPINA Bolsa x6und 1100ml (6600 ml)',
    },
    {
        id: 10,
        name: 'Blanqueador Clorox ',
        price: 7900,
        image: 'https://exitocol.vtexassets.com/arquivos/ids/26774673/Blanqueador-Super-Ahorro-CLOROX-628176-3451457_a.jpg?v=638749261324630000',
        description: 'Para limpiar el hogar, (2260 ml)',
    },

]
const ProductCard = () => {
    return (
        <FlatList style={styles.content}
            data={products}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={(item) => item.id()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                    </View>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardPrice}>${item.price}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
            )}
        />
    );
};
const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 10,
    },
    card: {
        marginTop: 20,
        marginBottom: 10,
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
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
        fontSize: 18,
        alignItems: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardPrice: {
        fontSize: 20,
        color: '#4A90E2',
        marginTop: 10,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 12,
        color: 'grey',
    },
});
export default ProductCard;