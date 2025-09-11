import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User } from 'lucide-react-native';
import TranslationBar from '@/components/TranslationBar';
import { offlineService, CachedChat } from '@/services/offlineService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI learning assistant powered by GPT-OSS. How can I help you learn today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const networkStatus = useNetworkStatus();
  const [chatId] = useState(`chat-${Date.now()}`);

  // Load cached messages on component mount
  useEffect(() => {
    loadCachedMessages();
  }, []);

  // Save messages to cache whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't cache just the initial message
      saveChatToCache();
    }
  }, [messages]);

  const loadCachedMessages = async () => {
    try {
      const cachedChats = await offlineService.getCachedChats();
      if (cachedChats.length > 0) {
        const lastChat = cachedChats[0];
        setMessages(lastChat.messages);
      }
    } catch (error) {
      console.error('Failed to load cached messages:', error);
    }
  };

  const saveChatToCache = async () => {
    try {
      const cachedChat: CachedChat = {
        id: chatId,
        messages,
        lastUpdated: new Date(),
      };
      await offlineService.cacheChat(cachedChat);
    } catch (error) {
      console.error('Failed to cache chat:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // If offline, provide offline response
    if (!networkStatus.isConnected) {
      const offlineMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m currently offline, but I can still help with basic questions using cached knowledge. For new lesson generation, please connect to the internet and ensure your FastAPI server is running.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, offlineMessage]);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual FastAPI endpoint
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          model: 'gpt-oss',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback response for demo
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I\'m having trouble connecting to the learning model. Please check your FastAPI server is running on localhost:8000',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      // Fallback response for demo
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m having trouble connecting to the learning model. Please make sure your FastAPI server is running and accessible.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Learning Assistant</Text>
        <Text style={styles.subtitle}>Powered by local GPT-OSS model</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <View style={styles.messageHeader}>
                {message.isUser ? (
                  <User size={16} color="#FFFFFF" />
                ) : (
                  <Bot size={16} color="#3B82F6" />
                )}
                <Text style={[
                  styles.messageLabel,
                  message.isUser ? styles.userLabel : styles.aiLabel,
                ]}>
                  {message.isUser ? 'You' : 'AI Assistant'}
                </Text>
              </View>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.aiText,
              ]}>
                {message.text}
              </Text>
              {!message.isUser && (
                <TranslationBar
                  text={message.text}
                  onTranslate={(translatedText) => {
                    // Update the message with translated text
                    setMessages(prev => prev.map(msg => 
                      msg.id === message.id 
                        ? { ...msg, text: translatedText }
                        : msg
                    ));
                  }}
                />
              )}
            </View>
          ))}
          
          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <Bot size={16} color="#3B82F6" />
                <Text style={styles.aiLabel}>AI Assistant</Text>
              </View>
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about your learning..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : {}]}
            onPress={sendMessage}
            disabled={isLoading || inputText.trim() === ''}
          >
            <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    backgroundColor: '#1E293B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
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
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    padding: 12,
    borderRadius: 16,
  },
  userText: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    borderBottomRightRadius: 4,
  },
  aiText: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: '#334155',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    backgroundColor: '#334155',
    color: '#FFFFFF',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#4F46E5',
  },
});