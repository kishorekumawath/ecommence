// import React, { useEffect, useState, useCallback } from "react";
// import {
//   assets,
//   heroSlideContent,
//   desktopBanners,
//   mobileBanners,
// } from "../assets/assets";
// import { motion, AnimatePresence } from "framer-motion";

// function Hero() {
//   const [currentImage, setCurrentImage] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   // Initialize isMobile in useEffect to avoid SSR mismatch
//   useEffect(() => {
//     setIsMobile(window.innerWidth <= 768);
//   }, []);

//   // Memoize the current banner calculation
//   const currentBanner = isMobile
//     ? mobileBanners[currentImage]
//     : desktopBanners[currentImage];

//   // Memoize the handleResize function
//   const handleResize = useCallback(() => {
//     setIsMobile(window.innerWidth <= 768);
//   }, []);

//   useEffect(() => {
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);

//   const nextImage = useCallback(() => {
//     setDirection(1);
//     setCurrentImage((prev) =>
//       prev === desktopBanners.length - 1 ? 0 : prev + 1
//     );
//   }, []);

//   const prevImage = useCallback(() => {
//     setDirection(-1);
//     setCurrentImage((prev) =>
//       prev === 0 ? desktopBanners.length - 1 : prev - 1
//     );
//   }, []);

//   const getSlideDistance = () => {
//     if (window.innerWidth >= 1024) return 1000;
//     if (window.innerWidth >= 768) return 500;
//     if (window.innerWidth >= 640) return 300;
//     return 100;
//   };

//   const slideVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? getSlideDistance() : -getSlideDistance(),
//       opacity: 0,
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1,
//     },
//     exit: (direction) => ({
//       zIndex: 0,
//       x: direction < 0 ? getSlideDistance() : -getSlideDistance(),
//       opacity: 0,
//     }),
//   };

//   const textVariants = {
//     initial: (direction) => ({
//       opacity: 0,
//       x: direction > 0 ? 100 : -100,
//       scale: 0.95,
//     }),
//     animate: {
//       opacity: 1,
//       x: 0,
//       scale: 1,
//     },
//     exit: (direction) => ({
//       opacity: 0,
//       x: direction > 0 ? -100 : 100,
//       scale: 0.95,
//     }),
//   };

//   const transitionProps = {
//     type: "tween",
//     duration: 1,
//     stiffness: 300,
//     damping: 20,
//   };

//   useEffect(() => {
//     const slideInterval = setInterval(nextImage, 5000);
//     return () => clearInterval(slideInterval);
//   }, [nextImage]);

//   const NavigationButton = ({ onClick, direction, className }) => (
//     <button
//       onClick={onClick}
//       className={`absolute top-1/2 -translate-y-1/2 z-20
//         w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
//         rounded-full 
//         bg-white/30 backdrop-blur-md 
//         flex items-center justify-center 
//         hover:bg-white/50 
//         transition
//         ${className}`}
//       aria-label={direction === "left" ? "Previous slide" : "Next slide"}
//     >
//       <img
//         src={direction === "left" ? assets.arrow_left : assets.arrow_right}
//         alt={direction === "left" ? "Previous" : "Next"}
//         className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
//       />
//     </button>
//   );

//   return (
//     <div className="relative w-full h-[70vh] md:h-[60vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden">
//       <AnimatePresence initial={false} custom={direction}>
//         <motion.img
//           key={currentImage}
//           custom={direction}
//           variants={slideVariants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={transitionProps}
//           src={currentBanner}
//           alt={`Slide ${currentImage + 1}`}
//           className="absolute w-full h-full object-cover"
//           loading="lazy"
//         />
//       </AnimatePresence>

