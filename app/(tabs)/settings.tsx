import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, Server, Globe, Bell, Shield, CircleHelp as HelpCircle, Download, Languages, Volume2, CreditCard as Edit3, Share2, Wifi, Bluetooth, Zap, Cloud } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import DeviceSharingModal from '@/components/DeviceSharingModal';
import ServerConfigModal from '@/components/ServerConfigModal';
import { api, ModelProvider } from '@/services/api';
import { offlineService } from '@/services/offlineService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function SettingsTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [useEmbeddedServer, setUseEmbeddedServer] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'gpt-oss' | 'huggingface'>('gpt-oss');
  const [availableProviders, setAvailableProviders] = useState<ModelProvider[]>([]);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [showDeviceSharing, setShowDeviceSharing] = useState(false);
  const [serverUrl, setServerUrl] = useState('http://localhost:8000');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('offline');
  const [cacheSize, setCacheSize] = useState({ lessons: 0, chats: 0, totalMB: 0 });
  const networkStatus = useNetworkStatus();
  
  // Embedded server state management
  const [embeddedServerState, setEmbeddedServerState] = useState({
    isRunning: false,
    isLoading: false,
    url: '',
    error: null as string | null
  });

  useEffect(() => {
    checkServerStatus();
    loadCacheInfo();
    loadAvailableProviders();
  }, [serverUrl]);

  const loadAvailableProviders = async () => {
    try {
      const providers = await api.getAvailableProviders();
      setAvailableProviders(providers);
      setSelectedProvider(api.getProvider());
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const loadCacheInfo = async () => {
    try {
      const size = await offlineService.getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error('Failed to load cache info:', error);
    }
  };

  const clearCache = async () => {
    try {
      await offlineService.clearAllCache();
      setCacheSize({ lessons: 0, chats: 0, totalMB: 0 });
      Alert.alert('Success', 'Cache cleared successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      await api.checkServerStatus();
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleServerUrlChange = (newUrl: string) => {
    setServerUrl(newUrl);
    api.updateBaseURL(newUrl);
    checkServerStatus();
  };

  const handleProviderChange = (provider: 'gpt-oss' | 'huggingface') => {
    setSelectedProvider(provider);
    api.setProvider(provider);
  };

  const toggleEmbeddedServer = async (enabled: boolean) => {
    setUseEmbeddedServer(enabled);
    setEmbeddedServerState(prev => ({ ...prev, isLoading: true }));
    
    if (enabled) {
      try {
        // Import embedded server only when needed (for web compatibility)
        const { embeddedServer } = await import('@/services/embeddedServer');
        const success = await embeddedServer.start();
        
        if (success) {
          setEmbeddedServerState({
            isRunning: true,
            isLoading: false,
            url: embeddedServer.getServerUrl(),
            error: null
          });
          setServerUrl(embeddedServer.getServerUrl());
          setServerStatus('online');
        } else {
          setEmbeddedServerState({
            isRunning: false,
            isLoading: false,
            url: '',
            error: 'Failed to start embedded server'
          });
        }
      } catch (error) {
        setEmbeddedServerState({
          isRunning: false,
          isLoading: false,
          url: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      try {
        const { embeddedServer } = await import('@/services/embeddedServer');
        await embeddedServer.stop();
        setEmbeddedServerState({
          isRunning: false,
          isLoading: false,
          url: '',
          error: null
        });
        setServerUrl('http://localhost:8000');
        checkServerStatus();
      } catch (error) {
        console.error('Error stopping server:', error);
        setEmbeddedServerState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Model Configuration</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>AI Provider</Text>
                <Text style={styles.settingSubtitle}>
                  {selectedProvider === 'gpt-oss' ? 'Local GPT-OSS Model' : 'Hugging Face Cloud'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.providerSelector}>
            {availableProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.selectedProviderCard
                ]}
                onPress={() => handleProviderChange(provider.id)}
              >
                {provider.id === 'gpt-oss' ? (
                  <Zap size={24} color={selectedProvider === provider.id ? "#FFFFFF" : "#4F46E5"} />
                ) : (
                  <Cloud size={24} color={selectedProvider === provider.id ? "#FFFFFF" : "#F59E0B"} />
                )}
                <Text style={[
                  styles.providerTitle,
                  selectedProvider === provider.id && styles.selectedProviderTitle
                ]}>
                  {provider.name}
                </Text>
                <Text style={[
                  styles.providerDescription,
                  selectedProvider === provider.id && styles.selectedProviderDescription
                ]}>
                  {provider.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Server size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Embedded Server</Text>
                <Text style={styles.settingSubtitle}>
                  {embeddedServerState.isRunning ? 'Running locally' : 'Use built-in AI server'}
                </Text>
              </View>
            </View>
            <Switch
              value={useEmbeddedServer}
              onValueChange={toggleEmbeddedServer}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
              disabled={embeddedServerState.isLoading}
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowServerConfig(true)}
            disabled={useEmbeddedServer || selectedProvider === 'huggingface'}
          >
            <View style={styles.settingLeft}>
              <Server size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>FastAPI Server</Text>
                <Text style={styles.settingSubtitle}>
                  {useEmbeddedServer ? 'Using embedded server' : 
                   selectedProvider === 'huggingface' ? 'Using Hugging Face API' : serverUrl}
                </Text>
              </View>
            </View>
            <Edit3 size={16} color={useEmbeddedServer || selectedProvider === 'huggingface' ? "#6B7280" : "#94A3B8"} />
          </TouchableOpacity>

          {selectedProvider === 'huggingface' && (
            <View style={styles.infoBox}>
              <Cloud size={16} color="#F59E0B" />
              <Text style={styles.infoText}>
                Hugging Face models run in the cloud. No local server required, but internet connection is needed.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Languages size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Translation</Text>
                <Text style={styles.settingSubtitle}>Translate content to your language</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Volume2 size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Text-to-Speech</Text>
                <Text style={styles.settingSubtitle}>Listen to lessons and content</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/models' as any)}
          >
            <View style={styles.settingLeft}>
              <Download size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Manage Models</Text>
                <Text style={styles.settingSubtitle}>Download and update AI models</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Sharing</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowDeviceSharing(true)}
          >
            <View style={styles.settingLeft}>
              <Share2 size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Share Content</Text>
                <Text style={styles.settingSubtitle}>Share lessons with nearby devices</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Wifi size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>WiFi Direct</Text>
                <Text style={styles.settingSubtitle}>Direct device-to-device sharing</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bluetooth size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Bluetooth Sharing</Text>
                <Text style={styles.settingSubtitle}>Low-power content distribution</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Get learning reminders</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Offline Mode</Text>
                <Text style={styles.settingSubtitle}>Use cached content when offline</Text>
              </View>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offline Storage</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Cached Content</Text>
                <Text style={styles.settingSubtitle}>
                  {cacheSize.totalMB.toFixed(1)} MB stored locally
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={clearCache}>
            <View style={styles.settingLeft}>
              <Shield size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Clear Cache</Text>
                <Text style={styles.settingSubtitle}>Remove all cached lessons and chats</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help with the app</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.connectionStatus}>
          <Text style={styles.connectionTitle}>Connection Status</Text>
          
          {useEmbeddedServer && (
            <View style={styles.statusItem}>
              <View style={[
                styles.statusDot, 
                embeddedServerState.isRunning ? styles.statusOnline : styles.statusOffline
              ]} />
              <Text style={styles.statusText}>
                Embedded Server: {embeddedServerState.isRunning ? 'Running' : 'Stopped'}
              </Text>
            </View>
          )}
          
          <View style={styles.statusItem}>
            <View style={[
              styles.statusDot, 
              selectedProvider === 'huggingface' ? styles.statusOnline : styles.statusChecking
            ]} />
            <Text style={styles.statusText}>
              AI Provider: {selectedProvider === 'gpt-oss' ? 'GPT-OSS Local' : 'Hugging Face Cloud'}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <View style={[
              styles.statusDot, 
              (serverStatus === 'online' || embeddedServerState.isRunning || selectedProvider === 'huggingface') ? styles.statusOnline : 
              serverStatus === 'checking' ? styles.statusChecking : styles.statusOffline
            ]} />
            <Text style={styles.statusText}>
              {selectedProvider === 'huggingface' ? 'Cloud API' :
               useEmbeddedServer ? 'Embedded' : 'FastAPI'} Server: {
                selectedProvider === 'huggingface' ? 'Connected' :
                embeddedServerState.isRunning ? 'Connected' :
                serverStatus === 'online' ? 'Connected' :
                serverStatus === 'checking' ? 'Checking...' : 'Disconnected'
              }
            </Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[
              styles.statusDot, 
              (serverStatus === 'online' || embeddedServerState.isRunning || selectedProvider === 'huggingface') ? styles.statusOnline : styles.statusOffline
            ]} />
            <Text style={styles.statusText}>
              AI Model: {(serverStatus === 'online' || embeddedServerState.isRunning || selectedProvider === 'huggingface') ? 'Available' : 'Not Available'}
            </Text>
          </View>
          
          <Text style={styles.statusNote}>
            {selectedProvider === 'huggingface' 
              ? 'Using Hugging Face cloud models. Internet connection required for AI features.'
              : useEmbeddedServer 
              ? 'Using built-in AI server for offline functionality. No external server required.'
              : `Make sure your FastAPI server is running on ${serverUrl} with the GPT-OSS model loaded.`
            }
          </Text>
        </View>

        <ServerConfigModal
          visible={showServerConfig}
          currentUrl={serverUrl}
          onSave={handleServerUrlChange}
          onClose={() => setShowServerConfig(false)}
        />

        <DeviceSharingModal
          visible={showDeviceSharing}
          onClose={() => setShowDeviceSharing(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  providerSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  providerCard: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProviderCard: {
    backgroundColor: '#4F46E5',
    borderColor: '#6366F1',
  },
  providerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  selectedProviderTitle: {
    color: '#FFFFFF',
  },
  providerDescription: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedProviderDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  settingItem: {
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A03',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#F59E0B',
    flex: 1,
    lineHeight: 16,
  },
  connectionStatus: {
    margin: 20,
    padding: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  connectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOffline: {
    backgroundColor: '#EF4444',
  },
  statusOnline: {
    backgroundColor: '#10B981',
  },
  statusChecking: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statusNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 18,
  },
});