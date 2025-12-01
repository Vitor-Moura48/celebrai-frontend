"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/authContext";
import { Package, Upload } from "lucide-react";
import api from "@/lib/api/axios";

const SUBCATEGORIAS = [
  { value: 1, label: "Casamento - Kits", categoria: "Casamento" },
  { value: 2, label: "Recepção - Kits", categoria: "Casamento" },
  { value: 3, label: "Cerimônia - Kits", categoria: "Casamento" },
  { value: 4, label: "Aniversário - Kits", categoria: "Aniversário" },
  { value: 5, label: "Infantil - Kits", categoria: "Aniversário" },
  { value: 6, label: "Adulto - Kits", categoria: "Aniversário" },
  { value: 7, label: "Corporativos - Kits", categoria: "Corporativo" },
  { value: 8, label: "Casamento - Orçamentos", categoria: "Casamento" },
  { value: 9, label: "Aniversário - Orçamentos", categoria: "Aniversário" },
  { value: 10, label: "Corporativos - Orçamentos", categoria: "Corporativo" },
];

export default function AdicionarProdutoPage() {
  const { usuario } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    subCategoria: '1',
    precoUnitario: '',
    quantidadeAluguelPorDia: '1',
  });

  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redireciona se não for fornecedor
  useEffect(() => {
    if (!usuario) {
      router.push('/Login');
    } else if (usuario.tipo !== 'fornecedor') {
      router.push('/');
    }
  }, [usuario, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validação básica
      if (!imagem) {
        setMessage({ type: 'error', text: 'Por favor, selecione uma imagem para o produto.' });
        setIsSubmitting(false);
        return;
      }

      // Cria FormData para enviar multipart/form-data
      const data = new FormData();
      data.append('Nome', formData.nome);
      data.append('Descricao', formData.descricao);
      data.append('SubCategoria', formData.subCategoria);
      data.append('PrecoUnitario', formData.precoUnitario);
      data.append('QuantidadeAluguelPorDia', formData.quantidadeAluguelPorDia);
      data.append('Imagem', imagem);

      const response = await api.post('/produto', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({ type: 'success', text: 'Produto cadastrado com sucesso!' });

      // Limpa o formulário
      setFormData({
        nome: '',
        descricao: '',
        subCategoria: '1',
        precoUnitario: '',
        quantidadeAluguelPorDia: '1',
      });
      setImagem(null);
      setPreviewUrl(null);

      // Redireciona para home após 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      const errorMessage = error.response?.data?.errors?.[0] || error.response?.data?.message || 'Erro ao cadastrar produto. Tente novamente.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-32 pb-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Package className="text-pink-600" size={32} />
          Adicionar Novo Produto
        </h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Produto */}
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Kit Festa Infantil Tema Princesa"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Descreva seu produto em detalhes..."
            />
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="subCategoria" className="block text-sm font-semibold text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              id="subCategoria"
              name="subCategoria"
              value={formData.subCategoria}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {SUBCATEGORIAS.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preço e Quantidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="precoUnitario" className="block text-sm font-semibold text-gray-700 mb-2">
                Preço Unitário (R$) *
              </label>
              <input
                type="number"
                id="precoUnitario"
                name="precoUnitario"
                value={formData.precoUnitario}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="quantidadeAluguelPorDia" className="block text-sm font-semibold text-gray-700 mb-2">
                Quantidade de Aluguel por Dia
              </label>
              <input
                type="number"
                id="quantidadeAluguelPorDia"
                name="quantidadeAluguelPorDia"
                value={formData.quantidadeAluguelPorDia}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagem do Produto *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagem(null);
                      setPreviewUrl(null);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remover imagem
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600 mb-2">Clique para selecionar uma imagem</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

