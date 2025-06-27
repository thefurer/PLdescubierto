import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChatButton from './chat/ChatButton';
import ChatWindow from './chat/ChatWindow';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! 👋 Soy tu asistente personal de Puerto López. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '¡Hola! 👋 Soy tu asistente personal de Puerto López. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
    setInputValue('');
    toast({
      title: 'Conversación reiniciada',
      description: 'El historial del chat ha sido borrado.',
    });
  };

  const sendMessage = async (messageContent?: string) => {
    const messageToSend = messageContent || inputValue.trim();
    
    if (!messageToSend || isLoading) return;
    
    // Sanitize input
    const sanitizedMessage = messageToSend
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .substring(0, 1000)
      .trim();
    
    if (!sanitizedMessage) {
      toast({
        title: 'Mensaje inválido',
        description: 'El mensaje no puede estar vacío.',
        variant: 'destructive'
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: sanitizedMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageContent) setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending message to chat-support function:', sanitizedMessage);
      
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message: sanitizedMessage }
      });

      console.log('Response from chat-support:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Error al procesar el mensaje');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data?.reply || 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error: any) {
      console.error('Chat error details:', {
        error,
        message: error?.message,
        stack: error?.stack,
        cause: error?.cause
      });
      
      const errorMessage = `Lo siento, hay un problema técnico momentáneo.

📧 Puedes contactarnos directamente:
• Email: apincay@gmail.com
• WhatsApp: +593 99 199 5390
• Web: https://www.whalexpeditionsecuador.com/

¡Estaremos encantados de ayudarte!`;
      
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botErrorMessage]);
      
      toast({
        title: 'Error de conexión',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo o contáctanos directamente.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (message: string) => {
    sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
