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
   * Lista produtos do vendedor autenticado (rota legada)
   */
  async listarMeusProdutos(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos/meus-produtos', { params });
    return response.data;
  }

  /**
   * Lista todos os produtos do fornecedor autenticado
   * Endpoint: GET /produto
   */
  async listarMeusProdutosReal(): Promise<any[]> {
    const response = await api.get<any[]>('/produto');
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
   * Endpoint: PUT /Produto/{id}
   */
  async atualizar(id: string | number, dados: Partial<ProdutoRequest> | FormData): Promise<any> {
    const isFormData = dados instanceof FormData;
    const response = await api.put(
      `/Produto/${id}`,
      dados,
      isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    );
    return response.data;
  }

  /**
   * Deleta um produto
   * Endpoint: DELETE /Produto/{id}
   */
  async deletar(id: string | number): Promise<any> {
    const response = await api.delete(`/Produto/${id}`);
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
