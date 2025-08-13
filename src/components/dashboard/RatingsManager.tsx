import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users, MapPin, Download } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface AttractionRating {
  attraction_id: string;
  attraction_name: string;
  average_rating: number;
  total_ratings: number;
  recent_ratings: number;
}

export const RatingsManager = () => {
  const [ratingsData, setRatingsData] = useState<AttractionRating[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRatingsData();
  }, []);

  const fetchRatingsData = async () => {
    try {
      setLoading(true);
      
      // Use the secure view for aggregated rating data (admin access only)
      const { data: ratingsQuery, error: ratingsError } = await supabase
        .from('attraction_ratings_public')
        .select(`
          attraction_id,
          rating,
          created_at,
          tourist_attractions!inner(name)
        `);

      if (ratingsError) throw ratingsError;

      // Procesar datos para obtener estadísticas por atracción
      const ratingsMap = new Map<string, {
        name: string;
        ratings: number[];
        recentRatings: number;
      }>();

      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      ratingsQuery?.forEach((rating: any) => {
        const attractionId = rating.attraction_id;
        const attractionName = rating.tourist_attractions.name;
        const ratingValue = rating.rating;
        const createdAt = new Date(rating.created_at);

        if (!ratingsMap.has(attractionId)) {
          ratingsMap.set(attractionId, {
            name: attractionName,
            ratings: [],
            recentRatings: 0
          });
        }

        const data = ratingsMap.get(attractionId)!;
        data.ratings.push(ratingValue);
        
        if (createdAt >= lastWeek) {
          data.recentRatings++;
        }
      });

      // Convertir a array y calcular promedios
      const processedData: AttractionRating[] = Array.from(ratingsMap.entries()).map(([id, data]) => {
        const average = data.ratings.reduce((sum, rating) => sum + rating, 0) / data.ratings.length;
        
        return {
          attraction_id: id,
          attraction_name: data.name,
          average_rating: Math.round(average * 10) / 10,
          total_ratings: data.ratings.length,
          recent_ratings: data.recentRatings
        };
      });

      // Ordenar por promedio de calificación descendente
      processedData.sort((a, b) => b.average_rating - a.average_rating);
      
      setRatingsData(processedData);
    } catch (error) {
      console.error('Error fetching ratings data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de calificaciones.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = rating >= starNumber;
      const isPartial = rating > index && rating < starNumber;

      return (
        <Star
          key={index}
          className={`h-4 w-4 ${
            isFilled 
              ? 'text-amber-400 fill-amber-400' 
              : isPartial 
                ? 'text-amber-400 fill-amber-200'
                : 'text-gray-300'
          }`}
        />
      );
    });
  };

  const getTotalRatings = () => {
    return ratingsData.reduce((sum, attraction) => sum + attraction.total_ratings, 0);
  };

  const getAverageRating = () => {
    if (ratingsData.length === 0) return 0;
    const totalWeightedRating = ratingsData.reduce((sum, attraction) => 
      sum + (attraction.average_rating * attraction.total_ratings), 0);
    const totalRatings = getTotalRatings();
    return totalRatings > 0 ? Math.round((totalWeightedRating / totalRatings) * 10) / 10 : 0;
  };

  const getRecentRatings = () => {
    return ratingsData.reduce((sum, attraction) => sum + attraction.recent_ratings, 0);
  };

  const generateStatisticalReport = () => {
    const now = new Date();
    const reportData = [];

    // Encabezados
    reportData.push([
      'Atracción',
      'Promedio de Calificación',
      'Total de Calificaciones',
      'Calificaciones Última Semana',
      'Porcentaje de Calificaciones Positivas (4-5 estrellas)',
      'Fecha de Reporte'
    ]);

    // Datos de cada atracción
    ratingsData.forEach(attraction => {
      const positivePercentage = '0%'; // Se calculará con datos detallados si es necesario
      reportData.push([
        attraction.attraction_name,
        attraction.average_rating.toString(),
        attraction.total_ratings.toString(),
        attraction.recent_ratings.toString(),
        positivePercentage,
        now.toLocaleDateString('es-ES')
      ]);
    });

    // Resumen general
    reportData.push([]);
    reportData.push(['RESUMEN GENERAL']);
    reportData.push(['Total de Atracciones', ratingsData.length.toString()]);
    reportData.push(['Promedio General', getAverageRating().toString()]);
    reportData.push(['Total de Calificaciones', getTotalRatings().toString()]);
    reportData.push(['Calificaciones Última Semana', getRecentRatings().toString()]);

    return reportData;
  };

  const downloadReport = () => {
    const reportData = generateStatisticalReport();
    const csvContent = reportData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reporte-calificaciones-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Reporte Descargado",
      description: "El reporte estadístico se ha descargado exitosamente.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-ocean">Gestión de Calificaciones</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-ocean">Gestión de Calificaciones</h2>
        </div>
        <Button 
          onClick={downloadReport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar Reporte
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-ocean">{getAverageRating()}</p>
                  <div className="flex">{renderStars(getAverageRating())}</div>
                </div>
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
                <p className="text-sm font-medium text-gray-600">Total Calificaciones</p>
                <p className="text-2xl font-bold text-ocean">{getTotalRatings()}</p>
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
                <p className="text-sm font-medium text-gray-600">Última Semana</p>
                <p className="text-2xl font-bold text-ocean">{getRecentRatings()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Atracciones</p>
                <p className="text-2xl font-bold text-ocean">{ratingsData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de atracciones con calificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean">Calificaciones por Atracción</CardTitle>
        </CardHeader>
        <CardContent>
          {ratingsData.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay calificaciones disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratingsData.map((attraction) => (
                <div
                  key={attraction.attraction_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-ocean">{attraction.attraction_name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(attraction.average_rating)}</div>
                        <span className="text-sm font-medium">{attraction.average_rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {attraction.total_ratings} {attraction.total_ratings === 1 ? 'calificación' : 'calificaciones'}
                      </span>
                      {attraction.recent_ratings > 0 && (
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                          +{attraction.recent_ratings} esta semana
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};