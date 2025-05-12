
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { ChartPie, BarChart3, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Analytics: React.FC = () => {
  // Sample data for charts
  const monthlyExpenseData = [
    { name: 'Jan', expenses: 4000, budget: 6000 },
    { name: 'Feb', expenses: 3000, budget: 6000 },
    { name: 'Mar', expenses: 2000, budget: 6000 },
    { name: 'Apr', expenses: 2780, budget: 6000 },
    { name: 'May', expenses: 5890, budget: 6000 },
    { name: 'Jun', expenses: 4390, budget: 6000 },
    { name: 'Jul', expenses: 3490, budget: 6000 },
    { name: 'Aug', expenses: 4000, budget: 6000 },
  ];

  const categoryData = [
    { name: 'Office Supplies', value: 35 },
    { name: 'Travel', value: 25 },
    { name: 'Technology', value: 20 },
    { name: 'Marketing', value: 15 },
    { name: 'Miscellaneous', value: 5 },
  ];

  const approvalTrendData = [
    { month: 'Jan', approved: 12, rejected: 3, pending: 2 },
    { month: 'Feb', approved: 15, rejected: 2, pending: 5 },
    { month: 'Mar', approved: 18, rejected: 1, pending: 3 },
    { month: 'Apr', approved: 14, rejected: 4, pending: 2 },
    { month: 'May', approved: 21, rejected: 2, pending: 1 },
    { month: 'Jun', approved: 25, rejected: 0, pending: 4 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleDownloadReport = () => {
    // This would typically generate a CSV/Excel file with the data
    alert('Report download functionality will be implemented in a future update');
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageTitle 
          title="Analytics" 
          subtitle="View budget trends and expense analytics" 
        />
        
        <Button className="flex items-center gap-2" onClick={handleDownloadReport}>
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Monthly Expenses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Comparison of expenses to budget</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" fill="#0078ff" name="Expenses" />
                <Bar dataKey="budget" fill="#80c342" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Expense Categories</CardTitle>
              <ChartPie className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Approval Trends</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Six month trend of bill approvals</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={approvalTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="approved" stroke="#0078ff" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="rejected" stroke="#ff0000" />
                <Line type="monotone" dataKey="pending" stroke="#ffbb28" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Budget Overview</CardTitle>
            <CardDescription>Year-to-date budget utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="aspect-[4/3]" config={{
              expenses: { label: "Expenses", color: "#0078ff" },
              budget: { label: "Budget", color: "#80c342" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                  <Bar dataKey="budget" fill="var(--color-budget)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
