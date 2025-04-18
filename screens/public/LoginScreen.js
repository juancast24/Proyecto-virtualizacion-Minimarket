import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log('▶ handleLogin fired', { username, password });
    const user = await onLogin(username.trim(), password);
    if (!user || !password) {
      return Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }

    if (user.role === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
      navigation.navigate('UserDashboard');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Usuario"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* Botón real de Login */}
      <Button title="Iniciar Sesión" onPress={handleLogin} />
       <View style={styles.space} />
      <Button title="Registrarse" onPress={() => navigation.navigate('RegisterScreen')}/>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  space: {
    marginBottom: 20, // Ajusta el espacio entre los botones
  },
});

export default LoginScreen;