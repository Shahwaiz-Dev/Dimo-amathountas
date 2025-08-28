'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { optimizedAnimations, gpuAccelerationClasses } from '@/lib/animation-utils';

interface HeartbeatLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function HeartbeatLoader({ size = 'lg', className = '' }: HeartbeatLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const pulseSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-40 h-40'
  };

  // Heartbeat animation variants
  const heartbeatVariants = {
    initial: { 
      scale: 1,
      filter: 'brightness(1)'
    },
    beat: {
      scale: [1, 1.1, 1],
      filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
      transition: {
        duration: 1.2,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  // Pulse wave animation variants
  const pulseVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0.8
    },
    pulse: {
      scale: [0.8, 1.4, 0.8],
      opacity: [0.8, 0, 0.8],
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 0.2
      }
    }
  };

  // Blue glow animation variants
  const glowVariants = {
    initial: { 
      scale: 0.6,
      opacity: 0.3
    },
    glow: {
      scale: [0.6, 1.2, 0.6],
      opacity: [0.3, 0, 0.3],
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 0.4
      }
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Blue glow background layers */}
      <motion.div
        className={`absolute rounded-full bg-gradient-to-r from-blue-400 to-blue-600 ${pulseSizeClasses[size]} ${gpuAccelerationClasses.gpu}`}
        variants={glowVariants}
        initial="initial"
        animate="glow"
        style={{
          filter: 'blur(8px)',
          zIndex: 1
        }}
      />
      
      {/* Pulse wave ring */}
      <motion.div
        className={`absolute rounded-full border-2 border-blue-400 ${pulseSizeClasses[size]} ${gpuAccelerationClasses.gpu}`}
        variants={pulseVariants}
        initial="initial"
        animate="pulse"
        style={{
          zIndex: 2
        }}
      />
      
      {/* Logo container with heartbeat animation */}
      <motion.div
        className={`relative ${sizeClasses[size]} ${gpuAccelerationClasses.gpu}`}
        variants={heartbeatVariants}
        initial="initial"
        animate="beat"
        style={{
          zIndex: 3
        }}
      >
        <Image
          src="/logo.png"
          alt="Municipality Logo"
          width={64}
          height={64}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </motion.div>
      
      {/* Additional pulse rings for more dramatic effect */}
      <motion.div
        className={`absolute rounded-full border border-blue-300/50 ${pulseSizeClasses[size]} ${gpuAccelerationClasses.gpu}`}
        variants={pulseVariants}
        initial="initial"
        animate="pulse"
        transition={{
          duration: 1.2,
          ease: "easeOut" as const,
          repeat: Infinity,
          repeatType: "loop" as const,
          repeatDelay: 0.6
        }}
        style={{
          zIndex: 1
        }}
      />
      
      {/* Inner glow effect */}
      <motion.div
        className={`absolute rounded-full bg-blue-500/20 ${sizeClasses[size]} ${gpuAccelerationClasses.gpu}`}
        variants={heartbeatVariants}
        initial="initial"
        animate="beat"
        transition={{
          duration: 1.2,
          ease: "easeInOut" as const,
          repeat: Infinity,
          repeatType: "loop" as const,
          repeatDelay: 0.1
        }}
        style={{
          zIndex: 2,
          filter: 'blur(4px)'
        }}
      />
    </div>
  );
}

// Alternative simpler version for smaller use cases
export function SimpleHeartbeatLoader({ size = 'md', className = '' }: HeartbeatLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className} ${gpuAccelerationClasses.gpu}`}
      animate={{
        scale: [1, 1.1, 1],
        filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
      }}
      transition={{
        duration: 1,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "loop" as const
      }}
    >
      <Image
        src="/logo.png"
        alt="Municipality Logo"
        width={32}
        height={32}
        className="w-full h-full object-contain"
        priority
      />
      
      {/* Simple blue glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500/30"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{
          duration: 1,
          ease: "easeOut" as const,
          repeat: Infinity,
          repeatType: "loop" as const
        }}
        style={{
          filter: 'blur(2px)',
          zIndex: -1
        }}
      />
    </motion.div>
  );
} 