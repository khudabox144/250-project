import React from 'react';

// A simple, attractive, and centered loading spinner component using Tailwind CSS.
const LoadingSpinner = ({ size = 'lg', color = 'teal' }) => {
  // Determine size classes
  let spinnerSize = 'w-8 h-8';
  if (size === 'sm') spinnerSize = 'w-4 h-4';
  if (size === 'md') spinnerSize = 'w-6 h-6';
  if (size === 'xl') spinnerSize = 'w-10 h-10';

  // Determine color classes
  const spinnerColor = `border-${color}-500`;
  const spinnerBorder = `border-t-${color}-500`;

  return (
    <div className="flex items-center justify-center p-4">
      {/* This div creates the spinner circle. 
        It uses 'animate-spin' for the rotation effect.
        'border-4' defines the thickness.
        The main border is a light gray, and the top border is the accent color, 
        which creates the visible moving segment.
        'rounded-full' makes it a perfect circle.
      */}
      <div 
        className={`
          ${spinnerSize} 
          border-4 
          border-gray-200 
          ${spinnerColor} 
          ${spinnerBorder} 
          rounded-full 
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      >
        {/* Visually hidden text for accessibility */}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;