
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = "rectangular" }) => {
  const baseClasses = "animate-pulse bg-slate-200/80";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 h-full">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" className="w-12 h-12" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-20 h-3" />
      </div>
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
    <div className="pt-4 mt-2 border-t border-slate-50">
       <Skeleton variant="rectangular" className="w-full h-10" />
    </div>
  </div>
);

export default Skeleton;
