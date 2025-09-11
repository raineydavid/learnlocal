import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Settings, Server, Trash2, Smartphone, Moon, Zap } from 'lucide-react-native';
import ServerConfigModal from '../../components/ServerConfigModal';
import { offlineService } from '../../services/offlineService';

export default function SettingsScreen() {
  const [showServerModal, setShowServerModal] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached lessons and chat history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await offlineService.clearCache();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const navigateToComingSoon = () => {
    router.push('/coming-soon');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Settings size={32} color="#60a5fa" />
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Server Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server Configuration</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowServerModal(true)}
          >
            <View style={styles.settingLeft}>
              <Server size={20} color="#60a5fa" />
              <Text style={styles.settingText}>API Server Settings</Text>
            </View>
            <Text style={styles.settingValue}>Configure</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Smartphone size={20} color="#60a5fa" />
              <Text style={styles.settingText}>Offline Mode</Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#374151', true: '#60a5fa' }}
              thumbColor={offlineMode ? '#ffffff' : '#9ca3af'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#60a5fa" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#374151', true: '#60a5fa' }}
              thumbColor={darkMode ? '#ffffff' : '#9ca3af'}
            />
          </View>
        </View>

        {/* Coming Soon Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Features</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={navigateToComingSoon}
          >
            <View style={styles.settingLeft}>
              <Zap size={20} color="#fbbf24" />
              <Text style={styles.settingText}>Agentic AI Features</Text>
            </View>
            <Text style={styles.comingSoonBadge}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        {/* Cache Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearCache}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#ef4444" />
              <Text style={styles.settingText}>Clear Cache</Text>
            </View>
            <Text style={styles.settingValue}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ServerConfigModal
        visible={showServerModal}
        onClose={() => setShowServerModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#60a5fa',
    fontWeight: '500',
  },
  comingSoonBadge: {
    fontSize: 12,
    color: '#fbbf24',
    backgroundColor: '#451a03',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
  },
});