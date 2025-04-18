
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
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
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-blue hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-700 font-medium mb-2">Demo Accounts:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Employee (Rahul): Employeelogin2025@gmail.com</li>
              <li>HR (Priya): Hrlogin@gmail.com</li>
              <li>Manager (Vikram): Managerlogin2025@gmail.com</li>
              <li>Finance (Arjun): Financelogin03@gmail.com</li>
              <li className="text-xs text-gray-500">Password for all accounts: password</li>
            </ul>
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
