import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Automatically store referral code and redirect to dedicated booking page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      sessionStorage.setItem('referralCode', ref);
      navigate(`/book?ref=${ref}`, { replace: true });
    }
  }, [location.search, navigate]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (path, hash) => {
    if (location.pathname === path && hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20">
          {/* Logo */}
          <a 
            href="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-2 font-headline-md text-headline-md text-primary tracking-tighter cursor-pointer hover:opacity-90"
          >
            <img src={logo} alt="Tech Decoder Logo" className="h-8 w-auto object-contain" />
            <span className="hidden md:inline">Tech Decoder</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-body-md text-body-md transition-colors duration-300 pb-1 ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `font-body-md text-body-md transition-colors duration-300 pb-1 ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`
              }
            >
              Mentorship
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => 
                `font-body-md text-body-md transition-colors duration-300 pb-1 ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`
              }
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/referral" 
              className={({ isActive }) => 
                `font-body-md text-body-md transition-colors duration-300 pb-1 ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`
              }
            >
              Referral
            </NavLink>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative profile-dropdown-container">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all active:scale-95 focus:outline-none border border-transparent hover:border-white/5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-on-surface font-label-sm text-label-sm max-w-[120px] truncate">{user.name}</span>
                  <span className={`material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </button>
                
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/10 py-2 shadow-2xl z-50 overflow-hidden"
                    >

                      <button 
                        onClick={() => { setProfileDropdownOpen(false); logout(); navigate('/'); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  state={{ from: location.pathname }}
                  className="text-on-surface-variant hover:text-on-surface transition-colors font-label-sm text-label-sm uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link 
                  to="/book"
                  className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer hover:opacity-90 transition-all active:scale-95 text-center flex items-center justify-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary focus:outline-none"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden bg-[#13161e]/98 border-t border-b border-white/10 w-full absolute top-20 left-0 shadow-2xl overflow-hidden origin-top z-50"
            >
              <div className="p-6 flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-body-md text-body-md py-2 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `font-body-md text-body-md py-2 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
              }
            >
              Mentorship
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => 
                `font-body-md text-body-md py-2 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
              }
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/referral" 
              className={({ isActive }) => 
                `font-body-md text-body-md py-2 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
              }
            >
              Referral
            </NavLink>
            <hr className="border-white/10" />
            <div className="flex flex-col space-y-3 pt-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 py-2 border-b border-white/5 pb-4 mb-2">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                    <div>
                      <div className="text-on-surface font-semibold">{user.name}</div>
                      <div className="text-on-surface-variant text-xs">{user.domain}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                    className="w-full py-3 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center space-x-3 font-label-sm text-label-sm uppercase tracking-wider cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    state={{ from: location.pathname }}
                    className="w-full py-3 rounded-lg border border-white/10 text-on-surface hover:bg-white/5 text-center font-label-sm text-label-sm uppercase tracking-wider"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/book"
                    className="w-full bg-primary text-on-primary py-3 rounded-lg text-center font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer block"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

    </>
  );
}
