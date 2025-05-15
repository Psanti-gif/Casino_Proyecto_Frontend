import Link from 'next/link';
import Image from 'next/image';
import { LucideGithub, LucideTwitter, LucideInstagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-casino-dark pt-16 pb-8 border-t border-casino-highlight">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="text-2xl font-bold">
                <span className="text-white">Spin</span>
                <span className="text-primary">Zone</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Experimenta la emoción de los juegos de casino premium desde la comodidad de tu hogar. Juega responsablemente.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                <LucideTwitter className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" className="text-gray-400 hover:text-primary transition-colors">
                <LucideGithub className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-gray-400 hover:text-primary transition-colors">
                <LucideInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><Link href="/games" className="text-gray-400 hover:text-white transition-colors">Juegos</Link></li>
              <li><Link href="/promotions" className="text-gray-400 hover:text-white transition-colors">Promociones</Link></li>
              <li><Link href="/vip" className="text-gray-400 hover:text-white transition-colors">Club VIP</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Nosotros</Link></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Soporte</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/responsible-gaming" className="text-gray-400 hover:text-white transition-colors">Juego Responsable</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Suscríbete para recibir ofertas exclusivas y novedades.</p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="px-4 py-2 bg-casino-light text-white rounded-l-md focus:outline-none w-full"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-r-md"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-casino-highlight text-center">
          <p className="text-gray-500 text-sm">
            SpinZone promueve el juego responsable. El juego puede ser adictivo. Por favor, juega responsablemente.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} Casino Royal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;