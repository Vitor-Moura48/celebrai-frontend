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
    const userEmail = localStorage.getItem('celebrai_user_email');
    const userRole = localStorage.getItem('celebrai_user_role');

    if (token && userName) {
      // Decodificar o token para pegar a role se não estiver no localStorage
      let tipo: 'fornecedor' | 'consumidor' = 'consumidor';

      if (userRole) {
        tipo = userRole === 'Fornecedor' ? 'fornecedor' : 'consumidor';
      } else if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const roleFromToken = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'Cliente';
          tipo = roleFromToken === 'Fornecedor' ? 'fornecedor' : 'consumidor';
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
        }
      }

      setUsuario({
        email: userEmail || '',
        nome: userName,
        tipo: tipo
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

        // Salvar informações adicionais no localStorage
        localStorage.setItem('celebrai_user_email', email);
        localStorage.setItem('celebrai_user_role', roleFromToken);

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