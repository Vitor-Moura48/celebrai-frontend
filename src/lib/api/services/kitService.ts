import api from '../axios';

class KitService {
  /**
   * Lista todos os kits do fornecedor autenticado
   * Assumindo Endpoint: GET /Kit
   */
  async listarMeusKitsReal(params?: { page?: number; limit?: number }): Promise<any[]> {
    const response = await api.get<any>('/Kit', { params });
    return response.data?.data || response.data;
  }

  /**
   * Cria um novo kit
   * Endpoint: POST /Kit
   */
  async criar(dados: any): Promise<any> {
    const response = await api.post('/Kit', dados);
    return response.data;
  }

  /**
   * Atualiza um kit existente
   * Endpoint: PUT /Kit/{id}
   */
  async atualizar(id: string | number, dados: any): Promise<any> {
    const response = await api.put(`/Kit/${id}`, dados);
    return response.data;
  }

  /**
   * Deleta um kit
   * Endpoint: DELETE /Kit/{id}
   */
  async deletar(id: string | number): Promise<any> {
    const response = await api.delete(`/Kit/${id}`);
    return response.data;
  }
}

export default new KitService();
