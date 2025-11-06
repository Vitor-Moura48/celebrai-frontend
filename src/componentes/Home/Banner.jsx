"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Descartáveis a partir de",
      price: "R$60",
      buttonText: "Ver Descartáveis",
      bgColor: "bg-purple-800"
    }
  ];

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm mb-8">
      <div className={`${slides[currentSlide].bgColor} text-white p-8 md:p-12 flex items-center`}>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-4xl md:text-5xl font-bold mb-6">
            {slides[currentSlide].price}
          </p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
            {slides[currentSlide].buttonText}
          </button>
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="w-full h-64 bg-purple-700/30 rounded-lg flex items-center justify-center">
            <span className="text-6xl">🎉</span>
          </div>
        </div>
      </div>
      
      {slides.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          
          <button 
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}