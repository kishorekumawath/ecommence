import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react"; // or wherever your icon comes from

export default function SparkleButton() {
  const [animate, setAnimate] = useState(true);

  // Trigger animation once when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 800); // matches animation duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
      <div className="bg-white/20 backdrop-blur-md rounded-full p-2 sm:p-3 border border-white/30 group">
        <Sparkles
          className={`
            w-4 h-4 sm:w-5 sm:h-5 text-white
            ${animate ? "animate-sparkle" : ""}
            group-hover:animate-sparkle
          `}
        />
      </div>
    </div>
  );
}