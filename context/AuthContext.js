import { createContext, useContext, useState } from 'react';

//los roles disponibles en la aplicación
const Role = {
    ADMIN: 'admin',
    USER: 'user',
};
// Contexto para la autenticación
export const AuthContext = createContext({});
// El proveedor del contexto, que envuelve la aplicación para compartir el estado de autenticación
export const AuthProvider = ({ children }) => {
    // Estado que mantiene la información de autenticación del usuario
    const [authState, setAuthState] = useState({
        authenticated: null, // Estado de autenticación: null indica que no está autenticado
        username: null, // Nombre de usuario del usuario autenticado
        role: null, // Rol del usuario: 'admin' o 'user'
    });

    // Función para manejar el inicio de sesión
    const onLogin = (username, password) => {
        // Si el nombre de usuario y la contraseña coinciden con los de admin, se establece el estado de autenticación para admin
        if (username === 'admin' && password === 'admin') {
            setAuthState({ authenticated: true, username: username, role: Role.ADMIN });
        }
        // Si el nombre de usuario y la contraseña coinciden con los de user, se establece el estado de autenticación para user
        else if (username === 'user' && password === 'user') {
            setAuthState({ authenticated: true, username: username, role: Role.USER });
        }
        else {
            alert('Usuario o contraseña incorrectos');
        }
    };

    // Función para manejar el cierre de sesión
    const onLogout = () => {
        console.log('onLogout'); // Mensaje en la consola cuando el usuario cierra sesión
        setAuthState({ authenticated: false, username: null, role: null }); // Restablece el estado de autenticación
    };

    // Valor que será proporcionado a los consumidores del contexto
    const value = {
        authState, // El estado de autenticación
        onLogin, // Función para iniciar sesión
        onLogout, // Función para cerrar sesión
    };

    // Proveedor que envuelve la aplicación y permite que otros componentes accedan al contexto
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
