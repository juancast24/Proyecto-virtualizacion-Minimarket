import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Layout from '../../components/Layout';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';

const UserManagementScreen = () => {
    const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
    const datos = [
        { name: 'Daniel Alejandro', email: 'daniel@example.com', phone: '123456789', password: '********' },
        { name: 'Maria Lopez', email: 'maria@example.com', phone: '987654321', password: '********' },
    ];

    const { authState } = useAuth();
      const navigation = useNavigation();
    
      const handleMenuPress = () => {
        alert('Menu');
      };
      const handleProfilePress = () => {
        if (authState.authenticated) {
            navigation.navigate('AccountScreenAdmin'); // si ya está logueado, ve al perfil
        }else{  
            navigation.navigate('Login');// si no está logueado, ve al login
        }};

    

    // Filtrar los datos según el texto de búsqueda
    const filteredData = datos.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
            <ScrollView >
            <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />
            <Text style={styles.title}>Gestión de Usuarios</Text>
                {/* Buscador */}
                      <View style={styles.searchContainer}>
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Busqueda por nombre..."
                          value={searchText}
                          onChangeText={(text) => setSearchText(text)}
                        />
                      </View>
                    {/* Table Header */}
                <View style={styles.tabla}>
                    <View style={[styles.fila, styles.encabezado]}>
                        <Text style={[styles.columna]}>Nombre</Text>
                        <Text style={[styles.columna]}>Correo</Text>
                        <Text style={[styles.columna]}>Teléfono</Text>
                        <Text style={[styles.columna]}>Clave</Text>
                        <Text style={[styles.columna]}>Acciones</Text>
                    </View>
                    {/* Table Body */}
                    {filteredData.map((item, index) => (
                        <View key={index} style={styles.fila}>
                            <Text style={styles.columna}>{item.name}</Text>
                            <Text style={styles.columna}>{item.email}</Text>
                            <Text style={styles.columna}>{item.phone}</Text>
                            <Text style={styles.columna}>{item.password}</Text>
                            <View style={[styles.columna, styles.actions]}>
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
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
    actions: {
        flexDirection: 'row',
        gap: 5,
        width: 60,
    },
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
});

export default UserManagementScreen;