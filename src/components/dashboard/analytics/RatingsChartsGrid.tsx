import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

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

interface RatingsChartsGridProps {
  data: AnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RatingsChartsGrid = ({ data }: RatingsChartsGridProps) => {
  // Prepare chart data
  const barChartData = data.attractions.map(attraction => ({
    name: attraction.attraction_name.length > 15 
      ? attraction.attraction_name.substring(0, 15) + '...' 
      : attraction.attraction_name,
    fullName: attraction.attraction_name,
    rating: attraction.average_rating,
    total: attraction.total_ratings
  })).slice(0, 10);

  const categoryData = data.attractions.reduce((acc: any, attraction) => {
    const existing = acc.find((item: any) => item.category === attraction.category);
    if (existing) {
      existing.count += 1;
      existing.averageRating = (existing.averageRating + attraction.average_rating) / 2;
    } else {
      acc.push({
        category: attraction.category,
        count: 1,
        averageRating: attraction.average_rating
      });
    }
    return acc;
  }, []);

  const radarData = data.topPerformers.slice(0, 5).map(attraction => ({
    attraction: attraction.attraction_name.length > 10 
      ? attraction.attraction_name.substring(0, 10) + '...' 
      : attraction.attraction_name,
    rating: attraction.average_rating,
    volume: (attraction.total_ratings / Math.max(...data.attractions.map(a => a.total_ratings))) * 5,
    recent: (attraction.recent_ratings / Math.max(...data.attractions.map(a => a.recent_ratings))) * 5 || 0
  }));

  // Timeline data - aggregate by week
  const timelineData = () => {
    const weeklyData = new Map();
    
    data.attractions.forEach(attraction => {
      attraction.rating_history.forEach(entry => {
        const week = getWeekKey(new Date(entry.date));
        if (!weeklyData.has(week)) {
          weeklyData.set(week, { week, totalRating: 0, count: 0 });
        }
        const weekData = weeklyData.get(week);
        weekData.totalRating += entry.rating * entry.count;
        weekData.count += entry.count;
      });
    });

    return Array.from(weeklyData.values())
      .map(data => ({
        week: data.week,
        averageRating: data.count > 0 ? data.totalRating / data.count : 0,
        volume: data.count
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12); // Last 12 weeks
  };

  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7);
    return `${year}-S${week}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'rating' ? 'Calificación' : 
               entry.dataKey === 'total' ? 'Total' : 
               entry.dataKey === 'volume' ? 'Volumen' : 
               entry.dataKey === 'averageRating' ? 'Promedio' : entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bar Chart - Ratings by Attraction */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">📊</span>
            Calificaciones por Atracción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rating" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">📈</span>
            Evolución Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="averageRating" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart - Top Performers Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">🎯</span>
            Análisis Multi-dimensional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attraction" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 5]} tick={false} />
              <Radar
                name="Calificación"
                dataKey="rating"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Volumen"
                dataKey="volume"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">🥧</span>
            Distribución por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category} (${count})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volume vs Rating Scatter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">📍</span>
            Volumen vs Calificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart 
              data={data.attractions.slice(0, 8).map(a => ({
                name: a.attraction_name.substring(0, 10) + '...',
                rating: a.average_rating,
                volume: a.total_ratings
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="rating" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingsChartsGrid;