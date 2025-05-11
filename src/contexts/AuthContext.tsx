
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        
        if (error.message?.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Email not confirmed. Please check your inbox for a verification email or use one of the demo accounts below.'
          };
        }
        
        return {
          success: false, 
          message: 'Login failed. Please check your credentials and try again.'
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
      
      // Try to sign in directly first (in case account already exists)
      console.log('Trying to sign in existing account for:', email);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'password'
      });
      
      if (!signInError && signInData.user) {
        console.log('Existing account found and signed in successfully');
        return {
          success: true,
          message: 'Signed in with existing test account'
        };
      }
      
      // If login fails with email not confirmed, try to force login for demo accounts
      if (signInError && signInError.message?.includes('Email not confirmed')) {
        console.log('Email not confirmed for existing account, attempting direct login for demo purposes');
        
        // Force a login attempt for demo account despite email not being confirmed
        const { data: forceSignInData, error: forceSignInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'password'
        });
        
        if (!forceSignInError && forceSignInData.user) {
          console.log('Forced login successful for demo account');
          return {
            success: true,
            message: 'Demo login successful'
          };
        }
      }
      
      // Only if sign in fails, try to create the account
      console.log('Creating new account for:', email);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password',
        options: {
          data: {
            name: sampleUser.name,
            role: sampleUser.role,
            department: sampleUser.department
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (signUpError) {
        console.error('Sign-up error:', signUpError);
        
        // Special case: if account exists but email not confirmed, allow login anyway for demo accounts
        if (signUpError.message?.includes('User already registered')) {
          console.log('User already exists, attempting admin sign-in for demo account');
          
          // For demo purposes, force a login
          try {
            const { data: demoSignIn, error: demoSignInError } = await supabase.auth.signInWithPassword({
              email,
              password: 'password'
            });
            
            if (demoSignInError) {
              if (demoSignInError.message?.includes('Email not confirmed')) {
                return {
                  success: false,
                  message: 'This account exists but email is not confirmed. Please check Supabase settings to disable email confirmation for testing.'
                };
              }
              return {
                success: false,
                message: `Demo login failed: ${demoSignInError.message}`
              };
            }
            
            if (demoSignIn.user) {
              console.log('Demo login successful');
              return {
                success: true,
                message: 'Demo login successful'
              };
            }
          } catch (e) {
            console.error('Demo sign-in error:', e);
          }
        }
        
        return {
          success: false,
          message: `Account creation failed: ${signUpError.message}`
        };
      }
      
      if (signUpData.user) {
        console.log('Account created successfully, attempting to sign in');
        
        // For newly created accounts, the email confirmation might be required
        // For demo purposes, we'll try to sign in directly
        const { data: newSignIn, error: newSignInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'password'
        });
        
        if (newSignInError) {
          if (newSignInError.message?.includes('Email not confirmed')) {
            return {
              success: false,
              message: 'Account created but email confirmation is required. Go to Supabase Auth settings to disable email confirmation for testing.'
            };
          }
          return {
            success: false,
            message: `New account login failed: ${newSignInError.message}`
          };
        }
        
        if (newSignIn.user) {
          console.log('New account login successful');
          return {
            success: true,
            message: 'Account created and logged in successfully'
          };
        }
      }
      
      return {
        success: false,
        message: 'Failed to create and login with test account for an unknown reason'
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
