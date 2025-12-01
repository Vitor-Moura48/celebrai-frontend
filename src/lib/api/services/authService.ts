import api from '../axios';
import {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  Usuario,
  UpdateUsuarioRequest,
  UpdateEmailRequest,
  ChangePasswordRequest,
  ChangeAddressRequest
} from '@/lib/types/api';

class AuthService {
  /**
   * Realiza o login do usuário
   * Rota: POST /login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Backend espera { Email, Password } com letras maiúsculas
    const requestData = {
      Email: credentials.email,
      Password: credentials.senha
    };

    const response = await api.post<LoginResponse>('/login', requestData);

    // Salvar token no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('celebrai_token', response.data.tokens.accessToken);
      localStorage.setItem('celebrai_user_name', response.data.name);

      // Tentar extrair telefone do token JWT se disponível
      try {
        const token = response.data.tokens.accessToken;
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.telefone || payload.celular || payload.phone) {
          const telefone = payload.telefone || payload.celular || payload.phone;
          localStorage.setItem('celebrai_user_telefone', telefone);
        }
      } catch (error) {
        console.log('ℹ️ Não foi possível extrair telefone do token');
      }

    }

    return response.data;
  }

  /**
   * Registra um novo usuário
   * Rota: POST /usuario
   */
  async registrar(dados: RegistroRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/usuario', dados);

    // Backend de registro não retorna token, apenas mensagem
    // Usuário precisa fazer login após criar a conta

    return response.data;
  }

  /**
   * Confirma o email do usuário
   * Rota: GET /usuario/confirm-email?token={token}
   */
  async confirmarEmail(token: string): Promise<{ message: string }> {
    const response = await api.get(`/usuario/confirm-email?token=${token}`);
    return response.data;
  }

  /**
   * Faz logout do usuário
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('celebrai_token');
      localStorage.removeItem('celebrai_user_name');
      localStorage.removeItem('celebrai_user');
      localStorage.removeItem('celebrai_carrinho');
      window.location.href = '/Login';
    }
  }

  /**
   * Obtém o usuário autenticado
   */
  getUsuarioAutenticado(): Usuario | null {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('celebrai_user');
      if (userString) {
        try {
          return JSON.parse(userString);
        } catch (error) {
          console.error('Erro ao parsear usuário:', error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAutenticado(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('celebrai_token');
    }
    return false;
  }

  /**
   * Obtém o token de autenticação
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('celebrai_token');
    }
    return null;
  }

  /**
   * Busca dados do perfil do usuário autenticado
   * Rota: GET /usuario (requer autenticação)
   */
  async getPerfil(): Promise<Usuario> {
    const response = await api.get<Usuario>('/usuario');

    // Atualizar dados no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('celebrai_user', JSON.stringify(response.data));
    }

    return response.data;
  }

  /**
   * Atualiza o perfil do usuário
   * Rota: PUT /usuario/update (requer autenticação)
   */
  async atualizarPerfil(dados: UpdateUsuarioRequest): Promise<void> {
    await api.put('/usuario/update', dados);

    // Recarregar perfil atualizado
    await this.getPerfil();
  }

  /**
   * Atualiza o email do usuário
   * Rota: PUT /usuario/update/email (requer autenticação)
   */
  async atualizarEmail(dados: UpdateEmailRequest): Promise<LoginResponse> {
    const response = await api.put<LoginResponse>('/usuario/update/email', dados);

    // Atualizar token
    if (typeof window !== 'undefined' && response.data.tokens?.accessToken) {
      localStorage.setItem('celebrai_token', response.data.tokens.accessToken);
    }

    return response.data;
  }

  /**
   * Atualiza o endereço do usuário
   * Rota: PUT /usuario/update/change-address (requer autenticação)
   */
  async atualizarEndereco(dados: ChangeAddressRequest): Promise<void> {
    await api.put('/usuario/update/change-address', dados);
  }

  /**
   * Altera a senha do usuário
   * Rota: PUT /usuario/change-password (requer autenticação)
   */
  async alterarSenha(dados: ChangePasswordRequest): Promise<void> {
    await api.put('/usuario/change-password', dados);
  }

  /**
   * Deleta a conta do usuário
   * Rota: DELETE /usuario (requer autenticação)
   */
  async deletarConta(): Promise<void> {
    await api.delete('/usuario');

    // Limpar dados locais
    this.logout();
  }
}

export default new AuthService();
