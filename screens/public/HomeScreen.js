import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const navigation = useNavigation();
    const insets= useSafeAreaInsets();

    return (
        <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}}>
            <Icon name="home" size={30} color="black" />
            <Text>Bienvenido a la Tienda</Text>
            {/* Botón para ir a Login */}
            <Button title="Ir a Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

export default HomeScreen;
