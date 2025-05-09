
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import PageTitle from '@/components/Common/PageTitle';
import BillTable from '@/components/Bills/BillTable';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Bills: React.FC = () => {
  const { user } = useAuth();
  const { getUserBills, deleteSelectedBills } = useBill();
  
  const bills = getUserBills();
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSelectBill = (billId: string) => {
    setSelectedBills(prev => {
      if (prev.includes(billId)) {
        return prev.filter(id => id !== billId);
      } else {
        return [...prev, billId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBills([]);
    } else {
      setSelectedBills(bills.map(bill => bill.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    if (selectedBills.length === 0) {
      toast.error('No bills selected');
      return;
    }
    
    await deleteSelectedBills(selectedBills);
    setSelectedBills([]);
    setSelectAll(false);
  };

  const isUserAllowedToDelete = user?.role === 'employee' || user?.role === 'hr';
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <PageTitle 
          title="Bills & Expenses" 
          subtitle="Track and manage all expense requests" 
        />
        
        <div className="flex gap-2">
          {isUserAllowedToDelete && bills.length > 0 && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteSelected}
              disabled={selectedBills.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
              {selectedBills.length > 0 && ` (${selectedBills.length})`}
            </Button>
          )}
          {(user?.role === 'employee' || user?.role === 'hr') && (
            <Link to="/submit-bill">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Submit New Bill
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {isUserAllowedToDelete && bills.length > 0 && (
          <div className="flex items-center mb-4 ml-4">
            <Checkbox 
              id="select-all-bills" 
              checked={selectAll} 
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all-bills" className="ml-2 text-sm text-gray-500">
              Select All Bills
            </label>
          </div>
        )}
        
        {isUserAllowedToDelete ? (
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Checkbox 
                        checked={selectedBills.includes(bill.id)}
                        onCheckedChange={() => handleSelectBill(bill.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{bill.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.submitterName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.submitterDepartment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bill.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          bill.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          bill.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" onClick={() => {}} className="text-blue-600">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No bills found. Adjust your filters or submit a new bill.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <BillTable bills={bills} />
        )}
      </div>
    </div>
  );
};

export default Bills;
