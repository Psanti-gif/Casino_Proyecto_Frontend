'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const liveDealers = [
  {
    id: 1,
    name: "Lisa",
    game: "Blackjack",
    image: "/images/dealers/dealer1.jpg",
    online: true,
    tables: 3,
    language: "Inglés, Español"
  },
  {
    id: 2,
    name: "Michael",
    game: "Ruleta",
    image: "/images/dealers/dealer2.jpg",
    online: true,
    tables: 2,
    language: "Inglés, Francés"
  },
  {
    id: 3,
    name: "Sophia",
    game: "Baccarat",
    image: "/images/dealers/dealer3.jpg",
    online: true,
    tables: 4,
    language: "Inglés, Italiano"
  },
  {
    id: 4,
    name: "Daniel",
    game: "Póker",
    image: "/images/dealers/dealer4.jpg",
    online: false,
    tables: 2,
    language: "Inglés, Alemán"
  }
];

const LiveCasinoSection = () => {
  const [hoveredDealer, setHoveredDealer] = useState<number | null>(null);

  return (
    <section className="section-padding relative bg-casino-dark">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-12 items-center"
        >
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Experimenta la Acción del <span className="gradient-text">Casino en Vivo</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Sumérgete en la auténtica atmósfera de casino con nuestros juegos con crupier en vivo. 
              Interactúa con crupieres profesionales y otros jugadores en tiempo real, transmitido en 
              calidad HD directamente a tu dispositivo.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-casino-card px-4 py-3 rounded-lg">
                <div className="text-secondary font-bold text-2xl">30+</div>
                <div className="text-sm text-gray-400">Mesas en Vivo</div>
              </div>
              <div className="bg-casino-card px-4 py-3 rounded-lg">
                <div className="text-secondary font-bold text-2xl">24/7</div>
                <div className="text-sm text-gray-400">Disponibilidad</div>
              </div>
              <div className="bg-casino-card px-4 py-3 rounded-lg">
                <div className="text-secondary font-bold text-2xl">HD</div>
                <div className="text-sm text-gray-400">Transmisión</div>
              </div>
              <div className="bg-casino-card px-4 py-3 rounded-lg">
                <div className="text-secondary font-bold text-2xl">5+</div>
                <div className="text-sm text-gray-400">Idiomas</div>
              </div>
            </div>
            <Link href="/live-casino" className="btn-primary">
              Unirse a Mesas en Vivo
            </Link>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            {liveDealers.map(dealer => (
              <motion.div
                key={dealer.id}
                className="glass-card overflow-hidden relative card-hover"
                onMouseEnter={() => setHoveredDealer(dealer.id)}
                onMouseLeave={() => setHoveredDealer(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-56">
                  <Image
                    src={dealer.image}
                    alt={dealer.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3 flex items-center bg-black/60 py-1 px-2 rounded-full">
                    <div className={`w-2 h-2 rounded-full mr-1 ${dealer.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs">{dealer.online ? 'En línea' : 'Fuera de línea'}</span>
                  </div>
                  
                  {/* Dealer Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300">
                    <h3 className="text-xl font-bold">{dealer.name}</h3>
                    <p className="text-secondary">Crupier de {dealer.game}</p>
                    
                    {/* Extra info that shows on hover */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        hoveredDealer === dealer.id ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="text-gray-400 text-sm">
                        <p>Mesas Activas: {dealer.tables}</p>
                        <p>Idiomas: {dealer.language}</p>
                      </div>
                      {dealer.online && (
                        <button className="mt-2 bg-primary hover:bg-primary-dark text-white py-1 px-3 rounded text-sm transition-colors">
                          Unirse a Mesa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveCasinoSection;