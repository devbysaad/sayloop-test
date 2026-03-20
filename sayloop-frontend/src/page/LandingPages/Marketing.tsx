import React from 'react';
import Navbar from '../../components/modules/landing/Navbar';
import Hero from '../../components/modules/landing/Hero';
import Stats from '../../components/modules/landing/Stats';
import HowItWorks from '../../components/modules/landing/HowItWorks';
import LanguageCarousel from '../../components/modules/landing/LanguageCarousel';
import CTA from '../../components/modules/landing/CTA';
import Footer from '../../components/modules/landing/Footer';

const LandingPage = () => (
  <div style={{ background: '#F8F5EF' }}>
    <Navbar />
    <Hero />
    <Stats />
    <HowItWorks />
    <LanguageCarousel />
    <CTA />
    <Footer />
  </div>
);

export default LandingPage;