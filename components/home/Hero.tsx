'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(1);
  const totalBgs = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev % totalBgs) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images with Fade Transition */}
      {[1, 2, 3].map(num => (
        <div
          key={num}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentBg === num ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(/images/hero-bg-${num}.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-casino-dark z-0"></div>

      {/* Floating Casino Elements */}
      <div className="absolute w-full h-full">
        <Image
          src="/images/elements/chip-red.png"
          alt="Casino Chip"
          width={80}
          height={80}
          className="absolute top-1/4 left-[10%] float-animation opacity-70 animate-pulse-slow"
        />
        <Image
          src="/images/elements/ace.png"
          alt="Ace Card"
          width={60}
          height={90}
          className="absolute top-2/3 right-[15%] float-animation opacity-70 animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        <Image
          src="/images/elements/dice.png"
          alt="Dice"
          width={60}
          height={60}
          className="absolute top-1/2 left-[20%] float-animation opacity-70 animate-pulse-slow"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 pt-20">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Experimenta la Emoción</span>
            <br /> de Juegos Premium
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Bienvenido a Casino Royal, donde la emoción se encuentra con el lujo. Juega los mejores juegos de casino y gana a lo grande con nuestros increíbles bonos.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link href="/signup" className="btn-primary px-10 py-4 text-lg shadow-neon">
              Únete Ahora
            </Link>
            <Link href="/games" className="btn-outline px-10 py-4 text-lg">
              Explorar Juegos
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-casino-highlight inline-block"
          >
            <h2 className="text-xl font-bold mb-3 text-secondary">Bono de Bienvenida</h2>
            <p className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-primary">$1,000</span> + <span className="text-secondary">200 Giros Gratis</span>
            </p>
            <p className="text-sm text-gray-400">Solo para nuevos jugadores. Se aplican términos y condiciones.</p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <p className="text-sm text-gray-400 mb-2">Desplázate para explorar</p>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mt-2"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;