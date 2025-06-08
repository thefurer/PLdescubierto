
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews';
import { Loader2, Star, CheckCircle, XCircle, Eye } from 'lucide-react';

const ReviewsManager = () => {
  const { reviews, loading, updateReviewStatus } = useReviews();
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Reseñas</CardTitle>
          <CardDescription>
            Modera y aprueba las reseñas de los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{review.title}</h4>
                        {getStatusBadge(review.status)}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.visit_date && `Visitado: ${review.visit_date}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(selectedReview === review.id ? null : review.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedReview === review.id && (
                    <div className="border-t pt-3 mt-3">
                      <Textarea
                        value={review.content}
                        readOnly
                        className="mb-3 min-h-[100px]"
                      />
                      {review.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateReviewStatus(review.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateReviewStatus(review.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManager;
