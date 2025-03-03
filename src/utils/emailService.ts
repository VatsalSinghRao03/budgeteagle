
import emailjs from 'emailjs-com';

interface EmailParams {
  to: string;
  subject: string;
  message: string;
  name?: string;
}

// Service and template IDs
const SERVICE_ID = 'service_7muu8lb';
const USER_ID = 'u4lGu23Rsw4dbrRya';
const TEMPLATE_SUBMISSION_ID = 'template_361s7im';
const TEMPLATE_APPROVAL_ID = 'template_s4fu2fy';

// Send emails using EmailJS
export const sendEmailNotification = async (params: EmailParams): Promise<boolean> => {
  try {
    console.log('Sending email notification:');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Message: ${params.message}`);
    
    // Determine which template to use based on the subject
    const isApprovalEmail = params.subject.includes('Approved') || 
                           params.subject.includes('Rejected') ||
                           params.subject.includes('Approval');
    
    // Prepare template params based on email type
    let templateParams;
    let templateId;
    
    if (isApprovalEmail) {
      // For approval/rejection emails
      templateParams = {
        manager_name: params.name || 'Manager',
        bill_name: extractBillTitle(params.message),
        employee_name: extractEmployeeName(params.message),
        approval_status: params.subject.includes('Approved') ? 'approved' : 'rejected',
        to_email: params.to,
      };
      templateId = TEMPLATE_APPROVAL_ID;
    } else {
      // For bill submission emails
      templateParams = {
        user_name: params.name || 'User',
        bill_name: extractBillTitle(params.message),
        role: determineRole(params.message),
        to_email: params.to,
      };
      templateId = TEMPLATE_SUBMISSION_ID;
    }
    
    // Send email using EmailJS
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams,
      USER_ID
    );
    
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

// Helper functions to extract information from message
function extractBillTitle(message: string): string {
  const titleMatch = message.match(/"([^"]+)"/);
  return titleMatch ? titleMatch[1] : 'Bill';
}

function extractEmployeeName(message: string): string {
  const nameMatch = message.match(/submitted by ([^.]+)/);
  return nameMatch ? nameMatch[1] : 'Employee';
}

function determineRole(message: string): string {
  if (message.includes('HR')) return 'HR';
  if (message.includes('Manager')) return 'Manager';
  if (message.includes('Finance')) return 'Finance';
  return 'Employee';
}

// These functions are no longer needed with EmailJS
export const setResendApiKey = (apiKey: string): void => {
  // Kept for backwards compatibility, does nothing now
  console.log('EmailJS is configured, no API key needed');
};

export const hasResendApiKey = (): boolean => {
  return true; // Always return true as EmailJS is configured with hardcoded credentials
};
