import { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sfcc_token');
    const savedUser = localStorage.getItem('sfcc_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      getMeApi()
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('sfcc_token', token);
    localStorage.setItem('sfcc_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sfcc_token');
    localStorage.removeItem('sfcc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
