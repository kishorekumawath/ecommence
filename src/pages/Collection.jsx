import React, { useContext, useEffect, useState } from "react";
import { assets, products } from "../assets/assets";
import { Title } from "../components/Title";
import { useNavigate, useParams } from "react-router-dom";
import { ProductItem } from "../components/ProductItem";
import { useCollections } from "../context/CollectionsContext";
import { pre, sub } from "framer-motion/client";

function Collection() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { CollectionsData,fetchProducts } = useCollections();
  const { categoryName, subCategoryName } = useParams();


  const [availablesCategory, setAvailablesCategory] = useState([]);
  const [availablesSubCategory, setAvailablesSubCategory] = useState([]);

  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);


  useEffect(() => {

    if (!CollectionsData || !categoryName) return;

    let [SelectedCategoryName,SelectedSubCategoryName]= reverseSlugToOriginal();

    if (!CollectionsData[SelectedCategoryName]) return;

    setAvailablesCategory(Object.keys(CollectionsData));

    var availableSubCategory = CollectionsData[SelectedCategoryName].map((item) => item);

    setAvailablesSubCategory([...availableSubCategory]);

    setSelectedCategory([SelectedCategoryName]);
    setSelectedSubCategory([availableSubCategory.find((item) => item.name === SelectedSubCategoryName)]);

   fetchProducts(categoryName,subCategoryName,setProducts).then((products)=>setProducts(products));

  }, [CollectionsData, categoryName]);



  const onCategoryToggle = (e) => {

    // we need to remove all subcategory if category is unselected
    if (selectedCategory.includes(e.target.value)) {
      // unchecking category
      setSelectedCategory((prev) => prev.filter((item) => item !== e.target.value));
      // remove all subcategory
      setAvailablesSubCategory(
        (prev) =>
          prev.filter(
            (item) =>
              !CollectionsData[e.target.value].some(
                (subCat) => subCat.name === item.name)));


      // removing products when subcategory is already has in selected state 
      CollectionsData[e.target.value].map((sc)=>{
        setProducts((prev)=>prev.filter((product)=>product.category.name !== sc.name))
        setSelectedSubCategory((prev)=>prev.filter((subCategory)=>subCategory.name !== sc.name))
      })
    }
    // we need to add subcategory if category is selected
    else {
      // checking category
      setSelectedCategory((prev) => [...prev, e.target.value]);
      // add all subcategory which are belong to this category
      setAvailablesSubCategory((prev) => [...prev, ...CollectionsData[e.target.value].map((item) => item)]);
    }
  }

  const onSubCategoryToggle = (subCat) => {

    
    // if subcategory is already selected then remove it
    if (selectedSubCategory.some((subCategory) => subCategory.name === subCat.name)) {
      // remove it from selected subcategory list
      setSelectedSubCategory((prev) => prev.filter((item) => item.name !== subCat.name));

      // remove 
      setProducts((prev)=>prev.filter((product)=>product.category.name!==subCat.name))
    }
    // else add it subcategory
    else {
      // add it to selected subcategory list
      setSelectedSubCategory((prev) => [...prev,subCat]);
      let [catSlug,subCatSlug] = OriginalToSlug(subCat.parentCategory,subCat.name);
      fetchProducts(catSlug,subCatSlug).then((productData)=>setProducts((prev)=>[...prev,...productData]))
    }
   

  }

  const reverseSlugToOriginal = () => {
    if (categoryName && subCategoryName) {
      // Find the exact matching category from CollectionsData
      const matchingCategory = Object.keys(CollectionsData).find(
        (category) =>
          category.toLowerCase().replace(/\s/g, "-") ===
          categoryName.toLowerCase()
      );
  
      // Special cases that should maintain their exact casing
      const specialCases = {
        "hooded-sweatshirt": "Hooded SweatShirt",
        "3/4th-sleeve-t-shirt": "3/4th Sleeve T-Shirt"
      };
  
      let subcategoryNameNormalized;
  
      // Check if the subcategoryName matches any special case
      const specialCaseKey = Object.keys(specialCases).find(
        key => key.toLowerCase() === subCategoryName.toLowerCase()
      );
  
      if (specialCaseKey) {
        // Use the predefined format for special cases
        subcategoryNameNormalized = specialCases[specialCaseKey];
      } else {
        // Default normalization for other cases
        subcategoryNameNormalized = subCategoryName
          .replace(/-/g, " ")
          .split(" ")
          .map((word, index, array) => {
            // Convert word to lowercase for comparison
            const lowerWord = word.toLowerCase();
  
            // Special case for T-Shirt
            if (lowerWord === "t" && index < array.length - 1 && 
                array[index + 1].toLowerCase() === "shirt") {
              return "T";
            }
            if (lowerWord === "shirt" && index > 0 && 
                array[index - 1].toLowerCase() === "t") {
              return "Shirt";
            }
  
            // Capitalize first letter for all other words
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(" ")
          .replace(/T Shirt/i, "T-Shirt");
      }
  
      console.log(matchingCategory,'---', subcategoryNameNormalized);
      return [matchingCategory, subcategoryNameNormalized];
    }
    return []; // Return empty array if categoryName or subCategoryName is missing
  };


  const OriginalToSlug = (category, subcategory) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, "-");
    return [categorySlug,subcategorySlug]
  };


  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t p-10">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          {" "}
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block `}
        >
          <p className="mb-3  text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {availablesCategory.map((category, index) => {
              return (
                <p className="flex gap-2" key={index}>
                  <input type="checkbox" checked={selectedCategory.some((Cat) => Cat === category)} value={category} onChange={onCategoryToggle} />{" "}
                  {category}
                </p>
              )
            })}
          </div>
        </div>

        {/* Sub Category filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block `}
        >
          <p className="mb-3  text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {availablesSubCategory.map((subCategory, index) => {
              return (
                <p className="flex gap-2" key={index}>
                  <input
                    type="checkbox"
                    value={subCategory.name}
                    checked={selectedSubCategory.some((subCat) => subCat.name === subCategory.name)}
                    onChange={(e)=>onSubCategoryToggle(subCategory)}
                  />{" "}
                  {subCategory.name}
                </p>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right side */}
      {/* <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={" COLLECTIONS"} />
          {/* Porduct sort */}
      {/* <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 rounded-md"
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div> */}


       
      {/* Map Products */}
      <div className="w-full">
         {/* Navigation title */}
         <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
                    <span>/</span>
                    <span className="hover:text-gray-900 capitalize">
                        {selectedCategory.map((category) => category).join(" & ")}
                    </span>

                </div>
                <div className="  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 place-items-center">
          {products.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
     
    


    </div>
  );
}

export default Collection;

