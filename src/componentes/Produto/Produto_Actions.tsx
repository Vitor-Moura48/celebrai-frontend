"use client"

import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, MapPin, CheckCircle, Calendar, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCarrinho } from '@/Context/carrinhoContext';

interface ProdutoAcoesProps {
  price: number;
  vendedor: { 
    nome: string; 
    location: string; 
    avatar: string; 
    memberSince?: string; 
    id?: string 
  };
  produtoId: string;
  produtoNome: string;
  produtoImagem: string;
}

export default function ProdutoAcoesAluguel({ 
  price, 
  vendedor,
  produtoId,
  produtoNome,
  produtoImagem
}: ProdutoAcoesProps) {
  const { adicionarAoCarrinho } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState('');

  const calcularDias = () => {
    if (!dataInicio || !dataFim) return 0;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diff = fim.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  };

  const handleConfirmarAluguel = () => {
    setErro('');
    
    if (!dataInicio || !dataFim) {
      setErro('Por favor, selecione ambas as datas');
      return;
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (inicio < hoje) {
      setErro('A data de recebimento não pode ser anterior a hoje');
      return;
    }

    if (fim <= inicio) {
      setErro('A data de devolução deve ser posterior à data de recebimento');
      return;
    }

    // Adicionar ao carrinho com informações de aluguel
    adicionarAoCarrinho({
      id: `${produtoId}-${dataInicio}-${dataFim}`,
      nome: `${produtoNome} (${calcularDias()} dias)`,
      preco: price * calcularDias(),
      imagem: produtoImagem,
      vendedor: {
        nome: vendedor.nome,
        location: vendedor.location,
      }
    });

    setAdicionado(true);
    setModalOpen(false);
    setTimeout(() => {
      setAdicionado(false);
      setDataInicio('');
      setDataFim('');
    }, 2000);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDataInicio('');
    setDataFim('');
    setErro('');
  };

  const dias = calcularDias();
  const valorTotal = dias > 0 ? price * dias : 0;

  return (
    <>
      <div className="flex flex-col gap-4 w-full md:w-[480px]">
        {/* Card de Preço e Botões */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div className="text-3xl font-bold text-gray-800">
            R$ {price.toFixed(2).replace(".", ",")}
            <span className="text-lg font-normal text-gray-600"> por dia</span>
          </div>

          {/* Botão Alugar */}
          <button 
            onClick={() => setModalOpen(true)}
            className={`w-full font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg ${
              adicionado
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
            } text-white`}
          >
            <Calendar className="w-5 h-5" />
            {adicionado ? 'Adicionado ao Carrinho!' : 'Alugar Produto'}
          </button>

          <button
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg"
          >
            <MapPin className="w-5 h-5" />
            Conferir Disponibilidade
          </button>

          <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-lg border-2 border-pink-500 flex items-center justify-center gap-2 transition">
            <MessageCircle className="w-5 h-5" />
            Chat com o vendedor
          </button>
        </div>

        {/* Card do Vendedor */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">
                {vendedor.nome.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{vendedor.nome}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p>Vendedor verificado</p>
              </div>
            </div>
          </div>

          <Link
            href="/Vendedor"
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
              para aluguel. Entre em contato para calcular o frete.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Aluguel */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Agendar Aluguel</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Produto Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {produtoNome}
                </h3>
                <p className="text-sm text-gray-600">
                  Valor diário: <span className="font-bold text-purple-600">
                    R$ {price.toFixed(2).replace('.', ',')}
                  </span>
                </p>
              </div>

              {/* Data de Recebimento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data de Recebimento
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Data de Devolução */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data de Devolução
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  min={dataInicio || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Cálculo */}
              {dias > 0 && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-90">Período:</span>
                    <span className="font-bold">{dias} {dias === 1 ? 'dia' : 'dias'}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Valor Total:</span>
                    <span className="font-bold">
                      R$ {valorTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              )}

              {/* Erro */}
              {erro && (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{erro}</p>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Entre em contato com o vendedor para confirmar disponibilidade e 
                    combinar detalhes da entrega e devolução.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarAluguel}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
              >
                Confirmar Aluguel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}