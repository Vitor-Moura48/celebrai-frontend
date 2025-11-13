"use client";

import { ShoppingCart } from "lucide-react";
import { useCarrinho } from "@/Context/carrinhoContext";
import Link from "next/link";

export function CarrinhoIcone() {
  const { quantidadeTotal } = useCarrinho();

  // se o carrinho estiver vazio, não mostra o ícone
  if (quantidadeTotal === 0) return null;

  return (
    <Link
      href="/Carrinho"
      className="relative text-white hover:text-gray-300 transition"
      aria-label="Ir para o carrinho"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {quantidadeTotal}
      </span>
    </Link>
  );
}
