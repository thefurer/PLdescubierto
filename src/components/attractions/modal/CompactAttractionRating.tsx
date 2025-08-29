import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { TouristAttraction } from "@/types/touristAttractions";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";

interface CompactAttractionRatingProps {
  attraction: TouristAttraction;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
}

export const CompactAttractionRating = ({ attraction }: CompactAttractionRatingProps) => {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const { toast } = useToast();
  const t = useTranslations();

  useEffect(() => {
    fetchRatingData();
  }, [attraction.id]);

  const fetchRatingData = async () => {
    try {
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_attraction_rating_stats', { attraction_uuid: attraction.id });

      if (statsError) throw statsError;

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

      if (user) {
        const { data: existingRating } = await supabase
          .from('attraction_ratings')
          .select('id')
          .eq('attraction_id', attraction.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingRating) {
          const { error } = await supabase
            .from('attraction_ratings')
            .update({ rating: rating })
            .eq('attraction_id', attraction.id)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('attraction_ratings')
            .insert({
              attraction_id: attraction.id,
              rating: rating,
              user_id: user.id
            });

          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from('attraction_ratings')
          .insert({
            attraction_id: attraction.id,
            rating: rating,
            user_id: null,
            user_agent: navigator.userAgent
          });

        if (error) throw error;
      }

      await fetchRatingData();
      setShowInteractive(false);

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

  const renderInteractiveStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = (hoveredRating || ratingData.userRating || 0) >= starNumber;

      return (
        <button
          key={index}
          className={`transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-sm ${
            isFilled 
              ? 'text-amber-400' 
              : 'text-gray-300 hover:text-amber-300'
          }`}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => submitRating(starNumber)}
          disabled={isSubmitting}
          aria-label={`Calificar con ${starNumber} ${starNumber > 1 ? 'estrellas' : 'estrella'}`}
        >
          <Star
            className={`h-5 w-5 ${isFilled ? 'fill-current' : ''}`}
          />
        </button>
      );
    });
  };

  if (showInteractive) {
    return (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 mb-1">
          {renderInteractiveStars()}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {hoveredRating > 0 && (
            <span className="text-ocean font-medium">
              {hoveredRating} {hoveredRating > 1 ? 'estrellas' : 'estrella'}
            </span>
          )}
          <button
            onClick={() => setShowInteractive(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-sm px-1"
            aria-label="Cancelar calificación"
          >
            Cancelar
          </button>
        </div>
        {isSubmitting && (
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-ocean"></div>
            <span>Enviando...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInteractive(true)}
      className="flex items-center gap-1 group hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      aria-label={`Calificación actual: ${ratingData.averageRating.toFixed(1)} estrellas de 5. ${ratingData.totalRatings} calificaciones. Hacer clic para calificar.`}
    >
      <Star className="h-4 w-4 text-amber-500 fill-current" />
      <span className="text-sm font-medium">
        {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : 'Sin calificar'}
      </span>
      {ratingData.totalRatings > 0 && (
        <span className="text-xs text-gray-500 group-hover:text-gray-700">
          ({ratingData.totalRatings})
        </span>
      )}
      {ratingData.userRating && (
        <span className="text-xs text-blue-600 ml-1" aria-label={`Tu calificación: ${ratingData.userRating} estrellas`}>
          ★ {ratingData.userRating}
        </span>
      )}
    </button>
  );
};