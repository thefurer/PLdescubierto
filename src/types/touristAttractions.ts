
export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  category: 'todo' | 'playa' | 'cultura' | 'naturaleza';
  image_url?: string;
  gallery_images?: string[];
  activities?: string[];
  coordinates?: { lat: number; lng: number };
  recommendations?: Array<{
    id: string;
    text: string;
    color?: string;
    dates?: string[];
    schedule?: {
      startDate: string;
      endDate: string;
    };
  }>;
  additional_info?: {
    duration?: string;
    capacity?: string;
    price?: string;
    schedules?: Array<{
      day: string;
      openTime: string;
      closeTime: string;
      isClosed: boolean;
    }>;
    [key: string]: any;
  };
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}
