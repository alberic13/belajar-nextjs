"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper to format "Exotic" or "EXOTIC" in text to be purple
const renderTextWithExotic = (text) => {
  if (!text) return "";
  const parts = text.split(/(Exotic|EXOTIC)/g);
  return parts.map((part, i) => {
    if (part.toLowerCase() === "exotic") {
      return (
        <span key={i} className="text-exotic-purple font-semibold">
          {part}
        </span>
      );
    }
    return part;
  });
};

// Wrapper component that animates its children on scroll entrance using GSAP ScrollTrigger
const Reveal = ({ children, className = "", delay = 0, duration = 800, y = 30 }) => {
  const elementRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      elementRef.current,
      { opacity: 0, y: y },
      {
        opacity: 1,
        y: 0,
        duration: duration / 1000,
        delay: delay / 1000,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: elementRef });

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// Accordion panel subcomponent for smooth height animation using GSAP
const FaqItem = ({ faq, isOpen, onToggle }) => {
  const panelRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(
        panelRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    } else {
      gsap.to(panelRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all duration-300 hover:border-exotic-purple/20">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-stone-900 hover:text-exotic-purple text-sm sm:text-base cursor-pointer hover:bg-exotic-purple/5 transition-all duration-200"
      >
        <span>{faq.q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-exotic-purple transition-transform duration-300 ${isOpen ? "rotate-180 bg-exotic-purple-light/40 border-exotic-purple/20" : ""}`}>
          ▼
        </span>
      </button>

      <div
        ref={panelRef}
        style={{ height: 0, overflow: "hidden" }}
        className="border-stone-100 px-6"
      >
        <div className="pb-6 pt-2">
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            {renderTextWithExotic(faq.a)}
          </p>
        </div>
      </div>
    </div>
  );
};


// cn helper to merge classnames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Custom Button component to match the interface
const Button = ({ children, onClick, variant, size, className, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  // Use styling corresponding to button variants
  const variants = {
    default: "bg-stone-950 text-white hover:bg-exotic-purple hover:shadow-lg hover:shadow-exotic-purple/20",
    outline: "border border-stone-200 bg-transparent hover:bg-stone-100",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    ghost: "hover:bg-stone-100 hover:text-stone-900",
    link: "text-stone-900 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-full px-8 py-4",
    icon: "h-10 w-10",
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <button
      onClick={onClick}
      className={cn(baseStyle, variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  );
};

// 3D Holographic Card component using Framer Motion
const HolographicCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);

  // Motion values for tracking cursor coordinates relative to the card dimensions
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Map relative position to rotation degrees (tilt effect)
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);

  // Handle cursor moves over the card
  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  // Reset rotation when cursor leaves the card
  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Holographic glare and reflection properties
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`
    radial-gradient(circle 350px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 80%),
    linear-gradient(${useTransform(x, [0, 1], [0, 360])}deg, rgba(255, 0, 128, 0.08) 0%, rgba(123, 44, 191, 0.12) 50%, rgba(0, 255, 255, 0.08) 100%)
  `;

  return (
    <div className="perspective-1200 w-full flex">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-exotic-purple/10 border border-stone-200/60 hover:border-exotic-purple/20 transition-all duration-500 flex flex-col group w-full",
          className
        )}
      >
        {/* Holographic Dynamic Glare Overlay */}
        <motion.div
          style={{
            background: glareBackground,
          }}
          className="absolute inset-0 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color-dodge"
        />

        {/* Dynamic Light Foil Highlights (Subtle VIP gold outline) */}
        <div
          style={{ transform: "translateZ(15px)" }}
          className="absolute inset-0 border border-transparent group-hover:border-[#C5A880]/30 rounded-3xl pointer-events-none z-40 transition-colors duration-500"
        />

        {/* Card content with inner 3D depth */}
        <div className="flex flex-col flex-1" style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};



const allStockImages = [
  "/images/hero_beauty.png",
  "/images/course_hair.png",
  "/images/course_makeup.png",
  "/images/course_makeup_2.png",
  "/images/course_hair_2.png",
  "/images/course_skincare.png",
  "/images/course_extensions.png"
];

// HeroSection component with GSAP animations
const HeroSection = ({ title, subtitle, actions, stats, images, className }) => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const [collageImages, setCollageImages] = useState([
    images[0] || "/images/hero_beauty.png",
    images[1] || "/images/course_hair.png",
    images[2] || "/images/course_makeup.png"
  ]);

  const collageImagesRef = useRef(collageImages);

  React.useEffect(() => {
    collageImagesRef.current = collageImages;
  }, [collageImages]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const cardIndex = Math.floor(Math.random() * 3);
      const current = collageImagesRef.current;
      const currentSet = new Set(current);
      const available = allStockImages.filter(img => !currentSet.has(img));

      if (available.length === 0) return;
      const newImg = available[Math.floor(Math.random() * available.length)];

      const wrapperSelector = `.hero-img-${cardIndex + 1}`;

      gsap.to(wrapperSelector, {
        opacity: 0,
        scale: 0.93,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          setCollageImages(prev => {
            const next = [...prev];
            next[cardIndex] = newImg;
            return next;
          });
        }
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    // Fade back in the collage image card that has been swapped
    gsap.to(".hero-collage-img-wrapper", {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto"
    });
  }, [collageImages]);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Text animations
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    );
    tl.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
    tl.fromTo(
      ".hero-action-btn",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
      "-=0.6"
    );
    tl.fromTo(
      ".hero-stat-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
      "-=0.5"
    );

    // Image collage animation
    tl.fromTo(
      ".hero-collage-img-wrapper",
      { opacity: 0, scale: 0.8, rotation: (i) => [5, -5, 3][i] || 0 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "power4.out", stagger: 0.15 },
      "-=0.8"
    );

    // Floating registration badge animation
    tl.fromTo(
      ".hero-badge",
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.6"
    );

    // Continuous floating animation for background decorative shapes
    gsap.to(".hero-shape-1", {
      y: -12,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".hero-shape-2", {
      y: 10,
      duration: 2.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".hero-shape-3", {
      y: -8,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Continuous subtle floating loop for collage images themselves
    gsap.to(".hero-img-1 img", {
      y: -8,
      rotation: 0.8,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".hero-img-2 img", {
      y: 10,
      rotation: -0.8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".hero-img-3 img", {
      y: -6,
      rotation: 0.5,
      duration: 2.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Desktop-only scroll animations
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      // Scroll parallax effect on the collage wrappers
      gsap.to(".hero-img-1", {
        y: -40,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(".hero-img-2", {
        y: 20,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(".hero-img-3", {
        y: -20,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Shrink scroll animation
      gsap.fromTo(
        containerRef.current,
        {
          scale: 1,
          borderRadius: "0px",
          opacity: 1,
        },
        {
          scale: 0.92,
          borderRadius: "40px",
          opacity: 0.9,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          }
        }
      );
    });

    return () => {
      mm.revert();
    };
  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} className="relative w-full h-auto lg:h-[135vh] bg-[#FAF8F5] overflow-hidden">
      {/* Blurred background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden blur-[100px] opacity-60 z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-exotic-purple/15" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#C5A880]/15" />
      </div>
      <div className="relative lg:sticky lg:top-20 w-full min-h-0 lg:min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] z-10">
        <section
          ref={containerRef}
          className={cn('w-full h-auto lg:h-full overflow-visible lg:overflow-hidden bg-background flex items-center py-16 lg:py-0 border-x border-b border-stone-200/60 shadow-xl', className)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8 w-full">
            {/* Left Column: Text Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="hero-title font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl leading-tight">
                {title}
              </h1>
              <p className="hero-subtitle mt-6 max-w-xl text-lg text-stone-600 leading-relaxed font-sans">
                {subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                {actions.map((action, index) => (
                  <Button key={index} onClick={action.onClick} variant={action.variant} size="lg" className={cn(action.className, "hero-action-btn")}>
                    {action.text}
                  </Button>
                ))}
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start">
                {stats.map((stat, index) => (
                  <div key={index} className="hero-stat-item flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-exotic-purple/10 text-exotic-purple">{stat.icon}</div>
                    <div>
                      <p className="text-xl font-bold text-stone-900">{stat.value}</p>
                      <p className="text-xs text-stone-500 uppercase font-semibold tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Image Collage */}
            <div className="relative h-[380px] w-full sm:h-[450px] lg:h-[500px]">
              {/* Decorative Shapes */}
              <div className="hero-shape-1 absolute -top-4 left-1/4 h-16 w-16 rounded-full bg-exotic-purple/10 border border-exotic-purple/20 blur-sm pointer-events-none" />
              <div className="hero-shape-2 absolute bottom-0 right-1/4 h-12 w-12 rounded-lg bg-rose-gold/20 border border-rose-gold/30 pointer-events-none" />
              <div className="hero-shape-3 absolute bottom-1/4 left-4 h-6 w-6 rounded-full bg-exotic-purple-light/40 border border-exotic-purple/10 pointer-events-none" />

              {/* Images */}
              <div
                className="hero-collage-img-wrapper hero-img-1 absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-2xl bg-white p-2 shadow-xl sm:h-56 sm:w-56 lg:h-64 lg:w-64 border border-stone-200/50 hover:shadow-exotic-purple/10 transition-shadow duration-300"
                style={{ transformOrigin: 'bottom center' }}
              >
                <img src={collageImages[0]} alt="LKP Exotic Salon Class" className="h-full w-full rounded-xl object-cover" />
              </div>
              <div
                className="hero-collage-img-wrapper hero-img-2 absolute right-0 top-1/3 h-36 w-36 rounded-2xl bg-white p-2 shadow-xl sm:h-48 sm:w-48 lg:h-56 lg:w-56 border border-stone-200/50 hover:shadow-exotic-purple/10 transition-shadow duration-300"
                style={{ transformOrigin: 'left center' }}
              >
                <img src={collageImages[1]} alt="Hair Extension Practice" className="h-full w-full rounded-xl object-cover" />
              </div>
              <div
                className="hero-collage-img-wrapper hero-img-3 absolute bottom-0 left-0 h-28 w-28 rounded-2xl bg-white p-2 shadow-xl sm:h-40 sm:w-40 lg:h-48 lg:w-48 border border-stone-200/50 hover:shadow-exotic-purple/10 transition-shadow duration-300"
                style={{ transformOrigin: 'top right' }}
              >
                <img src={collageImages[2]} alt="MUA Practice" className="h-full w-full rounded-xl object-cover" />
              </div>

              {/* Floating registration status badge overlaid */}
              <div className="hero-badge absolute bottom-8 right-4 glass p-3.5 rounded-xl shadow-lg border border-[#C5A880]/20 flex items-center justify-between gap-3 pointer-events-none z-20">
                <div>
                  <p className="text-[9px] uppercase font-bold text-exotic-purple tracking-widest leading-none">
                    Pendaftaran
                  </p>
                  <p className="text-stone-900 font-bold text-xs mt-1">
                    Gelombang I Dibuka
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Dedicated Cinematic Logo Intro Hero Section
const LogoIntroHero = () => {
  const triggerRef = useRef(null);
  const logoRef = useRef(null);
  const backgroundRef = useRef(null);

  useGSAP(() => {
    // 1. Entrance animation on page load
    const tlEntrance = gsap.timeline();
    
    // Entrance for the E-card (slide in, rotate, scale up)
    tlEntrance.fromTo(
      ".intro-e-card",
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.4, ease: "back.out(1.5)" }
    );
    
    // Entrance for the letter "E" inside the card
    tlEntrance.fromTo(
      ".intro-e-letter",
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power4.out" },
      "-=0.8"
    );

    // Entrance for text "LKP EXOTIC" and "SOLO BARU"
    tlEntrance.fromTo(
      ".intro-text-brand",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
      "-=0.6"
    );
    tlEntrance.fromTo(
      ".intro-text-subtitle",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
      "-=0.8"
    );
    tlEntrance.fromTo(
      ".intro-scroll-indicator",
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    // 2. Continuous floating loops (logo elements + background glows)
    // Gentle floating of the entire logo container
    gsap.to(logoRef.current, {
      y: -8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Gentle breathing glow for the E-card border
    gsap.to(".intro-e-card", {
      borderColor: "rgba(123, 44, 191, 0.6)",
      boxShadow: "0 0 35px rgba(123, 44, 191, 0.45), 0 0 20px rgba(197, 168, 128, 0.25)",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Slow shifting background glows
    gsap.to(".intro-glow-1", {
      x: 60,
      y: -40,
      scale: 1.15,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".intro-glow-2", {
      x: -50,
      y: 50,
      scale: 1.25,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 3. ScrollTrigger to scale down and fade out
    const tlScroll = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "+=100%", // Scroll length is exactly 1 viewport height
        scrub: true,
        pin: true,
        pinSpacing: false, // Page content slides up over it
      }
    });

    tlScroll.to(logoRef.current, {
      scale: 0.7,
      opacity: 0,
      y: -80,
      ease: "power2.inOut"
    })
    .to(backgroundRef.current, {
      opacity: 0,
      ease: "power2.inOut"
    }, 0)
    .to(triggerRef.current, {
      autoAlpha: 0,
      ease: "none"
    });

  }, { scope: triggerRef });

  return (
    <div
      ref={triggerRef}
      className="relative w-full h-[100dvh] bg-stone-950 overflow-hidden z-50 flex flex-col items-center justify-center border-b border-stone-900"
    >
      {/* Ambient Background Glows */}
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="intro-glow-1 absolute -top-1/3 -left-1/3 w-[150%] h-[150%] rounded-full bg-[radial-gradient(circle,rgba(123,44,191,0.18)_0%,transparent_60%)]" />
        <div className="intro-glow-2 absolute -bottom-1/3 -right-1/3 w-[150%] h-[150%] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.12)_0%,transparent_60%)]" />
      </div>

      {/* Centered Logo & Brand Content */}
      <div ref={logoRef} className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 z-10 px-6">
        {/* Squircle Card */}
        <div className="intro-e-card w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-stone-900 border border-stone-800/80 flex items-center justify-center shadow-[0_0_20px_rgba(123,44,191,0.25)] transition-all duration-300">
          <span className="intro-e-letter font-serif font-bold text-exotic-purple text-6xl sm:text-7xl select-none">
            E
          </span>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col text-center sm:text-left">
          <h1 className="intro-text-brand font-serif font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-wide">
            LKP <span className="text-exotic-purple">EXOTIC</span>
          </h1>
          <span className="intro-text-subtitle text-xs sm:text-sm uppercase font-bold text-[#C5A880] tracking-[0.35em] sm:tracking-[0.45em] mt-3 sm:mt-4 leading-none block">
            Solo Baru
          </span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="intro-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 pointer-events-none">
        <span className="text-[9px] uppercase font-bold text-stone-500 tracking-[0.25em] select-none">
          Scroll Down
        </span>
        <div className="w-6 h-10 rounded-full border border-stone-850 flex justify-center p-1.5 bg-stone-950/40 backdrop-blur-sm shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-bounce" />
        </div>
      </div>
    </div>
  );
};

const courses = [
  {
    title: "Kursus Salon Kecantikan (Complete)",
    tag: "Terpopuler",
    duration: "3 Bulan | 40 Sesi",
    cert: "Sertifikat Resmi LKP",
    desc: "Program lengkap yang dirancang khusus untuk Anda yang ingin menguasai keterampilan kecantikan salon secara menyeluruh, dari teknik dasar hingga manajemen operasional salon kecantikan profesional.",
    highlights: [
      "Potong Rambut Dasar & Modern (Wanita & Pria)",
      "Perawatan Rambut (Creambath, Hair Spa, Hair Mask)",
      "Perawatan Wajah (Facial Tradisional & Modern)",
      "Manajemen Keuangan, Inventaris & Bisnis Salon",
    ],
    price: "Hubungi Admin (Cicilan Tersedia)",
    image: "/images/hero_beauty.png",
  },
  {
    title: "Hairstyling & Coloring Course",
    tag: "Best Seller",
    duration: "1.5 Bulan | 20 Sesi",
    cert: "Sertifikat Kompetensi",
    desc: "Kuasai seni penataan rambut modern (hairstyling), sanggul modern, blowout, catok curly, serta tren teknik pewarnaan rambut terkini seperti balayage, ombre, dan highlighting.",
    highlights: [
      "Teknik Blow-Dry, Sanggul Modern & Styling Pengantin",
      "Pewarnaan Rambut Dasar & Pemilihan Bleaching",
      "Trend Pewarnaan Fashion (Balayage, Highlight, Ombre)",
      "Perawatan Pasca-Pewarnaan & Keamanan Kimia",
    ],
    price: "Hubungi Admin untuk Promo",
    image: "/images/course_hair.png",
  },
  {
    title: "Hair Extensions Course",
    tag: "Spesialisasi",
    duration: "2 Minggu | 6 Sesi",
    cert: "Sertifikat Khusus",
    desc: "Pelajari rahasia pemasangan hair extensions yang rapi, aman, dan tahan lama menggunakan berbagai metode modern. Peluang keuntungan yang sangat tinggi di industri kecantikan.",
    highlights: [
      "Metode Pemasangan Micro-Ring, Tape, dan Sewing (Jahit)",
      "Teknik Pemilihan Rambut Asli Berkualitas Tinggi",
      "Perawatan, Pencucian & Re-styling Hair Extensions",
      "Pelepasan & Re-conditioning Hair Extensions tanpa merusak rambut asli",
    ],
    price: "Hubungi Admin",
    image: "/images/hero_beauty.png",
  },
  {
    title: "Professional Make-Up Artist (MUA) Course",
    tag: "Rekomendasi",
    duration: "1 Bulan | 12 Sesi",
    cert: "Portofolio & Sertifikat",
    desc: "Ubah bakat merias Anda menjadi karir profesional. Pelajari teknik koreksi wajah, rias mata dramatis, contouring, serta riasan untuk wisuda, prewedding, pengantin, hingga photoshoot komersial.",
    highlights: [
      "Koreksi Wajah (Contouring, Highlighting & Rias Mata 3D)",
      "MUA Riasan Natural, Glamour, Wisuda, dan Pesta",
      "Riasan Pengantin Tradisional & Modern",
      "Tips Foto Portofolio & Pemasaran Jasa MUA di Media Sosial",
    ],
    price: "Hubungi Admin (Free Alat Praktik di Kelas)",
    image: "/images/course_makeup.png",
  },
];

const testimonials = [
  {
    name: "Riska Amalia",
    role: "Alumni 2025 - Owner Riska Beauty Salon",
    rating: 5,
    text: "Kursusnya sangat menyenangkan! Instrukturnya sabar sekali mengajarkan potong rambut dari yang sama sekali tidak bisa memegang gunting sampai sekarang saya sudah berani membuka jasa salon sendiri di rumah. Sangat direkomendasikan bagi pemula!",
  },
  {
    name: "Dwi Hapsari",
    role: "Alumni 2025 - Profesional Hairstylist",
    rating: 5,
    text: "LKP Exotic Solo Baru memang terbaik di Sukoharjo. Saya mengambil kelas hair extension dan salon management. Alat praktiknya lengkap, tempatnya bersih, nyaman ber-AC, dan dekat pusat Solo Baru. Penjelasannya mudah dipahami.",
  },
  {
    name: "Cindy Wijaya",
    role: "Alumni 2024 - Color Specialist",
    rating: 5,
    text: "Materi colouring dan hairstyling di sini sangat update dengan tren salon saat ini. Sertifikat resminya berizin dinas pendidikan, jadi langsung bernilai tinggi saat saya melamar kerja di salon premium. Terima kasih LKP Exotic!",
  },
  {
    name: "Mega Lestari",
    role: "Alumni 2024 - MUA Profesional",
    rating: 5,
    text: "Belajar MUA di LKP Exotic diajarkan secara intensif. Koreksi wajah benar-benar detail dibimbing satu per satu. Model untuk praktik langsung disediakan, produk makeup yang dipakai di kelas pun kosmetik bermerek.",
  },
  {
    name: "Anita Rahayu",
    role: "Alumni 2025 - Pengusaha Salon",
    rating: 5,
    text: "Tempat kursus kecantikan paling terjangkau dengan fasilitas premium di Solo Baru. Mentornya ramah, telaten, dan jam praktiknya fleksibel bisa disesuaikan buat saya yang masih sibuk mengurus rumah tangga.",
  },
  {
    name: "Siti Zulaikha",
    role: "Alumni 2023 - Senior Salon Therapist",
    rating: 5,
    text: "Setelah lulus, saya langsung disalurkan bekerja ke salon rekanan LKP Exotic. Sangat bersyukur karena layanannya nyata, tidak sekadar teori saja. Hubungan alumni dengan LKP pun terjalin sangat erat.",
  },
];

const faqs = [
  {
    q: "Apakah saya harus memiliki keterampilan dasar sebelum mendaftar?",
    a: "Tidak perlu sama sekali. Seluruh materi kursus di LKP Exotic dirancang ramah untuk pemula dan diajarkan secara sabar mulai dari dasar (nol) hingga Anda benar-benar mahir dan percaya diri.",
  },
  {
    q: "Apakah lulusan akan mendapatkan sertifikat resmi?",
    a: "Ya. Setiap peserta yang menyelesaikan program kursus dan dinyatakan lulus berhak menerima Sertifikat Resmi yang diterbitkan oleh LKP Exotic Solo Baru, lengkap dengan tanda izin resmi dari Dinas Pendidikan setempat.",
  },
  {
    q: "Bagaimana jadwal kelasnya? Apakah fleksibel?",
    a: "Kami menyediakan jadwal kelas pagi (09.00 - 12.00) dan siang (13.30 - 16.30). Jadwal hari belajar dapat didiskusikan secara fleksibel bersama mentor agar tidak mengganggu aktivitas rutin Anda.",
  },
  {
    q: "Apakah semua peralatan dan bahan praktik disediakan oleh LKP?",
    a: "Ya, selama proses belajar-mengajar di kelas, LKP Exotic menyediakan peralatan utama dan bahan kosmetik/haircare untuk digunakan secara gratis. Namun, kami juga menyarankan siswa memiliki peralatan dasar sendiri untuk latihan mandiri di rumah.",
  },
  {
    q: "Bagaimana sistem pembayarannya? Apakah bisa dicicil?",
    a: "Tentu bisa. Untuk meringankan pembiayaan, biaya investasi kursus kecantikan kami dapat diangsur dalam 2 hingga 3 kali pembayaran sesuai dengan ketentuan administrasi yang disepakati.",
  },
];

export default function Home() {
  // State for Course Quiz
  const [quizStep, setQuizStep] = useState(0); // 0: intro, 1: goal, 2: field, 3: commitment, 4: result
  

  const [quizAnswers, setQuizAnswers] = useState({
    goal: "",
    field: "",
    commitment: "",
  });
  const [quizResult, setQuizResult] = useState(null);

  // State for FAQs (which accordion is open)
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // State for Save and Share actions
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // State for Contact Form
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "Kursus Salon Kecantikan (Complete)",
    message: "",
  });

  // Course Recommendations Logic
  const handleQuizAnswer = (key, value, nextStep) => {
    const updatedAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(updatedAnswers);

    if (nextStep === 4) {
      // Calculate recommendation
      let recommendation = "";
      let waMessage = "";

      const { field, goal, commitment } = updatedAnswers;

      if (field === "makeup") {
        recommendation = "Professional Make-Up Artist (MUA) Course";
        waMessage = "Halo LKP Exotic, saya telah mencoba kuis rekomendasi di website dan direkomendasikan program 'Professional MUA Course'. Saya ingin bertanya tentang kelas terdekat.";
      } else if (field === "extensions") {
        recommendation = "Hair Extensions Course";
        waMessage = "Halo LKP Exotic, saya telah mencoba kuis rekomendasi di website dan direkomendasikan program 'Hair Extensions Course' (2 minggu). Saya ingin mendaftar.";
      } else if (field === "hairstyling" && commitment === "cepat") {
        recommendation = "Hairstyling & Coloring Course";
        waMessage = "Halo LKP Exotic, saya telah mencoba kuis rekomendasi di website dan direkomendasikan program 'Hairstyling & Coloring Course' (1.5 Bulan). Saya ingin informasi biaya kelas.";
      } else {
        recommendation = "Kursus Salon Kecantikan (Complete)";
        waMessage = "Halo LKP Exotic, saya telah mencoba kuis rekomendasi di website dan direkomendasikan program unggulan 'Kursus Salon Kecantikan (Complete)'. Saya tertarik untuk konsultasi membuka salon.";
      }

      setQuizResult({
        courseName: recommendation,
        waText: waMessage,
      });
    }

    setQuizStep(nextStep);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({ goal: "", field: "", commitment: "" });
    setQuizResult(null);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Dynamic mini alert
    const toast = document.getElementById("toast-save");
    if (toast) {
      toast.classList.remove("opacity-0", "translate-y-4");
      toast.classList.add("opacity-100", "translate-y-0");
      setTimeout(() => {
        toast.classList.remove("opacity-100", "translate-y-0");
        toast.classList.add("opacity-0", "translate-y-4");
      }, 2500);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    } else {
      alert("Tautan disalin ke papan klip!");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Send to WhatsApp
    const waBase = "https://wa.me/6282147630666";
    const text = `Halo LKP Exotic Solo Baru, nama saya ${formData.name}. Saya tertarik dengan "${formData.course}".\n\nPesan: ${formData.message}\nNo. HP: ${formData.phone}`;
    const encodedText = encodeURIComponent(text);

    setTimeout(() => {
      window.open(`${waBase}?text=${encodedText}`, "_blank");
    }, 1000);
  };

  // Use static courses list without shuffle functionality
  const courseList = courses;

  return (
    <div className="flex-1 w-full flex flex-col font-sans bg-gradient-to-tr from-[#FAF8F5] via-[#FAF8F5] to-[#F5EEFD]">
      <LogoIntroHero />

      {/* Toast Notification for Save Action */}
      <div
        id="toast-save"
        className="fixed bottom-24 right-6 z-50 transform translate-y-4 opacity-0 transition-all duration-300 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-stone-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-exotic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {isSaved ? (
          <span>Tautan LKP {renderTextWithExotic("Exotic")} disimpan di browser Anda!</span>
        ) : (
          "Tautan dihapus dari simpanan."
        )}
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-stone-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-exotic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Tautan website berhasil disalin!
        </div>
      )}

      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full glass transition-all border-b border-[#C5A880]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-stone-950 flex items-center justify-center text-exotic-purple font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-stone-950 leading-tight text-lg tracking-wide group-hover:text-exotic-purple transition-colors">
                LKP {renderTextWithExotic("EXOTIC")}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-widest leading-none">
                Solo Baru
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#overview" className="text-stone-600 hover:text-exotic-purple text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-exotic-purple after:transition-all after:duration-300">Overview</a>
            <a href="#courses" className="text-stone-600 hover:text-exotic-purple text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-exotic-purple after:transition-all after:duration-300">Program Kursus</a>
            <a href="#quiz" className="text-exotic-purple hover:text-exotic-purple-hover text-sm font-bold hover:scale-105 transform transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-exotic-purple-hover after:transition-all after:duration-300">Cari Kursus Anda</a>
            <a href="#why-us" className="text-stone-600 hover:text-exotic-purple text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-exotic-purple after:transition-all after:duration-300">Keunggulan</a>
            <a href="#reviews" className="text-stone-600 hover:text-exotic-purple text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-exotic-purple after:transition-all after:duration-300">Testimoni</a>
            <a href="#faq" className="text-stone-600 hover:text-exotic-purple text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-exotic-purple after:transition-all after:duration-300">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:0821-4763-0666"
              className="hidden lg:flex items-center gap-2 text-stone-700 hover:text-exotic-purple font-medium text-sm transition-colors px-3 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-exotic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0821-4763-0666
            </a>
            <a
              href="https://wa.me/6282147630666?text=Halo%20LKP%20Exotic%20Solo%20Baru%2C%20saya%20tertarik%20mendaftar%20kelas%20kursus%20kecantikan.%20Mohon%20informasi%20pendaftarannya."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-stone-950 hover:bg-exotic-purple text-white text-sm font-semibold transition-all duration-350 shadow-md hover:shadow-lg hover:shadow-exotic-purple/25 flex items-center gap-2 hover:-translate-y-0.5 transform animate-pulse-glow hover-glow"
            >
              <span>Daftar Sekarang</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <HeroSection
        title={
          <>
            Mulai Karir Sukses Anda di Bidang{" "}
            <span className="animate-text-shine font-bold italic text-exotic-purple">
              Kecantikan & Salon
            </span>
          </>
        }
        subtitle="Lembaga Kursus & Pelatihan (LKP) resmi di Solo Baru. Dapatkan bimbingan praktik intensif, sertifikat resmi, dan bimbingan wirausaha hingga siap membuka salon kecantikan impian Anda."
        actions={[
          {
            text: "Pilih Program Kursus",
            onClick: () => {
              const el = document.getElementById("courses");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            },
            variant: "default",
            className: "bg-stone-950 hover:bg-exotic-purple text-white font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-exotic-purple/20 hover:-translate-y-0.5 transform animate-pulse-glow hover-glow cursor-pointer"
          },
          {
            text: "Konsultasi Gratis",
            onClick: () => {
              window.open(
                "https://wa.me/6282147630666?text=Halo%20LKP%20Exotic%20Solo%20Baru%2C%20saya%20tertarik%20mendaftar%20atau%20konsultasi%20gratis%20mengenai%20kelas%20kursus%20kecantikan.",
                "_blank",
                "noopener,noreferrer"
              );
            },
            variant: "outline",
            className: "border border-stone-950/20 hover:border-exotic-purple hover:bg-exotic-purple/5 text-stone-950 font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 transform cursor-pointer"
          }
        ]}
        stats={[
          {
            value: "5.0",
            label: "6 Ulasan Google",
            icon: (
              <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            )
          },
          {
            value: "100%",
            label: "Praktik & Dinas Resmi",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-exotic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )
          }
        ]}
        images={[
          "/images/hero_beauty.png",
          "/images/course_hair.png",
          "/images/course_makeup.png"
        ]}
        className="pt-12 pb-24 md:py-32 bg-gradient-to-b from-[#F5EEFD]/50 via-[#FAF8F5]/80 to-[#FAF8F5] flex items-center"
      />

      {/* QUICK OVERVIEW & INTERACTIVE MAPS ACTION STRIP */}
      <section id="overview" className="bg-white border-y border-stone-200 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Core Info Details */}
            <div className="lg:col-span-5 space-y-3">
              <Reveal delay={0}>
                <h2 className="text-xs uppercase tracking-widest font-bold text-exotic-purple">
                  Profil Lembaga
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-stone-950 font-serif">LKP {renderTextWithExotic("Exotic")} Solo Baru</span>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Lembaga resmi pelatihan kecantikan bersertifikat di Sukoharjo. Menyediakan pendidikan keterampilan salon kecantikan rambut, tata rias wajah (MUA), pewarnaan, dan perawatan salon.
                </p>
              </Reveal>
            </div>

            {/* Interactive Action Tiles (Google Maps style) */}
            <div className="lg:col-span-7 flex flex-wrap items-center gap-3 sm:justify-end">

              {/* Button: Website */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-exotic-purple/5 hover:text-exotic-purple hover:border-exotic-purple/30 transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 transform hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 4.03 3 9s-1.343 9-3 9m0-18c-1.657 0-3 4.03-3 9s1.343 9 3 9m-9-9h18" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Website</span>
              </button>

              {/* Button: Directions */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=LKP+Exotic+Solo+Baru+Dusun+I+Madegondo+Solobaru+Sukoharjo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-exotic-purple/5 hover:text-exotic-purple hover:border-exotic-purple/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1 transform hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 12l6-3m-6 3V7m6 9l4.553 2.276A1 1 0 0121 17.382V6.618a1 1-.553-.894L15 4m0 12V4m0 0L9 7" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Rute</span>
              </a>

              {/* Button: Save */}
              <button
                onClick={handleSave}
                className={`flex flex-col items-center justify-center w-20 h-16 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 transform hover:shadow-md ${isSaved
                  ? "bg-exotic-purple/10 text-exotic-purple border-exotic-purple/20 font-semibold"
                  : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-exotic-purple/5 hover:text-exotic-purple hover:border-exotic-purple/30"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mb-1 ${isSaved ? "fill-current" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">{isSaved ? "Tersimpan" : "Simpan"}</span>
              </button>

              {/* Button: Share */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-exotic-purple/5 hover:text-exotic-purple hover:border-exotic-purple/30 transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 transform hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.03-2.015m0 4.542l-4.03-2.015m5.906-5.485a3 3 0 110-6 3 3 0 010 6zm-9.75 4.5a3 3 0 110-6 3 3 0 010 6zm9.75 4.5a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider font-semibold">Bagikan</span>
              </button>

              {/* Button: Call */}
              <a
                href="tel:0821-4763-0666"
                className="flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-exotic-purple/5 hover:text-exotic-purple hover:border-exotic-purple/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1 transform hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Telepon</span>
              </a>

            </div>

          </div>

          {/* Location details card row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-stone-200">

            <Reveal delay={100} className="w-full">
              <div className="flex gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-exotic-purple/5 flex items-center justify-center text-exotic-purple group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">Alamat Lengkap</p>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                    Jl. Ir. Soekarno Blok HA, Dusun I, Madegondo, Solobaru, Kabupaten Sukoharjo, Jawa Tengah 57552
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="w-full">
              <div className="flex gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-exotic-purple/5 flex items-center justify-center text-exotic-purple group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">Jam Operasional</p>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                    <span className="text-emerald-600 font-bold">Buka</span> · Tutup pukul 20.00
                  </p>
                  <p className="text-stone-400 text-[10px] mt-0.5">Senin - Sabtu (Hari Minggu Libur)</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300} className="w-full">
              <div className="flex gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-exotic-purple/5 flex items-center justify-center text-exotic-purple group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">Pendaftaran & Jadwal</p>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                    Buku Janji Temu Online: <a href="https://bit.ly/lkp-exotic-appointment" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline font-semibold">bit.ly/lkp-exotic-appointment</a>
                  </p>
                  <p className="text-stone-600 text-xs mt-0.5">Hubungi Admin: 0821-4763-0666</p>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </section>
      {/* COURSE LIST SECTION */}
      <section id="courses" className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <Reveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs uppercase font-bold text-exotic-purple tracking-widest">
                Program Kursus Kecantikan Resmi
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-semibold leading-tight">
                Pilih Program Keahlian Terbaik Anda
              </h2>
              <p className="text-stone-600 font-sans leading-relaxed">
                Materi kursus terstruktur dari dasar. Didampingi instruktur ahli yang telaten dan berpengalaman di bidang salon kecantikan.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courseList.map((course) => (
                <div key={course.title} className="flex">
                  <HolographicCard>

                    {/* Course Card Cover */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Tag badge */}
                      <span className="absolute top-4 left-4 inline-flex px-3 py-1 bg-stone-950 text-exotic-purple-light text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {course.tag}
                      </span>

                      {/* Program title overlaid in cover */}
                      <h3 className="absolute bottom-4 left-4 right-4 text-white font-serif text-xl sm:text-2xl font-semibold leading-snug drop-shadow-md">
                        {course.title}
                      </h3>
                    </div>

                    {/* Course Details Body */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">

                        {/* Duration / Certificate Tags */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1.5 font-bold text-exotic-purple bg-exotic-purple-light/40 px-2.5 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            {course.cert}
                          </span>
                        </div>

                        <p className="text-stone-600 text-sm leading-relaxed">
                          {course.desc}
                        </p>

                        {/* Highlights bullet list */}
                        <div className="space-y-2 pt-2">
                          <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">Materi Utama:</p>
                          <ul className="grid grid-cols-1 gap-2">
                            {course.highlights.map((highlight, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2.5 text-xs text-stone-600">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5">
                                  ✓
                                </span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Pricing / Booking button */}
                      <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Biaya Kursus</p>
                          <p className="text-stone-900 font-bold text-sm mt-0.5">{course.price}</p>
                        </div>

                        <a
                          href={`https://wa.me/6282147630666?text=Halo%20LKP%20Exotic%20Solo%20Baru%2C%20saya%20tertarik%20mendaftar%20atau%20tanya%20detail%20mengenai%20program%3A%20${encodeURIComponent(course.title)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-full bg-stone-950 hover:bg-exotic-purple text-white text-center text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 transform hover-glow"
                        >
                          Daftar / Konsultasi
                        </a>
                      </div>

                    </div>

                  </HolographicCard>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ACCREDITATION & KEY STRENGTHS SECTION */}
      <section id="why-us" className="py-20 bg-stone-900 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(123,44,191,0.08),transparent_40%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Accreditation details left side */}
            <div className="lg:col-span-5 space-y-6">
              <Reveal delay={0}>
                <span className="inline-block px-3.5 py-1.5 bg-exotic-purple/20 text-exotic-purple-light text-xs font-bold uppercase tracking-widest rounded-md border border-exotic-purple/30">
                  Pendidikan Resmi Berlisensi
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight mt-3">
                  Mengapa Memilih LKP {renderTextWithExotic("Exotic")} Solo Baru?
                </h2>
                <p className="text-stone-400 text-base leading-relaxed mt-2">
                  Kami berkomitmen mencetak lulusan terampil yang siap pakai di industri kecantikan dan salon. LKP {renderTextWithExotic("Exotic")} terdaftar dan diakui secara resmi oleh Dinas Pendidikan, menjamin legitimasi sertifikat belajar Anda.
                </p>

                {/* Star review overlay info */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-center mt-6">
                  <div className="w-12 h-12 rounded-xl bg-exotic-purple/10 flex items-center justify-center text-exotic-purple-light">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-exotic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">100% Tingkat Kepuasan Alumni</p>
                    <p className="text-xs text-stone-400 mt-1">Ulasan sempurna bintang 5.0 dari semua alumni terdata di Google Maps.</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Strengths Grid right side */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">

              <Reveal delay={100} className="w-full">
                <div className="p-6 rounded-2xl bg-stone-900 border border-white/5 space-y-3 hover:border-exotic-purple/20 transition-all duration-300 hover-lift">
                  <span className="text-2xl text-exotic-purple font-bold">01</span>
                  <h4 className="text-base font-bold">Kurikulum 100% Praktik</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Lebih banyak praktik langsung menggunakan manekin dan model hidup (human hair model) untuk membangun rasa percaya diri di kelas.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={200} className="w-full">
                <div className="p-6 rounded-2xl bg-stone-900 border border-white/5 space-y-3 hover:border-exotic-purple/20 transition-all duration-300 hover-lift">
                  <span className="text-2xl text-exotic-purple font-bold">02</span>
                  <h4 className="text-base font-bold">Sertifikat Resmi Dinas</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Sertifikat kelulusan LKP berizin resmi yang diakui secara nasional. Sangat berguna untuk melamar kerja atau prasyarat SIUP Salon.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300} className="w-full">
                <div className="p-6 rounded-2xl bg-stone-900 border border-white/5 space-y-3 hover:border-exotic-purple/20 transition-all duration-300 hover-lift">
                  <span className="text-2xl text-exotic-purple font-bold">03</span>
                  <h4 className="text-base font-bold">Jadwal Belajar Fleksibel</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Mendukung kelas privat atau semi-privat dengan jadwal belajar fleksibel yang disepakati bersama mentor kecantikan Anda.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={400} className="w-full">
                <div className="p-6 rounded-2xl bg-stone-900 border border-white/5 space-y-3 hover:border-exotic-purple/20 transition-all duration-300 hover-lift">
                  <span className="text-2xl text-exotic-purple font-bold">04</span>
                  <h4 className="text-base font-bold">Bimbingan Wirausaha</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Konsultasi cara memulai bisnis salon, penataan tata ruang salon kecantikan, penyediaan bahan kimia rambut, hingga taktik pemasaran.
                  </p>
                </div>
              </Reveal>

            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE COURSE ADVISOR QUIZ SECTION */}
      <section id="quiz" className="py-20 bg-gradient-to-b from-[#F5EEFD]/20 to-[#FAF8F5] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal delay={0}>
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-200/85 hover:border-exotic-purple/10 hover:shadow-exotic-purple/5 transition-all duration-500">

              <div className="text-center space-y-4 mb-8">
                <span className="text-xs uppercase font-bold text-exotic-purple tracking-widest">
                  Interactive Advisor
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-semibold leading-tight">
                  Pencari Kursus Impian Anda
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed">
                  Bingung memilih program? Jawab 3 pertanyaan singkat ini untuk mengetahui program kecantikan LKP {renderTextWithExotic("Exotic")} yang paling sesuai dengan cita-cita Anda!
                </p>
              </div>

              {/* Progress indicators */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${quizStep === step
                      ? "w-8 bg-exotic-purple"
                      : quizStep > step
                        ? "w-4 bg-exotic-purple/40"
                        : "w-2 bg-stone-200"
                      }`}
                  />
                ))}
              </div>

              {/* Quiz Flow Rendering */}
              <div className="min-h-[220px] flex flex-col justify-center">

                {/* Step 0: Welcome / Intro */}
                {quizStep === 0 && (
                  <div className="text-center space-y-6 animate-fade-in-up">
                    <p className="text-stone-700 text-sm leading-relaxed">
                      Kami akan menganalisis tujuan karir, minat utama, dan waktu belajar Anda untuk memberikan saran program kursus yang paling efektif dan tepat sasaran.
                    </p>
                    <button
                      onClick={() => setQuizStep(1)}
                      className="px-8 py-3.5 rounded-full bg-stone-950 hover:bg-exotic-purple text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:shadow-exotic-purple/20 animate-pulse-glow hover-glow"
                    >
                      Mulai Analisis Kursus
                    </button>
                  </div>
                )}

                {/* Step 1: Goal */}
                {quizStep === 1 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <h3 className="text-base font-bold text-stone-950 text-center mb-6">
                      1. Apa target utama Anda setelah menyelesaikan kursus kecantikan?
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
                      {[
                        { val: "bisnis", label: "Membuka salon kecantikan / studio rambut mandiri" },
                        { val: "kerja", label: "Bekerja profesional sebagai Hairstylist / MUA di salon ternama" },
                        { val: "hobi", label: "Menyalurkan hobi kecantikan dan melakukan servis rambut keluarga" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleQuizAnswer("goal", opt.val, 2)}
                          className="p-4 text-left text-sm rounded-xl border border-stone-200 hover:border-exotic-purple hover:bg-exotic-purple/5 text-stone-700 font-medium transition-all duration-300 cursor-pointer hover:translate-x-1 transform"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Field of Interest */}
                {quizStep === 2 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <h3 className="text-base font-bold text-stone-950 text-center mb-6">
                      2. Bidang keahlian mana yang paling Anda minati?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                      {[
                        { val: "salon_complete", label: "Perawatan & Operasional Salon Kecantikan Lengkap" },
                        { val: "hairstyling", label: "Pewarnaan & Tata Rambut Modern (Hairstyling)" },
                        { val: "extensions", label: "Pemasangan Hair Extensions Rambut Asli" },
                        { val: "makeup", label: "Tata Rias Wajah MUA (Makeup Artist)" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleQuizAnswer("field", opt.val, 3)}
                          className="p-4 text-left text-sm rounded-xl border border-stone-200 hover:border-exotic-purple hover:bg-exotic-purple/5 text-stone-700 font-medium transition-all duration-300 cursor-pointer hover:translate-x-1 transform"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Commitment / Time */}
                {quizStep === 3 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <h3 className="text-base font-bold text-stone-950 text-center mb-6">
                      3. Berapa lama komitmen waktu belajar yang Anda kehendaki?
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
                      {[
                        { val: "cepat", label: "Kursus Intensif Cepat Selesai (2 minggu hingga 1.5 bulan)" },
                        { val: "menyeluruh", label: "Kursus Komprehensif Mendalam (3 bulan penuh)" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleQuizAnswer("commitment", opt.val, 4)}
                          className="p-4 text-left text-sm rounded-xl border border-stone-200 hover:border-exotic-purple hover:bg-exotic-purple/5 text-stone-700 font-medium transition-all duration-300 cursor-pointer hover:translate-x-1 transform"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Result */}
                {quizStep === 4 && quizResult && (
                  <div className="text-center space-y-6 animate-fade-in-up">
                    <div className="inline-flex px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold tracking-wide border border-emerald-100 animate-pulse">
                      Analisis Berhasil
                    </div>

                    <div className="space-y-2">
                      <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Program Rekomendasi Anda:</p>
                      <h4 className="font-serif text-2xl sm:text-3xl font-bold animate-text-shine">
                        {quizResult.courseName}
                      </h4>
                    </div>

                    <p className="text-stone-600 text-sm max-w-md mx-auto">
                      Program ini sangat cocok dengan preferensi minat, sasaran jangka panjang, dan jadwal luang yang Anda pilih dalam kuis penasihat kecantikan kami.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                      <button
                        onClick={resetQuiz}
                        className="px-6 py-3 rounded-full border border-stone-200 hover:border-exotic-purple hover:text-exotic-purple font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer hover:scale-105 transform"
                      >
                        Ulangi Kuis
                      </button>
                      <a
                        href={`https://wa.me/6282147630666?text=${encodeURIComponent(quizResult.waText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3.5 rounded-full bg-stone-950 hover:bg-exotic-purple text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-exotic-purple/20 flex items-center gap-2 hover:scale-105 transform animate-pulse-glow hover-glow"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.022L2 22l5.13-1.346a9.92 9.92 0 004.882 1.277h.005c5.505 0 9.989-4.478 9.99-9.985A9.97 9.97 0 0012.012 2zm5.72 14.186c-.23.656-1.157 1.218-1.597 1.285-.39.06-.9.122-2.73-.62-2.333-.948-3.805-3.32-3.92-3.479-.118-.158-.95-1.266-.95-2.42 0-1.153.606-1.72.825-1.948.22-.228.483-.285.644-.285.16 0 .32.003.46.01.144.006.33.003.504.423.18.43.617 1.503.67 1.613.054.11.09.24.017.388-.073.148-.11.24-.22.368-.11.127-.23.284-.33.38-.11.107-.225.224-.097.447.128.223.57.94 1.22 1.52.836.746 1.538.977 1.758 1.09.22.112.347.093.478-.057.13-.15.568-.66.72-.885.15-.225.3-.187.506-.113.207.075 1.307.617 1.533.73.226.113.377.168.433.264.056.096.056.556-.174 1.212z" />
                        </svg>
                        Daftar Via WhatsApp
                      </a>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </Reveal>

        </div>
      </section>

      {/* STUDENT REVIEWS SECTION */}
      <section id="reviews" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal delay={0}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-4 max-w-2xl text-left">
                <span className="text-xs uppercase font-bold text-exotic-purple tracking-widest">
                  Ulasan Google Maps
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-semibold leading-tight">
                  Apa Kata Alumni LKP {renderTextWithExotic("Exotic")}?
                </h2>
                <p className="text-stone-600 font-sans leading-relaxed">
                  Kami bangga telah mendidik puluhan alumni hingga mandiri and berdaya. Ulasan di bawah ini asli diambil dari ulasan Google Maps kami dengan nilai bintang 5.0 sempurna.
                </p>
              </div>

              {/* Google maps rating score badge */}
              <div className="bg-exotic-purple-light/20 border border-exotic-purple/10 p-5 rounded-2xl flex items-center gap-4 flex-shrink-0">
                <div className="text-center">
                  <p className="text-3xl font-bold text-exotic-purple font-serif leading-none">5.0</p>
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1.5">Rating Sempurna</p>
                </div>
                <div className="h-10 w-px bg-exotic-purple/20" />
                <div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 font-medium">Berdasarkan 6 Ulasan Asli</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Testimonial Marquee Row */}
          <Reveal delay={150} duration={1000}>
            <div className="relative w-full overflow-hidden py-4 pause-hover">
              <div className="flex gap-6 w-max animate-marquee">
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] sm:w-[380px] p-6 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col justify-between space-y-6 hover:bg-white hover:border-exotic-purple/10 hover:shadow-xl hover:shadow-exotic-purple/5 transition-all duration-350 flex-shrink-0 hover:-translate-y-1 transform"
                  >
                    <div className="space-y-4">
                      {/* Stars indicator */}
                      <div className="flex">
                        {[...Array(t.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-stone-700 text-sm leading-relaxed font-sans italic">
                        &quot;{renderTextWithExotic(t.text)}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50 flex-shrink-0">
                      {/* Initials Avatar */}
                      <div className="w-10 h-10 rounded-full bg-exotic-purple/10 text-exotic-purple font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {t.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-950">{t.name}</h4>
                        <p className="text-[10px] text-stone-500 mt-0.5">{t.role}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </Reveal>


        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-gradient-to-b from-[#FAF8F5] to-[#F5EEFD]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal delay={0}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-xs uppercase font-bold text-exotic-purple tracking-widest">
                Tanya Jawab
              </span>
              <h2 className="font-serif text-3xl text-stone-950 font-semibold leading-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-stone-600 font-sans leading-relaxed text-sm">
                Temukan jawaban atas beberapa pertanyaan umum dari calon siswa seputar kursus kecantikan LKP {renderTextWithExotic("Exotic")}.
              </p>
            </div>
          </Reveal>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <Reveal key={idx} delay={idx * 50} className="w-full">
                  <FaqItem
                    faq={faq}
                    isOpen={isOpen}
                    onToggle={() => toggleFaq(idx)}
                  />
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* DETAILED CONTACT, MAPS & GALLERY SECTION */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

            {/* Gallery and Iframe Maps Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">

              {/* Studio Gallery Grid */}
              <Reveal delay={100} className="space-y-4">
                <span className="text-xs uppercase font-bold text-exotic-purple tracking-widest block">
                  Galeri Studio LKP {renderTextWithExotic("Exotic")}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="/images/course_hair.png"
                      alt="Hair Class Practice"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="/images/course_makeup.png"
                      alt="Makeup Class Practice"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Reveal>

              {/* Embedded Interactive Google Map */}
              <Reveal delay={250} className="space-y-4 flex-1 flex flex-col">
                <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Peta Lokasi Kursus
                </p>
                <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex-1 min-h-[280px]">
                  <iframe
                    title="LKP Exotic Solo Baru Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.6865249405626!2d110.8105658!3d-7.6090626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a17dd1f6cc447%3A0xc0c8d19760773d!2sLKP%20Exotic!5e0!3m2!1sid!2sid!4v1719213500000!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[280px]"
                  />
                </div>
              </Reveal>

            </div>

            {/* Direct Contact Form Column */}
            <Reveal delay={200} className="lg:col-span-5 flex">
              <div className="w-full bg-stone-50 rounded-3xl p-8 border border-stone-200 flex flex-col justify-between hover:border-exotic-purple/10 hover:shadow-xl hover:shadow-exotic-purple/5 transition-all duration-300">

                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-stone-950 font-semibold leading-tight">
                      Kirim Pesan Konsultasi
                    </h3>
                    <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
                      Isi formulir pendaftaran minat di bawah ini. Tim administrasi LKP {renderTextWithExotic("Exotic")} Solo Baru akan menghubungi Anda segera melalui WhatsApp.
                    </p>
                  </div>

                  {!formSubmitted ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4">

                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Contoh: Rania Permata"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-exotic-purple focus:ring-1 focus:ring-exotic-purple text-sm text-stone-900 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                          Nomor WhatsApp / HP
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-exotic-purple focus:ring-1 focus:ring-exotic-purple text-sm text-stone-900 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="course" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                          Pilihan Program Kursus
                        </label>
                        <select
                          id="course"
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-exotic-purple focus:ring-1 focus:ring-exotic-purple text-sm text-stone-900 transition-all"
                        >
                          <option>Kursus Salon Kecantikan (Complete)</option>
                          <option>Hairstyling & Coloring Course</option>
                          <option>Hair Extensions Course</option>
                          <option>Professional Make-Up Artist (MUA) Course</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                          Pertanyaan / Catatan Tambahan (Opsional)
                        </label>
                        <textarea
                          id="message"
                          rows="3"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tuliskan jika ada kendala jam masuk, cicilan biaya, atau minat khusus lainnya..."
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-exotic-purple focus:ring-1 focus:ring-exotic-purple text-sm text-stone-900 resize-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-exotic-purple text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:shadow-exotic-purple/20 cursor-pointer text-center transform hover:-translate-y-0.5 duration-350 animate-pulse-glow hover-glow"
                      >
                        Kirim Formulir & Chat WA
                      </button>

                    </form>
                  ) : (
                    <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 text-center space-y-4 animate-fade-in-up">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                        ✓
                      </div>
                      <div className="space-y-1">
                        <p className="text-emerald-950 font-bold text-sm">Formulir Terkirim!</p>
                        <p className="text-emerald-700 text-xs">
                          Kami mengalihkan Anda ke WhatsApp Admin LKP {renderTextWithExotic("Exotic")}. Mohon kirimkan pesan chat di WhatsApp untuk merespon cepat.
                        </p>
                      </div>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="text-stone-500 hover:text-stone-850 text-xs font-semibold underline block mx-auto cursor-pointer"
                      >
                        Kirim Ulang Formulir
                      </button>
                    </div>
                  )}
                </div>

                {/* Security info note */}
                <div className="mt-8 pt-6 border-t border-stone-200/60 flex items-center gap-3 text-[10px] text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Privasi aman. Data pendaftaran Anda langsung ditransmisikan secara enkripsi ke WhatsApp admin resmi.</span>
                </div>

              </div>
            </Reveal>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-white/5 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">

            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-exotic-purple flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-exotic-purple/20">
                  E
                </div>
                <span className="font-serif font-bold text-white leading-tight text-base tracking-wide">
                  LKP {renderTextWithExotic("EXOTIC")} SOLO BARU
                </span>
              </div>
              <p className="text-stone-400 leading-relaxed max-w-sm">
                Lembaga resmi penyedia kursus kecantikan salon profesional, sanggul, pewarnaan, hair extension, dan make-up di Solo Baru, Sukoharjo.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=LKP+Exotic+Solo+Baru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-exotic-purple hover:text-white flex items-center justify-center transition-colors text-base"
                  aria-label="Google Maps"
                >
                  📍
                </a>
                <a
                  href="tel:0821-4763-0666"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-exotic-purple hover:text-white flex items-center justify-center transition-colors text-base"
                  aria-label="Phone"
                >
                  📞
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Program Belajar</h4>
              <ul className="space-y-2">
                <li><a href="#courses" className="hover:text-white transition-colors">Kursus Salon Complete</a></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Hairstyling & Coloring</a></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Hair Extensions Course</a></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Professional MUA Class</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Informasi Kontak</h4>
              <ul className="space-y-2 leading-relaxed">
                <li>Jl. Ir. Soekarno Blok HA</li>
                <li>Solobaru, Sukoharjo</li>
                <li>Jawa Tengah 57552</li>
                <li>WhatsApp: 0821-4763-0666</li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-stone-500">
              &copy; {new Date().getFullYear()} LKP {renderTextWithExotic("Exotic")} Solo Baru. All Rights Reserved.
            </p>
            <p className="text-[10px] text-stone-500">
              LKP Salon dan Kecantikan {renderTextWithExotic("Exotic")} | zalde
            </p>
          </div>

        </div>
      </footer>

      {/* MOBILE STICKY FLOATING CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 border-t border-stone-200 shadow-xl p-3 flex md:hidden items-center justify-between gap-3 backdrop-blur-md">
        <a
          href="tel:0821-4763-0666"
          className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Admin
        </a>
        <a
          href="https://wa.me/6282147630666?text=Halo%20LKP%20Exotic%20Solo%20Baru%2C%20saya%20tertarik%20mendaftar%20kelas%20kursus%20kecantikan.%20Mohon%20informasi%20pendaftarannya."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-stone-950 hover:bg-exotic-purple text-white text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-exotic-purple/20 duration-200"
        >
          <span>Chat WA</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.022L2 22l5.13-1.346a9.92 9.92 0 004.882 1.277h.005c5.505 0 9.989-4.478 9.99-9.985A9.97 9.97 0 0012.012 2zm5.72 14.186c-.23.656-1.157 1.218-1.597 1.285-.39.06-.9.122-2.73-.62-2.333-.948-3.805-3.32-3.92-3.479-.118-.158-.95-1.266-.95-2.42 0-1.153.606-1.72.825-1.948.22-.228.483-.285.644-.285.16 0 .32.003.46.01.144.006.33.003.504.423.18.43.617 1.503.67 1.613.054.11.09.24.017.388-.073.148-.11.24-.22.368-.11.127-.23.284-.33.38-.11.107-.225.224-.097.447.128.223.57.94 1.22 1.52.836.746 1.538.977 1.758 1.09.22.112.347.093.478-.057.13-.15.568-.66.72-.885.15-.225.3-.187.506-.113.207.075 1.307.617 1.533.73.226.113.377.168.433.264.056.096.056.556-.174 1.212z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
