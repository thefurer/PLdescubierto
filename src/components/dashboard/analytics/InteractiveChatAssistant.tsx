import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, Send, Bot, User, BarChart3, 
  TrendingUp, Star, MapPin, Download, Calendar,
  Lightbulb, AlertTriangle, Award
} from "lucide-react";

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

const InteractiveChatAssistant = ({ data }: InteractiveChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente IA para análisis de calificaciones. Puedo ayudarte con consultas como:\n\n• "Muéstrame el gráfico de evolución de Isla de la Plata"\n• "¿Qué atracción tuvo menos visitas esta semana?"\n• "Genera recomendaciones para mejorar la atracción con menor puntuación"\n• "Descarga el reporte de calificaciones del mes"\n\n¿En qué puedo ayudarte?',
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

  const quickCommands = [
    { label: "Top Performers", command: "muéstrame las mejores atracciones" },
    { label: "Tendencias", command: "analiza las tendencias de la semana" },
    { label: "Alertas", command: "muéstrame las alertas activas" },
    { label: "Reporte", command: "genera un reporte completo" }
  ];

  const processCommand = (command: string): string => {
    const lowercaseCommand = command.toLowerCase();

    // Análisis de top performers
    if (lowercaseCommand.includes('mejor') || lowercaseCommand.includes('top') || lowercaseCommand.includes('destacad')) {
      const top3 = data.topPerformers.slice(0, 3);
      return `🏆 **Top 3 Atracciones Mejor Calificadas:**\n\n${top3.map((attraction, index) => 
        `${index + 1}. **${attraction.attraction_name}**\n   ⭐ ${attraction.average_rating} estrellas (${attraction.total_ratings} calificaciones)\n   📈 ${attraction.recent_ratings} calificaciones esta semana`
      ).join('\n\n')}\n\n💡 Estas atracciones están funcionando excelentemente. Considera usar sus mejores prácticas en otras áreas.`;
    }

    // Análisis de underperformers
    if (lowercaseCommand.includes('peor') || lowercaseCommand.includes('bajo') || lowercaseCommand.includes('necesita') || lowercaseCommand.includes('mejorar')) {
      const bottom3 = data.underPerformers.slice(0, 3);
      return `⚠️ **Atracciones que Necesitan Atención:**\n\n${bottom3.map((attraction, index) => 
        `${index + 1}. **${attraction.attraction_name}**\n   ⭐ ${attraction.average_rating} estrellas (${attraction.total_ratings} calificaciones)\n   📉 ${attraction.recent_ratings} calificaciones esta semana`
      ).join('\n\n')}\n\n🚀 **Recomendaciones:**\n• Revisión inmediata de operaciones\n• Capacitación del personal\n• Mejoras en infraestructura\n• Análisis de comentarios negativos`;
    }

    // Análisis de tendencias
    if (lowercaseCommand.includes('tendencia') || lowercaseCommand.includes('evolución') || lowercaseCommand.includes('semana')) {
      const weeklyChange = data.weeklyTrend;
      const trend = weeklyChange >= 0 ? 'positiva' : 'negativa';
      const emoji = weeklyChange >= 0 ? '📈' : '📉';
      
      return `${emoji} **Análisis de Tendencias Semanales:**\n\n**Tendencia General:** ${trend.charAt(0).toUpperCase() + trend.slice(1)}\n**Calificaciones esta semana:** ${Math.abs(weeklyChange)}\n**Promedio general:** ${data.averageRating} ⭐\n\n**Atracciones con mayor actividad reciente:**\n${data.attractions
        .filter(a => a.recent_ratings > 0)
        .sort((a, b) => b.recent_ratings - a.recent_ratings)
        .slice(0, 3)
        .map(a => `• ${a.attraction_name}: ${a.recent_ratings} nuevas calificaciones`)
        .join('\n')}\n\n💡 ${weeklyChange >= 0 ? 'Excelente momento para campañas de marketing.' : 'Considera implementar incentivos para aumentar la participación.'}`;
    }

    // Alertas y anomalías
    if (lowercaseCommand.includes('alerta') || lowercaseCommand.includes('problema') || lowercaseCommand.includes('anomal')) {
      if (data.anomalies.length === 0) {
        return `✅ **¡Excelentes noticias!**\n\nNo se detectaron anomalías críticas en los datos actuales. Todas las atracciones están funcionando dentro de parámetros normales.\n\n📊 **Resumen del estado:**\n• Promedio general: ${data.averageRating} ⭐\n• Total de calificaciones: ${data.totalRatings}\n• Atracciones monitoreadas: ${data.attractions.length}`;
      }

      const criticalAlerts = data.anomalies.filter(a => a.severity === 'high');
      const mediumAlerts = data.anomalies.filter(a => a.severity === 'medium');

      return `🚨 **Alertas Detectadas (${data.anomalies.length} total):**\n\n${criticalAlerts.length > 0 ? `**🔴 Críticas (${criticalAlerts.length}):**\n${criticalAlerts.map(alert => `• ${alert.message}`).join('\n')}\n\n` : ''}${mediumAlerts.length > 0 ? `**🟡 Moderadas (${mediumAlerts.length}):**\n${mediumAlerts.map(alert => `• ${alert.message}`).join('\n')}\n\n` : ''}⚡ **Acción inmediata requerida para alertas críticas.**`;
    }

    // Reporte completo
    if (lowercaseCommand.includes('reporte') || lowercaseCommand.includes('resumen') || lowercaseCommand.includes('completo')) {
      return `📊 **Reporte Ejecutivo Completo**\n\n**KPIs Principales:**\n• Promedio General: ${data.averageRating} ⭐\n• Total Calificaciones: ${data.totalRatings}\n• Tendencia Semanal: ${data.weeklyTrend >= 0 ? '+' : ''}${data.weeklyTrend}\n• Atracciones Activas: ${data.attractions.length}\n\n**Top 3 Performers:**\n${data.topPerformers.slice(0, 3).map((a, i) => `${i + 1}. ${a.attraction_name} (${a.average_rating}⭐)`).join('\n')}\n\n**Necesitan Atención:**\n${data.underPerformers.slice(0, 3).map((a, i) => `${i + 1}. ${a.attraction_name} (${a.average_rating}⭐)`).join('\n')}\n\n**Alertas:** ${data.anomalies.length} detectadas\n\n💼 Reporte generado el ${new Date().toLocaleDateString('es-ES')}`;
    }

    // Búsqueda específica de atracción
    const attraction = data.attractions.find(a => 
      lowercaseCommand.includes(a.attraction_name.toLowerCase())
    );
    
    if (attraction) {
      return `🗺️ **Análisis de ${attraction.attraction_name}:**\n\n⭐ **Calificación:** ${attraction.average_rating}/5\n👥 **Total calificaciones:** ${attraction.total_ratings}\n📅 **Esta semana:** ${attraction.recent_ratings} nuevas\n🏷️ **Categoría:** ${attraction.category}\n\n📈 **Rendimiento:**\n${attraction.average_rating >= 4 ? '🟢 Excelente rendimiento' : attraction.average_rating >= 3 ? '🟡 Rendimiento moderado' : '🔴 Necesita mejoras urgentes'}\n\n💡 **Recomendación:** ${attraction.average_rating >= 4 ? 'Mantener estándares actuales y usar como referencia.' : attraction.average_rating >= 3 ? 'Oportunidad de mejora con pequeños ajustes.' : 'Requiere plan de mejora inmediato.'}`;
    }

    // Comando no reconocido
    return `🤔 No entendí completamente tu consulta. Aquí tienes algunos ejemplos de lo que puedo hacer:\n\n📊 **Análisis disponibles:**\n• "mejores atracciones" - Top performers\n• "atracciones que necesitan mejora" - Underperformers\n• "tendencias de la semana" - Análisis temporal\n• "alertas activas" - Anomalías detectadas\n• "reporte completo" - Resumen ejecutivo\n• "análisis de [nombre atracción]" - Datos específicos\n\n¿Podrías reformular tu pregunta?`;
  };

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

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

    // Simulate AI processing delay
    setTimeout(() => {
      const response = processCommand(currentInput);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  }, [inputValue, data]);

  useEffect(() => {
    // Listen for external queries
    const handleSetChatQuery = (event: any) => {
      const query = event.detail.query;
      setInputValue(query);
      // Auto-send the query
      setTimeout(() => {
        handleSendMessage();
      }, 500);
    };

    window.addEventListener('setChatQuery', handleSetChatQuery);
    
    return () => {
      window.removeEventListener('setChatQuery', handleSetChatQuery);
    };
  }, [handleSendMessage]);

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Commands */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Comandos Rápidos
          </h4>
          <div className="flex flex-wrap gap-2">
            {quickCommands.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand(cmd.command)}
                className="text-xs"
              >
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
            <Badge variant="outline" className="ml-auto">
              En línea
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
                  <div className={`p-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`flex-1 ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
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
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-white border">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                placeholder="Escribe tu consulta aquí... ej: 'muéstrame las mejores atracciones'"
                className="flex-1"
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
              Presiona Enter para enviar • El asistente puede analizar datos, generar reportes y dar recomendaciones
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveChatAssistant;