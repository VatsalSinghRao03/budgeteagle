
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import PageTitle from '@/components/Common/PageTitle';
import BillTable from '@/components/Bills/BillTable';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Bills: React.FC = () => {
  const { user } = useAuth();
  const { getUserBills } = useBill();
  
  const bills = getUserBills();
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <PageTitle 
          title="Bills & Expenses" 
          subtitle="Track and manage all expense requests" 
        />
        
        {(user?.role === 'employee' || user?.role === 'hr') && (
          <Link to="/submit-bill">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Submit New Bill
            </Button>
          </Link>
        )}
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <BillTable bills={bills} />
      </div>
    </div>
  );
};

export default Bills;
