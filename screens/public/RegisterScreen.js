import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // <-- Añadimos estado para teléfono
  const { onRegister } = useAuth(); // Obtenemos la función onRegister
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !phone.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      // Aquí iría la lógica de enviar los datos a la base de datos.
      console.log('Registrando usuario:', { username, password, phone });

      alert('Usuario registrado exitosamente');
      navigation.navigate('Login'); // Después de registrar, volver al login
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al registrar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
        <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad" // Esto activa el teclado numérico en móviles
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  space: {
    marginBottom: 20, // Ajusta el espacio entre los botones
  },
});

export default RegisterScreen;
