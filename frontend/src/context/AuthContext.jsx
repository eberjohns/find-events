import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetch('http://127.0.0.1:8000/users/me/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, [token]);

  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    const { access_token } = response.data;
    localStorage.setItem('authToken', access_token);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
