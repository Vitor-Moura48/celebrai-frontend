"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import authService from '@/lib/api/services/authService';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Verificar se há token e nome de usuário salvos
    const token = localStorage.getItem('celebrai_token');
    const userName = localStorage.getItem('celebrai_user_name');

    if (token && userName) {
      // Usuário está autenticado
      setUsuario({
        email: '', // Não temos o email salvo, mas não é necessário para o header
        nome: userName,
        tipo: 'consumidor' // Padrão
      });
    }
  }, []);

  const login = async (email: string, senha: string, tipo: 'fornecedor' | 'consumidor'): Promise<boolean> => {
    try {
      const response = await authService.login({ email, senha });

      if (response.tokens?.accessToken) {
        // Decodificar o token para pegar a role real do backend
        const token = response.tokens.accessToken;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roleFromToken = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'Cliente';

        // Mapear role do backend para tipo do frontend
        const tipoUsuario = roleFromToken === 'Fornecedor' ? 'fornecedor' : 'consumidor';

        setUsuario({
          email: email,
          nome: response.name,
          tipo: tipoUsuario
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  }; const logout = () => {
    setUsuario(null);
    authService.logout();
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