import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import { useContentManager } from "@/hooks/useContentManager";
import { useTranslations } from "@/hooks/useTranslations";
import AttractionsCarousel from './attractions/AttractionsCarousel';
import AttractionsGrid from './attractions/AttractionsGrid';
import AttractionsHeader from './attractions/AttractionsHeader';

interface AttractionsProps {
  onAttractionSelect?: (attraction: string) => void;
}

const Attractions = ({ onAttractionSelect }: AttractionsProps) => {
  const { content } = useContentManager();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  // Find attractions content from database
  const attractionsContent = content.filter(item => item.section_name === 'attractions');

  const handleAttractionClick = (attraction: any) => {
    if (onAttractionSelect) {
      onAttractionSelect(attraction.name);
    }
    setSelectedAttraction(attraction);
    setOpen(true);
  };

  return (
    <section id="attractions" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      
      <div className="container mx-auto px-4">
        <AttractionsHeader />
        
        <div className="mb-12">
          <AttractionsCarousel 
            onAttractionClick={handleAttractionClick}
            attractions={attractionsContent}
          />
        </div>

        <div className="mb-12">
          <AttractionsGrid
            onAttractionClick={handleAttractionClick}
            attractions={attractionsContent}
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedAttraction?.content?.title}</DialogTitle>
              <DialogDescription>
                {selectedAttraction?.content?.subtitle}
              </DialogDescription>
            </DialogHeader>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{selectedAttraction?.content?.title}</CardTitle>
                <CardDescription>{selectedAttraction?.content?.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <img src={selectedAttraction?.content?.imageUrl} alt={selectedAttraction?.content?.title} className="rounded-md" />
                </div>
                <div className="grid gap-2">
                  <p>{selectedAttraction?.content?.description}</p>
                </div>
                <div className="grid gap-2">
                  <Badge variant="secondary">
                    <Star className="mr-2 h-4 w-4" />
                    {selectedAttraction?.content?.rating} / 5
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Attractions;
