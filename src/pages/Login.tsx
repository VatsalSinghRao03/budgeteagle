
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="bg-white flex-1 flex flex-col justify-center items-center p-8 md:p-16 z-10">
        <div className="text-center mb-8 animate-fade-in">
          <img
            src="/lovable-uploads/b11177f7-7044-4809-852f-d44fbd57df61.png"
            alt="Budget Eagle Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Budget Eagle</h1>
          <p className="text-sm text-gray-500 mt-1">A Budget Approval System</p>
        </div>
        
        <div className="w-full max-w-md glass-card p-8 rounded-xl animate-scale-in">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Log In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <h3 className="font-medium text-blue-800 mb-2">Demo Accounts:</h3>
              <ul className="space-y-1 text-blue-700 ml-5 list-disc">
                <li>Employee (Rahul): Employeelogin2025@gmail.com</li>
                <li>HR (Priya): Hrlogin@gmail.com</li>
                <li>Manager (Vikram): Managerlogin2025@gmail.com</li>
                <li>Finance (Arjun): Financelogin03@gmail.com</li>
                <li className="font-medium">Password for all accounts: password</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-blue hover:bg-brand-blue/90"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Email notifications are enabled for all actions.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} All rights reserved to TeamCoders
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Contact: <a href="mailto:Teamcoders03@gmail.com" className="text-brand-blue hover:underline">Teamcoders03@gmail.com</a>
          </p>
        </div>
      </div>
      
      {/* Right side - Image background */}
      <div className="hidden md:block flex-1 bg-gradient-to-br from-brand-blue to-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Streamline Your Budget Approval Process</h2>
          <p className="text-lg max-w-md text-center">
            Efficient budget management for modern organizations. Submit, approve, and track expenses with ease.
          </p>
        </div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
