"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CarrinhoVazio() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Seu carrinho está vazio
          </h1>
          <p className="text-gray-600 mb-8">
            Adicione produtos ao seu carrinho para continuar comprando
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition shadow-lg"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
