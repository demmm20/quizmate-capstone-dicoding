
import { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { saveAuth, clearAuth } from '../utils/authStorage';

export const useAuth = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const { user, setUser, token, setToken } = authContext;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(email, password);
        const userData = response.user || response.data?.user;
        const tokenData = response.user?.token || response.token || response.data?.token;
        if (!tokenData) throw new Error('Token tidak ditemukan di response');

        saveAuth(userData, tokenData); 
        setToken(tokenData);
        setUser(userData || {});
        return { user: userData, token: tokenData };
      } catch (err) {
        setError(err.message || 'Login gagal');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken]
  );

  const logout = useCallback(() => {
    clearAuth();         
    setUser(null);
    setToken(null);
    navigate('/login');
  }, [setUser, setToken, navigate]);

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };
};

export default useAuth;