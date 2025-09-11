import { View, Text, StyleSheet } from 'react-native';
import { Bot, User, Lightbulb, BookOpen, Target } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageRendererProps {
  message: ChatMessage;
  onTranslate?: (translatedText: string) => void;
}

export default function ChatMessageRenderer({ message, onTranslate }: ChatMessageRendererProps) {
  const parseStructuredResponse = (text: string) => {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      // Check if it's a structured response with sections
      if (text.includes('**') || text.includes('##') || text.includes('###')) {
        return { type: 'structured', content: text };
      }
      return { type: 'plain', content: text };
    }
  };

  const renderStructuredContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <Text key={index} style={styles.h3}>
            {line.replace('### ', '')}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        return (
          <Text key={index} style={styles.h2}>
            {line.replace('## ', '')}
          </Text>
        );
      } else if (line.startsWith('# ')) {
        return (
          <Text key={index} style={styles.h1}>
            {line.replace('# ', '')}
          </Text>
        );
      }
      
      // Bold text
      else if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <Text key={index} style={styles.paragraph}>
            {parts.map((part, partIndex) => (
              <Text
                key={partIndex}
                style={partIndex % 2 === 1 ? styles.bold : styles.regular}
              >
                {part}
              </Text>
            ))}
          </Text>
        );
      }
      
      // Bullet points
      else if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              {line.replace(/^[•-] /, '')}
            </Text>
          </View>
        );
      }
      
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.+)/);
        if (match) {
          return (
            <View key={index} style={styles.numberedPoint}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{match[1]}</Text>
              </View>
              <Text style={styles.numberedText}>{match[2]}</Text>
            </View>
          );
        }
      }
      
      // Empty lines
      else if (line.trim() === '') {
        return <View key={index} style={styles.spacing} />;
      }
      
      // Regular paragraphs
      else if (line.trim()) {
        return (
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  const renderJSONContent = (jsonData: any) => {
    if (jsonData.type === 'lesson') {
      return (
        <View style={styles.lessonContainer}>
          <View style={styles.lessonHeader}>
            <BookOpen size={16} color="#4F46E5" />
            <Text style={styles.lessonTitle}>{jsonData.title || 'Generated Lesson'}</Text>
          </View>
          
          {jsonData.summary && (
            <Text style={styles.lessonSummary}>{jsonData.summary}</Text>
          )}
          
          {jsonData.keyPoints && jsonData.keyPoints.length > 0 && (
            <View style={styles.keyPointsSection}>
              <Text style={styles.sectionTitle}>Key Points:</Text>
              {jsonData.keyPoints.map((point: string, index: number) => (
                <View key={index} style={styles.keyPoint}>
                  <Target size={12} color="#10B981" />
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          )}
          
          {jsonData.activities && jsonData.activities.length > 0 && (
            <View style={styles.activitiesSection}>
              <Text style={styles.sectionTitle}>Activities:</Text>
              {jsonData.activities.map((activity: string, index: number) => (
                <View key={index} style={styles.activity}>
                  <View style={styles.activityNumber}>
                    <Text style={styles.activityNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }
    
    // Generic JSON display
    return (
      <View style={styles.jsonContainer}>
        <Text style={styles.jsonText}>{JSON.stringify(jsonData, null, 2)}</Text>
      </View>
    );
  };

  const parsedContent = parseStructuredResponse(message.text);

  return (
    <View style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage,
    ]}>
      <View style={styles.messageHeader}>
        {message.isUser ? (
          <User size={16} color="#FFFFFF" />
        ) : (
          <Bot size={16} color="#4F46E5" />
        )}
        <Text style={[
          styles.messageLabel,
          message.isUser ? styles.userLabel : styles.aiLabel,
        ]}>
          {message.isUser ? 'You' : 'AI Assistant'}
        </Text>
      </View>
      
      <View style={[
        styles.messageContent,
        message.isUser ? styles.userContent : styles.aiContent,
      ]}>
        {parsedContent.type === 'plain' ? (
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.aiText,
          ]}>
            {parsedContent.content}
          </Text>
        ) : parsedContent.type === 'structured' ? (
          <View style={styles.structuredContent}>
            {renderStructuredContent(parsedContent.content)}
          </View>
        ) : (
          renderJSONContent(parsedContent)
        )}
      </View>
      
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  userLabel: {
    color: '#FFFFFF',
  },
  aiLabel: {
    color: '#4F46E5',
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
  },
  userContent: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  aiContent: {
    backgroundColor: '#334155',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#FFFFFF',
  },
  structuredContent: {
    gap: 8,
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  regular: {
    color: '#94A3B8',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
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
    lineHeight: 22,
    flex: 1,
  },
  numberedPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  numberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  numberedText: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 22,
    flex: 1,
  },
  spacing: {
    height: 8,
  },
  lessonContainer: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lessonSummary: {
    fontSize: 14,
    color: '#DBEAFE',
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  keyPointsSection: {
    marginBottom: 16,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  keyPointText: {
    fontSize: 14,
    color: '#DBEAFE',
    flex: 1,
    lineHeight: 20,
  },
  activitiesSection: {
    marginBottom: 8,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  activityNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  activityNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityText: {
    fontSize: 14,
    color: '#DBEAFE',
    flex: 1,
    lineHeight: 20,
  },
  jsonContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  jsonText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});