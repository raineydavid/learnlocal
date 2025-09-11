import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { X, Server, CheckCircle, AlertCircle } from 'lucide-react-native';

interface ServerConfigModalProps {
  visible: boolean;
  currentUrl: string;
  onSave: (url: string) -> void;
  onClose: () => void;
}

export default function ServerConfigModal({ visible, currentUrl, onSave, onClose }: ServerConfigModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [isValidating, setIsValidating] = useState(false);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      const urlObj = new URL(inputUrl);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      Alert.alert('Error', 'Please enter a server URL');
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      Alert.alert('Error', 'Please enter a valid URL (e.g., http://localhost:8000)');
      return;
    }

    setIsValidating(true);
    
    try {
      // Test the connection
      const response = await fetch(`${trimmedUrl}/api/health`, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        onSave(trimmedUrl);
        onClose();
        Alert.alert('Success', 'Server URL updated and connection verified!');
      } else {
        Alert.alert('Warning', 'Server URL saved but connection could not be verified. Make sure your FastAPI server is running.');
        onSave(trimmedUrl);
        onClose();
      }
    } catch (error) {
      Alert.alert('Warning', 'Server URL saved but connection could not be verified. Make sure your FastAPI server is running.');
      onSave(trimmedUrl);
      onClose();
    } finally {
      setIsValidating(false);
    }
  };

  const presetUrls = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://192.168.1.100:8000',
    'https://your-server.com',
  ];

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
            <View style={styles.headerLeft}>
              <Server size={24} color="#4F46E5" />
              <Text style={styles.title}>FastAPI Server Configuration</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Server URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="http://localhost:8000"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <Text style={styles.sectionTitle}>Quick Presets</Text>
            <View style={styles.presetContainer}>
              {presetUrls.map((presetUrl) => (
                <TouchableOpacity
                  key={presetUrl}
                  style={[
                    styles.presetButton,
                    url === presetUrl && styles.selectedPreset,
                  ]}
                  onPress={() => setUrl(presetUrl)}
                >
                  <Text style={[
                    styles.presetText,
                    url === presetUrl && styles.selectedPresetText,
                  ]}>
                    {presetUrl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.infoText}>
                Make sure your FastAPI server is running with the GPT-OSS model loaded
              </Text>
            </View>

            <View style={styles.warningBox}>
              <AlertCircle size={16} color="#F59E0B" />
              <Text style={styles.warningText}>
                Required endpoints: /api/health, /api/chat, /api/harmony/generate-lesson
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.saveButton, isValidating && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isValidating}
            >
              <Text style={styles.saveButtonText}>
                {isValidating ? 'Validating...' : 'Save & Test'}
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetContainer: {
    gap: 8,
    marginBottom: 20,
  },
  presetButton: {
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPreset: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  presetText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  selectedPresetText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#064E3B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#10B981',
    flex: 1,
    lineHeight: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#451A03',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#F59E0B',
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#475569',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});