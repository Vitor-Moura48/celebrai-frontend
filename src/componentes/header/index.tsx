"use client"

import Image from 'next/image'
import Link from 'next/link'
import { CadastroDropdown } from './componentes/dropDown'

export function Header(){
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
                    <Link 
                        href="Login" 
                        className="text-sm font-medium hover:text-gray-300 transition"
                    >
                        Entrar
                    </Link>

                    <CadastroDropdown />

                </nav>
            </div>
        </header>
    )
}