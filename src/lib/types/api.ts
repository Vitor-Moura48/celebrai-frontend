// Tipos para respostas da API C# - Celebraí

// Tipos de Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  emailConfirmado: boolean;
  role: 'Cliente' | 'Fornecedor';
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: Endereco;
  imagemPerfil?: string;
  criadoEm: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  nome: string;
  token: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  celular?: string;
  cpfUsuario: string;
  dataNascimento: string;
  urlIcon?: string;
  lograduro?: string;
  numero?: string;
  cep?: string;
}

export interface UpdateUsuarioRequest {
  nome?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface ChangeAddressRequest {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Tipos de Produto
export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagens: string[];
  categoria: string;
  estoque: number;
  vendedorId: string;
  vendedor?: Vendedor;
  avaliacoes?: Avaliacao[];
  mediaAvaliacao?: number;
  tags?: string[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProdutoRequest {
  nome: string;
  descricao: string;
  preco: number;
  imagens: string[];
  categoria: string;
  estoque: number;
  tags?: string[];
}

// Tipos de Vendedor
export interface Vendedor {
  id: string;
  nome: string;
  localizacao: string;
  avatar?: string;
  verificado: boolean;
  categorias: string[];
  membroDesde: string;
  avaliacoes?: Avaliacao[];
  mediaAvaliacao?: number;
}

// Tipos de Avaliação
export interface Avaliacao {
  id: string;
  nota: number;
  comentario?: string;
  usuarioId: string;
  usuario?: Usuario;
  produtoId?: string;
  vendedorId?: string;
  criadoEm: string;
}

// Tipos de Pedido
export interface Pedido {
  id: string;
  usuarioId: string;
  usuario?: Usuario;
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  status: 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
  enderecoEntrega: Endereco;
  metodoPagamento: string;
  cupom?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemPedido {
  id: string;
  produtoId: string;
  produto?: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Endereco {
  id?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  usuarioId?: string;
}

export interface PedidoRequest {
  itens: Array<{
    produtoId: string;
    quantidade: number;
  }>;
  enderecoEntrega: Endereco;
  metodoPagamento: string;
  cupom?: string;
}

// Tipos de Resposta Paginada
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos de Erro
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Tipos de Mensagem/Chat
export interface Mensagem {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  lida: boolean;
  criadoEm: string;
}

export interface MensagemRequest {
  destinatarioId: string;
  conteudo: string;
}

// Tipos de Cupom
export interface Cupom {
  codigo: string;
  desconto: number;
  tipoDesconto: 'percentual' | 'fixo';
  valido: boolean;
  validoAte?: string;
}
