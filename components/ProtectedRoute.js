import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/public/LoginScreen';
import UnauthorizedScreen from '../screens/public/UnauthorizedScreen';
// Componente que protege rutas según si hay usuario autenticado y su rol
const ProtectedRoute = ({ children, role }) => {

  const { user } = useContext(AuthContext);   // Obtenemos el estado del usuario desde el contexto
  if (!user) return <LoginScreen />; // Si no hay usuario logueado, redirige a Login
  if (role && user.role !== role) return <UnauthorizedScreen />; // Si se requiere un rol específico y el usuario no lo cumple, muestra pantalla de no autorizado

  return children;   // Si todo está bien, renderiza el contenido hijo (la pantalla protegida)
};

export default ProtectedRoute;