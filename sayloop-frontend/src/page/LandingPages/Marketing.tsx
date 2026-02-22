import React from 'react';
import Navbar          from '../../components/modules/LandingPage/Navbar';
import Hero            from '../../components/modules/LandingPage/Hero';
import Stats           from '../../components/modules/LandingPage/Stats';
import HowItWorks      from '../../components/modules/LandingPage/HowItWorks';
import LanguageCarousel from '../../components/modules/LandingPage/LanguageCarousel';
import CTA             from '../../components/modules/LandingPage/CTA';
import Footer          from '../../components/modules/LandingPage/Footer';

const LandingPage = () => (
  <div style={{ background: '#fffbf5' }}>
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