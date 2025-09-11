import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { X, Wifi, Bluetooth, Share2, Download, QrCode, Users, Smartphone } from 'lucide-react-native';
import { deviceSharingService, SharedDevice, ContentPackage } from '@/services/deviceSharingService';

interface DeviceSharingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeviceSharingModal({ visible, onClose }: DeviceSharingModalProps) {
  const [mode, setMode] = useState<'discover' | 'host' | 'share'>('discover');
  const [devices, setDevices] = useState<SharedDevice[]>([]);
  const [packages, setPackages] = useState<ContentPackage[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isHosting, setIsHosting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    try {
      const [discoveredDevices, contentPackages] = await Promise.all([
        deviceSharingService.discoverDevices(),
        deviceSharingService.getContentPackages(),
      ]);
      setDevices(discoveredDevices);
      setPackages(contentPackages);
    } catch (error) {
      console.error('Failed to load sharing data:', error);
    }
  };

  const startHostMode = async () => {
    try {
      setIsHosting(true);
      const success = await deviceSharingService.startHostMode('My Learning Device');
      if (success) {
        Alert.alert('Host Mode', 'Your device is now sharing content with nearby devices');
        setMode('host');
      } else {
        Alert.alert('Error', 'Failed to start host mode');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start sharing');
    } finally {
      setIsHosting(false);
    }
  };

  const discoverDevices = async () => {
    try {
      setIsScanning(true);
      const discoveredDevices = await deviceSharingService.discoverDevices();
      setDevices(discoveredDevices);
    } catch (error) {
      Alert.alert('Error', 'Failed to discover devices');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      const success = await deviceSharingService.connectToDevice(deviceId);
      if (success) {
        Alert.alert('Connected', 'Successfully connected to device');
        loadData();
      } else {
        Alert.alert('Error', 'Failed to connect to device');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    }
  };

  const renderDevice = ({ item }: { item: SharedDevice }) => (
    <TouchableOpacity
      style={[styles.deviceCard, item.isConnected && styles.connectedDevice]}
      onPress={() => connectToDevice(item.id)}
    >
      <View style={styles.deviceHeader}>
        <Smartphone size={20} color={item.isConnected ? "#10B981" : "#94A3B8"} />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceType}>
            {item.type === 'host' ? 'Sharing Content' : 'Learning Device'}
          </Text>
        </View>
        <View style={styles.deviceStatus}>
          <View style={[
            styles.statusDot,
            item.isConnected ? styles.connectedDot : styles.disconnectedDot
          ]} />
        </View>
      </View>
      <View style={styles.deviceContent}>
        <Text style={styles.contentInfo}>
          📚 {item.sharedContent.lessons} lessons • 💬 {item.sharedContent.chats} chats
        </Text>
        <Text style={styles.lastSeen}>
          Last seen: {item.lastSeen.toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPackage = ({ item }: { item: ContentPackage }) => (
    <TouchableOpacity style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <Share2 size={20} color="#4F46E5" />
        <View style={styles.packageInfo}>
          <Text style={styles.packageName}>{item.name}</Text>
          <Text style={styles.packageDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.packageStats}>
        <Text style={styles.packageStat}>📚 {item.lessons.length} lessons</Text>
        <Text style={styles.packageStat}>💾 {(item.size / 1024 / 1024).toFixed(1)} MB</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Learning Content</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'discover' && styles.activeModeButton]}
              onPress={() => setMode('discover')}
            >
              <Wifi size={16} color={mode === 'discover' ? "#FFFFFF" : "#94A3B8"} />
              <Text style={[styles.modeText, mode === 'discover' && styles.activeModeText]}>
                Find Devices
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'host' && styles.activeModeButton]}
              onPress={() => setMode('host')}
            >
              <Users size={16} color={mode === 'host' ? "#FFFFFF" : "#94A3B8"} />
              <Text style={[styles.modeText, mode === 'host' && styles.activeModeText]}>
                Share Content
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'share' && styles.activeModeButton]}
              onPress={() => setMode('share')}
            >
              <QrCode size={16} color={mode === 'share' ? "#FFFFFF" : "#94A3B8"} />
              <Text style={[styles.modeText, mode === 'share' && styles.activeModeText]}>
                QR Share
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {mode === 'discover' && (
              <View style={styles.discoverMode}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Nearby Devices</Text>
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={discoverDevices}
                    disabled={isScanning}
                  >
                    <Text style={styles.scanButtonText}>
                      {isScanning ? 'Scanning...' : 'Scan'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={devices}
                  renderItem={renderDevice}
                  keyExtractor={(item) => item.id}
                  style={styles.deviceList}
                  showsVerticalScrollIndicator={false}
                />
                
                <View style={styles.infoBox}>
                  <Bluetooth size={16} color="#3B82F6" />
                  <Text style={styles.infoText}>
                    Uses WiFi Direct and Bluetooth to find nearby LearnLocal devices
                  </Text>
                </View>
              </View>
            )}

            {mode === 'host' && (
              <View style={styles.hostMode}>
                <View style={styles.hostInfo}>
                  <Users size={32} color="#4F46E5" />
                  <Text style={styles.hostTitle}>Share Your Content</Text>
                  <Text style={styles.hostDescription}>
                    Make your lessons available to other devices nearby
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.hostButton, isHosting && styles.hostButtonDisabled]}
                  onPress={startHostMode}
                  disabled={isHosting}
                >
                  <Text style={styles.hostButtonText}>
                    {isHosting ? 'Starting...' : 'Start Sharing'}
                  </Text>
                </TouchableOpacity>
                
                <FlatList
                  data={packages}
                  renderItem={renderPackage}
                  keyExtractor={(item) => item.id}
                  style={styles.packageList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {mode === 'share' && (
              <View style={styles.qrMode}>
                <View style={styles.qrInfo}>
                  <QrCode size={32} color="#4F46E5" />
                  <Text style={styles.qrTitle}>QR Code Sharing</Text>
                  <Text style={styles.qrDescription}>
                    Generate QR codes to quickly share content packages
                  </Text>
                </View>
                
                <View style={styles.qrPlaceholder}>
                  <QrCode size={64} color="#94A3B8" />
                  <Text style={styles.qrPlaceholderText}>
                    Select a content package to generate QR code
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#334155',
    gap: 6,
  },
  activeModeButton: {
    backgroundColor: '#4F46E5',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  activeModeText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  discoverMode: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scanButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  deviceList: {
    flex: 1,
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  connectedDevice: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deviceType: {
    fontSize: 12,
    color: '#94A3B8',
  },
  deviceStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectedDot: {
    backgroundColor: '#10B981',
  },
  disconnectedDot: {
    backgroundColor: '#94A3B8',
  },
  deviceContent: {
    marginTop: 8,
  },
  contentInfo: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  lastSeen: {
    fontSize: 12,
    color: '#64748B',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#DBEAFE',
    flex: 1,
  },
  hostMode: {
    flex: 1,
  },
  hostInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  hostTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  hostDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  hostButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
  },
  hostButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  hostButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  packageList: {
    flex: 1,
  },
  packageCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  packageDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
  packageStats: {
    flexDirection: 'row',
    gap: 16,
  },
  packageStat: {
    fontSize: 12,
    color: '#94A3B8',
  },
  qrMode: {
    flex: 1,
    alignItems: 'center',
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  qrDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 32,
    width: 200,
    height: 200,
  },
  qrPlaceholderText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
  },
});