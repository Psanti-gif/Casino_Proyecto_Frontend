'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "James Wilson",
    location: "London, UK",
    avatar: "/images/testimonials/avatar1.jpg",
    quote: "I've been a member of Casino Royal for over a year now, and I'm constantly impressed by the game selection and quick payouts. Their VIP program is exceptional!",
    rating: 5,
    won: "$15,000 on Mega Moolah"
  },
  {
    id: 2,
    name: "Maria Garcia",
    location: "Madrid, Spain",
    avatar: "/images/testimonials/avatar2.jpg",
    quote: "The live dealer games are outstanding! It feels just like being in a real casino. Customer service is always helpful and professional.",
    rating: 5,
    won: "$8,500 on Blackjack"
  },
  {
    id: 3,
    name: "Thomas Schmidt",
    location: "Berlin, Germany",
    avatar: "/images/testimonials/avatar3.jpg",
    quote: "Casino Royal's mobile platform is perfect for gaming on the go. The interface is intuitive, and games load quickly. I especially love the weekly tournaments.",
    rating: 4,
    won: "$12,750 on Roulette"
  },
  {
    id: 4,
    name: "Sophie Laurent",
    location: "Paris, France",
    avatar: "/images/testimonials/avatar4.jpg",
    quote: "What impressed me the most is how fast the withdrawals are processed. The game variety keeps me coming back, and the bonuses are generous and fair.",
    rating: 5,
    won: "$22,400 on Progressive Slots"
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-casino-dark relative">
      {/* Decorative chip elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <Image src="/images/elements/chip-red.png" alt="Chip" width={80} height={80} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Image src="/images/elements/chip-gold.png" alt="Chip" width={60} height={60} />
      </div>

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Winner</span> Stories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from our community of players who have experienced the thrill 
            of winning big at Casino Royal.
          </p>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 1
            },
            768: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            },
          }}
          className="testimonials-swiper pb-12"
        >
          {testimonials.map(testimonial => (
            <SwiperSlide key={testimonial.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card p-6 min-h-[320px] flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </div>

                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-secondary' : 'text-gray-600'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-300 italic mb-4 flex-grow">
                  "{testimonial.quote}"
                </blockquote>

                <div className="bg-casino-light rounded-lg p-3 mt-auto">
                  <p className="text-sm font-medium text-secondary">
                    <span className="text-primary mr-1">💰</span> Won {testimonial.won}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;