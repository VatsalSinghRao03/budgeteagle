
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createAndLoginTestAccount: (email: string) => Promise<boolean>;
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
    // Get the initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setSupabaseUser(data.session?.user || null);
        setUser(mapToAppUser(data.session?.user || null));
        
        console.log('Initial session loaded:', data.session?.user?.email);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      setSession(session);
      setSupabaseUser(session?.user || null);
      setUser(mapToAppUser(session?.user || null));
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      if (data.user) {
        console.log('Login successful for:', email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login exception:', error);
      throw error;
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
  
  const createAndLoginTestAccount = async (email: string): Promise<boolean> => {
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
      
      // Try to create the account
      console.log('Creating account for:', email);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password',
        options: {
          data: {
            name: sampleUser.name,
            role: sampleUser.role,
            department: sampleUser.department
          }
        }
      });
      
      if (signUpError) {
        // If it's an error about the user already existing, try to sign in directly
        console.error('Sign-up error:', signUpError);
        if (signUpError.message?.includes('User already registered')) {
          console.log('User already exists, attempting to log in');
          return await login(email, 'password');
        }
        return false;
      }
      
      if (signUpData.user) {
        // Successfully created user, now try to log in
        console.log('Account created, attempting to sign in');
        return await login(email, 'password');
      }
      
      return false;
    } catch (error) {
      console.error('Create test account error:', error);
      return false;
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
