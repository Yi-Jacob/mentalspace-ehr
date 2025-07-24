
import { useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = async () => {
    try {
      const user = await authService.validateToken();
      setUser(user);
      setError(null);
    } catch (err) {
      console.error('Session refresh error:', err);
      setError('Failed to refresh session');
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const user = await authService.initializeAuth();
        if (mounted) {
          setUser(user);
          setError(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError('Failed to initialize authentication');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out user');
      setLoading(true);
      
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
      // Force logout even if API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
