//original code

// import React, { useEffect, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate, useParams } from "react-router-dom";
// import { ProductItem, ProductItemDesign2 } from "../components/ProductItem";
// import { useCollections } from "../context/CollectionsContext";
// import { Searchbar } from "../components/Searchbar";
// import { useWishlist } from "../context/WhislistContext";
// import { ToastContainer, toast } from "react-toastify";

// function Collection() {
//   const [showFilter, setShowFilter] = useState(false);
//   const navigate = useNavigate();

//   const { CollectionsData, fetchProducts } = useCollections();
//   const { categoryName, subCategoryName } = useParams();

//   const [availablesCategory, setAvailablesCategory] = useState([]);
//   const [availablesSubCategory, setAvailablesSubCategory] = useState([]);

//   const [products, setProducts] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState([]);
//   const [selectedSubCategory, setSelectedSubCategory] = useState([]);
//   // const [isLoading, setIsLoading] = useState(true);
//   const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
//   const [isProductsLoading, setIsProductsLoading] = useState(true);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   const {
//     wishlistItems = [],
//     addToWishlist,
//     removeFromWishlist,
//     error,
//   } = useWishlist() || {};

//   useEffect(() => {
//     const searchResults = products.filter((product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredProducts(searchResults);
//   }, [searchQuery]);

//   useEffect(() => {
//     if (!CollectionsData || !categoryName) {
//       setIsCategoriesLoading(false);
//       return;
//     }

//     let [SelectedCategoryName, SelectedSubCategoryName] =
//       reverseSlugToOriginal();

//     if (!CollectionsData[SelectedCategoryName]) {
//       setIsCategoriesLoading(false);
//       return;
//     }

//     setAvailablesCategory(Object.keys(CollectionsData));

//     var availableSubCategory = CollectionsData[SelectedCategoryName].map(
//       (item) => item
//     );

//     setAvailablesSubCategory([...availableSubCategory]);

//     setSelectedCategory([SelectedCategoryName]);
//     setSelectedSubCategory([
//       availableSubCategory.find(
//         (item) => item.name === SelectedSubCategoryName
//       ),
//     ]);
//     setIsCategoriesLoading(false);
//     setIsProductsLoading(true);
//     fetchProducts(categoryName, subCategoryName, setProducts)
//       .then((products) => {
//         setProducts(products);
//         setIsProductsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//         setIsProductsLoading(false);
//       });
//     // setIsLoading(false);
//   }, [CollectionsData, categoryName]);

//   const onCategoryToggle = (e) => {
//     // we need to remove all subcategory if category is unselected
//     if (selectedCategory.includes(e.target.value)) {
//       // unchecking category
//       setSelectedCategory((prev) =>
//         prev.filter((item) => item !== e.target.value)
//       );
//       // remove all subcategory
//       setAvailablesSubCategory((prev) =>
//         prev.filter(
//           (item) =>
//             !CollectionsData[e.target.value].some(
//               (subCat) => subCat.name === item.name
//             )
//         )
//       );

//       // removing products when subcategory is already has in selected state
//       CollectionsData[e.target.value].map((sc) => {
//         setProducts((prev) =>
//           prev.filter((product) => product.category.name !== sc.name)
//         );
//         setSelectedSubCategory((prev) =>
//           prev.filter((subCategory) => subCategory.name !== sc.name)
//         );
//       });
//     }
//     // we need to add subcategory if category is selected
//     else {
//       // checking category
//       setSelectedCategory((prev) => [...prev, e.target.value]);
//       // add all subcategory which are belong to this category
//       setAvailablesSubCategory((prev) => [
//         ...prev,
//         ...CollectionsData[e.target.value].map((item) => item),
//       ]);
//     }
//   };

//   const onSubCategoryToggle = (subCat) => {
//     // if subcategory is already selected then remove it
//     if (
//       selectedSubCategory.some(
//         (subCategory) => subCategory.name === subCat.name
//       )
//     ) {
//       // remove it from selected subcategory list
//       setSelectedSubCategory((prev) =>
//         prev.filter((item) => item.name !== subCat.name)
//       );

