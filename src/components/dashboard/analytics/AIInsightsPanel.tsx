import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, TrendingUp, AlertTriangle, Target, 
  Award, Users, MapPin, Calendar, ArrowUp, ArrowDown
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

interface AIInsightsPanelProps {
  data: AnalyticsData;
}

const AIInsightsPanel = ({ data }: AIInsightsPanelProps) => {
  // Generate AI-powered insights
  const generateInsights = () => {
    const insights = [];

    // Performance Analysis
    if (data.averageRating >= 4.0) {
      insights.push({
        type: 'success',
        icon: Award,
        title: 'Excelente Desempeño General',
        message: `Tu promedio de ${data.averageRating} estrellas indica una alta satisfacción del visitante. ¡Mantén el buen trabajo!`,
        action: 'Considera destacar las mejores reseñas en marketing',
        priority: 'high'
      });
    } else if (data.averageRating < 3.0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Oportunidad de Mejora',
        message: `El promedio de ${data.averageRating} estrellas sugiere áreas de mejora importantes.`,
        action: 'Análisis profundo de comentarios y plan de mejora urgente',
        priority: 'critical'
      });
    }

    // Volume Analysis
    const totalVisitors = data.totalRatings;
    if (totalVisitors < 50) {
      insights.push({
        type: 'info',
        icon: Users,
        title: 'Aumentar Participación',
        message: 'El volumen de calificaciones es bajo. Más feedback ayudará a mejorar la credibilidad.',
        action: 'Implementar campañas de incentivos para calificar',
        priority: 'medium'
      });
    }

    // Category Performance
    const categoryPerformance = analyzeCategoryPerformance(data.attractions);
    const bestCategory = categoryPerformance.reduce((prev, curr) => 
      prev.averageRating > curr.averageRating ? prev : curr
    );
    const worstCategory = categoryPerformance.reduce((prev, curr) => 
      prev.averageRating < curr.averageRating ? prev : curr
    );

    insights.push({
      type: 'info',
      icon: Target,
      title: 'Análisis por Categoría',
      message: `${bestCategory.category} lidera con ${bestCategory.averageRating.toFixed(1)} estrellas, mientras que ${worstCategory.category} necesita atención (${worstCategory.averageRating.toFixed(1)} estrellas).`,
      action: `Aplicar mejores prácticas de ${bestCategory.category} a ${worstCategory.category}`,
      priority: 'medium'
    });

    // Seasonal Trends
    const trendAnalysis = analyzeTrends(data.attractions);
    if (trendAnalysis.isGrowing) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Tendencia Positiva Detectada',
        message: 'Las calificaciones muestran una tendencia ascendente en las últimas semanas.',
        action: 'Capitalizar el momento con promociones especiales',
        priority: 'medium'
      });
    } else if (trendAnalysis.isDecreasing) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Tendencia Descendente',
        message: 'Se detecta una disminución en las calificaciones recientes.',
        action: 'Investigar causas y tomar medidas correctivas inmediatas',
        priority: 'high'
      });
    }

    // Underperformer Recommendations
    if (data.underPerformers.length > 0) {
      const worst = data.underPerformers[0];
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Atención Prioritaria Requerida',
        message: `${worst.attraction_name} necesita intervención urgente (${worst.average_rating} estrellas).`,
        action: generateSpecificRecommendations(worst),
        priority: 'critical'
      });
    }

    // Activity Insights
    const inactiveAttractions = data.attractions.filter(a => a.recent_ratings === 0);
    if (inactiveAttractions.length > 0) {
      insights.push({
        type: 'info',
        icon: Calendar,
        title: 'Atracciones Sin Actividad Reciente',
        message: `${inactiveAttractions.length} atracciones no han recibido calificaciones en la última semana.`,
        action: 'Campañas dirigidas para reavivar interés',
        priority: 'medium'
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  };

  const analyzeCategoryPerformance = (attractions: AttractionRating[]) => {
    const categories = attractions.reduce((acc: any, attraction) => {
      if (!acc[attraction.category]) {
        acc[attraction.category] = { total: 0, sum: 0, count: 0 };
      }
      acc[attraction.category].sum += attraction.average_rating * attraction.total_ratings;
      acc[attraction.category].total += attraction.total_ratings;
      acc[attraction.category].count += 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([category, data]: [string, any]) => ({
      category,
      averageRating: data.total > 0 ? data.sum / data.total : 0,
      attractionCount: data.count
    }));
  };

  const analyzeTrends = (attractions: AttractionRating[]) => {
    // Simplified trend analysis
    const recentActivity = attractions.reduce((sum, a) => sum + a.recent_ratings, 0);
    const totalActivity = attractions.reduce((sum, a) => sum + a.total_ratings, 0);
    
    const recentPercentage = totalActivity > 0 ? recentActivity / totalActivity : 0;
    
    return {
      isGrowing: recentPercentage > 0.3, // More than 30% of ratings are recent
      isDecreasing: recentPercentage < 0.1, // Less than 10% of ratings are recent
      percentage: recentPercentage
    };
  };

  const generateSpecificRecommendations = (attraction: AttractionRating) => {
    const recommendations = [];
    
    if (attraction.average_rating < 2) {
      recommendations.push('Revisión inmediata de operaciones');
      recommendations.push('Capacitación urgente del personal');
      recommendations.push('Mejoras en infraestructura');
    } else if (attraction.average_rating < 3) {
      recommendations.push('Análisis de comentarios negativos');
      recommendations.push('Mejoras en servicio al cliente');
      recommendations.push('Actualización de facilidades');
    }
    
    if (attraction.total_ratings < 10) {
      recommendations.push('Campaña de promoción específica');
    }
    
    return recommendations.join(', ');
  };

  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const insights = generateInsights();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Puntuación IA</p>
                <p className="text-2xl font-bold">{Math.round(data.averageRating * 20)}%</p>
                <p className="text-xs text-muted-foreground">Satisfacción general</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tendencia</p>
                <div className="flex items-center gap-2">
                  {data.weeklyTrend >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <p className="text-lg font-bold">{data.weeklyTrend >= 0 ? 'Positiva' : 'Negativa'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alertas Activas</p>
                <p className="text-2xl font-bold">{data.anomalies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <insight.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge variant={getBadgeVariant(insight.priority)} className="mt-1">
                      {insight.priority === 'critical' ? 'Crítico' :
                       insight.priority === 'high' ? 'Alto' :
                       insight.priority === 'medium' ? 'Medio' : 'Bajo'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{insight.message}</p>
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-slate-700">💡 Acción Recomendada:</p>
                <p className="text-sm text-slate-600 mt-1">{insight.action}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top and Bottom Performers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">🏆 Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topPerformers.map((attraction, index) => (
              <div key={attraction.attraction_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{attraction.attraction_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {attraction.total_ratings} calificaciones
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{attraction.average_rating} ⭐</p>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">⚠️ Necesitan Atención</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.underPerformers.map((attraction, index) => (
              <div key={attraction.attraction_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{attraction.attraction_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {attraction.total_ratings} calificaciones
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-700">{attraction.average_rating} ⭐</p>
                  <Button size="sm" variant="outline" className="text-xs mt-1">
                    Ver Plan de Mejora
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInsightsPanel;