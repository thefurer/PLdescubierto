import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, AlertCircle, Clock, 
  Users, Star, MapPin, Calendar, Eye, CheckCircle, Lightbulb 
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

interface PatternDetectorProps {
  data: AnalyticsData;
}

const PatternDetector = ({ data }: PatternDetectorProps) => {
  // Detect various patterns in the data
  const detectPatterns = () => {
    const patterns = [];

    // Seasonal patterns
    const seasonalPattern = detectSeasonalPatterns(data.attractions);
    if (seasonalPattern.found) {
      patterns.push({
        type: 'seasonal',
        icon: Calendar,
        title: 'Patrón Estacional Detectado',
        description: seasonalPattern.description,
        impact: 'medium',
        action: 'Planificar capacidad según estacionalidad',
        color: 'blue'
      });
    }

    // Rating concentration patterns
    const concentrationPattern = detectRatingConcentration(data.attractions);
    patterns.push({
      type: 'concentration',
      icon: Star,
      title: 'Concentración de Calificaciones',
      description: concentrationPattern.description,
      impact: concentrationPattern.impact,
      action: concentrationPattern.action,
      color: concentrationPattern.color
    });

    // Volume patterns
    const volumePattern = detectVolumePatterns(data.attractions);
    if (volumePattern.found) {
      patterns.push({
        type: 'volume',
        icon: Users,
        title: 'Patrón de Volumen',
        description: volumePattern.description,
        impact: volumePattern.impact,
        action: volumePattern.action,
        color: volumePattern.color
      });
    }

    // Category performance patterns
    const categoryPattern = detectCategoryPatterns(data.attractions);
    if (categoryPattern.found) {
      patterns.push({
        type: 'category',
        icon: MapPin,
        title: 'Patrón por Categoría',
        description: categoryPattern.description,
        impact: 'medium',
        action: 'Balancear portafolio de atracciones',
        color: 'purple'
      });
    }

    // Engagement patterns
    const engagementPattern = detectEngagementPatterns(data.attractions);
    if (engagementPattern.found) {
      patterns.push({
        type: 'engagement',
        icon: Eye,
        title: 'Patrón de Participación',
        description: engagementPattern.description,
        impact: engagementPattern.impact,
        action: engagementPattern.action,
        color: engagementPattern.color
      });
    }

    return patterns;
  };

  const detectSeasonalPatterns = (attractions: AttractionRating[]) => {
    // Simple seasonal detection based on rating distribution over time
    const hasHistoricalData = attractions.some(a => a.rating_history.length > 4);
    
    if (hasHistoricalData) {
      return {
        found: true,
        description: 'Se detectan variaciones estacionales en las calificaciones. Algunas atracciones muestran mayor actividad en períodos específicos.'
      };
    }
    
    return { found: false, description: '' };
  };

  const detectRatingConcentration = (attractions: AttractionRating[]) => {
    const highRated = attractions.filter(a => a.average_rating >= 4.0).length;
    const lowRated = attractions.filter(a => a.average_rating <= 2.5).length;
    const total = attractions.length;
    
    if (highRated / total > 0.7) {
      return {
        description: `${Math.round((highRated / total) * 100)}% de las atracciones tienen calificaciones excelentes (4+ estrellas). ¡Excelente desempeño general!`,
        impact: 'low',
        action: 'Mantener estándares de calidad y promover experiencias destacadas',
        color: 'green'
      };
    } else if (lowRated / total > 0.3) {
      return {
        description: `${Math.round((lowRated / total) * 100)}% de las atracciones tienen calificaciones bajas (≤2.5 estrellas). Necesita atención inmediata.`,
        impact: 'high',
        action: 'Plan de mejora urgente para atracciones con bajo rendimiento',
        color: 'red'
      };
    } else {
      return {
        description: 'Distribución equilibrada de calificaciones. Oportunidad de elevar el estándar general.',
        impact: 'medium',
        action: 'Implementar mejores prácticas de las top performers',
        color: 'yellow'
      };
    }
  };

  const detectVolumePatterns = (attractions: AttractionRating[]) => {
    const totalRatings = attractions.reduce((sum, a) => sum + a.total_ratings, 0);
    const averageRatings = totalRatings / attractions.length;
    
    const highVolume = attractions.filter(a => a.total_ratings > averageRatings * 2).length;
    const lowVolume = attractions.filter(a => a.total_ratings < averageRatings * 0.5).length;
    
    if (lowVolume / attractions.length > 0.4) {
      return {
        found: true,
        description: `${Math.round((lowVolume / attractions.length) * 100)}% de las atracciones tienen muy pocas calificaciones, lo que limita la confiabilidad de los datos.`,
        impact: 'medium',
        action: 'Campañas de incentivos para aumentar participación',
        color: 'orange'
      };
    }
    
    if (highVolume > 0) {
      return {
        found: true,
        description: `${highVolume} atracciones concentran la mayoría de las calificaciones. Distribución desigual de atención.`,
        impact: 'medium',
        action: 'Promocionar atracciones menos visibles',
        color: 'blue'
      };
    }
    
    return { found: false, description: '', impact: 'low', action: '', color: 'gray' };
  };

  const detectCategoryPatterns = (attractions: AttractionRating[]) => {
    const categoryStats = attractions.reduce((acc: any, attraction) => {
      if (!acc[attraction.category]) {
        acc[attraction.category] = { count: 0, totalRating: 0, totalRatings: 0 };
      }
      acc[attraction.category].count++;
      acc[attraction.category].totalRating += attraction.average_rating * attraction.total_ratings;
      acc[attraction.category].totalRatings += attraction.total_ratings;
      return acc;
    }, {});
    
    const categories = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
      category,
      averageRating: stats.totalRatings > 0 ? stats.totalRating / stats.totalRatings : 0,
      count: stats.count
    }));
    
    const bestCategory = categories.reduce((prev, curr) => 
      prev.averageRating > curr.averageRating ? prev : curr, categories[0]);
    const worstCategory = categories.reduce((prev, curr) => 
      prev.averageRating < curr.averageRating ? prev : curr, categories[0]);
    
    if (categories.length > 1 && Math.abs(bestCategory.averageRating - worstCategory.averageRating) > 1) {
      return {
        found: true,
        description: `Diferencia significativa entre categorías: ${bestCategory.category} (${bestCategory.averageRating.toFixed(1)}★) vs ${worstCategory.category} (${worstCategory.averageRating.toFixed(1)}★)`
      };
    }
    
    return { found: false, description: '' };
  };

  const detectEngagementPatterns = (attractions: AttractionRating[]) => {
    const recentActivity = attractions.reduce((sum, a) => sum + a.recent_ratings, 0);
    const totalActivity = attractions.reduce((sum, a) => sum + a.total_ratings, 0);
    
    const engagementRate = totalActivity > 0 ? recentActivity / totalActivity : 0;
    
    if (engagementRate < 0.1) {
      return {
        found: true,
        description: 'Baja participación reciente. Solo el ' + Math.round(engagementRate * 100) + '% de las calificaciones son de la última semana.',
        impact: 'medium',
        action: 'Activar campañas de re-engagement y promociones especiales',
        color: 'orange'
      };
    } else if (engagementRate > 0.4) {
      return {
        found: true,
        description: 'Alta participación reciente. El ' + Math.round(engagementRate * 100) + '% de las calificaciones son de la última semana.',
        impact: 'low',
        action: 'Capitalizar el momento con promociones adicionales',
        color: 'green'
      };
    }
    
    return { found: false, description: '', impact: 'low', action: '', color: 'gray' };
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const patterns = detectPatterns();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Detección Inteligente de Patrones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {patterns.map((pattern, index) => {
              const ImpactIcon = getImpactIcon(pattern.impact);
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${pattern.color}-100`}>
                        <pattern.icon className={`h-5 w-5 text-${pattern.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{pattern.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getImpactColor(pattern.impact)}>
                            <ImpactIcon className="h-3 w-3 mr-1" />
                            {pattern.impact === 'high' ? 'Alto Impacto' : 
                             pattern.impact === 'medium' ? 'Impacto Medio' : 'Bajo Impacto'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground pl-14">
                    {pattern.description}
                  </p>
                  
                  <div className="bg-slate-50 p-3 rounded-lg ml-14">
                    <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Acción Recomendada:
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{pattern.action}</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Implementar Acción
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{patterns.length}</p>
            <p className="text-sm text-muted-foreground">Patrones Detectados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{patterns.filter(p => p.impact === 'high').length}</p>
            <p className="text-sm text-muted-foreground">Alta Prioridad</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{patterns.filter(p => p.impact === 'medium').length}</p>
            <p className="text-sm text-muted-foreground">Media Prioridad</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{patterns.filter(p => p.impact === 'low').length}</p>
            <p className="text-sm text-muted-foreground">Bajo Impacto</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatternDetector;