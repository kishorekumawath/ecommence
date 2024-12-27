// CollectionsContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const CollectionsContext = createContext({
  CollectionsData: {},
  isLoading: false,
  error: null,
  fetchCollections: () => {},
});

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};

export const CollectionsProvider = ({ children }) => {
  const [CollectionsData, setCollectionsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollections = useCallback(async () => {
    // console.log("Fetching collections started...");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/subcategories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const { success, data } = await response.json();
      // console.log("API Response - success:", success);
      // console.log("API Response - data:", data);

      if (!success) {
        throw new Error("API returned unsuccessful response");
      }

      setCollectionsData(data);
      // console.log("CollectionsData has been set:", data);
    } catch (err) {
      console.error("Error in fetchCollections:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      // console.log("Loading state set to false");
    }
  }, []);

  // Add effect to monitor state changes
  React.useEffect(() => {
    // console.log("CollectionsData updated:", CollectionsData);
  }, [CollectionsData]);

  React.useEffect(() => {
    // console.log("Loading state updated:", isLoading);
  }, [isLoading]);

  const value = {
    CollectionsData,
    isLoading,
    error,
    fetchCollections,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};
