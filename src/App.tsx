import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthModalContainer } from './components/auth/AuthModalContainer';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { StatsBar } from './components/home/StatsBar';
import { CategoriesSection } from './components/home/CategoriesSection';
import { FeaturedCourses } from './components/home/FeaturedCourses';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { TopInstructors } from './components/home/TopInstructors';
import { SpecialOffer } from './components/home/SpecialOffer';
import { Testimonials } from './components/home/Testimonials';
import { FaqSection } from './components/home/FaqSection';
import { CtaBanner } from './components/home/CtaBanner';
import { Footer } from './components/layout/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AuthProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-dark-bg text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 selection:bg-[var(--primary-600)] selection:text-white`}>
        {/* 🧭 Header Navbar */}
        <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        
        {/* 🚀 Main Homepage Content */}
        <main>
          <HeroSection />
          <StatsBar />
          <CategoriesSection />
          <FeaturedCourses />
          <WhyChooseUs />
          <TopInstructors />
          <SpecialOffer />
          <Testimonials />
          <FaqSection />
          <CtaBanner />
        </main>

        {/* 🏁 Footer */}
        <Footer />

        {/* 🔐 Auth Modals (Login, Register, Forgot Password) */}
        <AuthModalContainer />
      </div>
    </AuthProvider>
  );
}
