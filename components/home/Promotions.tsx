'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const promotions = [
  {
    id: 1,
    title: "Paquete de Bienvenida",
    description: "Obtén hasta $1,000 + 200 Giros Gratis en tus primeros tres depósitos",
    image: "/images/promotions/welcome-bonus.jpg",
    badge: "Nuevos Jugadores",
    expires: "Permanente",
    url: "/promotions/welcome-package"
  },
  {
    id: 2,
    title: "Cashback Semanal",
    description: "Obtén un 15% de cashback todos los jueves sobre tus pérdidas netas",
    image: "/images/promotions/cashback.jpg",
    badge: "Semanal",
    expires: "Jueves",
    url: "/promotions/weekly-cashback"
  },
  {
    id: 3,
    title: "Drops & Wins Diarios",
    description: "Gana una parte de $2,000,000 en nuestra promoción Drops & Wins diarios",
    image: "/images/promotions/daily-drops.jpg",
    badge: "Premios Diarios",
    expires: "31 Dic 2025",
    url: "/promotions/daily-drops"
  },
  {
    id: 4,
    title: "Recomienda a un Amigo",
    description: "Obtén $50 por cada amigo que se registre y realice un depósito",
    image: "/images/promotions/refer-friend.jpg",
    badge: "Ilimitado",
    expires: "Permanente",
    url: "/promotions/refer-friend"
  }
];

const Promotions = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-casino-dark to-black relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Promociones</span> Destacadas
            </h2>
            <p className="text-gray-400 max-w-md">No te pierdas nuestras ofertas por tiempo limitado y bonos diseñados para mejorar tu experiencia de juego.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/promotions" className="btn-outline">
              Ver Todas las Promociones
            </Link>
          </motion.div>
        </div>
        
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }}
          className="promotions-swiper"
        >
          {promotions.map(promo => (
            <SwiperSlide key={promo.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card overflow-hidden h-[400px] card-hover"
              >
                <div className="relative h-[200px]">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 rounded-bl-md font-medium text-sm">
                    {promo.badge}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-gray-400 mb-4">{promo.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Expira: <span className="text-secondary">{promo.expires}</span>
                    </div>
                    <Link href={promo.url} className="text-primary hover:text-primary-light font-medium transition-colors">
                      Reclamar Ahora →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Promotions;