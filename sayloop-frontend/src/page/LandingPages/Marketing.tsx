import React from 'react';
import Navbar from '../../components/modules/LandingPage/Navbar';
import Hero from '../../components/modules/LandingPage/Hero';
import BentoGrid from '../../components/modules/LandingPage/BentoGrid';
import Stats from '../../components/modules/LandingPage/Stats';
import CTA from '../../components/modules/LandingPage/CTA';
import Footer from '../../components/modules/LandingPage/Footer';

type Props = {}

const Marketing = (props: Props) => {
  return (
    <div className="font-sans antialiased text-[#1A1A1A] bg-[#FFFFFF] selection:bg-[#58CC02] selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <BentoGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default Marketing;