//       // remove
//       setProducts((prev) =>
//         prev.filter((product) => product.category.name !== subCat.name)
//       );
//     }
//     // else add it subcategory
//     else {
//       // add it to selected subcategory list
//       setSelectedSubCategory((prev) => [...prev, subCat]);
//       let [catSlug, subCatSlug] = OriginalToSlug(
//         subCat.parentCategory,
//         subCat.name
//       );
//       fetchProducts(catSlug, subCatSlug).then((productData) =>
//         setProducts((prev) => [...prev, ...productData])
//       );
//     }
//   };

//   const reverseSlugToOriginal = () => {
//     if (categoryName && subCategoryName) {
//       // Find the exact matching category from CollectionsData
//       const matchingCategory = Object.keys(CollectionsData).find(
//         (category) =>
//           category.toLowerCase().replace(/\s/g, "-") ===
//           categoryName.toLowerCase()
//       );

//       let subcategoryNameNormalized = subCategoryName
//         .replace(/-/g, " ")
//         .split(" ")
//         .map((word, index, array) => {
//           // Convert word to lowercase for comparison
//           const lowerWord = word.toLowerCase();

//           // Special case for T-Shirt
//           if (
//             lowerWord === "t" &&
//             index < array.length - 1 &&
//             array[index + 1].toLowerCase() === "shirt"
//           ) {
//             return "T";
//           }
//           if (
//             lowerWord === "shirt" &&
//             index > 0 &&
//             array[index - 1].toLowerCase() === "t"
//           ) {
//             return "Shirt";
//           }

//           // Capitalize first letter for all other words
//           return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//         })
//         .join(" ")
//         .replace(/T Shirt/i, "T-Shirt");

//       return [matchingCategory, subcategoryNameNormalized];
//     }
//     return []; // Return empty array if categoryName or subCategoryName is missing
//   };

//   const OriginalToSlug = (category, subcategory) => {
//     const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
//     const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, "-");
//     return [categorySlug, subcategorySlug];
//   };

//   // Update the like click handler to include error handling
//   const handleLikeClick = async (e, itemId) => {
//     e.preventDefault();
//     if (!wishlistItems) {
//       toast.error("Wishlist is not available");
//       return;
//     }

//     try {
//       if (
//         wishlistItems.some(
//           (wishlistItem) => wishlistItem?.product?._id === itemId
//         )
//       ) {
//         await removeFromWishlist(itemId);
//         toast.success("Item removed from wishlist");
//       } else {
//         await addToWishlist(itemId);
//         toast.success("Item added to wishlist");
//       }
//     } catch (error) {
//       console.error("Wishlist operation failed:", error);
//       toast.error("Please check if you are logged in.");
//     }
//   };

//   const isItemInWishlist = (itemId) => {
//     return (
//       wishlistItems?.some(
//         (wishlistItem) => wishlistItem?.product?._id === itemId
//       ) || false
//     );
//   };

//   if (isCategoriesLoading) {
//     return <CollectionSkeleton />;
//   }

//   return (
//     <div className="h-screen flex flex-col sm:flex-row gap-1 sm:gap-10  border-t p-5">
//       {/* Filter Options */}
//       <div className="min-w-60">
//         <p
//           onClick={() => setShowFilter(!showFilter)}
//           className="my-2 text-xl flex items-center cursor-pointer gap-2"
//         >
//           {" "}
//           FILTERS
//           <img
//             className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
//             src={assets.dropdown_icon}
//             alt=""
//           />
//         </p>

//         {/* Category Filter */}
//         <div
//           className={`border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block `}
//         >
//           <p className="mb-3  text-sm font-medium">CATEGORIES</p>

//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             {availablesCategory.map((category, index) => {
//               return (
//                 <p className="flex gap-2" key={index}>
//                   <input
//                     type="checkbox"
//                     checked={selectedCategory.some((Cat) => Cat === category)}
//                     value={category}
//                     onChange={onCategoryToggle}
//                   />{" "}
//                   {category}
//                 </p>
//               );
//             })}
//           </div>
//         </div>

