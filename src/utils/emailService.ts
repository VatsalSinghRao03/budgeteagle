
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

interface EmailParams {
  to: string;
  subject: string;
  message: string;
  name?: string;
}

// Using direct Resend API approach
export const sendEmailNotification = async (params: EmailParams): Promise<boolean> => {
  try {
    console.log('Sending email notification:');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Message: ${params.message}`);
    
    // Using Resend API directly
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Budget Eagle <Teamcoders03@gmail.com>',
        to: [params.to],
        subject: params.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #3b82f6;">Hello ${params.name || 'there'}!</h2>
            <div style="margin: 20px 0; line-height: 1.5;">
              ${params.message}
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
              <p>This is an automated message from Budget Eagle. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Email sent successfully:', response.data);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

// Function to store Resend API key in localStorage
export const setResendApiKey = (apiKey: string): void => {
  localStorage.setItem('RESEND_API_KEY', apiKey);
};

// Function to check if Resend API key exists
export const hasResendApiKey = (): boolean => {
  return !!localStorage.getItem('RESEND_API_KEY');
};
