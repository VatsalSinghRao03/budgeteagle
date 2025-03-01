
import { toast } from 'sonner';

interface EmailParams {
  to: string;
  subject: string;
  message: string;
}

export const sendEmailNotification = async (params: EmailParams): Promise<void> => {
  // In a real app, this would make an API call to your email service
  console.log('Sending email notification:', params);
  
  try {
    // This is just a simulation for demo purposes
    // In a real implementation, this would call the Resend API
    
    /* 
    Example of what would happen in production:
    
    const resend = new Resend('re_SyyTcwCQ_4qU82mv4sxpSWyH9kru2ddAi');
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: params.to,
      subject: params.subject,
      html: `<p>${params.message}</p>`
    });
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Email sent successfully to:', params.to);
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending email:', error);
    toast.error('Failed to send email notification');
    return Promise.reject(error);
  }
};
