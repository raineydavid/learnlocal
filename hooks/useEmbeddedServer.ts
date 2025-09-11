import { useState, useEffect } from 'react';
import { embeddedServer } from '@/services/embeddedServer';
import { api } from '@/services/api';

export function useEmbeddedServer() {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = () => {
    const running = embeddedServer.isServerRunning();
    setIsServerRunning(running);
    if (running) {
      setServerUrl(embeddedServer.getServerUrl());
    }
  };

  const startServer = async (): Promise<boolean> => {
    if (isServerRunning) {
      return true;
    }

    setIsStarting(true);
    setError(null);

    try {
      const success = await embeddedServer.start();
      if (success) {
        const url = embeddedServer.getServerUrl();
        setServerUrl(url);
        setIsServerRunning(true);
        
        // Update API service to use embedded server
        api.updateBaseURL(url);
        
        return true;
      } else {
        setError('Failed to start embedded server');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setIsStarting(false);
    }
  };

  const stopServer = async (): Promise<void> => {
    if (!isServerRunning) {
      return;
    }

    try {
      await embeddedServer.stop();
      setIsServerRunning(false);
      setServerUrl('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    }
  };

  const restartServer = async (): Promise<boolean> => {
    await stopServer();
    return await startServer();
  };

  return {
    isServerRunning,
    serverUrl,
    isStarting,
    error,
    startServer,
    stopServer,
    restartServer,
    checkServerStatus
  };
}