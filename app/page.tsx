'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-casino-dark via-black to-casino-dark"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Bienvenido a <span className="gradient-text">SpinZone</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Experimenta la emoción de los juegos de casino premium desde la comodidad de tu hogar. Juega a los mejores juegos de casino del mundo y gana a lo grande con nuestros increíbles bonos.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/signup" className="btn-primary px-10 py-4 text-lg shadow-neon">
              Únete ahora
            </Link>
            <Link href="/games" className="btn-outline px-10 py-4 text-lg">
              Explorar juegos
            </Link>
          </div>

          <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-casino-highlight inline-block">
            <h2 className="text-xl font-bold mb-3 text-secondary">Bono de bienvenida</h2>
            <p className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-primary">$400,000</span> + <span className="text-secondary">200 Giros gratis</span>
            </p>
            <p className="text-sm text-gray-400">Solo para nuevos jugadores. Se aplican términos y condiciones.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}