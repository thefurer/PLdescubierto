
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
      console.log('=== Enviando mensaje al chatbot ===');
      console.log('Mensaje:', sanitizedMessage);
      console.log('Timestamp:', new Date().toISOString());
      
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message: sanitizedMessage },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('=== Respuesta del Edge Function ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Error de función Supabase:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        console.error('No data received from Edge Function');
        throw new Error('No response received from server');
      }

      if (!data.reply) {
        console.error('No reply in response data:', data);
        throw new Error('Invalid response format from server');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      console.log('Mensaje del bot agregado exitosamente');
      
    } catch (error: any) {
      console.error('=== Error detallado del chat ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
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
        description: 'No fue posible conectar con el servidor. Verifica tu conexión e intenta de nuevo.',
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
