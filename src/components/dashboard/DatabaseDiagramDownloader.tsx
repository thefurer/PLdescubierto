import { useState } from 'react';
import { Download, FileImage, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const MERMAID_DIAGRAM = `erDiagram
    %% Tabla de Usuarios (Supabase Auth)
    auth_users {
        uuid id PK
        string email
        jsonb user_metadata
        timestamp created_at
        timestamp updated_at
    }
    
    %% Perfiles de Usuario
    profiles {
        uuid id PK
        uuid user_id FK
        string email
        string full_name
        string avatar_url
        string phone
        text bio
        timestamp created_at
        timestamp updated_at
    }
    
    %% Sistema de Roles
    user_roles {
        uuid id PK
        uuid user_id FK
        app_role role
        timestamp created_at
    }
    
    %% Emails Autorizados
    authorized_emails {
        uuid id PK
        string email
        uuid authorized_by FK
        timestamp authorized_at
        boolean is_active
        text notes
    }
    
    %% Permisos de Administrador
    admin_permissions {
        uuid id PK
        uuid user_id FK
        string section_name
        boolean can_view
        boolean can_edit
        boolean can_delete
        uuid granted_by FK
        timestamp granted_at
        boolean is_active
    }
    
    %% Log de Acciones de Admin
    admin_actions_log {
        uuid id PK
        uuid admin_id FK
        string action_type
        string target_table
        uuid target_id
        jsonb details
        inet ip_address
        string user_agent
        timestamp created_at
    }
    
    %% Atracciones Turísticas
    tourist_attractions {
        uuid id PK
        string name
        text description
        string category
        string image_url
        array gallery_images
        array activities
        jsonb coordinates
        jsonb recommendations
        jsonb additional_info
        int display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
        uuid updated_by FK
    }
    
    %% Actividades de Atracciones
    attraction_activities {
        uuid id PK
        uuid attraction_id FK
        string activity_name
        text description
        string duration
        string difficulty_level
        numeric price
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    %% Calificaciones de Atracciones
    attraction_ratings {
        uuid id PK
        uuid attraction_id FK
        uuid user_id FK
        int rating
        inet ip_address
        string user_agent
        timestamp created_at
        timestamp updated_at
    }
    
    %% Reseñas
    reviews {
        uuid id PK
        uuid user_id FK
        uuid attraction_id FK
        string title
        text content
        int rating
        boolean is_verified
        string verification_method
        date visit_date
        jsonb photos
        int helpful_count
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    %% Reservaciones
    reservations {
        uuid id PK
        uuid user_id FK
        uuid attraction_id FK
        string reservation_type
        date reservation_date
        time time_slot
        int guests_count
        numeric total_price
        jsonb contact_info
        text special_requests
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    %% Contenido del Sitio
    site_content {
        uuid id PK
        string section_name
        jsonb content
        timestamp created_at
        timestamp updated_at
        uuid updated_by FK
    }
    
    %% Configuración Visual del Sitio
    site_visual_config {
        uuid id PK
        string config_type
        jsonb config_data
        boolean is_active
        timestamp created_at
        timestamp updated_at
        uuid updated_by FK
    }
    
    %% Historial de Contenido
    content_history {
        uuid id PK
        uuid content_id FK
        string section_name
        jsonb old_content
        jsonb new_content
        string change_type
        uuid changed_by FK
        timestamp changed_at
    }
    
    %% Imágenes de Galería
    gallery_images {
        uuid id PK
        string title
        string image_url
        string storage_path
        string alt_text
        string category
        int display_order
        boolean is_active
        uuid uploaded_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    %% Membresías
    memberships {
        uuid id PK
        uuid user_id FK
        string type
        string status
        date start_date
        date end_date
        jsonb features
        timestamp created_at
        timestamp updated_at
    }
    
    %% Guías Premium
    premium_guides {
        uuid id PK
        string title
        text description
        string content_type
        string file_url
        int file_size
        numeric price
        string required_membership
        array tags
        int download_count
        numeric rating
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    %% Productos del Marketplace
    marketplace_products {
        uuid id PK
        uuid vendor_id FK
        string name
        text description
        string category
        numeric price
        jsonb images
        int stock_quantity
        jsonb shipping_info
        array tags
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    %% Relaciones principales
    auth_users ||--|| profiles : "has profile"
    auth_users ||--o{ user_roles : "has roles"
    auth_users ||--o{ memberships : "has membership"
    auth_users ||--o{ reviews : "writes"
    auth_users ||--o{ reservations : "makes"
    auth_users ||--o{ attraction_ratings : "rates"
    auth_users ||--o{ authorized_emails : "authorizes"
    auth_users ||--o{ admin_permissions : "grants permissions"
    auth_users ||--o{ admin_actions_log : "performs actions"
    auth_users ||--o{ site_content : "updates content"
    auth_users ||--o{ site_visual_config : "configures design"
    auth_users ||--o{ content_history : "changes content"
    auth_users ||--o{ gallery_images : "uploads images"
    auth_users ||--o{ marketplace_products : "sells products"
    
    tourist_attractions ||--o{ attraction_activities : "has activities"
    tourist_attractions ||--o{ attraction_ratings : "receives ratings"
    tourist_attractions ||--o{ reviews : "receives reviews"
    tourist_attractions ||--o{ reservations : "receives bookings"
    
    site_content ||--o{ content_history : "has history"`;

const DatabaseDiagramDownloader = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadAsText = () => {
    const blob = new Blob([MERMAID_DIAGRAM], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-diagram.mmd';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Código Mermaid descargado');
  };

  const downloadAsSVG = async () => {
    setLoading('svg');
    try {
      const encoded = encodeURIComponent(MERMAID_DIAGRAM);
      const url = `https://mermaid.ink/svg/${encoded}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al generar SVG');
      
      const svgBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(svgBlob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'database-diagram.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      toast.success('Diagrama SVG descargado');
    } catch (error) {
      console.error('Error downloading SVG:', error);
      toast.error('Error al descargar SVG');
    } finally {
      setLoading(null);
    }
  };

  const downloadAsPNG = async () => {
    setLoading('png');
    try {
      const encoded = encodeURIComponent(MERMAID_DIAGRAM);
      const url = `https://mermaid.ink/img/${encoded}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al generar PNG');
      
      const pngBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pngBlob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'database-diagram.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      toast.success('Diagrama PNG descargado');
    } catch (error) {
      console.error('Error downloading PNG:', error);
      toast.error('Error al descargar PNG');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Diagrama de Base de Datos
        </CardTitle>
        <CardDescription>
          Descarga el diagrama de la estructura de la base de datos en diferentes formatos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={downloadAsSVG}
            disabled={loading === 'svg'}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileImage className="h-4 w-4" />
            {loading === 'svg' ? 'Generando...' : 'SVG (Vector)'}
          </Button>
          
          <Button
            onClick={downloadAsPNG}
            disabled={loading === 'png'}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileImage className="h-4 w-4" />
            {loading === 'png' ? 'Generando...' : 'PNG (Imagen)'}
          </Button>
          
          <Button
            onClick={downloadAsText}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Código Mermaid
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>• <strong>SVG:</strong> Formato vectorial, alta calidad para impresión</p>
          <p>• <strong>PNG:</strong> Imagen rasterizada, ideal para documentos</p>
          <p>• <strong>Código Mermaid:</strong> Código fuente para editar el diagrama</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseDiagramDownloader;