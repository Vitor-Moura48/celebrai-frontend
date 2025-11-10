"use client";
import { useState } from "react";
import { Clock, X } from "lucide-react";
import { useFreteCalculator } from "@/lib/Hooks/useFreteCalculator";
import { HORARIOS_FUNCIONAMENTO, ENDERECO_LOJA } from "@/lib/Constants/horarios";

export default function HorariosPopup() {
  const [open, setOpen] = useState(false);
  const [metodo, setMetodo] = useState<"retirada" | "frete">("retirada");
  const [cep, setCep] = useState("");
  const { calcular, limpar, loading, erro, resultado } = useFreteCalculator();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border-2 border-pink-600 text-pink-600 px-5 py-2 rounded-full flex items-center justify-center hover:bg-pink-50 transition"
      >
        <Clock size={16} className="mr-2" />
        Conferir Disponibilidade
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-pink-600 text-center">
              Disponibilidade para Entrega
            </h2>

            <div className="flex justify-center gap-2 mb-5">
              <button
                onClick={() => {
                  setMetodo("retirada");
                  limpar();
                }}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  metodo === "retirada"
                    ? "bg-[#ff007f] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Retirada
              </button>
              <button
                onClick={() => {
                  setMetodo("frete");
                  limpar();
                }}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  metodo === "frete"
                    ? "bg-[#ff007f] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Frete
              </button>
            </div>

            {metodo === "frete" ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  CEP:
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => {
                    setCep(e.target.value);
                    limpar();
                  }}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
                />

                {erro && <p className="text-red-500 text-sm">{erro}</p>}

                <button
                  onClick={() => calcular(cep)}
                  disabled={loading}
                  className="w-full bg-[#ff007f] text-white py-2 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Calculando..." : "Calcular Frete"}
                </button>

                {resultado && (
                  <div className="mt-3 border-t border-gray-300 pt-3 text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>Endereço:</strong> {resultado.endereco}
                    </p>
                    <p>
                      <strong>Valor do frete:</strong> {resultado.valorFrete}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      * Calculado a R$ 1,00 por km de distância
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Endereço:</strong> {ENDERECO_LOJA.endereco}
                </p>
                <p className="font-medium">Funcionamento:</p>
                <ul className="space-y-1">
                  {Object.entries(HORARIOS_FUNCIONAMENTO).map(([dia, hora]) => (
                    <li
                      key={dia}
                      className="flex justify-between border-b pb-1 text-sm"
                    >
                      <span className="font-medium">{dia}</span>
                      <span>{hora}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}