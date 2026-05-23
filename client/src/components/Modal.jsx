import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Modal({ isOpen, onClose, type = 'alert', title, message, onConfirm }) {
  const { bookConsultation } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', timeSlot: 'morning', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    bookConsultation(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', timeSlot: 'morning', notes: '' });
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
              <div className="flex flex-col items-center py-8 text-center">
                <span className="material-symbols-outlined text-green-400 text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-2">Consultation Requested!</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">We will contact you shortly via email.</p>
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
                    className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="ada@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Preferred Time</label>
                  <select 
                    value={formData.timeSlot}
                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Interests / Goals</label>
                  <textarea 
                    rows="3"
                    placeholder="System design, React, Cloud architectures..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>
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
