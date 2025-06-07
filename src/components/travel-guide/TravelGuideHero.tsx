
import { ArrowLeft, Compass, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

const TravelGuideHero = () => {
  const navigate = useNavigate();
  const t = useTranslations();

  return (
    <div className="relative overflow-hidden bg-ocean">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToHome}
            </Button>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Compass className="h-12 w-12 text-white mr-4 animate-pulse" />
              <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                {t.travelGuideTitle}
              </h1>
            </div>
            <p className="text-2xl text-white/90 drop-shadow-md mb-8">
              {t.travelGuideSubtitle}
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <MapPin className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">{t.exploreDestinations}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelGuideHero;
