// src/context/AuthContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults



  // Check authentication status when the component mounts
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/api/home');
      if (response.data.message === "Success") {
        setUser({ email: response.data.email });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/login', { email, password });
      if (response.data.message === "Success") {
        setUser({ email: response.data.email });
        return true;
      } else {
        setError(response.data.error || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during logout');
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/register', { name, email, password });
      if (response.data?.email) {
        return true;
      } else {
        setError(response.data);
        return false;
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred during registration');
      return false;
    }
  }, []);


  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
