import { easeOut, easeInOut } from 'framer-motion';

// Optimized animation configurations for 60fps performance
export const optimizedAnimations = {
  // Fast, snappy transitions (60fps target)
  fast: {
    duration: 0.15,
    ease: "easeOut" as const,
  },
  
  // Standard transitions
  standard: {
    duration: 0.25,
    ease: "easeOut" as const,
  },
  
  // Smooth, longer transitions
  smooth: {
    duration: 0.4,
    ease: "easeInOut" as const,
  },
  
  // Page transitions
  page: {
    duration: 0.3,
    ease: "easeOut" as const,
  },
  
  // Stagger delays for list animations
  stagger: {
    delayChildren: 0.05,
    staggerChildren: 0.05,
  },
};

// GPU-accelerated transform values for optimal performance
export const gpuTransforms = {
  // Use transform3d to force GPU acceleration
  translateY: (value: number) => `translate3d(0, ${value}px, 0)`,
  translateX: (value: number) => `translate3d(${value}px, 0, 0)`,
  scale: (value: number) => `scale3d(${value}, ${value}, 1)`,
  rotate: (value: number) => `rotate3d(0, 0, 1, ${value}deg)`,
};

// Optimized variants for common animations
export const animationVariants = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: optimizedAnimations.standard,
    },
  },
  
  // Fade in from top
  fadeInDown: {
    hidden: { 
      opacity: 0, 
      y: -20,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: optimizedAnimations.standard,
    },
  },
  
  // Scale in
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: optimizedAnimations.standard,
    },
  },
  
  // Slide in from left
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -20,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: optimizedAnimations.standard,
    },
  },
  
  // Slide in from right
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: 20,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: optimizedAnimations.standard,
    },
  },
  
  // Hover effects
  hover: {
    hover: {
      y: -4,
      scale: 1.02,
      transition: optimizedAnimations.fast,
    },
  },
  
  // Card hover effects
  cardHover: {
    hover: {
      y: -8,
      scale: 1.02,
      transition: optimizedAnimations.fast,
    },
  },
  
  // Button hover effects
  buttonHover: {
    hover: {
      scale: 1.05,
      transition: optimizedAnimations.fast,
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  },
};

// Container variants for staggered animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ...optimizedAnimations.stagger,
      duration: 0.3,
    },
  },
};

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: optimizedAnimations.page,
  },
  out: {
    opacity: 0,
    y: -20,
    transition: optimizedAnimations.page,
  },
};

// CSS classes for GPU acceleration
export const gpuAccelerationClasses = {
  // Force GPU acceleration
  gpu: 'transform-gpu will-change-transform',
  
  // Optimize for specific properties
  transform: 'will-change-transform',
  opacity: 'will-change-opacity',
  auto: 'will-change-auto',
};

// Utility function to create optimized transition configs
export const createOptimizedTransition = (
  duration: number = 0.25,
  ease: string = "easeOut",
  delay: number = 0
) => ({
  duration,
  ease,
  delay,
});

// Utility function to create staggered animations
export const createStaggeredAnimation = (
  staggerDelay: number = 0.05,
  duration: number = 0.25
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: staggerDelay,
      staggerChildren: staggerDelay,
      duration,
    },
  },
});

// Performance monitoring utilities
export const animationPerformance = {
  // Check if device supports 60fps animations
  supports60fps: () => {
    if (typeof window === 'undefined') return true;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;
    
    // Check for low-end devices (basic heuristic)
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    if (isLowEndDevice) return false;
    
    return true;
  },
  
  // Get optimized duration based on device capabilities
  getOptimizedDuration: (baseDuration: number) => {
    return animationPerformance.supports60fps() ? baseDuration : baseDuration * 1.5;
  },
  
  // Apply reduced motion if user prefers it
  getReducedMotionConfig: () => {
    if (typeof window === 'undefined') return {};
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return {
        duration: 0.01,
        ease: "linear" as const,
      };
    }
    
    return {};
  },
};

// Export commonly used animation configurations
export const commonAnimations = {
  // Quick fade
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: optimizedAnimations.fast,
    },
  },
  
  // Quick scale
  scale: {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: optimizedAnimations.fast,
    },
  },
  
  // Quick slide up
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: optimizedAnimations.fast,
    },
  },
}; 