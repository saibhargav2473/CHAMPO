import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    // unauthorized role - redirect to home or correct dashboard
    return <Navigate to="/" replace />;
  }
  return children;
}
