import { Metadata } from "next";
import { Search, CheckCircle, X } from "lucide-react";
import ProdutoCard from "@/componentes/Card_Produto/ProdutoCard";
import BannerCarousel from "@/componentes/Home/Banner"
import CategoriasSlider from "@/componentes/Home/Categorias";
import SuccessModal from "@/componentes/Home/SuccessModal";

export const metadata: Metadata = {
  title: "Celebraí - Pagina Principal",
  description: "A busca pela festa ideal",
  icons: "/Vector.svg",
  openGraph: {
    title: "Celebraí - Pagina Principal",
    description: "A busca pela festa ideal",
    images: "/Vector.svg"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
};

// SSR — dados carregam no servidor
export const dynamic = "force-dynamic";

async function getProdutos() {
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=10", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Falha ao buscar produtos");
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

async function getCategorias() {
  try {
    const res = await fetch("https://fakestoreapi.com/products/categories", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Falha ao buscar categorias");
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

export default async function Home() {
  const [produtos, categorias] = await Promise.all([
    getProdutos(),
    getCategorias()
  ]);

  // Dividir produtos para as duas seções
  const produtosProntaEntrega = produtos.slice(0, 5);
  const melhoresAvaliados = produtos.slice(5, 10);

  return (
    <>
      <SuccessModal />
      <div className="min-h-screen bg-gray-50 pt-15 pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Comece a busca da sua
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            festa perfeita no <strong>Celebraí</strong>
          </h2>
          
          {/* Search Bar */}
          <form className="flex max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="search"
                placeholder="Buscar 'Conjunto mesas e cadeiras'..."
                 className="w-full bg-white pl-10 pr-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>
            <button 
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-r-lg font-medium transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categorias */}
        {categorias && categorias.length > 0 && (
          <CategoriasSlider categorias={categorias} />
        )}

        {/* Produtos para pronta entrega */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Produtos para pronta entrega
          </h3>
          {produtosProntaEntrega.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {produtosProntaEntrega.map((produto: any) => (
                <ProdutoCard 
                  key={produto.id} 
                  id={produto.id}
                  title={produto.title}
                  price={produto.price}
                  image={produto.image}
                  location="Recife, PE"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum produto disponível no momento.
            </p>
          )}
        </section>

        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Melhores Avaliados */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Melhores Avaliados
          </h3>
          {melhoresAvaliados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {melhoresAvaliados.map((produto: any) => (
                <ProdutoCard 
                  key={produto.id}
                  id={produto.id}
                  title={produto.title}
                  price={produto.price}
                  image={produto.image}
                  location="Recife, PE"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum produto disponível no momento.
            </p>
          )}
        </section>
      </div>
      </div>
    </>
  );
}