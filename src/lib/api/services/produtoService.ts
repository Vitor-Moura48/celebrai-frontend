import api from '../axios';
import { Produto, ProdutoRequest, PaginatedResponse } from '@/lib/types/api';

class ProdutoService {
  /**
   * Lista todos os produtos com paginação
   */
  async listar(params?: {
    page?: number;
    limit?: number;
    categoria?: string;
    busca?: string;
    ordenacao?: string;
    precoMin?: number;
    precoMax?: number;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos', { params });
    return response.data;
  }

  /**
   * Busca um produto por ID
   */
  async buscarPorId(id: string): Promise<Produto> {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  }

  /**
   * Lista produtos por categoria
   */
  async listarPorCategoria(categoria: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>(
      `/produtos/categoria/${categoria}`,
      { params }
    );
    return response.data;
  }

  /**
   * Busca produtos por termo de pesquisa
   */
  async buscar(query: string, params?: {
    page?: number;
    limit?: number;
    categoria?: string;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos/buscar', {
      params: { q: query, ...params }
    });
    return response.data;
  }

  /**
   * Lista produtos do vendedor autenticado
   */
  async listarMeusProdutos(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos/meus-produtos', { params });
    return response.data;
  }

  /**
   * Cria um novo produto (apenas para vendedores)
   */
  async criar(dados: ProdutoRequest): Promise<Produto> {
    const response = await api.post<Produto>('/produtos', dados);
    return response.data;
  }

  /**
   * Atualiza um produto existente
   */
  async atualizar(id: string, dados: Partial<ProdutoRequest>): Promise<Produto> {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  }

  /**
   * Deleta um produto
   */
  async deletar(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  }

  /**
   * Lista produtos em destaque
   */
  async listarDestaque(limit: number = 10): Promise<Produto[]> {
    const response = await api.get<Produto[]>('/produtos/destaque', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Lista produtos mais vendidos
   */
  async listarMaisVendidos(limit: number = 10): Promise<Produto[]> {
    const response = await api.get<Produto[]>('/produtos/mais-vendidos', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Upload de imagem do produto
   */
  async uploadImagem(produtoId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('imagem', file);

    const response = await api.post<{ url: string }>(
      `/produtos/${produtoId}/imagem`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

export default new ProdutoService();
