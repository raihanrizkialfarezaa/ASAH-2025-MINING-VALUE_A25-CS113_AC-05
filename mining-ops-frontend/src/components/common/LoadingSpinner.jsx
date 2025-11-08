import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <Loader className={`animate-spin text-primary-600 ${sizeClasses[size]}`} />
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">{spinner}</div>;
  }

  return spinner;
};

export default LoadingSpinner;
