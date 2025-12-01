"use client"

import Image from 'next/image'
import Link from 'next/link'
import { CadastroDropdown } from './componentes/dropDown'
import { CarrinhoIcone } from '@/componentes/header/componentes/carrinhoIcone'
import { useAuth } from '@/Context/authContext'
import { User, LogOut } from 'lucide-react'
export function Header(){
    const { usuario, logout, isAuthenticated } = useAuth();
    return(
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
                        <>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span>{usuario?.nome}</span>
                            </div>
                            <button 
                                onClick={logout}
                                className="text-sm font-medium hover:text-gray-300 transition flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="Login" 
                                className="text-sm font-medium hover:text-gray-300 transition"
                            >
                                Entrar
                            </Link>
                            <CadastroDropdown />
                        </>
                    )}
                    {/* Ícone do Carrinho - Só aparece quando tem itens */}
                    <CarrinhoIcone />
                </nav>
            </div>
        </header>
    )
}