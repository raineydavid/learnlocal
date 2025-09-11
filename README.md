# LearnLocal

A resilient, offline-first learning app built with Expo that integrates with FastAPI and local GPT-OSS models for AI-powered education. Designed to provide continuous learning access even in challenging circumstances.

## 🌟 Features

### **Core Learning Features**
- **Interactive Learning Modules**: Structured courses with progress tracking
- **AI Chat Assistant**: Local GPT-OSS model integration for personalized learning support  
- **Dynamic Lesson Generation**: Create custom lessons on any topic using AI
- **Progress Tracking**: Monitor learning journey with detailed statistics
- **Multi-language Support**: Translation and text-to-speech in multiple languages
- **Modern UI**: Clean, intuitive interface optimized for mobile and web

### **Offline-First Architecture**
- **Complete Offline Functionality**: Continue learning without internet connection
- **Smart Caching**: Automatic lesson and chat history storage
- **Offline Lesson Generation**: Reuses cached content intelligently
- **Local Progress Tracking**: All learning progress saved locally first
- **Network-Aware**: Seamless online/offline transitions

## 🚨 Emergency & Crisis Learning Solution

LearnLocal is specifically designed to provide **uninterrupted educational access for children in emergency situations**:

### **Why This Matters for Children in Crisis**

#### **🏠 Displacement & Refugee Situations**
- **No Internet Dependency**: Works completely offline once initial content is cached
- **Portable Education**: Entire curriculum fits on a single device
- **Language Barriers**: Built-in translation helps children learn in their native language
- **Trauma-Informed**: Self-paced learning reduces stress and anxiety

#### **🌪️ Natural Disasters & Infrastructure Failures**
- **Power Outages**: Minimal battery usage with offline mode
- **Network Disruptions**: Full functionality without internet connectivity
- **School Closures**: Complete educational continuity at home
- **Resource Scarcity**: One device can serve multiple children

#### **🏥 Medical Emergencies & Isolation**
- **Hospital Stays**: Quiet, engaging learning during treatment
- **Quarantine Periods**: Structured education during isolation
- **Chronic Illness**: Flexible, self-paced learning accommodates health needs
- **Mental Health**: Positive, achievement-focused activities boost morale

#### **⚡ Conflict Zones & Unstable Regions**
- **Safety First**: Learn safely indoors without needing to travel to schools
- **Interrupted Schooling**: Maintains educational continuity during conflicts
- **Limited Resources**: Works on basic smartphones and tablets
- **Hope & Normalcy**: Provides structure and future-focused activities

### **Child-Friendly Design Principles**

#### **🧠 Cognitive Development**
- **Age-Appropriate Content**: Beginner, intermediate, and advanced levels
- **Multiple Learning Styles**: Visual, auditory, and kinesthetic activities
- **Bite-Sized Lessons**: 15-minute modules prevent cognitive overload
- **Gamification**: Achievement badges and progress tracking motivate learning

#### **🎨 Emotional Well-being**
- **Positive Content**: "Good News" category focuses on uplifting stories
- **Creative Expression**: Art and creative writing modules for emotional processing
- **Success-Oriented**: Builds confidence through achievable learning goals
- **Culturally Sensitive**: Adaptable content respects diverse backgrounds

#### **🤝 Social Connection**
- **AI Companion**: Friendly AI assistant provides consistent support
- **Shareable Progress**: Children can share achievements with family
- **Collaborative Features**: Lessons can be completed with siblings or peers
- **Community Building**: Shared learning experiences create connections

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework**: React Native with Expo SDK 52.0.30
- **Navigation**: Expo Router 4.0.17 with tab-based architecture
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: StyleSheet.create with consistent design system
- **State Management**: React hooks with local state and context
- **Offline Storage**: AsyncStorage for persistent data

### **Backend Integration**
- **API Layer**: FastAPI server with RESTful endpoints
- **AI Model**: Local GPT-OSS model integration
- **Real-time Features**: WebSocket support for live interactions
- **File Management**: Local file system for cached content
- **Network Detection**: Real-time connectivity monitoring

### **Offline-First Design**

#### **Data Persistence**
```typescript
// Automatic lesson caching
const cachedLesson: CachedLesson = {
  id: generatedLesson.id,
  title: generatedLesson.title,
  content: generatedLesson.content,
  activities: generatedLesson.activities,
  keyPoints: generatedLesson.keyPoints,
  cachedAt: new Date(),
};
await offlineService.cacheLessons([cachedLesson]);
```

#### **Smart Cache Management**
- **Configurable Limits**: 50 lessons, 10 chats by default
- **Expiry System**: 30-day automatic cleanup
- **Size Monitoring**: Real-time storage usage tracking
- **Intelligent Retrieval**: Finds similar cached content before API calls

#### **Network-Aware Operations**
```typescript
// Graceful degradation
if (!networkStatus.isConnected) {
  const cachedLessons = await offlineService.getCachedLessons();
  const existingLesson = cachedLessons.find(lesson => 
    lesson.title.toLowerCase().includes(request.topic.toLowerCase())
  );
  return existingLesson || generateFallbackLesson(request);
}
```

