import { useContext, useEffect, useState, useRef } from "react";
import { ProductTitle, Title } from "./Title";
import { ProductItem } from "../components/ProductItem";

import { products } from "../assets/assets";
import { useWishlist } from "../context/WhislistContext";
function LatestCollections() {
  // const { products } = useContext(ShopContext);
  const [LastestProducts, setLatestProducts] = useState([]);
  const carouselRef = useRef(null);
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -300, // Adjust this value based on the card width
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: 300, // Adjust this value based on the card width
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
    const intervalId = setInterval(() => {
      if (carouselRef.current) {
        const carousel = carouselRef.current;
        const scrollAmount = carousel.scrollWidth / 5; // Adjust to scroll to next item
        const nextScrollPosition = carousel.scrollLeft + scrollAmount;

        // Check if we are close to the end of the carousel
        if (
          carousel.scrollLeft + carousel.offsetWidth >=
          carousel.scrollWidth
        ) {
          // Scroll back to the start smoothly
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll to the next item smoothly
          carousel.scrollTo({
            left: nextScrollPosition,
            behavior: "smooth",
          });
        }
      }
    }, 3000); // Scroll every 3 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="my-2 sm:my-8 lg:my-10 ">
      <div className="text-center py-8 text-3xl">
        <Title text1={"Latest"} text2={" Collection"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          perspiciatis eligendi quis ipsa accusantium aliquam aut ducimus!
          Excepturi eligendi, sunt dolore architecto adipisci perspiciatis
          maxime ut ad, vitae nostrum nesciunt?
        </p>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide space-x-4 px-6"
      >
        {products.slice(0, 10).map((product, index) => (
          <ProductItem
            key={index}
            id={product._id}
            name={product.name}
            image={product.image[0]}
            price={product.price}
            className="w-52 sm:w-64 "
            onLikeClick={(e) => {
              e.preventDefault();
              if (!wishlistItems.includes(product._id)) {
                console.log("adding from wishlist");
                addToWishlist(product._id);
              } else {
                console.log("removing from wishlist");
                removeFromWishlist(product._id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default LatestCollections;
