import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bot, Target, TrendingUp, Calendar, Lightbulb, Brain, Zap, Clock, Users, BookOpen, Award } from 'lucide-react-native';
import { router } from 'expo-router';

interface ComingSoonScreenProps {
  onBack?: () => void;
}

export default function ComingSoonScreen({ onBack }: ComingSoonScreenProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const agenticFeatures = [
    {
      id: 'learning-planner',
      title: 'AI Learning Planner',
      description: 'Autonomous creation of personalized learning paths based on your goals and progress',
      icon: Target,
      color: '#4F46E5',
      capabilities: [
        'Analyze current knowledge level',
        'Set personalized learning objectives',
        'Create multi-step curriculum plans',
        'Schedule optimal learning sessions'
      ]
    },
    {
      id: 'adaptive-tutor',
      title: 'Adaptive AI Tutor',
      description: 'Intelligent tutoring that adapts teaching strategies based on your learning patterns',
      icon: Brain,
      color: '#7C3AED',
      capabilities: [
        'Monitor learning effectiveness',
        'Identify knowledge gaps automatically',
        'Adjust difficulty and pacing in real-time',
        'Provide targeted remedial content'
      ]
    },
    {
      id: 'proactive-assistant',
      title: 'Proactive Learning Assistant',
      description: 'AI that anticipates your needs and suggests relevant content before you ask',
      icon: Lightbulb,
      color: '#059669',
      capabilities: [
        'Suggest next topics based on interests',
        'Recommend optimal review sessions',
        'Connect related concepts across subjects',
        'Predict learning challenges'
      ]
    },
    {
      id: 'progress-optimizer',
      title: 'Progress Optimization Engine',
      description: 'Continuous analysis and optimization of your learning journey',
      icon: TrendingUp,
      color: '#DC2626',
      capabilities: [
        'Track micro-learning patterns',
        'Optimize study schedules',
        'Predict retention rates',
        'Suggest learning method improvements'
      ]
    },
    {
      id: 'goal-tracker',
      title: 'Autonomous Goal Tracker',
      description: 'AI that sets, tracks, and adjusts learning goals without manual input',
      icon: Award,
      color: '#EA580C',
      capabilities: [
        'Set SMART learning objectives',
        'Break down complex goals into steps',
        'Track progress automatically',
        'Celebrate achievements and milestones'
      ]
    },
    {
      id: 'collaborative-agent',
      title: 'Collaborative Learning Agent',
      description: 'AI that facilitates peer learning and group study optimization',
      icon: Users,
      color: '#0891B2',
      capabilities: [
        'Match learners with similar goals',
        'Facilitate study groups',
        'Coordinate collaborative projects',
        'Enable peer teaching opportunities'
      ]
    }
  ];

  const renderFeatureCard = (feature: typeof agenticFeatures[0]) => {
    const IconComponent = feature.icon;
    
    return (
      <View key={feature.id} style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
            <IconComponent size={24} color="#FFFFFF" />
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        </View>
        
        <View style={styles.capabilitiesList}>
          {feature.capabilities.map((capability, index) => (
            <View key={index} style={styles.capabilityItem}>
              <View style={[styles.capabilityDot, { backgroundColor: feature.color }]} />
              <Text style={styles.capabilityText}>{capability}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.comingSoonBadge}>
          <Clock size={12} color="#F59E0B" />
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agentic AI Features</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Bot size={48} color="#4F46E5" />
          </View>
          <Text style={styles.heroTitle}>Next-Generation AI Learning</Text>
          <Text style={styles.heroSubtitle}>
            Autonomous AI agents that understand, plan, and optimize your learning journey
          </Text>
        </View>

        <View style={styles.currentStatus}>
          <View style={styles.statusHeader}>
            <Zap size={20} color="#10B981" />
            <Text style={styles.statusTitle}>Current AI Capabilities</Text>
          </View>
          <View style={styles.currentFeatures}>
            <Text style={styles.currentFeature}>✅ Conversational AI Assistant</Text>
            <Text style={styles.currentFeature}>✅ Dynamic Lesson Generation</Text>
            <Text style={styles.currentFeature}>✅ Content Translation & TTS</Text>
            <Text style={styles.currentFeature}>✅ Intelligent Content Caching</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Upcoming Agentic Features</Text>
          <Text style={styles.sectionSubtitle}>
            These autonomous AI capabilities will transform LearnLocal into a truly intelligent learning companion
          </Text>
          
          {agenticFeatures.map(renderFeatureCard)}
        </View>

        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Development Timeline</Text>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelinePhase}>Phase 1: Foundation (Current)</Text>
              <Text style={styles.timelineDescription}>Basic AI chat and lesson generation</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#F59E0B' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelinePhase}>Phase 2: Intelligence (Next)</Text>
              <Text style={styles.timelineDescription}>Learning planner and adaptive tutoring</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#6B7280' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelinePhase}>Phase 3: Autonomy (Future)</Text>
              <Text style={styles.timelineDescription}>Fully autonomous learning optimization</Text>
            </View>
          </View>
        </View>

        <View style={styles.notifySection}>
          <BookOpen size={32} color="#4F46E5" />
          <Text style={styles.notifyTitle}>Stay Updated</Text>
          <Text style={styles.notifyDescription}>
            These agentic features are in active development. The AI will become more autonomous and intelligent with each update.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  heroSection: {
    alignItems: 'center',
    padding: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  currentStatus: {
    backgroundColor: '#064E3B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  currentFeatures: {
    gap: 8,
  },
  currentFeature: {
    fontSize: 14,
    color: '#D1FAE5',
    lineHeight: 20,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 24,
  },
  featureCard: {
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
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  capabilitiesList: {
    marginBottom: 16,
    gap: 8,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  capabilityText: {
    fontSize: 14,
    color: '#94A3B8',
    flex: 1,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#451A03',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  timelineSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelinePhase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  notifySection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1E40AF',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  notifyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  notifyDescription: {
    fontSize: 14,
    color: '#DBEAFE',
    textAlign: 'center',
    lineHeight: 20,
  },
});