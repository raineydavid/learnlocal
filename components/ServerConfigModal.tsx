import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { X, Server, Wifi, WifiOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ServerConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (config: ServerConfig) => void;
  currentConfig: ServerConfig;
}

export interface ServerConfig {
  baseURL: string;
  provider: 'fastapi' | 'embedded';
  timeout: number;
}

const PRESET_URLS = [
  {
    label: 'Local FastAPI',
    url: 'http://localhost:8000',
    description: 'FastAPI server running locally'
  },
  {
    label: 'Local IP FastAPI',
    url: 'http://192.168.1.100:8000',
    description: 'FastAPI server on local network'
  },
  {
    label: 'ngrok Tunnel',
    url: 'https://abc123.ngrok-free.app',
    description: 'FastAPI server via ngrok tunnel'
  },
  {
    label: 'Production Server',
    url: 'https://api.learnlocal.com',
    description: 'Production FastAPI server'
  }
];

export default function ServerConfigModal({
  visible,
  onClose,
  onSave,
  currentConfig,
}: ServerConfigModalProps) {
  const [baseURL, setBaseURL] = useState(currentConfig.baseURL);
  const [provider, setProvider] = useState<'fastapi' | 'embedded'>(currentConfig.provider);
  const [timeout, setTimeout] = useState(currentConfig.timeout.toString());
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    setBaseURL(currentConfig.baseURL);
    setProvider(currentConfig.provider);
    setTimeout(currentConfig.timeout.toString());
  }, [currentConfig]);

  const testConnection = async () => {
    if (provider === 'embedded') {
      Alert.alert('Success', 'Embedded server is always available');
      return;
    }

    setIsTestingConnection(true);
    try {
      const response = await fetch(`${baseURL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        timeout: parseInt(timeout) * 1000,
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', `Connected to server: ${data.status || 'OK'}`);
      } else {
        Alert.alert('Error', `Server responded with status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Connection Failed', `Could not connect to server: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async () => {
    const config: ServerConfig = {
      baseURL: baseURL.trim(),
      provider,
      timeout: parseInt(timeout) || 30,
    };

    try {
      await AsyncStorage.setItem('serverConfig', JSON.stringify(config));
      onSave(config);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    }
  };

  const selectPresetURL = (url: string) => {
    setBaseURL(url);
    setProvider('fastapi');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Server Configuration</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Provider Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Server Type</Text>
            <View style={styles.providerContainer}>
              <TouchableOpacity
                style={[
                  styles.providerButton,
                  provider === 'fastapi' && styles.providerButtonActive,
                ]}
                onPress={() => setProvider('fastapi')}
              >
                <Wifi size={20} color={provider === 'fastapi' ? '#007AFF' : '#666'} />
                <Text
                  style={[
                    styles.providerText,
                    provider === 'fastapi' && styles.providerTextActive,
                  ]}
                >
                  FastAPI Server
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.providerButton,
                  provider === 'embedded' && styles.providerButtonActive,
                ]}
                onPress={() => setProvider('embedded')}
              >
                <WifiOff size={20} color={provider === 'embedded' ? '#007AFF' : '#666'} />
                <Text
                  style={[
                    styles.providerText,
                    provider === 'embedded' && styles.providerTextActive,
                  ]}
                >
                  Embedded Server
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FastAPI Configuration */}
          {provider === 'fastapi' && (
            <>
              {/* Preset URLs */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Setup</Text>
                {PRESET_URLS.map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.presetButton}
                    onPress={() => selectPresetURL(preset.url)}
                  >
                    <View style={styles.presetContent}>
                      <Text style={styles.presetLabel}>{preset.label}</Text>
                      <Text style={styles.presetURL}>{preset.url}</Text>
                      <Text style={styles.presetDescription}>{preset.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom URL */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Custom Server URL</Text>
                <TextInput
                  style={styles.input}
                  value={baseURL}
                  onChangeText={setBaseURL}
                  placeholder="https://your-server.com or http://localhost:8000"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Timeout */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Timeout (seconds)</Text>
                <TextInput
                  style={styles.input}
                  value={timeout}
                  onChangeText={setTimeout}
                  placeholder="30"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              {/* Test Connection */}
              <TouchableOpacity
                style={[styles.testButton, isTestingConnection && styles.testButtonDisabled]}
                onPress={testConnection}
                disabled={isTestingConnection}
              >
                <Server size={20} color="#fff" />
                <Text style={styles.testButtonText}>
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Embedded Server Info */}
          {provider === 'embedded' && (
            <View style={styles.section}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Embedded Server</Text>
                <Text style={styles.infoText}>
                  Uses built-in AI processing. No external server required. Perfect for offline use and emergency scenarios.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Configuration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  providerContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  providerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#f8f9fa',
    gap: 8,
  },
  providerButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  providerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  providerTextActive: {
    color: '#007AFF',
  },
  presetButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  presetContent: {
    gap: 4,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  presetURL: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'monospace',
  },
  presetDescription: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});