import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineService, CachedLesson } from './offlineService';

export interface SharedDevice {
  id: string;
  name: string;
  type: 'host' | 'client';
  isConnected: boolean;
  lastSeen: Date;
  sharedContent: {
    lessons: number;
    chats: number;
  };
}

export interface ContentPackage {
  id: string;
  name: string;
  lessons: CachedLesson[];
  size: number;
  createdAt: Date;
  description: string;
}

export class DeviceSharingService {
  private static instance: DeviceSharingService;
  private readonly SHARED_DEVICES_KEY = 'shared_devices';
  private readonly CONTENT_PACKAGES_KEY = 'content_packages';
  private readonly DEVICE_INFO_KEY = 'device_info';

  static getInstance(): DeviceSharingService {
    if (!DeviceSharingService.instance) {
      DeviceSharingService.instance = new DeviceSharingService();
    }
    return DeviceSharingService.instance;
  }

  // Device Discovery & Connection
  async startHostMode(deviceName: string): Promise<boolean> {
    try {
      // In a real implementation, this would:
      // 1. Start WiFi Direct or Bluetooth LE advertising
      // 2. Create a local HTTP server for content sharing
      // 3. Broadcast device availability
      
      const deviceInfo = {
        id: `host-${Date.now()}`,
        name: deviceName,
        type: 'host' as const,
        isHosting: true,
        startedAt: new Date(),
      };
      
      await AsyncStorage.setItem(this.DEVICE_INFO_KEY, JSON.stringify(deviceInfo));
      
      // Simulate starting local server
      console.log(`Started host mode: ${deviceName}`);
      return true;
    } catch (error) {
      console.error('Failed to start host mode:', error);
      return false;
    }
  }

