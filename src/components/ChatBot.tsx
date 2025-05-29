
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
      content: '¡Hola! Soy tu asistente de Puerto López Descubierto. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending message to chat-support function:', userMessage.content);
      
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message: userMessage.content }
      });

      console.log('Response from chat-support:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply || 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Lo siento, hay un problema técnico. Puedes contactarnos directamente en info@puertolopez.descubierto.com o al +593 2 123 4567.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error de conexión',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
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
          onSend={sendMessage}
          onKeyPress={handleKeyPress}
        />
      )}
    </>
  );
};

export default ChatBot;
