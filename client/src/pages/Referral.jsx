import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReferralShare from '../components/ReferralShare';

export default function Referral() {
  const { user, loading, referralCode, referrals, setReferrals } = useAuth();
  const location = useLocation();

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

            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
              Your Invitation Link
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Share this invite link with developers in your network to grant them custom perks upon registration.
            </p>

            {/* Loading state — wait for auth before showing either view */}
            {loading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3" />
                <div className="h-14 bg-white/5 rounded" />
                <div className="h-4 bg-white/5 rounded w-1/3 mt-2" />
                <div className="h-14 bg-white/5 rounded" />
              </div>
            ) : referralCode ? (
              /* ── Authenticated: Show the real code and link ── */
              <ReferralShare referralCode={referralCode} />
            ) : (
              /* ── Guest: Locked state — prompt to register ── */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center py-4"
              >
                {/* Blurred fake code */}
                <div className="w-full flex items-center justify-between bg-surface-container-low border border-white/5 p-4 rounded mb-6 select-none relative overflow-hidden">
                  <code className="font-mono text-primary text-lg tracking-wider blur-sm select-none">
                    ARCH-XXXX-XXXX
                  </code>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant blur-sm">content_copy</span>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-surface-container-high/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      <span className="text-xs text-on-surface font-semibold">Members Only</span>
                    </div>
                  </div>
                </div>

                <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                  Create a free account to get your unique referral link and start earning credits.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    to="/login"
                    state={{ from: location.pathname, tab: 'register' }}
                    className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-wider text-center glow-button btn-shimmer hover:opacity-90 transition-all active:scale-95"
                  >
                    Register for Free
                  </Link>
                  <Link
                    to="/login"
                    state={{ from: location.pathname }}
                    className="flex-1 py-3 rounded-lg border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-label-sm text-label-sm uppercase tracking-wider text-center transition-all"
                  >
                    Login
                  </Link>
                </div>
              </motion.div>
            )}
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
          <div className={`glass-panel p-6 rounded-xl flex flex-col card-hover transition-colors relative overflow-hidden group border border-white/10 ${!user ? 'opacity-50' : ''}`}>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="material-symbols-outlined text-primary mb-4 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              group_add
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
              {user ? referrals : '—'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Successful Referrals
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className={`glass-panel p-6 rounded-xl flex flex-col card-hover transition-colors relative overflow-hidden group border border-white/10 ${!user ? 'opacity-50' : ''}`}>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="material-symbols-outlined text-primary mb-4 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
              {user ? `$${referrals * 100}` : '—'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Credits Earned
            </p>
          </div>

          {/* Reward Info Card */}
          <div className={`sm:col-span-2 glass-panel p-6 rounded-xl flex items-center justify-between card-hover transition-colors gap-4 border border-white/10 ${!user ? 'opacity-50' : ''}`}>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  workspace_premium
                </span>
              </div>
              <div>
                <h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">
                  {user
                    ? (referrals >= 5 ? 'Milestone Achieved!' : 'Next Milestone: 5 Referrals')
                    : 'Unlock Milestones'}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  {user
                    ? (referrals >= 5
                      ? 'You have unlocked the exclusive System Design Case Studies!'
                      : 'Unlock access to exclusive System Design Case Studies.')
                    : 'Register to track your referral milestones and earn rewards.'}
                </p>
              </div>
            </div>
            <div className="hidden sm:block flex-shrink-0 w-32">
              <div className="w-32 h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: user ? `${Math.min(100, (referrals / 5) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
