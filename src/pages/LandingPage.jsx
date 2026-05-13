import React from 'react'
import LandingPageHeader from '../components/LandingPageHeader.jsx';
import HeroSection from '../components/homeIndex/HeroSection.jsx';
import ProcessStages from '../components/homeIndex/ProcessStages.jsx';
import WhyWasha from '../components/homeIndex/WhyWasha.jsx';
import CtaSection from '../components/homeIndex/Cta-section.jsx';
import Footer from '../components/homeIndex/Footer-washa.jsx';

const LandingPage = () => {

  return (
    <div>
        <LandingPageHeader />
        <HeroSection />

        <ProcessStages />
        <WhyWasha />
        <CtaSection />
        <Footer />
    </div>
  )
}

export default LandingPage
