import html2pdf from 'html2pdf.js';

const generateTechnicalDocHTML = (): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1a1a2e;
          font-size: 11px;
        }
        
        .cover-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0c1929 0%, #1a365d 50%, #2c5282 100%);
          color: white;
          text-align: center;
          padding: 40px;
          page-break-after: always;
        }
        
        .cover-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          margin-bottom: 50px;
        }
        
        .cover-logo {
          width: 100px;
          height: auto;
          background: white;
          padding: 10px;
          border-radius: 10px;
        }
        
        .cover-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .cover-subtitle {
          font-size: 24px;
          margin-bottom: 30px;
          color: #90cdf4;
        }
        
        .cover-project {
          font-size: 18px;
          color: #a0aec0;
          margin-bottom: 60px;
        }
        
        .cover-info {
          margin-top: auto;
          font-size: 12px;
          color: #cbd5e0;
        }
        
        .content-page {
          padding: 30px 40px;
          min-height: 100vh;
        }
        
        h1 {
          color: #1a365d;
          font-size: 22px;
          border-bottom: 3px solid #3182ce;
          padding-bottom: 10px;
          margin: 25px 0 15px 0;
        }
        
        h2 {
          color: #2c5282;
          font-size: 16px;
          margin: 20px 0 10px 0;
          border-left: 4px solid #3182ce;
          padding-left: 10px;
        }
        
        h3 {
          color: #4a5568;
          font-size: 13px;
          margin: 15px 0 8px 0;
        }
        
        p {
          margin-bottom: 10px;
          text-align: justify;
        }
        
        .toc {
          background: #f7fafc;
          padding: 25px;
          border-radius: 10px;
          margin: 20px 0;
          page-break-after: always;
        }
        
        .toc-title {
          font-size: 20px;
          color: #1a365d;
          margin-bottom: 20px;
          text-align: center;
          border-bottom: 2px solid #3182ce;
          padding-bottom: 10px;
        }
        
        .toc-item {
          padding: 8px 0;
          border-bottom: 1px dashed #e2e8f0;
          display: flex;
          justify-content: space-between;
        }
        
        .toc-item:last-child {
          border-bottom: none;
        }
        
        .code-block {
          background: #1a202c;
          color: #e2e8f0;
          padding: 15px;
          border-radius: 8px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 9px;
          margin: 10px 0;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .code-comment {
          color: #68d391;
        }
        
        .code-keyword {
          color: #63b3ed;
        }
        
        .code-string {
          color: #fbd38d;
        }
        
        .section {
          page-break-inside: avoid;
          margin-bottom: 20px;
        }
        
        .info-box {
          background: linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%);
          border-left: 4px solid #3182ce;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .warning-box {
          background: linear-gradient(135deg, #fffaf0 0%, #fefcbf 100%);
          border-left: 4px solid #d69e2e;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .table-container {
          overflow-x: auto;
          margin: 15px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        th {
          background: #2c5282;
          color: white;
          padding: 10px;
          text-align: left;
        }
        
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        tr:nth-child(even) {
          background: #f7fafc;
        }
        
        .architecture-diagram {
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
          margin: 15px 0;
          text-align: center;
        }
        
        .diagram-box {
          display: inline-block;
          background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
          color: white;
          padding: 10px 20px;
          margin: 5px;
          border-radius: 8px;
          font-size: 10px;
        }
        
        .diagram-arrow {
          color: #4a5568;
          font-size: 16px;
          margin: 0 5px;
        }
        
        ul, ol {
          margin-left: 20px;
          margin-bottom: 10px;
        }
        
        li {
          margin-bottom: 5px;
        }
        
        .footer-page {
          text-align: center;
          padding: 20px;
          color: #718096;
          font-size: 10px;
          border-top: 1px solid #e2e8f0;
          margin-top: 30px;
        }
        
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 9px;
          margin: 2px;
        }
        
        .badge-blue {
          background: #ebf8ff;
          color: #2c5282;
        }
        
        .badge-green {
          background: #f0fff4;
          color: #276749;
        }
        
        .badge-purple {
          background: #faf5ff;
          color: #553c9a;
        }
      </style>
    </head>
    <body>
      <!-- PORTADA -->
      <div class="cover-page">
        <div class="cover-logos">
          <img src="/images/logos/unesum-cti.png" alt="UNESUM CTI" class="cover-logo" />
          <img src="/images/logos/gad-puerto-lopez.png" alt="GAD Puerto López" class="cover-logo" />
          <img src="/images/logos/smart-city-core.png" alt="Smart City Core" class="cover-logo" />
        </div>
        <div class="cover-title">📋 Documentación Técnica</div>
        <div class="cover-subtitle">Panel de Administración</div>
        <div class="cover-project">Puerto López Descubierto</div>
        <div class="cover-info">
          <p><strong>Versión:</strong> 1.0</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Tipo:</strong> Documentación para Desarrolladores</p>
        </div>
      </div>

      <!-- TABLA DE CONTENIDOS -->
      <div class="content-page">
        <div class="toc">
          <div class="toc-title">📑 Tabla de Contenidos</div>
          <div class="toc-item"><span>1. Arquitectura General</span><span>3</span></div>
          <div class="toc-item"><span>2. Estructura de Archivos</span><span>4</span></div>
          <div class="toc-item"><span>3. Componentes Principales</span><span>5</span></div>
          <div class="toc-item"><span>4. Sistema de Autenticación</span><span>6</span></div>
          <div class="toc-item"><span>5. Base de Datos</span><span>7</span></div>
          <div class="toc-item"><span>6. APIs y Servicios</span><span>9</span></div>
          <div class="toc-item"><span>7. Hooks Personalizados</span><span>10</span></div>
          <div class="toc-item"><span>8. Configuración Visual</span><span>11</span></div>
          <div class="toc-item"><span>9. Gestión de Estado</span><span>12</span></div>
          <div class="toc-item"><span>10. Seguridad</span><span>13</span></div>
          <div class="toc-item"><span>11. Despliegue y DevOps</span><span>14</span></div>
        </div>
      </div>

      <!-- ARQUITECTURA GENERAL -->
      <div class="content-page">
        <h1>🏗️ 1. Arquitectura General</h1>
        
        <h2>Stack Tecnológico</h2>
        
        <div class="section">
          <h3>Frontend</h3>
          <div class="table-container">
            <table>
              <tr>
                <th>Tecnología</th>
                <th>Versión</th>
                <th>Propósito</th>
              </tr>
              <tr>
                <td><span class="badge badge-blue">React</span></td>
                <td>18.3.1</td>
                <td>Framework principal de UI</td>
              </tr>
              <tr>
                <td><span class="badge badge-blue">TypeScript</span></td>
                <td>5.x</td>
                <td>Tipado estático</td>
              </tr>
              <tr>
                <td><span class="badge badge-blue">Vite</span></td>
                <td>5.x</td>
                <td>Build tool y dev server</td>
              </tr>
              <tr>
                <td><span class="badge badge-blue">Tailwind CSS</span></td>
                <td>3.x</td>
                <td>Framework CSS utilitario</td>
              </tr>
              <tr>
                <td><span class="badge badge-blue">shadcn/ui</span></td>
                <td>Latest</td>
                <td>Sistema de componentes</td>
              </tr>
            </table>
          </div>
        </div>
        
        <div class="section">
          <h3>Backend</h3>
          <div class="table-container">
            <table>
              <tr>
                <th>Tecnología</th>
                <th>Propósito</th>
              </tr>
              <tr>
                <td><span class="badge badge-green">Supabase</span></td>
                <td>Backend as a Service (BaaS)</td>
              </tr>
              <tr>
                <td><span class="badge badge-green">PostgreSQL 15</span></td>
                <td>Base de datos principal</td>
              </tr>
              <tr>
                <td><span class="badge badge-green">Edge Functions</span></td>
                <td>Serverless functions</td>
              </tr>
              <tr>
                <td><span class="badge badge-green">Supabase Auth</span></td>
                <td>Sistema de autenticación</td>
              </tr>
              <tr>
                <td><span class="badge badge-green">Supabase Storage</span></td>
                <td>Almacenamiento de archivos</td>
              </tr>
            </table>
          </div>
        </div>

        <h2>Patrón Arquitectónico</h2>
        <div class="info-box">
          <p><strong>MVC Modificado:</strong></p>
          <ul>
            <li><strong>Model:</strong> Supabase (PostgreSQL)</li>
            <li><strong>View:</strong> React Components</li>
            <li><strong>Controller:</strong> Hooks y Services</li>
          </ul>
        </div>

        <div class="architecture-diagram">
          <div class="diagram-box">Usuario</div>
          <span class="diagram-arrow">→</span>
          <div class="diagram-box">React UI</div>
          <span class="diagram-arrow">→</span>
          <div class="diagram-box">Hooks</div>
          <span class="diagram-arrow">→</span>
          <div class="diagram-box">Supabase</div>
          <span class="diagram-arrow">→</span>
          <div class="diagram-box">PostgreSQL</div>
        </div>
      </div>

      <!-- ESTRUCTURA DE ARCHIVOS -->
      <div class="content-page">
        <h1>📁 2. Estructura de Archivos</h1>
        
        <div class="code-block">
src/
├── components/
│   ├── dashboard/           <span class="code-comment"># Componentes del panel admin</span>
│   │   ├── layout/          <span class="code-comment"># Layout y navegación</span>
│   │   ├── attractions/     <span class="code-comment"># Gestión de atracciones</span>
│   │   ├── content-editor/  <span class="code-comment"># Editor de contenido</span>
│   │   ├── visual-design/   <span class="code-comment"># Diseño visual</span>
│   │   ├── admin/           <span class="code-comment"># Gestión de usuarios</span>
│   │   └── travel-guide/    <span class="code-comment"># Guía de viaje</span>
│   ├── ui/                  <span class="code-comment"># Componentes shadcn/ui</span>
│   ├── auth/                <span class="code-comment"># Componentes de autenticación</span>
│   └── shared/              <span class="code-comment"># Componentes compartidos</span>
├── hooks/                   <span class="code-comment"># Custom hooks</span>
├── services/                <span class="code-comment"># Servicios de API</span>
├── contexts/                <span class="code-comment"># React contexts</span>
├── types/                   <span class="code-comment"># Definiciones TypeScript</span>
├── utils/                   <span class="code-comment"># Utilidades</span>
├── pages/                   <span class="code-comment"># Páginas principales</span>
└── integrations/
    └── supabase/            <span class="code-comment"># Configuración Supabase</span>
        </div>
      </div>

      <!-- COMPONENTES PRINCIPALES -->
      <div class="content-page">
        <h1>🔧 3. Componentes Principales</h1>
        
        <h2>Dashboard Principal</h2>
        <div class="code-block">
<span class="code-comment">// src/pages/Dashboard.tsx</span>
<span class="code-keyword">interface</span> DashboardProps {
  activeTab: <span class="code-string">string</span>;
  setActiveTab: (tab: <span class="code-string">string</span>) => <span class="code-keyword">void</span>;
  sidebarOpen: <span class="code-string">boolean</span>;
  setSidebarOpen: (open: <span class="code-string">boolean</span>) => <span class="code-keyword">void</span>;
}

<span class="code-comment">// Navegación disponible</span>
<span class="code-keyword">const</span> navigationItems = [
  { id: <span class="code-string">'hero'</span>, label: <span class="code-string">'Sección de Portada'</span>, icon: Home },
  { id: <span class="code-string">'footer'</span>, label: <span class="code-string">'Pie de Página'</span>, icon: FileText },
  { id: <span class="code-string">'attractions'</span>, label: <span class="code-string">'Gestión de Atracciones'</span>, icon: MapPin },
  { id: <span class="code-string">'travel-guide'</span>, label: <span class="code-string">'Guía de Viaje'</span>, icon: Map },
  { id: <span class="code-string">'visual-design'</span>, label: <span class="code-string">'Diseño Visual'</span>, icon: Palette },
  { id: <span class="code-string">'admin'</span>, label: <span class="code-string">'Gestión de Admins'</span>, icon: Shield },
  { id: <span class="code-string">'history'</span>, label: <span class="code-string">'Historial'</span>, icon: History },
  { id: <span class="code-string">'profile'</span>, label: <span class="code-string">'Mi Perfil'</span>, icon: User }
];
        </div>

        <h2>Gestión de Atracciones</h2>
        <div class="info-box">
          <p>El componente <strong>AttractionsManager</strong> permite:</p>
          <ul>
            <li>Crear, editar y eliminar atracciones turísticas</li>
            <li>Gestionar galerías de imágenes</li>
            <li>Configurar actividades y recomendaciones</li>
            <li>Definir horarios y ubicación</li>
          </ul>
        </div>

        <h2>Editor de Contenido</h2>
        <div class="code-block">
<span class="code-comment">// Secciones editables</span>
<span class="code-keyword">type</span> ContentSection = <span class="code-string">'hero'</span> | <span class="code-string">'footer'</span>;

<span class="code-keyword">interface</span> ContentEditorProps {
  filterSection: ContentSection;
}
        </div>
      </div>

      <!-- SISTEMA DE AUTENTICACIÓN -->
      <div class="content-page">
        <h1>🔐 4. Sistema de Autenticación</h1>
        
        <h2>Context de Autenticación</h2>
        <div class="code-block">
<span class="code-comment">// src/contexts/AuthContext.tsx</span>
<span class="code-keyword">interface</span> AuthContextType {
  user: User | <span class="code-keyword">null</span>;
  session: Session | <span class="code-keyword">null</span>;
  loading: <span class="code-string">boolean</span>;
  signUp: (email, password, userData?) => Promise&lt;AuthResponse&gt;;
  signIn: (email, password) => Promise&lt;AuthResponse&gt;;
  signOut: () => Promise&lt;<span class="code-keyword">void</span>&gt;;
  resetPassword: (email) => Promise&lt;AuthResponse&gt;;
  updatePassword: (password) => Promise&lt;AuthResponse&gt;;
}
        </div>

        <h2>Sistema de Roles</h2>
        <div class="table-container">
          <table>
            <tr>
              <th>Rol</th>
              <th>Descripción</th>
              <th>Permisos</th>
            </tr>
            <tr>
              <td><span class="badge badge-purple">admin</span></td>
              <td>Administrador completo</td>
              <td>Acceso total al panel</td>
            </tr>
            <tr>
              <td><span class="badge badge-blue">moderator</span></td>
              <td>Moderador de contenido</td>
              <td>Edición limitada</td>
            </tr>
            <tr>
              <td><span class="badge badge-green">user</span></td>
              <td>Usuario regular</td>
              <td>Solo lectura pública</td>
            </tr>
          </table>
        </div>

        <h2>Funciones de Verificación</h2>
        <div class="code-block">
<span class="code-comment">-- Funciones SQL de verificación</span>
<span class="code-keyword">FUNCTION</span> is_admin(user_id: uuid): <span class="code-string">boolean</span>
<span class="code-keyword">FUNCTION</span> is_main_admin(user_id: uuid): <span class="code-string">boolean</span>
<span class="code-keyword">FUNCTION</span> has_section_permission(user_id, section, type): <span class="code-string">boolean</span>
        </div>
      </div>

      <!-- BASE DE DATOS -->
      <div class="content-page">
        <h1>🗃️ 5. Base de Datos</h1>
        
        <h2>Tablas Principales</h2>
        
        <div class="section">
          <h3>site_content</h3>
          <div class="code-block">
<span class="code-keyword">CREATE TABLE</span> site_content (
  id UUID <span class="code-keyword">PRIMARY KEY DEFAULT</span> gen_random_uuid(),
  section_name TEXT <span class="code-keyword">NOT NULL</span>,
  content JSONB <span class="code-keyword">NOT NULL</span>,
  updated_by UUID <span class="code-keyword">REFERENCES</span> auth.users(id),
  created_at TIMESTAMPTZ <span class="code-keyword">DEFAULT</span> now(),
  updated_at TIMESTAMPTZ <span class="code-keyword">DEFAULT</span> now()
);
          </div>
        </div>

        <div class="section">
          <h3>tourist_attractions</h3>
          <div class="code-block">
<span class="code-keyword">CREATE TABLE</span> tourist_attractions (
  id UUID <span class="code-keyword">PRIMARY KEY</span>,
  name TEXT <span class="code-keyword">NOT NULL</span>,
  description TEXT,
  category TEXT <span class="code-keyword">NOT NULL</span>,
  image_url TEXT,
  gallery_images TEXT[],
  activities TEXT[],
  recommendations JSONB,
  coordinates JSONB,
  is_active BOOLEAN <span class="code-keyword">DEFAULT</span> true
);
          </div>
        </div>

        <h2>Políticas RLS</h2>
        <div class="warning-box">
          <p><strong>⚠️ Seguridad:</strong> Todas las tablas tienen Row Level Security (RLS) activado para proteger los datos.</p>
        </div>
        
        <div class="code-block">
<span class="code-comment">-- Solo admins pueden gestionar contenido</span>
<span class="code-keyword">CREATE POLICY</span> <span class="code-string">"Only admins can manage"</span> 
<span class="code-keyword">ON</span> site_content <span class="code-keyword">FOR ALL</span> 
<span class="code-keyword">USING</span> (is_admin(auth.uid()));

<span class="code-comment">-- Público puede ver contenido activo</span>
<span class="code-keyword">CREATE POLICY</span> <span class="code-string">"Public can view"</span> 
<span class="code-keyword">ON</span> site_content <span class="code-keyword">FOR SELECT</span> 
<span class="code-keyword">USING</span> (true);
        </div>
      </div>

      <!-- APIs Y SERVICIOS -->
      <div class="content-page">
        <h1>🔌 6. APIs y Servicios</h1>
        
        <h2>Cliente Supabase</h2>
        <div class="code-block">
<span class="code-comment">// src/integrations/supabase/client.ts</span>
<span class="code-keyword">import</span> { createClient } <span class="code-keyword">from</span> <span class="code-string">'@supabase/supabase-js'</span>;

<span class="code-keyword">export const</span> supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      autoRefreshToken: <span class="code-keyword">true</span>,
      persistSession: <span class="code-keyword">true</span>,
      detectSessionInUrl: <span class="code-keyword">true</span>
    }
  }
);
        </div>

        <h2>Servicio de Atracciones</h2>
        <div class="code-block">
