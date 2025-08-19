import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TouristAttraction } from "@/types/touristAttractions";
import { useTranslations } from "@/hooks/useTranslations";

interface AttractionLocationProps {
  attraction: TouristAttraction;
}

export const AttractionLocation = ({ attraction }: AttractionLocationProps) => {
  const t = useTranslations();
  const handleOpenInGoogleMaps = () => {
    if (attraction.coordinates) {
      const url = `https://maps.google.com/?q=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://maps.google.com/?q=${encodeURIComponent(`${attraction.name}, Puerto López, Manabí, Ecuador`)}`;
      window.open(url, '_blank');
    }
  };

  const handleGetDirections = () => {
    if (attraction.coordinates) {
      const url = `https://maps.google.com/maps/dir/?api=1&destination=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${attraction.name}, Puerto López, Manabí, Ecuador`)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Información de ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ocean">
            <MapPin className="h-5 w-5" />
            {t.locationOf} {attraction.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-ocean-dark mb-2">{t.address}</h4>
            <p className="text-gray-600">
              {attraction.name}, Puerto López, Manabí, Ecuador
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleOpenInGoogleMaps}
              variant="outline"
              className="flex items-center gap-2 border-ocean text-ocean hover:bg-ocean hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              {t.viewGoogleMaps}
            </Button>
            
            <Button
              onClick={handleGetDirections}
              className="flex items-center gap-2 bg-gradient-to-r from-ocean to-blue-600 hover:from-ocean-dark hover:to-blue-700 text-white"
            >
              <MapPin className="h-4 w-4" />
              {t.getDirections}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-br from-ocean-light/10 to-green-light/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-semibold text-ocean mb-2">
              {t.manabíProvince}
            </h4>
            <p className="text-sm text-gray-600">
              {t.manabíDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};