import React, { useEffect, useRef } from 'react';

export default function InteractiveGlowCard({ children, className = '', containerClassName = '' }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Distance to card boundaries (bounding box)
      const closestX = Math.max(0, Math.min(x, rect.width));
      const closestY = Math.max(0, Math.min(y, rect.height));
      const dx_box = x - closestX;
      const dy_box = y - closestY;
      const distanceToBox = Math.sqrt(dx_box * dx_box + dy_box * dy_box);

      // Max distance outside to start showing glow (e.g. 250px)
      const maxGlowDistance = 250;
      let opacity = 0;
      if (distanceToBox < maxGlowDistance) {
        opacity = 1 - distanceToBox / maxGlowDistance;
      }

      // Center coordinates of the card
      const x_c = rect.width / 2;
      const y_c = rect.height / 2;
      const dx = x - x_c;
      const dy = y - y_c;
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.sqrt(x_c * x_c + y_c * y_c);

      // Glow radius configurations: larger R_center to prevent aggressive horizontal/vertical falloff
      const R_edge = 180; // tighter glow when near corners
      const R_center = 700; // generous wide glow all around when near center
      const centerRatio = Math.max(0, Math.min(1, distanceToCenter / maxDistance));
      
      // Spreads/decreases as it gets closer/further to center
      const radius = R_edge + (R_center - R_edge) * Math.pow(1 - centerRatio, 1.5);
      const alpha = opacity * 0.45 + 0.08;

      // Set CSS variables dynamically to avoid React re-renders for 120 FPS performance
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--glow-radius', `${radius}px`);
      card.style.setProperty('--glow-opacity', `${opacity}`);
      card.style.setProperty('--glow-alpha', `${alpha}`);
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--glow-opacity', '0');
      card.style.setProperty('--glow-alpha', '0.08');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial state
    card.style.setProperty('--mouse-x', '0px');
    card.style.setProperty('--mouse-y', '0px');
    card.style.setProperty('--glow-radius', '160px');
    card.style.setProperty('--glow-opacity', '0');
    card.style.setProperty('--glow-alpha', '0.08');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`relative p-[1.5px] rounded-2xl ${containerClassName}`}
      style={{
        background: `radial-gradient(circle var(--glow-radius) at var(--mouse-x) var(--mouse-y), rgba(173, 198, 255, var(--glow-alpha)) 0%, rgba(255, 255, 255, 0.08) 100%)`,
      }}
    >
      {/* Background shadow glow behind the card - massive canvas offset to prevent clipping in Safari */}
      <div 
        className="absolute pointer-events-none blur-3xl rounded-2xl transition-opacity duration-300 z-[-1]"
        style={{
          '--glow-offset': '160px',
          top: 'calc(-1 * var(--glow-offset))',
          left: 'calc(-1 * var(--glow-offset))',
          right: 'calc(-1 * var(--glow-offset))',
          bottom: 'calc(-1 * var(--glow-offset))',
          opacity: 'var(--glow-opacity)',
          background: `radial-gradient(circle calc(var(--glow-radius) + 100px) at calc(var(--mouse-x) + var(--glow-offset)) calc(var(--mouse-y) + var(--glow-offset)), rgba(173, 198, 255, 0.12) 0%, transparent 80%)`,
        }}
      />
      {/* Content wrapper */}
      <div className={`relative z-10 w-full h-full bg-[#10131a]/95 backdrop-blur-xl rounded-[15px] ${className}`}>
        {children}
      </div>
    </div>
  );
}
