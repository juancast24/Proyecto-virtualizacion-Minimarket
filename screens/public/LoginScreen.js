import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showMessage } from "react-native-flash-message";

const LoginScreen = () => {
  // Estado para alternar entre login y registro
  const [isLogin, setIsLogin] = useState(true);
  // Estados para los campos del formulario
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [barrio, setBarrio] = useState("");
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  // Obtiene funciones de autenticación del contexto
  const { onLogin, onRegister } = useAuth();

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      return showMessage({
        message: "Error",
        description: "Hay campos sin rellenar",
        type: "danger",
        icon: "danger",
        style: {
          marginTop: 25,
          minWidth: 350,
          alignSelf: "center",
          borderRadius: 10,
        },
      });
    }
    setLoading(true);
    try {
      const user = await onLogin(email.trim(), password);
      if (!user) {
        setLoading(false);
        return showMessage({
          message: "Error",
          description: "Email o contraseña incorrectos",
          type: "danger",
          icon: "danger",
          style: {
            marginTop: 25,
            minWidth: 350,
            alignSelf: "center",
            borderRadius: 10,
          },
        });
      }
      // Obtén el nombre del usuario (ajusta según tu estructura de usuario)
      const nombre = user.nombre || user.displayName || "Usuario";
      showMessage({
        message: "¡Bienvenido!",
        description: `${nombre}.`,
        type: "success",
        icon: "success",
        duration: 2000,
        style: {
          marginTop: 25,
          minWidth: 350,
          alignSelf: "center",
          borderRadius: 10,
        },
      });
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Email o contraseña incorrectos",
        type: "danger",
        icon: "danger",
        style: {
          marginTop: 25,
          minWidth: 350,
          alignSelf: "center",
          borderRadius: 10,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Maneja el registro de usuario
  const handleRegister = async () => {
    if (
      !name ||
      !phone ||
      !address ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return Alert.alert("Error", "Todos los campos son obligatorios");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Las contraseñas no coinciden");
    }

    const success = await onRegister(
      email.trim(),
      password,
      phone.trim(),
      "user",
      name.trim(),
      address.trim(),
      barrio.trim()
    );

    if (success) {
      // Limpia los campos y cambia a modo login
      setIsLogin(true);
      setemail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setName("");
      setAddress("");
      setBarrio("");
    } else {
      Alert.alert("Error", "No se pudo crear la cuenta");
    }
  };

  // Calcula el alto mínimo del container
  return (
    <View style={styles.component}>
      <View style={styles.container}>
        {/* Logo y título */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/logo-market.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            {isLogin ? "Bienvenido" : "Crea tu cuenta"}
          </Text>
        </View>

        {/* Botones para alternar entre login y registro */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleButton, isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.activeText]}>
              Iniciar Sesión
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, !isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.activeText]}>
              Registrarse
            </Text>
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
            autoCapitalize="none"
          />
          {/* Confirmar contraseña solo en registro */}
          {!isLogin && (
            <TextInput
              placeholder="Confirmar Contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              autoCapitalize="none"
            />
          )}

          {/* Botón principal para login o registro */}
          <Pressable
            style={[
              styles.mainButton,
              loading && { backgroundColor: "#90C3F9" }, // Color más claro si loading
            ]}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={loading} // Desactiva el botón mientras carga
          >
            {loading && isLogin ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.mainButtonText}>
                {isLogin ? "Entrar" : "Crear cuenta"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  component: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6FDFF",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#0288D1",
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
    fontWeight: "900",
    color: "#4A90E2",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleText: {
    color: "#666",
    fontWeight: "600",
  },
  activeToggle: {
    backgroundColor: "#4A90E2",
  },
  activeText: {
    color: "#fff",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
  },
  mainButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    marginTop: 10,
    marginHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centerWrapper: {
    width: "100%",
  },
});

export default LoginScreen;
