import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Componente Header que recibe funciones para manejar los eventos de menú y perfil
const Header = ({ onMenuPress, onProfilePress }) => {
    // Obtiene los márgenes seguros del dispositivo (para evitar la barra de estado, etc.)
    const insets = useSafeAreaInsets();

    return (
        // Aplica el padding superior según el área segura
        <View style={{ paddingTop: insets.top }}>
            <View style={styles.headerContainer}>
                
                {/* Botón de menú, ejecuta onMenuPress al presionar */}
                <Pressable onPress={onMenuPress}>
                    <Ionicons name="menu-outline" size={30} color="black" />
                </Pressable>
                
                {/* Botón de perfil, ejecuta onProfilePress al presionar */}
                <Pressable onPress={onProfilePress}>
                    <Ionicons name="person-circle-outline" size={30} color="black" />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Estilos para el contenedor del header
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    // Estilos para el texto del header
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Estilos para el texto del perfil
    profileText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});

export default Header;
