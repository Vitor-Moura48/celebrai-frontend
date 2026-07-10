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
   * Lista pedidos recebidos do fornecedor autenticado
   * Endpoint: GET /FornecedorPedido
   */
  async listarFornecedorPedidos(): Promise<any[]> {
    const response = await api.get<any[]>('/FornecedorPedido');
    return response.data;
  }

  /**
   * Atualiza um pedido (ex: status)
   * Endpoint: PUT /Pedido/{id}
   */
  async atualizar(id: string | number, dados: Record<string, any>): Promise<any> {
    const response = await api.put(`/Pedido/${id}`, dados);
    return response.data;
  }

  /**
   * Deleta um pedido
   * Endpoint: DELETE /Pedido/{id}
   */
  async deletar(id: string | number): Promise<any> {
    const response = await api.delete(`/Pedido/${id}`);
    return response.data;
  }

  /**
   * Lista pedidos recebidos (rota legada)
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
   * Busca kits de um pedido
   * Endpoint: GET /PedidoKit/{pedidoId}
   */
  async buscarKitsPorPedido(pedidoId: string | number): Promise<any[]> {
    const response = await api.get<any[]>(`/PedidoKit/${pedidoId}`);
    return response.data;
  }

  /**
   * Busca produtos de um pedido
   * Endpoint: GET /PedidoProduto/{pedidoId}
   */
  async buscarProdutosPorPedido(pedidoId: string | number): Promise<any[]> {
    const response = await api.get<any[]>(`/PedidoProduto/${pedidoId}`);
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
