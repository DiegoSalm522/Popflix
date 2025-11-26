import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleScrollTop}
          className="bg-red-600 hover:scale-105 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 focus:outline-none cursor-pointer"
        >
          <IoIosArrowUp size={22} />
        </button>
      </div>
    )
  );
};

export default ScrollToTop;