<span class="code-comment">// Operaciones disponibles</span>
getAttractions(): Promise&lt;TouristAttraction[]&gt;
updateAttraction(id, updates): Promise&lt;<span class="code-keyword">void</span>&gt;
uploadImage(file, attractionId): Promise&lt;<span class="code-string">string</span>&gt;
deleteImage(imagePath): Promise&lt;<span class="code-keyword">void</span>&gt;
        </div>

        <h2>Edge Functions</h2>
        <div class="table-container">
          <table>
            <tr>
              <th>Función</th>
              <th>Descripción</th>
            </tr>
            <tr>
              <td>chat-support</td>
              <td>Chatbot IA (Ballenita)</td>
            </tr>
            <tr>
              <td>contact-form</td>
              <td>Procesamiento de formulario de contacto</td>
            </tr>
            <tr>
              <td>google-maps-embed</td>
              <td>Generación de embeds de Google Maps</td>
            </tr>
            <tr>
              <td>analytics-chat</td>
              <td>Chat de análisis con IA</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- HOOKS PERSONALIZADOS -->
      <div class="content-page">
        <h1>🪝 7. Hooks Personalizados</h1>
        
        <h2>Hooks Disponibles</h2>
        <div class="table-container">
          <table>
            <tr>
              <th>Hook</th>
              <th>Propósito</th>
            </tr>
            <tr>
              <td><code>useAdminManagement</code></td>
              <td>Gestión de administradores y permisos</td>
            </tr>
            <tr>
              <td><code>useTouristAttractions</code></td>
              <td>CRUD de atracciones turísticas</td>
            </tr>
            <tr>
              <td><code>useContentManager</code></td>
              <td>Gestión de contenido del sitio</td>
            </tr>
            <tr>
              <td><code>useVisualConfig</code></td>
              <td>Configuración visual del sitio</td>
            </tr>
            <tr>
              <td><code>useAuthContext</code></td>
              <td>Acceso al contexto de autenticación</td>
            </tr>
            <tr>
              <td><code>useGalleryManager</code></td>
              <td>Gestión de imágenes de galería</td>
            </tr>
            <tr>
              <td><code>useContentHistory</code></td>
              <td>Historial de cambios de contenido</td>
            </tr>
          </table>
        </div>

        <h2>Ejemplo de Uso</h2>
        <div class="code-block">
