import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ onMenuPress, onProfilePress }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ paddingTop: insets.top }}>
            <View style={styles.headerContainer}>
                
                <Pressable onPress={onMenuPress}>
                    <Ionicons name="menu-outline" size={30} color="black" />
                </Pressable>
                
                <Pressable onPress={onProfilePress}>
                    <Ionicons name="person-outline" size={30} color="black" />
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
