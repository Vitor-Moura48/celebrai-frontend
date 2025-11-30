"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Descartáveis a partir de",
      price: "R$60",
      buttonText: "Ver Descartáveis",
      bgColor: "bg-[#2a0047]",
      image: "/Descartaveis.jpg", // imagem em /public/descartaveis.jpg
    },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg mb-8">
      <div className={`${slides[currentSlide].bgColor} text-white`}>
        <div className="flex items-center min-h-[300px] md:min-h-[350px]">
          {/* Lado esquerdo - Texto */}
          <div className="flex-1 p-8 md:p-16 z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-5xl md:text-6xl font-bold text-[#ff007f] mb-8">
              {slides[currentSlide].price}
            </p>
            <button className="bg-[#ff007f] hover:bg-[#e6006f] text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 cursor-pointer">
              {slides[currentSlide].buttonText}
            </button>
          </div>

          {/* Lado direito - Imagem */}
          <div className="w-1/2 hidden md:block relative min-h-[350px]">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover object-center opacity-90"
              priority
            />
          </div>
        </div>
      </div>

      {/* Setas de navegação */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={28} className="text-gray-800" />
          </button>

          <button
            onClick={() =>
              setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))
            }
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={28} className="text-gray-800" />
          </button>

          {/* Indicadores de slide */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
