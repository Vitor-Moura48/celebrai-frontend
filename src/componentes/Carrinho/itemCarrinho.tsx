"use client";

import { Minus, Plus, Trash2, MapPin } from "lucide-react";

export default function ItemCarrinho({ item, onAumentar, onDiminuir, onRemover }: any) {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-1 shadow-lg">
      <div className="bg-white rounded-xl p-6">
        <div className="flex gap-6">
          <img
            src={item.imagem}
            alt={item.nome}
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {item.nome}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{item.vendedor.location}</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Vendedor:</span>{" "}
                {item.vendedor.nome}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onDiminuir}
                  className="w-10 h-10 rounded-lg border-2 border-purple-500 flex items-center justify-center hover:bg-purple-50 transition text-purple-600 font-bold"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl text-gray-800 w-12 text-center">
                  {item.quantidade}
                </span>
                <button
                  onClick={onAumentar}
                  className="w-10 h-10 rounded-lg border-2 border-purple-500 flex items-center justify-center hover:bg-purple-50 transition text-purple-600 font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">
                    R$ {item.preco.toFixed(2).replace(".", ",")} por conjunto
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {(item.preco * item.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                </div>
                <button
                  onClick={onRemover}
                  className="text-red-500 hover:bg-red-50 rounded-lg p-3 transition"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
