import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Tag, CreditCard, ChevronRight, Package, Loader2 } from "lucide-react";
import { useAuth } from '@/Context/authContext';

export default function CarrinhoResumo({
  subtotal,
  desconto,
  totalFinal,
  cupom,
  setCupom,
  cupomAplicado,
  aplicarCupom,
  itens,
}: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {isAuthenticated} = useAuth();
  const handleFinalizarAluguel = async () => {
    setLoading(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirecionar para home com parâmetro de sucesso
    {isAuthenticated ? (
                           router.push("/?aluguelRealizado=true")
                    ) : (
                           router.push("/Login")
                    )}
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>

      {/* Cupom */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cupom de Desconto
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite seu cupom"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={aplicarCupom}
            disabled={cupomAplicado || loading}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition"
          >
            Aplicar
          </button>
        </div>

        {cupomAplicado && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Cupom aplicado com sucesso!
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          Dica: Use o cupom "DESCONTO10" para ganhar 10% de desconto
        </p>
      </div>

      {/* Valores */}
      <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
        <div className="flex justify-between text-gray-700">
          <span>
            Subtotal ({itens.reduce((acc: number, i:{quantidade: number}) => acc + i.quantidade, 0)} itens)
          </span>
          <span className="font-semibold">
            R$ {subtotal.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {cupomAplicado && (
          <div className="flex justify-between text-green-600">
            <span>Desconto (10%)</span>
            <span className="font-semibold">
              - R$ {desconto.toFixed(2).replace(".", ",")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <span>Frete</span>
          <span className="font-semibold text-gray-500">A calcular</span>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Total estimado</span>
          <span className="text-3xl font-bold text-pink-600">
            R$ {totalFinal.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Produto sujeito a mudanças de valor pelo vendedor
        </p>
      </div>

      <button
        onClick={handleFinalizarAluguel}
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Finalizar Aluguel
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Entrega:</span> Entre em contato com o vendedor
            para calcular o frete e combinar a entrega/retirada.
          </p>
        </div>
      </div>
    </div>
  );
}