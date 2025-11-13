"use client"

import { ShoppingCart, MessageCircle, MapPin, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HorariosPopup from "../HorariosPopup/index";
import ChatVendedor from "../Vendedor/Chat";
import { useCarrinho } from "@/Context/carrinhoContext";
import { useState } from "react";

interface ProdutoAcoesProps {
  price: number;
  vendedor: { 
    nome: string; 
    location: string; 
    avatar: string; 
    memberSince?: string; 
    id?: string 
  };
  // Novos props necessários para o carrinho
  produtoId: string;
  produtoNome: string;
  produtoImagem: string;
}

export default function ProdutoAcoes({ 
  price, 
  vendedor,
  produtoId,
  produtoNome,
  produtoImagem
}: ProdutoAcoesProps) {
  const { adicionarAoCarrinho } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  const handleAdicionarAoCarrinho = () => {
    adicionarAoCarrinho({
      id: produtoId,
      nome: produtoNome,
      preco: price,
      imagem: produtoImagem,
      vendedor: {
        nome: vendedor.nome,
        location: vendedor.location,
      }
    });

    // Feedback visual
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full md:w-[480px]">
      {/* Card de Preço e Botões */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <div className="text-3xl font-bold text-gray-800">
          R$ {price.toFixed(2).replace(".", ",")}
          <span className="text-lg font-normal text-gray-600"> por conjunto</span>
        </div>

        {/* Botão Solicitar Compra - Atualizado */}
        <button 
          onClick={handleAdicionarAoCarrinho}
          className={`w-full font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg ${
            adicionado
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
          } text-white`}
        >
          <ShoppingCart className="w-5 h-5" />
          {adicionado ? 'Adicionado ao Carrinho!' : 'Solicitar Compra'}
        </button>

        {/* HorariosPopup com estilo roxo */}
        <div className="[&>button]:w-full [&>button]:bg-gradient-to-r [&>button]:from-purple-500 [&>button]:to-purple-600 [&>button]:hover:from-purple-600 [&>button]:hover:to-purple-700 [&>button]:text-white [&>button]:font-semibold [&>button]:py-4 [&>button]:px-6 [&>button]:rounded-lg [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:gap-2 [&>button]:transition [&>button]:shadow-lg [&>button]:border-0">
          <HorariosPopup />
        </div>

        {/* ChatVendedor com estilo branco/borda - apenas o botão principal */}
        <div className="[&>button]:w-full [&>button]:bg-white [&>button]:hover:bg-gray-50 [&>button]:text-gray-800 [&>button]:font-semibold [&>button]:py-4 [&>button]:px-6 [&>button]:rounded-lg [&>button]:border-2 [&>button]:border-pink-500 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:gap-2 [&>button]:transition">
          <ChatVendedor />
        </div>
      </div>

      {/* Card do Vendedor */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            {vendedor.avatar ? (
              <Image
                src={vendedor.avatar}
                alt={vendedor.nome}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold">
                {vendedor.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">{vendedor.nome}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p>Vendedor verificado</p>
            </div>
          </div>
        </div>

        {/* Link para a página do vendedor */}
        <Link
          href={`/Vendedor`}
          className="block text-center w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition"
        >
          Acessar perfil do vendedor
        </Link>
      </div>

      {/* Info de Localização */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Localização:</span> {vendedor.location}. Produto disponível
            para entrega. Entre em contato para calcular o frete.
          </p>
        </div>
      </div>
    </div>
  );
}