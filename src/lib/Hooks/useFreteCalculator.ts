import { useState } from "react";
import { calcularFretePorCEP } from "../Services/freteService";

export function useFreteCalculator() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    endereco: string;
    valorFrete: string;
  } | null>(null);

  const calcular = async (cep: string) => {
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const dados = await calcularFretePorCEP(cep);
      setResultado({
        endereco: dados.endereco,
        valorFrete: `R$ ${dados.valorFrete}`,
      });
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao calcular o frete"
      );
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setResultado(null);
    setErro(null);
  };

  return { calcular, limpar, loading, erro, resultado };
}