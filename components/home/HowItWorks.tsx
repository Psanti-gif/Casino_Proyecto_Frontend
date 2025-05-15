'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

const steps = [
  {
    id: 1,
    title: "Regístrate",
    description: "Crea una cuenta en menos de 2 minutos con nuestro sencillo proceso de registro",
    icon: "/images/icons/signup.svg"
  },
  {
    id: 2,
    title: "Deposita",
    description: "Realiza un depósito utilizando uno de nuestros métodos de pago seguros",
    icon: "/images/icons/deposit.svg"
  },
  {
    id: 3,
    title: "Obtén Bono",
    description: "Reclama tu bono de bienvenida y disfruta de fondos extra para jugar",
    icon: "/images/icons/bonus.svg"
  },
  {
    id: 4,
    title: "Juega y Gana",
    description: "Juega tus juegos favoritos y gana premios en dinero real",
    icon: "/images/icons/win.svg"
  }
];

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <section className="section-padding bg-black relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-casino-dark to-transparent"></div>
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute right-0 top-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Cómo <span className="gradient-text">Funciona</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comenzar en Casino Royal es rápido y fácil. Sigue estos sencillos pasos para iniciar tu experiencia de juego.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="glass-card p-6 text-center flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 flex items-center justify-center bg-casino-light rounded-full mb-4 relative">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={40}
                    height={40}
                    className="relative z-10"
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%+16px)] w-[calc(100%-64px)] h-0.5 bg-gradient-to-r from-primary/50 to-transparent">
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;