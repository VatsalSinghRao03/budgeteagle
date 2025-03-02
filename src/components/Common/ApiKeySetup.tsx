
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { hasResendApiKey, setResendApiKey } from '@/utils/emailService';

const ApiKeySetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Check if API key is already set
    if (!hasResendApiKey()) {
      setOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setResendApiKey(apiKey.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Notification Setup</DialogTitle>
          <DialogDescription>
            Enter your Resend API key to enable email notifications in Budget Eagle.
            You can get an API key from <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Resend.com</a>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Resend API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="re_xxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>Your API key will be stored securely in your browser's local storage and will only be used to send email notifications from this application.</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetup;
