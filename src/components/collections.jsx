import React, { useEffect } from "react";
import { Title } from "./Title";
import { CollectionCategoryItem } from "./ProductItem";
import { useCollections } from "../context/CollectionsContext";

function Collections() {
  const { CollectionsData, isLoading, error, fetchCollections } =
    useCollections();
  // console.log("CollectionsData", CollectionsData);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Handle loading and error states
  if (isLoading) {
    return <p>Loading collections...</p>;
  }

  if (error) {
    return <p>Error loading collections: {error.message}</p>;
  }

  // Ensure CollectionsData exists and has the correct structure
  if (!CollectionsData || Object.keys(CollectionsData).length === 0) {
    return <p>No collections available.</p>;
  }

  return (
    <div className="my-2 sm:my-8 lg:my-10 ">
      {Object.keys(CollectionsData).map((collectionKey, index) => (
        <div key={index} className="text-center py-8 text-3xl">
          <Title
            text1={collectionKey.split(" ")[0]}
            text2={` ${collectionKey.split(" ")[1] || ""}`}
          />
          <p className="w-3/4 m-auto text-sm sm:text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
            perspiciatis eligendi quis ipsa accusantium aliquam aut ducimus!
            Excepturi eligendi, sunt dolore architecto adipisci perspiciatis
            maxime ut ad, vitae nostrum nesciunt?
          </p>
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center mt-6 mx-10">
            {CollectionsData[collectionKey].map((subCategory, CIndex) => (
              <CollectionCategoryItem
                key={CIndex}
                title={subCategory.name}
                img={subCategory.thumbnail || subCategory.image || ""}
                categoryId={subCategory.id}
                categoryName={subCategory.name}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Collections;