//       {/* Uncomment if you want to use the overlay content */}
//       {/* <div className="absolute inset-0 bg-black/20"></div>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentImage}
//           custom={direction}
//           variants={textVariants}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           transition={transitionProps}
//           className="absolute inset-0 flex items-end justify-end p-4 sm:p-6 md:p-10"
//         >
//           <div className="text-right text-white space-y-2 sm:space-y-3 md:space-y-4">
//             <motion.p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium">
//               {heroSlideContent[currentImage].subtitle}
//             </motion.p>
//             <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
//               {heroSlideContent[currentImage].title}
//             </motion.h2>
//             <motion.button
//               className="rounded-full 
//                 bg-black 
//                 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 
//                 text-sm sm:text-base md:text-lg 
//                 text-white 
//                 hover:bg-gray-800 
//                 transition"
//             >
//               {heroSlideContent[currentImage].buttonText}
//             </motion.button>
//           </div>
//         </motion.div>
//       </AnimatePresence> */}

//       <NavigationButton
//         onClick={prevImage}
//         direction="left"
//         className="left-2 sm:left-4"
//       />
//       <NavigationButton
//         onClick={nextImage}
//         direction="right"
//         className="right-2 sm:right-4"
//       />

//       {/* Optional: Add slide indicators */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//         {desktopBanners.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => {
//               setDirection(index > currentImage ? 1 : -1);
//               setCurrentImage(index);
//             }}
//             className={`w-2 h-2 rounded-full transition-colors ${
//               index === currentImage ? "bg-white" : "bg-white/50"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Hero;


import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotIndicators from "./DotIndicator";

const mockSlides = [
  {
    desktop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    mobile: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=768&h=600&fit=crop",
    title: "TOLUS SPRING COLLECTION",
    subtitle: "Find out our best spring collection. Offering our best quality product in a Tolus Spring Collection",
    cta: "Buy Now"
  },
  {
    desktop: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    mobile: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=768&h=600&fit=crop",
    title: "SUMMER ESSENTIALS",
    subtitle: "Discover our premium summer collection with sustainable materials and contemporary designs",
    cta: "Shop Now"
  },
  {
    desktop: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
    mobile: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=768&h=600&fit=crop",
    title: "EXCLUSIVE WEAR",
    subtitle: "Elevate your style with our exclusive collection featuring modern cuts and timeless elegance",
    cta: "Explore"
  }
];

/**
 * Hero Carousel Component
 * Displays a full-screen, interactive hero section with rotating background images,
 * dynamic text content, and navigation controls. Supports desktop, mobile,
 * and accessibility features like keyboard and touch navigation.
 */
