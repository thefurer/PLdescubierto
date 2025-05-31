
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface AttractionsHeaderProps {
  attractionsCount: number;
}

const AttractionsHeader = ({ attractionsCount }: AttractionsHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <MapPin className="h-5 w-5 text-green-500" />
          Gestión de Atracciones Turísticas
        </CardTitle>
        <CardDescription className="text-green-700">
          Edita las 37 atracciones turísticas de Puerto López organizadas por categorías
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-green-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {attractionsCount} atracciones disponibles
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Actualización en tiempo real
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttractionsHeader;
