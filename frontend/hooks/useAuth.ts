import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Convenience hook for accessing auth state and actions.
 */
export function useAuth() {
  return useAuthContext();
}
