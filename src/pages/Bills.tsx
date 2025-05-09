
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
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

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
        
        {isUserAllowedToDelete && bills.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedBills.includes(bill.id)}
                      onCheckedChange={() => handleSelectBill(bill.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{bill.title}</TableCell>
                  <TableCell>₹{bill.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{bill.submitterName}</TableCell>
                  <TableCell>{bill.submitterDepartment}</TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        bill.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        bill.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => {}} className="text-blue-600">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <BillTable bills={bills} />
        )}
        
        {bills.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No bills found. Adjust your filters or submit a new bill.</p>
            {(user?.role === 'employee' || user?.role === 'hr') && (
              <Link to="/submit-bill">
                <Button variant="outline" className="mt-2">
                  Submit a new bill
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;
