import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full py-12 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-8 px-margin-mobile md:px-margin-desktop">
        <div className="col-span-1 md:col-span-1">
          <div className="font-headline-md text-headline-md text-on-surface mb-4">Tech Decoder</div>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            Building the next generation of technical architects.
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-2">Legal</span>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Privacy Policy</Link>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Terms of Service</Link>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Cookie Policy</Link>
        </div>
        <div className="flex flex-col space-y-3">
          <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-2">Support</span>
          <Link to="/contact" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Contact Us</Link>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">FAQ</Link>
        </div>
        <div className="flex flex-col space-y-3">
          <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-2">Platforms</span>
          <Link to="/contact" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Contact</Link>
          <Link to="/about" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Mentorship</Link>
          <Link to="/pricing" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm">Pricing Plans</Link>
        </div>
        
        <div className="col-span-1 md:col-span-4 mt-8 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center text-on-surface-variant text-sm">
          <p>© {new Date().getFullYear()} Tech Decoder. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-xs opacity-60">Engineered with precision for elite tech mentors.</p>
        </div>
      </div>
    </footer>
  );
}
