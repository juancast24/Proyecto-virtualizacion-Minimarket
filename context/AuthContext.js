import { createContext, useContext, useState } from 'react';

// Roles disponibles
const Role = {
  ADMIN: 'admin',
  USER: 'user',
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    authenticated: false,
    username: null,
    role: null,
  });

  // onLogin SÓLO valida y devuelve user o null
  // NUNCA dispara alert aquí
  const onLogin = async (username, password) => {
    if (username === 'admin' && password === 'admin') {
      const admin = { username, role: Role.ADMIN };
      setAuthState({ authenticated: true, ...admin });
      return admin;
    }
    if (username === 'user' && password === 'user') {
      const user = { username, role: Role.USER };
      setAuthState({ authenticated: true, ...user });
      return user;
    }
    if (username.trim() === '' || password.trim() === '') {
        alert('hay campos sin rellenar')
      }
    else {
        alert('Usuario o contraseña incorrectos');
    }
  };

 // Función para manejar el registro de un usuario
 const onRegister = (username, password,phone) => {
  if (username && password && phone) {
    // Aquí normalmente registrarías al usuario en la base de datos, pero por ahora se simula
    setAuthState({ authenticated: true, username: username, role: Role.USER });
    alert('¡Usuario registrado con éxito!');
    return true; // Indica que el registro fue exitoso
  } else {
    alert('Por favor, complete todos los campos.');
    return false; // Si faltan campos
  }
};


  const onLogout = () => {
    setAuthState({ authenticated: false, username: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ authState, onLogin, onLogout, onRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);