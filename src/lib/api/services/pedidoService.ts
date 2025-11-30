import api from '../axios';
import { Pedido, PedidoRequest, PaginatedResponse } from '@/lib/types/api';

class PedidoService {
  /**
   * Cria um novo pedido
   */
  async criar(dados: PedidoRequest): Promise<Pedido> {
    const response = await api.post<Pedido>('/pedidos', dados);
    return response.data;
  }

  /**
   * Lista pedidos do usuário autenticado
   */
  async listarMeusPedidos(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Pedido>> {
    const response = await api.get<PaginatedResponse<Pedido>>('/pedidos/meus-pedidos', { params });
    return response.data;
  }

  /**
   * Busca um pedido por ID
   */
  async buscarPorId(id: string): Promise<Pedido> {
    const response = await api.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  }

  /**
   * Cancela um pedido
   */
  async cancelar(id: string, motivo?: string): Promise<Pedido> {
    const response = await api.post<Pedido>(`/pedidos/${id}/cancelar`, { motivo });
    return response.data;
  }

  /**
   * Atualiza status do pedido (apenas vendedor)
   */
  async atualizarStatus(id: string, status: string): Promise<Pedido> {
    const response = await api.patch<Pedido>(`/pedidos/${id}/status`, { status });
    return response.data;
  }

  /**
   * Lista pedidos recebidos (para vendedor)
   */
  async listarPedidosRecebidos(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Pedido>> {
    const response = await api.get<PaginatedResponse<Pedido>>('/pedidos/recebidos', { params });
    return response.data;
  }

  /**
   * Calcula o valor total do pedido (preview)
   */
  async calcularTotal(dados: {
    itens: Array<{ produtoId: string; quantidade: number }>;
    cep: string;
    cupom?: string;
  }): Promise<{
    subtotal: number;
    desconto: number;
    frete: number;
    total: number;
  }> {
    const response = await api.post('/pedidos/calcular', dados);
    return response.data;
  }
}

export default new PedidoService();
