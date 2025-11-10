import Image from "next/image";
import { MapPin, CheckCircle, MessageCircle } from "lucide-react";
import ProdutoCard from "@/componentes/Card_Produto/ProdutoCard";
import ChatVendedor from "@/componentes/Vendedor/Chat";
import HorariosPopup from "@/componentes/HorariosPopup/index";

{/*IMPLEMENTAR METADATA DINAMICA DO VENDEDOR POR ID*/}

// SSR — dados carregam no servidor
export const dynamic = "force-dynamic";

async function getProdutos() {
  const res = await fetch("https://fakestoreapi.com/products?limit=5", {
    cache: "no-store", // sempre busca do servidor
  });
  if (!res.ok) throw new Error("Falha ao buscar produtos");
  return res.json();
}

export default async function Vendedor() {
  const produtos = await getProdutos();

  return (
    <main className="min-h-screen bg-gray-100 pt-5 pb-10">
      {/* 🔹 Card do vendedor */}
      <section className="bg-white shadow-md rounded-xl mx-auto mt-15 p-6 w-[90%] md:w-[80%] flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-6">
          <Image
            src="/image.png"
            alt="Foto do vendedor"
            width={250}
            height={250}
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rogério dos Santos
            </h1>
            <p className="flex items-center text-gray-700 text-sm">
              <MapPin size={17} className="mr-1 text-pink-600" />
              Caís, Rio Formoso - PE
            </p>
            <p className="flex items-center text-gray-700 text-sm">
              <CheckCircle size={17} className="mr-1 text-green-600" />
              Vendedor verificado
            </p>

            <div className="mt-2">
              <p className="font-semibold text-gray-800">Categorias</p>
              <div className="flex gap-3 mt-1 flex-wrap">
                {["Infantil", "Heróis", "Desenhos"].map((categoria) => (
                  <span
                    key={categoria}
                    className="bg-pink-600 text-white text-sm px-3 py-1 rounded-md"
                  >
                    {categoria}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Botões */}
        <div className="flex flex-col gap-3 mt-6 md:mt-0">
          <ChatVendedor />
          <HorariosPopup />
        </div>
      </section>

      {/* 🔹 Produtos */}
      <section className="mt-10 w-[90%] md:w-[80%] mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Produtos para pronta entrega
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {produtos.map((produto: any) => (
            <ProdutoCard
              key={produto.id}
              id={produto.id}
              title={produto.title}
              price={produto.price}
              image={produto.image}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

