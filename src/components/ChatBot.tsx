
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
      // Create proper JSON payload
      const payload = JSON.stringify({ message: sanitizedMessage });
console.log("📤 Payload JSON:", payload);

const { data, error } = await fetch(
  "https://lncxwrrcsuhphxxsvjod.supabase.co/functions/v1/chat-support",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload
  }
).then(res => res.json());


      console.log('📥 Respuesta recibida:', { data, error });

      if (error) {
        console.error('Error de Supabase:', error);
        throw new Error(`Error de conexión: ${error.message}`);
      }

      // Validate response structure
      if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
        console.error('Respuesta inválida o vacía:', data);
        throw new Error('El asistente no pudo generar una respuesta válida');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error: any) {
      console.error('Error en el chat:', error);
      
      let errorMessage = '';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = `Problema de conexión con el servidor. Verificando tu conexión...

📧 Mientras tanto, puedes contactarnos directamente:
• Email: apincay@gmail.com
• WhatsApp: +593 99 199 5390
• Web: https://www.whalexpeditionsecuador.com/`;
      } else if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
        errorMessage = `El servidor está tardando en responder. Por favor, intenta de nuevo.

📧 Contacto directo:
• Email: apincay@gmail.com
• WhatsApp: +593 99 199 5390`;
      } else if (error.message?.includes('FunctionsError')) {
        errorMessage = `Nuestro asistente está experimentando dificultades técnicas.

📧 Puedes contactarnos directamente:
• Email: apincay@gmail.com
• WhatsApp: +593 99 199 5390
• Web: https://www.whalexpeditionsecuador.com/

¡Te ayudaremos personalmente!`;
      } else {
        errorMessage = `Hay un problema técnico temporal con el asistente.

📧 Puedes contactarnos directamente:
• Email: apincay@gmail.com
• WhatsApp: +593 99 199 5390
• Web: https://www.whalexpeditionsecuador.com/

¡Estaremos encantados de ayudarte!`;
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
        description: 'No se pudo conectar con el asistente. Puedes contactarnos directamente.',
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
