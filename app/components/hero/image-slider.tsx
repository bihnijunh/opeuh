"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const slides = [
  {
    id: 1,
    image: "/aa-basketball.jpg",
    hasOverlay: false,
  },
  {
    id: 2,
    image: "/aadvantage-hero.jpg",
    hasOverlay: false,
  }
];

interface ImageSliderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ activeTab, setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundColor: '#f9fafb'
            }}
          />
          {slide.hasOverlay && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-50" />
          )}
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition-all shadow-lg z-20 backdrop-blur-sm"
      >
        <ChevronLeftIcon className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition-all shadow-lg z-20 backdrop-blur-sm"
      >
        <ChevronRightIcon className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Tabs Section */}
      <div className="absolute bottom-4 sm:bottom-[15%] left-0 right-0 w-full z-30">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-center gap-2 sm:gap-4 bg-white/90 backdrop-blur-sm rounded-full p-1 sm:p-2 shadow-lg mx-auto w-fit">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium transition-all rounded-full ${
                activeTab === "book"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Book
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium transition-all rounded-full ${
                activeTab === "manage"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Manage trips
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium transition-all rounded-full ${
                activeTab === "status"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Flight status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;