
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import PageTitle from '@/components/Common/PageTitle';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatters';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { bills } = useBill();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate department data
  const departmentData = React.useMemo(() => {
    const departments: Record<string, { total: number, approved: number, rejected: number, pending: number, count: number }> = {};
    
    bills.forEach(bill => {
      const dept = bill.submitterDepartment;
      
      if (!departments[dept]) {
        departments[dept] = { total: 0, approved: 0, rejected: 0, pending: 0, count: 0 };
      }
      
      departments[dept].total += bill.amount;
      departments[dept].count += 1;
      
      if (bill.status === 'approved') {
        departments[dept].approved += bill.amount;
      } else if (bill.status === 'rejected') {
        departments[dept].rejected += bill.amount;
      } else {
        departments[dept].pending += bill.amount;
      }
    });
    
    return Object.entries(departments).map(([name, data]) => ({
      name,
      total: data.total,
      approved: data.approved,
      rejected: data.rejected,
      pending: data.pending,
      count: data.count,
      approvalRate: data.count > 0 ? ((data.approved / data.total) * 100).toFixed(1) + '%' : '0%'
    }));
  }, [bills]);
  
  // Calculate user data
  const userData = React.useMemo(() => {
    const users: Record<string, { total: number, approved: number, rejected: number, pending: number, count: number }> = {};
    
    bills.forEach(bill => {
      const userName = bill.submitterName;
      
      if (!users[userName]) {
        users[userName] = { total: 0, approved: 0, rejected: 0, pending: 0, count: 0 };
      }
      
      users[userName].total += bill.amount;
      users[userName].count += 1;
      
      if (bill.status === 'approved') {
        users[userName].approved += bill.amount;
      } else if (bill.status === 'rejected') {
        users[userName].rejected += bill.amount;
      } else {
        users[userName].pending += bill.amount;
      }
    });
    
    return Object.entries(users).map(([name, data]) => ({
      name,
      total: data.total,
      approved: data.approved,
      rejected: data.rejected,
      pending: data.pending,
      count: data.count,
      approvalRate: data.count > 0 ? ((data.approved / data.total) * 100).toFixed(1) + '%' : '0%'
    }));
  }, [bills]);
  
  // Calculate monthly data for trends
  const monthlyData = React.useMemo(() => {
    const months: Record<string, { total: number, approved: number, rejected: number, pending: number, count: number }> = {};
    
    bills.forEach(bill => {
      const date = new Date(bill.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { total: 0, approved: 0, rejected: 0, pending: 0, count: 0 };
      }
      
      months[monthYear].total += bill.amount;
      months[monthYear].count += 1;
      
      if (bill.status === 'approved') {
        months[monthYear].approved += bill.amount;
      } else if (bill.status === 'rejected') {
        months[monthYear].rejected += bill.amount;
      } else {
        months[monthYear].pending += bill.amount;
      }
    });
    
    // Sort by date
    return Object.entries(months)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .map(([name, data]) => ({
        name,
        total: data.total,
        approved: data.approved,
        rejected: data.rejected,
        pending: data.pending,
        count: data.count
      }));
  }, [bills]);
  
  // Calculate overall statistics
  const overallStats = React.useMemo(() => {
    const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const approved = bills.filter(bill => bill.status === 'approved')
      .reduce((sum, bill) => sum + bill.amount, 0);
    const rejected = bills.filter(bill => bill.status === 'rejected')
      .reduce((sum, bill) => sum + bill.amount, 0);
    const pending = bills.filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    const approvedCount = bills.filter(bill => bill.status === 'approved').length;
    const rejectedCount = bills.filter(bill => bill.status === 'rejected').length;
    const pendingCount = bills.filter(bill => bill.status === 'pending').length;
    
    return {
      total,
      approved,
      rejected,
      pending,
      approvedCount,
      rejectedCount,
      pendingCount,
      approvalRate: bills.length > 0 ? ((approvedCount / bills.length) * 100).toFixed(1) + '%' : '0%'
    };
  }, [bills]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const pieChartData = [
    { name: 'Approved', value: overallStats.approvedCount },
    { name: 'Rejected', value: overallStats.rejectedCount },
    { name: 'Pending', value: overallStats.pendingCount },
  ];
  
  const config = {
    approved: { color: '#22c55e' },
    rejected: { color: '#ef4444' },
    pending: { color: '#f59e0b' },
    total: { color: '#3b82f6' },
  };
  
  return (
    <div className="page-container">
      <PageTitle 
        title="Analytics Dashboard" 
        subtitle="Comprehensive analysis of bill submissions, approvals, and expenditures"
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="users">User Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Expenditure</h3>
              <p className="text-2xl font-bold">{formatCurrency(overallStats.total)}</p>
              <p className="text-xs text-gray-500 mt-1">Across {bills.length} bills</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Approved Expenditure</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(overallStats.approved)}</p>
              <p className="text-xs text-gray-500 mt-1">Approval Rate: {overallStats.approvalRate}</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Rejected Amount</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(overallStats.rejected)}</p>
              <p className="text-xs text-gray-500 mt-1">From {overallStats.rejectedCount} rejected bills</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Amount</h3>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(overallStats.pending)}</p>
              <p className="text-xs text-gray-500 mt-1">From {overallStats.pendingCount} pending bills</p>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-md font-medium mb-4">Bill Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-md font-medium mb-4">Monthly Expenditure Trends</h3>
              <div className="h-64">
                <ChartContainer
                  config={config}
                  className="aspect-[4/3]"
                >
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-white rounded-md border p-2" />}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="approved" 
                      name="Approved" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3} 
                      stackId="1" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rejected" 
                      name="Rejected" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.3}
                      stackId="1"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      name="Pending" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.3}
                      stackId="1"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Department Expenditure Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="approved" name="Approved" stackId="a" fill="#22c55e" />
                  <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">Department Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentData.map((dept) => (
                    <tr key={dept.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(dept.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(dept.approved)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(dept.rejected)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{formatCurrency(dept.pending)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.approvalRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">User Expenditure Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="approved" name="Approved" stackId="a" fill="#22c55e" />
                  <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">User Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.map((user) => (
                    <tr key={user.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(user.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(user.approved)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(user.rejected)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{formatCurrency(user.pending)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.approvalRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
