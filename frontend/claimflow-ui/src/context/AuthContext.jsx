import { createContext, useContext, useEffect, useState } from "react";

// Create a context to share auth data across the app
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Stores currently logged-in user
  const [user, setUser] = useState(null);

  // On app load, check if user exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Called after successful login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Clears user session on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    // Provide auth state and functions to entire app
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to auth context
export function useAuth() {
  return useContext(AuthContext);
}