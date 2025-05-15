'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (!email.includes('@')) {
        setError('Por favor, introduce una dirección de correo electrónico válida');
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
      }, 3000);
    }, 1000);
  };

  return (
    <section className="bg-casino-dark py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card max-w-4xl mx-auto p-8 md:p-10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Suscríbete a Nuestro Boletín</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Mantente actualizado con los últimos juegos, promociones exclusivas y ofertas especiales. 
            ¡Suscríbete ahora y obtén un <span className="text-secondary">bono gratis de $10</span> en tu próximo depósito!
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu dirección de email"
                className="flex-grow px-4 py-3 rounded-md bg-casino-light border border-casino-highlight focus:outline-none focus:border-primary text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn-primary py-3 px-6 whitespace-nowrap"
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? 'Suscribiendo...' : isSuccess ? '¡Suscrito!' : 'Suscribirse'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            {isSuccess && <p className="mt-2 text-green-500 text-sm">¡Gracias por suscribirte!</p>}
            
            <p className="mt-4 text-xs text-gray-500">
              Al suscribirte, aceptas recibir emails de marketing de nuestra parte. 
              Puedes darte de baja en cualquier momento.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;