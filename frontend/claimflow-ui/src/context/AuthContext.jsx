import { createContext, useContext, useEffect, useRef, useState } from "react";

// Create a context to share auth data across the app
const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Stores currently logged-in user
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const logoutTimerRef = useRef(null);
  
  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }

  // Clears user session on logout
  const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const scheduleAutoLogout = (token) => {
    clearLogoutTimer();
    const decodedToken = parseJwt(token);

    if(!decodedToken?.exp) {
      return;
    }

    const expiryTimeInMs = decodedToken.exp * 1000;
    const currentTimeInMs = Date.now();
    const timeoutDuration = expiryTimeInMs - currentTimeInMs;

    if(timeoutDuration <= 0) {
      logout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      logout();
      alert("Your session has expired. Please log in again.");
    }, timeoutDuration);
  };

  // Called after successful login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    scheduleAutoLogout(token);
  };
  
  // On app load, check if user exists in localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        scheduleAutoLogout(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    } finally {
      setAuthLoading(false);
    } 
  }, []);

  useEffect(() => {
    return () => clearLogoutTimer(); // stops timer if app reloads
  }, []);

  return (
    // Provide auth state and functions to entire app
    <AuthContext.Provider value={{ user, setUser, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to auth context
export function useAuth() {
  return useContext(AuthContext);
}