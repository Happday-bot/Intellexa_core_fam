import { createContext, useContext, useState, useEffect } from "react";
import { baseurl } from "../../data/url";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseurl}/me`, { credentials: "include" });
        if (res.ok) {
          const user = await res.json();
          setAuth(user);
        } else {
          setAuth(null);
        }
      } catch {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
