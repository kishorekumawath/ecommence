import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
  fetchUser: () => {},
  updateUser: () => {},
  accessToken: null,
  refreshToken: null,
});

const BASE_URL = "http://localhost:9000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccess && storedRefresh && storedUser) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (firstName, lastName, email, password, phone) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await response.json();

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const fetchUser = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:9000/api/v1/user/${userId}`
      );
      setUser(response.data);
      //   setError(null);
    } catch (err) {
      //   setError(err.response?.data?.message || "Error fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates) => {
    try {
      if (!user || !accessToken) {
        throw new Error("No user logged in");
      }

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const response = await fetch(
        `${BASE_URL}/api/v1/user/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanUpdates),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please login again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedData = await response.json();
      const updatedUser = updatedData.user;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    fetchUser,
    updateUser,
    accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
