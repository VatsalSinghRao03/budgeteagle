
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';

const Budgets: React.FC = () => {
  return (
    <div className="page-container">
      <PageTitle 
        title="Budgets" 
        subtitle="Manage department budgets and allocations" 
      />
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        <p>Budget management features will be available in a future update.</p>
      </div>
    </div>
  );
};

export default Budgets;
