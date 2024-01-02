import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [loginData, setLoginData] = useState();
  const isAdmin = loginData?.admin === 1 ? true : false;

  const handleLoginSuccess = (data) => {
    setLoginData(data);
    setUserLoggedIn(true);
  };

  const handleLogout = () => {
    setLoginData();
    setUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userLoggedIn, loginData, isAdmin, setLoginData, handleLoginSuccess, handleLogout }}>
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