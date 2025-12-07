import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, Send, Bot, User, 
  Lightbulb, Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface AttractionRating {
  attraction_id: string;
  attraction_name: string;
  average_rating: number;
  total_ratings: number;
  recent_ratings: number;
  rating_history: Array<{ date: string; rating: number; count: number }>;
  category: string;
}

interface AnalyticsData {
  attractions: AttractionRating[];
  totalRatings: number;
  averageRating: number;
  weeklyTrend: number;
  topPerformers: AttractionRating[];
  underPerformers: AttractionRating[];
  anomalies: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }>;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface InteractiveChatAssistantProps {
  data: AnalyticsData;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-chat`;

const InteractiveChatAssistant = ({ data }: InteractiveChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de análisis potenciado con **inteligencia artificial**. Puedo ayudarte a entender las calificaciones, identificar tendencias y generar recomendaciones personalizadas.\n\n**Pregúntame lo que quieras**, por ejemplo:\n• "¿Cuál es la atracción con mejor rendimiento?"\n• "Dame recomendaciones para mejorar las calificaciones"\n• "¿Qué tendencias observas esta semana?"\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate contextual suggestions based on current data
  const getContextualSuggestions = useCallback(() => {
    const suggestions: Array<{ label: string; command: string; priority: number; icon?: string }> = [];

    // Always include base suggestions
    suggestions.push({
      label: "Top Performers",
      command: "¿Cuáles son las atracciones mejor calificadas y por qué destacan?",
      priority: 1,
      icon: "🏆"
    });

    // If there are underperformers, suggest asking about them
    if (data.underPerformers.length > 0) {
      const worst = data.underPerformers[0];
      suggestions.push({
        label: `Mejorar ${worst.attraction_name.split(' ').slice(0, 2).join(' ')}`,
        command: `¿Cómo puedo mejorar las calificaciones de ${worst.attraction_name}? Tiene ${worst.average_rating} estrellas.`,
        priority: 0,
        icon: "📈"
      });
    }

    // If there are anomalies/alerts
    if (data.anomalies.length > 0) {
      const criticalCount = data.anomalies.filter(a => a.severity === 'high').length;
      suggestions.push({
        label: criticalCount > 0 ? `${criticalCount} Alertas Críticas` : "Ver Alertas",
        command: "Explícame las alertas activas y qué acciones debo tomar para resolverlas.",
        priority: criticalCount > 0 ? -1 : 2,
        icon: criticalCount > 0 ? "🚨" : "⚠️"
      });
    }

    // Weekly trend suggestion
    if (data.weeklyTrend !== 0) {
      const trendDirection = data.weeklyTrend > 0 ? "subiendo" : "bajando";
      suggestions.push({
        label: `Tendencia ${data.weeklyTrend > 0 ? "↑" : "↓"}`,
        command: `Las calificaciones están ${trendDirection} esta semana. ¿A qué se debe y qué puedo hacer?`,
        priority: 3,
        icon: data.weeklyTrend > 0 ? "📈" : "📉"
      });
    }

    // If average is low, suggest improvement plan
    if (data.averageRating < 4) {
      suggestions.push({
        label: "Plan de Mejora",
        command: `El promedio general es ${data.averageRating}. Dame un plan completo para subir las calificaciones.`,
        priority: 1,
        icon: "🎯"
      });
    }

    // If there's a top performer, suggest learning from it
    if (data.topPerformers.length > 0) {
      const best = data.topPerformers[0];
      suggestions.push({
        label: `Éxito de ${best.attraction_name.split(' ').slice(0, 2).join(' ')}`,
        command: `${best.attraction_name} tiene ${best.average_rating} estrellas. ¿Qué podemos aprender de su éxito?`,
        priority: 4,
        icon: "⭐"
      });
    }

    // Check for inactive attractions
    const inactiveAttractions = data.attractions.filter(a => a.recent_ratings === 0);
    if (inactiveAttractions.length > 0) {
      suggestions.push({
        label: `${inactiveAttractions.length} Sin Actividad`,
        command: `Hay ${inactiveAttractions.length} atracciones sin calificaciones recientes. ¿Cómo puedo aumentar su visibilidad?`,
        priority: 2,
        icon: "💤"
      });
    }

    // Sort by priority and return top 4
    return suggestions
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 4);
  }, [data]);

  const contextualSuggestions = getContextualSuggestions();

  const streamAIResponse = async (userMessage: string): Promise<void> => {
    const analyticsContext = {
      totalRatings: data.totalRatings,
      averageRating: data.averageRating,
      weeklyTrend: data.weeklyTrend,
      totalAttractions: data.attractions.length,
      topPerformers: data.topPerformers.slice(0, 5).map(a => ({
        name: a.attraction_name,
        rating: a.average_rating,
        totalVotes: a.total_ratings,
        recentVotes: a.recent_ratings,
        category: a.category
      })),
      underPerformers: data.underPerformers.slice(0, 5).map(a => ({
        name: a.attraction_name,
        rating: a.average_rating,
        totalVotes: a.total_ratings,
        recentVotes: a.recent_ratings,
        category: a.category
      })),
      allAttractions: data.attractions.map(a => ({
        name: a.attraction_name,
        rating: a.average_rating,
        totalVotes: a.total_ratings,
        recentVotes: a.recent_ratings,
        category: a.category
      })),
      anomalies: data.anomalies,
      currentDate: new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        message: userMessage,
        analyticsContext 
      }),
    });

    if (!response.ok || !response.body) {
      if (response.status === 429) {
        throw new Error("Límite de solicitudes excedido. Por favor, intenta de nuevo más tarde.");
      }
      if (response.status === 402) {
        throw new Error("Créditos de IA insuficientes. Contacta al administrador.");
      }
      throw new Error("Error al obtener respuesta del asistente");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";
    let streamDone = false;

    // Create initial assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    while (!streamDone) {
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
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => 
              prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: assistantSoFar } 
                  : m
              )
            );
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
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
            assistantSoFar += content;
            setMessages(prev => 
              prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: assistantSoFar } 
                  : m
              )
            );
          }
        } catch { /* ignore partial leftovers */ }
      }
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      await streamAIResponse(currentInput);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error(error instanceof Error ? error.message : "Error al procesar tu mensaje");
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, data, isTyping]);

  useEffect(() => {
    const handleSetChatQuery = (event: any) => {
      const query = event.detail.query;
      setInputValue(query);
    };

    window.addEventListener('setChatQuery', handleSetChatQuery);
    
    return () => {
      window.removeEventListener('setChatQuery', handleSetChatQuery);
    };
  }, []);

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    setTimeout(() => {
      const event = new Event('submit');
      inputRef.current?.form?.dispatchEvent(event);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Bold text
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic text
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return (
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: processed }} />
            {i < content.split('\n').length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <div className="space-y-4">
      {/* Quick Commands */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Sugerencias Contextuales
            <Badge variant="outline" className="text-xs ml-auto">
              Basadas en tus datos
            </Badge>
          </h4>
          <div className="flex flex-wrap gap-2">
            {contextualSuggestions.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand(cmd.command)}
                className="text-xs gap-1"
                disabled={isTyping}
              >
                <span>{cmd.icon}</span>
                {cmd.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Asistente IA de Análisis
            <Badge variant="secondary" className="ml-auto flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages Area */}
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-lg max-w-[85%] text-left ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        {renderContent(message.content)}
                        {message.type === 'assistant' && isTyping && message.id === messages[messages.length - 1]?.id && message.content && (
                          <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && messages[messages.length - 1]?.type === 'user' && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-card border">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pregúntame sobre las calificaciones, tendencias o recomendaciones..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isTyping}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Presiona Enter para enviar • Respuestas generadas con IA en tiempo real
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveChatAssistant;
