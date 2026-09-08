import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import apiClient, {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from '../api/client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  token: string | null;
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setAdmin(null);
  }, []);

  const restoreSession = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setToken(null);
      setAdmin(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<AdminUser>('/auth/me');
      if (response.success && response.data) {
        setToken(stored);
        setAdmin(response.data);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Initial session check on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Listen for unauthorized 401 events dispatched from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.post<{ token?: string; admin?: AdminUser }>(
        '/auth/login',
        { email, password }
      );

      const receivedToken = response.token || response.data?.token;

      if (response.success && receivedToken) {
        setStoredToken(receivedToken);
        setToken(receivedToken);

        // Fetch fresh admin profile with new token
        const meResponse = await apiClient.get<AdminUser>('/auth/me');
        if (meResponse.success && meResponse.data) {
          setAdmin(meResponse.data);
        } else if (response.data?.admin) {
          setAdmin(response.data.admin);
        }

        return { success: true };
      }

      return {
        success: false,
        message: response.message || 'Invalid email or password',
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      return {
        success: false,
        message,
      };
    }
  };

  const isAuthenticated = !!token && !!admin;

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isLoading,
        isAuthenticated,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
