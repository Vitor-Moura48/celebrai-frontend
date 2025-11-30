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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            name="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (erro) setErro(false);
            }}
            placeholder="Buscar 'Conjunto mesas e cadeiras'..."
            className={`w-full bg-white pl-10 pr-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 transition ${
              erro
                ? "ring-2 ring-red-500 focus:ring-red-500"
                : "focus:ring-pink-500"
            }`}
          />
        </div>
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-r-lg font-medium transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Mensagem de Erro */}
      {erro && (
        <div className="mt-3 bg-red-50 border-2 border-red-500 rounded-lg p-3 flex items-center gap-2 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-semibold text-sm">
            Por favor, digite algo para buscar!
          </p>
        </div>
      )}
    </div>
  );
}
