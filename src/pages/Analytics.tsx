
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';

const Analytics: React.FC = () => {
  return (
    <div className="page-container">
      <PageTitle 
        title="Analytics" 
        subtitle="View budget trends and expense analytics" 
      />
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        <p>Analytics dashboard will be available in a future update.</p>
      </div>
    </div>
  );
};

export default Analytics;
