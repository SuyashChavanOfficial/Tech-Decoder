import React from 'react';
import { motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, message, onConfirm }) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      {/* Backdrop */}
      <motion.div 
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <motion.div 
        animate={{ 
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
          y: isOpen ? 0 : 15
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative glass-panel w-full max-w-md p-8 rounded-xl shadow-2xl z-10 border border-white/10"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
 
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
                className="px-6 py-2 rounded bg-primary text-on-primary font-body-md hover:opacity-90 transition-all active:scale-95 cursor-pointer"
              >
                Confirm
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded border border-white/10 text-on-surface hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
