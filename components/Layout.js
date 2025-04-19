import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    content: {
        flex: 1,
        padding: 16,
    },
});

export default Layout;
