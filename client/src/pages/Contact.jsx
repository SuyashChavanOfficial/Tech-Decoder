import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Contact() {
  const { login, register, submitInquiry } = useAuth();
  const navigate = useNavigate();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');
  
  // Auth Form Fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  
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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'signin') {
      const result = await login(authEmail, authPassword);
      if (result.success) {
        setAlertTitle('Welcome Back');
        setAlertMessage('Authentication successful! Loading your dashboard...');
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate('/dashboard');
        }, 1500);
      } else {
        setAlertTitle('Error');
        setAlertMessage(result.message || 'Please enter valid email and password.');
        setAlertOpen(true);
      }
    } else {
      const result = await register(authName, authEmail, authPassword);
      if (result.success) {
        setAlertTitle('Account Created');
        setAlertMessage('Your account was created successfully! Launching dashboard...');
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate('/dashboard');
        }, 1500);
      } else {
        setAlertTitle('Error');
        setAlertMessage(result.message || 'Please fill all registration fields.');
        setAlertOpen(true);
      }
    }
  };

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

  const fillMockCredentials = () => {
    setAuthEmail('alex.chen@mit.edu');
    setAuthPassword('super-secret-pass');
    setAuthName('Alex Chen');
  };

  return (
    <>
      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        
        {/* Left Column: Project Inquiry Form */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-12"
        >
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
              Let's build something exceptional.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Reach out to our elite mentorship team or submit an inquiry for your next major project architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-lg hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                mail
              </span>
              <h3 className="font-body-md text-body-md text-on-surface mb-1">Email Us</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">hello@techdecoder.dev</p>
            </div>
            <div className="glass-panel p-6 rounded-lg hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                forum
              </span>
              <h3 className="font-body-md text-body-md text-on-surface mb-1">WhatsApp</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">+1 (555) 019-2834</p>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="glass-panel p-8 rounded-xl flex flex-col gap-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Project Inquiry</h2>
            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="mt-4 bg-primary text-on-primary px-6 py-3 rounded font-body-md text-body-md hover:opacity-80 transition-all duration-300 active:scale-95 btn-glow w-full sm:w-auto self-start cursor-pointer"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </motion.section>

        {/* Right Column: Authentication Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center items-center lg:items-end mt-12 lg:mt-0"
        >
          <div className="glass-panel p-10 rounded-xl w-full max-w-md flex flex-col gap-8 shadow-2xl border border-white/10 relative">
            <div className="text-center">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {authMode === 'signin' ? 'Authenticate to access your dashboard.' : 'Start architecting your engineering career.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Mock Google Login */}
              <button 
                type="button"
                onClick={() => {
                  login('alex.chen@mit.edu', 'mock-password');
                  setAlertTitle('Google Authentication');
                  setAlertMessage('Logging in as Alex Chen...');
                  setAlertOpen(true);
                  setTimeout(() => {
                    setAlertOpen(false);
                    navigate('/dashboard');
                  }, 1500);
                }}
                className="w-full bg-surface-container-high border border-white/10 text-on-surface py-3 rounded flex items-center justify-center gap-3 hover:bg-surface-bright transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="font-body-md text-body-md font-semibold">Continue with Google</span>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink-0 px-4 text-on-surface-variant font-label-sm text-label-sm uppercase">Or</span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              {/* Native Auth Form */}
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                {authMode === 'signup' && (
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Alex Chen"
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      className="bg-transparent border-b border-white/20 rounded-none px-2 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="alex.chen@mit.edu"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="bg-transparent border-b border-white/20 rounded-none px-2 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Password</label>
                    <Link to="#" className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors">Forgot?</Link>
                  </div>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="bg-transparent border-b border-white/20 rounded-none px-2 py-2 text-on-surface font-body-md focus:ring-0 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-2 w-full bg-primary text-on-primary py-3 rounded font-body-md text-body-md font-semibold hover:opacity-80 transition-all duration-300 active:scale-95 btn-glow cursor-pointer"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>
            </div>

            {/* Quick Demo Helper */}
            <div className="text-center pt-2 border-t border-white/5">
              <button 
                type="button"
                onClick={fillMockCredentials}
                className="text-xs text-primary hover:underline"
              >
                ⚡ Autofill Demo Credentials
              </button>
            </div>

            <div className="text-center mt-2">
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                {authMode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setAuthMode('signup')}
                      className="text-primary hover:text-primary-fixed transition-colors underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button 
                      onClick={() => setAuthMode('signin')}
                      className="text-primary hover:text-primary-fixed transition-colors underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.section>
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
