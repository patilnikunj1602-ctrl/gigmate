import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('gigmate_token');
      const storedUser = localStorage.getItem('gigmate_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore authentication session:', err);
      localStorage.removeItem('gigmate_token');
      localStorage.removeItem('gigmate_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    // data is { token, email, role }
    const userData = {
      email: data.email,
      role: data.role,
      name: data.email.split('@')[0], // convenient fallback display name
    };

    localStorage.setItem('gigmate_token', data.token);
    localStorage.setItem('gigmate_user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (registerData) => {
    return await authService.register(registerData);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isRecruiter = user?.role === 'ROLE_RECRUITER';
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isStudent,
        isRecruiter,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
