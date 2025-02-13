import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: {
    id: string;
    email: string;
    gender: string;
    preferences: string[];
    age: number;
    onboardingComplete: boolean;
  } | null;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null }));
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null }));
      
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setState(prev => ({ ...prev, profile }));
        
        if (profile?.onboardingComplete) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }

      if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, profile: null }));
        router.replace('/(auth)');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create initial profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            email: user.email,
            gender: '',
            preferences: [],
            age: 0,
            onboardingComplete: false,
          },
        ]);
      }
      
      router.replace('/onboarding');
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}