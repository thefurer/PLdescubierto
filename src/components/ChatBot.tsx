import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/hooks/useLanguage';
import ChatButton from './chat/ChatButton';
import ChatWindow from './chat/ChatWindow';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-support`;

const ChatBot = () => {
  const { language } = useLanguage();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: language === 'es' 
        ? '¡Hola! 🐋 Soy Ballenita, tu guía de Puerto López. ¿Te ayudo a explorar nuestras playas, avistamiento de ballenas o qué te gustaría descubrir hoy?'
        : 'Hello! 🐋 I\'m Ballenita, your Puerto López guide. Can I help you explore our beaches, whale watching, or what would you like to discover today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        type: 'bot',
        content: t.chatWelcomeMessage,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    toast({
      title: t.chatConversationReset,
      description: t.chatHistoryCleared,
    });
  }, [toast, t]);

  const sendMessage = async (messageContent?: string) => {
    const rawMessage = (messageContent ?? inputValue).trim();
    if (!rawMessage || isLoading) return;

    const sanitized = rawMessage
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 1000);

    if (!sanitized) {
      toast({
        title: t.chatInvalidMessage,
        description: t.chatWriteValid,
        variant: 'destructive',
      });
      return;
    }

    const userMessageId = crypto.randomUUID();
    
    setMessages(prev => [
      ...prev,
      { id: userMessageId, type: 'user', content: sanitized, timestamp: new Date() }
    ]);
    
    if (!messageContent) setInputValue('');
    setIsLoading(true);

    let assistantContent = '';
    const assistantId = crypto.randomUUID();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: sanitized }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      setMessages(prev => [
        ...prev,
        { id: assistantId, type: 'bot', content: '', timestamp: new Date() }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch { /* ignore */ }
        }
      }

      if (!assistantContent.trim()) {
        setMessages(prev => 
          prev.map(m => m.id === assistantId ? { ...m, content: t.chatFallbackError } : m)
        );
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== assistantId || m.content);
        return [
          ...filtered,
          { id: crypto.randomUUID(), type: 'bot', content: t.chatConnectionProblem, timestamp: new Date() }
        ];
      });

      toast({
        title: t.chatConnectionError,
        description: error.message || t.chatCouldNotConnect,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = useCallback((msg: string) => {
    sendMessage(msg);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [inputValue, isLoading]);

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={() => sendMessage()}
          onKeyPress={handleKeyPress}
          onQuickOption={handleQuickOption}
          onClearConversation={clearConversation}
        />
      )}
    </>
  );
};

export default ChatBot;
