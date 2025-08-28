import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isSmooth: boolean;
  deviceCapability: 'high' | 'medium' | 'low';
}

interface AnimationPerformanceConfig {
  targetFPS?: number;
  frameTimeThreshold?: number;
  enableMonitoring?: boolean;
}

export function useAnimationPerformance(config: AnimationPerformanceConfig = {}) {
  const {
    targetFPS = 60,
    frameTimeThreshold = 16.67, // 60fps = ~16.67ms per frame
    enableMonitoring = false
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    isSmooth: false,
    deviceCapability: 'high'
  });

  const [isMonitoring, setIsMonitoring] = useState(enableMonitoring);

  // Detect device capability
  const detectDeviceCapability = useCallback((): 'high' | 'medium' | 'low' => {
    if (typeof window === 'undefined') return 'high';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return 'low';

    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 2) return 'low';
    if (cores <= 4) return 'medium';
    
    // Check memory (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
      if (memoryGB < 2) return 'low';
      if (memoryGB < 4) return 'medium';
    }

    return 'high';
  }, []);

  // Monitor frame rate
  const monitorFrameRate = useCallback(() => {
    if (!isMonitoring || typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFrame = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) { // Measure every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const frameTime = (currentTime - lastTime) / frameCount;
        const isSmooth = fps >= targetFPS && frameTime <= frameTimeThreshold;
        
        setMetrics({
          fps,
          frameTime: Math.round(frameTime * 100) / 100,
          isSmooth,
          deviceCapability: detectDeviceCapability()
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFrame);
    };

    animationId = requestAnimationFrame(measureFrame);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMonitoring, targetFPS, frameTimeThreshold, detectDeviceCapability]);

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Get optimized animation settings based on device capability
  const getOptimizedSettings = useCallback(() => {
    const capability = detectDeviceCapability();
    
    switch (capability) {
      case 'low':
        return {
          duration: 0.1,
          ease: 'linear' as const,
          staggerDelay: 0.02,
          enableComplexAnimations: false
        };
      case 'medium':
        return {
          duration: 0.2,
          ease: 'easeOut' as const,
          staggerDelay: 0.03,
          enableComplexAnimations: true
        };
      case 'high':
      default:
        return {
          duration: 0.25,
          ease: 'easeOut' as const,
          staggerDelay: 0.05,
          enableComplexAnimations: true
        };
    }
  }, [detectDeviceCapability]);

  // Check if animations should be reduced
  const shouldReduceMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceCapability = detectDeviceCapability();
    
    return prefersReducedMotion || deviceCapability === 'low';
  }, [detectDeviceCapability]);

  // Performance optimization utilities
  const optimizeForPerformance = useCallback(() => {
    const capability = detectDeviceCapability();
    const settings = getOptimizedSettings();
    
    return {
      // CSS classes for performance optimization
      gpuClass: 'transform-gpu will-change-transform',
      reducedMotionClass: shouldReduceMotion() ? 'transition-none' : '',
      
      // Animation settings
      duration: settings.duration,
      ease: settings.ease,
      staggerDelay: settings.staggerDelay,
      
      // Performance flags
      enableComplexAnimations: settings.enableComplexAnimations,
      useGPUAcceleration: capability !== 'low',
      
      // Recommendations
      recommendations: capability === 'low' ? [
        'Use simple opacity/transform animations only',
        'Avoid complex hover effects',
        'Reduce animation durations',
        'Disable parallax effects'
      ] : capability === 'medium' ? [
        'Use moderate animation complexity',
        'Limit simultaneous animations',
        'Optimize image sizes'
      ] : [
        'Full animation capabilities available',
        'Can use complex effects',
        'GPU acceleration recommended'
      ]
    };
  }, [detectDeviceCapability, getOptimizedSettings, shouldReduceMotion]);

  // Monitor performance when enabled
  useEffect(() => {
    const cleanup = monitorFrameRate();
    return cleanup;
  }, [monitorFrameRate]);

  // Initialize device capability
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      deviceCapability: detectDeviceCapability()
    }));
  }, [detectDeviceCapability]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getOptimizedSettings,
    shouldReduceMotion,
    optimizeForPerformance,
    deviceCapability: metrics.deviceCapability
  };
}

// Utility function to check if device supports 60fps animations
export function supports60fps(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return false;
  
  // Check hardware capabilities
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return false;
  
  // Check memory
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const memoryGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
    if (memoryGB < 2) return false;
  }
  
  return true;
}

// Utility function to get performance-optimized animation duration
export function getOptimizedDuration(baseDuration: number): number {
  if (supports60fps()) {
    return baseDuration;
  }
  
  // Reduce duration for lower-end devices
  return Math.max(baseDuration * 0.5, 0.1);
}

// Utility function to create performance-optimized transition config
export function createOptimizedTransition(
  baseDuration: number = 0.25,
  baseEase: string = 'easeOut'
) {
  const duration = getOptimizedDuration(baseDuration);
  const ease = supports60fps() ? baseEase : 'linear';
  
  return {
    duration,
    ease,
    // Add performance optimizations
    ...(supports60fps() && {
      willChange: 'transform, opacity',
      transform: 'translateZ(0)'
    })
  };
} 