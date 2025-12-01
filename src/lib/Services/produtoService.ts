import api from "../api/axios";

export interface Produto {
    idProduto: number;
    nome: string;
    descricao: string;
    precoUnitario: number;
    quantidadeAluguelPorDia: number;
    imagemUrl: string;
    imagemPublicId: string;
    idSubcategoria: number;
    fornecedor?: {
        id: string;
        nome: string;
    };
}

export interface SubCategoria {
    idSubcategoria: number;
    nome: string;
}

export const produtoService = {
    async listarTodos(): Promise<Produto[]> {
        try {
            const response = await api.get('/produto');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return [];
        }
    },

    async buscarPorId(id: number): Promise<Produto | null> {
        try {
            const response = await api.get(`/produto/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return null;
        }
    },

    async buscarPorCategoria(idSubcategoria: number): Promise<Produto[]> {
        try {
            const response = await api.get(`/produto/categoria/${idSubcategoria}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            return [];
        }
    },

    async listarSubCategorias(): Promise<SubCategoria[]> {
        try {
            const response = await api.get('/subcategoria');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar subcategorias:', error);
            // Retorna lista hardcoded como fallback
            return [
                { idSubcategoria: 1, nome: 'Casamento - Kits' },
                { idSubcategoria: 2, nome: 'Recepção - Kits' },
                { idSubcategoria: 3, nome: 'Cerimônia - Kits' },
                { idSubcategoria: 4, nome: 'Aniversário - Kits' },
                { idSubcategoria: 5, nome: 'Infantil - Kits' },
                { idSubcategoria: 6, nome: 'Adulto - Kits' },
                { idSubcategoria: 7, nome: 'Corporativos - Kits' },
                { idSubcategoria: 8, nome: 'Casamento - Orçamentos' },
                { idSubcategoria: 9, nome: 'Aniversário - Orçamentos' },
                { idSubcategoria: 10, nome: 'Corporativos - Orçamentos' },
            ];
        }
    },
};
