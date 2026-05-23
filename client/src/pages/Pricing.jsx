import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Pricing() {
  const { referralCode, referrals, setReferrals } = useAuth();
  const [copied, setCopied] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [activeTier, setActiveTier] = useState(null);

  const tiers = [
    {
      title: 'Basic Guidance',
      price: '499',
      tag: 'Basic Guidance',
      desc: 'Foundation for emerging developers needing architectural direction.',
      features: [
        '2x 1-on-1 Sessions (45 min)',
        'Asynchronous Code Review (Weekly)',
        'Access to Mentorship Community'
      ],
      btnText: 'Book Consultation',
      color: 'text-secondary',
      borderClass: 'border-white/10'
    },
    {
      title: 'Advanced Development',
      price: '999',
      tag: 'Advanced Development',
      desc: 'Deep technical immersion for mid-level engineers scaling systems.',
      features: [
        '4x 1-on-1 Sessions (60 min)',
        'Priority Asynchronous Code Review',
        'System Design Mock Interviews',
        'Direct Slack Access'
      ],
      btnText: 'Book Consultation',
      color: 'text-primary',
      borderClass: 'border-primary/30',
      popular: true
    },
    {
      title: 'Complete End-to-End',
      price: '2,499',
      tag: 'Complete End-to-End',
      desc: 'Bespoke CTO-level guidance for founding engineers and startup leads.',
      features: [
        'Unlimited 1-on-1 Sessions',
        'Real-time Pair Programming',
        'Architecture Review Board',
        'Career Strategy & Negotiation'
      ],
      btnText: 'Book Consultation',
      color: 'text-tertiary',
      borderClass: 'border-white/10'
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBook = (tier) => {
    setActiveTier(tier);
    setConsultationOpen(true);
  };

  const triggerMockReferral = () => {
    setReferrals(prev => prev + 1);
  };

  return (
    <>
      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Pricing Header */}
        <section className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display-xl text-display-xl text-on-surface mb-6 md:text-display-xl text-headline-lg-mobile"
          >
            Investment in Architecture
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-body-lg text-body-lg text-on-surface-variant"
          >
            Select the mentorship tier that aligns with your technical ambition. Transparent pricing for elite engineering guidance.
          </motion.p>
        </section>

        {/* Pricing Cards Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`glass-panel p-8 rounded-xl flex flex-col relative overflow-hidden card-hover transition-colors duration-300 border ${tier.borderClass}`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 font-label-sm text-label-sm rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <span className={`font-label-sm text-label-sm uppercase tracking-wider ${tier.color} mb-2 block`}>
                  {tier.tag}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface md:text-headline-lg text-headline-lg-mobile mb-2">
                  ${tier.price}
                  <span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {tier.desc}
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <span className="material-symbols-outlined text-primary mr-3 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-on-surface text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleBook(tier.title)}
                className={`w-full py-3 rounded font-body-md text-body-md mt-auto cursor-pointer ${
                  tier.popular 
                    ? 'bg-primary text-on-primary font-bold transition-all glow-button' 
                    : 'border border-white/10 text-on-surface hover:bg-white/5 transition-colors'
                }`}
              >
                {tier.btnText}
              </button>
            </motion.div>
          ))}
        </section>

        {/* Separation Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-24" />

        {/* Referral Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="referral-section">
          {/* Referral Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary mb-4 block">
              Decoder Network
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
              Expand the Architecture. Earn Rewards.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Invite peers to elevate their engineering craft. For every engineer who joins an Advanced or Complete tier using your code, earn platform credits and exclusive technical resources.
            </p>
            <div className="glass-panel p-6 rounded-lg mb-8 card-hover transition-colors">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">
                Your Unique Invite Code
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
            </div>
            {/* Mock button to trigger referral increment for demonstration */}
            <button 
              onClick={triggerMockReferral}
              className="text-xs text-on-surface-variant hover:text-primary text-left underline flex items-center gap-1 active:scale-95 w-fit"
            >
              <span className="material-symbols-outlined text-xs">celebration</span>
              Simulate Successful Referral (For Review)
            </button>
          </div>

          {/* Gamified Stats / Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Stat Card 1 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col card-hover transition-colors relative overflow-hidden group">
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
            <div className="glass-panel p-6 rounded-xl flex flex-col card-hover transition-colors relative overflow-hidden group">
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
            <div className="sm:col-span-2 glass-panel p-6 rounded-xl flex items-center justify-between card-hover transition-colors gap-4">
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
          </div>
        </section>
      </main>

      <Modal 
        isOpen={consultationOpen} 
        onClose={() => setConsultationOpen(false)} 
        type="consultation"
      />
    </>
  );
}
