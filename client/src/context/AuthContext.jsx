import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set authorization header in api client
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/profile');
          if (response.data && response.data.success) {
            setUser(response.data.data);
          } else {
            // Token invalid or expired
            logout();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { token, user: userData } = response.data.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const register = async (name, email, phone, password, role) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role
      });
      if (response.data && response.data.success) {
        const { token, user: userData } = response.data.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data && response.data.success) {
        setUser(response.data.data);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Update failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed. Try again.'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
