import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseApp, auth } from "../firebase.config";

// Crear el contexto
export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

// Inicializar Firestore
const db = getFirestore(firebaseApp);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const [authState, setAuthState] = useState({
    authenticated: false,
    user: null,
    role: null,
  });
  
  // Detectar login automático
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const newState = await buildAuthState(user);
        setAuthState(newState);
      } else {
        setAuthState({
          authenticated: false,
          user: null,
          role: null,
        });
      }
    });

    return () => unsubscribe();
  }, [buildAuthState]);

  //obtener datos del usuario al iniciar sesión
  useEffect(() => {
    const fetchUserData = async () => {
      if (authState.user?.uid) {
        const userDoc = await getDoc(doc(db, "usuarios", authState.user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [authState.user]);

  // Función reutilizable para obtener y construir el estado del usuario
  const buildAuthState = useCallback(async (user) => {
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    let userData = user;
    let role = "user";

    if (userDoc.exists()) {
      userData = { ...user, ...userDoc.data() };
      role = userDoc.data().rol || "user";
    }

    return {
      authenticated: true,
      user: userData,
      role,
    };
  }, []);
  // Registro de usuario
  const onRegister = async (
    email,
    password,
    telefono = "",
    rol = "user",
    nombre = "",
    direccion = ""
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        correo: email,
        telefono,
        nombre,
        direccion,
        rol,
      });

      setAuthState({
        authenticated: true,
        user: res.user,
        role: rol,
      });

      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  };

  // Login de usuario
  const onLogin = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const newState = await buildAuthState(res.user);
      setAuthState(newState);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  // Logout
  const onLogout = async () => {
    await firebaseSignOut(auth);
    setAuthState({
      authenticated: false,
      user: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, onLogin, onRegister, onLogout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
