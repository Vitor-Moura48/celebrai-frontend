"use client";

import { useState } from "react";
import { useCarrinho } from "@/Context/carrinhoContext";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import ItemCarrinho from "@/componentes/Carrinho/itemCarrinho";
import CarrinhoResumo from "@/componentes/Carrinho/carrinhoResumo";
import RecomendacoesProdutos from "@/componentes/Carrinho/recomendacoesProdutos";
import CarrinhoVazio from "@/componentes/Carrinho/carrinhoVazio";

export default function PaginaCarrinho() {
  const {
    itens,
    aumentarQuantidade,
    diminuirQuantidade,
    removerDoCarrinho,
    limparCarrinho,
    total,
  } = useCarrinho();

  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);

  const aplicarCupom = () => {
    if (cupom.toLowerCase() === "desconto10") {
      setCupomAplicado(true);
    }
  };

  if (itens.length === 0) return <CarrinhoVazio />;

  const subtotal = total;
  const desconto = cupomAplicado ? subtotal * 0.1 : 0;
  const totalFinal = subtotal - desconto;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Confirmação de compra
          </h1>
          <p className="text-gray-600">
            Revise seus itens antes de finalizar o pedido
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {itens.map((item) => (
              <ItemCarrinho
                key={item.id}
                item={item}
                onAumentar={() => aumentarQuantidade(item.id)}
                onDiminuir={() => diminuirQuantidade(item.id)}
                onRemover={() => removerDoCarrinho(item.id)}
              />
            ))}

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={limparCarrinho}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                <Trash2 className="w-5 h-5" />
                Remover todos os itens
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-pink-500 text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition"
              >
                Continuar Comprando
              </Link>
            </div>

            <RecomendacoesProdutos />
          </div>

          {/* Resumo */}
          <CarrinhoResumo
            subtotal={subtotal}
            desconto={desconto}
            totalFinal={totalFinal}
            cupom={cupom}
            setCupom={setCupom}
            cupomAplicado={cupomAplicado}
            aplicarCupom={aplicarCupom}
            itens={itens}
          />
        </div>
      </div>
    </div>
  );
}
