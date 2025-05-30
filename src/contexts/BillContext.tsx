
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  deleteSelectedBills: (billIds: string[]) => Promise<void>;
  getStats: () => AppStats;
  getUserBills: () => Bill[];
  getPendingBills: () => Bill[];
  clearAllBills: () => void;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Create a memoized fetchBills function to prevent re-creation on each render
  const fetchBills = useCallback(async () => {
    if (!user) {
      console.log("Cannot fetch bills: No authenticated user");
      setBills([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching bills from Supabase...", user.id);
      
      // Always fetch all bills to ensure consistency across all users
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching bills:", error);
        toast.error("Failed to fetch bills. Please try refreshing the page.");
        throw error;
      }
      
      console.log("Bills fetched successfully:", data?.length || 0);
      
      if (!data || data.length === 0) {
        console.log("No bills found in database");
        setBills([]);
      } else {
        // Transform data to match our Bill type
        const transformedBills = data.map(bill => ({
          id: bill.id,
          title: bill.title,
          amount: bill.amount,
          description: bill.description,
          fileUrl: bill.file_url,
          fileName: bill.file_name,
          submittedBy: bill.submitted_by,
          submitterName: bill.submitter_name,
          submitterDepartment: bill.submitter_department,
          date: bill.date,
          status: bill.status as "pending" | "approved" | "rejected",
          rejectionReason: bill.rejection_reason,
          reviewedBy: bill.reviewed_by,
          reviewedDate: bill.reviewed_date
        }));
        
        console.log("Transformed bills:", transformedBills.length);
        setBills(transformedBills);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to fetch bills. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up realtime subscription for bills");
    
    const channel = supabase
      .channel('bills-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bills' }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchBills(); // Refetch bills when changes occur
        })
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
    
    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user, fetchBills]);

  // Fetch bills when user changes or on initial load
  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching bills:", user);
      fetchBills();
    } else {
      console.log("No authenticated user, clearing bills");
      setBills([]);
      setIsLoading(false);
    }
  }, [user, fetchBills]);

  const submitBill = async (billData: Omit<Bill, 'id' | 'date' | 'status' | 'submitterName' | 'submitterDepartment'>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log("Submitting new bill:", billData);
      
      // Insert bill into Supabase
      const { data, error } = await supabase.from('bills').insert({
        title: billData.title,
        amount: billData.amount,
        description: billData.description,
        file_url: billData.fileUrl,
        file_name: billData.fileName,
        submitted_by: user.id,
        submitter_name: user.name,
        submitter_department: user.department
      }).select();
      
      if (error) {
        console.error("Error submitting bill:", error);
        toast.error('Failed to submit bill. Please try again.');
        throw error;
      }
      
      console.log("Bill submitted successfully:", data);
      
      if (data && data.length > 0) {
        // Transform returned data to match Bill type
        const newBill: Bill = {
          id: data[0].id,
          title: data[0].title,
          amount: data[0].amount,
          description: data[0].description,
          fileUrl: data[0].file_url,
          fileName: data[0].file_name,
          submittedBy: data[0].submitted_by,
          submitterName: data[0].submitter_name,
          submitterDepartment: data[0].submitter_department,
          date: data[0].date,
          status: data[0].status as "pending" | "approved" | "rejected",
          rejectionReason: data[0].rejection_reason,
          reviewedBy: data[0].reviewed_by,
          reviewedDate: data[0].reviewed_date
        };
        
        setBills(prevBills => [newBill, ...prevBills]);
        
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
      }
      
      toast.success('Bill submitted successfully');
      // Force a refetch to ensure data consistency
      fetchBills();
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
      const { error } = await supabase
        .from('bills')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_date: new Date().toISOString()
        })
        .eq('id', billId);
      
      if (error) throw error;
      
      // Update local state
      const approvedBill = bills.find(b => b.id === billId);
      
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === billId 
            ? { 
                ...bill, 
                status: "approved", 
                reviewedBy: user.id,
                reviewedDate: new Date().toISOString()
              } 
            : bill
        )
      );
      
      if (approvedBill) {
        const submitterEmail = 'Employeelogin2025@gmail.com'; // In a real app, fetch this from the database
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
      const { error } = await supabase
        .from('bills')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: user.id,
          reviewed_date: new Date().toISOString()
        })
        .eq('id', billId);
      
      if (error) throw error;
      
      // Update local state
      const rejectedBill = bills.find(b => b.id === billId);
      
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === billId 
            ? { 
                ...bill, 
                status: "rejected" as const,
                rejectionReason: reason,
                reviewedBy: user.id,
                reviewedDate: new Date().toISOString()
              } 
            : bill
        )
      );
      
      if (rejectedBill) {
        const submitterEmail = 'Employeelogin2025@gmail.com'; // In a real app, fetch this from the database
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
      console.log("Deleting bill:", billId);
      
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);
      
      if (error) {
        console.error("Error deleting bill:", error);
        toast.error('Failed to delete bill');
        throw error;
      }
      
      console.log("Bill deleted successfully");
      
      // Update local state
      setBills(prevBills => prevBills.filter(bill => bill.id !== billId));
      
      toast.success('Bill permanently deleted');
      
      // Force refetch to ensure consistency across users
      await fetchBills();
    } catch (error) {
      console.error('Delete bill error:', error);
      toast.error('Failed to delete bill');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSelectedBills = async (billIds: string[]) => {
    if (billIds.length === 0) return;
    
    setIsLoading(true);
    try {
      console.log("Deleting multiple bills:", billIds);
      
      const { error } = await supabase
        .from('bills')
        .delete()
        .in('id', billIds);
      
      if (error) {
        console.error("Error deleting multiple bills:", error);
        toast.error('Failed to delete bills');
        throw error;
      }
      
      console.log("Multiple bills deleted successfully");
      
      // Update local state
      setBills(prevBills => prevBills.filter(bill => !billIds.includes(bill.id)));
      
      toast.success(billIds.length === 1 
        ? 'Bill permanently deleted' 
        : `${billIds.length} bills permanently deleted`);
      
      // Force refetch to ensure consistency across users
      await fetchBills();
    } catch (error) {
      console.error('Delete bills error:', error);
      toast.error('Failed to delete bills');
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

  const clearAllBills = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log("Clearing all bills");
      
      // Delete ALL bills if admin/manager OR only user's bills if employee/HR
      let query = supabase.from('bills').delete();
      
      if (user.role === 'employee' || user.role === 'hr') {
        query = query.eq('submitted_by', user.id);
      }
      
      const { error } = await query;
      
      if (error) {
        console.error("Error clearing bills:", error);
        toast.error('Failed to clear bills');
        throw error;
      }
      
      console.log("Bills cleared successfully");
      
      // Update local state based on user role
      if (user.role === 'employee' || user.role === 'hr') {
        setBills(prevBills => prevBills.filter(bill => bill.submittedBy !== user.id));
      } else {
        setBills([]);
      }
      
      toast.success('All bills have been cleared');
      
      // Force refetch to ensure consistency across all users
      await fetchBills();
    } catch (error) {
      console.error('Clear bills error:', error);
      toast.error('Failed to clear bills');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BillContext.Provider value={{ 
      bills, 
      isLoading, 
      submitBill, 
      approveBill, 
      rejectBill, 
      deleteBill,
      deleteSelectedBills,
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
