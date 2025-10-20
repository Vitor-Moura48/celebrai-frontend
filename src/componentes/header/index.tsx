"use client"
import Image from 'next/image'
import Link from 'next/link'

export function Header(){
    return(
        <header  className="fixed top-0 left-0 w-full z-50 bg-[#2a0047]/95 backdrop-blur-sm text-white flex justify-between items-center px-8 py-3 shadow-md">
            <Link href="/" className="flex items-center space-x-2">
                <Image
                    src="/Vector.svg"
                    alt="Logo Celebrai"
                    width={20}
                    height={20}
                />
                <span className="font-semibold text-lg">Celebraí</span>
            </Link>

            <nav className="flex items-center space-x-4">
                <Link href="#contato" className="text-sm hover:underline">
                Contato
                </Link>

                <Link
                href="/Login"
                className="bg-[#ff007f] text-white text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                Cadastre-se
                </Link>
            </nav>
        </header>
    )
}