//         {/* Sub Category filter */}
//         <div
//           className={`border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block `}
//         >
//           <p className="mb-3  text-sm font-medium">TYPE</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             {availablesSubCategory.map((subCategory, index) => {
//               return (
//                 <p className="flex gap-2" key={index}>
//                   <input
//                     type="checkbox"
//                     value={subCategory.name}
//                     checked={selectedSubCategory.some(
//                       (subCat) => subCat.name === subCategory.name
//                     )}
//                     onChange={(e) => onSubCategoryToggle(subCategory)}
//                   />{" "}
//                   {subCategory.name}
//                 </p>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="w-full">
//         <div className="flex flex-col md:flex-row justify-between mb-2 ">
//           {/* Navigation title Breadcrumbs */}
//           <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
//             <button
//               onClick={() => navigate("/")}
//               className="hover:text-gray-900"
//             >
//               Home
//             </button>
//             <span>/</span>
//             <span className="hover:text-gray-900 capitalize">
//               {selectedCategory.map((category) => category).join(" & ")}
//             </span>
//           </div>

//           {/* Toast container */}
//           <ToastContainer />

//           {/* Searchbar */}
//           <Searchbar
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             filteredProducts={filteredProducts}
//           />
//         </div>

//         {/* Map Products */}
//         <div className="">
//           {isProductsLoading ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6 place-items-start">
//               {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <ProductItemSkeleton key={i} />
//               ))}
//             </div>
//           ) : (
//             <>
//               {/* Existing products rendering logic */}
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 place-items-start">
//                 {filteredProducts.length === 0
//                   ? products.map((item, index) => (
//                       <ProductItem
//                         key={index}
//                         id={item._id}
//                         name={item.name}
//                         image={item.image}
//                         price={item.price}
//                         like={isItemInWishlist(item._id)}
//                         onLikeClick={(e) => handleLikeClick(e, item._id)}
//                       />
//                     ))
//                   : filteredProducts.map((item, index) => (
//                       <ProductItem
//                         key={index}
//                         id={item._id}
//                         name={item.name}
//                         image={item.image}
//                         price={item.price}
//                         like={isItemInWishlist(item._id)}
//                         onLikeClick={(e) => handleLikeClick(e, item._id)}
//                       />
//                     ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Collection;

// // Skeletons

// const ProductItemSkeleton = () => (
//   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 w-full">
//     {[1, 2, 3, 4, 5, 6].map((i) => (
//       <div key={i} className="animate-pulse">
//         <div className="aspect-square bg-gray-200 mb-2"></div>
//         <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       </div>
//     ))}
//   </div>
// );

// const CollectionSkeleton = () => (
//   <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t p-4 sm:p-10">
//     {/* Filter Section */}
//     <div className="min-w-60">
//       <div className="h-6 w-20 bg-gray-200 rounded mb-6" />

//       {/* Categories */}
//       <div className="hidden sm:block border border-gray-300 pl-5 py-3 mt-6">
//         <div className="w-24 h-4 bg-gray-200 rounded mb-4" />
//         <div className="space-y-3">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="flex gap-2">
//               <div className="w-4 h-4 bg-gray-200 rounded" />
//               <div className="w-20 h-4 bg-gray-200 rounded" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Types */}
//       <div className="hidden sm:block border border-gray-300 pl-5 py-3 mt-6">
//         <div className="w-16 h-4 bg-gray-200 rounded mb-4" />
//         <div className="space-y-3">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="flex gap-2">
//               <div className="w-4 h-4 bg-gray-200 rounded" />
//               <div className="w-24 h-4 bg-gray-200 rounded" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//     {/* Products Grid */}
//     <div className="w-full">
//       <div className="flex gap-2 mb-6">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="h-4 w-16 bg-gray-200 rounded" />
//         ))}
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 place-items-center">
//         {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//           <ProductItemSkeleton key={i} />
//         ))}
//       </div>
//     </div>
//   </div>
// );

//code 2

// import React, { useEffect, useState, useMemo } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { ProductItem } from "../components/ProductItem";
// import { useCollections } from "../context/CollectionsContext";
// import { Searchbar } from "../components/Searchbar";
// import { useWishlist } from "../context/WhislistContext";
// import { ToastContainer, toast } from "react-toastify";

// function Collection() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { categoryName, subCategoryName } = useParams();

//   const { CollectionsData, fetchProducts } = useCollections();
//   const {
//     wishlistItems = [],
//     addToWishlist,
//     removeFromWishlist,
//   } = useWishlist() || {};

