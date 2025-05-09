
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import BillSubmissionForm from '@/components/Bills/BillSubmissionForm';
import { useBill } from '@/contexts/BillContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const SubmitBill: React.FC = () => {
  const { clearAllBills } = useBill();

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <PageTitle 
          title="Submit New Bill" 
          subtitle="Fill in the details of the expense and attach any relevant documents"
        />
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 mt-4 md:mt-0"
          onClick={() => clearAllBills()}
        >
          <Trash2 className="h-4 w-4" />
          Clear All Bills
        </Button>
      </div>
      
      <BillSubmissionForm />
    </div>
  );
};

export default SubmitBill;
