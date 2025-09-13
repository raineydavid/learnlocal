# Complete LearnLocal Project Recreation Prompt

Use this prompt to recreate the entire LearnLocal offline-first learning app:

---

**Create a comprehensive offline-first learning app called "LearnLocal" using React Native with Expo that provides AI-powered education for children in emergency situations. The app should work completely offline and include device-to-device content sharing capabilities.**

## Core Requirements:

### 1. **Framework & Architecture**
- Use Expo SDK 52.0.30 with Expo Router 4.0.17
- React Native with TypeScript
- Tab-based navigation as primary structure
- Offline-first architecture with smart caching
- Dark theme UI with modern design aesthetics

### 2. **Main Features**
- **AI Chat Assistant**: Conversational AI for learning support
- **Dynamic Lesson Generation**: AI-powered custom lesson creation
- **Interactive Learning Modules**: Structured courses with progress tracking
- **Multi-language Support**: Translation and text-to-speech
- **Offline Content Sharing**: Device-to-device lesson sharing via WiFi Direct/Bluetooth
- **Progress Tracking**: Local learning analytics and achievements

### 3. **Tab Structure**
Create 5 main tabs:
- **Home**: Featured lessons, categories (STEM, Creative Arts, Our World)
- **Generate**: AI lesson creation with topic input, difficulty selection, provider choice
- **Chat**: AI assistant with conversation history and offline fallback
- **Profile**: User progress, achievements, learning statistics
- **Settings**: Server configuration, offline settings, cache management

### 4. **AI Integration Options**
Support multiple AI backends:
- **External FastAPI Server**: With local GPT-OSS models (20B/120B)
- **Hugging Face Models**: Cloud and offline model support
- **Embedded Server**: Built-in Express.js server with local AI processing
- **Offline Fallback**: Template-based responses when no AI available

### 5. **Offline-First Features**
- **Smart Caching**: Store lessons, chats, and user progress locally
- **Content Packages**: Bundle lessons for device-to-device sharing
- **QR Code Sharing**: Instant content transfer via QR codes
- **Network Detection**: Graceful online/offline transitions
- **Local Storage**: AsyncStorage for all persistent data

### 6. **Emergency/Crisis Features**
- **Device Sharing**: One device can serve content to multiple devices
- **Battery Optimization**: Minimal power consumption in offline mode
- **Resilient Design**: Works in disaster scenarios without infrastructure
- **Multi-device Sync**: Content sharing between tablets/phones
- **Offline Audio**: Text-to-speech without internet

### 7. **UI/UX Requirements**
- **Apple-level Design**: Premium, polished interface
- **Responsive**: Works on mobile, tablet, and web
- **Accessibility**: Screen reader support, high contrast options
- **Micro-interactions**: Smooth animations and transitions
- **Loading States**: Proper feedback for all async operations

### 8. **Technical Specifications**
- **CORS Support**: Comprehensive cross-origin configuration
- **Error Handling**: Graceful degradation and user-friendly messages
- **Performance**: Efficient caching, lazy loading, optimized bundle size
- **Security**: Local data encryption, no external data collection
- **Scalability**: Modular architecture for easy feature additions

### 9. **Key Components to Include**
- **LessonPlayer**: Audio playback with progress tracking
- **TranslationBar**: Multi-language content translation
- **ChatMessageRenderer**: Rich message formatting with markdown support
- **ModelDownloadScreen**: AI model management interface
- **DeviceSharingModal**: Content sharing between devices
- **ComingSoonScreen**: Future agentic AI features showcase
- **OfflineIndicator**: Network status display

### 10. **Services Architecture**
- **API Service**: Unified interface for all backend communication
- **Offline Service**: Local caching and data management
- **Audio Service**: Text-to-speech and audio playback
- **Translation Service**: Multi-language support
- **Model Service**: AI model downloading and management
- **Harmony Service**: Lesson generation orchestration

