import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ProtectedRoute = ({ role, children }) => {
  const userRole = cookies.get('role');
  if (userRole !== role) {
    alert('Erreur : Vous n\'avez pas l\'autorisation d\'accéder à cette page.');
    return null; // Ou vous pouvez rediriger ou rendre quelque chose d'autre après l'alerte.
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;