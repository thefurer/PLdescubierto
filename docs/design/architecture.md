
# Documentación de Arquitectura del Sistema

## 1. Vista General

### 1.1 Arquitectura del Sistema
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Supabase)    │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   CDN/Storage   │    │   Edge Functions│
│   (Supabase)    │    │   (Deno)        │
└─────────────────┘    └─────────────────┘
```

### 1.2 Tecnologías Principales
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui
- **State Management**: React Context + Zustand
- **Routing**: React Router DOM

## 2. Componentes Principales

### 2.1 Frontend Architecture
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── auth/           # Componentes de autenticación
│   ├── dashboard/      # Componentes del dashboard
│   └── profile/        # Componentes de perfil
├── pages/              # Páginas principales
├── contexts/           # Contextos de React
├── hooks/              # Custom hooks
├── utils/              # Utilidades y helpers
└── integrations/       # Integraciones externas
```

### 2.2 Patrones de Diseño Utilizados

#### 2.2.1 Context Pattern
- **AuthContext**: Manejo global del estado de autenticación
- **AccessibilityContext**: Configuración de accesibilidad

#### 2.2.2 Custom Hooks Pattern
- **useAuth**: Lógica de autenticación
- **useContentManager**: Gestión de contenido
- **useTouristAttractions**: Manejo de atracciones

#### 2.2.3 Component Composition Pattern
- Componentes pequeños y enfocados
- Composición sobre herencia
- Props drilling minimizado con contextos

## 3. Flujo de Datos

### 3.1 Autenticación
```
User Input → AuthForm → useAuth Hook → Supabase Auth → Context Update → UI Update
```

### 3.2 Gestión de Contenido
```
Admin Action → Dashboard → ContentManager → Supabase Database → UI Refresh
```

## 4. Seguridad

### 4.1 Medidas Implementadas
- Row Level Security (RLS) en Supabase
- Validación de entrada en formularios
- Autenticación JWT
- HTTPS obligatorio
- Sanitización de datos

### 4.2 Controles de Acceso
- Rutas protegidas con ProtectedRoute
- Verificación de roles de usuario
- Separación de permisos admin/usuario

## 5. Performance

### 5.1 Optimizaciones
- Code splitting con React.lazy
- Imágenes optimizadas
- Lazy loading de componentes
- Memoización con React.memo
- Debounce en búsquedas

### 5.2 Métricas Objetivo
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
