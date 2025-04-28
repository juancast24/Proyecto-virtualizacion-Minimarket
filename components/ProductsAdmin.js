import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../data/products';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';


const TablaEjemplo = () => {
  const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda

  // Filtrar los datos según el texto de búsqueda
  const filteredData = products.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre del producto"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
         <View style={styles.tabla}>
            {/* Encabezado */}
            <View style={[styles.fila, styles.encabezado]}>
            <Text style={styles.columna}>Producto</Text>
            <Text style={styles.columna}>Categoria</Text>
            <Text style={styles.columna}>Precio</Text>
            <Text style={styles.columna}>Descripcion</Text>
            <Text style={styles.columna}>Stock</Text>
            <Text style={styles.columna}>Imagen</Text>
            <Text style={styles.columna}>Aciones</Text>
            </View>

            {/* Filas de datos */}
        {filteredData.map((item, index) => (
          <View key={index} style={styles.fila}>
            <Text style={styles.columna}>{item.name}</Text>
            <Text style={styles.columna}>{item.category}</Text>
            <Text style={styles.columna}>{item.price}</Text>
            <Text style={styles.columna}>{item.description}</Text>
            <Text style={styles.columna}>{item.stock}</Text>
            <View style={styles.columna}>
              <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.columna}>
              <Pressable onPress={() => console.log('Editar')}>
                <Feather name="edit" size={24} color="#2980b9" />
              </Pressable>
              <Pressable onPress={() => console.log('Eliminar')}>
                <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    margin: 10,
    padding: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  tabla: {
    margin: 5,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  fila: {
    flexDirection: 'row',
    padding: 10,
    borderColor: 'trnsparent',
    borderRadius: 8,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  encabezado: {
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#2980b9',
  },
  columna: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 8,    
  },
  
  
});

export default TablaEjemplo;
