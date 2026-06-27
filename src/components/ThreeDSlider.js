"use client";

import React, { useRef, useCallback, useEffect } from 'react';

// SliderItem sub-component
const SliderItem = React.forwardRef(({ item, onClick }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="absolute top-1/2 left-1/2 cursor-pointer select-none rounded-2xl shadow-2xl bg-black overflow-hidden pointer-events-auto will-change-transform"
      style={{
        width: 'clamp(150px, 28vw, 280px)',
        height: 'clamp(200px, 38vw, 380px)',
        marginTop: 'calc(-1 * clamp(100px, 19vw, 190px))',
        marginLeft: 'calc(-1 * clamp(75px, 14vw, 140px))',
        transformOrigin: '0% 100%',
        transition: 'none',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent via-50% to-black/70 pointer-events-none" />

      {/* Tag badge */}
      <span className="absolute top-3 left-3 z-20 px-3 py-1 bg-stone-950/90 text-[10px] font-bold uppercase tracking-widest rounded-full text-purple-300 border border-purple-500/30">
        {item.tag}
      </span>

      {/* Title at bottom */}
      <div className="absolute z-20 bottom-4 left-4 right-4">
        <p className="text-white font-serif text-lg sm:text-xl font-semibold leading-snug drop-shadow-md">
          {item.title}
        </p>
        <p className="text-white/70 text-xs mt-1 font-sans">{item.duration}</p>
      </div>

      {/* Slide number */}
      <div className="absolute z-10 top-3 right-3 text-white/40 text-3xl font-bold leading-none select-none">
        {item.num}
      </div>

      {/* Image */}
      <div
        className="slider-item-content absolute inset-0 will-change-[opacity]"
        style={{ opacity: 1 }}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
});
SliderItem.displayName = 'SliderItem';

// Main ThreeDSlider component
export default function ThreeDSlider({
  items,
  speedWheel = 0.05,
  speedDrag = -0.15,
  onItemClick,
}) {
  const progressRef = useRef(50);
  const targetProgressRef = useRef(50);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const itemRefs = useRef([]);
  const cacheRef = useRef({});
  const numItems = items.length;

  const update = useCallback(() => {
    if (!itemRefs.current.length) return;

    progressRef.current += (targetProgressRef.current - progressRef.current) * 0.1;

    const progress = progressRef.current;
    const denominator = numItems > 1 ? numItems - 1 : 1;
    const activeFloat = (progress / 100) * (numItems - 1);

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      const ratio = (index - activeFloat) / denominator;
      const tx = ratio * 800;
      const ty = ratio * 200;
      const rot = ratio * 120;
      const dist = Math.abs(index - activeFloat);
      const z = numItems - dist;
      const opacity = (z / numItems) * 3 - 2;

      const newTransform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
      const newZIndex = Math.round(z * 10).toString();
      const newOpacity = Math.max(0, Math.min(1, opacity)).toString();

      if (!cacheRef.current[index]) {
        cacheRef.current[index] = { transform: '', zIndex: '', opacity: '' };
      }
      const cache = cacheRef.current[index];

      if (cache.transform !== newTransform) {
        el.style.transform = newTransform;
        cache.transform = newTransform;
      }
      if (cache.zIndex !== newZIndex) {
        el.style.zIndex = newZIndex;
        cache.zIndex = newZIndex;
      }

      const inner = el.querySelector('.slider-item-content');
      if (inner && cache.opacity !== newOpacity) {
        inner.style.opacity = newOpacity;
        cache.opacity = newOpacity;
      }
    });
  }, [numItems]);

  // Animation loop
  useEffect(() => {
    let active = true;
    const loop = () => {
      if (active) {
        update();
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  // Wheel handler
  const handleWheel = useCallback((e) => {
    const next = targetProgressRef.current + e.deltaY * speedWheel;
    if ((next < 0 && e.deltaY < 0) || (next > 100 && e.deltaY > 0)) return;
    e.preventDefault();
    targetProgressRef.current = Math.max(0, Math.min(100, next));
  }, [speedWheel]);

  const getClientX = (e) => {
    if (e.touches) return e.touches[0].clientX;
    return e.clientX;
  };

  const handleMouseDown = useCallback((e) => {
    isDownRef.current = true;
    startXRef.current = getClientX(e);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDownRef.current) return;
    const x = getClientX(e);
    const diff = (x - startXRef.current) * speedDrag;
    targetProgressRef.current = Math.max(0, Math.min(100, targetProgressRef.current + diff));
    startXRef.current = x;
  }, [speedDrag]);

  const handleMouseUp = useCallback(() => {
    isDownRef.current = false;
  }, []);

  const handleClick = useCallback((item, index) => {
    const denominator = numItems > 1 ? numItems - 1 : 1;
    targetProgressRef.current = (index / denominator) * 100;
    if (onItemClick) onItemClick(item, index);
  }, [numItems, onItemClick]);

  // Register event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '420px', background: 'transparent' }}
    >
      <div className="relative h-full overflow-hidden pointer-events-none scale-100 w-full">
        {items.map((item, index) => (
          <SliderItem
            key={`slider-item-${index}`}
            ref={(el) => { itemRefs.current[index] = el; }}
            item={item}
            index={index}
            onClick={() => handleClick(item, index)}
          />
        ))}
      </div>
    </div>
  );
}
