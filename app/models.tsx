import ModelDownloadScreen from '@/components/ModelDownloadScreen';
import { router } from 'expo-router';

export default function ModelsScreen() {
  return (
    <ModelDownloadScreen 
      onComplete={() => router.back()} 
    />
  );
}