  async discoverDevices(): Promise<SharedDevice[]> {
    try {
      // In a real implementation, this would:
      // 1. Scan for WiFi Direct peers
      // 2. Discover Bluetooth LE devices
      // 3. Check local network for other LearnLocal instances
      
      // Simulate discovered devices
      const mockDevices: SharedDevice[] = [
        {
          id: 'device-1',
          name: 'Teacher\'s Tablet',
          type: 'host',
          isConnected: false,
          lastSeen: new Date(),
          sharedContent: { lessons: 25, chats: 5 }
        },
        {
          id: 'device-2', 
          name: 'Learning Station A',
          type: 'host',
          isConnected: false,
          lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
          sharedContent: { lessons: 15, chats: 0 }
        }
      ];
      
      return mockDevices;
    } catch (error) {
      console.error('Device discovery failed:', error);
      return [];
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      // In a real implementation, this would:
      // 1. Establish WiFi Direct or Bluetooth connection
      // 2. Perform handshake and authentication
      // 3. Set up data transfer channel
      
      const devices = await this.getSharedDevices();
      const updatedDevices = devices.map(device => 
        device.id === deviceId 
          ? { ...device, isConnected: true, lastSeen: new Date() }
          : device
      );
      
      await AsyncStorage.setItem(this.SHARED_DEVICES_KEY, JSON.stringify(updatedDevices));
      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  // Content Packaging & Distribution
  async createContentPackage(name: string, lessonIds: string[]): Promise<ContentPackage | null> {
    try {
      const cachedLessons = await offlineService.getCachedLessons();
      const selectedLessons = cachedLessons.filter(lesson => 
        lessonIds.includes(lesson.id)
      );
      
      const contentPackage: ContentPackage = {
        id: `package-${Date.now()}`,
        name,
        lessons: selectedLessons,
        size: this.calculatePackageSize(selectedLessons),
        createdAt: new Date(),
        description: `${selectedLessons.length} lessons for offline learning`
      };
      
      const packages = await this.getContentPackages();
      packages.push(contentPackage);
      await AsyncStorage.setItem(this.CONTENT_PACKAGES_KEY, JSON.stringify(packages));
      
      return contentPackage;
    } catch (error) {
      console.error('Failed to create content package:', error);
      return null;
    }
  }

  async shareContentPackage(packageId: string, targetDeviceId: string): Promise<boolean> {
    try {
      const packages = await this.getContentPackages();
      const packageToShare = packages.find(pkg => pkg.id === packageId);
      
      if (!packageToShare) {
        throw new Error('Package not found');
      }
      
      // In a real implementation, this would:
      // 1. Compress the content package
      // 2. Transfer via established connection (WiFi Direct/Bluetooth)
      // 3. Verify transfer integrity
      // 4. Install on target device
      
      console.log(`Sharing package ${packageToShare.name} to device ${targetDeviceId}`);
      
      // Simulate transfer progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Transfer progress: ${progress}%`);
      }
      
      return true;
    } catch (error) {
      console.error('Content sharing failed:', error);
      return false;
    }
  }

  async receiveContentPackage(packageData: ContentPackage): Promise<boolean> {
    try {
      // Install received lessons into local cache
      await offlineService.cacheLessons(packageData.lessons);
      
      // Save package info
      const packages = await this.getContentPackages();
      packages.push({
        ...packageData,
        id: `received-${Date.now()}`, // New ID to avoid conflicts
      });
      await AsyncStorage.setItem(this.CONTENT_PACKAGES_KEY, JSON.stringify(packages));
      
      return true;
    } catch (error) {
      console.error('Failed to receive content package:', error);
      return false;
    }
  }

  // QR Code Sharing
  async generateSharingQR(packageId: string): Promise<string> {
    try {
      const packages = await this.getContentPackages();
      const packageToShare = packages.find(pkg => pkg.id === packageId);
      
      if (!packageToShare) {
        throw new Error('Package not found');
      }
      
      // Create sharing payload
      const sharingData = {
        type: 'learnlocal-content',
        packageId: packageToShare.id,
        name: packageToShare.name,
        lessonCount: packageToShare.lessons.length,
        size: packageToShare.size,
        checksum: this.generateChecksum(packageToShare)
      };
      
      // In a real implementation, this would generate a QR code
      // containing connection info and content metadata
      return JSON.stringify(sharingData);
    } catch (error) {
      console.error('QR generation failed:', error);
      return '';
    }
  }

  async scanSharingQR(qrData: string): Promise<ContentPackage | null> {
    try {
      const sharingData = JSON.parse(qrData);
      
      if (sharingData.type !== 'learnlocal-content') {
        throw new Error('Invalid QR code');
      }
      
      // In a real implementation, this would:
      // 1. Connect to the sharing device
      // 2. Request the content package
      // 3. Download and verify the content
      
      return null; // Placeholder
    } catch (error) {
      console.error('QR scan failed:', error);
      return null;
    }
  }

  // Utility Methods
  private calculatePackageSize(lessons: CachedLesson[]): number {
    return lessons.reduce((total, lesson) => {
      return total + new Blob([JSON.stringify(lesson)]).size;
    }, 0);
  }

  private generateChecksum(packageData: ContentPackage): string {
    // Simple checksum for content verification
    const content = JSON.stringify(packageData.lessons);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  async getSharedDevices(): Promise<SharedDevice[]> {
    try {
      const cached = await AsyncStorage.getItem(this.SHARED_DEVICES_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get shared devices:', error);
      return [];
    }
  }

  async getContentPackages(): Promise<ContentPackage[]> {
    try {
      const cached = await AsyncStorage.getItem(this.CONTENT_PACKAGES_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get content packages:', error);
      return [];
    }
  }

  async clearSharingData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.SHARED_DEVICES_KEY,
        this.CONTENT_PACKAGES_KEY,
        this.DEVICE_INFO_KEY,
      ]);
    } catch (error) {
      console.error('Failed to clear sharing data:', error);
    }
  }
}

export const deviceSharingService = DeviceSharingService.getInstance();