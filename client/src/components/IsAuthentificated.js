// isAuthenticated.js
import Cookies from 'universal-cookie';

const isAuthenticated = () => {
  const cookies = new Cookies();
  return cookies.get('token') !== undefined; // Retourne true si un token est présent
};

export default isAuthenticated;
