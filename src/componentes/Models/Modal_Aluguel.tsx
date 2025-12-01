import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface ModalAluguelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dataInicio: string, dataFim: string) => void;
  produtoNome: string;
  produtoPreco: number;
}

export default function ModalAluguel({ 
  isOpen, 
  onClose, 
  onConfirm, 
  produtoNome,
  produtoPreco 
}: ModalAluguelProps) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState('');

  const calcularDias = () => {
    if (!dataInicio || !dataFim) return 0;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diff = fim.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1; // +1 para incluir o dia inicial
  };

  const handleConfirm = () => {
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

    onConfirm(dataInicio, dataFim);
    handleClose();
  };

  const handleClose = () => {
    setDataInicio('');
    setDataFim('');
    setErro('');
    onClose();
  };

  const dias = calcularDias();
  const valorTotal = dias > 0 ? produtoPreco * dias : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Agendar Aluguel</h2>
          <button
            onClick={handleClose}
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
                R$ {produtoPreco.toFixed(2).replace('.', ',')}
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
            onClick={handleClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
          >
            Confirmar Aluguel
          </button>
        </div>
      </div>
    </div>
  );
}