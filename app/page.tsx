'use client';

import Hero from '@/components/home/Hero';
import FeaturedGames from '@/components/home/FeaturedGames';
import Promotions from '@/components/home/Promotions';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import VipSection from '@/components/home/VipSection';
import LiveCasinoSection from '@/components/home/LiveCasinoSection';
import StatsSection from '@/components/home/StatsSection';
import Cta from '@/components/home/Cta';
import NewsletterSection from '@/components/home/NewletterSection';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10">
        <FeaturedGames />
        <Promotions />
        <HowItWorks />
        <LiveCasinoSection />
        <StatsSection />
        <VipSection />
        <Testimonials />
        <Cta />
        <NewsletterSection />
      </div>
    </>
  );
}