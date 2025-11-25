import { createContext, useContext, useState, useEffect } from "react";
import { getCred } from "../auth/auth";

const AuthContext = createContext();

export const AuthProvider = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try {
      const raw = getCred();
      setAuth(raw ? JSON.parse(raw) : null);
    } catch {
      setAuth(null);
    }
  }, []);
};

export const useAuth = () => useContext(AuthContext);
