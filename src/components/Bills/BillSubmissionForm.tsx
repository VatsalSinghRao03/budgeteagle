
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBill } from '@/contexts/BillContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillSubmissionForm: React.FC = () => {
  const { user } = useAuth();
  const { submitBill, isLoading } = useBill();
  const navigate = useNavigate();
  
  const [billData, setBillData] = useState({
    title: '',
    amount: '',
    description: '',
    fileName: '',
  });
  
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileUpload(file);
      setBillData(prev => ({ ...prev, fileName: file.name }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      await submitBill({
        title: billData.title,
        amount: parseFloat(billData.amount),
        description: billData.description,
        submittedBy: user.id,
        fileName: billData.fileName,
        fileUrl: fileUpload ? URL.createObjectURL(fileUpload) : undefined,
      });
      
      navigate('/bills');
    } catch (error) {
      console.error('Error submitting bill:', error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto glass-card p-6 rounded-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <Label htmlFor="title" className="form-label">Bill Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Office Supplies"
            value={billData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="amount" className="form-label">Amount (₹)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={billData.amount}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="description" className="form-label">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide details about this expense..."
            value={billData.description}
            onChange={handleChange}
            required
            className="form-textarea h-32"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="fileUpload" className="form-label">Attach Receipt or Invoice</Label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="fileUpload"
              className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Browse Files
              <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            {billData.fileName && (
              <span className="ml-3 text-sm text-gray-500">{billData.fileName}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (max 10MB)</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Email Notifications</h3>
          <ul className="text-xs text-blue-700 space-y-1 ml-5 list-disc">
            <li>You will receive an email confirmation when your bill is submitted</li>
            <li>Your manager will be notified about this bill submission</li>
            <li>You will receive an email when your bill is approved or rejected</li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/bills')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || !billData.title || !billData.amount}
            className="btn-primary"
          >
            {isLoading ? 'Submitting...' : 'Submit Bill'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BillSubmissionForm;
