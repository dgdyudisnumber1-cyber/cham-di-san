import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import HeritageMap from './components/HeritageMap';
import FeaturedLocations from './components/FeaturedLocations';
import HowItWorks from './components/HowItWorks';
import ArtisanSpotlight from './components/ArtisanSpotlight';
import ContributeCTA from './components/ContributeCTA';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const id = state.scrollTo;
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location.state]);

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <HeritageMap />
        <FeaturedLocations />
        <HowItWorks />
        <ArtisanSpotlight />
        <ContributeCTA />
      </main>
      <Footer />
    </div>
  );
}