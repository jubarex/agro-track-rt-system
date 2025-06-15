
import { User } from '@/types';

export type AuditLog = {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  details: any;
};

let logs: AuditLog[] = [];
const subscribers: (() => void)[] = [];

const auditTrailStore = {
  logAction: (user: User | null, action: string, details: any) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      user: user?.name || 'Sistema',
      action,
      details,
      timestamp: new Date(),
    };
    logs = [newLog, ...logs];
    subscribers.forEach(callback => callback());
  },
  subscribe: (callback: () => void) => {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  },
  getSnapshot: () => logs,
};

export default auditTrailStore;
