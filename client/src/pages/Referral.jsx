import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Build the full referral URL for sharing
const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://127.0.0.1:5173'
  : 'https://techdecoderlab.onrender.com';

export default function Referral() {
  const { user, loading, referralCode, referrals, setReferrals } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = referralCode ? `${BASE_URL}/register?ref=${referralCode}` : null;

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareMessage = (link) => `\u{1F680} Stuck with your Final Year Project?

Have an idea but don\u2019t know how to start or need expert guidance for development, AI, documentation, PPTs, or deployment?

Tech Decoder helps students build real projects with proper mentorship and support.

Use my referral link to get an additional discount \u{1F447}  
\u{1F517} ${link}`;

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(getShareMessage(referralLink));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
              <>
                {/* Referral Code */}
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">Referral Code</p>
                <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-4 rounded relative mb-4">
                  <code className="font-mono text-primary text-lg tracking-wider">
                    {referralCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
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

                {/* Full Referral Link */}
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">Shareable Link</p>
                <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-4 rounded relative">
                  <span className="font-mono text-on-surface-variant text-xs truncate max-w-[200px]">
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center cursor-pointer p-1 active:scale-90 ml-2 flex-shrink-0"
                    aria-label="Copy link to clipboard"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {copiedLink ? 'check' : 'link'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {copiedLink && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -30, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 bg-primary text-on-primary text-xs px-2 py-1 rounded shadow-md font-sans"
                      >
                        Message Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Share buttons */}
                <div className="mt-6 border-t border-white/5 pt-5">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">Share via</p>
                  <div className="flex flex-wrap items-center gap-3">

                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareMessage(referralLink))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition-all active:scale-95 text-sm font-medium"
                      aria-label="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>

                    {/* SMS / iMessage */}
                    <a
                      href={`sms:?body=${encodeURIComponent(getShareMessage(referralLink))}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34C759]/10 border border-[#34C759]/30 text-[#34C759] hover:bg-[#34C759]/20 transition-all active:scale-95 text-sm font-medium"
                      aria-label="Share via SMS or iMessage"
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>sms</span>
                      Message
                    </a>

                    {/* Instagram — copies link first, then opens DM inbox */}
                    <a
                      href="https://www.instagram.com/direct/inbox/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E1306C]/10 border border-[#E1306C]/30 text-[#E1306C] hover:bg-[#E1306C]/20 transition-all active:scale-95 text-sm font-medium"
                      aria-label="Share on Instagram DM"
                      title="Message will be copied — paste it in Instagram DM"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagram
                    </a>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/50 mt-2.5">
                    Instagram: message is auto-copied to clipboard — paste it in your DM.
                  </p>
                </div>
              </>
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
                    state={{ tab: 'register' }}
                    className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-wider text-center glow-button btn-shimmer hover:opacity-90 transition-all active:scale-95"
                  >
                    Register for Free
                  </Link>
                  <Link
                    to="/login"
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
