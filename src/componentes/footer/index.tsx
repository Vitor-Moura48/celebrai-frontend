import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #0d0020 0%, #1a0038 50%, #0d0020 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
      className="w-full text-white"
    >
      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-14 flex flex-col items-center text-center gap-8">

        {/* Brand name */}
        <div>
          <span
            style={{
              background: 'linear-gradient(90deg, #c084fc, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="text-2xl font-bold tracking-tight"
          >
            Celebrai
          </span>
        </div>

        {/* Sobre Nós - texto centralizado */}
        <div className="max-w-xl">
          <h3
            style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}
            className="text-xs font-semibold uppercase mb-3"
          >
            Sobre Nós
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-sm leading-relaxed">
            A Celebrai conecta você aos melhores fornecedores para tornar cada celebração inesquecível.
            Simplificamos a organização de eventos com tecnologia, cuidado e muita criatividade.
          </p>
        </div>

        {/* Redes sociais */}
        <div className="flex items-center gap-5">
          {[
            { href: '#', Icon: FaInstagram, label: 'Instagram' },
            { href: '#', Icon: FaFacebookF, label: 'Facebook' },
            { href: '#', Icon: FaWhatsapp, label: 'WhatsApp' },
          ].map(({ href, Icon, label }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.25s ease',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110"
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(192,132,252,0.2)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(192,132,252,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <Icon size={16} style={{ color: 'rgba(255,255,255,0.75)' }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        className="py-4 px-6 text-center"
      >
        <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-xs">
          © {new Date().getFullYear()} Celebrai. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}