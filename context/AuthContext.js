import { createContext, useContext, useState } from 'react';


const Role = {
    ADMIN: 'admin',
    USER: 'user',
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        authenticated: null,
        username: null,
        role: null,
    });

    const onLogin = (username, password) => {
        if (username === 'admin' && password === 'admin') {
            setAuthState({ authenticated: true, username: username, role: Role.ADMIN });
        } else if (username === 'user' && password === 'user') {
            setAuthState({ authenticated: true, username: username, role: Role.USER });
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    };

    const onLogout = () => {
        console.log('onLogout');
        setAuthState({ authenticated: false, username: null, role: null });
    };

    const value = {
        authState,
        onLogin,
        onLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
