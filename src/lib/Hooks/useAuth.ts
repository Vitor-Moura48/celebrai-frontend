// EXEMPLO: Hook personalizado para gerenciar autenticação
"use client"

import { useState, useEffect } from 'react';
import { authService } from '@/lib/api';
import type { Usuario } from '@/lib/api';

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = () => {
    const isAuth = authService.isAutenticado();
    setAutenticado(isAuth);

    if (isAuth) {
      const user = authService.getUsuarioAutenticado();
      setUsuario(user);
    }

    setLoading(false);
  };

  const login = async (email: string, senha: string) => {
    const response = await authService.login({ email, senha });

    // Buscar perfil completo após login
    const perfil = await authService.getPerfil();
    setUsuario(perfil);
    setAutenticado(true);

    return response;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    setAutenticado(false);
  };

  const atualizarPerfil = async (dados: Partial<Usuario>) => {
    await authService.atualizarPerfil(dados);

    // Recarregar perfil atualizado
    const perfilAtualizado = await authService.getPerfil();
    setUsuario(perfilAtualizado);

    return perfilAtualizado;
  };

  return {
    usuario,
    loading,
    autenticado,
    login,
    logout,
    atualizarPerfil,
    verificarAutenticacao
  };
}

// EXEMPLO DE USO:
/*
"use client"

import { useAuth } from '@/lib/hooks/useAuth';

export default function PerfilPage() {
  const { usuario, autenticado, loading, logout } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!autenticado) {
    return <p>Você precisa fazer login</p>;
  }

  return (
    <div>
      <h1>Olá, {usuario?.nome}</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
*/
