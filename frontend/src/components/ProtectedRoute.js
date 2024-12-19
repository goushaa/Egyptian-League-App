import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ authData, allowedRoles, children }) => {
  if (!authData.token || !allowedRoles.includes(authData.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;