
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  percentage?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  description,
  className,
  percentage 
}) => {
  return (
    <div className={cn("stats-card animate-scale-in", className)}>
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className="text-brand-blue bg-brand-blue/10 p-2 rounded-full">
          {icon}
        </div>
      </div>
      <div className="stats-value">{value}</div>
      {percentage !== undefined && (
        <div className="text-xs text-gray-500 mt-1">
          — {percentage}%
        </div>
      )}
      {description && (
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      )}
    </div>
  );
};

export default StatsCard;
