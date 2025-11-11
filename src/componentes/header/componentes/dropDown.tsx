"use client"
import { useState } from 'react'
import Link from 'next/link'

export function CadastroDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="bg-[#ff007f] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition cursor-pointer"
      >
        Cadastre-se
      </button>

      {dropdownOpen && (
        <>
          {/* Overlay com animação */}
          <div 
            className="fixed inset-0 z-40 animate-fadeIn"
            onClick={() => setDropdownOpen(false)}
          />
          
          {/* Menu com animação slide */}
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-50 border border-gray-100 animate-slideDown">
            {/* Fornecedor */}
            <Link
                href="/Login?tipo=fornecedor"
                className="block px-6 py-5 hover:bg-gray-50 transition group cursor-pointer"
                onClick={() => setDropdownOpen(false)}
            >
                <div className="flex items-start space-x-4">
                    {/* Ícone */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#ff007f] transition">
                        <svg 
                            className="w-5 h-5 text-gray-700 group-hover:text-white transition" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    
                    {/* Texto */}
                    <div className="flex-1">
                        <div className="font-semibold text-base text-black mb-1">
                            Sou Fornecedor
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                            Venda seus produtos e alcance mais clientes
                        </div>
                    </div>
                </div>
            </Link>
            
            {/* Divisor */}
            <div className="border-t border-gray-100" />
            
            {/* Consumidor */}
            <Link
                href="/Login?tipo=consumidor"
                className="block px-6 py-5 hover:bg-gray-50 transition group cursor-pointer"
                onClick={() => setDropdownOpen(false)}
            >
                <div className="flex items-start space-x-4">
                    {/* Ícone */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#ff007f] transition">
                        <svg 
                            className="w-5 h-5 text-gray-700 group-hover:text-white transition" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    
                    {/* Texto */}
                    <div className="flex-1">
                        <div className="font-semibold text-base text-black mb-1">
                            Sou Consumidor
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                            Compre produtos de festas e eventos
                        </div>
                    </div>
                </div>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}