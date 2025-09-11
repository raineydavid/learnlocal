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
import { Send, Bot, User, Zap, Cloud } from 'lucide-react-native';
import TranslationBar from '@/components/TranslationBar';
import ChatMessageRenderer from '@/components/ChatMessageRenderer';
import { offlineService, CachedChat } from '@/services/offlineService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useEffect } from 'react';
import { api } from '@/services/api';

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
      text: 'Hello! I\'m your AI learning assistant. How can I help you learn today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const networkStatus = useNetworkStatus();
  const [chatId] = useState(`chat-${Date.now()}`);
  const [currentProvider, setCurrentProvider] = useState<'gpt-oss' | 'huggingface'>('gpt-oss');

  // Load cached messages on component mount
  useEffect(() => {
    loadCachedMessages();
    setCurrentProvider(api.getProvider());
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
    if (!networkStatus.isConnected && currentProvider === 'gpt-oss') {
      const offlineMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m currently offline, but I can still help with basic questions using cached knowledge. For new lesson generation, please connect to the internet.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, offlineMessage]);
      setIsLoading(false);
      return;
    }

    // If using Hugging Face but offline
    if (!networkStatus.isConnected && currentProvider === 'huggingface') {
      const offlineMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Hugging Face models require an internet connection. Please connect to the internet to use cloud-based AI features.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, offlineMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.sendChatMessage({
        message: userMessage.text,
        model: currentProvider,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback response for demo
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentProvider === 'huggingface' 
          ? 'I\'m having trouble connecting to Hugging Face. Please check your internet connection.'
          : 'I\'m having trouble connecting to the learning model. Please make sure your server is running and accessible.',
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
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>AI Learning Assistant</Text>
            <View style={styles.providerIndicator}>
              {currentProvider === 'gpt-oss' ? (
                <Zap size={16} color="#4F46E5" />
              ) : (
                <Cloud size={16} color="#F59E0B" />
              )}
              <Text style={styles.providerText}>
                {currentProvider === 'gpt-oss' ? 'GPT-OSS Local' : 'Hugging Face'}
              </Text>
            </View>
          </View>
        </View>
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
            <ChatMessageRenderer
              message={{
                id: 'loading',
                text: 'Thinking...',
                isUser: false,
                timestamp: new Date(),
              }}
            />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  providerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
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