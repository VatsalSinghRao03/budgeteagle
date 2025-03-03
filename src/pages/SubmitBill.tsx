
import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import BillSubmissionForm from '@/components/Bills/BillSubmissionForm';

const SubmitBill: React.FC = () => {
  return (
    <div className="page-container">
      <PageTitle 
        title="Submit New Bill" 
        subtitle="Fill in the details of the expense and attach any relevant documents"
      />
      
      <BillSubmissionForm />
    </div>
  );
};

export default SubmitBill;
