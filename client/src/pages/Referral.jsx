import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Referral() {
  const { referralCode, referrals, setReferrals } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerMockReferral = () => {
    setReferrals(prev => prev + 1);
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Referral Header */}
      <section className="text-center mb-24 max-w-3xl mx-auto">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.5 }}
          className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-4 block"
        >
          Decoder Network
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display-xl text-display-xl text-on-surface mb-6 md:text-display-xl text-headline-lg-mobile"
        >
          Expand the Architecture
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-body-lg text-body-lg text-on-surface-variant"
        >
          Invite peers to elevate their engineering craft. For every engineer who joins an Advanced or Complete tier using your code, earn platform credits and exclusive technical resources.
        </motion.p>
      </section>

      {/* Referral Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Referral Info Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div className="glass-panel p-8 rounded-xl card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Your Invitation Link</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Share this invite code with developers in your network to grant them custom perks upon registration.
            </p>
            <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-4 rounded relative">
              <code className="font-mono text-primary text-lg tracking-wider">
                {referralCode}
              </code>
              <button 
                onClick={handleCopy}
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center cursor-pointer p-1 active:scale-90"
                aria-label="Copy code to clipboard"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -30, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 bg-primary text-on-primary text-xs px-2 py-1 rounded shadow-md font-sans"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Simulation trigger */}
            <div className="mt-6 border-t border-white/5 pt-4">
              <button 
                onClick={triggerMockReferral}
                className="text-xs text-on-surface-variant hover:text-primary text-left underline flex items-center gap-1 active:scale-95 w-fit cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">celebration</span>
                Simulate Successful Referral (For Review)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Gamified Stats / Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Stat Card 1 */}
          <div className="glass-panel p-6 rounded-xl flex flex-col card-hover transition-colors relative overflow-hidden group border border-white/10">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="material-symbols-outlined text-primary mb-4 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              group_add
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
              {referrals}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Successful Referrals
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className="glass-panel p-6 rounded-xl flex flex-col card-hover transition-colors relative overflow-hidden group border border-white/10">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="material-symbols-outlined text-primary mb-4 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
              ${referrals * 100}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Credits Earned
            </p>
          </div>

          {/* Reward Info Card */}
          <div className="sm:col-span-2 glass-panel p-6 rounded-xl flex items-center justify-between card-hover transition-colors gap-4 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  workspace_premium
                </span>
              </div>
              <div>
                <h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">
                  {referrals >= 5 ? 'Milestone Achieved!' : `Next Milestone: 5 Referrals`}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  {referrals >= 5 
                    ? 'You have unlocked the exclusive System Design Case Studies!' 
                    : 'Unlock access to exclusive System Design Case Studies.'}
                </p>
              </div>
            </div>
            <div className="hidden sm:block flex-shrink-0 w-32">
              <div className="w-32 h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (referrals / 5) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
