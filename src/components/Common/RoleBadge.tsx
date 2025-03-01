
import React from 'react';
import { getRoleColor } from '@/utils/formatters';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const colorClass = getRoleColor(role);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {capitalize(role)}
    </span>
  );
};

export default RoleBadge;
