
import { supabase } from "@/integrations/supabase/client";

interface EmailParams {
  to: string;
  subject: string;
  message: string;
  name?: string;
}

export const sendEmailNotification = async (params: EmailParams): Promise<boolean> => {
  try {
    console.log('Sending email notification:');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Message: ${params.message}`);
    
    // Call the Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: params.to,
        subject: params.subject,
        message: params.message,
        name: params.name
      }
    });
    
    if (error) {
      console.error('Email service error:', error);
      return false;
    }
    
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};
