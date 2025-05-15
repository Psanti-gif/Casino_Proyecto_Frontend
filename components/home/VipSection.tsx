'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const vipLevels = [
  {
    id: 1,
    name: "Silver",
    image: "/images/vip/silver.jpg",
    perks: ["5% Weekly Cashback", "24/7 Support", "Monthly Bonus", "Birthday Gift"],
    pointsNeeded: 1000
  },
  {
    id: 2,
    name: "Gold",
    image: "/images/vip/gold.jpg",
    perks: ["10% Weekly Cashback", "Personal Account Manager", "Higher Deposit Limits", "Exclusive Promotions", "Birthday Gift"],
    pointsNeeded: 5000
  },
  {
    id: 3,
    name: "Platinum",
    image: "/images/vip/platinum.jpg",
    perks: ["15% Weekly Cashback", "VIP Account Manager", "Personalized Offers", "Faster Withdrawals", "Exclusive Events", "Luxury Gifts"],
    pointsNeeded: 20000
  },
  {
    id: 4,
    name: "Diamond",
    image: "/images/vip/diamond.jpg",
    perks: ["20% Weekly Cashback", "Private VIP Host", "Unlimited Withdrawals", "Exclusive High Roller Tables", "Luxury Vacation Packages", "Personalized Birthday Gift"],
    pointsNeeded: 50000
  }
];

const VipSection = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const currentVip = vipLevels.find(level => level.id === activeLevel) || vipLevels[0];

  const handleTabClick = (id: number) => {
    setActiveLevel(id);
  };

  return (
    <section className="section-padding relative bg-casino-dark py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/vip/vip-bg.jpg"
          alt="VIP Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-casino-dark via-casino-dark/90 to-casino-dark/70"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">VIP</span> Program
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join our VIP program and enjoy exclusive benefits, personalized offers, 
            and premium service. The more you play, the more rewards you get.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="glass-card p-6 md:p-8 h-full">
              <div 
                ref={tabContainerRef}
                className="flex mb-6 overflow-x-auto hide-scrollbar gap-2"
              >
                {vipLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => handleTabClick(level.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      activeLevel === level.id
                        ? 'bg-primary text-white'
                        : 'bg-casino-light text-gray-300 hover:bg-casino-highlight'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="relative h-64 md:h-80 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={currentVip.image}
                      alt={currentVip.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg mb-2">
                        <h3 className="text-2xl md:text-3xl font-bold">
                          <span className="gradient-text">{currentVip.name}</span> Level
                        </h3>
                      </div>
                      <p className="text-sm md:text-base text-white">
                        {currentVip.pointsNeeded.toLocaleString()} points needed
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold mb-4">Level Benefits:</h4>
                  <ul className="space-y-3 mb-6">
                    {currentVip.perks.map((perk, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-gray-300"
                      >
                        <div className="mr-3 text-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        {perk}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="glass-card p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6">How Our VIP Program Works</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Play and Earn Points</h4>
                    <p className="text-gray-400">Every bet you place on our games earns you loyalty points. The more you play, the faster you'll climb our VIP tiers.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Unlock VIP Levels</h4>
                    <p className="text-gray-400">As you collect points, you'll unlock higher VIP tiers automatically, each with better rewards and perks.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Enjoy Exclusive Benefits</h4>
                    <p className="text-gray-400">Higher cashback, personalized offers, faster withdrawals, dedicated account managers, and VIP-only tournaments.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Maintain Your Status</h4>
                    <p className="text-gray-400">Once you reach a VIP level, you keep it for the current and following month. Stay active to maintain your elite status.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/vip" className="btn-primary w-full text-center">
                  Learn More About VIP Benefits
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VipSection;