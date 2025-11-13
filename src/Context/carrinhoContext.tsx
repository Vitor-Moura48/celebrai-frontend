"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Tipos
export interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  vendedor: {
    nome: string;
    location: string;
  };
  quantidade: number;
}

interface CarrinhoContextType {
  itens: Produto[];
  adicionarAoCarrinho: (produto: Omit<Produto, 'quantidade'>) => void;
  removerDoCarrinho: (id: string) => void;
  aumentarQuantidade: (id: string) => void;
  diminuirQuantidade: (id: string) => void;
  limparCarrinho: () => void;
  total: number;
  quantidadeTotal: number;
}

// Context do Carrinho
const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Produto[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carregar do localStorage ao montar
  useEffect(() => {
    setMounted(true);
    const carrinhoSalvo = localStorage.getItem('celebrai_carrinho');
    if (carrinhoSalvo) {
      try {
        setItens(JSON.parse(carrinhoSalvo));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('celebrai_carrinho', JSON.stringify(itens));
    }
  }, [itens, mounted]);

  const adicionarAoCarrinho = (produto: Omit<Produto, 'quantidade'>) => {
    setItens(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (id: string) => {
    setItens(prev => prev.filter(item => item.id !== id));
  };

  const aumentarQuantidade = (id: string) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (id: string) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id && item.quantidade > 1
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        removerDoCarrinho,
        aumentarQuantidade,
        diminuirQuantidade,
        limparCarrinho,
        total,
        quantidadeTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
}