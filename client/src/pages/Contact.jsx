import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Contact() {
  const { submitInquiry } = useAuth();
  
  // Inquiry Form Fields
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySchool, setInquirySchool] = useState('');
  const [inquiryBranch, setInquiryBranch] = useState('');
  const [inquiryDomain, setInquiryDomain] = useState('');
  const [inquiryIdea, setInquiryIdea] = useState('');

  // Alerts / Modals States
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryDomain || !inquiryIdea) {
      setAlertTitle('Incomplete Form');
      setAlertMessage('Please enter your Name, Email, Primary Domain, and Project Idea.');
      setAlertOpen(true);
      return;
    }
    
    const result = await submitInquiry({
      name: inquiryName,
      email: inquiryEmail,
      school: inquirySchool,
      branch: inquiryBranch,
      domain: inquiryDomain,
      idea: inquiryIdea
    });

    if (result.success) {
      setAlertTitle('Inquiry Submitted');
      setAlertMessage('Thank you! Our architecture review board has received your project idea and will contact you within 24 hours.');
      setAlertOpen(true);

      // Reset Form
      setInquiryName('');
      setInquiryEmail('');
      setInquirySchool('');
      setInquiryBranch('');
      setInquiryDomain('');
      setInquiryIdea('');
    } else {
      setAlertTitle('Error');
      setAlertMessage(result.message || 'Failed to submit inquiry.');
      setAlertOpen(true);
    }
  };

  return (
    <>
      <main className="flex-grow pt-32 pb-24 px-margin-mobile max-w-4xl mx-auto w-full flex flex-col gap-12">
        {/* Title Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-4 block">
            Partner With Us
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            Let's build something exceptional.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Reach out to our elite mentorship team or submit an inquiry for your next major project architecture.
          </p>
        </motion.div>

        {/* Contact Info blocks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div className="glass-panel p-6 rounded-lg hover:border-white/20 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                mail
              </span>
            </div>
            <div>
              <h3 className="font-body-md text-body-md text-on-surface font-semibold">Email Us</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">hello@techdecoder.dev</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-lg hover:border-white/20 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                forum
              </span>
            </div>
            <div>
              <h3 className="font-body-md text-body-md text-on-surface font-semibold">WhatsApp Support</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">+1 (555) 019-2834</p>
            </div>
          </div>
        </motion.div>

        {/* Project Inquiry Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-8 md:p-10 rounded-xl flex flex-col gap-8 shadow-2xl border border-white/10"
        >
          <h2 className="font-headline-md text-headline-md text-on-surface text-center">Project Inquiry</h2>
          <form onSubmit={handleInquirySubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={inquiryName}
                  onChange={e => setInquiryName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-3 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email</label>
                <input 
                  type="email" 
                  value={inquiryEmail}
                  onChange={e => setInquiryEmail(e.target.value)}
                  placeholder="ada@example.com"
                  className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-3 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">College/Institution</label>
                <input 
                  type="text" 
                  value={inquirySchool}
                  onChange={e => setInquirySchool(e.target.value)}
                  placeholder="MIT"
                  className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-3 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Branch</label>
                <input 
                  type="text" 
                  value={inquiryBranch}
                  onChange={e => setInquiryBranch(e.target.value)}
                  placeholder="Computer Science"
                  className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-3 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Primary Domain</label>
              <select 
                value={inquiryDomain}
                onChange={e => setInquiryDomain(e.target.value)}
                className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-3 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all appearance-none"
              >
                <option value="">Select Domain</option>
                <option value="backend">Backend Architecture</option>
                <option value="frontend">Frontend Engineering</option>
                <option value="data">Data Science / ML</option>
                <option value="devops">DevOps / Infrastructure</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Project Idea / Concept</label>
              <textarea 
                rows="4" 
                value={inquiryIdea}
                onChange={e => setInquiryIdea(e.target.value)}
                placeholder="Describe the problem you are solving..."
                className="bg-surface-container-low border-b border-white/10 rounded-none px-4 py-3 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <button 
              type="submit"
              className="mt-4 bg-primary text-on-primary px-8 py-4 rounded font-body-md text-body-md font-semibold hover:opacity-80 transition-all duration-300 active:scale-95 btn-glow w-full cursor-pointer text-center"
            >
              Submit Inquiry
            </button>
          </form>
        </motion.div>
      </main>

      {/* Success/Error Dialog */}
      <Modal 
        isOpen={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        title={alertTitle} 
        message={alertMessage}
      />
    </>
  );
}
