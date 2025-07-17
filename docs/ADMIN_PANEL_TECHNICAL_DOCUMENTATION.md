# Documentación Técnica del Panel de Administración
## Puerto López Descubierto

### Versión: 1.0
### Fecha: 2025-01-17

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Componentes Principales](#componentes-principales)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [Base de Datos](#base-de-datos)
6. [APIs y Servicios](#apis-y-servicios)
7. [Hooks Personalizados](#hooks-personalizados)
8. [Configuración Visual](#configuración-visual)
9. [Gestión de Estado](#gestión-de-estado)
10. [Seguridad](#seguridad)
11. [Despliegue y DevOps](#despliegue-y-devops)

---

## 🏗️ Arquitectura General

### Stack Tecnológico
```typescript
// Frontend
React 18.3.1        // Framework principal
TypeScript 5.x       // Tipado estático
Vite 5.x            // Build tool y dev server
Tailwind CSS 3.x    // Framework CSS utilitario
Radix UI            // Componentes base primitivos
shadcn/ui           // Sistema de componentes

// Backend
Supabase            // BaaS (Backend as a Service)
PostgreSQL 15       // Base de datos principal
Edge Functions      // Serverless functions
Supabase Auth       // Sistema de autenticación
Supabase Storage    // Almacenamiento de archivos

// Estado y Gestión
Zustand 5.x         // Estado global
React Hook Form     // Gestión de formularios
React Query         // Cache y sincronización de datos
```

### Patrón Arquitectónico
- **MVC Modificado**: Model (Supabase), View (React Components), Controller (Hooks/Services)
- **Composición sobre Herencia**: Componentes reutilizables y modulares
- **Hooks Pattern**: Lógica de negocio encapsulada en custom hooks
- **Provider Pattern**: Context para estado global de autenticación

---

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── dashboard/           # Componentes del panel admin
│   │   ├── layout/         # Layout y navegación
│   │   ├── attractions/    # Gestión de atracciones
│   │   ├── content-editor/ # Editor de contenido
│   │   ├── visual-design/  # Diseño visual
│   │   ├── admin/          # Gestión de usuarios
│   │   └── travel-guide/   # Guía de viaje
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── auth/               # Componentes de autenticación
│   └── shared/             # Componentes compartidos
├── hooks/                  # Custom hooks
├── services/               # Servicios de API
├── contexts/               # React contexts
├── types/                  # Definiciones TypeScript
├── utils/                  # Utilidades
├── pages/                  # Páginas principales
└── integrations/
    └── supabase/           # Configuración Supabase
```

---

## 🔧 Componentes Principales

### Dashboard Principal
```typescript
// src/pages/Dashboard.tsx
interface DashboardProps {
  // Gestión de pestañas y navegación
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Configuración de navegación
const navigationItems = [
  { id: 'hero', label: 'Sección de Portada', icon: Home },
  { id: 'footer', label: 'Pie de Página', icon: FileText },
  { id: 'attractions', label: 'Gestión de Atracciones', icon: MapPin },
  { id: 'travel-guide', label: 'Guía de Viaje', icon: Map },
  { id: 'visual-design', label: 'Diseño Visual y Ajustes', icon: Palette },
  { id: 'admin', label: 'Gestión de Admins', icon: Shield },
  { id: 'history', label: 'Historial de Cambios', icon: History },
  { id: 'profile', label: 'Mi Perfil', icon: User }
];
```

### Gestión de Atracciones
```typescript
// src/components/dashboard/AttractionsManager.tsx
interface AttractionManagerState {
  attractions: TouristAttraction[];
  editingId: string | null;
  openItems: Set<string>;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
}

// Operaciones CRUD
interface AttractionOperations {
  handleEdit: (attraction: TouristAttraction) => void;
  handleSave: (id: string, updates: Partial<TouristAttraction>) => Promise<void>;
  handleCancel: () => void;
  handleUploadImage: (file: File, attractionId: string) => Promise<string>;
  toggleItem: (id: string) => void;
}
```

### Editor de Contenido
```typescript
// src/components/dashboard/ContentEditor.tsx
interface ContentEditorProps {
  filterSection: 'hero' | 'footer';
}

interface ContentState {
  content: SiteContent[];
  loading: boolean;
  saving: boolean;
  selectedContent: SiteContent | null;
}

// Métodos principales
interface ContentMethods {
  loadContent: () => Promise<void>;
  handleSave: (sectionName: string, data: any) => Promise<void>;
  resetForm: () => void;
}
```

---

## 🔐 Sistema de Autenticación

### Context de Autenticación
```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
  resendConfirmation: (email: string) => Promise<AuthResponse>;
}

// Configuración de sesión
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    await handleAuthStateChange(event, session, mounted, setSession, setUser, setLoading);
  });

  initializeAuth(mounted, setSession, setUser, setLoading);

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);
```

### Sistema de Roles y Permisos
```typescript
// Base de datos: user_roles table
interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

// admin_permissions table
interface AdminPermission {
  id: string;
  user_id: string;
  section_name: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  granted_by: string;
  granted_at: string;
  is_active: boolean;
}

// Funciones de verificación
function is_admin(user_id: uuid): boolean;
function is_main_admin(user_id: uuid): boolean;
function has_section_permission(user_id: uuid, section: text, permission_type: text): boolean;
```

---

## 🗃️ Base de Datos

### Esquema Principal
```sql
-- Contenido del sitio
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Atracciones turísticas
CREATE TABLE tourist_attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  gallery_images TEXT[],
  activities TEXT[],
  recommendations JSONB DEFAULT '[]',
  additional_info JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Configuración visual
CREATE TABLE site_visual_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_type TEXT NOT NULL,
  config_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Políticas RLS (Row Level Security)
```sql
-- Solo administradores pueden gestionar contenido del sitio
CREATE POLICY "Only admins can manage site content" 
ON site_content FOR ALL 
USING (is_admin(auth.uid()));

-- Todos pueden ver contenido activo
CREATE POLICY "Public can view active site content" 
ON site_content FOR SELECT 
USING (true);

-- Solo administradores pueden gestionar atracciones
CREATE POLICY "Only admins can manage tourist attractions" 
ON tourist_attractions FOR ALL 
USING (is_admin(auth.uid()));

-- Público puede ver atracciones activas
CREATE POLICY "Public can view active attractions" 
ON tourist_attractions FOR SELECT 
USING (is_active = true);
```

### Triggers Automáticos
```sql
-- Actualización automática de timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Creación de historial automático
CREATE OR REPLACE FUNCTION create_content_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO content_history (content_id, section_name, old_content, new_content, change_type, changed_by)
    VALUES (NEW.id, NEW.section_name, OLD.content, NEW.content, 'update', auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO content_history (content_id, section_name, new_content, change_type, changed_by)
    VALUES (NEW.id, NEW.section_name, NEW.content, 'create', auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔌 APIs y Servicios

### Cliente Supabase
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://lncxwvrcsuhphxxsvjod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### Servicio de Autenticación
```typescript
// src/services/authService.ts
interface AuthService {
  signUp: (email: string, password: string, userData?: any) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
  resendConfirmation: (email: string) => Promise<AuthResponse>;
}

export const useAuthService = (): AuthService => {
  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    return { data, error };
  };
  
  // ... otros métodos
  
  return { signUp, signIn, signOut, resetPassword, updatePassword, resendConfirmation };
};
```

### Servicio de Atracciones Turísticas
```typescript
// src/services/touristAttractionsService.ts
interface TouristAttractionsService {
  getAttractions: () => Promise<TouristAttraction[]>;
  updateAttraction: (id: string, updates: Partial<TouristAttraction>) => Promise<void>;
  uploadImage: (file: File, attractionId: string) => Promise<string>;
  deleteImage: (imagePath: string) => Promise<void>;
}

export const touristAttractionsService: TouristAttractionsService = {
  async getAttractions() {
    const { data, error } = await supabase
      .from('tourist_attractions')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async updateAttraction(id: string, updates: Partial<TouristAttraction>) {
    const { error } = await supabase
      .from('tourist_attractions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // ... otros métodos
};
```

---

## 🪝 Hooks Personalizados

### useAdminManagement
```typescript
// src/hooks/useAdminManagement.ts
interface AdminManagementHook {
  isMainAdmin: boolean;
  loading: boolean;
  
  // Gestión de emails autorizados
  authorizedEmails: AuthorizedEmail[];
  loadAuthorizedEmails: () => Promise<void>;
  authorizeEmail: (email: string, notes?: string) => Promise<void>;
  revokeEmailAuthorization: (emailId: string) => Promise<void>;
  checkEmailAuthorization: (email: string) => Promise<boolean>;
  
  // Gestión de usuarios administradores
  adminUsers: AdminUser[];
  loadAdminUsers: () => Promise<void>;
  
  // Gestión de permisos
  assignPermissions: (userId: string, section: string, permissions: PermissionSet) => Promise<void>;
  
  // Historial de acciones
  adminActions: AdminAction[];
  loadAdminActions: () => Promise<void>;
}

export const useAdminManagement = (): AdminManagementHook => {
  const { user } = useAuth();
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  
  // ... implementación
  
  return {
    isMainAdmin,
    loading,
    authorizedEmails,
    loadAuthorizedEmails,
    // ... resto de métodos
  };
};
```

### useTouristAttractions
```typescript
// src/hooks/useTouristAttractions.ts
interface TouristAttractionsHook {
  attractions: TouristAttraction[];
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  error: string | null;
  
  loadAttractions: () => Promise<void>;
  updateAttraction: (id: string, updates: Partial<TouristAttraction>) => Promise<void>;
  uploadImage: (file: File, attractionId: string) => Promise<string>;
  deleteImage: (imagePath: string) => Promise<void>;
  addActivity: (attractionId: string, activity: string) => Promise<void>;
  removeActivity: (attractionId: string, activityIndex: number) => Promise<void>;
}

export const useTouristAttractions = (): TouristAttractionsHook => {
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ... implementación
  
  return {
    attractions,
    loading,
    saving,
    uploading,
    error,
    loadAttractions,
    updateAttraction,
    uploadImage,
    deleteImage,
    addActivity,
    removeActivity
  };
};
```

### useVisualConfig
```typescript
// src/hooks/useVisualConfig.ts
interface VisualConfigHook {
  config: VisualConfig;
  loading: boolean;
  saving: boolean;
  
  loadConfig: () => Promise<void>;
  updateColorPalette: (colors: ColorPalette) => Promise<void>;
  updateNavbarConfig: (navbar: NavbarConfig) => Promise<void>;
  updateButtonStyles: (buttons: ButtonStyles) => Promise<void>;
  updateTypography: (typography: TypographyConfig) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  resetToDefaults: () => Promise<void>;
}

export const useVisualConfig = (): VisualConfigHook => {
  const [config, setConfig] = useState<VisualConfig>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // ... implementación
  
  return {
    config,
    loading,
    saving,
    loadConfig,
    updateColorPalette,
    updateNavbarConfig,
    updateButtonStyles,
    updateTypography,
    uploadLogo,
    resetToDefaults
  };
};
```

---

## 🎨 Configuración Visual

### Sistema de Tokens de Diseño
```css
/* src/index.css */
:root {
  /* Colores primarios */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  
  /* Colores del brand */
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  
  /* Estados */
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  
  /* Bordes y elementos */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  
  /* Radius */
  --radius: 0.5rem;
}

/* Tema oscuro */
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... resto de tokens en modo oscuro */
}
```

### Configuración de Tailwind
```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // ... resto de colores
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

## 📊 Gestión de Estado

### Zustand Store (Estado Global)
```typescript
// src/stores/useAppStore.ts
interface AppState {
  // UI State
  sidebarOpen: boolean;
  activeTab: string;
  theme: 'light' | 'dark' | 'system';
  
  // Content State
  siteContent: SiteContent[];
  attractions: TouristAttraction[];
  visualConfig: VisualConfig;
  
  // User State
  userPreferences: UserPreferences;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateSiteContent: (content: SiteContent[]) => void;
  updateAttractions: (attractions: TouristAttraction[]) => void;
  updateVisualConfig: (config: VisualConfig) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  activeTab: 'hero',
  theme: 'system',
  siteContent: [],
  attractions: [],
  visualConfig: {},
  userPreferences: {},
  
  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  updateSiteContent: (content) => set({ siteContent: content }),
  updateAttractions: (attractions) => set({ attractions }),
  updateVisualConfig: (config) => set({ visualConfig: config }),
}));
```

### React Query Configuration
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Queries personalizadas
export const useAttractionsQuery = () => {
  return useQuery({
    queryKey: ['attractions'],
    queryFn: touristAttractionsService.getAttractions,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSiteContentQuery = (section?: string) => {
  return useQuery({
    queryKey: ['siteContent', section],
    queryFn: () => contentService.getContent(section),
    enabled: !!section,
  });
};
```

---

## 🔒 Seguridad

### Autenticación JWT
```typescript
// Token handling automático por Supabase
// Los tokens se actualizan automáticamente
// Session persistence en localStorage
// PKCE flow para OAuth

// Verificación de roles en frontend
const useAdminAccess = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      supabase.rpc('is_admin', { _user_id: user.id })
        .then(({ data }) => setIsAdmin(data || false));
    }
  }, [user]);
  
  return isAdmin;
};
```

### Validación de Datos
```typescript
// src/utils/validation.ts
import { z } from 'zod';

// Esquemas de validación
export const attractionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1, 'La categoría es requerida'),
  image_url: z.string().url().optional(),
  activities: z.array(z.string()).optional(),
  gallery_images: z.array(z.string().url()).optional(),
});

export const contentSchema = z.object({
  section_name: z.string().min(1),
  content: z.record(z.any()),
});

export const userPermissionSchema = z.object({
  user_id: z.string().uuid(),
  section_name: z.string(),
  can_view: z.boolean(),
  can_edit: z.boolean(),
  can_delete: z.boolean(),
});

// Middleware de validación
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};
```

### Sanitización de Datos
```typescript
// src/utils/sanitization.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Eliminar caracteres HTML
    .replace(/javascript:/gi, '') // Eliminar javascript: URLs
    .slice(0, 1000); // Limitar longitud
};

