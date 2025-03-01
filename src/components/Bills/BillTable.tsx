import React, { useState } from 'react';
import { Bill } from '@/types';
import { useBill } from '@/contexts/BillContext';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Download, Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatusBadge from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BillTableProps {
  bills: Bill[];
  showFilters?: boolean;
}

const BillTable: React.FC<BillTableProps> = ({ bills, showFilters = true }) => {
  const { user } = useAuth();
  const { approveBill, rejectBill, isLoading } = useBill();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Filter bills based on search term and status
  const filteredBills = bills.filter(bill => {
    // Filter by search term
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.submitterDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setViewModalOpen(true);
  };
  
  const handleApproveBill = (bill: Bill) => {
    setSelectedBill(bill);
    setApproveDialogOpen(true);
  };
  
  const handleRejectBill = (bill: Bill) => {
    setSelectedBill(bill);
    setRejectDialogOpen(true);
  };
  
  const confirmApprove = async () => {
    if (selectedBill) {
      await approveBill(selectedBill.id);
      setApproveDialogOpen(false);
    }
  };
  
  const confirmReject = async () => {
    if (selectedBill && rejectionReason.trim() !== '') {
      await rejectBill(selectedBill.id, rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason('');
    }
  };
  
  const downloadFile = (fileUrl?: string) => {
    if (fileUrl) {
      // Create a mock file URL since we don't actually have a file server
      // In a real app, this would be a valid URL to the file
      try {
        // For demo purposes, we'll simulate a PDF download
        const blob = new Blob(['This is a sample bill receipt'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedBill?.fileName || 'receipt.pdf';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
        
        console.log('File download initiated');
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download file');
      }
    } else {
      toast.error('No file attachment available');
    }
  };
  
  return (
    <>
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
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
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(bill.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.submitterName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.submitterDepartment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(bill.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={bill.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBill(bill)}
                        className="text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {user?.role === 'manager' && bill.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveBill(bill)}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectBill(bill)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No bills found. Adjust your filters or submit a new bill.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* View Bill Dialog */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBill?.title}</DialogTitle>
            <DialogDescription>
              Submitted on {selectedBill ? formatDate(selectedBill.date) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Amount</Label>
              <div className="col-span-3 font-medium">
                {selectedBill ? formatCurrency(selectedBill.amount) : ''}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Submitted By</Label>
              <div className="col-span-3">
                {selectedBill?.submitterName} ({selectedBill?.submitterDepartment})
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Description</Label>
              <div className="col-span-3">
                {selectedBill?.description}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                {selectedBill && <StatusBadge status={selectedBill.status} />}
              </div>
            </div>
            
            {selectedBill?.status === 'rejected' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Rejection Reason</Label>
                <div className="col-span-3 text-red-600">
                  {selectedBill.rejectionReason}
                </div>
              </div>
            )}
            
            {selectedBill?.fileUrl && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Attachment</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-3 justify-start gap-2"
                  onClick={() => downloadFile(selectedBill.fileUrl)}
                >
                  <Download className="h-4 w-4" />
                  <span>Download {selectedBill.fileName || 'Receipt'}</span>
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Bill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this bill for {selectedBill ? formatCurrency(selectedBill.amount) : ''}?
              This action will send email notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Approving...' : 'Approve Bill'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Bill</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this bill.
              This reason will be included in the notification to the submitter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={rejectionReason.trim() === '' || isLoading}
            >
              {isLoading ? 'Rejecting...' : 'Reject Bill'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BillTable;
