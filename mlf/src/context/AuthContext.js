import { createContext, useContext, useEffect, useState } from "react";
import { fakeApi } from "../services/mockApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    fakeApi.getSession().then(setSession);
  }, []);

  const login = async (data) => {
    const s = await fakeApi.login(data);
    setSession(s);
  };

  const register = async (data) => {
    await fakeApi.register(data);
    await login(data);
  };

  const logout = async () => {
    await fakeApi.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);