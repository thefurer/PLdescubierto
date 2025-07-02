
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
  const messageToSend = messageContent ?? inputValue.trim();
  if (!messageToSend || isLoading) return;

  // Sanitizar y validar
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

  // Añadir mensaje de usuario a la conversación
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
    console.log('📤 Payload enviado:', sanitizedMessage);

    // INVOKE con JSON.stringify
    const { data, error } = await supabase.functions.invoke<{ reply: string }>(
      'chat-support',
      {
        body: JSON.stringify({ message: sanitizedMessage }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('📥 Respuesta recibida:', data, error);
    if (error) throw error;
    if (!data?.reply) throw new Error('Respuesta inválida del servidor');

    // Añadir respuesta del bot
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: data.reply,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);

  } catch (err: any) {
    console.error('Error en el chat:', err);

    // Mensaje de error genérico
    const fallback = `¡Ups! Algo salió mal.  
Puedes contactarnos:  
• Email: apincay@gmail.com  
• WhatsApp: +593 99 199 5390`;
    setMessages(prev => [
      ...prev,
      { id: (Date.now() + 1).toString(), type: 'bot', content: fallback, timestamp: new Date() }
    ]);

    toast({
      title: 'Error de conexión',
      description: 'No se pudo conectar con el asistente.',
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
