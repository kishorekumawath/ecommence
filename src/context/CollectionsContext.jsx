// CollectionsContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const CollectionsContext = createContext({
  CollectionsData: {},
  isLoading: false,
  error: null,
  fetchCollections: () => {},
  search:"",
  setSearch:()=>{},
  showSearch:false,
  setShowSearch:()=>{},
  fetchProducts:()=>{},
  fetchSpecificProduct:()=>{}
  
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
  const [search,setSearch] = useState("");
  const [showSearch,setShowSearch] = useState(false);


  const fetchCollections = useCallback(async () => {
    // console.log("Fetching collections started...");
    if(CollectionsData && Object.keys(CollectionsData).length > 0) {
      // console.log("CollectionsData already exists:", CollectionsData);
      console.log("CollectionsData already exists: ------>>",);
      return;
    }
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


  const fetchProducts = useCallback(async(category,subCategory)=>{
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/products/${category}/${subCategory}`
      );
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    }

  })

  const fetchSpecificProduct = async(productID)=>{
    try{
      const response = await fetch(`http://localhost:9000/api/v1/product/${productID}`);
      const data = await response.json();
      return data.product;
    }catch(error){
      console.log("error while fetching product data");
    }
  }

  // Add effect to monitor state changes
  // React.useEffect(() => {
  //   // console.log("CollectionsData updated:", CollectionsData);
  // }, [CollectionsData]);

  // React.useEffect(() => {
  //   // console.log("Loading state updated:", isLoading);
  // }, [isLoading]);

  const value = {
    CollectionsData,
    isLoading,
    error,
    fetchCollections,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    fetchProducts,
    fetchSpecificProduct
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};
