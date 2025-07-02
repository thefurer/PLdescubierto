import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        '¡Hola! 👋 Soy tu asistente personal de Puerto López. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content:
          '¡Hola! 👋 Soy tu asistente personal de Puerto López. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    toast({
      title: 'Conversación reiniciada',
      description: 'El historial del chat ha sido borrado.',
    });
  };

  const sendMessage = async (messageContent?: string) => {
    const raw = (messageContent ?? inputValue).trim();
    if (!raw || isLoading) return;

    // 1) Sanitizar entrada
    const sanitized = raw
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .substring(0, 1000)
      .trim();
    if (!sanitized) {
      toast({
        title: 'Mensaje inválido',
        description: 'El mensaje no puede estar vacío.',
        variant: 'destructive',
      });
      return;
    }

    // 2) Mostrar mensaje de usuario
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: sanitized, timestamp: new Date() }
    ]);
    if (!messageContent) setInputValue('');
    setIsLoading(true);

    try {
      // 3) Construir payload y loguearlo
      const payload = { message: sanitized };
      console.log('📤 Payload JSON:', JSON.stringify(payload));

      // 4) Enviar POST directo a la Edge Function
      const res = await fetch(
        'https://lncxwrrcsuhphxxsvjod.supabase.co/functions/v1/chat-support',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log('🌐 Status HTTP:', res.status);

      // 5) Verificar status y parsear JSON
      if (!res.ok) {
        const errText = await res.text();
        console.error('❌ Error HTTP:', res.status, errText);
        throw new Error('Error interno del servidor');
      }

      let data: ChatResponse;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error('❌ JSON inválido en respuesta:', parseErr);
        throw new Error('Respuesta malformada del servidor');
      }
      console.log('📥 JSON recibido:', data);

      // 6) Validar reply
      if (typeof data.reply !== 'string' || !data.reply.trim()) {
        console.error('❌ Reply vacío o inválido:', data);
        throw new Error('El asistente no pudo generar una respuesta válida');
      }

      // 7) Mostrar respuesta del bot
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), type: 'bot', content: data.reply, timestamp: new Date() }
      ]);
    } catch (err: any) {
      console.error('❌ Error en sendMessage():', err.message);

      // Fallback genérico con info de contacto
      const fallback = `Lo siento, no pude conectarme con el asistente.  
📧 apincay@gmail.com  
📱 +593 99 199 5390`;
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), type: 'bot', content: fallback, timestamp: new Date() }
      ]);

      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el asistente. Puedes contactarnos directamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (msg: string) => sendMessage(msg);
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
