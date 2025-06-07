
import { Star, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';

const TravelTips = () => {
  const t = useTranslations();

  const travelItems = [
    t.sunscreen,
    t.comfortableClothes,
    t.waterproofCamera,
    t.insectRepellent
  ];

  return (
    <Card className="glass-card border-0 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-green-primary to-ocean text-white rounded-t-lg">
        <CardTitle className="text-3xl font-bold">{t.travelTips}</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-ocean">
              <h4 className="text-xl font-bold mb-4 text-ocean-dark flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-500" />
                {t.bestTimeToVisit}
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <strong className="text-ocean">Junio - Septiembre:</strong> {t.whaleSeasonDesc}
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <strong className="text-ocean">Diciembre - Abril:</strong> {t.drySeason}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-primary">
              <h4 className="text-xl font-bold mb-4 text-green-dark flex items-center">
                <Compass className="h-6 w-6 mr-2 text-green-primary" />
                {t.whatToBring}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {travelItems.map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="w-2 h-2 bg-green-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelTips;
