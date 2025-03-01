
import React from 'react';
import { getStatusColor } from '@/utils/formatters';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = getStatusColor(status);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {capitalize(status)}
    </span>
  );
};

export default StatusBadge;
