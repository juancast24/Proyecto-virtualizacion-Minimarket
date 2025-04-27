import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';

const CreateProduct = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');

  const handleCreateProduct = () => {
    console.log('Producto creado:', { productName, category, price, stock, imagen });
    // Aquí agregar la lógica para guardar el producto
  };

  const categories = ['Aseo hogar', 'Despensa', 'Frutas Verduras', 'Carnes', 'Lacteos', 'Higiene Personal'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={productName}
        onChangeText={setProductName}
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
        value={imagen}
        onChangeText={setImagen}
      />
      {imagen ? (
  <Image
  source={{ uri: `${imagen}?timestamp=${new Date().getTime()}` }}
  style={styles.imagePreview}
/>
) : (
  <Text style={styles.imagePlaceholder}>Vista previa de la imagen</Text>
)}
      <Pressable style={styles.button} onPress={handleCreateProduct}>
        <Text style={styles.buttonText}>Crear Producto</Text>
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
    height: 220,
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