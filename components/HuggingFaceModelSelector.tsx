import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { X, Search, Download, Star, TrendingUp } from 'lucide-react-native';
import { huggingFaceService, HuggingFaceModel } from '@/services/huggingFaceService';

interface HuggingFaceModelSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectModel: (modelId: string) => void;
  currentModel?: string;
}

export default function HuggingFaceModelSelector({ 
  visible, 
  onClose, 
  onSelectModel, 
  currentModel 
}: HuggingFaceModelSelectorProps) {
  const [models, setModels] = useState<HuggingFaceModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'text-generation' | 'conversational'>('all');

  useEffect(() => {
    if (visible) {
      loadModels();
    }
  }, [visible, selectedFilter]);

  const loadModels = async () => {
    setIsLoading(true);
    try {
      const searchTerm = selectedFilter === 'all' ? 'conversational' : selectedFilter;
      const results = await huggingFaceService.searchModels(searchTerm, {
        task: selectedFilter === 'all' ? undefined : selectedFilter,
        sort: 'downloads',
        limit: 20
      });
      setModels(results);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectModel = (modelId: string) => {
    huggingFaceService.setModel(modelId);
    onSelectModel(modelId);
    onClose();
  };

  const renderModelItem = ({ item }: { item: HuggingFaceModel }) => (
    <TouchableOpacity
      style={[
        styles.modelItem,
        currentModel === item.id && styles.selectedModelItem
      ]}
      onPress={() => handleSelectModel(item.id)}
    >
      <View style={styles.modelHeader}>
        <Text style={styles.modelName}>{item.name}</Text>
        <View style={styles.modelStats}>
          <View style={styles.statItem}>
            <Download size={12} color="#94A3B8" />
            <Text style={styles.statText}>{formatNumber(item.downloads)}</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={12} color="#94A3B8" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.modelDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.modelTags}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.pipeline_tag}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.library_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

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
            <Text style={styles.title}>Select Hugging Face Model</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search models..."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.filterContainer}>
            {['all', 'text-generation', 'conversational'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.selectedFilter
                ]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedFilterText
                ]}>
                  {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading models...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredModels}
                renderItem={renderModelItem}
                keyExtractor={(item) => item.id}
                style={styles.modelList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Models are hosted on Hugging Face Hub
            </Text>
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
    maxWidth: 600,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#334155',
  },
  selectedFilter: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    fontSize: 14,
    color: '#94A3B8',
    textTransform: 'capitalize',
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
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
  modelList: {
    flex: 1,
  },
  modelItem: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedModelItem: {
    borderColor: '#4F46E5',
    backgroundColor: '#1E40AF',
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  modelStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  modelDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  modelTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#475569',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});