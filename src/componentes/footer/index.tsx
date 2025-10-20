import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'


export function Footer(){
    return(
         <footer className="w-full bg-[#2a0047] text-white py-10 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Image
              src="/Vector.svg"
              alt="Logo Celebrai"
              width={24}
              height={24}
            />
            <span className="font-semibold text-lg">Celebrai</span>
          </div>
        </div>

        {/* Início */}
        <div>
          <h3 className="font-semibold mb-3">Início</h3>
          <ul className="space-y-1 text-sm text-white/80">
            <li><Link href="#">Produtos</Link></li>
            <li><Link href="#">Anúncios</Link></li>
          </ul>
        </div>

        {/* Sobre Nós */}
        <div>
          <h3 className="font-semibold mb-3">Sobre Nós</h3>
          <ul className="space-y-1 text-sm text-white/80">
            <li><Link href="#">Informações da empresa</Link></li>
            <li><Link href="#">Contato</Link></li>
          </ul>
        </div>

        {/* Suporte + Redes + Botão */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Suporte</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Telefone</Link></li>
              <li><Link href="#">Chat</Link></li>
            </ul>
          </div>

          {/* LOGO Redes */}
          <div className="flex items-center gap-4 mt-4">
            <Link href="#" className="hover:text-[#ff007f] transition">
              <FaInstagram size={20} />
            </Link>
            <Link href="#" className="hover:text-[#ff007f] transition">
              <FaFacebookF size={20} />
            </Link>
            <Link href="#" className="hover:text-[#ff007f] transition">
              <FaWhatsapp size={20} />
            </Link>
          </div>

          {/* Botão de contato */}
          <Link
            href="#"
            className="inline-block bg-[#ff007f] text-white font-medium text-sm px-5 py-2 rounded-md hover:opacity-90 transition"
          >
            Contato
          </Link>
        </div>
      </div>
    </footer>
    )
}