import api from '../axios';
import { Cupom } from '@/lib/types/api';

class CupomService {
  /**
   * Valida um cupom de desconto
   */
  async validar(codigo: string): Promise<Cupom> {
    const response = await api.post<Cupom>('/cupons/validar', { codigo });
    return response.data;
  }

  /**
   * Lista cupons disponíveis para o usuário
   */
  async listarDisponiveis(): Promise<Cupom[]> {
    const response = await api.get<Cupom[]>('/cupons/disponiveis');
    return response.data;
  }

  /**
   * Aplica um cupom (retorna o valor do desconto)
   */
  async aplicar(codigo: string, valorTotal: number): Promise<{
    desconto: number;
    valorFinal: number;
  }> {
    const response = await api.post('/cupons/aplicar', { codigo, valorTotal });
    return response.data;
  }
}

export default new CupomService();
