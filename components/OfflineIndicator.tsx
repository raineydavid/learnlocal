import { View, Text, StyleSheet } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineIndicator() {
  const networkStatus = useNetworkStatus();

  if (networkStatus.isConnected) {
    return null; // Don't show anything when online
  }

  return (
    <View style={styles.container}>
      <WifiOff size={16} color="#FFFFFF" />
      <Text style={styles.text}>Offline Mode - Using Cached Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});