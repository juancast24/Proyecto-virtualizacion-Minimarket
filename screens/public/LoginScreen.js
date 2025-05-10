import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, Pressable } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const { onLogin, onRegister } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      return Alert.alert('Error', 'Hay campos sin rellenar');
    }

    const user = await onLogin(username.trim(), password);
    if (!user) {
      return Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }

    navigation.dispatch( // Resetear la navegación a la pantalla de inicio del usuario o admin según sea el caso    
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: user.role === 'admin' ? 'AdminRoot' : 'UserRoot',
          },
        ],
      })
    );
  };

  const handleRegister = async () => {
    const success = await onRegister(username.trim(), password, confirmPassword.trim(), phone.trim());
    if (success) {
      setIsLogin(true);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setPhone('');
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo-market.png')} style={styles.logo} />
        <Text style={styles.title}>{isLogin ? 'Bienvenido' : 'Crea tu cuenta'}</Text>

        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleButton, isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.activeText]}>Iniciar Sesión</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, !isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.activeText]}>Registrarse</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Usuario"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          {!isLogin && (
            <TextInput
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
          )}
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          {!isLogin && (
            <TextInput
              placeholder="Confirmar Contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          )}

          <Pressable style={styles.mainButton} onPress={isLogin ? handleLogin : handleRegister}>
            <Text style={styles.mainButtonText}>{isLogin ? 'Entrar' : 'Crear cuenta'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#F6FDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logo: {
    width: 130,
    height: 130,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4A90E2',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  activeToggle: {
    backgroundColor: '#4A90E2',
  },
  activeText: {
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  mainButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    marginTop: 10,
    marginHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
