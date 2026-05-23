import React, { useEffect, useRef } from 'react';

export default function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    let targetWidth = 300; // base width
    let currentWidth = 300;
    let isVisible = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop for smooth easing (lag/trail) and sizing
    let animationFrameId;
    const updateGlow = () => {
      // Smooth position interpolation (lerp) - extremely tight follow to remove perceived lag
      currentX += (mouseX - currentX) * 0.45;
      currentY += (mouseY - currentY) * 0.45;

      // Distance between cursor and lagging glow is our speed metric!
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Map speed directly to target width (higher multiplier because lag distance is smaller)
      targetWidth = 300 + Math.min(distance * 9.0, 250);

      // Smooth width interpolation (lerp) - faster response
      currentWidth += (targetWidth - currentWidth) * 0.20;

      if (glow) {
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        glow.style.width = `${currentWidth}px`;
        glow.style.height = `${currentWidth}px`;
        glow.style.opacity = isVisible ? '1' : '0';
      }

      animationFrameId = requestAnimationFrame(updateGlow);
    };

    // Start the animation loop
    updateGlow();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] select-none">
      <div 
        ref={glowRef}
        className="absolute pointer-events-none rounded-full opacity-0"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(225, 235, 255, 0.16) 0%, rgba(225, 235, 255, 0.04) 45%, transparent 70%)',
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'opacity 0.5s ease',
          willChange: 'left, top, width, height',
        }}
      />
    </div>
  );
}
