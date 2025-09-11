import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface EmbeddedServerStatus {
  isRunning: boolean;
  url: string;
  port: number;
  error?: string;
}

export function useEmbeddedServer() {
  const [status, setStatus] = useState<EmbeddedServerStatus>({
    isRunning: false,
    url: '',
    port: 8080,
  });

  const [isLoading, setIsLoading] = useState(false);

  const startServer = useCallback(async () => {
    if (Platform.OS === 'web') {
      // On web, we can't run an embedded server
      setStatus({
        isRunning: false,
        url: '',
        port: 8080,
        error: 'Embedded server not available on web platform'
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Import the embedded server only on native platforms
      const { embeddedServer } = await import('../services/embeddedServer');
      const success = await embeddedServer.start();
      
      if (success) {
        setStatus({
          isRunning: true,
          url: embeddedServer.getServerUrl(),
          port: 8080,
        });
      } else {
        setStatus({
          isRunning: false,
          url: '',
          port: 8080,
          error: 'Failed to start embedded server'
        });
      }
      
      return success;
    } catch (error) {
      setStatus({
        isRunning: false,
        url: '',
        port: 8080,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopServer = useCallback(async () => {
    if (Platform.OS === 'web') {
      return;
    }

    setIsLoading(true);
    try {
      const { embeddedServer } = await import('../services/embeddedServer');
      await embeddedServer.stop();
      setStatus({
        isRunning: false,
        url: '',
        port: 8080,
      });
    } catch (error) {
      console.error('Error stopping server:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkServerStatus = useCallback(async () => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      const { embeddedServer } = await import('../services/embeddedServer');
      const isRunning = embeddedServer.isServerRunning();
      setStatus(prev => ({
        ...prev,
        isRunning,
        url: isRunning ? embeddedServer.getServerUrl() : '',
      }));
    } catch (error) {
      console.error('Error checking server status:', error);
    }
  }, []);

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  return {
    status,
    isLoading,
    startServer,
    stopServer,
    checkServerStatus,
  };
}