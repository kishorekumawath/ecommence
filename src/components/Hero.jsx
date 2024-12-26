import React, { useEffect, useState } from 'react'
import { assets, heroImages,heroSlideContent } from '../assets/assets'
import { motion, AnimatePresence, animate, easeIn } from 'framer-motion'


function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setDirection(1);
    setCurrentImage((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const prevImage = () => {
    setDirection(-1);
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const slideVariants = {
    enter: (direction) => {
      const slideDistance = window.innerWidth >= 1024 
        ? 1000 
        : window.innerWidth >= 768 
        ? 500 
        : window.innerWidth >= 640 
        ? 300 
        : 100;
  
      return {
        x: direction > 0 ? slideDistance : -slideDistance,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      const slideDistance = window.innerWidth >= 1024 
        ? 1000 
        : window.innerWidth >= 768 
        ? 500 
        : window.innerWidth >= 640 
        ? 300 
        : 100;
  
      return {
        zIndex: 0,
        x: direction < 0 ? slideDistance : -slideDistance,
        opacity: 0
      };
    }
  };

  const textVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      scale: 0.95,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      scale: 0.95,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };
  const transitionProps = {
    type: "tween",
    duration: 1,
    stiffness: 300,
    damping: 20
  };

  // Auto-advance slides
  useEffect(() => {
    const slideInterval = setInterval(nextImage, 5000);
    return () => clearInterval(slideInterval);
  }, [currentImage]);

  return (
    <div  className='relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden z-0'>
      {/* Slider Image */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentImage}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionProps}
          src={heroImages[currentImage]} 
          alt={`Slide ${currentImage + 1}`} 
          className='absolute w-full h-full object-cover z-0'
        />
      </AnimatePresence>

      {/* Dark Overlay to improve text and button visibility */}
      <div className='absolute inset-0 bg-black/20 z-10'></div>

      {/* Overlay Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentImage}
          custom={direction}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className='absolute inset-0 z-20 flex items-end justify-end p-4 sm:p-6 md:p-10'
        >
          <div className='text-right text-white space-y-2 sm:space-y-3 md:space-y-4'>
            <motion.p 
              className='text-base sm:text-xl md:text-2xl lg:text-3xl font-medium'
            >
              {heroSlideContent[currentImage].subtitle}
            </motion.p>
            <motion.p 
              className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'
            >
              {heroSlideContent[currentImage].title}
            </motion.p>
            <motion.button 
              className='rounded-full 
                bg-black 
                px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 
                text-sm sm:text-base md:text-lg 
                text-white 
                hover:bg-gray-800 
                transition'
            >
              {heroSlideContent[currentImage].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>


      {/* Navigation Buttons - Ensure they are above the image */}
      <button 
        onClick={prevImage} 
        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20
          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
          rounded-full 
          bg-white/30 backdrop-blur-md 
          flex items-center justify-center 
          hover:bg-white/50 
          transition"
      >
        <img 
          src={assets.arrow_left} 
          alt="Previous" 
          className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'
        />
      </button>
      
      <button 
        onClick={nextImage} 
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20
          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
          rounded-full 
          bg-white/30 backdrop-blur-md 
          flex items-center justify-center 
          hover:bg-white/50 
          transition"
      >
        <img 
          src={assets.arrow_right} 
          alt="Next" 
          className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'
        />
      </button>
    </div>
  )
}

export default Hero