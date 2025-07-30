import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChatButton from './chat/ChatButton';
import ChatWindow from './chat/ChatWindow';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  reply: string;
  error?: string;
}

interface RequestPayload {
  message: string;
  sessionId: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! 👋 Soy tu asistente personal de Puerto López. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const { toast } = useToast();

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        type: 'bot',
        content: '¡Hola! 👋 Soy tu asistente personal de Puerto López. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    setConnectionRetries(0);
    toast({
      title: 'Conversación reiniciada',
      description: 'El historial del chat ha sido borrado.',
    });
  }, [toast]);

  const validateMessage = (message: string): { isValid: boolean; sanitized?: string; error?: string } => {
    if (!message.trim()) {
      return { isValid: false, error: 'El mensaje no puede estar vacío.' };
    }

    const sanitized = message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s\u00C0-\u017F.,;:¿?¡!()@+-]/g, '')
      .trim()
      .substring(0, 1000);

    if (!sanitized) {
      return { isValid: false, error: 'El mensaje contiene caracteres no válidos.' };
    }

    return { isValid: true, sanitized };
  };

  const callChatFunction = async (payload: RequestPayload): Promise<ChatResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      console.log('📤 Enviando a chat-support:', payload);
      console.log('📊 Session ID:', sessionId);
      console.log('📝 Message content:', payload.message);
      
      // Usar fetch directo en lugar de supabase.functions.invoke
      const response = await fetch('https://lncxwvrcsuhphxxsvjod.supabase.co/functions/v1/chat-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuY3h3dnJjc3VocGh4eHN2am9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjM4MzgsImV4cCI6MjA2NDAzOTgzOH0.82qRAvif76C7GwmFgbCvM9OZVmf-P3FLJFzXkF88_tc`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', response.status, errorText);
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data.reply !== 'string') {
        console.error('❌ Respuesta inválida:', data);
        throw new Error('El servidor devolvió una respuesta inválida');
      }

      return data as ChatResponse;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('La consulta tardó demasiado en responder. Intenta de nuevo.');
      }
      
      console.error('❌ Error en callChatFunction:', error);
      throw error;
    }
  };

  const sendMessage = async (messageContent?: string) => {
    const rawMessage = (messageContent ?? inputValue).trim();
    if (!rawMessage || isLoading) return;

    const validation = validateMessage(rawMessage);
    if (!validation.isValid) {
      toast({
        title: 'Mensaje inválido',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    const sanitizedMessage = validation.sanitized!;
    const userMessageId = crypto.randomUUID();
    
    // Mostrar mensaje del usuario inmediatamente
    setMessages(prev => [
      ...prev,
      { 
        id: userMessageId, 
        type: 'user', 
        content: sanitizedMessage, 
        timestamp: new Date() 
      }
    ]);
    
    if (!messageContent) setInputValue('');
    setIsLoading(true);

    try {
      const payload: RequestPayload = {
        message: sanitizedMessage,
        sessionId: sessionId,
      };

      const response = await callChatFunction(payload);
      
      // Mostrar respuesta del bot
      setMessages(prev => [
        ...prev,
        { 
          id: crypto.randomUUID(), 
          type: 'bot', 
          content: response.reply, 
          timestamp: new Date() 
        }
      ]);

      // Reset retry counter on success
      setConnectionRetries(0);

    } catch (error: any) {
      console.error('❌ Error al enviar mensaje:', error);
      
      const retryCount = connectionRetries + 1;
      setConnectionRetries(retryCount);

      let errorMessage = 'No se pudo conectar con el asistente.';
      let botResponse = '';

      if (retryCount <= 2) {
        errorMessage = `Error de conexión (intento ${retryCount}/3). Reintentando...`;
        botResponse = `Disculpa, hubo un problema de conexión. Estoy intentando reconectarme...

Mientras tanto, puedes contactarnos directamente:
📧 apincay@gmail.com
📱 +593 99 199 5390`;
      } else {
        errorMessage = 'No se pudo conectar después de varios intentos.';
        botResponse = `Lo siento, el asistente está temporalmente fuera de línea.

Para asistencia inmediata, contacta:
📧 apincay@gmail.com
📱 +593 99 199 5390
🌐 https://www.whalexpeditionsecuador.com/

O intenta nuevamente en unos minutos.`;
      }

      setMessages(prev => [
        ...prev,
        { 
          id: crypto.randomUUID(), 
          type: 'bot', 
          content: botResponse, 
          timestamp: new Date() 
        }
      ]);

      toast({
        title: 'Error de conexión',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = useCallback((msg: string) => {
    sendMessage(msg);
  }, [sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

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
