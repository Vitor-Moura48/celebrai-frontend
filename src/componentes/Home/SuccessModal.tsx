"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";

export default function SuccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const compraRealizada = searchParams.get("compraRealizada");
    if (compraRealizada === "true") {
      setShowModal(true);
      // Remove a query parameter da URL
      window.history.replaceState({}, "", "/");
      // Esconde a mensagem após 5 segundos
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Compra realizada com sucesso!
        </h2>
        <p className="text-gray-600 mb-6">
          Sua compra foi finalizada com sucesso. Em breve você receberá um e-mail com os detalhes do seu pedido.
        </p>
        
        <button
          onClick={() => setShowModal(false)}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