function Hero() {
  // --- State Management ---
  const [currentImage, setCurrentImage] = useState(0); // Index of the currently displayed slide
  const [direction, setDirection] = useState(0); // Direction of slide change (1 for next, -1 for previous)
  const [isMobile, setIsMobile] = useState(false); // Flag to determine if the device is mobile
  const [isScrolling, setIsScrolling] = useState(false); // Flag to prevent rapid slide changes during animation
  const [touchStart, setTouchStart] = useState(null); // X-coordinate of touch start
  const [touchEnd, setTouchEnd] = useState(null); // X-coordinate of touch end

  // --- Refs for DOM Elements and Timers ---
  const heroRef = useRef(null); // Ref to the main hero div for attaching event listeners
  const wheelTimeoutRef = useRef(null); // Ref for wheel event debounce timer
  const autoSlideIntervalRef = useRef(null); // Ref for auto-slide interval timer

  // --- Constants ---
  const SWIPE_THRESHOLD = 50; // Minimum pixel distance for a successful swipe
  const ANIMATION_DURATION = 1000; // Duration of slide transition in milliseconds
  const AUTO_SLIDE_INTERVAL = 8000; // Interval for auto-sliding in milliseconds

  // --- Effects ---

  // Initialize `isMobile` state based on window width on component mount
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Update `isMobile` state on window resize
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Memoize `currentSlide` and `currentBanner` for performance
  const currentSlide = mockSlides[currentImage];
  const currentBanner = isMobile ? currentSlide.mobile : currentSlide.desktop;

  // --- Core Slide Navigation Logic ---

  /**
   * Changes the current slide to a new index.
   * Prevents changes if an animation is already in progress.
   * @param {number} newIndex - The index of the slide to navigate to.
   * @param {number} dir - The direction of navigation (1 for next, -1 for previous).
   */
  const changeSlide = useCallback((newIndex, dir) => {
    if (isScrolling) return; // Do not change slide if already animating

    setIsScrolling(true); // Indicate that a slide change is in progress
    setDirection(dir); // Set animation direction
    setCurrentImage(newIndex); // Update current slide index

    // Reset `isScrolling` after the animation duration
    setTimeout(() => {
      setIsScrolling(false);
    }, ANIMATION_DURATION);
  }, [isScrolling]); // Dependency: `isScrolling` to prevent re-creation unnecessarily

  /** Navigates to the next slide in the carousel. */
  const nextImage = useCallback(() => {
    const newIndex = currentImage === mockSlides.length - 1 ? 0 : currentImage + 1;
    changeSlide(newIndex, 1); // Direction 1 for next
  }, [currentImage, changeSlide]); // Dependencies: `currentImage` and `changeSlide`

  /** Navigates to the previous slide in the carousel. */
  const prevImage = useCallback(() => {
    const newIndex = currentImage === 0 ? mockSlides.length - 1 : currentImage - 1;
    changeSlide(newIndex, -1); // Direction -1 for previous
  }, [currentImage, changeSlide]); // Dependencies: `currentImage` and `changeSlide`

  // --- Event Handlers for User Interaction ---

  /**
   * Handles wheel scroll events to navigate between slides.
   * Implements a debounce to prevent excessive scrolling.
   * @param {WheelEvent} e - The wheel event object.
   */
  const handleWheel = useCallback((e) => {
    if (isScrolling) return; // Ignore wheel if an animation is active

    e.preventDefault(); // Prevent default page scrolling

    // Clear any existing debounce timeout
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    // Set a new debounce timeout
    wheelTimeoutRef.current = setTimeout(() => {
      if (e.deltaY > 0) { // Scrolling down
        nextImage();
      } else if (e.deltaY < 0) { // Scrolling up
        prevImage();
      }
    }, 100); // 100ms debounce
  }, [isScrolling, nextImage, prevImage]); // Dependencies: `isScrolling`, `nextImage`, `prevImage`

  /**
   * Records the starting X-coordinate for touch swipe gestures.
   * @param {TouchEvent} e - The touch start event object.
   */
  const handleTouchStart = useCallback((e) => {
    // Reset touchEnd to ensure a new swipe gesture starts clean
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  /**
   * Records the current X-coordinate during touch swipe gestures.
   * @param {TouchEvent} e - The touch move event object.
   */
  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  /**
   * Determines swipe direction and triggers slide change on touch release.
   * @param {TouchEvent} e - The touch end event object.
   */
  const handleTouchEnd = useCallback(() => {
    if (isScrolling || touchStart === null || touchEnd === null) return; // Ignore if animating or touch not fully recorded

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > SWIPE_THRESHOLD; // Swiped left (moved finger left)
    const isRightSwipe = distance < -SWIPE_THRESHOLD; // Swiped right (moved finger right)

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }

    // Reset touch coordinates for the next swipe
    setTouchStart(null);
    setTouchEnd(null);
  }, [isScrolling, touchStart, touchEnd, nextImage, prevImage]); // Dependencies: all states used in calculation

  /**
   * Handles keyboard arrow key presses for navigation.
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  const handleKeyDown = useCallback((e) => {
    if (isScrolling) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      prevImage();
    }
  }, [isScrolling, nextImage, prevImage]);

  // --- Event Listener Setup and Cleanup ---
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    // Attach passive: false for wheel to allow preventDefault
    heroElement.addEventListener('wheel', handleWheel, { passive: false });
    // Attach passive: true for touch events for better performance, hoping touch-action handles native scroll
    heroElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    heroElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    heroElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeyDown); // Listen for keyboard events on the document

    // Cleanup function: remove all event listeners and clear timeouts
    return () => {
      heroElement.removeEventListener('wheel', handleWheel);
      heroElement.removeEventListener('touchstart', handleTouchStart);
      heroElement.removeEventListener('touchmove', handleTouchMove);
      heroElement.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown]); // Dependencies: all memoized event handlers

  // --- Framer Motion Variants and Transitions ---

  /** Dynamically calculates the slide distance for Framer Motion animations based on screen width. */
  const getSlideDistance = () => {
    if (window.innerWidth >= 1024) return 1000; // Large screens
    if (window.innerWidth >= 768) return 500;   // Tablets
    if (window.innerWidth >= 640) return 300;   // Small tablets/large mobiles
    return 100;                                 // Default for mobile
  };

  // Variants for image slide animation
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? getSlideDistance() : -getSlideDistance(), // Enter from left or right
      opacity: 0,
    }),
    center: {
      zIndex: 1, // Ensure current slide is on top
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0, // Old slide goes below
      x: direction < 0 ? getSlideDistance() : -getSlideDistance(), // Exit to left or right
      opacity: 0,
    }),
  };

  // Variants for text content container (stagger effect)
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1, // Stagger children by 0.1 seconds
        delayChildren: 0.2, // Start children animations after 0.2 seconds
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05, // Stagger children on exit
        staggerDirection: -1, // Reverse order on exit
      },
    },
  };

  // Variants for individual text elements and CTA
  const itemVariants = {
    initial: {
      opacity: 0,
      y: 30, // Start slightly below
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -30, // Exit slightly above
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };


  // Common transition properties for Framer Motion
  const transitionProps = {
    type: "tween",
    duration: ANIMATION_DURATION / 1000, // Convert ms to seconds
    ease: "easeInOut",
  };

  // --- Auto-slide Functionality ---
  useEffect(() => {
    // Clear any existing interval to prevent multiple intervals running
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    // Set a new interval for auto-sliding
    autoSlideIntervalRef.current = setInterval(nextImage, AUTO_SLIDE_INTERVAL);

    // Cleanup function to clear interval on component unmount or dependency change
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [nextImage]); // Dependency: `nextImage` (memoized)


  // --- Rendered Component (JSX) ---
  return (
    // Outer container to hold both Hero and DotIndicators
    <div className="relative w-full px-4 py-6 md:px-6 md:py-8 mx-auto max-w-7xl">
      <div
        ref={heroRef} // Attach ref for event listeners
        className="relative w-full h-[60vh] overflow-hidden cursor-grab active:cursor-grabbing rounded-3xl shadow-xl"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Background Images with Framer Motion Animation */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transitionProps}
            className="absolute inset-0"
          >
            <img
              src={currentBanner}
              alt={`Slide ${currentImage + 1}: ${currentSlide.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Subtle Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay (Text and CTA Button) responsive alignment */}
        <div className="absolute inset-0 flex items-end justify-start md:justify-end z-20 pb-12 sm:pb-16 md:pb-20
                        px-4 sm:px-6 md:px-12 lg:px-20"> {/* Responsive padding */}
          <div className="text-left md:text-right text-white max-w-md md:max-w-2xl mr-auto md:ml-auto"> {/* Responsive alignment */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentImage + "-content"}
                custom={direction}
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4 sm:space-y-6"
              >
                <motion.h1
                  variants={itemVariants} // Text still animates
                  // Default (mobile) text-2xl, then scales up for sm, md, lg, xl
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wider"
                >
                  {currentSlide.title}
                </motion.h1>
                <motion.p
                  variants={itemVariants} // Text still animates
                  // Default (mobile) text-sm, then scales up
                  className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed opacity-90"
                >
                  {currentSlide.subtitle}
                </motion.p>
                {/* Button now uses motion.button and itemVariants */}
                <motion.button
                  variants={itemVariants} // Applied itemVariants
                  whileHover={{ scale: 1.05 }} // Re-added whileHover
                  whileTap={{ scale: 0.95 }}   // Re-added whileTap
                  className="mt-6 sm:mt-8 px-8 sm:px-10 md:px-12 py-3 sm:py-4
                            bg-white text-black font-semibold text-sm sm:text-base
                            rounded-full hover:bg-gray-100 transition-all duration-300
                            shadow-lg hover:shadow-xl hover:shadow-inner
                            relative overflow-hidden
                            "
                >
                  {currentSlide.cta}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dot Indicators placed outside the hero div, centered below it */}
      <DotIndicators
        currentSlideIndex={currentImage}
        totalSlides={mockSlides.length}
        changeSlide={changeSlide}
        isAnimating={isScrolling}
      />
    </div>
  );
}

export default Hero;