### 11. **Content Structure**
Create sample lessons for:
- **STEM**: Water purification, solar system, basic math
- **Creative Arts**: Art activities, music theory, creative writing
- **Our World**: Good news stories, geography, current events

### 12. **Offline AI Capabilities**
- **Chat Processing**: Local conversational AI responses
- **Lesson Generation**: Template-based educational content creation
- **Content Translation**: Basic translation without internet
- **Progress Analytics**: Local learning pattern analysis

### 13. **Device Sharing Implementation**
- **WiFi Direct**: Direct device-to-device connection
- **Bluetooth LE**: Low-power content distribution
- **Local Hotspot**: One device serves multiple clients
- **QR Codes**: Instant content package sharing
- **Content Packages**: Bundled lessons with metadata

### 14. **Emergency Deployment Features**
- **Standalone APK**: Complete offline functionality in mobile app
- **PWA Support**: Progressive Web App for browser installation
- **USB Distribution**: Content packages on USB drives
- **Solar Charging**: Optimized for low-power scenarios

### 15. **Configuration Options**
- **Server URLs**: Configurable API endpoints
- **Cache Limits**: Adjustable storage quotas
- **Language Settings**: Default and available languages
- **Offline Behavior**: Fallback strategies and timeouts

### 16. **File Organization**
Structure the project with:
- `/app` - Expo Router pages and layouts
- `/components` - Reusable UI components
- `/services` - Business logic and API communication
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions

### 17. **Styling Requirements**
- **Consistent Design System**: 8px spacing, color ramps, typography scale
- **Dark Theme**: Primary dark blue (#1E293B) with accent colors
- **Responsive Breakpoints**: Mobile-first with tablet/desktop support
- **Accessibility**: WCAG compliant contrast ratios
- **Animations**: Smooth transitions and micro-interactions

### 18. **Error Handling**
- **Network Errors**: Graceful fallback to cached content
- **AI Failures**: Template responses when models unavailable
- **Storage Limits**: Automatic cache cleanup and user notifications
- **CORS Issues**: Comprehensive cross-origin request handling

### 19. **Performance Targets**
- **Bundle Size**: <25MB for mobile, <15MB for web
- **Memory Usage**: Efficient caching with configurable limits
- **Battery Life**: 60% power savings in offline mode
- **Load Times**: <3 seconds for cached content

### 20. **Future-Ready Architecture**
Include a "Coming Soon" screen showcasing planned agentic AI features:
- **AI Learning Planner**: Autonomous curriculum creation
- **Adaptive Tutor**: Real-time teaching strategy adaptation
- **Proactive Assistant**: Anticipates learning needs
- **Progress Optimizer**: Continuous learning optimization
- **Goal Tracker**: Self-managing learning objectives
- **Collaborative Agent**: Peer learning facilitation

## Implementation Notes:

### **Start with the basic Expo setup:**
```bash
npx create-expo-app LearnLocal --template tabs
cd LearnLocal
npm install @expo/vector-icons lucide-react-native @react-native-async-storage/async-storage @react-native-community/netinfo react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens expo-speech expo-camera
```

### **Key Dependencies:**
- Expo Router for navigation
- AsyncStorage for offline data
- NetInfo for network detection
- Lucide React Native for icons
- Expo Speech for text-to-speech
- React Native Gesture Handler for interactions

### **CORS Configuration:**
Ensure all API requests include proper CORS headers and the backend supports cross-origin requests from React Native and web browsers.

### **Offline Strategy:**
Implement a comprehensive caching system that stores lessons, chat history, user progress, and AI model responses locally. The app should work completely offline after initial setup.

### **Emergency Use Case:**
Design every feature with the assumption it might be used in disaster scenarios, refugee camps, or areas with limited internet connectivity. Prioritize reliability, battery efficiency, and device-to-device sharing.

---

**This prompt will create a complete, production-ready offline learning app suitable for emergency educational deployment.**