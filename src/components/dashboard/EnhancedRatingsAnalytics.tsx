import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, Users, Download, MessageSquare, AlertTriangle, BarChart3, Bot } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import RatingsChartsGrid from "./analytics/RatingsChartsGrid";
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

    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate styled HTML report
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Analítico - Puerto López Descubierto</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #1a1a2e; 
      padding: 40px;
      background: #f8fafc;
    }
    .report-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .header .date { 
      margin-top: 15px; 
      padding: 8px 20px; 
      background: rgba(255,255,255,0.2); 
      border-radius: 20px; 
      display: inline-block;
      font-size: 13px;
    }
    .content { padding: 40px; }
    .section { margin-bottom: 35px; }
    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 600;
      color: #0c4a6e;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .section-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #0284c7, #0ea5e9);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }
    .kpi-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .kpi-card.gold { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-color: #fcd34d; }
    .kpi-card.green { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-color: #86efac; }
    .kpi-card.red { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-color: #fca5a5; }
    .kpi-value { font-size: 32px; font-weight: 700; color: #0c4a6e; }
    .kpi-label { font-size: 12px; color: #64748b; margin-top: 5px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: linear-gradient(135deg, #0c4a6e, #0284c7);
      color: white;
      padding: 14px 12px;
      text-align: left;
      font-weight: 600;
    }
    th:first-child { border-radius: 8px 0 0 0; }
    th:last-child { border-radius: 0 8px 0 0; }
    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) { background: #f8fafc; }
    tr:hover { background: #f0f9ff; }
    .rating-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 12px;
    }
    .rating-high { background: #dcfce7; color: #166534; }
    .rating-medium { background: #fef3c7; color: #92400e; }
    .rating-low { background: #fee2e2; color: #991b1b; }
    .recommendation-card {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 15px 20px;
      margin-bottom: 12px;
      border-radius: 0 8px 8px 0;
    }
    .recommendation-card.warning {
      background: #fffbeb;
      border-left-color: #f59e0b;
    }
    .recommendation-card.danger {
      background: #fef2f2;
      border-left-color: #ef4444;
    }
    .recommendation-title { font-weight: 600; color: #1e293b; margin-bottom: 4px; }
    .recommendation-text { font-size: 13px; color: #64748b; }
    .footer {
      background: #f1f5f9;
      padding: 25px 40px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .star { color: #fbbf24; }
    @media print {
      body { padding: 0; background: white; }
      .report-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <h1>📊 Reporte Analítico de Calificaciones</h1>
      <p>Puerto López Descubierto - Sistema de Análisis Inteligente</p>
      <div class="date">📅 ${formattedDate} • Período: Últimos ${dateRange} días</div>
    </div>

    <div class="content">
      <!-- KPIs -->
      <section class="section">
        <div class="section-title">
          <div class="section-icon">📈</div>
          Resumen Ejecutivo
        </div>
        <div class="kpi-grid">
          <div class="kpi-card gold">
            <div class="kpi-value">${analyticsData.averageRating}</div>
            <div class="kpi-label">⭐ Promedio General</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">${analyticsData.totalRatings}</div>
            <div class="kpi-label">📝 Total Calificaciones</div>
          </div>
          <div class="kpi-card green">
            <div class="kpi-value">${analyticsData.weeklyTrend}</div>
            <div class="kpi-label">📆 Esta Semana</div>
          </div>
          <div class="kpi-card ${analyticsData.anomalies.length > 0 ? 'red' : ''}">
            <div class="kpi-value">${analyticsData.anomalies.length}</div>
            <div class="kpi-label">⚠️ Anomalías</div>
          </div>
        </div>
      </section>

      <!-- Tabla de Atracciones -->
      <section class="section">
        <div class="section-title">
          <div class="section-icon">📍</div>
          Detalle por Atracción
        </div>
        <table>
          <thead>
            <tr>
              <th>Atracción</th>
              <th>Categoría</th>
              <th>Promedio</th>
              <th>Total</th>
              <th>Recientes (7d)</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.attractions.map(a => `
              <tr>
                <td><strong>${a.attraction_name}</strong></td>
                <td>${a.category}</td>
                <td>
                  <span class="rating-badge ${a.average_rating >= 4 ? 'rating-high' : a.average_rating >= 3 ? 'rating-medium' : 'rating-low'}">
                    ⭐ ${a.average_rating.toFixed(1)}
                  </span>
                </td>
                <td>${a.total_ratings}</td>
                <td>${a.recent_ratings}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <!-- Top Performers -->
      <section class="section">
        <div class="section-title">
          <div class="section-icon">🏆</div>
          Top Performers
        </div>
        ${analyticsData.topPerformers.map((a, i) => `
          <div class="recommendation-card">
            <div class="recommendation-title">${i + 1}. ${a.attraction_name}</div>
            <div class="recommendation-text">
              ⭐ Calificación: ${a.average_rating} | 📝 ${a.total_ratings} calificaciones totales
            </div>
          </div>
        `).join('')}
      </section>

      <!-- Recomendaciones -->
      ${analyticsData.underPerformers.length > 0 ? `
      <section class="section">
        <div class="section-title">
          <div class="section-icon">💡</div>
          Áreas de Mejora
        </div>
        ${analyticsData.underPerformers.map(a => `
          <div class="recommendation-card warning">
            <div class="recommendation-title">${a.attraction_name}</div>
            <div class="recommendation-text">
              Promedio: ⭐ ${a.average_rating} - Considerar revisar horarios, guías y señalización para mejorar la experiencia del visitante.
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Anomalías -->
      ${analyticsData.anomalies.length > 0 ? `
      <section class="section">
        <div class="section-title">
          <div class="section-icon">⚠️</div>
          Anomalías Detectadas
        </div>
        ${analyticsData.anomalies.map(an => `
          <div class="recommendation-card danger">
            <div class="recommendation-title">${an.type === 'low_rating' ? '📉 Calificación Baja' : an.type === 'no_activity' ? '😴 Sin Actividad' : '⬇️ Caída de Rating'}</div>
            <div class="recommendation-text">${an.message}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}
    </div>

    <div class="footer">
      <p><strong>Puerto López Descubierto</strong> - Sistema de Gestión Turística</p>
      <p>Reporte generado automáticamente • ${formattedDate}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Open in new window for print/save
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      toast({ 
        title: 'Reporte Generado', 
        description: 'Use Ctrl+P para imprimir o guardar como PDF.' 
      });
    }
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
        <TabsList className="grid w-full grid-cols-2 bg-slate-200">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vista General
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agente López
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
          
          {/* Charts integrated in overview */}
          <RatingsChartsGrid data={analyticsData} />
        </TabsContent>

        <TabsContent value="chat">
          <InteractiveChatAssistant data={analyticsData} />
        </TabsContent>
      </Tabs>
    </div>;
};