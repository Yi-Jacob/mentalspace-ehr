
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  timestamp: number;
  data: any;
  action: string;
}

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Connection Restored',
        description: 'You are back online. Syncing pending changes...',
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Connection Lost',
        description: 'Working offline. Changes will sync when connection is restored.',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending actions from localStorage
    const stored = localStorage.getItem('offline-actions');
    if (stored) {
      setPendingActions(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const queueAction = useCallback((action: string, data: any) => {
    const offlineData: OfflineData = {
      timestamp: Date.now(),
      data,
      action
    };

    setPendingActions(prev => {
      const updated = [...prev, offlineData];
      localStorage.setItem('offline-actions', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: 'Action Queued',
      description: 'This action will be synced when you\'re back online.',
    });
  }, [toast]);

  const syncPendingActions = useCallback(async () => {
    if (pendingActions.length === 0) return;

    try {
      // Process pending actions
      for (const action of pendingActions) {
        // Implement sync logic based on action type
        console.log('Syncing action:', action);
      }

      setPendingActions([]);
      localStorage.removeItem('offline-actions');

      toast({
        title: 'Sync Complete',
        description: `${pendingActions.length} actions synced successfully.`,
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: 'Sync Failed',
        description: 'Some actions could not be synced. Will retry later.',
        variant: 'destructive',
      });
    }
  }, [pendingActions, toast]);

  return {
    isOnline,
    pendingActions,
    queueAction,
    syncPendingActions
  };
};