### **AI Integration Architecture**

#### **Local Model Communication**
```typescript
// Lesson generation with local GPT-OSS
const conversation = {
  messages: [
    {
      role: 'system',
      content: 'You are an expert educational content creator...'
    },
    {
      role: 'developer',
      content: `Create lesson: Topic: ${topic}, Difficulty: ${difficulty}...`
    },
    {
      role: 'user',
      content: `Generate a ${difficulty} lesson about "${topic}"`
    }
  ]
};
```

#### **Fallback Mechanisms**
- **Cached Content**: Reuse similar lessons when offline
- **Template Lessons**: Pre-built lesson structures for common topics
- **Progressive Enhancement**: Basic functionality without AI, enhanced with AI

### **Security & Privacy**
- **Local Processing**: All AI processing happens on-device
- **No Data Collection**: No personal information sent to external servers
- **Encrypted Storage**: Sensitive data encrypted in local storage
- **Offline-First**: Reduces privacy risks by minimizing network requests

## 📱 Platform Support

### **Primary Platform: Web**
- **Browser Compatibility**: Modern browsers with WebAssembly support
- **Responsive Design**: Works on desktop, tablet, and mobile browsers
- **PWA Ready**: Can be installed as Progressive Web App
- **Offline Caching**: Service worker for offline web functionality

### **Mobile Platforms**
- **iOS**: Native iOS app through Expo development build
- **Android**: Native Android app through Expo development build
- **Cross-Platform**: Shared codebase with platform-specific optimizations

## 🚀 Quick Start

### **For Emergency Deployment**

1. **Download and Cache Content** (while online):
   ```bash
   npm install
   npm run dev
   # Generate and cache essential lessons
   # Download required AI models
   ```

2. **Offline Distribution**:
   - Export as static web app: `npm run build:web`
   - Deploy to local server or distribute via USB drives
   - Install as PWA on devices for offline access

3. **Emergency Setup**:
   - One device with cached content can serve multiple children
   - Content can be shared via local network or file transfer
   - No internet required after initial setup

### **For Development**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start FastAPI server** on localhost:8000 with GPT-OSS model:
   ```python
   # Your FastAPI server should implement:
   # POST /api/generate-lesson
   # POST /api/chat  
   # GET /api/health
   # POST /api/translate
   # POST /api/tts
   ```

3. **Run the Expo app**:
   ```bash
   npm run dev
   ```

4. **Configure server URL** in Settings if different from localhost:8000

## 🔧 Configuration

### **Environment Variables**
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_OFFLINE_MODE=true
EXPO_PUBLIC_CACHE_EXPIRY_DAYS=30
EXPO_PUBLIC_MAX_CACHED_LESSONS=50
```

### **Offline Settings**
- **Cache Limits**: Configurable lesson and chat storage limits
- **Expiry Management**: Automatic cleanup of old cached content
- **Storage Monitoring**: Real-time cache size tracking
- **Manual Cache Control**: Clear cache and manage storage

## 🌍 Humanitarian Impact

### **Deployment Scenarios**
- **Refugee Camps**: Tablets with pre-loaded content for education continuity
- **Disaster Relief**: Emergency education kits with offline learning
- **Remote Areas**: Educational access without internet infrastructure
- **Medical Facilities**: Learning tools for children during treatment

### **Partnership Opportunities**
- **NGOs**: Educational content distribution in crisis zones
- **Hospitals**: Child life programs and educational therapy
- **Government**: Emergency preparedness and educational continuity
- **International Organizations**: Scalable education solutions

## 📊 Technical Specifications

### **Performance**
- **Bundle Size**: Optimized for minimal download size
- **Memory Usage**: Efficient caching with configurable limits
- **Battery Life**: Offline mode reduces power consumption
- **Storage**: Compressed content for maximum lesson capacity

### **Accessibility**
- **Screen Readers**: Full accessibility support
- **High Contrast**: Visual accessibility options
- **Text-to-Speech**: Audio support for reading difficulties
- **Multiple Languages**: Translation and localization support

### **Scalability**
- **Content Distribution**: Efficient caching and sharing mechanisms
- **Multi-Device**: Content can be shared between devices
- **Bandwidth Optimization**: Minimal data usage when online
- **Offline Synchronization**: Smart sync when connectivity returns

## 🤝 Contributing

This project is designed to serve children in emergency situations. Contributions that improve offline functionality, educational content, or crisis-specific features are especially welcome.

### **Priority Areas**
- **Offline Functionality**: Enhance caching and offline capabilities
- **Educational Content**: Age-appropriate, trauma-informed learning materials
- **Accessibility**: Improve access for children with disabilities
- **Localization**: Add support for more languages and cultures
- **Performance**: Optimize for low-resource devices

## 📄 License

Open source license to enable humanitarian use and distribution in emergency situations.

---

**LearnLocal: Ensuring no child's education is interrupted, no matter the circumstances.**