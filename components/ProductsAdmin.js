import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';

const TablaEjemplo = () => {
  const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
  const datos = [
    { nombre: 'Arroz', categoria: 'Grano', precio: '$2.190', cantidad: '1', imagen: 'https://supermercadolaestacion.com/50709-large_default/arroz-diana-x-500-gramos.jpg' },
    { nombre: 'Frijoles', categoria: 'Grano', precio: '$4.600', cantidad: '1', imagen: 'https://lovimarket.com/store/wp-content/uploads/2020/08/frijol_seda.jpg'  },
    { nombre: 'Pan', categoria: 'Arinas', precio: '$2.000', cantidad: '1', imagen: 'https://definicion.de/wp-content/uploads/2019/05/pan-2.jpg'  },
  ];

  // Filtrar los datos según el texto de búsqueda
  const filteredData = datos.filter((item) =>
    item.nombre.toLowerCase().includes(searchText.toLowerCase())
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
            <Text style={styles.columna}>Stock</Text>
            <Text style={styles.columna}>Imagen</Text>
            <Text style={styles.columna}>Aciones</Text>
            </View>

            {/* Filas de datos */}
        {filteredData.map((item, index) => (
          <View key={index} style={styles.fila}>
            <Text style={styles.columna}>{item.nombre}</Text>
            <Text style={styles.columna}>{item.categoria}</Text>
            <Text style={styles.columna}>{item.precio}</Text>
            <Text style={styles.columna}>{item.cantidad}</Text>
            <View style={styles.columna}>
              <Image source={{ uri: item.imagen }} style={{ width: 50, height: 50 }} />
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
