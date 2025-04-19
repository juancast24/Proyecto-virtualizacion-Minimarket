import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Header = ({ oneMenuPress, onProfilePress, children }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
            <View style={styles.headerContainer}>

                {/* Botón de menú */}
                <Pressable
                    onPress={oneMenuPress}
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.iconButtonPressed,
                    ]}
                >
                    <Ionicons name="menu" size={30} color="#333" />
                </Pressable>

                {/* Título central opcional */}
                {children ? (
                    <Text style={styles.headerTitle}>{children}</Text>
                ) : (
                    <View style={{ flex: 1 }} />
                )}

                <View style={styles.rightButtons}>
                    {/* Botón carrito */}
                    <Pressable
                        onPress={() => navigation.navigate('Cart')}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                        ]}
                    >
                        <Ionicons name="cart-outline" size={28} color="#333" />
                    </Pressable>

                    {/* Botón de perfil */}
                    <Pressable
                        onPress={onProfilePress}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name="person-circle-outline"
                            size={30}
                            color="#333"
                            onPress={() => navigation.navigate('Login')}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        borderRadius: 50,
        marginLeft: 8,
    },
    iconButtonPressed: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
});

export default Header;
