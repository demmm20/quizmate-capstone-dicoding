
  import React, { createContext, useState, useEffect } from 'react';
  import { saveAuth, loadAuth } from '../utils/authStorage';

  export const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const { token: tk, user: usr } = loadAuth();
      if (tk) setToken(tk);
      if (usr) setUser(usr);
      saveAuth(usr, tk);
      setLoading(false);
    }, []);

    const value = {
      user,
      setUser,
      token,
      setToken,
      loading,
      isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };

  export default AuthProvider;