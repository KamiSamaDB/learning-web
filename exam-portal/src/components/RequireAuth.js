import React from 'react';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children, admin = false }) {
  const role = localStorage.getItem('role');
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (admin && role !== 'admin') {
    // Not an admin, redirect to home or login
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default RequireAuth;