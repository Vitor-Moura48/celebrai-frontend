"use client";
import { useState } from "react";
import { Clock, X } from "lucide-react";

export default function HorariosPopup() {
  const [open, setOpen] = useState(false);
  const [metodo, setMetodo] = useState<"retirada" | "frete">("retirada");
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<string | null>(null);

  const horarios = {
    Segunda: "08:00 - 18:00",
    Terça: "08:00 - 18:00",
    Quarta: "08:00 - 18:00",
    Quinta: "08:00 - 18:00",
    Sexta: "08:00 - 17:00",
    Sábado: "09:00 - 13:00",
    Domingo: "Fechado",
  };

  const calcularFrete = () => {
    if (!cep) {
      alert("Por favor, insira um CEP válido.");
      return;
    }
    const valor = (Math.random() * 20 + 5).toFixed(2);
    setFrete(`R$ ${valor}`);
  };

  return (
    <>
      {/* Botão principal */}
      <button
        onClick={() => setOpen(true)}
        className="border-2 border-pink-600 text-pink-600 px-5 py-2 rounded-full flex items-center justify-center hover:bg-pink-50 transition"
      >
        <Clock size={16} className="mr-2" />
        Horários/Frete
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
            {/* Botão fechar */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-pink-600 text-center">
              Disponibilidade para Entrega
            </h2>

            {/* Seleção de método */}
            <div className="flex justify-center gap-2 mb-5">
              <button
                onClick={() => setMetodo("retirada")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  metodo === "retirada"
                    ? "bg-[#ff007f] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Retirada
              </button>
              <button
                onClick={() => setMetodo("frete")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  metodo === "frete"
                    ? "bg-[#ff007f] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Frete
              </button>
            </div>

            {/* Conteúdo condicional */}
            {metodo === "frete" ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  CEP:
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="Digite seu CEP"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
                />

                <button
                  onClick={calcularFrete}
                  className="w-full bg-[#ff007f] text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
                >
                  Confirmar
                </button>

                {frete && (
                  <div className="mt-3 border-t border-gray-300 pt-2 text-sm text-gray-700">
                    <p>Endereço: ————————————————</p>
                    <p>Preço do frete: {frete}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Endereço:</strong> Rua Itambaba, Jacaré, Lagoa do Carro - PE
                </p>
                <p className="font-medium">Funcionamento:</p>
                <ul className="space-y-1">
                  {Object.entries(horarios).map(([dia, hora]) => (
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
