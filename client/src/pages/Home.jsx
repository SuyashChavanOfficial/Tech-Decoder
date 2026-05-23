import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

export default function Home() {
  const navigate = useNavigate();
  const [consultationOpen, setConsultationOpen] = useState(false);

  const domains = [
    { name: 'Web Dev', icon: 'language', color: 'text-primary' },
    { name: 'AI/ML', icon: 'memory', color: 'text-tertiary-container' },
    { name: 'Data Science', icon: 'database', color: 'text-primary' },
    { name: 'Cybersecurity', icon: 'security', color: 'text-error' },
    { name: 'IoT', icon: 'router', color: 'text-primary' },
    { name: 'Cloud', icon: 'cloud', color: 'text-tertiary-container' },
    { name: 'Mobile', icon: 'smartphone', color: 'text-primary' },
    { name: 'Blockchain', icon: 'link', color: 'text-secondary' }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: custom * 0.1 
      }
    })
  };

  return (
    <>
      <main className="flex-grow pt-20 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden" id="hero-section">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[150px] mix-blend-screen" />
          </div>

          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="flex flex-col items-start space-y-8">
              <motion.div 
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="inline-flex items-center space-x-2 glass-panel px-4 py-2 rounded-full border border-white/10"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-label-sm text-label-sm text-primary uppercase">Elite Mentorship Platform</span>
              </motion.div>
              
              <motion.h1 
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-xl md:text-display-xl text-on-surface leading-tight"
              >
                <span className="block">Build.</span>
                <span className="block">Learn.</span>
                <span className="text-gradient">Decode.</span>
              </motion.h1>

              <motion.p 
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-lg"
              >
                Master industry-level engineering through guided projects, real-world tech stacks, and expert mentorship. Become the architect of tomorrow's technology.
              </motion.p>

              <motion.div 
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
              >
                <button 
                  onClick={() => navigate('/about')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer hover:opacity-90 transition-all flex justify-center items-center group cursor-pointer"
                >
                  Explore Projects
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button 
                  onClick={() => setConsultationOpen(true)}
                  className="glass-panel text-on-surface px-8 py-4 rounded-xl font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors flex justify-center items-center card-interactive cursor-pointer"
                >
                  Book Free Consultation
                </button>
              </motion.div>

              <motion.div 
                custom={5}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex items-center space-x-8 pt-4 border-t border-white/10 w-full"
              >
                <div>
                  <p className="font-headline-md text-headline-md text-primary">100+</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Projects Guided</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <p className="font-headline-md text-headline-md text-primary">MERN</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">AI • ML • IoT</p>
                </div>
              </motion.div>
            </div>

            {/* Right Hero Column: Floating UI Cards */}
            <div className="relative hidden md:block h-[600px] w-full">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-10 glass-panel p-6 rounded-2xl w-80 animate-float-1 z-20"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-sm text-label-sm text-tertiary-container uppercase">System Architecture</span>
                  <span className="material-symbols-outlined text-tertiary-container">architecture</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-white/10 rounded-full w-full" />
                  <div className="h-2 bg-white/10 rounded-full w-4/5" />
                  <div className="h-2 bg-white/10 rounded-full w-5/6" />
                </div>
                <div className="mt-6 p-4 bg-surface-dim rounded-xl border border-white/5 font-mono text-xs text-primary/80">
                  &gt; npm run build<br/>
                  &gt; Deploying microservices...<br/>
                  &gt; All systems operational.
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-10 bottom-20 glass-panel p-6 rounded-2xl w-72 animate-float-2 z-10"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">model_training</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface uppercase">AI Model Training</p>
                    <p className="text-xs text-on-surface-variant">Epoch 45/50</p>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                  <div className="bg-primary h-1 rounded-full w-[90%]" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Advantage Section */}
        <section className="py-24 bg-surface-container-lowest relative border-y border-white/5">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 max-w-2xl mx-auto"
            >
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">The Decoder Advantage</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">We don't just teach code; we engineer professionals through rigorous, industry-aligned mentorship.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="glass-panel p-8 rounded-2xl group card-interactive"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface text-2xl mb-3">Expert Mentorship</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Direct guidance from industry veterans who have built scalable systems for top tech companies.</p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="glass-panel p-8 rounded-2xl group card-interactive"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">code_blocks</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface text-2xl mb-3">Real Learning</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Move beyond tutorials. Build complex, end-to-end applications that solve actual business problems.</p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="glass-panel p-8 rounded-2xl group card-interactive"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">factory</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface text-2xl mb-3">Industry Ready</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Master CI/CD, cloud deployments, system design, and the professional workflow expected in tier-1 companies.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Domains Section */}
        <section className="py-24 relative" id="domains-section">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-between items-end mb-16"
            >
              <div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Domains We Cover</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Comprehensive mastery across the modern technological spectrum.</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {domains.map((dom, i) => (
                <motion.div 
                  key={dom.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="glass-panel p-6 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group flex flex-col items-center text-center card-interactive"
                  onClick={() => navigate('/about')}
                >
                  <span className={`material-symbols-outlined text-4xl mb-4 group-hover:scale-110 transition-transform ${dom.color}`}>{dom.icon}</span>
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">{dom.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-panel p-12 md:p-20 rounded-[2rem] border border-primary/20 bg-surface-container/50"
            >
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-xl md:text-display-xl text-on-surface mb-6">Ready to Build?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">Stop watching tutorials. Start engineering real solutions with industry experts guiding your every commit.</p>
              <button 
                onClick={() => setConsultationOpen(true)}
                className="bg-primary text-on-primary px-10 py-5 rounded-xl font-label-sm text-label-sm uppercase tracking-wider glow-button btn-shimmer hover:opacity-90 transition-all text-lg cursor-pointer"
              >
                Start Your Journey
              </button>
            </motion.div>
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