export const sanitizeImageUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Solo permitir ciertas extensiones
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = allowedExtensions.some(ext => 
      parsed.pathname.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      throw new Error('Invalid image extension');
    }
    
    return parsed.toString();
  } catch {
    throw new Error('Invalid image URL');
  }
};
```

---

## 🚀 Despliegue y DevOps

### Configuración de Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
  },
  server: {
    port: 8080,
    host: true,
  },
});
```

### Variables de Entorno
```bash
# .env
VITE_SUPABASE_URL=https://lncxwvrcsuhphxxsvjod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# .env.production
VITE_SUPABASE_URL=https://lncxwvrcsuhphxxsvjod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Configuración de TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Scripts de Despliegue
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:production": "NODE_ENV=production tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 📈 Monitoreo y Logging

### Error Tracking
```typescript
// src/utils/errorTracking.ts
interface ErrorReport {
  message: string;
  stack?: string;
  user_id?: string;
  url: string;
  timestamp: string;
  user_agent: string;
  additional_data?: Record<string, any>;
}

export const reportError = async (error: Error, additionalData?: Record<string, any>) => {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    additional_data: additionalData,
  };
  
  try {
    // Log a Supabase para debugging interno
    await supabase.from('error_logs').insert(report);
    
    // También log a console en desarrollo
    if (import.meta.env.DEV) {
      console.error('Error reported:', report);
    }
  } catch (loggingError) {
    console.error('Failed to report error:', loggingError);
  }
};

