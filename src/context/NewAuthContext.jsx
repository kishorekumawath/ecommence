import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { BASE_URL } from "../server/server";
const NewAuthContext = createContext({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isLoading: false,
  fetchUser: async () => {},
  updateUser: async () => {},
  accessToken: null,
  isAuthenticated: false,
});

// Secure storage wrapper
const SecureStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },
  getItem: (key, parse = false) => {
    try {
      const item = localStorage.getItem(key);
      return parse && item ? JSON.parse(item) : item;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },
};

export function NewAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // API call wrapper with error handling
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && refreshToken) {
          try {
            const refreshResponse = await fetch(
              `${BASE_URL}/api/v1/refresh-token`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              setAccessToken(refreshData.accessToken);
              setRefreshToken(refreshData.refreshToken);
              SecureStorage.setItem("accessToken", refreshData.accessToken);
              SecureStorage.setItem("refreshToken", refreshData.refreshToken);

              // Retry original request with new token
              return apiCall(endpoint, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${refreshData.accessToken}`,
                },
              });
            }
          } catch (refreshError) {
            logout();
            throw new Error("Session expired. Please login again.");
          }
        }
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      if (!navigator.onLine) {
        throw new Error("No internet connection");
      }
      throw error;
    }
  };

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccess = SecureStorage.getItem("accessToken");
        const storedRefresh = SecureStorage.getItem("refreshToken");
        const storedUser = SecureStorage.getItem("user", true);

        if (storedAccess && storedRefresh && storedUser) {
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Email and password are required");
    }

    try {
      const data = await apiCall("/api/v1/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      SecureStorage.setItem("accessToken", data.accessToken);
      SecureStorage.setItem("refreshToken", data.refreshToken);
      SecureStorage.setItem("user", data.user);

      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (firstName, lastName, email, password, phone) => {
    // Basic validation
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !phone?.trim()
    ) {
      throw new Error("All fields are required");
    }

    try {
      const data = await apiCall("/api/v1/signup", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      SecureStorage.setItem("accessToken", data.accessToken);
      SecureStorage.setItem("refreshToken", data.refreshToken);
      SecureStorage.setItem("user", data.user);

      return data.user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    SecureStorage.removeItem("accessToken");
    SecureStorage.removeItem("refreshToken");
    SecureStorage.removeItem("user");
  }, []);

  const fetchUser = async (userId) => {
    if (!userId) throw new Error("User ID is required");
    if (!accessToken) throw new Error("Authentication required");

    try {
      setIsLoading(true);
      const data = await apiCall(`/api/v1/user/${userId}`);
      setUser(data.user);
      SecureStorage.setItem("user", data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates) => {
    if (!user?._id || !accessToken) {
      throw new Error("No authenticated user");
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates || {}).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("No valid updates provided");
    }

    try {
      const { user: updatedUser } = await apiCall(
        `/api/v1/user/update/${user._id}`,
        {
          method: "PUT",
          body: JSON.stringify(cleanUpdates),
        }
      );

      setUser(updatedUser);
      SecureStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      if (error.message.includes("Session expired")) {
        logout();
      }
      throw error;
    }
  };

  const value = {
    apiCall,
    user,
    login,
    signup,
    logout,
    isLoading,
    fetchUser,
    updateUser,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
  };

  return (
    <NewAuthContext.Provider value={value}>{children}</NewAuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(NewAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
