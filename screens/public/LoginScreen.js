import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true); // Determina si estamos en login o registro
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Solo para registro
  const [phone, setPhone] = useState(''); // Solo para registro

  const { onLogin, onRegister } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Verificar si los campos están vacíos antes de llamar a onLogin
    if (username.trim() === '' || password.trim() === '') {
      return Alert.alert('Error', 'Hay campos sin rellenar');
    }

    const user = await onLogin(username.trim(), password);

    if (!user) {
      return Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }

    // Redirigir dependiendo del rol del usuario
    if (user.role === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
      navigation.navigate('UserDashboard');
    }
  };
  const handleRegister = async () => {
    const success = await onRegister(username.trim(), password, confirmPassword.trim(), phone.trim());
    if (success) {
      setIsLogin(true); // Después de registro, volvemos al login
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setPhone('');
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/logo-market.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>

        {/* Botones de Login y Registro */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isLogin ? '#2f68ff' : '#4A90E2' }, // Color dinámico
            ]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: !isLogin ? '#2f68ff' : '#4A90E2' }, // Color dinámico
            ]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image source={require('../../assets/persona.png')} style={styles.persona} />
        </View>

        <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registro'}</Text>

        {/* Formulario de Login */}
        {isLogin ? (
          <>
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
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Formulario de Registro */
          <>
            <TextInput
              placeholder="Usuario"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <TextInput
              placeholder="Teléfono"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="Confirmar Contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
            <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  persona: {
    marginBottom: "10%",
    height: 70,
    width: 70,
    backgroundColor: "#d5dbdb",
    borderRadius: 25,

  },
  button: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor: '#2f68ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  buttonRegister: {
    backgroundColor: '#2f68ff',
    paddingVertical: 15, // Asegura que el botón tenga un tamaño adecuado
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 25,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingTop: 0,
    paddingHorizontal: 15,
    padding: 35,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  input: {
    width: '100%',        // Ocupa todo el ancho disponible
    paddingVertical: 10,  // Espacio interno arriba y abajo
    paddingHorizontal: 15,// Espacio interno a los lados
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,     // Espacio entre cada input
    backgroundColor: '#fff', // Fondo blanco (opcional)
  },
  logo: {
    marginTop: "20%",
    marginBottom: "0%",
    width: 240,
    height: 240,

  }
});

export default LoginScreen;