// Error boundary
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    reportError(error, { errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    
    return this.props.children;
  }
}
```

### Performance Monitoring
```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => Promise<any>) => {
  return async (...args: any[]) => {
    const start = performance.now();
    
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      // Log performance metrics
      console.log(`⚡ ${name} completed in ${duration.toFixed(2)}ms`);
      
      // Report slow operations
      if (duration > 1000) {
        await supabase.from('performance_logs').insert({
          operation: name,
          duration,
          timestamp: new Date().toISOString(),
        });
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
};

// Hook para medir performance de componentes
export const usePerformanceTracker = (componentName: string) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      if (duration > 100) {
        console.log(`🐌 ${componentName} render took ${duration.toFixed(2)}ms`);
      }
    };
  });
};
```

---

## 🔧 Configuración de Desarrollo

### ESLint Configuration
```json
// eslint.config.js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## 📚 Testing Strategy

### Unit Testing Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ data: [], error: null })),
      insert: vi.fn(() => ({ data: [], error: null })),
      update: vi.fn(() => ({ data: [], error: null })),
      delete: vi.fn(() => ({ data: [], error: null })),
    })),
    auth: {
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(() => ({ data: { session: null }, error: null })),
    },
  },
}));
```

### Component Testing Example
```typescript
// src/components/dashboard/__tests__/AttractionsManager.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AttractionsManager from '../AttractionsManager';
import { AuthProvider } from '@/contexts/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('AttractionsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders attractions list', async () => {
    renderWithAuth(<AttractionsManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Atracciones')).toBeInTheDocument();
    });
  });
  
  it('allows editing attraction', async () => {
    renderWithAuth(<AttractionsManager />);
    
    const editButton = screen.getByTestId('edit-attraction-btn');
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('attraction-edit-form')).toBeInTheDocument();
    });
  });
  
  it('handles image upload', async () => {
    renderWithAuth(<AttractionsManager />);
    
    const fileInput = screen.getByTestId('image-upload');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Imagen subida exitosamente')).toBeInTheDocument();
    });
  });
});
```

---

## 🔄 Proceso de Actualización

### Database Migrations
```sql
-- Ejemplo de migración
-- supabase/migrations/20240117_add_attraction_rating.sql

