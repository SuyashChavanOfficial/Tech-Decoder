import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MouseGlow from './components/MouseGlow';

import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Referral from './pages/Referral';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import BookConsultation from './pages/BookConsultation';
import NotFound from './pages/NotFound';

import AdminReferrals from './pages/AdminReferrals';

// A premium page transition wrapper that feels like the content is "spreading out"
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex-grow flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
};

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
          <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Decoding Architecture</p>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased min-h-screen flex flex-col text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container relative">
      {/* Ambient background light leaks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container/5 rounded-full blur-[100px]" />
      </div>

      <MouseGlow />

      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/referral" element={<PageTransition><Referral /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          {/* <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} /> */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/book" element={<PageTransition><BookConsultation /></PageTransition>} />
          <Route path="/admin/referrals" element={<PageTransition><AdminReferrals /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;