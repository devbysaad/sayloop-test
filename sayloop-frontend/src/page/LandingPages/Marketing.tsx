import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/LandingPage/Hero';
import BentoGrid from '../../components/LandingPage/BentoGrid';
import Stats from '../../components/LandingPage/Stats';
import CTA from '../../components/LandingPage/CTA';
import Footer from '../../components/Footer';

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