import { Metadata } from "next";
import Link from "next/link";
import ProdutoCard from "@/componentes/Card_Produto/ProdutoCard";
import Breadcrumb from "@/componentes/Categorias/Navegacao";
import CategoriaHeader from "@/componentes/Categorias/cabecalho";
import Paginacao from "@/componentes/Categorias/Paginacao";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5156';

const CATEGORIAS_MAP: { [key: string]: string } = {
  'casamento-kits': 'Casamento',
  'recepcao-kits': 'Recepção',
  'cerimonia-kits': 'Cerimônia',
  'aniversario-kits': 'Aniversário',
  'infantil-kits': 'Infantil',
  'adulto-kits': 'Adulto',
  'corporativos-kits': 'Corporativos',
  'casamento-orcamentos': 'Casamento',
  'aniversario-orcamentos': 'Aniversário',
  'corporativos-orcamentos': 'Corporativos',
};

const CATEGORIAS_NOMES: { [key: string]: string } = {
  'casamento-kits': 'Casamento - Kits',
  'recepcao-kits': 'Recepção - Kits',
  'cerimonia-kits': 'Cerimônia - Kits',
  'aniversario-kits': 'Aniversário - Kits',
  'infantil-kits': 'Infantil - Kits',
  'adulto-kits': 'Adulto - Kits',
  'corporativos-kits': 'Corporativos - Kits',
  'casamento-orcamentos': 'Casamento - Orçamentos',
  'aniversario-orcamentos': 'Aniversário - Orçamentos',
  'corporativos-orcamentos': 'Corporativos - Orçamentos',
};

async function getProdutos(slug: string) {
  try {
    const nomeCategoria = CATEGORIAS_MAP[slug];

    // Busca todos os produtos
    const res = await fetch(`${API_URL}/produto`, {
      cache: "no-store",
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    const data = await res.json();
    const todosProdutos = Array.isArray(data) ? data : [];

    if (!nomeCategoria) {
      return todosProdutos;
    }

    // Filtra pela subcategoria usando o nome
    return todosProdutos.filter((p: any) => p.subCategoria === nomeCategoria);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
} export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoriaNome = CATEGORIAS_NOMES[slug] || slug;

  return {
    title: `${categoriaNome} | Celebraí`,
    description: `Encontre os melhores produtos de ${categoriaNome} para sua festa`,
    openGraph: {
      title: `${categoriaNome} | Celebraí`,
      description: `Confira os melhores produtos da categoria ${categoriaNome}.`,
    },
  };
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const categoriaNome = CATEGORIAS_NOMES[slug] || slug;
  const currentPage = Number(pageParam) || 1;
  const itemsPerPage = 15;

  const todosProdutos = await getProdutos(slug);
  const totalItems = todosProdutos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const produtosPaginados = todosProdutos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navegação */}
        <Breadcrumb categoria={categoriaNome} />

        {/* Cabeçalho */}
        <CategoriaHeader categoria={categoriaNome} totalItems={totalItems} />

        {/* Lista de Produtos */}
        {produtosPaginados.length > 0 ? (
          <>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-10
              animate-fade-in"
            >
              {produtosPaginados.map((produto: any) => (
                <div
                  key={produto.idProduto}
                  className="transition-transform transform hover:-translate-y-1"
                >
                  <ProdutoCard
                    id={produto.idProduto}
                    title={produto.nome}
                    price={produto.precoUnitario}
                    image={produto.imagemUrl}
                    location="Recife, PE"
                  />
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <Paginacao
                  slug={slug}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              Nenhum produto encontrado nesta categoria.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-purple-600 text-white font-medium rounded-xl shadow hover:bg-purple-700 transition-all"
            >
              Voltar para a Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
