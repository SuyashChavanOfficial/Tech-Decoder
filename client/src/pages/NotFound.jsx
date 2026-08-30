import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-margin-mobile relative overflow-hidden">
      {/* Background glow leaks */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-error/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center relative z-10"
      >
        <div className="glass-panel p-10 rounded-2xl w-full flex flex-col items-center gap-6 shadow-2xl border border-white/10 relative">
          
          {/* Big Error Display */}
          <div className="relative">
            <h1 className="font-display-xl text-[120px] font-bold text-gradient leading-none tracking-tighter select-none">
              404
            </h1>
            <div className="absolute -inset-2 bg-primary/10 rounded-xl blur-lg pointer-events-none z-[-1]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-headline-md text-headline-md text-on-surface">Decode Failure</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              The page you are looking for has been relocated or does not exist.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-label-sm text-label-sm uppercase tracking-wider glow-button hover:opacity-90 transition-all cursor-pointer mt-4"
          >
            Back to Home
          </button>
        </div>
      </motion.section>
    </main>
  );
}