//   const [showFilter, setShowFilter] = useState(false);
//   const [availablesCategory, setAvailablesCategory] = useState([]);
//   const [availablesSubCategory, setAvailablesSubCategory] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState([]);
//   const [selectedSubCategory, setSelectedSubCategory] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   // State preservation key
//   const STORAGE_KEY = "collection_page_state";

//   // Restore state from sessionStorage on initial load
//   useEffect(() => {
//     const savedState = sessionStorage.getItem(STORAGE_KEY);
//     if (savedState) {
//       try {
//         const parsedState = JSON.parse(savedState);

//         // Check if saved state matches current route
//         if (
//           parsedState.categoryName === categoryName &&
//           parsedState.subCategoryName === subCategoryName
//         ) {
//           setProducts(parsedState.products);
//           setSelectedCategory(parsedState.selectedCategory);
//           setSelectedSubCategory(parsedState.selectedSubCategory);
//           setAvailablesCategory(parsedState.availablesCategory);
//           setAvailablesSubCategory(parsedState.availablesSubCategory);
//           setIsLoading(false);
//           return;
//         }
//       } catch (error) {
//         console.error("Error parsing saved state:", error);
//       }
//     }

//     // Original loading logic
//     if (!CollectionsData || !categoryName) return;

//     let [SelectedCategoryName, SelectedSubCategoryName] =
//       reverseSlugToOriginal();

//     if (!CollectionsData[SelectedCategoryName]) return;

//     setAvailablesCategory(Object.keys(CollectionsData));

//     var availableSubCategory = CollectionsData[SelectedCategoryName].map(
//       (item) => item
//     );

//     setAvailablesSubCategory([...availableSubCategory]);

//     setSelectedCategory([SelectedCategoryName]);
//     setSelectedSubCategory([
//       availableSubCategory.find(
//         (item) => item.name === SelectedSubCategoryName
//       ),
//     ]);

//     fetchProducts(categoryName, subCategoryName, setProducts).then(
//       (products) => {
//         setProducts(products);
//         setIsLoading(false);
//       }
//     );
//   }, [CollectionsData, categoryName]);

//   // Save state to sessionStorage whenever state changes
//   useEffect(() => {
//     if (!isLoading) {
//       const stateToSave = {
//         categoryName,
//         subCategoryName,
//         products,
//         selectedCategory,
//         selectedSubCategory,
//         availablesCategory,
//         availablesSubCategory,
//       };

//       sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
//     }
//   }, [
//     isLoading,
//     products,
//     selectedCategory,
//     selectedSubCategory,
//     availablesCategory,
//     availablesSubCategory,
//   ]);

//   // Filtered products based on search
//   const filteredProducts = useMemo(() => {
//     return products.filter((product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [products, searchQuery]);

//   // Existing helper functions (reverseSlugToOriginal, OriginalToSlug, etc.)
//   // ... (keep the existing implementations)

//   const onCategoryToggle = (e) => {
//     // we need to remove all subcategory if category is unselected
//     if (selectedCategory.includes(e.target.value)) {
//       // unchecking category
//       setSelectedCategory((prev) =>
//         prev.filter((item) => item !== e.target.value)
//       );
//       // remove all subcategory
//       setAvailablesSubCategory((prev) =>
//         prev.filter(
//           (item) =>
//             !CollectionsData[e.target.value].some(
//               (subCat) => subCat.name === item.name
//             )
//         )
//       );

//       // removing products when subcategory is already has in selected state
//       CollectionsData[e.target.value].map((sc) => {
//         setProducts((prev) =>
//           prev.filter((product) => product.category.name !== sc.name)
//         );
//         setSelectedSubCategory((prev) =>
//           prev.filter((subCategory) => subCategory.name !== sc.name)
//         );
//       });
//     }
//     // we need to add subcategory if category is selected
//     else {
//       // checking category
//       setSelectedCategory((prev) => [...prev, e.target.value]);
//       // add all subcategory which are belong to this category
//       setAvailablesSubCategory((prev) => [
//         ...prev,
//         ...CollectionsData[e.target.value].map((item) => item),
//       ]);
//     }
//   };

