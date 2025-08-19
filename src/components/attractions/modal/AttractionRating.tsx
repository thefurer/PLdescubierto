import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TouristAttraction } from "@/types/touristAttractions";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";

interface AttractionRatingProps {
  attraction: TouristAttraction;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
}

export const AttractionRating = ({ attraction }: AttractionRatingProps) => {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const t = useTranslations();

  useEffect(() => {
    fetchRatingData();
  }, [attraction.id]);

  const fetchRatingData = async () => {
    try {
      // Use the secure function to get rating statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_attraction_rating_stats', { attraction_uuid: attraction.id });

      if (statsError) throw statsError;

      // Obtener la calificación del usuario actual (si está logueado)
      const { data: { user } } = await supabase.auth.getUser();
      let userRating = undefined;

      if (user) {
        const { data: userRatingData, error: userError } = await supabase
          .from('attraction_ratings')
          .select('rating')
          .eq('attraction_id', attraction.id)
          .eq('user_id', user.id)
          .single();

        if (!userError && userRatingData) {
          userRating = userRatingData.rating;
        }
      }

      setRatingData({
        averageRating: statsData?.[0]?.average_rating || 0,
        totalRatings: statsData?.[0]?.total_ratings || 0,
        userRating
      });
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  };

  const submitRating = async (rating: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Preparar los datos de la calificación
      const ratingData: any = {
        attraction_id: attraction.id,
        rating: rating
      };

      if (user) {
        ratingData.user_id = user.id;
      } else {
        // Para usuarios no logueados, usar IP y user agent
        ratingData.ip_address = await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => null);
        ratingData.user_agent = navigator.userAgent;
      }

      // Intentar insertar o actualizar la calificación
      const { error } = await supabase
        .from('attraction_ratings')
        .upsert(ratingData);

      if (error) throw error;

      // Actualizar los datos locales
      await fetchRatingData();

      toast({
        title: t.ratingSent,
        description: `${t.youRated} ${attraction.name} ${t.with} ${rating} ${rating > 1 ? t.stars : t.star}.`,
      });

    } catch (error: any) {
      console.error('Error submitting rating:', error);
      
      if (error.code === '23505') {
        toast({
          title: t.alreadyRated,
          description: t.alreadyRatedDesc,
          variant: "destructive"
        });
      } else {
        toast({
          title: t.error,
          description: t.ratingError,
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = interactive 
        ? (hoveredRating || ratingData.userRating || 0) >= starNumber
        : ratingData.averageRating >= starNumber;
      const isPartial = !interactive && 
        ratingData.averageRating > index && 
        ratingData.averageRating < starNumber;

      return (
        <Star
          key={index}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            isFilled 
              ? 'text-amber-400 fill-amber-400' 
              : isPartial 
                ? 'text-amber-400 fill-amber-200'
                : 'text-gray-300'
          } ${interactive ? 'hover:text-amber-400 hover:fill-amber-400' : ''}`}
          onMouseEnter={interactive ? () => setHoveredRating(starNumber) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          onClick={interactive ? () => submitRating(starNumber) : undefined}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Calificar atracción */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean">
            {ratingData.userRating ? t.yourRating : t.rateAttraction}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {ratingData.userRating 
                ? `${t.ratedWithStars} ${ratingData.userRating} ${ratingData.userRating > 1 ? t.stars : t.star}. ${t.clickToChange}`
                : t.shareExperience
              }
            </p>
            
            <div className="flex justify-center items-center gap-1 mb-4">
              {renderStars(true)}
            </div>

            {hoveredRating > 0 && (
              <p className="text-sm text-ocean font-medium">
                {hoveredRating} {hoveredRating > 1 ? t.stars : t.star}
              </p>
            )}

            {isSubmitting && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ocean"></div>
                <span className="text-sm text-gray-600">{t.sendingRating}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-semibold text-amber-800 mb-2">
              ⭐ {t.yourOpinionMatters}
            </h4>
            <p className="text-sm text-amber-700">
              {t.helpOtherVisitors} {attraction.name}. {t.ratingHelpsImprove}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};