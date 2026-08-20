import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
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
import { ShoppingCartPage } from './pages/ShoppingCartPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { MyCoursesPage } from './pages/MyCoursesPage';
import { CourseLearnPage } from './pages/CourseLearnPage';
import { StudentChatWidget } from './components/common/chat/StudentChatWidget';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'course-detail' | 'cart' | 'payment-success' | 'my-courses' | 'learn'>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-nestjs-masterclass');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle Hash & URL route changes (e.g., #cart, #payment-success, #my-courses, #learn/xyz, #course/xyz)
  useEffect(() => {
    const handleHashChange = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      if (hash === '#payment-success' || pathname.includes('/payment/success')) {
        setCurrentView('payment-success');
      } else if (hash === '#my-courses') {
        setCurrentView('my-courses');
      } else if (hash === '#cart') {
        setCurrentView('cart');
      } else if (hash.startsWith('#learn/')) {
        const id = hash.replace('#learn/', '');
        setSelectedCourseId(id);
        setCurrentView('learn');
      } else if (hash.includes('/learn')) {
        const id = hash.replace('#course/', '').replace('/learn', '');
        setSelectedCourseId(id);
        setCurrentView('learn');
      } else if (hash.startsWith('#course/')) {
        const id = hash.replace('#course/', '');
        setSelectedCourseId(id);
        setCurrentView('course-detail');
      } else if (hash === '#course-detail') {
        setCurrentView('course-detail');
      } else {
        // Default to home view if hash is empty (""), #, #home, or #courses
        setCurrentView('home');
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigateToCart = () => {
    window.location.hash = '#cart';
    setCurrentView('cart');
  };

  const navigateHome = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    window.location.hash = '#home';
    setCurrentView('home');
  };

  const navigateToMyCourses = () => {
    window.location.hash = '#my-courses';
    setCurrentView('my-courses');
  };

  const navigateToPaymentSuccess = () => {
    window.location.hash = '#payment-success';
    setCurrentView('payment-success');
  };

  const navigateToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    window.location.hash = `#course/${courseId}`;
    setCurrentView('course-detail');
  };

  const navigateToLearn = (courseId: string) => {
    setSelectedCourseId(courseId);
    window.location.hash = `#learn/${courseId}`;
    setCurrentView('learn');
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  const handleSearchCourse = (query: string) => {
    setSearchQuery(query);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  return (
    <CartProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-dark-bg text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 selection:bg-[var(--primary-600)] selection:text-white relative`}>
        
        {/* 🧭 Header Navbar (Hidden when in CourseLearn workspace) */}
        {currentView !== 'learn' && (
          <Navbar 
            darkMode={darkMode} 
            onToggleDarkMode={toggleDarkMode} 
            onNavigateCart={navigateToCart}
            onSelectCategory={handleSelectCategory}
            onSearchCourse={handleSearchCourse}
          />
        )}
        
        {/* 🚀 Main Content Switching */}
        <main>
          {currentView === 'home' ? (
            <>
              <HeroSection 
                onExploreCourses={handleClearCategoryFilter}
                onSearchCourse={handleSearchCourse}
              />
              <StatsBar />
              <CategoriesSection 
                onSelectCategory={handleSelectCategory}
              />
              <FeaturedCourses 
                selectedCategory={selectedCategory}
                onClearCategoryFilter={handleClearCategoryFilter}
                searchQuery={searchQuery}
              />
              <WhyChooseUs />
              <TopInstructors />
              <SpecialOffer />
              <Testimonials />
              <FaqSection />
              <CtaBanner />
            </>
          ) : currentView === 'cart' ? (
            <ShoppingCartPage 
              onNavigateToCourse={navigateToCourse}
              onNavigateHome={navigateHome}
              onNavigateSuccess={navigateToPaymentSuccess}
            />
          ) : currentView === 'payment-success' ? (
            <PaymentSuccessPage 
              onNavigateMyCourses={navigateToMyCourses}
              onNavigateHome={navigateHome}
            />
          ) : currentView === 'my-courses' ? (
            <MyCoursesPage 
              onNavigateToCourse={navigateToLearn}
              onNavigateHome={navigateHome}
            />
          ) : currentView === 'learn' ? (
            <CourseLearnPage 
              courseId={selectedCourseId}
              onNavigateMyCourses={navigateToMyCourses}
            />
          ) : (
            <CourseDetailPage 
              courseId={selectedCourseId} 
              onNavigateCart={navigateToCart}
              onNavigateHome={navigateHome}
            />
          )}
        </main>

        {/* 🏁 Footer (Hidden when in CourseLearn workspace) */}
        {currentView !== 'learn' && <Footer />}

        {/* 🔐 Auth Modals (Login, Register, Forgot Password) */}
        <AuthModalContainer />

        {/* 💬 Student Floating Realtime Chat Widget */}
        <StudentChatWidget />
      </div>
    </CartProvider>
  );
}
