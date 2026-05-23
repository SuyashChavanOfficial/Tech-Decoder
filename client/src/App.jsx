import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Referral from './pages/Referral';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { loading } = useAuth();

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
    <div className="antialiased min-h-screen flex flex-col bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container relative">
      {/* Ambient background light leaks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container/5 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

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