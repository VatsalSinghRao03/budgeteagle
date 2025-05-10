
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface UserMetadata {
  name?: string;
  role?: 'employee' | 'hr' | 'manager' | 'finance';
  department?: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert Supabase User to our App User
  const mapToAppUser = (supabaseUser: SupabaseUser): User => {
    const metadata = supabaseUser.user_metadata as UserMetadata;
    
    return {
      id: supabaseUser.id,
      name: metadata?.name || 'User',
      email: supabaseUser.email || '',
      role: metadata?.role || 'employee',
      department: metadata?.department || 'General',
      avatar: metadata?.avatar
    };
  };

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const appUser = mapToAppUser(session.user);
          setUser(appUser);
          
          // Fetch profile data in a separate call to avoid recursion
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const appUser = mapToAppUser(session.user);
        setUser(appUser);
        // Fetch profile data
        fetchUserProfile(session.user.id);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (profileData) {
        // Update user with profile data
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            name: profileData.name,
            role: profileData.role as 'employee' | 'hr' | 'manager' | 'finance',
            department: profileData.department,
            avatar: profileData.avatar
          };
        });
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
    }
  };

  // Sample user data for Supabase signup
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
      console.log('Attempting to sign in with:', email);
      
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.log('Sign-in error, attempting to create account:', signInError.message);
        
        // If sign in failed, check if this is a sample user that needs to be created
        const sampleUser = sampleUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (sampleUser) {
          console.log('Creating sample user account:', sampleUser.email);
          
          // Create the user in Supabase auth
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: sampleUser.email,
            password: sampleUser.password,
            options: {
              data: {
                name: sampleUser.name,
                role: sampleUser.role,
                department: sampleUser.department
              }
            }
          });
          
          if (signUpError) {
            console.error('Error creating sample user:', signUpError);
            // Check if it's a "User already registered" error, which means we can try signing in
            if (signUpError.message.includes('already registered')) {
              console.log('User already exists, trying to sign in directly');
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: sampleUser.email,
                password: sampleUser.password
              });
              
              if (retryError) {
                console.error('Error signing in after account creation:', retryError);
                throw retryError;
              }
              
              console.log('Successfully signed in as existing sample user');
              toast.success(`Welcome, ${sampleUser.name}!`);
              return true;
            } else {
              throw signUpError;
            }
          }
          
          // Create profile entry in the profiles table
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: signUpData.user?.id,
                name: sampleUser.name,
                email: sampleUser.email,
                role: sampleUser.role,
                department: sampleUser.department
              });
              
            if (profileError) {
              console.error('Error creating profile:', profileError);
            }
          } catch (err) {
            console.error('Error in profile creation:', err);
          }
          
          console.log('Account created, attempting to sign in');
          
          // Try signing in again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: sampleUser.email,
            password: sampleUser.password
          });
          
          if (retryError) {
            console.error('Error signing in after account creation:', retryError);
            throw retryError;
          }
          
          console.log('Successfully created and signed in as sample user');
          toast.success(`Welcome, ${sampleUser.name}!`);
          return true;
        } else {
          console.error('Login failed, not a sample user');
          throw signInError;
        }
      }
      
      if (signInData.user) {
        const appUser = mapToAppUser(signInData.user);
        toast.success(`Welcome back, ${appUser.name}!`);
      } else {
        toast.success('Login successful');
      }
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
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
