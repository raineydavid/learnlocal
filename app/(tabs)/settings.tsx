import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, Server, Globe, Bell, Shield, CircleHelp as HelpCircle, Download, Languages, Volume2 } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function SettingsTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Model Configuration</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Server size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>FastAPI Server</Text>
                <Text style={styles.settingSubtitle}>localhost:8000</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Model Configuration</Text>
                <Text style={styles.settingSubtitle}>GPT-OSS Local Model</Text>
              </View>
            </View>
          </TouchableOpacity>
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
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, styles.statusOffline]} />
            <Text style={styles.statusText}>FastAPI Server: Disconnected</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, styles.statusOffline]} />
            <Text style={styles.statusText}>GPT-OSS Model: Not Available</Text>
          </View>
          <Text style={styles.statusNote}>
            Make sure your FastAPI server is running on localhost:8000 with the GPT-OSS model loaded.
          </Text>
        </View>
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