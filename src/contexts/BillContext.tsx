
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bill, AppStats } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { sendEmailNotification } from '@/utils/emailService';
import { supabase } from '@/integrations/supabase/client';

interface BillContextType {
  bills: Bill[];
  isLoading: boolean;
  submitBill: (billData: Omit<Bill, 'id' | 'date' | 'status' | 'submitterName' | 'submitterDepartment'>) => Promise<void>;
  approveBill: (billId: string) => Promise<void>;
  rejectBill: (billId: string, reason: string) => Promise<void>;
  deleteBill: (billId: string) => Promise<void>;
  getStats: () => AppStats;
  getUserBills: () => Bill[];
  getPendingBills: () => Bill[];
  clearAllBills: () => void;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const savedBills = localStorage.getItem('budgetEagleBills');
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetEagleBills', JSON.stringify(bills));
  }, [bills]);

  const submitBill = async (billData: Omit<Bill, 'id' | 'date' | 'status' | 'submitterName' | 'submitterDepartment'>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newBill: Bill = {
        ...billData,
        id: `bill-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
        submitterName: user.name,
        submitterDepartment: user.department
      };
      
      setBills(prevBills => [...prevBills, newBill]);
      
      await sendEmailNotification({
        to: user.email,
        subject: 'Bill Submitted Successfully',
        message: `Your bill "${newBill.title}" for ₹${newBill.amount} has been submitted and is awaiting approval.`,
        name: user.name
      });
      
      const managerUser = {
        email: 'Managerlogin2025@gmail.com',
        name: 'Vikram Singh'
      };
      
      await sendEmailNotification({
        to: managerUser.email,
        subject: 'New Bill Awaiting Your Approval',
        message: `${user.name} from ${user.department} has submitted a new bill "${newBill.title}" for ₹${newBill.amount} that requires your review.`,
        name: managerUser.name
      });
      
      toast.success('Bill submitted successfully');
      return Promise.resolve();
    } catch (error) {
      toast.error('Failed to submit bill');
      console.error('Submit bill error:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveBill = async (billId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const approvedBill = bills.find(b => b.id === billId);
      
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === billId 
            ? { 
                ...bill, 
                status: 'approved', 
                reviewedBy: user.id,
                reviewedDate: new Date().toISOString()
              } 
            : bill
        )
      );
      
      if (approvedBill) {
        const submitterEmail = 'Employeelogin2025@gmail.com';
        const submitterName = approvedBill.submitterName;
        
        await sendEmailNotification({
          to: submitterEmail,
          subject: 'Bill Approved',
          message: `Your bill "${approvedBill.title}" for ₹${approvedBill.amount} has been approved. The payment will be processed soon.`,
          name: submitterName
        });
        
        await sendEmailNotification({
          to: user.email,
          subject: 'Bill Approval Confirmation',
          message: `You have approved the bill "${approvedBill.title}" for ₹${approvedBill.amount} submitted by ${approvedBill.submitterName}.`,
          name: user.name
        });
      }
      
      toast.success('Bill approved successfully');
    } catch (error) {
      toast.error('Failed to approve bill');
      console.error('Approve bill error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBill = async (billId: string, reason: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const rejectedBill = bills.find(b => b.id === billId);
      
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === billId 
            ? { 
                ...bill, 
                status: 'rejected',
                rejectionReason: reason,
                reviewedBy: user.id,
                reviewedDate: new Date().toISOString()
              } 
            : bill
        )
      );
      
      if (rejectedBill) {
        const submitterEmail = 'Employeelogin2025@gmail.com';
        const submitterName = rejectedBill.submitterName;
        
        await sendEmailNotification({
          to: submitterEmail,
          subject: 'Bill Rejected',
          message: `Your bill "${rejectedBill.title}" for ₹${rejectedBill.amount} has been rejected. Reason: ${reason}`,
          name: submitterName
        });
        
        await sendEmailNotification({
          to: user.email,
          subject: 'Bill Rejection Confirmation',
          message: `You have rejected the bill "${rejectedBill.title}" for ₹${rejectedBill.amount} submitted by ${rejectedBill.submitterName}. Reason: ${reason}`,
          name: user.name
        });
      }
      
      toast.success('Bill rejected');
    } catch (error) {
      toast.error('Failed to reject bill');
      console.error('Reject bill error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBill = async (billId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setBills(prevBills => prevBills.filter(bill => bill.id !== billId));
      toast.success('Bill deleted successfully');
    } catch (error) {
      toast.error('Failed to delete bill');
      console.error('Delete bill error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = (): AppStats => {
    const userBills = getUserBills();
    
    return {
      totalRequests: userBills.length,
      totalAmount: userBills.reduce((sum, bill) => sum + bill.amount, 0),
      pendingApproval: userBills.filter(bill => bill.status === 'pending').length,
      approved: userBills.filter(bill => bill.status === 'approved').length,
      rejected: userBills.filter(bill => bill.status === 'rejected').length
    };
  };

  const getUserBills = (): Bill[] => {
    if (!user) return [];
    
    if (user.role === 'employee' || user.role === 'hr') {
      return bills.filter(bill => bill.submittedBy === user.id);
    }
    
    return bills;
  };

  const getPendingBills = (): Bill[] => {
    return bills.filter(bill => bill.status === 'pending');
  };

  // New function to clear all bills
  const clearAllBills = () => {
    setBills([]);
    localStorage.removeItem('budgetEagleBills');
    toast.success('All bills have been cleared');
  };

  return (
    <BillContext.Provider value={{ 
      bills, 
      isLoading, 
      submitBill, 
      approveBill, 
      rejectBill, 
      deleteBill,
      getStats,
      getUserBills,
      getPendingBills,
      clearAllBills
    }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};