//   const onSubCategoryToggle = (subCat) => {
//     // if subcategory is already selected then remove it
//     if (
//       selectedSubCategory.some(
//         (subCategory) => subCategory.name === subCat.name
//       )
//     ) {
//       // remove it from selected subcategory list
//       setSelectedSubCategory((prev) =>
//         prev.filter((item) => item.name !== subCat.name)
//       );

//       // remove
//       setProducts((prev) =>
//         prev.filter((product) => product.category.name !== subCat.name)
//       );
//     }
//     // else add it subcategory
//     else {
//       // add it to selected subcategory list
//       setSelectedSubCategory((prev) => [...prev, subCat]);
//       let [catSlug, subCatSlug] = OriginalToSlug(
//         subCat.parentCategory,
//         subCat.name
//       );
//       fetchProducts(catSlug, subCatSlug).then((productData) =>
//         setProducts((prev) => [...prev, ...productData])
//       );
//     }
//   };

//   const reverseSlugToOriginal = () => {
//     if (categoryName && subCategoryName) {
//       // Find the exact matching category from CollectionsData
//       const matchingCategory = Object.keys(CollectionsData).find(
//         (category) =>
//           category.toLowerCase().replace(/\s/g, "-") ===
//           categoryName.toLowerCase()
//       );

//       let subcategoryNameNormalized = subCategoryName
//         .replace(/-/g, " ")
//         .split(" ")
//         .map((word, index, array) => {
//           // Convert word to lowercase for comparison
//           const lowerWord = word.toLowerCase();

//           // Special case for T-Shirt
//           if (
//             lowerWord === "t" &&
//             index < array.length - 1 &&
//             array[index + 1].toLowerCase() === "shirt"
//           ) {
//             return "T";
//           }
//           if (
//             lowerWord === "shirt" &&
//             index > 0 &&
//             array[index - 1].toLowerCase() === "t"
//           ) {
//             return "Shirt";
//           }

//           // Capitalize first letter for all other words
//           return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//         })
//         .join(" ")
//         .replace(/T Shirt/i, "T-Shirt");

//       return [matchingCategory, subcategoryNameNormalized];
//     }
//     return []; // Return empty array if categoryName or subCategoryName is missing
//   };

//   const OriginalToSlug = (category, subcategory) => {
//     const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
//     const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, "-");
//     return [categorySlug, subcategorySlug];
//   };

//   const handleLikeClick = async (e, itemId) => {
//     e.preventDefault();
//     if (!wishlistItems) {
//       toast.error("Wishlist is not available");
//       return;
//     }

//     try {
//       if (
//         wishlistItems.some(
//           (wishlistItem) => wishlistItem?.product?._id === itemId
//         )
//       ) {
//         await removeFromWishlist(itemId);
//         toast.success("Item removed from wishlist");
//       } else {
//         await addToWishlist(itemId);
//         toast.success("Item added to wishlist");
//       }
//     } catch (error) {
//       console.error("Wishlist operation failed:", error);
//       toast.error("Please check if you are logged in.");
//     }
//   };

//   const isItemInWishlist = (itemId) => {
//     return (
//       wishlistItems?.some(
//         (wishlistItem) => wishlistItem?.product?._id === itemId
//       ) || false
//     );
//   };

//   if (isLoading) {
//     return <CollectionSkeleton />;
//   }

//   // Rest of the render method remains the same as in the original code
//   return (
//     <div className="h-screen flex flex-col sm:flex-row gap-1 sm:gap-10  border-t p-5">
//       {/* Filter Options */}
//       <div className="min-w-60">
//         <p
//           onClick={() => setShowFilter(!showFilter)}
//           className="my-2 text-xl flex items-center cursor-pointer gap-2"
//         >
//           {" "}
//           FILTERS
//           <img
//             className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
//             src={assets.dropdown_icon}
//             alt=""
//           />
//         </p>

//         {/* Category Filter */}
//         <div
//           className={`border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block `}
//         >
//           <p className="mb-3  text-sm font-medium">CATEGORIES</p>

