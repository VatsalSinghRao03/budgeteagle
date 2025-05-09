
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
            return;
          }
          
          if (profileData) {
            // Create user object from profile data
            setUser({
              id: session.user.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role as 'employee' | 'hr' | 'manager' | 'finance',
              department: profileData.department,
              avatar: profileData.avatar
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );
    
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch user profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
              return;
            }
            
            if (profileData) {
              // Create user object from profile data
              setUser({
                id: session.user.id,
                name: profileData.name,
                email: profileData.email,
                role: profileData.role as 'employee' | 'hr' | 'manager' | 'finance',
                department: profileData.department,
                avatar: profileData.avatar
              });
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sample user data for Supabase signup (in a real app, this would come from a signup form)
  const sampleUsers = [
    {
      email: 'Employeelogin2025@gmail.com',
      password: 'password',
      name: 'Rahul Sharma',
      role: 'employee',
      department: 'Marketing',
    },
    {
      email: 'Hrlogin@gmail.com',
      password: 'password',
      name: 'Priya Patel',
      role: 'hr',
      department: 'Human Resources',
    },
    {
      email: 'Managerlogin2025@gmail.com',
      password: 'password',
      name: 'Vikram Singh',
      role: 'manager',
      department: 'Operations',
    },
    {
      email: 'Financelogin03@gmail.com',
      password: 'password',
      name: 'Arjun Reddy',
      role: 'finance',
      department: 'Finance',
    },
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user exists in Supabase auth
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        // Check if this is a sample user that needs to be created
        const sampleUser = sampleUsers.find(u => u.email === email && u.password === password);
        
        if (sampleUser) {
          // Create the user in Supabase auth
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: sampleUser.name,
                role: sampleUser.role,
                department: sampleUser.department
              }
            }
          });
          
          if (signUpError) {
            throw signUpError;
          }
          
          // Try signing in again
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (retryError) {
            throw retryError;
          }
          
          toast.success(`Welcome, ${sampleUser.name}!`);
          return true;
        } else {
          throw signInError;
        }
      }
      
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      return;
    }
    
    setUser(null);
    setSession(null);
    toast.info('You have been logged out');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
