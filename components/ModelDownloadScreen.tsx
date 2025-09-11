import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader } from 'lucide-react-native';
import { modelService, ModelInfo, DownloadProgress } from '@/services/modelService';

interface ModelDownloadScreenProps {
  onComplete: () => void;
}

export default function ModelDownloadScreen({ onComplete }: ModelDownloadScreenProps) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [modelStatus, setModelStatus] = useState<{ [key: string]: boolean }>({});
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({});
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const [availableModels, status] = await Promise.all([
        modelService.getAvailableModels(),
        modelService.checkModelStatus(),
      ]);
      
      setModels(availableModels);
      setModelStatus(status);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async (model: ModelInfo) => {
    setDownloading(prev => ({ ...prev, [model.name]: true }));
    setDownloadProgress(prev => ({ ...prev, [model.name]: 0 }));

    try {
      const success = await modelService.downloadModel(
        model,
        (progress: DownloadProgress) => {
          setDownloadProgress(prev => ({
            ...prev,
            [model.name]: progress.progress * 100,
          }));
        }
      );

      if (success) {
        setModelStatus(prev => ({ ...prev, [model.name]: true }));
        Alert.alert('Success', `${model.name} downloaded successfully!`);
      } else {
        Alert.alert('Error', `Failed to download ${model.name}`);
      }
    } catch (error) {
      Alert.alert('Error', `Download failed: ${error}`);
    } finally {
      setDownloading(prev => ({ ...prev, [model.name]: false }));
    }
  };

  const canProceed = () => {
    const requiredModels = models.filter(m => m.isRequired);
    return requiredModels.every(m => modelStatus[m.name]);
  };

  const renderModelCard = (model: ModelInfo) => {
    const isDownloaded = modelStatus[model.name];
    const isDownloading = downloading[model.name];
    const progress = downloadProgress[model.name] || 0;

    return (
      <View key={model.name} style={styles.modelCard}>
        <View style={styles.modelHeader}>
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>{model.name}</Text>
            <Text style={styles.modelVersion}>v{model.version}</Text>
            <View style={styles.modelBadges}>
              <Text style={[styles.sourceBadge, { backgroundColor: getSourceColor(model.source) }]}>
                {model.source.toUpperCase()}
              </Text>
              {model.isRequired && (
                <Text style={styles.requiredBadge}>Required</Text>
              )}
            </View>
            {model.capabilities && (
              <Text style={styles.capabilities}>
                {model.capabilities.join(', ')}
              </Text>
            )}
          </View>
          <View style={styles.modelStatus}>
            {isDownloaded ? (
              <CheckCircle size={24} color="#10B981" />
            ) : model.isRequired ? (
              <AlertCircle size={24} color="#EF4444" />
            ) : (
              <Download size={24} color="#94A3B8" />
            )}
          </View>
        </View>

        <Text style={styles.modelDescription}>{model.description}</Text>
        <Text style={styles.modelSize}>Size: {model.size}</Text>

        {isDownloading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {!isDownloaded && !isDownloading && (
          <TouchableOpacity
            style={[
              styles.downloadButton,
              model.isRequired ? styles.requiredButton : styles.optionalButton,
            ]}
            onPress={() => downloadModel(model)}
          >
            <Download size={16} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        )}

        {isDownloading && (
          <View style={styles.downloadingButton}>
            <Loader size={16} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>Downloading...</Text>
          </View>
        )}
      </View>
    );
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'gpt-oss': return '#4F46E5';
      case 'huggingface': return '#FF6B35';
      case 'local': return '#10B981';
      default: return '#6B7280';
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loader size={48} color="#4F46E5" />
          <Text style={styles.loadingText}>Loading models...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Download AI Models</Text>
        <Text style={styles.subtitle}>
          Download the required models to use LearnLocal offline
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {models.map(renderModelCard)}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            styles.continueButtonEnabled,
          ]}
          onPress={onComplete}
        >
          <Text style={styles.continueButtonText}>
            {canProceed() ? 'Continue' : 'Close'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  modelCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modelVersion: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  modelBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sourceBadge: {
    fontSize: 10,
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  requiredBadge: {
    fontSize: 12,
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: '600',
  },
  capabilities: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  modelStatus: {
    marginLeft: 16,
  },
  modelDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 8,
  },
  modelSize: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#475569',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  requiredButton: {
    backgroundColor: '#EF4444',
  },
  optionalButton: {
    backgroundColor: '#4F46E5',
  },
  downloadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    backgroundColor: '#6B7280',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: '#4F46E5',
  },
  continueButtonDisabled: {
    backgroundColor: '#475569',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});