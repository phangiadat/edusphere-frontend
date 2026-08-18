import { useState, useEffect } from 'react';
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
import { CourseDetailPage } from './pages/CourseDetailPage';
import { BookOpen, Home } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'course-detail'>('course-detail');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-nestjs-masterclass');

  // Handle Hash route changes (e.g., #course-detail or #home)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#course/')) {
        const id = hash.replace('#course/', '');
        setSelectedCourseId(id);
        setCurrentView('course-detail');
      } else if (hash === '#course-detail') {
        setCurrentView('course-detail');
      } else if (hash === '#home') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AuthProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-dark-bg text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 selection:bg-[var(--primary-600)] selection:text-white relative`}>
        
        {/* Quick View Switcher Bar */}
        <div className="bg-[var(--primary-600)] text-white text-caption-bold py-2 px-4 flex items-center justify-between text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <span>✨ Chế độ xem hiện tại:</span>
            <span className="underline uppercase tracking-wider">
              {currentView === 'course-detail' ? 'Trang Chi tiết Khóa học (Udemy Layout)' : 'Trang chủ EduSphere'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                currentView === 'home'
                  ? 'bg-white text-[var(--primary-600)] font-bold'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Trang chủ
            </button>

            <button
              onClick={() => setCurrentView('course-detail')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                currentView === 'course-detail'
                  ? 'bg-white text-[var(--primary-600)] font-bold'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Xem Chi tiết Khóa học
            </button>
          </div>
        </div>

        {/* 🧭 Header Navbar */}
        <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        
        {/* 🚀 Main Content Switching */}
        <main>
          {currentView === 'home' ? (
            <>
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
            </>
          ) : (
            <CourseDetailPage courseId={selectedCourseId} />
          )}
        </main>

        {/* 🏁 Footer */}
        <Footer />

        {/* 🔐 Auth Modals (Login, Register, Forgot Password) */}
        <AuthModalContainer />
      </div>
    </AuthProvider>
  );
}
