# 60fps Animation Optimization Guide

This document outlines the comprehensive animation optimizations implemented to achieve smooth 60fps animations across the website.

## Overview

The website has been optimized to deliver smooth, performant animations that feel like they're running at 60fps. This includes:

- **GPU-accelerated animations** using `transform3d` and `will-change`
- **Performance-aware animation settings** that adapt to device capabilities
- **Reduced motion support** for accessibility
- **Optimized timing functions** using cubic-bezier curves
- **Staggered animations** with reduced delays for better performance

## Key Optimizations

### 1. Animation Utility System (`lib/animation-utils.ts`)

The animation utility system provides optimized configurations for different animation types:

```typescript
// Optimized animation configurations
export const optimizedAnimations = {
  fast: { duration: 0.15, ease: "easeOut" },
  standard: { duration: 0.25, ease: "easeOut" },
  smooth: { duration: 0.4, ease: "easeInOut" },
  page: { duration: 0.3, ease: "easeOut" }
};
```

### 2. Performance Monitoring (`hooks/useAnimationPerformance.ts`)

A custom hook that monitors animation performance and adapts settings based on device capabilities:

```typescript
const { metrics, optimizeForPerformance } = useAnimationPerformance({
  targetFPS: 60,
  enableMonitoring: true
});
```

### 3. CSS Optimizations (`app/globals.css`)

Global CSS utilities for performance-optimized animations:

```css
/* GPU acceleration */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

/* Optimized transition durations */
.transition-fast { transition-duration: 150ms; }
.transition-standard { transition-duration: 250ms; }
.transition-smooth { transition-duration: 400ms; }
```

### 4. Tailwind Configuration (`tailwind.config.ts`)

Optimized keyframes and animations using `transform3d`:

```typescript
keyframes: {
  'fade-in-up': {
    '0%': { 
      opacity: '0',
      transform: 'translate3d(0, 20px, 0)',
    },
    '100%': { 
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  }
}
```

## Implementation Examples

### Hero Component Animations

```typescript
// Before optimization
<motion.div
  animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
/>

// After optimization
<motion.div
  animate={{ 
    opacity: 1, 
    transition: { 
      ...optimizedAnimations.smooth,
      ...animationPerformance.getReducedMotionConfig()
    } 
  }}
  className={`${gpuAccelerationClasses.gpu}`}
/>
```

### News List Staggered Animations

```typescript
// Before optimization
transition={{ delay: index * 0.1 }}

// After optimization
transition={{ 
  delay: index * 0.05,
  ...animationPerformance.getReducedMotionConfig()
}}
```

### CSS Transition Optimizations

```css
/* Before optimization */
.transition-all { transition-duration: 300ms; }

/* After optimization */
.transition-all { transition-duration: 200ms; }
```

## Performance Features

### 1. Device Capability Detection

The system automatically detects device capabilities and adjusts animations accordingly:

- **High-end devices**: Full animation capabilities
- **Medium devices**: Moderate complexity with optimizations
- **Low-end devices**: Simplified animations with reduced motion

### 2. Reduced Motion Support

Respects user preferences for reduced motion:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### 3. GPU Acceleration

Forces GPU acceleration on supported properties:

```css
transform: translate3d(0, 0, 0);
will-change: transform;
```

### 4. Optimized Timing Functions

Uses cubic-bezier curves optimized for 60fps:

```css
transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
```

## Best Practices

### 1. Use Transform Instead of Position Properties

```css
/* Good - GPU accelerated */
transform: translateY(-10px);

/* Avoid - triggers layout */
top: -10px;
```

### 2. Batch DOM Updates

```typescript
// Use AnimatePresence for coordinated animations
<AnimatePresence mode="wait">
  <motion.div key={id} />
</AnimatePresence>
```

### 3. Optimize Stagger Delays

```typescript
// Reduced from 0.1s to 0.05s for better performance
delay: index * 0.05
```

### 4. Use CSS Classes for Simple Animations

```css
.hover-lift:hover {
  transform: translateY(-4px) translateZ(0);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
```

## Performance Monitoring

### Frame Rate Monitoring

The performance hook provides real-time metrics:

```typescript
const { metrics } = useAnimationPerformance();
console.log(`FPS: ${metrics.fps}, Smooth: ${metrics.isSmooth}`);
```

### Device Capability Assessment

```typescript
const { deviceCapability } = useAnimationPerformance();
// Returns: 'high' | 'medium' | 'low'
```

## Accessibility Considerations

### 1. Reduced Motion Support

All animations respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  .transition-fast,
  .transition-standard,
  .transition-smooth {
    transition-duration: 0.01ms !important;
  }
}
```

### 2. Focus Management

Optimized focus states with smooth transitions:

```css
.focus-ring:focus-visible {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}
```

## Testing Performance

### 1. Chrome DevTools

- Open Performance tab
- Record animations
- Check for frame drops
- Monitor GPU usage

### 2. Lighthouse

- Run performance audit
- Check for animation performance
- Verify accessibility compliance

### 3. Real Device Testing

- Test on low-end devices
- Verify smooth animations
- Check battery impact

## Troubleshooting

### Common Issues

1. **Frame drops**: Reduce animation complexity or duration
2. **Janky animations**: Ensure GPU acceleration is enabled
3. **High CPU usage**: Use `transform` instead of layout properties
4. **Memory leaks**: Clean up animation listeners

### Performance Debugging

```typescript
// Enable performance monitoring
const { startMonitoring, metrics } = useAnimationPerformance({
  enableMonitoring: true
});

// Check device capability
console.log('Device capability:', metrics.deviceCapability);
```

## Future Optimizations

### Planned Improvements

1. **Intersection Observer**: Lazy load animations
2. **Web Workers**: Offload animation calculations
3. **CSS Containment**: Improve rendering performance
4. **Virtual Scrolling**: Optimize large lists

### Performance Metrics

Track these metrics for ongoing optimization:

- Frame rate consistency
- Animation smoothness
- Device capability distribution
- User interaction responsiveness

## Conclusion

The implemented optimizations provide a foundation for smooth 60fps animations while maintaining accessibility and performance across different device capabilities. The system automatically adapts to user preferences and device limitations, ensuring a consistent and enjoyable user experience. 