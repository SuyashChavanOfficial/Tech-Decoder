import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/dashboard';
  const [authMode, setAuthMode] = useState('signin');
  
  // Auth Form Fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  
  // Alerts / Modals States
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side password validation
    if (authPassword.length < 6) {
      setAlertTitle('Validation Error');
      setAlertMessage('Password must be at least 6 characters long.');
      setAlertOpen(true);
      return;
    }

    if (authMode === 'signin') {
      const result = await login(authEmail, authPassword);
      if (result.success) {
        setAlertTitle('Welcome Back');
        setAlertMessage('Authentication successful! Loading your session...');
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(from);
        }, 1500);
      } else {
        setAlertTitle('Authentication Failed');
        setAlertMessage(result.message || 'Invalid email or password.');
        setAlertOpen(true);
      }
    } else {
      const result = await register(authName, authEmail, authPassword);
      if (result.success) {
        setAlertTitle('Account Created');
        setAlertMessage('Your account was created successfully! Loading your session...');
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(from);
        }, 1500);
      } else {
        setAlertTitle('Registration Failed');
        setAlertMessage(result.message || 'Please fill all registration fields correctly.');
        setAlertOpen(true);
      }
    }
  };

  return (
    <>
      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-margin-mobile">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-10 rounded-xl w-full flex flex-col gap-8 shadow-2xl border border-white/10 relative">
            <div className="text-center">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {authMode === 'signin' ? 'Authenticate to access your dashboard.' : 'Start architecting your engineering career.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Google Login Component */}
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    setAlertTitle('Google Authentication');
                    setAlertMessage('Verifying credentials...');
                    setAlertOpen(true);
                    
                    const result = await loginWithGoogle(credentialResponse.credential);
                    if (result.success) {
                      setAlertMessage('Authentication successful! Loading your session...');
                      setTimeout(() => {
                        setAlertOpen(false);
                        navigate(from);
                      }, 1500);
                    } else {
                      setAlertTitle('Error');
                      setAlertMessage(result.message || 'Google sign-in failed.');
                    }
                  }}
                  onError={() => {
                    setAlertTitle('Error');
                    setAlertMessage('Google authentication failed. Please try again.');
                    setAlertOpen(true);
                  }}
                  theme="dark"
                  size="large"
                  width="100%"
                />
              </div>

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
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Password (min 6 characters)</label>
                    <Link to="#" className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors">Forgot?</Link>
                  </div>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    minLength={6}
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
