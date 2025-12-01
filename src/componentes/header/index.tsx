"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { CarrinhoIcone } from '@/componentes/header/componentes/carrinhoIcone'
import { useAuth } from '@/Context/authContext'
import { User, LogOut, Package, UserCircle, Store } from 'lucide-react'

export function Header() {
    const { usuario, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fechar menu ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[#2a0047]/95 backdrop-blur-sm text-white shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/Vector.svg"
                        alt="Logo Celebrai"
                        width={24}
                        height={24}
                    />
                    <span className="font-bold text-xl">Celebraí</span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    {isAuthenticated ? (
                        <div className="relative" ref={menuRef}>
                            {/* Avatar com dropdown */}
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 hover:bg-white/10 rounded-full p-2 transition"
                            >
                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                    {/* Header do menu com nome do usuário */}
                                    <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                                        <p className="font-semibold truncate">{usuario?.nome}</p>
                                        <p className="text-xs text-white/80">
                                            {usuario?.tipo === 'fornecedor' ? 'Fornecedor' : 'Consumidor'}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {/* Se for fornecedor, mostrar opção de adicionar produtos */}
                                        {usuario?.tipo === 'fornecedor' && (
                                            <Link
                                                href="/vendedor"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition"
                                            >
                                                <Package className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm font-medium">Adicionar Produtos</span>
                                            </Link>
                                        )}

                                        {/* Se for consumidor, mostrar opção de se tornar fornecedor */}
                                        {usuario?.tipo === 'consumidor' && (
                                            <Link
                                                href="/tornar-se-fornecedor"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition"
                                            >
                                                <Store className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium">Torne-se Fornecedor</span>
                                            </Link>
                                        )}

                                        {/* Perfil */}
                                        <Link
                                            href="/perfil"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition"
                                        >
                                            <UserCircle className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium">Meu Perfil</span>
                                        </Link>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-1"></div>

                                        {/* Sair */}
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm font-medium">Sair</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/Login"
                                className="text-sm font-medium hover:text-gray-300 transition"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/Login"
                                className="bg-[#ff007f] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition"
                            >
                                Cadastre-se
                            </Link>
                        </>
                    )}
                    {/* Ícone do Carrinho - Só aparece quando tem itens */}
                    <CarrinhoIcone />
                </nav>
            </div>
        </header>
    )
}