
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import PageTitle from '@/components/Common/PageTitle';
import BillTable from '@/components/Bills/BillTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Bills: React.FC = () => {
  const { user } = useAuth();
  const { getUserBills } = useBill();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const bills = getUserBills();
  
  const filteredBills = bills.filter(bill => {
    // Apply status filter
    if (statusFilter !== 'all' && bill.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        bill.title.toLowerCase().includes(term) ||
        bill.submitterName.toLowerCase().includes(term) ||
        bill.submitterDepartment.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <PageTitle title="Bills & Expenses" />
        
        {(user?.role === 'employee' || user?.role === 'hr') && (
          <Button asChild className="bg-brand-blue hover:bg-opacity-90">
            <Link to="/submit-bill">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Bill
            </Link>
          </Button>
        )}
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bills..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <BillTable bills={filteredBills} />
    </div>
  );
};

export default Bills;
