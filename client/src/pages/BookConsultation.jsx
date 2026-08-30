import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import InteractiveGlowCard from '../components/InteractiveGlowCard';

export default function BookConsultation() {
  const { user, bookConsultation } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    college: '',
    email: '',
    projectDescription: '',
    hasReferral: false,
    referralCode: '',
    plan: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const planOptions = [
    { value: '', label: '-- No Specific Plan --' },
    { value: 'Basic Project', label: 'Basic Project - ₹10,000' },
    { value: 'Priority Project', label: 'Priority Project - ₹12,000' },
    { value: 'Complete Project Package', label: 'Complete Project Package - ₹14,999' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Check URL parameters first, fallback to sessionStorage for referral code
    const urlRef = searchParams.get('ref') || sessionStorage.getItem('referralCode') || '';
    const tier = searchParams.get('tier') || '';

    setFormData({
      name: user?.name || '',
      whatsapp: '',
      college: '',
      email: user?.email || '',
      projectDescription: '',
      hasReferral: false,
      referralCode: urlRef.toUpperCase(),
      plan: tier ? decodeURIComponent(tier) : ''
    });
  }, [user, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      name: formData.name,
      whatsapp: formData.whatsapp,
      college: formData.college,
      email: formData.email,
      projectDescription: formData.projectDescription,
      referralCode: formData.hasReferral ? formData.referralCode : '',
      plan: formData.plan
    };
    bookConsultation(submissionData);
    setSubmitted(true);
  };

  return (
    <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-margin-mobile relative overflow-hidden">
      {/* Background glow leaks */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <InteractiveGlowCard className="p-8 md:p-10 w-full flex flex-col gap-8 shadow-2xl">
          
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span 
                    className="material-symbols-outlined text-primary text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary mb-3">Session Scheduled!</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
                  Your request has been received. Our team will contact you shortly via WhatsApp to confirm details.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-wider glow-button hover:opacity-90 transition-all cursor-pointer"
                >
                  Back to Home
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Book Free Consultation</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Connect with an industry mentor to map your customized path.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5 mb-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Selected Plan</label>
                    <div className="relative" ref={dropdownRef}>
                      <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all w-full cursor-pointer flex items-center justify-between"
                      >
                        <div className={`flex items-center gap-3 ${formData.plan ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {formData.plan ? (
                            <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          ) : (
                            <div className="w-[20px]"></div>
                          )}
                          <span>
                            {formData.plan ? planOptions.find(p => p.value === formData.plan)?.label || formData.plan : '-- No Specific Plan --'}
                          </span>
                        </div>
                        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </div>
                      
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-[calc(100%+0.5rem)] left-0 w-full rounded-lg border border-white/10 bg-[#1E1E1E] overflow-hidden shadow-2xl z-50 origin-top"
                            style={{ willChange: 'transform, opacity' }}
                          >
                            <div className="flex flex-col">
                              {planOptions.map((option) => (
                                <div
                                  key={option.value}
                                  onClick={() => {
                                    setFormData({ ...formData, plan: option.value });
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors hover:bg-white/10 ${formData.plan === option.value ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface'}`}
                                >
                                  {formData.plan === option.value ? (
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                  ) : (
                                    <div className="w-[20px]"></div>
                                  )}
                                  <span>{option.label}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-label-sm text-label-sm text-on-surface-variant uppercase">Full Name</label>
                    <input 
                      required
                      id="name"
                      name="name"
                      autoComplete="name"
                      type="text" 
                      placeholder="Ada Lovelace"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="whatsapp" className="font-label-sm text-label-sm text-on-surface-variant uppercase">WhatsApp Number</label>
                    <input 
                      required
                      id="whatsapp"
                      name="whatsapp"
                      autoComplete="tel"
                      type="tel" 
                      placeholder="919876543210"
                      maxLength={12}
                      pattern="\d{1,12}"
                      value={formData.whatsapp}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 12) {
                          setFormData({ ...formData, whatsapp: value });
                        }
                      }}
                      className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="college" className="font-label-sm text-label-sm text-on-surface-variant uppercase">College / University</label>
                    <input 
                      required
                      id="college"
                      name="college"
                      autoComplete="organization"
                      type="text" 
                      placeholder="IIT Bombay"
                      value={formData.college}
                      onChange={e => setFormData({ ...formData, college: e.target.value })}
                      className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email Address (Optional)</label>
                    <input 
                      id="email"
                      name="email"
                      autoComplete="email"
                      type="email" 
                      placeholder="ada@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Short Project Description (Optional)</label>
                    <textarea 
                      rows="3"
                      placeholder="Briefly describe your final year project idea or guidance needed..."
                      value={formData.projectDescription}
                      onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <input 
                      type="checkbox"
                      id="hasReferralPage"
                      checked={formData.hasReferral}
                      onChange={e => setFormData({ ...formData, hasReferral: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer accent-primary"
                    />
                    <label htmlFor="hasReferralPage" className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none">
                      I have a referral code
                    </label>
                  </div>

                  <AnimatePresence>
                    {formData.hasReferral && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1.5 pt-1">
                          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Referral Code</label>
                          <input 
                            required={formData.hasReferral}
                            type="text" 
                            placeholder="ARCH-XXXX-XXXX"
                            value={formData.referralCode}
                            onChange={e => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                            className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono tracking-wider w-full"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer mt-4 hover:opacity-90 transition-all cursor-pointer"
                  >
                    Schedule Session
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </InteractiveGlowCard>
      </motion.section>
    </main>
  );
}
