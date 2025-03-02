
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import PageTitle from '@/components/Common/PageTitle';
import StatsCard from '@/components/Common/StatsCard';
import BillTable from '@/components/Bills/BillTable';
import { formatCurrency } from '@/utils/formatters';
import { FileText, IndianRupee, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserBills, getStats } = useBill();
  
  const userBills = getUserBills();
  const stats = getStats();
  const recentBills = userBills.slice(0, 5); // Get only the most recent 5 bills
  
  return (
    <div className="page-container">
      <PageTitle 
        title={`Welcome, ${user?.name}`} 
        subtitle={
          user?.role === 'employee' 
            ? 'Review your budget requests and submit new expenses.'
            : user?.role === 'hr'
            ? 'Manage HR budget requests and submit departmental expenses.'
            : user?.role === 'manager'
            ? 'Approve or reject budget requests and manage your team.'
            : 'Monitor all budget activities and manage financial operations.'
        } 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Total Budget Requests"
          value={stats.totalRequests}
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-blue-100 text-blue-600"
          className="col-span-1"
        />
        
        <StatsCard
          title="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          icon={<IndianRupee className="h-5 w-5" />}
          iconBg="bg-green-100 text-green-600"
          className="col-span-1"
        />
        
        <StatsCard
          title="Pending Approval"
          value={stats.pendingApproval}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-yellow-100 text-yellow-600"
          className="col-span-1"
        />
        
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="bg-green-100 text-green-600"
          className="col-span-1"
        />
        
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5" />}
          iconBg="bg-red-100 text-red-600"
          className="col-span-1"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Bills
              <span className="text-sm font-normal text-gray-500 ml-2">
                {user?.role === 'manager' || user?.role === 'finance' 
                  ? 'Latest bill submissions across departments' 
                  : 'Your recent bill submissions'}
              </span>
            </h2>
            <Link to="/bills">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          {recentBills.length > 0 ? (
            <BillTable bills={recentBills} showFilters={false} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No recent bills found.</p>
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
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Additional dashboard widgets will appear here in a future update.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
