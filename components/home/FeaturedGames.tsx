'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GameCard from '@/components/ui/GameCard';

type GameCategory = 'all' | 'slots' | 'table' | 'live' | 'popular';

const games = [
  {
    id: 1,
    name: "Fortuna Tigre",
    image: "/images/games/slots/slot1.jpg",
    category: "slots",
    provider: "Pragmatic Play",
    rtp: "96.5%",
    isNew: true,
    isHot: true,
  },
  {
    id: 2,
    name: "Blackjack Pro",
    image: "/images/games/table/blackjack.jpg",
    category: "table",
    provider: "Evolution Gaming",
    rtp: "99.2%",
    isNew: false,
    isHot: true,
  },
  {
    id: 3,
    name: "Ruleta Europea",
    image: "/images/games/table/roulette.jpg",
    category: "table",
    provider: "NetEnt",
    rtp: "97.3%",
    isNew: false,
    isHot: false,
  },
  {
    id: 4,
    name: "Wild West Gold",
    image: "/images/games/slots/slot2.jpg",
    category: "slots",
    provider: "Microgaming",
    rtp: "95.8%",
    isNew: true,
    isHot: false,
  },
  {
    id: 5,
    name: "Baccarat en Vivo",
    image: "/images/games/live/baccarat.jpg",
    category: "live",
    provider: "Evolution Gaming",
    rtp: "98.9%",
    isNew: false,
    isHot: true,
  },
  {
    id: 6,
    name: "Mega Moolah",
    image: "/images/games/slots/slot3.jpg",
    category: "slots",
    provider: "Microgaming",
    rtp: "94.5%",
    isNew: false,
    isHot: true,
  },
  {
    id: 7,
    name: "Texas Hold'em",
    image: "/images/games/live/poker.jpg",
    category: "live",
    provider: "PokerStars",
    rtp: "97.8%",
    isNew: false,
    isHot: false,
  },
  {
    id: 8,
    name: "Book of Dead",
    image: "/images/games/slots/slot4.jpg",
    category: "slots",
    provider: "Play'n GO",
    rtp: "96.2%",
    isNew: false,
    isHot: true,
  },
];

const FeaturedGames = () => {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');

  const filteredGames = activeCategory === 'all' 
    ? games 
    : activeCategory === 'popular' 
      ? games.filter(game => game.isHot) 
      : games.filter(game => game.category === activeCategory);

  const categories = [
    { id: 'all', name: 'Todos los Juegos' },
    { id: 'popular', name: 'Populares' },
    { id: 'slots', name: 'Tragamonedas' },
    { id: 'table', name: 'Juegos de Mesa' },
    { id: 'live', name: 'Casino en Vivo' },
  ];

  return (
    <section className="section-padding bg-casino-dark relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
      
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Juegos</span> Destacados
            </h2>
            <p className="text-gray-400 max-w-md">No te pierdas nuestras ofertas por tiempo limitado y bonos diseñados para mejorar tu experiencia de juego.</p>
          </motion.div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-casino-light text-gray-300 hover:bg-casino-highlight'
                }`}
                onClick={() => setActiveCategory(category.id as GameCategory)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="game-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredGames.map(game => (
            <GameCard key={game.id} game ={game} />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/games" className="btn-outline">
            Ver Todos los Juegos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;