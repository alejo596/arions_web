import React, { useState } from 'react';
import { InitialSplashLoader } from '../../components/common/InitialSplashLoader';
import { HeroSection } from '../../components/public/HeroSection';
import { AboutSection } from '../../components/public/AboutSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ProjectsSection } from '../../components/public/ProjectsSection';
import { NewsSection } from '../../components/public/NewsSection';
import { ClientsSection } from '../../components/public/ClientsSection';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { StatsSection } from '../../components/public/StatsSection';
import { ContactSection } from '../../components/public/ContactSection';

export const HomePage: React.FC = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      {!loadingComplete && (
        <InitialSplashLoader onLoadingComplete={() => setLoadingComplete(true)} minDurationMs={3500} />
      )}
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <StatsSection />
      <NewsSection />
      <ClientsSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
};

