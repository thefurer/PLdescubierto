
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  is_verified: boolean;
  visit_date?: string;
  helpful_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          content,
          is_verified,
          visit_date,
          helpful_count,
          created_at,
          profiles (
            full_name
          )
        `)
        .eq('status', 'approved')
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Lo que dicen nuestros <span className="text-ocean">visitantes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experiencias reales de turistas que han visitado Puerto López
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {currentReviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  {review.is_verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verificada
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{review.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-4">{review.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.profiles?.full_name || 'Usuario anónimo'}</span>
                  {review.visit_date && (
                    <span>Visitó: {new Date(review.visit_date).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-sm text-gray-500">
              {currentPage + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
