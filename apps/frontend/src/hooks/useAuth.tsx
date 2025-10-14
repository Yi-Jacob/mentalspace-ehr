
import { useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  forceLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const forceLogout = () => {
    // Immediate logout without backend call - used for 401 errors
    setUser(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const user = await authService.validateToken();
        if (mounted) {
          setError(null);
          setUser(user);
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

    // Listen for force logout events (from 401 errors)
    const handleForceLogout = () => {
      if (mounted) {
        forceLogout();
      }
    };

    window.addEventListener('auth:force-logout', handleForceLogout);

    // Cleanup function
    return () => {
      mounted = false;
      window.removeEventListener('auth:force-logout', handleForceLogout);
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Sign out error:', err);
      // Even if logout fails, clear the user state
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
    forceLogout,
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
