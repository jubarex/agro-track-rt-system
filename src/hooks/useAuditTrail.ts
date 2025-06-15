
import { useSyncExternalStore, useCallback } from 'react';
import auditTrailStore from '@/lib/auditTrailStore';
import { useAuth } from './useAuth';

export const useAuditTrail = () => {
  const logs = useSyncExternalStore(auditTrailStore.subscribe, auditTrailStore.getSnapshot);
  const { user } = useAuth();
  
  const logAction = useCallback((action: string, details: any) => {
    auditTrailStore.logAction(user, action, details);
  }, [user]);

  return { logs, logAction };
};
