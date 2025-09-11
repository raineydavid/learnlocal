import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Server, Wifi, Download, Trash2, Info, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { ServerConfigModal } from '../../components/ServerConfigModal';
import { offlineService } from '../../services/offlineService';

export default function SettingsScreen() {
  const [serverModalVisible, setServerModalVisible] = useState(false);
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
            await offlineService.clearCache();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const navigateToComingSoon = () => {
    router.push('/coming-soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Settings color="#fff" size={24} />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Server Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server Configuration</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setServerModalVisible(true)}
          >
            <Server color="#fff" size={20} />
            <Text style={styles.settingText}>Configure API Server</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <Wifi color="#fff" size={20} />
            <Text style={styles.settingText}>Offline Mode</Text>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={offlineMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>🌙</Text>
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Cache Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <Trash2 color="#ff6b6b" size={20} />
            <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* Coming Soon Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Future Features</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={navigateToComingSoon}>
            <Zap color="#FFD700" size={20} />
            <Text style={styles.settingText}>Agentic AI Features</Text>
            <Text style={styles.comingSoonBadge}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <Info color="#fff" size={20} />
            <View style={styles.aboutInfo}>
              <Text style={styles.settingText}>LearnLocal</Text>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ServerConfigModal
        visible={serverModalVisible}
        onClose={() => setServerModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    opacity: 0.9,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  aboutInfo: {
    marginLeft: 12,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  comingSoonBadge: {
    backgroundColor: '#FFD700',
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});