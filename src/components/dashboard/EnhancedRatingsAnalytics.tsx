import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, Users, MapPin, Download, MessageSquare, AlertTriangle, Lightbulb, BarChart3, LineChart, Radar, Filter, Calendar, Send, Bot, User } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import RatingsChartsGrid from "./analytics/RatingsChartsGrid";
import AIInsightsPanel from "./analytics/AIInsightsPanel";
import PatternDetector from "./analytics/PatternDetector";
import InteractiveChatAssistant from "./analytics/InteractiveChatAssistant";
interface AttractionRating {
  attraction_id: string;
  attraction_name: string;
  average_rating: number;
  total_ratings: number;
  recent_ratings: number;
  rating_history: Array<{
    date: string;
    rating: number;
    count: number;
  }>;
  category: string;
}
interface AnalyticsData {
  attractions: AttractionRating[];
  totalRatings: number;
  averageRating: number;
  weeklyTrend: number;
  topPerformers: AttractionRating[];
  underPerformers: AttractionRating[];
  anomalies: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}
export const EnhancedRatingsAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [selectedAttraction, setSelectedAttraction] = useState("all");
  const [activeView, setActiveView] = useState("overview");
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedAttraction]);
  useEffect(() => {
    // Listen for pattern button clicks to open chat
    const handleOpenChatWithQuery = (event: any) => {
      setActiveView('chat');
      // We'll pass the query to the chat component via a ref or state
      setTimeout(() => {
        const chatEvent = new CustomEvent('setChatQuery', {
          detail: {
            query: event.detail.query
          }
        });
        window.dispatchEvent(chatEvent);
      }, 100);
    };
    window.addEventListener('openChatWithQuery', handleOpenChatWithQuery);
    return () => {
      window.removeEventListener('openChatWithQuery', handleOpenChatWithQuery);
    };
  }, []);
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch ratings data with historical information
      const {
        data: ratingsQuery,
        error: ratingsError
      } = await supabase.from('attraction_ratings_public').select(`
          attraction_id,
          rating,
          created_at,
          tourist_attractions!inner(name, category)
        `).gte('created_at', new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString());
      if (ratingsError) throw ratingsError;

      // Process data for analytics
      const processedData = processAnalyticsData(ratingsQuery);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de análisis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const processAnalyticsData = (rawData: any[]): AnalyticsData => {
    const attractionsMap = new Map<string, any>();
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Process raw data
    rawData?.forEach((rating: any) => {
      const attractionId = rating.attraction_id;
      const attractionName = rating.tourist_attractions.name;
      const category = rating.tourist_attractions.category;
      const ratingValue = rating.rating;
      const createdAt = new Date(rating.created_at);
      if (!attractionsMap.has(attractionId)) {
        attractionsMap.set(attractionId, {
          attraction_id: attractionId,
          attraction_name: attractionName,
          category: category,
          ratings: [],
          rating_history: [],
          recent_count: 0
        });
      }
      const data = attractionsMap.get(attractionId)!;
      data.ratings.push({
        value: ratingValue,
        date: createdAt
      });
      if (createdAt >= lastWeek) {
        data.recent_count++;
      }
    });

    // Calculate statistics and detect patterns
    const attractions: AttractionRating[] = Array.from(attractionsMap.values()).map(data => {
      const ratings = data.ratings.map((r: any) => r.value);
      const average = ratings.length > 0 ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length : 0;

      // Group by date for history
      const historyMap = new Map();
      data.ratings.forEach((r: any) => {
        const dateKey = r.date.toISOString().split('T')[0];
        if (!historyMap.has(dateKey)) {
          historyMap.set(dateKey, {
            total: 0,
            count: 0
          });
        }
        const dayData = historyMap.get(dateKey);
        dayData.total += r.value;
        dayData.count += 1;
      });
      const rating_history = Array.from(historyMap.entries()).map(([date, data]: [string, any]) => ({
        date,
        rating: data.total / data.count,
        count: data.count
      }));
      return {
        attraction_id: data.attraction_id,
        attraction_name: data.attraction_name,
        category: data.category,
        average_rating: Math.round(average * 10) / 10,
        total_ratings: ratings.length,
        recent_ratings: data.recent_count,
        rating_history: rating_history.sort((a, b) => a.date.localeCompare(b.date))
      };
    });

    // Calculate overall statistics
    const totalRatings = attractions.reduce((sum, a) => sum + a.total_ratings, 0);
    const weightedAverage = attractions.reduce((sum, a) => sum + a.average_rating * a.total_ratings, 0) / totalRatings;
    const averageRating = totalRatings > 0 ? Math.round(weightedAverage * 10) / 10 : 0;

    // Identify top and underperformers
    const sortedByRating = [...attractions].sort((a, b) => b.average_rating - a.average_rating);
    const topPerformers = sortedByRating.slice(0, 3);
    const underPerformers = sortedByRating.slice(-3).reverse();

    // Detect anomalies
    const anomalies = detectAnomalies(attractions);

    // Calculate weekly trend (simplified)
    const weeklyTrend = attractions.reduce((sum, a) => sum + a.recent_ratings, 0);
    return {
      attractions,
      totalRatings,
      averageRating,
      weeklyTrend,
      topPerformers,
      underPerformers,
      anomalies
    };
  };
  const detectAnomalies = (attractions: AttractionRating[]) => {
    const anomalies = [];
    attractions.forEach(attraction => {
      // Detect low ratings
      if (attraction.average_rating < 2.5 && attraction.total_ratings > 5) {
        anomalies.push({
          type: 'low_rating',
          message: `${attraction.attraction_name} tiene una calificación muy baja (${attraction.average_rating})`,
          severity: 'high' as const
        });
      }

      // Detect no recent activity
      if (attraction.recent_ratings === 0 && attraction.total_ratings > 0) {
        anomalies.push({
          type: 'no_activity',
          message: `${attraction.attraction_name} no ha recibido calificaciones recientes`,
          severity: 'medium' as const
        });
      }

      // Detect rating drops (simplified check)
      if (attraction.rating_history.length > 1) {
        const recent = attraction.rating_history.slice(-3);
        const older = attraction.rating_history.slice(0, -3);
        if (recent.length > 0 && older.length > 0) {
          const recentAvg = recent.reduce((sum, r) => sum + r.rating, 0) / recent.length;
          const olderAvg = older.reduce((sum, r) => sum + r.rating, 0) / older.length;
          if (olderAvg - recentAvg > 1) {
            anomalies.push({
              type: 'rating_drop',
              message: `${attraction.attraction_name} ha experimentado una caída en calificaciones`,
              severity: 'high' as const
            });
          }
        }
      }
    });
    return anomalies;
  };
  const exportAnalyticsReport = () => {
    if (!analyticsData) return;

    // 1) Encabezado y resumen
    const rows: (string | number)[][] = [];
    const today = new Date();
    rows.push(['REPORTE ANALÍTICO DE CALIFICACIONES']);
    rows.push(['Fecha:', today.toLocaleDateString('es-ES')]);
    rows.push(['Período:', `Últimos ${dateRange} días`]);
    rows.push([]);

    rows.push(['RESUMEN EJECUTIVO']);
    rows.push(['Promedio General', analyticsData.averageRating.toString()]);
    rows.push(['Total de Calificaciones', analyticsData.totalRatings.toString()]);
    rows.push(['Calificaciones esta semana', analyticsData.weeklyTrend.toString()]);
    rows.push([]);

    // 2) Recomendaciones de IA (basadas en top/under y anomalías)
    rows.push(['RECOMENDACIONES DE MEJORA']);
    analyticsData.topPerformers.forEach((a) => {
      rows.push([`Mantener impulso:`, `${a.attraction_name} (⭐ ${a.average_rating})`, 'Refuerza promoción y comparte testimonios.']);
    });
    analyticsData.underPerformers.forEach((a) => {
      rows.push([`Plan de mejora:`, `${a.attraction_name} (⭐ ${a.average_rating})`, 'Revisa horarios, guías y señalización; incentiva reseñas.']);
    });
    analyticsData.anomalies.forEach((an) => {
      rows.push([`Alerta (${an.severity})`, an.type, an.message]);
    });
    rows.push([]);

    // 3) Tabla detallada por atracción
    rows.push(['DETALLE POR ATRACCIÓN']);
    rows.push(['Atracción', 'Categoría', 'Promedio', 'Total', 'Recientes (7d)', 'Tendencia (últ.7 vs prev.7)']);

    const calcTrend = (history: { date: string; rating: number; count: number }[]) => {
      if (!history || history.length === 0) return '0';
      const dates = history.map((h) => new Date(h.date)).sort((a, b) => a.getTime() - b.getTime());
      const lastDate = dates[dates.length - 1];
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      const last7Start = new Date(lastDate.getTime() - weekMs);
      const prev7Start = new Date(last7Start.getTime() - weekMs);

      const last7 = history.filter((h) => new Date(h.date) > last7Start);
      const prev7 = history.filter((h) => new Date(h.date) > prev7Start && new Date(h.date) <= last7Start);

      const avg = (arr: typeof history) => (arr.length ? arr.reduce((s, x) => s + x.rating, 0) / arr.length : 0);
      const diff = avg(last7) - avg(prev7);
      return diff.toFixed(2);
    };

    analyticsData.attractions.forEach((a) => {
      rows.push([
        a.attraction_name,
        a.category,
        a.average_rating.toFixed(1),
        a.total_ratings,
        a.recent_ratings,
        calcTrend(a.rating_history)
      ]);
    });
    rows.push([]);

    // 4) Datos de series para gráficos (formato ancho)
    rows.push(['DATOS PARA GRÁFICOS (copiar y crear gráficos en Excel)']);
    // Reunir todas las fechas únicas
    const allDatesSet = new Set<string>();
    analyticsData.attractions.forEach((a) => a.rating_history.forEach((h) => allDatesSet.add(h.date)));
    const allDates = Array.from(allDatesSet).sort((a, b) => a.localeCompare(b));

    // Encabezados: Fecha + una columna por atracción
    rows.push(['Fecha', ...analyticsData.attractions.map((a) => a.attraction_name)]);

    allDates.forEach((date) => {
      const row: (string | number)[] = [date];
      analyticsData.attractions.forEach((a) => {
        const found = a.rating_history.find((h) => h.date === date);
        row.push(found ? Number(found.rating.toFixed(2)) : '');
      });
      rows.push(row);
    });

    // 5) Guía rápida para gráficos
    rows.push([]);
    rows.push(['GUÍA RÁPIDA']);
    rows.push(['1) Selecciona el bloque "DATOS PARA GRÁFICOS" y crea un gráfico de líneas para ver la evolución.']);
    rows.push(['2) Usa la tabla "DETALLE POR ATRACCIÓN" para gráficos de barras comparativos.']);
    rows.push(['3) Prioriza acciones con base en las RECOMENDACIONES DE MEJORA.']);

    // Construcción del CSV
    const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-report-${today.toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({ title: 'Reporte Exportado', description: 'El CSV incluye datos listos para crear gráficos y recomendaciones.' });
  };
  if (loading) {
    return <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>;
  }
  if (!analyticsData) return null;
  return <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Análisis Inteligente de Calificaciones</h2>
        </div>
        
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportAnalyticsReport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Anomalies Alert */}
      {analyticsData.anomalies.length > 0 && <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-1" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Anomalías Detectadas</h4>
                <ul className="space-y-1">
                  {analyticsData.anomalies.map((anomaly, index) => <li key={index} className="text-sm text-amber-700">
                      • {anomaly.message}
                    </li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>}

      {/* Main Analytics Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-200">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vista General
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights IA
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Asistente IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Promedio General</p>
                    <p className="text-2xl font-bold">{analyticsData.averageRating}</p>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.weeklyTrend > 0 ? '+' : ''}{analyticsData.weeklyTrend} esta semana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Calificaciones</p>
                    <p className="text-2xl font-bold">{analyticsData.totalRatings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Top Performer</p>
                    <p className="text-lg font-bold">{analyticsData.topPerformers[0]?.attraction_name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">
                      {analyticsData.topPerformers[0]?.average_rating || 0} ⭐
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Anomalías</p>
                    <p className="text-2xl font-bold">{analyticsData.anomalies.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <PatternDetector data={analyticsData} />
        </TabsContent>

        <TabsContent value="charts">
          <RatingsChartsGrid data={analyticsData} />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsPanel data={analyticsData} />
        </TabsContent>

        <TabsContent value="chat">
          <InteractiveChatAssistant data={analyticsData} />
        </TabsContent>
      </Tabs>
    </div>;
};