import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const ADMIN_SYNC_EVENT = 'admin-data-updated';

/**
 * Custom hook to dispatch an admin data update event
 */
export const useNotifyAdminChange = () => {
  const queryClient = useQueryClient();

  const notifyChange = (queryKeys?: string[]) => {
    if (queryKeys && queryKeys.length > 0) {
      queryKeys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    } else {
      queryClient.invalidateQueries();
    }
    // Dispatch global event across windows/tabs/components
    window.dispatchEvent(new CustomEvent(ADMIN_SYNC_EVENT, { detail: { queryKeys } }));
  };

  return { notifyChange };
};

/**
 * Custom hook for public components to listen to admin changes and refetch
 */
export const useAdminSyncListener = (onSync: () => void) => {
  useEffect(() => {
    const handleSync = () => {
      onSync();
    };

    window.addEventListener(ADMIN_SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(ADMIN_SYNC_EVENT, handleSync);
    };
  }, [onSync]);
};
