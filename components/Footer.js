import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.text}>© {new Date().getFullYear()} Minimarket</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: '#888',
    },
});

export default Footer;
