
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import PageTitle from '@/components/Common/PageTitle';
import StatsCard from '@/components/Common/StatsCard';
import { FileText, DollarSign, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserBills, getStats } = useBill();
  
  const bills = getUserBills();
  const stats = getStats();
  
  const getWelcomeMessage = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'employee':
        return 'Review your budget requests and submit new expenses.';
      case 'hr':
        return 'Manage HR budget requests and submit departmental expenses.';
      case 'manager':
        return 'Approve or reject budget requests and manage your team.';
      case 'finance':
        return 'Monitor all budget activities and manage financial operations.';
      default:
        return '';
    }
  };
  
  return (
    <div className="page-container">
      <PageTitle 
        title={`Welcome, ${user?.name}`} 
        subtitle={getWelcomeMessage()}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="Total Budget Requests"
          value={stats.totalRequests}
          icon={<FileText className="h-5 w-5" />}
          description="All time bill submissions"
          percentage={0}
        />
        
        <StatsCard
          title="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Sum of all bill requests"
          className="lg:col-span-2"
        />
        
        <StatsCard
          title="Pending Approval"
          value={stats.pendingApproval}
          icon={<Clock className="h-5 w-5" />}
          description="Bills awaiting review"
          percentage={0}
        />
        
        <div className="grid grid-cols-2 gap-4 lg:col-span-1">
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle className="h-5 w-5" />}
            percentage={0}
          />
          
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
            percentage={0}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-lg p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Bills</h2>
            <Link to="/bills" className="text-sm text-brand-blue hover:underline">
              View All
            </Link>
          </div>
          
          {bills.length === 0 ? (
            <div className="text-center py-10">
              <div className="mb-4 text-gray-400">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-gray-500 mb-2">No recent bills found.</h3>
              
              {(user?.role === 'employee' || user?.role === 'hr') && (
                <Button asChild className="mt-4 bg-brand-blue hover:bg-opacity-90">
                  <Link to="/submit-bill">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit a new bill
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <ul className="space-y-3">
              {bills.slice(0, 5).map(bill => (
                <li key={bill.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{bill.title}</p>
                      <p className="text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                      <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                        bill.status === 'approved' ? 'bg-green-100 text-green-800' :
                        bill.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="glass-card rounded-lg p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Additional dashboard widgets will appear here in a future update.</h2>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="mb-4 text-gray-400">
              <BarChart3 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-500">Enhanced analytics and reporting tools will be available in the next release.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import here to avoid circular dependencies
import { BarChart3 } from 'lucide-react';

export default Dashboard;