<span class="code-keyword">const</span> { 
  attractions, 
  loading, 
  updateAttraction 
} = useTouristAttractions();

<span class="code-keyword">const</span> handleSave = <span class="code-keyword">async</span> (id, data) => {
  <span class="code-keyword">await</span> updateAttraction(id, data);
  toast.success(<span class="code-string">'Guardado exitosamente'</span>);
};
        </div>
      </div>

      <!-- SEGURIDAD -->
      <div class="content-page">
        <h1>🔒 10. Seguridad</h1>
        
        <h2>Medidas Implementadas</h2>
        <ul>
          <li><strong>Row Level Security (RLS):</strong> Políticas de acceso a nivel de fila en PostgreSQL</li>
          <li><strong>JWT Tokens:</strong> Autenticación basada en tokens seguros</li>
          <li><strong>Email Autorizado:</strong> Sistema de lista blanca para registro</li>
          <li><strong>Validación de Entrada:</strong> Sanitización de datos en cliente y servidor</li>
          <li><strong>HTTPS:</strong> Comunicación encriptada</li>
          <li><strong>CORS:</strong> Control de orígenes permitidos</li>
        </ul>

        <h2>Buenas Prácticas</h2>
        <div class="warning-box">
          <ul>
            <li>Nunca exponer claves de API en el cliente</li>
            <li>Validar permisos en cada operación de escritura</li>
            <li>Usar prepared statements para consultas SQL</li>
            <li>Implementar rate limiting en Edge Functions</li>
            <li>Mantener logs de auditoría de acciones administrativas</li>
          </ul>
        </div>
      </div>

      <!-- PIE DE PÁGINA -->
      <div class="footer-page">
        <p><strong>Puerto López Descubierto - Documentación Técnica v1.0</strong></p>
        <p>UNESUM - Carrera de Tecnología de la Información</p>
        <p>GAD Municipal de Puerto López | Smart City Core</p>
        <p>Documento generado el ${new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </body>
    </html>
  `;
};

export const generateTechnicalDocPDF = async (): Promise<void> => {
  const htmlContent = generateTechnicalDocHTML();
  
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const options = {
    margin: [10, 10, 10, 10],
    filename: 'Puerto_Lopez_Documentacion_Tecnica.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(options).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
};
