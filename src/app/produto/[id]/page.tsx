import ProdutoCarousel from "@/componentes/Produto/Produto_Carrossel";
import ProdutoAcoes from "@/componentes/Produto/Produto_Actions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5156';

async function getProduto(id: string) {
  try {
    const res = await fetch(`${API_URL}/produto/${id}`, {
      cache: "no-store",
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Produto não encontrado (${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const produto = await getProduto(id);

    return {
      title: `${produto.nome} | Celebraí`,
      description: produto.descricao,
      openGraph: {
        title: produto.nome,
        description: produto.descricao,
        images: [produto.imagemUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Produto | Celebraí',
      description: 'Detalhes do produto',
    };
  }
}

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const produto = await getProduto(id);

    // Usar a mesma imagem 4 vezes para o carrossel (ou adicionar mais imagens no backend depois)
    const imagens = [produto.imagemUrl, produto.imagemUrl, produto.imagemUrl, produto.imagemUrl];

    const vendedor = {
      nome: produto.nomeFornecedor || "Fornecedor Celebraí",
      location: "Recife, PE",
      avatar: "/image.png",
      memberSince: "2024"
    };

    // Tags baseadas na subcategoria
    const tags = [produto.subCategoria];

    return (
      <main className="min-h-screen bg-gray-100 py-20">
        <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-50">
            {/* Lado Esquerdo: Carrossel com Título e Tabs */}
            <ProdutoCarousel
              images={imagens}
              alt={produto.nome}
              title={produto.nome}
              rating={5}
              tags={tags}
              description={produto.descricao}
            />

            {/* Lado Direito: Preço e Ações */}
            <ProdutoAcoes
              price={produto.precoUnitario}
              vendedor={vendedor}
              produtoId={id}
              produtoNome={produto.nome}
              produtoImagem={produto.imagemUrl}
            />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gray-100 py-20">
        <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
          <a
            href="/"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            Voltar para a Home
          </a>
        </section>
      </main>
    );
  }
}