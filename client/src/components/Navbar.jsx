import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20">
          {/* Logo */}
          <a 
            href="/"
            onClick={handleLogoClick}
            className="font-headline-md text-headline-md text-primary tracking-tighter cursor-pointer hover:opacity-90"
          >
            Tech Decoder
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
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `font-body-md text-body-md transition-colors duration-300 pb-1 ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`
              }
            >
              Dashboard
            </NavLink>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-on-surface font-label-sm text-label-sm">{user.name}</span>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-wider active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-on-surface-variant hover:text-on-surface transition-colors font-label-sm text-label-sm uppercase tracking-wider"
                >
                  Login
                </Link>
                <button 
                  onClick={() => setConsultationOpen(true)}
                  className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer hover:opacity-90 transition-all active:scale-95"
                >
                  Get Started
                </button>
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
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 w-full absolute top-20 left-0 p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
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
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `font-body-md text-body-md py-2 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
              }
            >
              Dashboard
            </NavLink>
            <hr className="border-white/10" />
            <div className="flex flex-col space-y-3 pt-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                    <div>
                      <div className="text-on-surface font-semibold">{user.name}</div>
                      <div className="text-on-surface-variant text-xs">{user.domain}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full py-3 rounded-lg border border-white/10 text-on-surface-variant hover:text-on-surface text-center font-label-sm text-label-sm uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="w-full py-3 rounded-lg border border-white/10 text-on-surface hover:bg-white/5 text-center font-label-sm text-label-sm uppercase tracking-wider"
                  >
                    Login
                  </Link>
                  <button 
                    onClick={() => setConsultationOpen(true)}
                    className="w-full bg-primary text-on-primary py-3 rounded-lg text-center font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Free Consultation Modal */}
      <Modal 
        isOpen={consultationOpen} 
        onClose={() => setConsultationOpen(false)} 
        type="consultation"
      />
    </>
  );
}
