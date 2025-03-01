
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentChange?: number;
  iconBg?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  percentChange,
  iconBg = 'bg-blue-100 text-blue-600',
  className
}) => {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between items-start">
        <span className="stats-label">{title}</span>
        <div className={`p-2 rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <div className="stats-value">{value}</div>
      
      {percentChange !== undefined && (
        <div className="mt-2 text-xs flex items-center">
          <span 
            className={
              percentChange > 0 
                ? 'text-green-600' 
                : percentChange < 0 
                  ? 'text-red-600' 
                  : 'text-gray-500'
            }
          >
            {percentChange > 0 ? '+' : ''}{percentChange}%
          </span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
