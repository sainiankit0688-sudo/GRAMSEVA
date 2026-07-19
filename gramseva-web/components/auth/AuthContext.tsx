'use client';

import { createContext, useContext, useState, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { subscribeToAuthChanges, getAuthSnapshot, getAuthServerSnapshot, hasStoredSession, type AuthUser } from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isGuest: boolean;
  isLoading: boolean;
  showLoginDialog: (message?: string) => void;
  hideLoginDialog: () => void;
  loginDialogMessage: string | null;
  loginDialogOpen: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogMessage, setLoginDialogMessage] = useState<string | null>(null);
  const mounted = useMounted();

  const user = useSyncExternalStore(
    subscribeToAuthChanges,
    () => mounted ? getAuthSnapshot() : null,
    getAuthServerSnapshot,
  );

  const isLoading = !mounted;

  const showLoginDialog = useCallback((message?: string) => {
    setLoginDialogMessage(message || null);
    setLoginDialogOpen(true);
  }, []);

  const hideLoginDialog = useCallback(() => {
    setLoginDialogOpen(false);
    setLoginDialogMessage(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isGuest: mounted ? !hasStoredSession() : true,
      isLoading,
      showLoginDialog,
      hideLoginDialog,
      loginDialogMessage,
      loginDialogOpen,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      isGuest: true,
      isLoading: true,
      showLoginDialog: () => {},
      hideLoginDialog: () => {},
      loginDialogMessage: null,
      loginDialogOpen: false,
    };
  }
  return ctx;
}
