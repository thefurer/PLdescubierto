
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, History, MapPin, Activity } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';
import { AttractionDescription } from './AttractionDescription';
import { AttractionActivities } from './AttractionActivities';
import { AttractionSchedules } from './AttractionSchedules';
import { AttractionRecommendations } from './AttractionRecommendations';
import { AttractionLocation } from './AttractionLocation';

interface AttractionTabsProps {
  attraction: TouristAttraction;
}

export const AttractionTabs = ({ attraction }: AttractionTabsProps) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="description" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Descripción
        </TabsTrigger>
        <TabsTrigger value="activities" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Actividades
        </TabsTrigger>
        <TabsTrigger value="schedules" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Horarios
        </TabsTrigger>
        <TabsTrigger value="recommendations" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Recomendaciones
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Ubicación
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-4 mt-4">
        <AttractionDescription attraction={attraction} />
      </TabsContent>

      <TabsContent value="activities" className="space-y-4 mt-4">
        <AttractionActivities attraction={attraction} />
      </TabsContent>

      <TabsContent value="schedules" className="space-y-4 mt-4">
        <AttractionSchedules attraction={attraction} />
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4 mt-4">
        <AttractionRecommendations attraction={attraction} />
      </TabsContent>

      <TabsContent value="location" className="space-y-4 mt-4">
        <AttractionLocation attraction={attraction} />
      </TabsContent>
    </Tabs>
  );
};
