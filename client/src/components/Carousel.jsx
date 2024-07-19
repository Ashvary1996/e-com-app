import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Carousel = ({ dImgCurosol, userID }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === dImgCurosol.length - 1 ? 0 : prevIndex + 1
    );
  }, [dImgCurosol.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? dImgCurosol.length - 1 : prevIndex - 1
    );
  }, [dImgCurosol.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full border-2" data-carousel="slide">
      <div className="relative h-32 overflow-hidden rounded-lg md:h-96">
        {dImgCurosol.map((item, index) => (
          <div
            key={index}
            className={`absolute w-full transition-transform duration-700 ease-in-out ${
              currentIndex === index ? "block" : "hidden"
            }`}
            data-carousel-item
          >
            <Link to={`/item/${item.itemId}`} state={{ userID: userID }}>
              <img
                src={item.thumbnail}
                className="mx-auto w-[fit] h-fit"
                alt={`Slide ${index + 1}`}
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {dImgCurosol.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-400"
            }`}
            aria-current={currentIndex === index ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <FaChevronLeft className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" />
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <FaChevronRight className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" />
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
