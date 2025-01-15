import React, { useEffect } from "react";
import { Title } from "./Title";
import { useCollections } from "../context/CollectionsContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { CollectionCategoryItem } from "./ProductItem";

// Skeleton components remain the same
const CategorySkeleton = () => (
  <div className="animate-pulse">
    <div className="relative aspect-square bg-gray-200 rounded-lg"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
  </div>
);

const CategorySectionSkeleton = () => (
  <div className="text-center py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center mt-6 mx-10">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
      </div>
    </div>
  </div>
);

function Collections() {
  const { CollectionsData, isLoading, error, fetchCollections } =
    useCollections();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (
    isLoading ||
    !CollectionsData ||
    Object.keys(CollectionsData).length === 0
  ) {
    return (
      <div className="my-2 sm:my-8 lg:my-10">
        <CategorySectionSkeleton />
        <CategorySectionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading collections: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="my-2 sm:my-8 lg:my-10">
      {Object.entries(CollectionsData).map(
        ([categoryName, categoryData], index) => {
          // Assuming each category has an id property in the data
          console.log("Category Data:", categoryData);
          const categoryId =
            categoryData.id || categoryName.toLowerCase().replace(/\s+/g, "-");

          return (
            <div key={index} className="text-center p-5 text-3xl">
              <Title
                text1={categoryName.split(" ")[0]}
                text2={` ${categoryName.split(" ")[1] || ""}`}
              />
              <p className="w-3/4 m-auto text-sm sm:text-sm md:text-base text-gray-600">
                {categoryData.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center  mt-2 ">
                {categoryData.map((subCategory, subIndex) => {
                  // Ensure subcategory has an id, fallback to generated one if not present
                  // const subCategoryId =
                  //   subCategory.id ||
                  //   `${subCategory.name.toLowerCase().replace(/\s+/g, "-")}`;
                  const subCategoryId = `${subCategory.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`;
                  return (
                    <CollectionCategoryItem
                      key={subIndex}
                      title={subCategory.name}
                      img={subCategory.thumbnail || assets.p_img1}
                      categoryName={subCategory.name}
                      onClick={() => {
                        navigate(`/collection/${categoryId}/${subCategoryId}`);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default Collections;
