import { createContext, useContext, useState } from "react";

// Roles disponibles
const Role = {
  ADMIN: "admin",
  USER: "user",
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null, // Para compatibilidad con las verificaciones en Layout.js
    authenticated: false,
    username: null,
    role: null,
  });

  // onLogin SÓLO valida y devuelve user o null
  const onLogin = async (username, password) => {
    if (username.trim() === "" || password.trim() === "") {
      return null; // Inválido - campos vacíos
    }

    if (username === "admin" && password === "admin") {
      const authData = {
        token: "admin-token-123", // Simulando un token
        authenticated: true,
        username: username,
        role: Role.ADMIN,
      };
      setAuthState(authData);
      return authData;
    }

    if (username === "user" && password === "user") {
      const authData = {
        token: "user-token-123", // Simulando un token
        authenticated: true,
        username: username,
        role: Role.USER,
      };
      setAuthState(authData);
      return authData;
    }

    // No coincide con los usuarios hardcodeados
    return null;
  };

  // Función para manejar el registro de un usuario
  const onRegister = (username, password, confirmPassword, phone) => {
    if (
      username.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      phone.trim()
    ) {
      // Estructura consistente con onLogin
      setAuthState({
        token: "new-user-token-123",
        authenticated: true,
        username: username,
        role: Role.USER,
      });
      return true;
    } else {
      return false;
    }
  };

  // Renombrado para consistencia con Layout.js
  const signOut = () => {
    setAuthState({
      token: null,
      authenticated: false,
      username: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        onLogin,
        onRegister,
        signOut, // Exportar con el nombre usado en Layout
        onLogout: signOut, // Para compatibilidad con código existente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
