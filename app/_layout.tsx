import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useState } from 'react';
import ModelDownloadScreen from '@/components/ModelDownloadScreen';

export default function RootLayout() {
  useFrameworkReady();
  const [modelsReady, setModelsReady] = useState(false);

  // Check if models are already downloaded
  useEffect(() => {
    // In a real app, check if required models are available
    // For demo purposes, we'll show the download screen initially
    const checkModels = async () => {
      // Simulate checking for existing models
      setTimeout(() => {
        // Set to true to skip download screen for demo
        setModelsReady(true);
      }, 1000);
    };
    
    checkModels();
  }, []);

  if (!modelsReady) {
    return <ModelDownloadScreen onComplete={() => setModelsReady(true)} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}