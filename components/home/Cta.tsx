'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Cta = () => {
  return (
    <section className="py-20 relative">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="CTA Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para <span className="gradient-text">Ganar a lo Grande</span>?
            </h2>
            
            <p className="text-lg text-gray-300 mb-10">
              Únete a miles de jugadores que ya están ganando en Casino Royal. ¡Regístrate ahora y reclama tu bono de bienvenida exclusivo!
            </p>
            
            <div className="mb-10 p-6 glass-card inline-block">
              <h3 className="text-2xl font-bold mb-2 text-secondary">Bono para Nuevos Jugadores</h3>
              <p className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-primary">$1,000</span> + <span className="text-secondary">200 Giros Gratis</span>
              </p>
              <p className="text-sm text-gray-400">Oferta por tiempo limitado. Se aplican términos y condiciones.</p>
            </div>
            
            <Link href="/signup" className="btn-primary text-lg px-10 py-4 shadow-neon">
              Crear Cuenta
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-casino-dark to-transparent"></div>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute left-10 bottom-20 md:bottom-40"
      >
        <Image 
          src="/images/elements/dice.png" 
          alt="Dados" 
          width={80} 
          height={80} 
          className="opacity-60"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute right-10 top-20 md:top-40"
      >
        <Image 
          src="/images/elements/chip-gold.png" 
          alt="Ficha" 
          width={60} 
          height={60} 
          className="opacity-60"
        />
      </motion.div>
    </section>
  );
};

export default Cta;