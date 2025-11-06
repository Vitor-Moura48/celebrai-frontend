"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { CATEGORIAS_FESTAS, API_CATEGORY_ICONS, type Categoria } from "@/lib/categorias";

interface CategoriasSliderProps {
  categorias?: string[];
}

export default function CategoriasSlider({ categorias = [] }: CategoriasSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const categoriasAPI: Categoria[] = categorias.map(cat => ({
    nome: cat,
    icone: API_CATEGORY_ICONS[cat] || "🛍️"
  }));

  const todasCategorias = [...categoriasAPI, ...CATEGORIAS_FESTAS];

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [todasCategorias.length]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (todasCategorias.length === 0) return null;

  return (
    <div className="flex items-center gap-4 mb-8">
      <button 
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`flex items-center justify-center min-w-[60px] h-[60px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex-shrink-0 ${
          !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        <ChevronLeft size={24} className="text-gray-600" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        {todasCategorias.map((categoria, idx) => (
          <button
            key={`${categoria.nome}-${idx}`}
            className="flex flex-col items-center gap-2 min-w-[100px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
          >
            <div className="text-3xl">{categoria.icone}</div>
            <span className="text-sm font-medium text-gray-700 capitalize text-center">
              {categoria.nome}
            </span>
          </button>
        ))}
      </div>

      <button 
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`flex items-center justify-center min-w-[60px] h-[60px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex-shrink-0 ${
          !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        <ChevronRight size={24} className="text-gray-600" />
      </button>
    </div>
  );
}