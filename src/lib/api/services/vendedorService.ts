import api from '../axios';
import { Vendedor, PaginatedResponse } from '@/lib/types/api';

class VendedorService {
  /**
   * Busca um vendedor por ID
   */
  async buscarPorId(id: string): Promise<Vendedor> {
    const response = await api.get<Vendedor>(`/vendedores/${id}`);
    return response.data;
  }

  /**
   * Lista todos os vendedores
   */
  async listar(params?: {
    page?: number;
    limit?: number;
    categoria?: string;
  }): Promise<PaginatedResponse<Vendedor>> {
    const response = await api.get<PaginatedResponse<Vendedor>>('/vendedores', { params });
    return response.data;
  }

  /**
   * Lista vendedores verificados
   */
  async listarVerificados(limit: number = 10): Promise<Vendedor[]> {
    const response = await api.get<Vendedor[]>('/vendedores/verificados', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Busca vendedores por categoria
   */
  async buscarPorCategoria(categoria: string): Promise<Vendedor[]> {
    const response = await api.get<Vendedor[]>(`/vendedores/categoria/${categoria}`);
    return response.data;
  }

  /**
   * Atualiza dados do vendedor (apenas o próprio vendedor)
   */
  async atualizar(dados: Partial<Vendedor>): Promise<Vendedor> {
    const response = await api.put<Vendedor>('/vendedores/perfil', dados);
    return response.data;
  }
}

export default new VendedorService();
