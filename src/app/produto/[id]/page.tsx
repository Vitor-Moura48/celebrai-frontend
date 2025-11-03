import ProdutoCarousel from "@/componentes/Produto/Produto_Carrossel";
import ProdutoAcoes from "@/componentes/Produto/Produto_Actions";

async function getProduto(id: string) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar produto");
  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const produto = await getProduto(params.id);

  return {
    title: `${produto.title} | Celebraí`,
    description: produto.description,
    openGraph: {
      title: produto.title,
      description: produto.description,
      images: [produto.image],
    },
  };
}

export default async function ProdutoPage({ params }: { params: { id: string } }) {
  const produto = await getProduto(params.id);

  const imagens = [produto.image, produto.image, produto.image, produto.image];
  const vendedor = { 
    nome: "Rogério dos Santos", 
    location: "Caís, PE", 
    avatar: "/image.png",
    memberSince: "76"
  };

  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-50">
          {/* Lado Esquerdo: Carrossel com Título e Tabs */}
          <ProdutoCarousel 
            images={imagens} 
            alt={produto.title}
            title={produto.title}
            rating={produto.rating?.rate || 5}
            tags={["Conjuntos", "Aparador"]}
            description={produto.description}
          />

          {/* Lado Direito: Preço e Ações */}
          <ProdutoAcoes 
            price={produto.price * 5} 
            vendedor={vendedor} 
          />
        </div>
      </section>
    </main>
  );
}