
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface BillDownloadButtonProps {
  fileUrl: string | null;
  fileName: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const BillDownloadButton: React.FC<BillDownloadButtonProps> = ({
  fileUrl, 
  fileName,
  className,
  variant = "outline",
  size = "sm"
}) => {
  const handleDownload = async () => {
    if (!fileUrl) {
      toast.error("No file available to download");
      return;
    }
    
    try {
      // Fetch the file content from the URL
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'bill-receipt.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      className={className}
      disabled={!fileUrl}
      title={fileUrl ? "Download receipt" : "No file available"}
    >
      <Download className="h-4 w-4 mr-1" />
      Download
    </Button>
  );
};

export default BillDownloadButton;
