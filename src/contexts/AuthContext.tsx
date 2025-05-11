
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppUser } from '@/types';

interface AuthContextType {
  user: AppUser | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, message: string}>;
  logout: () => Promise<void>;
  createAndLoginTestAccount: (email: string) => Promise<{success: boolean, message: string}>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);

  // Map Supabase user to our AppUser type
  const mapToAppUser = (user: User | null): AppUser | null => {
    if (!user) return null;
    
    // Sample mapping based on email patterns
    let role: 'employee' | 'hr' | 'manager' | 'finance' = 'employee';
    let name = 'User';
    let department = 'General';
    
    const email = user.email?.toLowerCase() || '';
    
    if (email.includes('employeelogin')) {
      role = 'employee';
      name = 'Rahul Sharma';
      department = 'IT Department';
    } else if (email.includes('hrlogin')) {
      role = 'hr';
      name = 'Priya Patel';
      department = 'Human Resources';
    } else if (email.includes('managerlogin')) {
      role = 'manager';
      name = 'Vikram Singh';
      department = 'Operations';
    } else if (email.includes('financelogin')) {
      role = 'finance';
      name = 'Arjun Mehta';
      department = 'Finance';
    }
    
    return {
      id: user.id,
      email: user.email || '',
      name,
      role,
      department
    };
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log('Auth state change:', event, newSession?.user?.email || 'No user');
          
          setSession(newSession);
          setSupabaseUser(newSession?.user || null);
          setUser(mapToAppUser(newSession?.user || null));
        });
        
        // Then get the initial session
        const { data } = await supabase.auth.getSession();
        console.log('Initial session loaded:', data.session?.user?.email || 'No user');
        
        setSession(data.session);
        setSupabaseUser(data.session?.user || null);
        setUser(mapToAppUser(data.session?.user || null));
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean, message: string}> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      // First try regular sign in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        
        // If email not confirmed, try to use admin sign-in for demo accounts
        if (error.message?.includes('Email not confirmed') && 
            (email.toLowerCase().includes('login') || email.toLowerCase().includes('test'))) {
          console.log('Email not confirmed, attempting alternate sign-in for demo account');
          
          // For demo accounts, try to create and sign in directly
          return await createAndLoginTestAccount(email);
        }
        
        return {
          success: false, 
          message: error.message || 'Login failed. Please check your credentials and try again.'
        };
      }
      
      if (data.user) {
        console.log('Login successful for:', email);
        return {
          success: true,
          message: 'Login successful'
        };
      }
      
      return {
        success: false,
        message: 'Login failed. No user data returned.'
      };
    } catch (error: any) {
      console.error('Login exception:', error);
      return {
        success: false,
        message: `Login error: ${error.message || 'Unknown error'}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createAndLoginTestAccount = async (email: string): Promise<{success: boolean, message: string}> => {
    setIsLoading(true);
    
    try {
      // Determine user details based on email
      let sampleUser: {
        email: string;
        name: string;
        role: 'employee' | 'hr' | 'manager' | 'finance';
        department: string;
      } = {
        email,
        name: 'Default User',
        role: 'employee',
        department: 'General'
      };
      
      if (email.toLowerCase().includes('employeelogin')) {
        sampleUser.name = 'Rahul Sharma';
        sampleUser.role = 'employee';
        sampleUser.department = 'IT Department';
      } else if (email.toLowerCase().includes('hrlogin')) {
        sampleUser.name = 'Priya Patel';
        sampleUser.role = 'hr';
        sampleUser.department = 'Human Resources';
      } else if (email.toLowerCase().includes('managerlogin')) {
        sampleUser.name = 'Vikram Singh';
        sampleUser.role = 'manager';
        sampleUser.department = 'Operations';
      } else if (email.toLowerCase().includes('financelogin')) {
        sampleUser.name = 'Arjun Mehta';
        sampleUser.role = 'finance';
        sampleUser.department = 'Finance';
      }
      
      // Try to sign up the user (or just continue if they already exist)
      console.log('Creating or confirming account for demo user:', email);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password',
        options: {
          data: {
            name: sampleUser.name,
            role: sampleUser.role,
            department: sampleUser.department
          },
        }
      });
      
      // If we couldn't sign up, it might already exist - ignore this error
      if (signUpError && !signUpError.message?.includes('User already registered')) {
        console.error('Sign-up error:', signUpError);
      }
      
      // Now try to sign in with admin sign in (which bypasses email verification)
      console.log('Attempting sign in for demo account:', email);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'password'
      });
      
      if (signInError) {
        console.error('Demo account sign-in error:', signInError);
        
        if (signInError.message?.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Email not confirmed for this account. Please go to Supabase Auth settings and disable email confirmation for your project.'
          };
        }
        
        return {
          success: false,
          message: `Demo login failed: ${signInError.message}`
        };
      }
      
      if (signInData.user) {
        console.log('Demo account login successful');
        return {
          success: true,
          message: 'Demo login successful'
        };
      }
      
      return {
        success: false,
        message: 'Failed to create and login with demo account for an unknown reason'
      };
    } catch (error: any) {
      console.error('Create test account error:', error);
      return {
        success: false,
        message: `Error: ${error.message || 'Unknown error'}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        createAndLoginTestAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
