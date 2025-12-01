"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface SubCategoria {
  idSubcategoria: number;
  nome: string;
  slug: string;
}

interface CategoriasSliderProps {
  categorias?: SubCategoria[];
}

const ICONES_CATEGORIAS: { [key: string]: string } = {
  'casamento': '💍',
  'recepcao': '🎊',
  'cerimonia': '💒',
  'aniversario': '🎂',
  'infantil': '🎈',
  'adulto': '🥳',
  'corporativos': '💼',
  'orcamentos': '📋',
};

function getIconeCategoria(nome: string): string {
  const nomeNormalizado = nome.toLowerCase();

  for (const [key, icone] of Object.entries(ICONES_CATEGORIAS)) {
    if (nomeNormalizado.includes(key)) {
      return icone;
    }
  }

  return '🎉'; // ícone padrão
}

export default function CategoriasSlider({ categorias = [] }: CategoriasSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, [categorias.length]);

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

  if (categorias.length === 0) return null;

  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`flex items-center justify-center min-w-[60px] h-[60px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex-shrink-0 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
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

        {categorias.map((categoria) => (
          <Link
            key={categoria.idSubcategoria}
            href={`/categoria/${categoria.slug}`}
            className="flex flex-col items-center gap-2 min-w-[100px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
          >
            <div className="text-3xl">{getIconeCategoria(categoria.nome)}</div>
            <span className="text-sm font-medium text-gray-700 text-center">
              {categoria.nome}
            </span>
          </Link>
        ))}
      </div>

      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`flex items-center justify-center min-w-[60px] h-[60px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex-shrink-0 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
      >
        <ChevronRight size={24} className="text-gray-600" />
      </button>
    </div>
  );
}