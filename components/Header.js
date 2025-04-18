import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Header = ({ oneMenuPress, onProfilePress, children }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    return (
        <View style={{ paddingTop: insets.top }}>
            <View style={styles.headerContainer}>
                {/* Botón de menu */}
                <Pressable onPress={oneMenuPress}>
                    <Ionicons name="menu" size={30} color="black" />
                </Pressable>
                {/* Botón de perfil */}
                <Pressable onPress={onProfilePress}>
                    <Ionicons name="person" size={30} color="black" onPress={() => navigation.navigate('Login')}/>
                </Pressable>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});
export default Header;