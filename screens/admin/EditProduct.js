import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import { updateProduct, products} from '../../data/products';

const EditProduct = ({ route, navigation }) => {

    const { productName } = route.params;
    const [product, setProduct] = useState(null);

    const [name, setName] = useState(productName); // Inicializa el nombre del producto
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        // Busca el producto por name
        const foundProduct = products.find((item) => item.name === productName);
        if (foundProduct) {
            setProduct(foundProduct);
            setCategory(foundProduct.category);
            setPrice(foundProduct.price.toString());
            setDescription(foundProduct.description);
            setStock(foundProduct.stock.toString());
            setImage(foundProduct.image);
        } else {
            Alert.alert('Error', 'Producto no encontrado.');
            navigation.goBack();
        }
    }, [name]);

    const handleSave = async () => {
        if (!name || !category || !price || !description || !stock || !image) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        const updatedProduct = {
            name,
            category,
            price: parseFloat(price),
            description,
            stock: parseInt(stock, 10),
            image,
        };

        try {
            await updateProduct(product.name, updatedProduct); // Actualiza el producto
            Alert.alert('Éxito', 'Producto actualizado correctamente.');
            navigation.goBack(); // Regresa a la pantalla anterior
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            Alert.alert('Error', 'No se pudo actualizar el producto.');
        }
    };

    if (!product) {
        return null; // Muestra nada mientras se carga el producto
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Categoría</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} />

            <Text style={styles.label}>Precio</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

            <Text style={styles.label}>Descripción</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} />

            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />

            <Text style={styles.label}>Imagen (URL)</Text>
            <TextInput style={styles.input} value={image} onChangeText={setImage} />

            <Button title="Guardar" onPress={handleSave} />

            {/* Nuevo botón para ir a AdminDashboard */}
                  <Pressable
                    style={[styles.button, { backgroundColor: '#27ae60', marginTop: 20 }]} // Estilo adicional
                    onPress={() => navigation.navigate('AdminDashboard')} // Navega a AdminDashboard
                  >
                    <Text style={styles.buttonText}>Atras</Text>
                  </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#2980b9',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default EditProduct;