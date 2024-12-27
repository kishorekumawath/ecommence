import React, { useContext, useEffect, useState } from "react";
import { assets, products } from "../assets/assets";
import { Title } from "../components/Title";
import { ProductItem } from "../components/ProductItem";

function Collection() {
  // const { products } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);

  const [filterProducts, setFilterProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const [sortType, setSortType] = useState("relvent");

  const Collections = {
    "Men’s Clothing": [
      {
        image:
          "data:image/jpeg;base64,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",
        name: "Unisex T-Shirt Classic",
      },
      {
        image:
          "https://www.shutterstock.com/image-photo/young-man-wearing-winter-clothes-260nw-1022031901.jpg", // Placeholder image link for Oversized Classic T-Shirt
        name: "Oversized Classic T-Shirt",
      },
      {
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAfPBTU2mDoscEFPWpI22CbeoljWPRYl8cQlUZ-6dbheglv9iCUfAITvfd9L4Tf8PKSvg&usqp=CAU", // Placeholder image link for Hooded SweatShirt
        name: "Hooded SweatShirt",
      },
    ],
    "Women’s Clothing": [
      {
        image:
          "https://img.freepik.com/free-photo/young-brunette-woman-with-sunglasses-urban-background_1139-893.jpg", // Placeholder image link for Dresses
        name: "Dresses",
      },
      {
        image:
          "data:image/jpeg;base64,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", // Placeholder image link for Unisex T-Shirt Classic // Placeholder image link for Blouses
        name: "Blouses",
      },
      {
        image:
          "https://www.shutterstock.com/image-photo/outdoor-fashion-portrait-two-young-260nw-1192869748.jpg", // Placeholder image link for Skirts
        name: "Skirts",
      },
      {
        image:
          "https://img.freepik.com/free-photo/woman-summer-style-walking-street_285396-2873.jpg",
        name: "Combo",
      },
      {
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzUf11hTrwByQh2T-XumS-NwXGx3B8uiqTWXWkEEsZNSQ0JLfVqUoLOyv9emZjYryuX0&usqp=CAU",
        name: "T-Shirts",
      },
    ],
    "Kid’s Clothing": [
      {
        image:
          "data:image/jpeg;base64,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", // Placeholder image link for Kids' T-Shirts
        name: "Kids' T-Shirts",
      },
      {
        image:
          "https://img.freepik.com/free-photo/cute-children-having-fun_1157-32483.jpg", // Placeholder image link for Kids' Shorts
        name: "Kids' Shorts",
      },
      {
        image:
          "https://bluejay.com.my/wp-content/uploads/2021/12/Kids-clothes-Hong-Kong-seed.jpg", // Placeholder image link for Kids' Jackets
        name: "Kids' Jackets",
      },
      {
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/027/110/402/small_2x/fashion-model-kids-free-photo.jpg",
        name: "Collections",
      },
    ],
  };

  const toogleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
      setSubCategory((prev) => {
        return prev.filter(
          (item) =>
            !Collections[e.target.value].some((subCat) => subCat.name === item)
        );
      });
    } else {
      setCategory((prev) => [...prev, e.target.value]);
      setSubCategory((prev) => [
        ...prev,
        ...Collections[e.target.value].map((subCat) => subCat.name),
      ]);
    }

    // filter products
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }

    //
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);
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
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block `}
        >
          <p className="mb-3  text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {Object.keys(Collections).map((col, index) => (
              <p className="flex gap-2" key={index}>
                <input type="checkbox" value={col} onChange={toogleCategory} />{" "}
                {col}
              </p>
            ))}
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
            {subCategory.map((subCat, index) => (
              <p className="flex gap-2" key={index}>
                <input
                  type="checkbox"
                  value={subCat}
                  onChange={toggleSubCategory}
                />{" "}
                {subCat}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={" COLLECTIONS"} />
          {/* Porduct sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 rounded-md"
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
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
