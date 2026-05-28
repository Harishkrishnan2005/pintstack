import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMeRequest, loginRequest, registerRequest } from "../services/authService.js";
import { AuthContext } from "./authContext.js";

const tokenKey = "pinstack_token";
const tenantKey = "pinstack_tenant";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(tenantKey);
    setUser(null);
  };

  const persistSession = (payload) => {
    localStorage.setItem(tokenKey, payload.token);
    localStorage.setItem(tenantKey, payload.user.tenantId || "public");
    setUser(payload.user);
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    persistSession(response);
    toast.success(response.message);
    return response;
  };

  const login = async (payload) => {
    const response = await loginRequest(payload);
    persistSession(response);
    toast.success(response.message);
    return response;
  };

  const logout = () => {
    clearSession();
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    const hydrateSession = async () => {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMeRequest();
        setUser(response.user);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    hydrateSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
