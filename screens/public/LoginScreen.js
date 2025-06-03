import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, Pressable, Keyboard, Dimensions, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KeyboardAwareLayout from '../../components/KeyboardAwareLayout';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = () => {
  // Estado para alternar entre login y registro
  const [isLogin, setIsLogin] = useState(true);
  // Estados para los campos del formulario
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [barrio, setBarrio] = useState('');

  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardOpen(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardOpen(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Obtiene funciones de autenticación del contexto
  const { onLogin, onRegister } = useAuth();

  // Maneja el inicio de sesión
  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      return Alert.alert('Error', 'Hay campos sin rellenar');
    }

    const user = await onLogin(email.trim(), password);
    if (!user) {
      return Alert.alert('Error', 'Email o contraseña incorrectos');
    }
  };

  // Maneja el registro de usuario
  const handleRegister = async () => {
    if (!name || !phone || !address || !email || !password || !confirmPassword) {
      return Alert.alert('Error', 'Todos los campos son obligatorios');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden');
    }

    const success = await onRegister(
      email.trim(),
      password,
      phone.trim(),
      'user',
      name.trim(),
      address.trim(),
      barrio.trim()
    );

    if (success) {
      // Limpia los campos y cambia a modo login
      setIsLogin(true);
      setemail('');
      setPassword('');
      setConfirmPassword('');
      setPhone('');
      setName('');
      setAddress('');
      setBarrio('');
    } else {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    }
  };

  // Calcula el alto mínimo del container
  const minHeight = keyboardOpen
    ? SCREEN_HEIGHT - (insets.bottom + 16)
    : SCREEN_HEIGHT;

  return (
    <KeyboardAwareLayout
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardPadding={keyboardOpen ? Math.max(insets.bottom - 8, 0) : 0}
      keyboardOpen={keyboardOpen}
    >
      <View style={[
        !keyboardOpen && { flex: 1, justifyContent: 'center' }
      ]}>
        <View style={styles.container}>
          {/* Logo y título */}
          <View style={{ alignItems: 'center' }}>
            <Image source={require('../../assets/logo-market.png')} style={styles.logo} />
            <Text style={styles.title}>{isLogin ? 'Bienvenido' : 'Crea tu cuenta'}</Text>
          </View>

          {/* Botones para alternar entre login y registro */}
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

        {/* Formulario de login o registro */}
        <View style={styles.form}>
          {/* Campos adicionales solo para registro */}
          {!isLogin && (
            <>
              <TextInput
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Teléfono"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />
              <TextInput
                placeholder="Dirección"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
              />
              <TextInput
                placeholder="Barrio"
                value={barrio}
                onChangeText={setBarrio}
                style={styles.input}
              />
            </>
          )}

            {/* Campo de email */}
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={setemail}
              style={styles.input}
            />
            {/* Campo de contraseña */}
            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            {/* Confirmar contraseña solo en registro */}
            {!isLogin && (
              <TextInput
                placeholder="Confirmar Contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
              />
            )}

            {/* Botón principal para login o registro */}
            <Pressable style={styles.mainButton} onPress={isLogin ? handleLogin : handleRegister}>
              <Text style={styles.mainButtonText}>{isLogin ? 'Entrar' : 'Crear cuenta'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAwareLayout>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginHorizontal: 20,
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
  centerWrapper: {
    width: '100%',
  },
});

export default LoginScreen;
