
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import { BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="page-container">
      <PageTitle title="Analytics" />
      
      <div className="glass-card p-8 rounded-lg text-center animate-fade-in">
        <div className="mb-6 text-gray-400">
          <BarChart3 className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-xl font-medium text-gray-700 mb-3">Analytics dashboard will be available in a future update.</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Comprehensive reporting, charts, and insights on budget trends and approvals will be coming soon.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
