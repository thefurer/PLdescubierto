
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, History, MapPin, Activity, Star } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';
import { AttractionDescription } from './AttractionDescription';
import { AttractionActivities } from './AttractionActivities';
import { AttractionSchedules } from './AttractionSchedules';
import { AttractionRecommendations } from './AttractionRecommendations';
import { AttractionLocation } from './AttractionLocation';
import { AttractionRating } from './AttractionRating';

interface AttractionTabsProps {
  attraction: TouristAttraction;
}

export const AttractionTabs = ({ attraction }: AttractionTabsProps) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
        <TabsTrigger value="description" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
          <History className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Descripción</span>
          <span className="sm:hidden">Info</span>
        </TabsTrigger>
        <TabsTrigger value="activities" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
          <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Actividades</span>
          <span className="sm:hidden">Act.</span>
        </TabsTrigger>
        <TabsTrigger value="schedules" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Horarios</span>
          <span className="sm:hidden">Hrs.</span>
        </TabsTrigger>
        <TabsTrigger value="recommendations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
          <History className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Recomendaciones</span>
          <span className="sm:hidden">Rec.</span>
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Ubicación</span>
          <span className="sm:hidden">Loc.</span>
        </TabsTrigger>
        <TabsTrigger value="rating" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Calificar</span>
          <span className="sm:hidden">★</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 px-1 sm:px-0">
        <AttractionDescription attraction={attraction} />
      </TabsContent>

      <TabsContent value="activities" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 px-1 sm:px-0">
        <AttractionActivities attraction={attraction} />
      </TabsContent>

      <TabsContent value="schedules" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 px-1 sm:px-0">
        <AttractionSchedules attraction={attraction} />
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 px-1 sm:px-0">
        <AttractionRecommendations attraction={attraction} />
      </TabsContent>

      <TabsContent value="location" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 px-1 sm:px-0">
        <AttractionLocation attraction={attraction} />
      </TabsContent>

      <TabsContent value="rating" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 px-1 sm:px-0">
        <AttractionRating attraction={attraction} />
      </TabsContent>
    </Tabs>
  );
};
