
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import { DollarSign } from 'lucide-react';

const Budgets: React.FC = () => {
  return (
    <div className="page-container">
      <PageTitle title="Budgets" />
      
      <div className="glass-card p-8 rounded-lg text-center animate-fade-in">
        <div className="mb-6 text-gray-400">
          <DollarSign className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-xl font-medium text-gray-700 mb-3">Budget management features will be available in a future update.</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Set department budgets, track spending, and manage financial allocations in our upcoming release.
        </p>
      </div>
    </div>
  );
};

export default Budgets;
