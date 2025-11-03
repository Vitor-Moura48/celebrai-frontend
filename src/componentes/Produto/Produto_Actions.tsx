import { ShoppingCart, MessageCircle, MapPin, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProdutoAcoesProps {
  price: number;
  vendedor: { nome: string; location: string; avatar: string; memberSince?: string; id?: string };
}

export default function ProdutoAcoes({ price, vendedor }: ProdutoAcoesProps) {
  return (
    <div className="flex flex-col gap-4 w-full md:w-[480px]">
      {/* Card de Preço e Botões */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <div className="text-3xl font-bold text-gray-800">
          R$ {price.toFixed(2).replace(".", ",")}
          <span className="text-lg font-normal text-gray-600"> por conjunto</span>
        </div>

        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg">
          <ShoppingCart className="w-5 h-5" />
          Solicitar Compra
        </button>

        <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg">
          <Clock className="w-5 h-5" />
          Conferir Disponibilidade
        </button>

        <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 flex items-center justify-center gap-2 transition">
          <MessageCircle className="w-5 h-5 text-pink-500" />
          Chat com o vendedor
        </button>
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

        {/* 🔗 Link para a página do vendedor */}
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
