
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [processingAccount, setProcessingAccount] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated, createAndLoginTestAccount } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      console.log('Submitting login form with email:', email);
      const { success, message } = await login(email, password);
      
      if (success) {
        toast.success('Login successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setLoginError(message);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'An unexpected error occurred during login. Please try again.');
    }
  };
  
  const handleDemoLogin = async (testEmail: string) => {
    setProcessingAccount(testEmail);
    setEmail(testEmail);
    setPassword('password');
    setLoginError(null);
    
    console.log('Attempting to login with test account:', testEmail);
    
    try {
      const { success, message } = await createAndLoginTestAccount(testEmail);
      
      if (success) {
        toast.success('Demo login successful!');
        navigate('/dashboard');
      } else {
        setLoginError(message);
        toast.error(message);
      }
    } catch (error: any) {
      console.error('Test account login error:', error);
      setLoginError(`Failed to login with test account: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessingAccount(null);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-brand-blue text-white py-3 px-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <img 
            src="/lovable-uploads/7b7c80e1-0e0e-46de-8ddc-fb9d21b89cdc.png" 
            alt="Budget Eagle Logo" 
            className="h-10 w-auto mr-3" 
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Budget Eagle</h1>
            <p className="text-xs text-blue-100">A Budget Approval System</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 relative">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0" 
            alt="Corporate Background" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        
        <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-xl z-10">
          <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
          
          {loginError && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-blue hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : 'Log In'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-700 font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-2">
              {[
                { role: 'Employee (Rahul)', email: 'Employeelogin2025@gmail.com' },
                { role: 'HR (Priya)', email: 'Hrlogin@gmail.com' },
                { role: 'Manager (Vikram)', email: 'Managerlogin2025@gmail.com' },
                { role: 'Finance (Arjun)', email: 'Financelogin03@gmail.com' }
              ].map(account => (
                <button 
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email)}
                  className="w-full text-left px-2 py-1 hover:bg-blue-100 rounded text-sm transition-colors flex items-center"
                  disabled={isLoading || !!processingAccount}
                >
                  {processingAccount === account.email ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : null}
                  <span>{account.role}: {account.email}</span>
                </button>
              ))}
              <p className="text-xs text-gray-500 pt-1">Password for all accounts: password</p>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Note: If login fails, email confirmation might be required.
              Please check Supabase Auth settings to disable email confirmation for testing.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 px-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            © {new Date().getFullYear()} All rights reserved to TeamCoders
          </div>
          <div>
            Contact: <a href="mailto:Teamcoders03@gmail.com" className="text-brand-blue hover:underline">Teamcoders03@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
