// Exporta todos os serviços para fácil importação
export { default as api } from './axios';
export { default as authService } from './services/authService';
export { default as produtoService } from './services/produtoService';
export { default as pedidoService } from './services/pedidoService';
export { default as vendedorService } from './services/vendedorService';
export { default as mensagemService } from './services/mensagemService';
export { default as cupomService } from './services/cupomService';

// Re-exporta todos os tipos
export * from '../types/api';
