import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin } = useAuth();
  const navigation = useNavigation();

  const handleLogin = (role) => {
    onLogin(username, password);
    if (role === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
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
