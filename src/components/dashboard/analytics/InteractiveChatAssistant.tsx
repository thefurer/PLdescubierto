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
    const lowercaseCommand = command.toLowerCase().trim();

    // Saludos y respuestas conversacionales
    const greetings = ['hola', 'holas', 'hey', 'hi', 'buenos días', 'buenas tardes', 'buenas noches', 'que tal', 'qué tal', 'como estas', 'cómo estás', 'saludos'];
    const isGreeting = greetings.some(g => lowercaseCommand.includes(g) || lowercaseCommand === g);
    
    if (isGreeting) {
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
      return `👋 ¡${timeGreeting}! Soy tu asistente de análisis de calificaciones.\n\n` +
        `📊 **Resumen rápido del sistema:**\n` +
        `• Calificación promedio general: **${data.averageRating}⭐**\n` +
        `• Total de calificaciones: **${data.totalRatings}**\n` +
        `• Atracciones monitoreadas: **${data.attractions.length}**\n` +
        `• Alertas activas: **${data.anomalies.length}**\n\n` +
        `🎯 **¿Qué te gustaría saber?**\n` +
        `• "mejores atracciones" - Ver las mejor calificadas\n` +
        `• "atracciones con problemas" - Las que necesitan atención\n` +
        `• "tendencias" - Análisis de la semana\n` +
        `• "alertas" - Problemas detectados\n` +
        `• "reporte" - Resumen ejecutivo completo\n\n` +
        `También puedes preguntarme sobre una atracción específica por nombre.`;
    }

    // Preguntas sobre capacidades
    const helpQueries = ['que puedes hacer', 'qué puedes hacer', 'ayuda', 'help', 'opciones', 'comandos', 'funciones', 'que sabes', 'qué sabes'];
    const isHelpQuery = helpQueries.some(q => lowercaseCommand.includes(q));
    
    if (isHelpQuery) {
      return `🤖 **Soy tu asistente de analytics.** Puedo ayudarte con:\n\n` +
        `📈 **Análisis de rendimiento:**\n` +
        `• "mejores atracciones" - Top performers con estadísticas\n` +
        `• "atracciones que necesitan mejora" - Las de menor puntuación\n` +
        `• "análisis de [nombre]" - Datos específicos de cualquier atracción\n\n` +
        `📊 **Tendencias y reportes:**\n` +
        `• "tendencias de la semana" - Evolución reciente\n` +
        `• "reporte completo" - Resumen ejecutivo con KPIs\n` +
        `• "alertas activas" - Anomalías y problemas detectados\n\n` +
        `🎯 **Recomendaciones:**\n` +
        `• "recomendaciones" - Plan general de mejora\n` +
        `• "plan de mejora para [atracción]" - Plan detallado específico\n\n` +
        `💬 Puedes escribir en lenguaje natural, ¡te entiendo!`;
    }

    // Agradecimientos
    const thanksWords = ['gracias', 'thanks', 'genial', 'perfecto', 'excelente', 'ok', 'bien', 'entendido'];
    const isThanks = thanksWords.some(t => lowercaseCommand === t || (lowercaseCommand.length < 20 && lowercaseCommand.includes(t)));
    
    if (isThanks) {
      return `😊 ¡De nada! Estoy aquí para ayudarte.\n\n` +
        `**¿Algo más que quieras saber?**\n` +
        `• Análisis de alguna atracción específica\n` +
        `• Tendencias de calificaciones\n` +
        `• Alertas o problemas\n` +
        `• Generar un reporte`;
    }

    // Plan de mejora específico para una atracción
    if (lowercaseCommand.includes('plan de mejora detallado para') || lowercaseCommand.includes('necesito un plan de mejora') || lowercaseCommand.includes('plan de mejora para')) {
      // Extraer el nombre de la atracción de la consulta
      const attractionMatch = data.attractions.find(a => 
        lowercaseCommand.includes(a.attraction_name.toLowerCase())
      );
      
      if (attractionMatch) {
        const generateImprovementPlan = (attraction: AttractionRating) => {
          const rating = attraction.average_rating;
          const totalRatings = attraction.total_ratings;
          const recentRatings = attraction.recent_ratings;
          
          let priorityLevel = rating >= 4 ? 'mantenimiento' : rating >= 3 ? 'optimización' : 'urgente';
          
          return `🎯 **Plan de Mejora Detallado: ${attraction.attraction_name}**\n\n` +
            `📊 **Situación Actual:**\n` +
            `• Calificación promedio: ${rating}/5 estrellas\n` +
            `• Total de calificaciones: ${totalRatings}\n` +
            `• Actividad reciente: ${recentRatings} calificaciones esta semana\n` +
            `• Categoría: ${attraction.category}\n` +
            `• Nivel de prioridad: **${priorityLevel.toUpperCase()}**\n\n` +
            
            `🚀 **Recomendaciones Específicas:**\n\n` +
            
            `**1️⃣ Acciones Inmediatas (próximos 7 días):**\n` +
            `${rating < 3 ? 
              '• 🔍 Auditoría urgente: revisar limpieza, señalización y accesibilidad\n' +
              '• 👥 Reunión con personal para identificar problemas operativos\n' +
              '• 📝 Analizar cada comentario negativo y crear plan de acción\n' +
              '• 🛠️ Reparaciones menores urgentes (baños, senderos, mobiliario)\n'
              : rating < 4 ?
              '• 📋 Revisar procesos de atención al visitante\n' +
              '• 🧹 Mejorar protocolos de limpieza y mantenimiento\n' +
              '• 📍 Optimizar señalización y orientación\n' +
              '• 📱 Actualizar información en plataformas digitales\n'
              :
              '• ✅ Documentar mejores prácticas actuales\n' +
              '• 📊 Monitorear consistencia en el servicio\n' +
              '• 🎯 Identificar oportunidades de innovación\n' +
              '• 📈 Implementar sistema de feedback continuo\n'
            }` +
            
            `**2️⃣ Mejoras de Experiencia (próximas 2 semanas):**\n` +
            '• 🎨 Mejorar la primera impresión (entrada, recepción, bienvenida)\n' +
            '• 📚 Crear material informativo atractivo y fácil de entender\n' +
            '• 🕒 Optimizar tiempos de espera y flujo de visitantes\n' +
            '• 📸 Identificar y señalizar los mejores puntos para fotos\n' +
            '• 🎯 Implementar actividades interactivas o experienciales\n\n' +
            
            `**3️⃣ Estrategia Digital (próximo mes):**\n` +
            '• 📱 Actualizar fotos y descripción en plataformas online\n' +
            '• 💬 Responder proactivamente a todas las reseñas\n' +
            '• 🎥 Crear contenido visual (videos cortos, tours virtuales)\n' +
            '• 📧 Implementar follow-up por email para solicitar feedback\n' +
            '• 🏷️ Optimizar etiquetas y categorías para mejor visibilidad\n\n' +
            
            `**4️⃣ Monitoreo y Métricas:**\n` +
            `• 🎯 **Objetivo:** Alcanzar ${rating < 3 ? '3.5' : rating < 4 ? '4.2' : '4.7'}⭐ en 30 días\n` +
            `• 📈 **Meta de actividad:** ${Math.max(recentRatings * 2, 5)} calificaciones semanales\n` +
            '• 📊 Revisión semanal de métricas y feedback\n' +
            '• 🚨 Alertas automáticas por caídas en calificación\n' +
            '• 📝 Reporte mensual de progreso y ajustes\n\n' +
            
            `💡 **Consejo Clave:** ${
              rating < 3 ? 
                'Enfócate primero en resolver problemas básicos (limpieza, acceso, información). Una vez estabilizado, trabaja en la experiencia.' :
              rating < 4 ?
                'Tienes una base sólida. Ahora diferénciate con detalles que marquen la diferencia y creen momentos memorables.' :
                'Mantén la excelencia actual y conviértete en referencia. Usa tu éxito para elevar otras atracciones.'
            }\n\n` +
            
            `📞 **¿Necesitas ayuda específica?**\n` +
            `Pregúntame sobre: "checklist de limpieza", "ideas para ${attraction.category}", "respuestas a reseñas negativas", "estrategias de promoción"`
        };
        
        return generateImprovementPlan(attractionMatch);
      } else {
        // Si pidió un plan pero no especificó atracción
        const worst = data.underPerformers[0];
        if (worst) {
          return `📋 Puedo generar un plan de mejora para cualquier atracción.\n\n` +
            `**¿Para cuál lo necesitas?**\n\n` +
            `${data.attractions.slice(0, 5).map(a => `• "${a.attraction_name}" (${a.average_rating}⭐)`).join('\n')}\n\n` +
            `💡 **Sugerencia:** La atracción que más necesita atención es **${worst.attraction_name}** con ${worst.average_rating}⭐.\n\n` +
            `Escribe: "plan de mejora para ${worst.attraction_name}"`;
        }
      }
    }

    // Análisis de top performers
    if (lowercaseCommand.includes('mejor') || lowercaseCommand.includes('top') || lowercaseCommand.includes('destacad')) {
      const top3 = data.topPerformers.slice(0, 3);
      if (top3.length === 0) {
        return `📊 No hay suficientes datos para determinar las mejores atracciones todavía.\n\nNecesitamos más calificaciones para generar este análisis.`;
      }
      return `🏆 **Top ${top3.length} Atracciones Mejor Calificadas:**\n\n${top3.map((attraction, index) => 
        `${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} **${attraction.attraction_name}**\n   ⭐ ${attraction.average_rating}/5 (${attraction.total_ratings} calificaciones)\n   📈 ${attraction.recent_ratings} calificaciones esta semana\n   🏷️ ${attraction.category}`
      ).join('\n\n')}\n\n💡 **Insight:** Estas atracciones están funcionando excelentemente. Considera replicar sus mejores prácticas en otras áreas.\n\n¿Quieres un análisis detallado de alguna de ellas?`;
    }

    // Análisis de underperformers
    if (lowercaseCommand.includes('peor') || lowercaseCommand.includes('bajo') || lowercaseCommand.includes('necesita') || lowercaseCommand.includes('mejorar') || lowercaseCommand.includes('problema') || lowercaseCommand.includes('atencion') || lowercaseCommand.includes('atención')) {
      const bottom3 = data.underPerformers.slice(0, 3);
      if (bottom3.length === 0) {
        return `✅ ¡Excelentes noticias! Todas las atracciones tienen buenas calificaciones.\n\nNo hay ninguna que requiera atención urgente en este momento.`;
      }
      return `⚠️ **Atracciones que Necesitan Atención:**\n\n${bottom3.map((attraction, index) => 
        `${index + 1}. **${attraction.attraction_name}**\n   ⭐ ${attraction.average_rating}/5 (${attraction.total_ratings} calificaciones)\n   📉 ${attraction.recent_ratings} calificaciones esta semana\n   🏷️ ${attraction.category}`
      ).join('\n\n')}\n\n🚀 **Recomendaciones inmediatas:**\n• Revisar comentarios negativos recientes\n• Auditar operaciones y servicio al cliente\n• Capacitar al personal en puntos de fricción\n• Implementar mejoras rápidas visibles\n\n💡 **Tip:** Escribe "plan de mejora para ${bottom3[0]?.attraction_name}" para obtener un plan detallado.`;
    }

    // Análisis de tendencias
    if (lowercaseCommand.includes('tendencia') || lowercaseCommand.includes('evolución') || lowercaseCommand.includes('semana') || lowercaseCommand.includes('evolucion')) {
      const weeklyChange = data.weeklyTrend;
      const trend = weeklyChange >= 0 ? 'positiva' : 'negativa';
      const emoji = weeklyChange >= 0 ? '📈' : '📉';
      
      const activeAttractions = data.attractions.filter(a => a.recent_ratings > 0);
      
      return `${emoji} **Análisis de Tendencias Semanales:**\n\n` +
        `**📊 Métricas Generales:**\n` +
        `• Tendencia: **${trend.charAt(0).toUpperCase() + trend.slice(1)}** ${weeklyChange >= 0 ? '✅' : '⚠️'}\n` +
        `• Cambio semanal: ${weeklyChange >= 0 ? '+' : ''}${weeklyChange} calificaciones\n` +
        `• Promedio general: **${data.averageRating}⭐**\n` +
        `• Atracciones activas: ${activeAttractions.length}/${data.attractions.length}\n\n` +
        `**🔥 Mayor actividad esta semana:**\n${data.attractions
          .filter(a => a.recent_ratings > 0)
          .sort((a, b) => b.recent_ratings - a.recent_ratings)
          .slice(0, 3)
          .map((a, i) => `${i + 1}. ${a.attraction_name}: ${a.recent_ratings} nuevas calificaciones`)
          .join('\n') || 'No hay actividad reciente registrada'}\n\n` +
        `💡 **Recomendación:** ${weeklyChange >= 0 
          ? 'Excelente momento para campañas de marketing y promoción.' 
          : 'Considera implementar incentivos para aumentar la participación y revisar posibles causas de la caída.'}`;
    }

    // Alertas y anomalías
    if (lowercaseCommand.includes('alerta') || lowercaseCommand.includes('anomal') || lowercaseCommand.includes('crítico') || lowercaseCommand.includes('critico') || lowercaseCommand.includes('urgente')) {
      if (data.anomalies.length === 0) {
        return `✅ **¡Excelentes noticias!**\n\n` +
          `No se detectaron anomalías ni alertas críticas.\n\n` +
          `📊 **Estado del sistema:**\n` +
          `• Promedio general: ${data.averageRating}⭐\n` +
          `• Total de calificaciones: ${data.totalRatings}\n` +
          `• Atracciones monitoreadas: ${data.attractions.length}\n\n` +
          `Todo está funcionando dentro de parámetros normales. 🎉`;
      }

      const criticalAlerts = data.anomalies.filter(a => a.severity === 'high');
      const mediumAlerts = data.anomalies.filter(a => a.severity === 'medium');
      const lowAlerts = data.anomalies.filter(a => a.severity === 'low');

      return `🚨 **Panel de Alertas (${data.anomalies.length} detectadas):**\n\n` +
        `${criticalAlerts.length > 0 ? `**🔴 CRÍTICAS (${criticalAlerts.length}) - Acción inmediata:**\n${criticalAlerts.map(alert => `• ${alert.message}`).join('\n')}\n\n` : ''}` +
        `${mediumAlerts.length > 0 ? `**🟡 MODERADAS (${mediumAlerts.length}) - Revisar pronto:**\n${mediumAlerts.map(alert => `• ${alert.message}`).join('\n')}\n\n` : ''}` +
        `${lowAlerts.length > 0 ? `**🟢 MENORES (${lowAlerts.length}) - Monitorear:**\n${lowAlerts.map(alert => `• ${alert.message}`).join('\n')}\n\n` : ''}` +
        `⚡ **Próximos pasos:**\n` +
        `${criticalAlerts.length > 0 ? '1. Atender alertas críticas de inmediato\n' : ''}` +
        `2. Revisar tendencias de las últimas 24h\n` +
        `3. Contactar responsables de áreas afectadas`;
    }

    // Reporte completo
    if (lowercaseCommand.includes('reporte') || lowercaseCommand.includes('resumen') || lowercaseCommand.includes('completo') || lowercaseCommand.includes('ejecutivo')) {
      const topList = data.topPerformers.slice(0, 3);
      const bottomList = data.underPerformers.slice(0, 3);
      
      return `📊 **REPORTE EJECUTIVO COMPLETO**\n` +
        `_Generado: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `**📈 KPIs PRINCIPALES:**\n` +
        `• Promedio General: **${data.averageRating}⭐**\n` +
        `• Total Calificaciones: **${data.totalRatings}**\n` +
        `• Tendencia Semanal: **${data.weeklyTrend >= 0 ? '+' : ''}${data.weeklyTrend}** ${data.weeklyTrend >= 0 ? '✅' : '⚠️'}\n` +
        `• Atracciones Activas: **${data.attractions.length}**\n` +
        `• Alertas: **${data.anomalies.length}** ${data.anomalies.length === 0 ? '✅' : '⚠️'}\n\n` +
        `**🏆 TOP PERFORMERS:**\n${topList.length > 0 ? topList.map((a, i) => `${i + 1}. ${a.attraction_name} (${a.average_rating}⭐, ${a.total_ratings} votos)`).join('\n') : 'Sin datos suficientes'}\n\n` +
        `**⚠️ REQUIEREN ATENCIÓN:**\n${bottomList.length > 0 ? bottomList.map((a, i) => `${i + 1}. ${a.attraction_name} (${a.average_rating}⭐, ${a.total_ratings} votos)`).join('\n') : 'Todas las atracciones están bien'}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `💼 **CONCLUSIÓN:** ${data.averageRating >= 4 ? 'El rendimiento general es excelente.' : data.averageRating >= 3 ? 'Hay oportunidades de mejora en algunas áreas.' : 'Se requiere atención inmediata en varias atracciones.'}\n\n` +
        `¿Necesitas más detalles sobre alguna sección?`;
    }

    // Búsqueda específica de atracción
    const attraction = data.attractions.find(a => 
      lowercaseCommand.includes(a.attraction_name.toLowerCase())
    );
    
    if (attraction) {
      const performanceLevel = attraction.average_rating >= 4 ? '🟢 Excelente' : attraction.average_rating >= 3 ? '🟡 Moderado' : '🔴 Necesita mejoras';
      const trend = attraction.recent_ratings > 2 ? 'en aumento' : attraction.recent_ratings > 0 ? 'estable' : 'sin actividad reciente';
      
      return `🗺️ **Análisis Detallado: ${attraction.attraction_name}**\n\n` +
        `**📊 Métricas Principales:**\n` +
        `• Calificación: **${attraction.average_rating}/5** ⭐\n` +
        `• Total de votos: **${attraction.total_ratings}**\n` +
        `• Esta semana: **${attraction.recent_ratings}** nuevas calificaciones\n` +
        `• Categoría: **${attraction.category}**\n\n` +
        `**📈 Rendimiento:**\n` +
        `• Estado: ${performanceLevel}\n` +
        `• Tendencia: ${trend}\n\n` +
        `**💡 Recomendación:**\n${
          attraction.average_rating >= 4 
            ? '✅ Mantener estándares actuales. Usar como referencia para otras atracciones.' 
            : attraction.average_rating >= 3 
              ? '📋 Oportunidad de mejora con ajustes menores. Revisar feedback reciente.' 
              : '⚠️ Requiere plan de mejora inmediato. Escribe "plan de mejora para ' + attraction.attraction_name + '" para obtener recomendaciones detalladas.'
        }\n\n` +
        `¿Quieres ver el historial de calificaciones o generar un plan de mejora?`;
    }

    // Recomendaciones generales
    if (lowercaseCommand.includes('recomend') || lowercaseCommand.includes('sugerencia') || lowercaseCommand.includes('idea')) {
      const worst = data.underPerformers[0] || [...data.attractions].sort((a,b)=>a.average_rating-b.average_rating)[0];
      const best = data.topPerformers[0] || [...data.attractions].sort((a,b)=>b.average_rating-a.average_rating)[0];
      const inactivas = data.attractions.filter(a => a.recent_ratings === 0).slice(0, 2);

      return `📌 **Plan de Recomendaciones Programado**\n\n` +
        `**1️⃣ Acciones Rápidas (72h):**\n` +
        `• Auditar puntos de fricción de ${worst?.attraction_name || 'la atracción con menor puntuación'}\n` +
        `• Responder públicamente reseñas negativas recientes\n` +
        `• Actualizar fotos y descripción de atracciones principales\n\n` +
        `**2️⃣ Contenido y Visibilidad:**\n` +
        `• Replicar mejores prácticas de ${best?.attraction_name || 'las mejores atracciones'}\n` +
        `• Crear sección de "Consejos del visitante"\n` +
        `• Campaña para incentivar nuevas reseñas\n\n` +
        `**3️⃣ Experiencia y Servicio:**\n` +
        `• Mejorar señalética en puntos críticos\n` +
        `• Capacitar personal en atención al cliente\n` +
        `• Ajustes rápidos basados en feedback\n\n` +
        `**4️⃣ Tráfico y Participación:**\n` +
        `• Promocionar atracciones con baja actividad: ${inactivas.map(a=>a.attraction_name).join(', ') || 'revisar métricas'}\n` +
        `• Promoción cruzada en secciones populares\n\n` +
        `**🎯 Objetivos a 30 días:**\n` +
        `• +20% en calificaciones totales\n` +
        `• +0.3⭐ en ${worst?.attraction_name || 'atracción objetivo'}\n\n` +
        `¿Quieres un checklist detallado para alguna área específica?`;
    }

    // Fallback mejorado - más amigable y útil
    return `🤔 Hmm, no estoy seguro de entender "${command}".\n\n` +
      `**¿Quizás quisiste decir?**\n` +
      `• "mejores atracciones" - Ver las más destacadas\n` +
      `• "atracciones con problemas" - Las que necesitan atención\n` +
      `• "tendencias" - Análisis de la semana\n` +
      `• "alertas" - Problemas detectados\n` +
      `• "reporte" - Resumen ejecutivo\n\n` +
      `También puedes preguntarme sobre cualquier atracción por nombre.\n\n` +
      `💡 **Tip:** Escribe "ayuda" para ver todas mis capacidades.`;
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