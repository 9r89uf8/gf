// app/components/ui/ModernCard.js
'use client'
import React from 'react';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// Subtle gradient animation
const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Base styled card that accepts animate as a styled prop
// Animation disabled by default for better INP performance
const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'animate'
})(({ theme, variant = 'default', animate = false }) => ({
  position: 'relative',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: 20,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  
  // Base shadow
  boxShadow: `
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.06),
    0 20px 25px -5px rgba(0, 0, 0, 0.1)
  `,
  
  // Gradient border effect using pseudo-element
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    padding: '1.5px',
    background: variant === 'premium' 
      ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #000000 100%)'
      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
    backgroundSize: '100% 100%',
    animation: 'none',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
  },
  
  // Hover effects - reduced for better performance
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `
      0 20px 25px -5px rgba(0, 0, 0, 0.15),
      0 8px 10px -6px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(0, 0, 0, 0.02)
    `,
    '&::before': {
      opacity: 1,
    },
  },
  
  // Active state
  '&:active': {
    transform: 'translateY(-2px)',
  },
  
  // Variant styles
  ...(variant === 'elevated' && {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: `
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(0, 0, 0, 0.02)
    `,
  }),
  
  ...(variant === 'flat' && {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    boxShadow: 'none',
    '&::before': {
      opacity: 0.5,
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      transform: 'none',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    },
  }),
  
  ...(variant === 'premium' && {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(103, 126, 234, 0.1) 0%, transparent 70%)',
      animation: animate ? `${shimmer} 20s linear infinite` : 'none',
      pointerEvents: 'none',
    },
  }),
}));

// Export StyledCard as ModernCard
export const ModernCard = StyledCard;

// Compact card for smaller UI elements
export const CompactCard = styled(ModernCard)(({ theme }) => ({
  borderRadius: 12,
  '&::before': {
    borderRadius: 12,
  },
}));

// Interactive card with click feedback
export const InteractiveCard = styled(ModernCard)(({ theme }) => ({
  cursor: 'pointer',
  userSelect: 'none',
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

// Card content wrapper with consistent padding
export const CardContentWrapper = styled('div')(({ theme, noPadding }) => ({
  padding: noPadding ? 0 : theme.spacing(3),
  position: 'relative',
  zIndex: 1,
}));

export default ModernCard;