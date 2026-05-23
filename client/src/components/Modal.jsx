import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Modal({ isOpen, onClose, type = 'alert', title, message, onConfirm }) {
  const { user, bookConsultation } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    college: '',
    email: '',
    projectDescription: '',
    hasReferral: false,
    referralCode: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get('ref') || '';

      setFormData({
        name: user?.name || '',
        whatsapp: '',
        college: '',
        email: user?.email || '',
        projectDescription: '',
        hasReferral: !!urlRef,
        referralCode: urlRef.toUpperCase()
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      name: formData.name,
      whatsapp: formData.whatsapp,
      college: formData.college,
      email: formData.email,
      projectDescription: formData.projectDescription,
      referralCode: formData.hasReferral ? formData.referralCode : ''
    };
    bookConsultation(submissionData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        whatsapp: '',
        college: '',
        email: '',
        projectDescription: '',
        hasReferral: false,
        referralCode: ''
      });
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative glass-panel w-full max-w-md p-8 rounded-xl shadow-2xl z-10 border border-white/10 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
 
        {type === 'consultation' ? (
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Book Free Consultation</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Connect with an industry mentor to map your roadmap.
            </p>
 
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center animate-in fade-in duration-300">
                <span className="material-symbols-outlined text-green-400 text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-2">Consultation Requested!</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">We will contact you shortly via WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">WhatsApp Number</label>
                  <input 
                    required
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
                    className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">College / University</label>
                  <input 
                    required
                    type="text" 
                    placeholder="IIT Bombay"
                    value={formData.college}
                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                    className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    placeholder="ada@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Short Project Description (Optional)</label>
                  <textarea 
                    rows="3"
                    placeholder="Briefly describe your final year project idea or guidance needed..."
                    value={formData.projectDescription}
                    onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 py-1">
                  <input 
                    type="checkbox"
                    id="hasReferral"
                    checked={formData.hasReferral}
                    onChange={e => setFormData({ ...formData, hasReferral: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer accent-primary"
                  />
                  <label htmlFor="hasReferral" className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none">
                    I have a referral code
                  </label>
                </div>

                <AnimatePresence>
                  {formData.hasReferral && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Referral Code</label>
                        <input 
                          required={formData.hasReferral}
                          type="text" 
                          placeholder="ARCH-XXXX-XXXX"
                          value={formData.referralCode}
                          onChange={e => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                          className="bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono tracking-wider"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit"
                  className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer mt-4 hover:opacity-90 transition-all"
                >
                  Schedule Session
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">{title || 'Notice'}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{message}</p>
            <div className="flex justify-end gap-4">
              {onConfirm && (
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-6 py-2 rounded bg-primary text-on-primary font-body-md hover:opacity-90 transition-all active:scale-95"
                >
                  Confirm
                </button>
              )}
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded border border-white/10 text-on-surface hover:bg-white/5 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
