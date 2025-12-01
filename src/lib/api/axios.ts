import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Configuração base do Axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5156';

const api = axios.create({
  baseURL: API_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Adiciona token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Buscar token do localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('celebrai_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('⚠️ Nenhum token encontrado no localStorage');
      }
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response - Tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Erros com resposta do servidor
      switch (error.response.status) {
        case 401:
          // Token expirado ou inválido
          console.warn('⚠️ Erro 401: Token expirado ou inválido');
          // Não redirecionar automaticamente - deixar o componente decidir
          break;
        case 403:
          console.error('Acesso negado');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro na resposta:', error.response.data);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro ao configurar a requisição
      console.error('Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
