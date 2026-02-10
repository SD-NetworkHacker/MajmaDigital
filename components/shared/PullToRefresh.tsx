import React, { useState, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children?: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === 0) return;
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;

    // Seuil de déclenchement
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      const resistance = 0.4;
      setPullDistance(Math.min(diff * resistance, 90));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 65) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    startY.current = 0;
  };

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto no-scrollbar relative touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute left-0 right-0 flex justify-center items-center transition-all duration-300 pointer-events-none z-[60]"
        style={{ 
          top: isRefreshing ? '24px' : `${pullDistance - 50}px`,
          opacity: pullDistance > 15 || isRefreshing ? 1 : 0,
          transform: `scale(${Math.min(pullDistance / 65, 1.1)})`
        }}
      >
        <div className="bg-emerald-600 p-3 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.4)] border border-emerald-400 text-white">
          <RefreshCcw size={20} className={`${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 5}deg)` }} />
        </div>
      </div>
      
      <div 
        className="transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${isRefreshing ? '70px' : `${pullDistance}px`})` }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;