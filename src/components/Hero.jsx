import React, { useEffect, useState, useCallback } from "react";
import {
  assets,
  heroSlideContent,
  desktopBanners,
  mobileBanners,
} from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize isMobile in useEffect to avoid SSR mismatch
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Memoize the current banner calculation
  const currentBanner = isMobile
    ? mobileBanners[currentImage]
    : desktopBanners[currentImage];

  // Memoize the handleResize function
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentImage((prev) =>
      prev === desktopBanners.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentImage((prev) =>
      prev === 0 ? desktopBanners.length - 1 : prev - 1
    );
  }, []);

  const getSlideDistance = () => {
    if (window.innerWidth >= 1024) return 1000;
    if (window.innerWidth >= 768) return 500;
    if (window.innerWidth >= 640) return 300;
    return 100;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? getSlideDistance() : -getSlideDistance(),
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? getSlideDistance() : -getSlideDistance(),
      opacity: 0,
    }),
  };

  const textVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      scale: 0.95,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      scale: 0.95,
    }),
  };

  const transitionProps = {
    type: "tween",
    duration: 1,
    stiffness: 300,
    damping: 20,
  };

  useEffect(() => {
    const slideInterval = setInterval(nextImage, 5000);
    return () => clearInterval(slideInterval);
  }, [nextImage]);

  const NavigationButton = ({ onClick, direction, className }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-20
        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
        rounded-full 
        bg-white/30 backdrop-blur-md 
        flex items-center justify-center 
        hover:bg-white/50 
        transition
        ${className}`}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    >
      <img
        src={direction === "left" ? assets.arrow_left : assets.arrow_right}
        alt={direction === "left" ? "Previous" : "Next"}
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
      />
    </button>
  );

  return (
    <div className="relative w-full h-[70vh] md:h-[60vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentImage}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionProps}
          src={currentBanner}
          alt={`Slide ${currentImage + 1}`}
          className="absolute w-full h-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>

      {/* Uncomment if you want to use the overlay content */}
      {/* <div className="absolute inset-0 bg-black/20"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          custom={direction}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionProps}
          className="absolute inset-0 flex items-end justify-end p-4 sm:p-6 md:p-10"
        >
          <div className="text-right text-white space-y-2 sm:space-y-3 md:space-y-4">
            <motion.p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium">
              {heroSlideContent[currentImage].subtitle}
            </motion.p>
            <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              {heroSlideContent[currentImage].title}
            </motion.h2>
            <motion.button
              className="rounded-full 
                bg-black 
                px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 
                text-sm sm:text-base md:text-lg 
                text-white 
                hover:bg-gray-800 
                transition"
            >
              {heroSlideContent[currentImage].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence> */}

      <NavigationButton
        onClick={prevImage}
        direction="left"
        className="left-2 sm:left-4"
      />
      <NavigationButton
        onClick={nextImage}
        direction="right"
        className="right-2 sm:right-4"
      />

      {/* Optional: Add slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {desktopBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentImage ? 1 : -1);
              setCurrentImage(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImage ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;
