import React, { useState } from 'react';
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
import { X, Server, Globe, Smartphone } from 'lucide-react-native';

interface ServerConfigModalProps {
  visible: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (url: string) => void;
}

export default function ServerConfigModal({
  visible,
  onClose,
  currentUrl,
  onSave,
}: ServerConfigModalProps) {
  const [url, setUrl] = useState(currentUrl);

  const presetUrls = [
    {
      name: 'Current ngrok Server',
      url: 'https://bibliographical-flaggingly-bailee.ngrok-free.app',
      icon: Globe,
      description: 'FastAPI server via ngrok tunnel',
    },
    {
      name: 'Local FastAPI',
      url: 'http://localhost:8000',
      icon: Server,
      description: 'Local development server',
    },
    {
      name: 'Local IP (WiFi)',
      url: 'http://192.168.1.100:8000',
      icon: Server,
      description: 'Local network access',
    },
    {
      name: 'Embedded Server',
      url: 'http://localhost:3001',
      icon: Smartphone,
      description: 'Built-in offline server',
    },
  ];

  const handleSave = () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid server URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      Alert.alert('Error', 'Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    onSave(url.trim());
    onClose();
  };

  const selectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
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

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Current Server URL</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="Enter server URL (e.g., https://example.com)"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          <Text style={styles.sectionTitle}>Quick Select</Text>
          {presetUrls.map((preset, index) => {
            const IconComponent = preset.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetItem,
                  url === preset.url && styles.presetItemSelected,
                ]}
                onPress={() => selectPreset(preset.url)}
              >
                <View style={styles.presetIcon}>
                  <IconComponent size={20} color="#007AFF" />
                </View>
                <View style={styles.presetContent}>
                  <Text style={styles.presetName}>{preset.name}</Text>
                  <Text style={styles.presetUrl}>{preset.url}</Text>
                  <Text style={styles.presetDescription}>{preset.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Configuration Notes:</Text>
            <Text style={styles.infoText}>
              • For ngrok URLs, ensure the server has CORS enabled{'\n'}
              • Local URLs work for development on the same machine{'\n'}
              • IP addresses allow access from other devices on the network{'\n'}
              • Embedded server runs offline within the app
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  presetItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  presetIcon: {
    marginRight: 12,
  },
  presetContent: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  presetUrl: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  presetDescription: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});