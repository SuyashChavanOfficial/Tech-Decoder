import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tiers } from '../data/pricingData';

export default function Pricing() {
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState(null);

  const handleBook = (tier) => {
    setActiveTier(tier);
    navigate(`/book?tier=${encodeURIComponent(tier)}`);
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
            Choose the package that fits your project needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-body-lg text-body-lg text-on-surface-variant"
          >
            Transparent pricing for your project development and submission needs.
          </motion.p>
        </section>

        {/* Pricing Cards Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                  ₹{tier.price}
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
                className={`w-full py-3 rounded font-body-md text-body-md mt-auto cursor-pointer ${tier.popular
                  ? 'bg-primary text-on-primary font-bold transition-all glow-button'
                  : 'border border-white/10 text-on-surface hover:bg-white/5 transition-colors'
                  }`}
              >
                {tier.btnText}
              </button>
              <div className="h-4 mt-2">
                {tier.footnote && (
                  <p className="text-[11px] text-on-surface-variant text-center">
                    {tier.footnote}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </>
  );
}
