
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, History, MapPin, Activity, Star } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';
import { useTranslations } from '@/hooks/useTranslations';
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
  const t = useTranslations();
  
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1 h-auto p-1 bg-muted/30">
        <TabsTrigger 
          value="description" 
          className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm p-2 h-auto min-h-[44px] data-[state=active]:bg-background"
        >
          <History className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sm:hidden">Info</span>
          <span className="hidden sm:inline">{t.description}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="activities" 
          className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm p-2 h-auto min-h-[44px] data-[state=active]:bg-background"
        >
          <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sm:hidden">Act.</span>
          <span className="hidden sm:inline">{t.activities}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="schedules" 
          className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm p-2 h-auto min-h-[44px] data-[state=active]:bg-background"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sm:hidden">Hrs.</span>
          <span className="hidden sm:inline">{t.schedules}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="recommendations" 
          className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm p-2 h-auto min-h-[44px] data-[state=active]:bg-background"
        >
          <History className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sm:hidden">Rec.</span>
          <span className="hidden sm:inline">{t.recommendations}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="location" 
          className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm p-2 h-auto min-h-[44px] data-[state=active]:bg-background"
        >
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sm:hidden">Loc.</span>
          <span className="hidden sm:inline">{t.location}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-1 sm:px-0">
        <AttractionDescription attraction={attraction} />
      </TabsContent>

      <TabsContent value="activities" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-1 sm:px-0">
        <AttractionActivities attraction={attraction} />
      </TabsContent>

      <TabsContent value="schedules" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-1 sm:px-0">
        <AttractionSchedules attraction={attraction} />
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-1 sm:px-0">
        <AttractionRecommendations attraction={attraction} />
      </TabsContent>

      <TabsContent value="location" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-1 sm:px-0">
        <AttractionLocation attraction={attraction} />
      </TabsContent>

    </Tabs>
  );
};
