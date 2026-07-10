"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [erro, setErro] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setErro(true);
      setTimeout(() => setErro(false), 3000);
      return;
    }

    // Redirecionar para página de busca com query
    router.push(`/Busca?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative w-full max-w-md mx-4 lg:max-w-xl hidden md:flex items-center">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (erro) setErro(false);
            }}
            placeholder="Buscar 'Lembrancinhas'..."
            className={`w-full bg-white pl-9 pr-4 py-2 text-sm rounded-l-md text-gray-800 focus:outline-none focus:ring-2 transition ${
              erro
                ? "ring-2 ring-red-500 focus:ring-red-500"
                : "focus:ring-pink-500"
            }`}
          />
        </div>
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 text-sm rounded-r-md font-medium transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Mensagem de Erro */}
      {erro && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-red-50 border-2 border-red-500 rounded-md p-2 flex items-center gap-2 animate-shake shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-semibold text-xs">
            Por favor, digite algo para buscar!
          </p>
        </div>
      )}
    </div>
  );
}
