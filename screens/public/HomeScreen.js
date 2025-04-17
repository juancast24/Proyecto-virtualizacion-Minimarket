import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Bienvenido a la Tienda</Text>
      {/* Botón para ir a Login */}
      <Button title="Ir a Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default HomeScreen;
