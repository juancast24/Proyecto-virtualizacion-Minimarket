import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  // Estado para almacenar el nombre de usuario y la contraseña ingresados por el usuario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Extraemos la función onLogin desde el contexto de autenticación
  const { onLogin } = useAuth();

  // Usamos el hook de navegación para manejar las transiciones de pantalla
  const navigation = useNavigation();

  // Función que maneja el inicio de sesión según el rol especificado
  const handleLogin = (role) => {
    // Llamamos a la función onLogin del contexto para autenticar al usuario
    onLogin(username, password);

    // Si el rol es 'admin', navegamos al dashboard de admin
    if (role === 'admin') {
      navigation.navigate('AdminDashboard');
    }
    // Si el rol es 'user', navegamos al dashboard de usuario
    else {
      navigation.navigate('UserDashboard');
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {/* Botones de login para admin o user */}
      <Button title="Login como Admin" onPress={() => handleLogin('admin')} />
      <Button title="Login como Usuario" onPress={() => handleLogin('user')} />
    </View>
  );
};

export default LoginScreen;
