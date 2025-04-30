import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { addProduct } from '../../data/products';
import { useNavigation } from '@react-navigation/native';

const CreateProduct = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

  const handleCreateProduct = () => {
    if (!name || !description || !category || !price || !stock || !image) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const newProduct = {
      name,
      description,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image,
    };

    try {
      addProduct(newProduct); // Llama a la función para agregar el producto
      Alert.alert('Éxito', 'Producto creado exitosamente.');
      // Limpia los campos después de crear el producto
      setName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setStock('');
      setImage('');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear el producto.');
      console.error(error);
    }
  };

  const categories = ['Aseo hogar', 'Despensa', 'Frutas Verduras', 'Carnes', 'Lacteos', 'Higiene Personal'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del producto"
        value={description}
        onChangeText={setDescription}
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={[styles.Picker]} // Combina estilos
      >
        <Picker.Item label="Selecciona una categoría" value="" />
        {categories.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="URL de la Imagen"
        value={image}
        onChangeText={setImage}
      />
      {image ? (
  <Image
  source={{ uri: `${image}?timestamp=${new Date().getTime()}` }}
  style={styles.imagePreview}
/>
) : (
  <Text style={styles.imagePlaceholder}>Vista previa de la imagen</Text>
)}
      <Pressable style={styles.button} onPress={handleCreateProduct}>
        <Text style={styles.buttonText}>Crear Producto</Text>
      </Pressable>
      {/* Nuevo botón para ir a AdminDashboard */}
      <Pressable
        style={[styles.button, { backgroundColor: 'red', marginTop: 10 }]} // Estilo adicional
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
    backgroundColor: '#grey',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    marginTop: 1,
    width: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  Picker: {
    color: '#000', 
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  imagePlaceholder: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 15,
  },
});

export default CreateProduct;