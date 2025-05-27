import { createContext, useContext, useState, useEffect } from "react";
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

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,

    authenticated: false,
    user: null,
    role: null,
  });

  // Detectar login automático (si ya estaba logueado)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setAuthState({
          authenticated: true,
          user,
          role,
        });
      } else {
        setAuthState({
          authenticated: false,
          user: null,
          role: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Obtener el rol desde Firestore
  const getUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "usuarios", uid));
    if (userDoc.exists()) {
      return userDoc.data().rol || "user";
    }
    return "user";
  };

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
        telefono: telefono,
        nombre: nombre,
        direccion: direccion,
        rol: rol,
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
      const uid = res.user.uid;
      const userDoc = await getDoc(doc(db, "usuarios", uid));
      let userData = res.user;
      let role = "user";
      if (userDoc.exists()) {
        userData = { ...res.user, ...userDoc.data() }; // Combina datos de Auth y Firestore
        role = userDoc.data().rol || "user";
      }
      setAuthState({
        authenticated: true,
        user: userData,
        role,
      });
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
    <AuthContext.Provider value={{ authState, onLogin, onRegister, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
