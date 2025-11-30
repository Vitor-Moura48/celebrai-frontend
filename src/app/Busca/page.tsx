"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, MapPin, SlidersHorizontal } from 'lucide-react';
import ProdutoCard from '@/componentes/Card_Produto/ProdutoCard';
import Link from 'next/link';

interface Produto {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
}

function BuscaContent() {
  const searchParams = useSearchParams();
  const queryInicial = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryInicial);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todas');
  const [ordenacao, setOrdenacao] = useState<string>('relevancia');
  const [faixaPreco, setFaixaPreco] = useState<[number, number]>([0, 1000]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Buscar produtos
  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true);
        const [produtosRes, categoriasRes] = await Promise.all([
          fetch('https://fakestoreapi.com/products'),
          fetch('https://fakestoreapi.com/products/categories')
        ]);

        const produtosData = await produtosRes.json();
        const categoriasData = await categoriasRes.json();

        setProdutos(produtosData);
        setCategorias(['todas', ...categoriasData]);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  // Filtrar e ordenar produtos
  useEffect(() => {
    let resultado = [...produtos];

    // Filtro por busca
    if (query) {
      resultado = resultado.filter(produto =>
        produto.title.toLowerCase().includes(query.toLowerCase()) ||
        produto.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtro por categoria
    if (categoriaSelecionada !== 'todas') {
      resultado = resultado.filter(p => p.category === categoriaSelecionada);
    }

    // Filtro por preço
    resultado = resultado.filter(p => {
      const preco = p.price * 5; // Multiplicador para simular preços reais
      return preco >= faixaPreco[0] && preco <= faixaPreco[1];
    });

    // Ordenação
    switch (ordenacao) {
      case 'menor-preco':
        resultado.sort((a, b) => a.price - b.price);
        break;
      case 'maior-preco':
        resultado.sort((a, b) => b.price - a.price);
        break;
      case 'mais-vendidos':
        resultado.sort((a, b) => b.rating.count - a.rating.count);
        break;
      case 'melhor-avaliacao':
        resultado.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // relevância (padrão)
        break;
    }

    setProdutosFiltrados(resultado);
  }, [produtos, query, categoriaSelecionada, ordenacao, faixaPreco]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      alert('Por favor, digite algo para buscar!');
      return;
    }
  };

  const limparFiltros = () => {
    setCategoriaSelecionada('todas');
    setOrdenacao('relevancia');
    setFaixaPreco([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-18 pb-10">
      {/* Header de Busca */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Buscar Produtos
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb e Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">
              <Link href="/" className="text-pink-600">Início</Link> / Busca
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {query ? `Resultados para "${query}"` : 'Todos os produtos'}
              <span className="text-gray-600 font-normal ml-2">
                ({produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto' : 'produtos'})
              </span>
            </h2>
          </div>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filtros
          </button>
        </div>

        {/* Painel de Filtros */}
        {mostrarFiltros && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filtrar Resultados</h3>
              <button
                onClick={limparFiltros}
                className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
              >
                Limpar filtros
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'todas' ? 'Todas as categorias' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                >
                  <option value="relevancia">Mais relevantes</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                  <option value="mais-vendidos">Mais vendidos</option>
                  <option value="melhor-avaliacao">Melhor avaliação</option>
                </select>
              </div>

              {/* Faixa de Preço */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Faixa de preço: R$ {faixaPreco[0]} - R$ {faixaPreco[1]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={faixaPreco[1]}
                    onChange={(e) => setFaixaPreco([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : produtosFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {produtosFiltrados.map((produto) => (
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
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={limparFiltros}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaginaBusca() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-18 pb-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <BuscaContent />
    </Suspense>
  );
}