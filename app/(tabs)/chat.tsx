import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Loader, CircleAlert as AlertCircle, Wifi, WifiOff } from 'lucide-react-native';
import TranslationBar from '@/components/TranslationBar';
import ChatMessageRenderer from '@/components/ChatMessageRenderer';
import { offlineService, CachedChat } from '@/services/offlineService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useEmbeddedServer } from '@/hooks/useEmbeddedServer';
import { api } from '@/services/api';
import { useEffect } from 'react';

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
  const embeddedServer = useEmbeddedServer();
  const [chatId] = useState(`chat-${Date.now()}`);
  const [serverError, setServerError] = useState<string | null>(null);

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
    setServerError(null);

    // Scroll to bottom immediately after user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      let response;
      
      // Try embedded server first if available
      if (embeddedServer.isServerRunning) {
        response = await fetch(`${embeddedServer.serverUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.text,
            model: 'embedded-gpt',
          }),
        });
      } else {
        // Fall back to external API
        response = await api.sendChatMessage({
          message: userMessage.text,
          model: 'gpt-oss',
        });
      }

      let aiResponseText;
      
      if (embeddedServer.isServerRunning && response) {
        const data = await response.json();
        aiResponseText = data.response;
      } else if (response && typeof response === 'object' && 'response' in response) {
        aiResponseText = response.response;
      } else {
        throw new Error('Invalid response format');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'I\'m having trouble responding right now. ';
      
      if (!networkStatus.isConnected && !embeddedServer.isServerRunning) {
        errorMessage += 'You\'re offline and the embedded server isn\'t running. Please check your connection or start the embedded server in Settings.';
      } else if (!embeddedServer.isServerRunning) {
        errorMessage += 'The external server seems unavailable. You can enable the embedded server in Settings for offline functionality.';
      } else {
        errorMessage += 'There was an error processing your request. Please try again.';
      }
      
      const offlineMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, offlineMessage]);
      setServerError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const startEmbeddedServer = async () => {
    const success = await embeddedServer.startServer();
    if (success) {
      Alert.alert('Success', 'Embedded server started! You can now chat offline.');
    } else {
      Alert.alert('Error', 'Failed to start embedded server. Please try again.');
    }
  };

  const getConnectionStatus = () => {
    if (embeddedServer.isServerRunning) {
      return { text: 'Embedded Server', color: '#10B981', icon: Wifi };
    } else if (networkStatus.isConnected) {
      return { text: 'External Server', color: '#3B82F6', icon: Wifi };
    } else {
      return { text: 'Offline', color: '#EF4444', icon: WifiOff };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AI Learning Assistant</Text>
          <View style={styles.statusContainer}>
            <connectionStatus.icon size={14} color={connectionStatus.color} />
            <Text style={[styles.statusText, { color: connectionStatus.color }]}>
              {connectionStatus.text}
            </Text>
          </View>
        </View>
        
        {!embeddedServer.isServerRunning && !networkStatus.isConnected && (
          <TouchableOpacity 
            style={styles.startServerButton}
            onPress={startEmbeddedServer}
            disabled={embeddedServer.isStarting}
          >
            <Text style={styles.startServerText}>
              {embeddedServer.isStarting ? 'Starting...' : 'Start Offline Mode'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <ChatMessageRenderer
              key={message.id}
              message={message}
              onTranslate={(translatedText) => {
                setMessages(prev => prev.map(msg => 
                  msg.id === message.id 
                    ? { ...msg, text: translatedText }
                    : msg
                ));
              }}
            />
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingMessage}>
                <Loader size={16} color="#4F46E5" />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
          
          {serverError && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#EF4444" />
              <Text style={styles.errorText}>Connection issue: {serverError}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about your learning..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <Text style={styles.characterCount}>
              {inputText.length}/500
            </Text>
          </View>
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
            {isLoading ? (
              <Loader size={20} color="#FFFFFF" />
            ) : (
              <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} />
            )}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  startServerButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  startServerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FCA5A5',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#334155',
    color: '#FFFFFF',
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    fontSize: 12,
    color: '#6B7280',
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