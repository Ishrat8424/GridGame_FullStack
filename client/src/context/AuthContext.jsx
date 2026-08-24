import { useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContextBase";

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem("gamegrid_user");
  const storedToken = localStorage.getItem("gamegrid_token");

  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );

  const [token, setToken] = useState(
    storedToken || null
  );

  const [loading, setLoading] = useState(true);

  const login = (userData, authToken) => {
    localStorage.setItem(
      "gamegrid_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "gamegrid_token",
      authToken
    );

    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("gamegrid_user");
    localStorage.removeItem("gamegrid_token");

    setUser(null);
    setToken(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem("gamegrid_user", JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);

        localStorage.setItem(
          "gamegrid_user",
          JSON.stringify(response.data.user)
        );
      } catch (error) {
        console.error("Failed to fetch current user:", error);

        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

