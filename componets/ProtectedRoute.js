import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/public/LoginScreen';
import UnauthorizedScreen from '../screens/public/UnauthorizedScreen';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <LoginScreen />;
  if (role && user.role !== role) return <UnauthorizedScreen />;

  return children;
};

export default ProtectedRoute;