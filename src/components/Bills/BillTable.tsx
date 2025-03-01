
import React, { useState } from 'react';
import { Bill } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatusBadge from '@/components/Common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import { FileText, Download, Check, X, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface BillTableProps {
  bills: Bill[];
}

const BillTable: React.FC<BillTableProps> = ({ bills }) => {
  const { user } = useAuth();
  const { approveBill, rejectBill, deleteBill } = useBill();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleApprove = async () => {
    if (!selectedBill) return;
    
    try {
      await approveBill(selectedBill.id);
      setIsApproveDialogOpen(false);
      setSelectedBill(null);
    } catch (error) {
      console.error('Failed to approve bill:', error);
    }
  };
  
  const handleReject = async () => {
    if (!selectedBill || !rejectionReason.trim()) return;
    
    try {
      await rejectBill(selectedBill.id, rejectionReason);
      setIsRejectDialogOpen(false);
      setSelectedBill(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject bill:', error);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedBill) return;
    
    try {
      await deleteBill(selectedBill.id);
      setIsDeleteDialogOpen(false);
      setSelectedBill(null);
    } catch (error) {
      console.error('Failed to delete bill:', error);
    }
  };
  
  const handleDownload = (bill: Bill) => {
    toast.info('Downloading bill attachment...');
    // This would normally download the file
    console.log('Downloading bill:', bill);
  };
  
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 glass-card animate-fade-in">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted By
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bills.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No bills found. Adjust your filters or submit a new bill.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{bill.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{formatCurrency(bill.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bill.submitterName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bill.submitterDepartment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(bill.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={bill.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {bill.fileUrl && (
                        <button
                          onClick={() => handleDownload(bill)}
                          className="text-brand-blue hover:text-brand-blue/80 p-1 rounded-full hover:bg-gray-100"
                          title="Download Attachment"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      )}
                      
                      {user?.role === 'manager' && bill.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBill(bill);
                              setIsApproveDialogOpen(true);
                            }}
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                            title="Approve"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedBill(bill);
                              setIsRejectDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                            title="Reject"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      
                      {user?.role === 'finance' && (
                        <button
                          onClick={() => {
                            setSelectedBill(bill);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Bill</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this bill?
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="py-4">
              <div className="grid gap-2 mb-4">
                <div><span className="font-medium">Title:</span> {selectedBill.title}</div>
                <div><span className="font-medium">Amount:</span> {formatCurrency(selectedBill.amount)}</div>
                <div><span className="font-medium">Submitted By:</span> {selectedBill.submitterName}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bill</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this bill.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="py-4">
              <div className="grid gap-2 mb-4">
                <div><span className="font-medium">Title:</span> {selectedBill.title}</div>
                <div><span className="font-medium">Amount:</span> {formatCurrency(selectedBill.amount)}</div>
                <div><span className="font-medium">Submitted By:</span> {selectedBill.submitterName}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="h-24"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReject} 
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="py-4">
              <div className="grid gap-2 mb-4">
                <div><span className="font-medium">Title:</span> {selectedBill.title}</div>
                <div><span className="font-medium">Amount:</span> {formatCurrency(selectedBill.amount)}</div>
                <div><span className="font-medium">Submitted By:</span> {selectedBill.submitterName}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillTable;
