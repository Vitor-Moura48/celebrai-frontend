"use client";

import { MapPin, Package } from "lucide-react";

export default function RecomendacoesProdutos() {
  const produtos = [
    { id: 1, nome: "Conjunto Cadeiras e Mesa", preco: 150 },
    { id: 2, nome: "Conjunto Mesa Premium", preco: 180 },
    { id: 3, nome: "Conjunto Jardim Completo", preco: 200 },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Recomendações para você
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                {produto.nome}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-pink-600">
                  R$ {produto.preco.toFixed(2).replace(".", ",")}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>Recife, PE</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
