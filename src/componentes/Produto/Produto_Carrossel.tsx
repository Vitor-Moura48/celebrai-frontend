"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ProdutoCarouselProps {
  images: string[];
  alt: string;
  title: string;
  rating?: number;
  tags?: string[];
  description: string;
}

export default function ProdutoCarousel({ 
  images, 
  alt, 
  title, 
  rating = 5, 
  tags = [],
  description 
}: ProdutoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState("Descrição");

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Título e Rating */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
          </div>
          {tags.map((tag, index) => (
            <span key={index} className="text-gray-500">{tag}</span>
          ))}
        </div>
      </div>

      {/* Carrossel Principal */}
      <div className="relative w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image 
          src={images[current]} 
          alt={alt} 
          fill 
          className="object-contain rounded-lg" 
        />
        <button
          onClick={() => setCurrent((current - 1 + images.length) % images.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={() => setCurrent((current + 1) % images.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 justify-center">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
              i === current ? "border-pink-500" : "border-gray-200"
            }`}
          >
            <Image 
              src={img} 
              alt={`${alt} ${i + 1}`} 
              width={80} 
              height={80} 
              className="object-cover w-full h-full" 
            />
          </button>
        ))}
      </div>

      {/* Tabs de Descrição/Comentários */}
      <div className="border-t pt-4 mt-2">
        <div className="">
          {["Descrição", "Comentários"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 border-b-2 font-semibold transition ${
                activeTab === tab
                  ? "border-pink-500 text-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 text-gray-600 text-sm leading-relaxed">
          {activeTab === "Descrição" ? (
            <p>{description}</p>
          ) : (
            <p className="text-gray-400">Nenhum comentário ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}