import api from '../axios';
import { Mensagem, MensagemRequest, PaginatedResponse } from '@/lib/types/api';

class MensagemService {
  /**
   * Envia uma mensagem
   */
  async enviar(dados: MensagemRequest): Promise<Mensagem> {
    const response = await api.post<Mensagem>('/mensagens', dados);
    return response.data;
  }

  /**
   * Lista conversas do usuário autenticado
   */
  async listarConversas(): Promise<Array<{
    usuarioId: string;
    usuario: {
      id: string;
      nome: string;
      avatar?: string;
    };
    ultimaMensagem: Mensagem;
    naoLidas: number;
  }>> {
    const response = await api.get('/mensagens/conversas');
    return response.data;
  }

  /**
   * Lista mensagens de uma conversa específica
   */
  async listarPorConversa(usuarioId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Mensagem>> {
    const response = await api.get<PaginatedResponse<Mensagem>>(
      `/mensagens/conversa/${usuarioId}`,
      { params }
    );
    return response.data;
  }

  /**
   * Marca mensagem como lida
   */
  async marcarComoLida(mensagemId: string): Promise<{ success: boolean }> {
    const response = await api.patch(`/mensagens/${mensagemId}/lida`);
    return response.data;
  }

  /**
   * Marca todas as mensagens de uma conversa como lidas
   */
  async marcarConversaComoLida(usuarioId: string): Promise<{ success: boolean }> {
    const response = await api.patch(`/mensagens/conversa/${usuarioId}/lida`);
    return response.data;
  }

  /**
   * Obtém contagem de mensagens não lidas
   */
  async contarNaoLidas(): Promise<{ total: number }> {
    const response = await api.get('/mensagens/nao-lidas/contagem');
    return response.data;
  }
}

export default new MensagemService();
