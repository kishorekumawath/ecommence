import { createContext } from "react";
import {products} from "../assets/assets"
export const ShopContext = createContext();

const ShopContextProvider = (props)=>{
    const currency = '$';
    const delivery_fee = 10;
    // 
    const CategoryData = [];

    const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:9000/api/v1/subcategories",{method:'get',
            headers:{
              'Content-Type':'application/json',
              'Accept':'application/json'
            }
          });
  
          // console.log ("Data : ",response.data);
           const result = await response.json(); // Assuming the API returns JSON data.
          
          setCollectionsData(result.data); // Adjust `data` based on the API's response structure.
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
  
    const value = {
        products,currency,delivery_fee,CategoryData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;