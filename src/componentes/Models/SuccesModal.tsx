"use client"

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, X, Package } from "lucide-react";
import { useCarrinho } from "@/Context/carrinhoContext";

export default function SuccessModal() {
  const searchParams = useSearchParams();
  const { limparCarrinho } = useCarrinho();
  const [showModal, setShowModal] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const aluguelRealizado = searchParams.get("aluguelRealizado");
    
    if (aluguelRealizado === "true" && !processed) {
      setShowModal(true);
      setProcessed(true);
      
      // Limpar o carrinho
      limparCarrinho();
      
      // Remove a query parameter da URL
      window.history.replaceState({}, "", "/");
      
      // Esconde a mensagem após 5 segundos
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, limparCarrinho, processed]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Aluguel realizado com sucesso!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Seu pedido de aluguel foi confirmado com sucesso. Em breve você receberá um e-mail 
          com os detalhes e instruções para retirada/entrega.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-purple-800 mb-1">
                Próximos passos:
              </p>
              <ul className="space-y-1 text-gray-600">
                <li>• Verifique seu e-mail para os detalhes</li>
                <li>• Entre em contato com o vendedor</li>
                <li>• Combine a entrega/retirada</li>
              </ul>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowModal(false)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}