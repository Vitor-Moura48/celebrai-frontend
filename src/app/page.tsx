import { Metadata } from "next";
import ProdutoCard from "@/componentes/Card_Produto/ProdutoCard";
import BannerCarousel from "@/componentes/Home/Banner";
import CategoriasSlider from "@/componentes/Home/Categorias";
import SuccessModal from "@/componentes/Models/SuccesModal";
import SearchBar from "@/componentes/Home/searchBar";

export const metadata: Metadata = {
  title: "Celebraí - Pagina Principal",
  description: "A busca pela festa ideal",
  icons: "/Vector.svg",
  openGraph: {
    title: "Celebraí - Pagina Principal",
    description: "A busca pela festa ideal",
    images: "/Vector.svg",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// SSR — dados carregam no servidor
export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5156';

async function getProdutos() {
  try {
    const res = await fetch(`${API_URL}/produto`, {
      cache: "no-store",
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error("Falha ao buscar produtos");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

async function getSubCategorias() {
  // Retorna categorias hardcoded baseadas no banco de dados
  return [
    { idSubcategoria: 1, nome: 'Casamento - Kits', slug: 'casamento-kits' },
    { idSubcategoria: 2, nome: 'Recepção - Kits', slug: 'recepcao-kits' },
    { idSubcategoria: 3, nome: 'Cerimônia - Kits', slug: 'cerimonia-kits' },
    { idSubcategoria: 4, nome: 'Aniversário - Kits', slug: 'aniversario-kits' },
    { idSubcategoria: 5, nome: 'Infantil - Kits', slug: 'infantil-kits' },
    { idSubcategoria: 6, nome: 'Adulto - Kits', slug: 'adulto-kits' },
    { idSubcategoria: 7, nome: 'Corporativos - Kits', slug: 'corporativos-kits' },
    { idSubcategoria: 8, nome: 'Casamento - Orçamentos', slug: 'casamento-orcamentos' },
    { idSubcategoria: 9, nome: 'Aniversário - Orçamentos', slug: 'aniversario-orcamentos' },
    { idSubcategoria: 10, nome: 'Corporativos - Orçamentos', slug: 'corporativos-orcamentos' },
  ];
}

export default async function Home() {
  const [produtos, categorias] = await Promise.all([
    getProdutos(),
    getSubCategorias(),
  ]);

  // Dividir produtos para as duas seções
  const produtosProntaEntrega = produtos.slice(0, 5);
  const melhoresAvaliados = produtos.slice(5, 10);

  return (
    <div className="min-h-screen bg-gray-50 pt-15 pb-10">
      <SuccessModal />
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
          <SearchBar />
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
                  key={produto.idProduto}
                  id={produto.idProduto}
                  title={produto.nome}
                  price={produto.precoUnitario}
                  image={produto.imagemUrl}
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
                  key={produto.idProduto}
                  id={produto.idProduto}
                  title={produto.nome}
                  price={produto.precoUnitario}
                  image={produto.imagemUrl}
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
  );
}
