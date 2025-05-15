'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
}

const Stat: React.FC<StatProps> = ({ value, suffix, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = value;
    const totalDuration = duration * 1000;
    const increment = end / (totalDuration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.min(Math.floor(start), end));
      
      if (start >= end) clearInterval(timer);
    }, 16);
    
    return () => clearInterval(timer);
  }, [isInView, value, duration]);
  
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2">
        <span className="gradient-text">{count}</span>
        <span className="text-white">{suffix}</span>
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 bg-black relative">
      <div className="absolute inset-0 bg-[url('/images/texture-bg.jpg')] opacity-5 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card py-10 px-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value={500} suffix="+" label="Juegos Disponibles" />
            <Stat value={100000} suffix="+" label="Jugadores Registrados" />
            <Stat value={99} suffix="%" label="Tasa de Pago" />
            <Stat value={24} suffix="/7" label="Soporte" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;