//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             {availablesCategory.map((category, index) => {
//               return (
//                 <p className="flex gap-2" key={index}>
//                   <input
//                     type="checkbox"
//                     checked={selectedCategory.some((Cat) => Cat === category)}
//                     value={category}
//                     onChange={onCategoryToggle}
//                   />{" "}
//                   {category}
//                 </p>
//               );
//             })}
//           </div>
//         </div>

//         {/* Sub Category filter */}
//         <div
//           className={`border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block `}
//         >
//           <p className="mb-3  text-sm font-medium">TYPE</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             {availablesSubCategory.map((subCategory, index) => {
//               return (
//                 <p className="flex gap-2" key={index}>
//                   <input
//                     type="checkbox"
//                     value={subCategory.name}
//                     checked={selectedSubCategory.some(
//                       (subCat) => subCat.name === subCategory.name
//                     )}
//                     onChange={(e) => onSubCategoryToggle(subCategory)}
//                   />{" "}
//                   {subCategory.name}
//                 </p>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Right side */}
//       {/* <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <Title text1={"ALL"} text2={" COLLECTIONS"} />
//           {/* Porduct sort */}
//       {/* <select
//             onChange={(e) => setSortType(e.target.value)}
//             className="border-2 border-gray-300 text-sm px-2 rounded-md"
//           >
//             <option value="relavent">Sort by: Relavent</option>
//             <option value="low-high">Sort by: Low to High</option>
//             <option value="high-low">Sort by: High to Low</option>
//           </select>
//         </div> */}

//       {/* Right side */}
//       <div className="w-full">
//         <div className="flex flex-col md:flex-row justify-between mb-2 ">
//           {/* Navigation title Breadcrumbs */}
//           <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
//             <button
//               onClick={() => navigate("/")}
//               className="hover:text-gray-900"
//             >
//               Home
//             </button>
//             <span>/</span>
//             <span className="hover:text-gray-900 capitalize">
//               {selectedCategory.map((category) => category).join(" & ")}
//             </span>
//           </div>

//           {/* Toast container */}
//           <ToastContainer />

//           {/* Searchbar */}
//           <Searchbar
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             filteredProducts={filteredProducts}
//           />
//         </div>

//         {/* Map Products */}
//         <div className=" mt-5  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 place-items-start">
//           {filteredProducts.length === 0
//             ? products.map((item, index) => (
//                 <ProductItem
//                   key={index}
//                   id={item._id}
//                   name={item.name}
//                   image={item.image}
//                   price={item.price}
//                   like={isItemInWishlist(item._id)}
//                   onLikeClick={(e) => handleLikeClick(e, item._id)}
//                 />
//               ))
//             : filteredProducts.map((item, index) => (
//                 <ProductItem
//                   key={index}
//                   id={item._id}
//                   name={item.name}
//                   image={item.image}
//                   price={item.price}
//                   like={isItemInWishlist(item._id)}
//                   onLikeClick={(e) => handleLikeClick(e, item._id)}
//                 />
//               ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Collection;

//present working code with sepearate loading  skeleton components

import React, { useCallback, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { ProductItem } from "../components/ProductItem";
import { useCollections } from "../context/CollectionsContext";
import { Searchbar } from "../components/Searchbar";
import { useWishlist } from "../context/WhislistContext";
import { ToastContainer, toast } from "react-toastify";

// Skeleton Components
const CategorySkeleton = () => (
  <div className="animate-pulse space-y-2">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    ))}
  </div>
);

const SubCategorySkeleton = () => (
  <div className="animate-pulse space-y-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    ))}
  </div>
);

const ProductItemSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 w-full">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-square bg-gray-200 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

