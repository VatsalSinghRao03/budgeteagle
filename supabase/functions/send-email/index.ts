
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, name }: EmailRequest = await req.json();

    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Name: ${name || 'User'}`);

    const emailResponse = await resend.emails.send({
      from: "Budget Eagle <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Budget Eagle Notification</h1>
          <p style="margin-top: 20px;">Hello ${name || 'there'},</p>
          <div style="margin: 20px 0; line-height: 1.5;">
            ${message}
          </div>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">This is an automated message from Budget Eagle system. Please do not reply to this email.</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
            © ${new Date().getFullYear()} Budget Eagle. All rights reserved.
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
