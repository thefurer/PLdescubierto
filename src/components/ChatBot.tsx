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
      content: '¡Hola! 👋 Soy tu asistente personal de **Puerto López Descubierto**.\n\n¿En qué puedo ayudarte hoy? Puedo brindarte información sobre:\n\n• **Actividades turísticas** 🏖️\n• **Mejores épocas para visitar** 🌊\n• **Clima y temporadas** ☀️\n• **Información de contacto** 📞\n• **Soporte técnico** 💻\n\n¡Estoy aquí para hacer tu experiencia en Puerto López inolvidable! 😊',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messageContent?: string) => {
    const messageToSend = messageContent || inputValue.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageContent) setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending message to chat-support function:', messageToSend);
      
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message: messageToSend }
      });

      console.log('Response from chat-support:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Error al procesar el mensaje');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply || 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error enviando mensaje:', error);
      
      let errorMessage = 'Lo siento, hay un problema técnico. Puedes contactarnos directamente en info@puertolopez.descubierto.com o al +593 2 123 4567.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botErrorMessage]);
      
      toast({
        title: 'Error de conexión',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo.',
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
        />
      )}
    </>
  );
};

export default ChatBot;
