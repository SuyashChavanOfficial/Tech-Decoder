import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <>
      <main className="flex-grow pt-20 overflow-x-hidden">
        {/* Mission Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5 }}
              className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-6 block"
            >
              Our Mentorship Philosophy
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-headline-lg-mobile md:font-display-xl text-headline-lg-mobile md:text-display-xl text-on-background mb-8 max-w-4xl mx-auto"
            >
              Architecting the Next Generation of Engineers.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12"
            >
              We don't just provide code snippets. We instil architectural thinking, debugging intuition, and the technical precision required for elite software development environments.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <button 
                onClick={() => navigate('/book')}
                className="bg-primary text-on-primary font-body-md text-body-md px-8 py-3 rounded glow-primary hover:opacity-90 transition-all cursor-pointer"
              >
                Explore Mentors
              </button>
              <button 
                onClick={() => {
                  const element = document.querySelector('#lifecycle-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-panel text-on-background font-body-md text-body-md px-8 py-3 rounded hover:bg-surface-container transition-all cursor-pointer"
              >
                View Curriculums
              </button>
            </motion.div>
          </div>
        </section>

        {/* Project Lifecycle Bento Grid */}
        <section className="py-24 bg-surface-container-lowest" id="lifecycle-section">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-16">
              <h2 className="font-headline-md text-headline-md text-on-background mb-4">The Development Lifecycle</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">A systematic approach from concept to deployment, guided by industry veterans.</p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Ideation & Architecture */}
              <motion.div 
                variants={itemVariants}
                className="glass-card rounded-xl p-8 md:col-span-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <span className="material-symbols-outlined text-primary mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>architecture</span>
                    <h3 className="font-headline-md text-headline-md text-on-background mb-2">Ideation &amp; Architecture</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Defining system constraints, selecting the optimal tech stack, and mapping database schemas before writing a single line of code.</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                    <span className="font-label-sm text-label-sm px-3 py-1 bg-surface-container rounded-full text-secondary">System Design</span>
                    <span className="font-label-sm text-label-sm px-3 py-1 bg-surface-container rounded-full text-secondary">Tech Stack</span>
                  </div>
                </div>
              </motion.div>

              {/* Execution */}
              <motion.div 
                variants={itemVariants}
                className="glass-card rounded-xl p-8 flex flex-col justify-between"
              >
                <div>
                  <span className="material-symbols-outlined text-tertiary mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>terminal</span>
                  <h3 className="font-body-lg text-body-lg text-on-background mb-2 font-semibold">Development Execution</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Writing clean, testable code with continuous mentor code reviews.</p>
                </div>
                <div className="mt-6 p-4 code-bg rounded font-mono text-xs text-secondary/70 bg-[#16161b] border border-white/5">
                  <span className="text-primary">git</span> commit -m <br/>"feat: implement auth"<br/>
                  <span className="text-primary">git</span> push origin main
                </div>
              </motion.div>

              {/* Documentation */}
              <motion.div 
                variants={itemVariants}
                className="glass-card rounded-xl p-8"
              >
                <span className="material-symbols-outlined text-secondary mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>description</span>
                <h3 className="font-body-lg text-body-lg text-on-background mb-2 font-semibold">Technical Documentation</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Crafting professional READMEs, API specs, and deployment guides.</p>
              </motion.div>

              {/* Deployment & Defense */}
              <motion.div 
                variants={itemVariants}
                className="glass-card rounded-xl p-8 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>rocket_launch</span>
                  <h3 className="font-headline-md text-headline-md text-on-background mb-2">Deployment &amp; Defense</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Deploying to production environments and conducting mock vivas to ensure conceptual mastery.</p>
                </div>
                <div className="w-full md:w-1/3 flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-surface-container rounded border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-label-sm text-label-sm text-on-surface">CI/CD Pipeline Active</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface-container rounded border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-label-sm text-label-sm text-on-surface">Mock Viva Scheduled</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Mentorship Matters (Problem/Solution) */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="font-label-sm text-label-sm text-error uppercase tracking-widest mb-4 block">The Problem</span>
                <h2 className="font-headline-lg md:font-display-xl text-headline-lg md:text-display-xl text-on-background mb-6">Tutorial Hell is a Trap.</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Following along with videos creates an illusion of competence. When faced with a blank IDE, the lack of foundational architectural understanding leaves students paralyzed, resulting in abandoned projects and fragile codebases.</p>
                <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
                    Superficial understanding of frameworks.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
                    Inability to debug complex issues independently.
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass-panel p-10 rounded-xl border border-primary/20 relative"
              >
                <div className="absolute -top-4 -right-4 bg-primary text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(173,198,255,0.4)]">The Solution</div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">Guided Autonomy</h3>
                <p className="font-body-md text-body-md text-on-surface mb-6">Our mentors don't write the code for you. They review your pull requests, point out architectural flaws, and ask Socratic questions that guide you to the optimal solution.</p>
                
                <div className="bg-surface-container-lowest p-6 rounded border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md text-on-background font-semibold">Mentor Feedback</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">Pull Request #42</div>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant italic">"This database query runs inside a loop, causing an N+1 issue. How might you refactor this using a JOIN to optimize performance?"</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