-- Agregar columna de rating a atracciones
ALTER TABLE tourist_attractions 
ADD COLUMN rating DECIMAL(2,1) DEFAULT NULL,
ADD COLUMN rating_count INTEGER DEFAULT 0;

-- Agregar índice para mejorar performance
CREATE INDEX idx_tourist_attractions_rating ON tourist_attractions(rating DESC) 
WHERE rating IS NOT NULL;

-- Actualizar trigger para incluir nuevos campos en historial
CREATE OR REPLACE FUNCTION create_attraction_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO content_history (
      content_id, 
      section_name, 
      old_content, 
      new_content, 
      change_type, 
      changed_by
    )
    VALUES (
      NEW.id, 
      'tourist_attractions', 
      row_to_json(OLD), 
      row_to_json(NEW), 
      'update', 
      auth.uid()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### Version Control Strategy
```bash
# Feature branches
git checkout -b feature/new-attraction-rating
git commit -m "feat: add rating system to attractions"
git push origin feature/new-attraction-rating

# Release process
git checkout main
git merge feature/new-attraction-rating
git tag v1.1.0
git push origin main --tags

# Hotfix process
git checkout -b hotfix/fix-upload-bug
git commit -m "fix: resolve image upload issue"
git checkout main
git merge hotfix/fix-upload-bug
git tag v1.0.1
```

---

## 📖 Documentación de Referencia

### API Reference
- **Supabase JavaScript Client**: https://supabase.com/docs/reference/javascript
- **PostgreSQL Functions**: Documentación interna de funciones custom
- **React Query**: https://tanstack.com/query/latest
- **Radix UI**: https://radix-ui.com/primitives/docs/overview/introduction
- **Tailwind CSS**: https://tailwindcss.com/docs

### Enlaces Útiles
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lncxwvrcsuhphxxsvjod
- **Repository**: Enlaces internos del proyecto
- **Staging Environment**: URL del entorno de pruebas
- **Production Environment**: URL del entorno de producción

---

## 🎯 Roadmap y Mejoras Futuras

### Próximas Características
1. **Sistema de Comentarios y Reviews**
2. **Integración con Redes Sociales**
3. **Dashboard de Analytics Avanzado**
4. **Sistema de Notificaciones Push**
5. **API Pública para Desarrolladores**
6. **Mobile App Companion**
7. **Sistema de Reservas Avanzado**
8. **Integración con Sistemas de Pago**

### Optimizaciones Técnicas
1. **Implementación de Service Workers**
2. **Lazy Loading Mejorado**
3. **Caching Estratégico Avanzado**
4. **Optimización de Imágenes Automática**
5. **CDN Integration**
6. **Performance Monitoring Avanzado**

---

*Documentación generada el 2025-01-17*
*Versión del sistema: 1.0*
*Última actualización: Panel de Administración v1.0*