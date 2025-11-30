"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Usuario {
  email: string;
  nome: string;
  tipo: 'fornecedor' | 'consumidor';
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string, tipo: 'fornecedor' | 'consumidor') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários fake para teste
const USUARIOS_FAKE = [
  {
    email: 'fornecedor@celebrai.com',
    senha: '123456',
    nome: 'João Silva',
    tipo: 'fornecedor' as const
  },
  {
    email: 'consumidor@celebrai.com',
    senha: '123456',
    nome: 'Maria Santos',
    tipo: 'consumidor' as const
  },
  {
    email: 'admin@celebrai.com',
    senha: 'admin123',
    nome: 'Admin Celebraí',
    tipo: 'fornecedor' as const
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const usuarioSalvo = localStorage.getItem('celebrai_usuario');
    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && usuario) {
      localStorage.setItem('celebrai_usuario', JSON.stringify(usuario));
    } else if (mounted && !usuario) {
      localStorage.removeItem('celebrai_usuario');
    }
  }, [usuario, mounted]);

  const login = async (email: string, senha: string, tipo: 'fornecedor' | 'consumidor'): Promise<boolean> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    const usuarioEncontrado = USUARIOS_FAKE.find(
      u => u.email === email && u.senha === senha && u.tipo === tipo
    );

    if (usuarioEncontrado) {
      setUsuario({
        email: usuarioEncontrado.email,
        nome: usuarioEncontrado.nome,
        tipo: usuarioEncontrado.tipo
      });
      return true;
    }

    return false;
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        isAuthenticated: !!usuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}