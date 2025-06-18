
export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  category: 'todo' | 'playa' | 'cultura' | 'naturaleza';
  image_url?: string;
  gallery_images?: string[];
  activities?: string[];
  additional_info?: {
    duration?: string;
    capacity?: string;
    price?: string;
    [key: string]: any;
  };
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}
