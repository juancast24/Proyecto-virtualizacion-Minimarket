import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';

const Layout = ({ children }) => {
    const navigation = useNavigation();

    const handleMenuPress = () => {
        navigation.toggleDrawer?.(); // si usas Drawer
    };

    const handleProfilePress = () => {
        navigation.navigate('Account'); // o la screen que uses para perfil
    };

    const handleCartPress = () => {
        navigation.navigate('CartScreen'); // <- Esto es lo importante
    };

    return (
        <View style={styles.container}>
            <Header 
                onMenuPress={handleMenuPress} 
                onProfilePress={handleProfilePress} 
                onCartPress={handleCartPress} 
            />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6FDFF',
    },
    content: {
        flex: 1,
    },
});

export default Layout;
