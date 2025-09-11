import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BookOpen, Target, Clock, CheckCircle, Play } from 'lucide-react-native';

interface LessonContent {
  title?: string;
  content?: string;
  activities?: string[];
  keyPoints?: string[];
  estimatedDuration?: number;
  objectives?: string[];
  summary?: string;
}

interface LessonContentRendererProps {
  jsonContent: string;
  fallbackContent?: string;
}

export default function LessonContentRenderer({ jsonContent, fallbackContent }: LessonContentRendererProps) {
  const parseContent = (): LessonContent | null => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(jsonContent);
      return parsed;
    } catch (error) {
      // If JSON parsing fails, try to extract JSON from text
      try {
        const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (innerError) {
        console.log('Could not parse JSON content:', error);
      }
      return null;
    }
  };

  const lesson = parseContent();

  // If we can't parse JSON, show fallback content
  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackContent}>{fallbackContent || jsonContent}</Text>
      </View>
    );
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for headers and formatting
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Text key={index} style={styles.h1}>
            {line.replace('# ', '')}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        return (
          <Text key={index} style={styles.h2}>
            {line.replace('## ', '')}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        return (
          <Text key={index} style={styles.h3}>
            {line.replace('### ', '')}
          </Text>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              {line.replace(/^[*-] /, '')}
            </Text>
          </View>
        );
      } else if (line.trim() === '') {
        return <View key={index} style={styles.spacing} />;
      } else {
        return (
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        );
      }
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Lesson Header */}
      {lesson.title && (
        <View style={styles.header}>
          <BookOpen size={24} color="#4F46E5" />
          <Text style={styles.title}>{lesson.title}</Text>
        </View>
      )}

      {/* Duration and Objectives */}
      {(lesson.estimatedDuration || lesson.objectives) && (
        <View style={styles.metaSection}>
          {lesson.estimatedDuration && (
            <View style={styles.metaItem}>
              <Clock size={16} color="#94A3B8" />
              <Text style={styles.metaText}>{lesson.estimatedDuration} minutes</Text>
            </View>
          )}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <View style={styles.metaItem}>
              <Target size={16} color="#94A3B8" />
              <Text style={styles.metaText}>{lesson.objectives.length} objectives</Text>
            </View>
          )}
        </View>
      )}

      {/* Main Content */}
      {lesson.content && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lesson Content</Text>
          <View style={styles.contentContainer}>
            {renderMarkdown(lesson.content)}
          </View>
        </View>
      )}

      {/* Key Points */}
      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Learning Points</Text>
          <View style={styles.keyPointsContainer}>
            {lesson.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointItem}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Activities */}
      {lesson.activities && lesson.activities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Activities</Text>
          <View style={styles.activitiesContainer}>
            {lesson.activities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityNumber}>
                  <Text style={styles.activityNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Objectives</Text>
          <View style={styles.objectivesContainer}>
            {lesson.objectives.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <Target size={14} color="#4F46E5" />
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Summary */}
      {lesson.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>{lesson.summary}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  metaSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  contentContainer: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 20,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 20,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4F46E5',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    flex: 1,
  },
  spacing: {
    height: 12,
  },
  keyPointsContainer: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  keyPointText: {
    fontSize: 16,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 22,
  },
  activitiesContainer: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  activityNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityText: {
    fontSize: 16,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 22,
  },
  objectivesContainer: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  objectiveText: {
    fontSize: 16,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 22,
  },
  summaryContainer: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    padding: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#DBEAFE',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  fallbackContent: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
  },
});