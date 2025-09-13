'use client';

import { useInitializeAuth } from '@/hooks/use-auth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  useInitializeAuth();

  return <>{children}</>;
}
