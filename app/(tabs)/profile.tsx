import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Award, BookOpen, Clock, TrendingUp } from 'lucide-react-native';

export default function ProfileTab() {
  const achievements = [
    { id: 1, title: 'First Lesson Complete', icon: BookOpen, earned: true },
    { id: 2, title: 'Week Streak', icon: TrendingUp, earned: true },
    { id: 3, title: '10 Hours Learned', icon: Clock, earned: false },
    { id: 4, title: 'AI Expert', icon: Award, earned: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#3B82F6" />
          </View>
          <Text style={styles.name}>Learning Enthusiast</Text>
          <Text style={styles.subtitle}>Joined December 2024</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.5h</Text>
            <Text style={styles.statLabel}>Study Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <TouchableOpacity
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    achievement.earned ? styles.achievementEarned : styles.achievementLocked,
                  ]}
                >
                  <IconComponent 
                    size={24} 
                    color={achievement.earned ? '#3B82F6' : '#9CA3AF'} 
                  />
                  <Text style={[
                    styles.achievementTitle,
                    achievement.earned ? styles.achievementTitleEarned : styles.achievementTitleLocked,
                  ]}>
                    {achievement.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>AI Fundamentals</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '70%' }]} />
              </View>
              <Text style={styles.progressText}>70%</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Machine Learning</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '30%' }]} />
              </View>
              <Text style={styles.progressText}>30%</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Natural Language Processing</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '10%' }]} />
              </View>
              <Text style={styles.progressText}>10%</Text>
            </View>
          </View>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementEarned: {
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  achievementLocked: {
    backgroundColor: '#475569',
    borderWidth: 1,
    borderColor: '#64748B',
  },
  achievementTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  achievementTitleEarned: {
    color: '#4F46E5',
  },
  achievementTitleLocked: {
    color: '#94A3B8',
  },
  progressCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#475569',
    borderRadius: 3,
    marginBottom: 4,
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
});