function Collection() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { CollectionsData, fetchProducts } = useCollections();
  const { categoryName, subCategoryName } = useParams();

  const [availablesCategory, setAvailablesCategory] = useState([]);
  const [availablesSubCategory, setAvailablesSubCategory] = useState([]);

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const {
    wishlistItems = [],
    addToWishlist,
    removeFromWishlist,
  } = useWishlist() || {};

  // Caching mechanism for products
  const getCachedProducts = useCallback((categorySlug, subCategorySlug) => {
    const cacheKey = `products_${categorySlug}_${subCategorySlug}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { products: cachedProducts, timestamp } = JSON.parse(cachedData);
      // Optional: Add cache expiration (e.g., 1 hour)
      const isExpired = Date.now() - timestamp > 3600000;

      if (!isExpired) {
        return cachedProducts;
      }
    }

    return null;
  }, []);

  const cacheProducts = useCallback(
    (categorySlug, subCategorySlug, productsToCache) => {
      const cacheKey = `products_${categorySlug}_${subCategorySlug}`;
      const cacheData = {
        products: productsToCache,
        timestamp: Date.now(),
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    },
    []
  );

  useEffect(() => {
    const searchResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(searchResults);
  }, [searchQuery, products]);

  useEffect(() => {
    if (!CollectionsData || !categoryName) {
      setIsCategoriesLoading(false);
      return;
    }

    let [SelectedCategoryName, SelectedSubCategoryName] =
      reverseSlugToOriginal();

    if (!CollectionsData[SelectedCategoryName]) {
      setIsCategoriesLoading(false);
      return;
    }

    setAvailablesCategory(Object.keys(CollectionsData));

    var availableSubCategory = CollectionsData[SelectedCategoryName].map(
      (item) => item
    );

    setAvailablesSubCategory([...availableSubCategory]);

    setSelectedCategory([SelectedCategoryName]);
    setSelectedSubCategory([
      availableSubCategory.find(
        (item) => item.name === SelectedSubCategoryName
      ),
    ]);
    setIsCategoriesLoading(false);
    setIsProductsLoading(true);

    // Check cache first
    const cachedProducts = getCachedProducts(categoryName, subCategoryName);

    if (cachedProducts) {
      setProducts(cachedProducts);
      setIsProductsLoading(false);
    } else {
      // Fetch and cache products if not in cache
      fetchProducts(categoryName, subCategoryName, setProducts)
        .then((fetchedProducts) => {
          setProducts(fetchedProducts);
          cacheProducts(categoryName, subCategoryName, fetchedProducts);
          setIsProductsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setIsProductsLoading(false);
        });
    }
  }, [
    CollectionsData,
    categoryName,
    subCategoryName,
    getCachedProducts,
    cacheProducts,
  ]);

  // Rest of the component methods remain the same as in the original code...

  const onCategoryToggle = (e) => {
    // we need to remove all subcategory if category is unselected
    if (selectedCategory.includes(e.target.value)) {
      // unchecking category
      setSelectedCategory((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
      // remove all subcategory
      setAvailablesSubCategory((prev) =>
        prev.filter(
          (item) =>
            !CollectionsData[e.target.value].some(
              (subCat) => subCat.name === item.name
            )
        )
      );

      // removing products when subcategory is already has in selected state
      CollectionsData[e.target.value].map((sc) => {
        setProducts((prev) =>
          prev.filter((product) => product.category.name !== sc.name)
        );
        setSelectedSubCategory((prev) =>
          prev.filter((subCategory) => subCategory.name !== sc.name)
        );
      });
    }
    // we need to add subcategory if category is selected
    else {
      // checking category
      setSelectedCategory((prev) => [...prev, e.target.value]);
      // add all subcategory which are belong to this category
      setAvailablesSubCategory((prev) => [
        ...prev,
        ...CollectionsData[e.target.value].map((item) => item),
      ]);
    }
  };

  const onSubCategoryToggle = (subCat) => {
    // if subcategory is already selected then remove it
    if (
      selectedSubCategory.some(
        (subCategory) => subCategory.name === subCat.name
      )
    ) {
      // remove it from selected subcategory list
      setSelectedSubCategory((prev) =>
        prev.filter((item) => item.name !== subCat.name)
      );

      // remove
      setProducts((prev) =>
        prev.filter((product) => product.category.name !== subCat.name)
      );
    }
    // else add it subcategory
    else {
      // add it to selected subcategory list
      setSelectedSubCategory((prev) => [...prev, subCat]);
      let [catSlug, subCatSlug] = OriginalToSlug(
        subCat.parentCategory,
        subCat.name
      );

      // Check cache first
      const cachedProducts = getCachedProducts(catSlug, subCatSlug);
      // If cached products are found, add them to the products state
      if (cachedProducts) {
        setProducts((prev) => [...prev, ...cachedProducts]);
      } else {
        fetchProducts(catSlug, subCatSlug).then((productData) => {
          cacheProducts(catSlug, subCatSlug, productData);
          setProducts((prev) => [...prev, ...productData]);
        });
      }
    }
  };

  const reverseSlugToOriginal = () => {
    if (categoryName && subCategoryName) {
      // Find the exact matching category from CollectionsData
      const matchingCategory = Object.keys(CollectionsData).find(
        (category) =>
          category.toLowerCase().replace(/\s/g, "-") ===
          categoryName.toLowerCase()
      );

      let subcategoryNameNormalized = subCategoryName
        .replace(/-/g, " ")
        .split(" ")
        .map((word, index, array) => {
          // Convert word to lowercase for comparison
          const lowerWord = word.toLowerCase();

          // Special case for T-Shirt
          if (
            lowerWord === "t" &&
            index < array.length - 1 &&
            array[index + 1].toLowerCase() === "shirt"
          ) {
            return "T";
          }
          if (
            lowerWord === "shirt" &&
            index > 0 &&
            array[index - 1].toLowerCase() === "t"
          ) {
            return "Shirt";
          }

          // Capitalize first letter for all other words
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ")
        .replace(/T Shirt/i, "T-Shirt");

      return [matchingCategory, subcategoryNameNormalized];
    }
    return []; // Return empty array if categoryName or subCategoryName is missing
  };

  const OriginalToSlug = (category, subcategory) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, "-");
    return [categorySlug, subcategorySlug];
  };

  const handleLikeClick = async (e, itemId) => {
    e.preventDefault();
    if (!wishlistItems) {
      toast.error("Wishlist is not available");
      return;
    }

    try {
      if (
        wishlistItems.some(
          (wishlistItem) => wishlistItem?.product?._id === itemId
        )
      ) {
        await removeFromWishlist(itemId);
        toast.success("Item removed from wishlist");
      } else {
        await addToWishlist(itemId);
        toast.success("Item added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("Please check if you are logged in.");
    }
  };

  const isItemInWishlist = (itemId) => {
    return (
      wishlistItems?.some(
        (wishlistItem) => wishlistItem?.product?._id === itemId
      ) || false
    );
  };

  if (isCategoriesLoading) {
    return (
      <div className="min-h-screen flex flex-col sm:flex-row gap-1 sm:gap-10 border-t p-5">
        <div className="min-w-60">
          <div className="border border-gray-300 pl-5 py-3 mt-6">
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <CategorySkeleton />
          </div>
          <div className="border border-gray-300 pl-5 py-3 mt-6">
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <SubCategorySkeleton />
          </div>
        </div>
        <div className="w-full">
          <ProductItemSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row gap-1 sm:gap-10 border-t p-5">
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
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block `}
        >
          <p className="mb-3  text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {availablesCategory.map((category, index) => {
              return (
                <p className="flex gap-2" key={index}>
                  <input
                    type="checkbox"
                    checked={selectedCategory.some((Cat) => Cat === category)}
                    value={category}
                    onChange={onCategoryToggle}
                  />{" "}
                  {category}
                </p>
              );
            })}
          </div>
        </div>

        {/* Sub Category filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
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
                    checked={selectedSubCategory.some(
                      (subCat) => subCat.name === subCategory.name
                    )}
                    onChange={(e) => onSubCategoryToggle(subCategory)}
                  />{" "}
                  {subCategory.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between mb-2">
          {/* Navigation title Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-900"
            >
              Home
            </button>
            <span>/</span>
            <span className="hover:text-gray-900 capitalize">
              {selectedCategory.map((category) => category).join(" & ")}
            </span>
          </div>

          <ToastContainer />

          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredProducts={filteredProducts}
          />
        </div>

        {/* Map Products */}
        <div>
          {isProductsLoading ? (
            <ProductItemSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 place-items-start">
              {filteredProducts.length === 0
                ? products.map((item) => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      like={isItemInWishlist(item._id)}
                      onLikeClick={(e) => handleLikeClick(e, item._id)}
                    />
                  ))
                : filteredProducts.map((item) => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      like={isItemInWishlist(item._id)}
                      onLikeClick={(e) => handleLikeClick(e, item._id)}
                    />
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collection;
