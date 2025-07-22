import React from 'react';

// Memoized SVG components for better performance
export const ChatIcon = React.memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
));
ChatIcon.displayName = 'ChatIcon';

export const HeartIcon = React.memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
));
HeartIcon.displayName = 'HeartIcon';

export const TrendingIcon = React.memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
));
TrendingIcon.displayName = 'TrendingIcon';

export const StarIcon = React.memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
));
StarIcon.displayName = 'StarIcon';

export const CheckIcon = React.memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 12l2 2 4-4" stroke="white" fill="none" strokeWidth="2"/>
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

export const CameraIcon = React.memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
));
CameraIcon.displayName = 'CameraIcon';

export const AudioIcon = React.memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
));
AudioIcon.displayName = 'AudioIcon';

// Map icon names to components for easy lookup
export const getIcon = (iconName) => {
  const icons = {
    chat: ChatIcon,
    heart: HeartIcon,
    trending: TrendingIcon,
    star: StarIcon,
    check: CheckIcon,
    camera: CameraIcon,
    audio: AudioIcon,
  };
  
  const Icon = icons[iconName];
  return Icon ? <Icon /> : null;
};