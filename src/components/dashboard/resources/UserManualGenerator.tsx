import html2pdf from 'html2pdf.js';

const generateManualHTML = () => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a365d; line-height: 1.6;">
      <!-- PORTADA -->
      <div style="page-break-after: always; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #0077b6 0%, #00a896 50%, #028090 100%); color: white; padding: 40px;">
        <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 40px; flex-wrap: wrap;">
          <img src="/images/logos/unesum-cti.png" alt="UNESUM CTI" style="height: 80px; object-fit: contain;" />
          <img src="/images/logos/gad-puerto-lopez.png" alt="GAD Puerto López" style="height: 80px; object-fit: contain;" />
          <img src="/images/logos/smart-city-core.png" alt="Smart City Core" style="height: 80px; object-fit: contain;" />
        </div>
        <h1 style="font-size: 42px; font-weight: 700; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">MANUAL DE USUARIO</h1>
        <h2 style="font-size: 28px; font-weight: 400; margin: 10px 0; opacity: 0.95;">Puerto López Descubierto</h2>
        <p style="font-size: 18px; margin-top: 30px; opacity: 0.9;">Plataforma Turística Inteligente</p>
        <div style="margin-top: 60px; padding: 20px; background: rgba(255,255,255,0.15); border-radius: 10px;">
          <p style="font-size: 14px; margin: 5px 0;">Versión 1.0</p>
          <p style="font-size: 14px; margin: 5px 0;">${new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      <!-- ÍNDICE -->
      <div style="page-break-after: always; padding: 40px;">
        <h2 style="color: #0077b6; border-bottom: 3px solid #0077b6; padding-bottom: 10px; font-size: 28px;">📋 Índice de Contenidos</h2>
        <div style="margin-top: 30px;">
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 600;">1. Introducción</span>
            <span style="float: right; color: #718096;">3</span>
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 600;">2. Página Principal</span>
            <span style="float: right; color: #718096;">4</span>
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            2.1 Navegación y Menú
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            2.2 Sección Principal (Hero)
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            2.3 Atracciones Turísticas
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            2.4 Tour Virtual / Metaverso
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            2.5 Asistente Ballenita
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 600;">3. Panel de Administración</span>
            <span style="float: right; color: #718096;">8</span>
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            3.1 Acceso al Dashboard
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            3.2 Sección de Portada
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            3.3 Gestión de Atracciones
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            3.4 Guía de Viaje
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            3.5 Diseño Visual
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; padding-left: 20px; color: #4a5568;">
            3.6 Gestión de Administradores
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 600;">4. Preguntas Frecuentes</span>
            <span style="float: right; color: #718096;">14</span>
          </div>
          <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 600;">5. Créditos</span>
            <span style="float: right; color: #718096;">15</span>
          </div>
        </div>
      </div>

      <!-- CAPÍTULO 1: INTRODUCCIÓN -->
      <div style="page-break-after: always; padding: 40px;">
        <h2 style="color: #0077b6; border-bottom: 3px solid #0077b6; padding-bottom: 10px; font-size: 28px;">1. Introducción</h2>
        
        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">¿Qué es Puerto López Descubierto?</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Puerto López Descubierto es una plataforma turística inteligente diseñada para promover y facilitar el turismo 
          en el cantón Puerto López, ubicado en la provincia de Manabí, Ecuador. Esta herramienta digital permite a 
          visitantes y turistas explorar las maravillas naturales de la zona, incluyendo el avistamiento de ballenas 
          jorobadas, playas paradisíacas, el Parque Nacional Machalilla y la famosa Isla de la Plata.
        </p>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">Objetivo del Sistema</h3>
        <p style="text-align: justify; margin: 15px 0;">
          El objetivo principal es proporcionar información turística actualizada y de calidad, facilitando la 
          planificación de viajes y promoviendo el turismo sostenible en la región. La plataforma cuenta con:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Información detallada de atracciones turísticas</li>
          <li style="margin: 8px 0;">Asistente virtual inteligente (Ballenita)</li>
          <li style="margin: 8px 0;">Experiencia de Metaverso para exploración virtual</li>
          <li style="margin: 8px 0;">Guía de viaje con consejos y recomendaciones</li>
          <li style="margin: 8px 0;">Sistema de testimonios de visitantes</li>
          <li style="margin: 8px 0;">Herramientas de accesibilidad avanzadas</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">Requisitos de Acceso</h3>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0077b6; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Para usuarios:</strong> Navegador web moderno (Chrome, Firefox, Safari, Edge)</p>
          <p style="margin: 5px 0;"><strong>Para administradores:</strong> Cuenta autorizada con credenciales de acceso</p>
          <p style="margin: 5px 0;"><strong>Conexión:</strong> Internet estable para acceso completo a funcionalidades</p>
        </div>
      </div>

      <!-- CAPÍTULO 2: PÁGINA PRINCIPAL -->
      <div style="page-break-after: always; padding: 40px;">
        <h2 style="color: #0077b6; border-bottom: 3px solid #0077b6; padding-bottom: 10px; font-size: 28px;">2. Página Principal</h2>
        
        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">2.1 Navegación y Menú</h3>
        <p style="text-align: justify; margin: 15px 0;">
          La barra de navegación superior permite acceder a todas las secciones principales:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;"><strong>Inicio:</strong> Página principal con información destacada</li>
          <li style="margin: 8px 0;"><strong>Atracciones:</strong> Catálogo completo de lugares turísticos</li>
          <li style="margin: 8px 0;"><strong>Guía de Viaje:</strong> Consejos, transporte y recomendaciones</li>
          <li style="margin: 8px 0;"><strong>Blog:</strong> Artículos y noticias turísticas</li>
          <li style="margin: 8px 0;"><strong>Testimonios:</strong> Experiencias de visitantes</li>
          <li style="margin: 8px 0;"><strong>Contacto:</strong> Formulario de contacto directo</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">2.2 Sección Principal (Hero)</h3>
        <p style="text-align: justify; margin: 15px 0;">
          La sección hero muestra una impactante imagen de Puerto López con un mensaje de bienvenida. 
          Incluye botones de acción rápida para explorar las principales funcionalidades de la plataforma.
        </p>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">2.3 Atracciones Turísticas</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Presenta un catálogo visual de las principales atracciones organizadas por categorías:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;"><strong>Playas:</strong> Los Frailes, Playa Tortuguita, entre otras</li>
          <li style="margin: 8px 0;"><strong>Naturaleza:</strong> Parque Nacional Machalilla, Isla de la Plata</li>
          <li style="margin: 8px 0;"><strong>Aventura:</strong> Avistamiento de ballenas, snorkeling, buceo</li>
          <li style="margin: 8px 0;"><strong>Cultura:</strong> Museo Salango, comunidades ancestrales</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">2.4 Tour Virtual / Metaverso</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Una experiencia inmersiva en versión beta que permite explorar Puerto López de forma virtual. 
          Los usuarios pueden navegar por diferentes ubicaciones y obtener una vista previa de los 
          destinos antes de su visita física.
        </p>
        <div style="background: #fffbeb; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 15px 0;">
          <p style="margin: 0;"><strong>⚠️ Nota:</strong> Esta función está en fase beta y se actualiza constantemente 
          para mejorar la experiencia del usuario.</p>
        </div>
      </div>

      <!-- CAPÍTULO 2 CONTINUACIÓN -->
      <div style="page-break-after: always; padding: 40px;">
        <h3 style="color: #00a896; margin-top: 20px; font-size: 20px;">2.5 Asistente Ballenita</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Ballenita es el asistente virtual con inteligencia artificial que ayuda a los visitantes 
          con información sobre Puerto López. Características principales:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;"><strong>Chat interactivo:</strong> Responde preguntas sobre turismo local</li>
          <li style="margin: 8px 0;"><strong>Navegación asistida:</strong> Guía rápida a secciones del sitio</li>
          <li style="margin: 8px 0;"><strong>Reconocimiento de voz:</strong> Permite dictar mensajes con el micrófono</li>
          <li style="margin: 8px 0;"><strong>Recomendaciones personalizadas:</strong> Sugiere atracciones según intereses</li>
        </ul>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981; margin: 15px 0;">
          <p style="margin: 0;"><strong>💡 Tip:</strong> Accede a Ballenita haciendo clic en el ícono de ballena 
          flotante en la esquina inferior derecha de la pantalla.</p>
        </div>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">2.6 Widget de Accesibilidad</h3>
        <p style="text-align: justify; margin: 15px 0;">
          La plataforma cuenta con herramientas de accesibilidad para garantizar que todos los usuarios 
          puedan disfrutar del contenido:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Ajuste de tamaño de fuente (pequeña, mediana, grande, extra grande)</li>
          <li style="margin: 8px 0;">Modo de alto contraste</li>
          <li style="margin: 8px 0;">Subrayado de enlaces</li>
          <li style="margin: 8px 0;">Reducción de movimiento para animaciones</li>
          <li style="margin: 8px 0;">Indicadores de foco mejorados</li>
          <li style="margin: 8px 0;">Cambio de idioma (Español/Inglés)</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">2.7 Testimonios y Galería</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Los visitantes pueden leer experiencias de otros turistas y ver fotografías de los 
          destinos. Esta sección ayuda a generar confianza y expectativas realistas sobre 
          las atracciones de Puerto López.
        </p>
      </div>

      <!-- CAPÍTULO 3: PANEL DE ADMINISTRACIÓN -->
      <div style="page-break-after: always; padding: 40px;">
        <h2 style="color: #0077b6; border-bottom: 3px solid #0077b6; padding-bottom: 10px; font-size: 28px;">3. Panel de Administración</h2>
        
        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.1 Acceso al Dashboard</h3>
        <p style="text-align: justify; margin: 15px 0;">
          El panel de administración es accesible únicamente para usuarios autorizados. Para acceder:
        </p>
        <ol style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Navegar a la sección de inicio de sesión</li>
          <li style="margin: 8px 0;">Ingresar credenciales autorizadas (email y contraseña)</li>
          <li style="margin: 8px 0;">El sistema redirigirá automáticamente al dashboard</li>
        </ol>
        <div style="background: #fef2f2; padding: 20px; border-radius: 10px; border-left: 4px solid #ef4444; margin: 15px 0;">
          <p style="margin: 0;"><strong>🔒 Seguridad:</strong> Solo los emails previamente autorizados por un 
          administrador principal pueden registrarse en el sistema.</p>
        </div>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.2 Sección de Portada (Hero)</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Permite modificar el contenido de la sección principal de la página de inicio:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Título principal y subtítulo</li>
          <li style="margin: 8px 0;">Texto del botón de acción</li>
          <li style="margin: 8px 0;">Imagen de fondo (URL)</li>
          <li style="margin: 8px 0;">Enlace del botón</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.3 Pie de Página (Footer)</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Gestiona la información mostrada en el pie de página:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Información de contacto</li>
          <li style="margin: 8px 0;">Enlaces a redes sociales</li>
          <li style="margin: 8px 0;">Descripción de la plataforma</li>
          <li style="margin: 8px 0;">Texto de copyright</li>
        </ul>
      </div>

      <!-- CAPÍTULO 3 CONTINUACIÓN -->
      <div style="page-break-after: always; padding: 40px;">
        <h3 style="color: #00a896; margin-top: 20px; font-size: 20px;">3.4 Gestión de Atracciones</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Esta sección permite administrar el catálogo completo de atracciones turísticas:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr style="background: #0077b6; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Función</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Descripción</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Crear</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Agregar nuevas atracciones con nombre, descripción, categoría e imágenes</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Editar</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Modificar información existente de cualquier atracción</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Activar/Desactivar</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Controlar la visibilidad de atracciones en el sitio público</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Galería</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Gestionar imágenes de cada atracción</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Horarios</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Configurar horarios de operación</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #ddd;"><strong>Recomendaciones</strong></td>
            <td style="padding: 12px; border: 1px solid #ddd;">Agregar tips y recomendaciones para visitantes</td>
          </tr>
        </table>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.5 Guía de Viaje</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Administra el contenido de la guía de viaje:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;"><strong>Puntos de viaje:</strong> Lugares destacados con descripción</li>
          <li style="margin: 8px 0;"><strong>Opciones de transporte:</strong> Buses, taxis, vuelos, etc.</li>
          <li style="margin: 8px 0;"><strong>Consejos de viaje:</strong> Recomendaciones prácticas para visitantes</li>
        </ul>
      </div>

      <!-- CAPÍTULO 3 CONTINUACIÓN 2 -->
      <div style="page-break-after: always; padding: 40px;">
        <h3 style="color: #00a896; margin-top: 20px; font-size: 20px;">3.6 Diseño Visual y Ajustes</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Personaliza la apariencia visual de toda la plataforma:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;"><strong>Paleta de colores:</strong> Modifica los colores principales del sitio</li>
          <li style="margin: 8px 0;"><strong>Tipografía:</strong> Selecciona fuentes para títulos y texto</li>
          <li style="margin: 8px 0;"><strong>Logo:</strong> Sube y configura el logo del sitio</li>
          <li style="margin: 8px 0;"><strong>Estilos de botones:</strong> Personaliza la apariencia de botones</li>
          <li style="margin: 8px 0;"><strong>Navbar:</strong> Configura colores y estilos de la navegación</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.7 Gestión de Administradores</h3>
        <p style="text-align: justify; margin: 15px 0;">
          El administrador principal puede gestionar otros usuarios:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;"><strong>Autorizar emails:</strong> Permitir que nuevos usuarios se registren</li>
          <li style="margin: 8px 0;"><strong>Asignar permisos:</strong> Definir qué secciones puede editar cada admin</li>
          <li style="margin: 8px 0;"><strong>Revocar acceso:</strong> Desactivar usuarios cuando sea necesario</li>
          <li style="margin: 8px 0;"><strong>Ver actividad:</strong> Monitorear acciones de otros administradores</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.8 Historial de Cambios</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Registro completo de todas las modificaciones realizadas en el sistema:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Fecha y hora de cada cambio</li>
          <li style="margin: 8px 0;">Usuario que realizó la modificación</li>
          <li style="margin: 8px 0;">Tipo de acción (crear, editar, eliminar)</li>
          <li style="margin: 8px 0;">Detalles del contenido modificado</li>
        </ul>

        <h3 style="color: #00a896; margin-top: 30px; font-size: 20px;">3.9 Mi Perfil</h3>
        <p style="text-align: justify; margin: 15px 0;">
          Cada administrador puede gestionar su información personal:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li style="margin: 8px 0;">Actualizar nombre y foto de perfil</li>
          <li style="margin: 8px 0;">Cambiar contraseña</li>
          <li style="margin: 8px 0;">Agregar información de contacto</li>
          <li style="margin: 8px 0;">Ver historial de actividad personal</li>
        </ul>
      </div>

      <!-- CAPÍTULO 4: FAQ -->
      <div style="page-break-after: always; padding: 40px;">
        <h2 style="color: #0077b6; border-bottom: 3px solid #0077b6; padding-bottom: 10px; font-size: 28px;">4. Preguntas Frecuentes</h2>
        
        <div style="margin-top: 30px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: #0077b6; margin-bottom: 10px;">¿Cómo puedo obtener acceso al panel de administración?</p>
            <p style="margin: 0; color: #4a5568;">Debe contactar al administrador principal para que autorice su email. Una vez autorizado, podrá registrarse con su email y crear una contraseña.</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: #0077b6; margin-bottom: 10px;">¿Los cambios que hago se publican inmediatamente?</p>
            <p style="margin: 0; color: #4a5568;">Sí, todos los cambios guardados en el panel de administración se reflejan instantáneamente en el sitio público.</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: #0077b6; margin-bottom: 10px;">¿Puedo recuperar contenido eliminado?</p>
            <p style="margin: 0; color: #4a5568;">El historial de cambios permite ver el contenido anterior, pero la recuperación automática no está disponible. Se recomienda precaución al eliminar contenido.</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: #0077b6; margin-bottom: 10px;">¿Qué formatos de imagen son compatibles?</p>
            <p style="margin: 0; color: #4a5568;">Se aceptan imágenes en formato JPG, PNG y WebP. Se recomienda usar imágenes optimizadas para web (menos de 2MB).</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: #0077b6; margin-bottom: 10px;">¿Cómo funciona el asistente Ballenita?</p>
            <p style="margin: 0; color: #4a5568;">Ballenita utiliza inteligencia artificial para responder preguntas sobre Puerto López. Puede escribir o usar el micrófono para dictar sus consultas.</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: #0077b6; margin-bottom: 10px;">¿El metaverso requiere equipos especiales?</p>
            <p style="margin: 0; color: #4a5568;">No, la experiencia del metaverso funciona directamente desde el navegador web. No requiere hardware adicional.</p>
          </div>
        </div>
      </div>

      <!-- CAPÍTULO 5: CRÉDITOS -->
      <div style="padding: 40px;">
        <h2 style="color: #0077b6; border-bottom: 3px solid #0077b6; padding-bottom: 10px; font-size: 28px;">5. Créditos</h2>
        
        <div style="margin-top: 30px; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-bottom: 40px;">
            <img src="/images/logos/unesum-cti.png" alt="UNESUM CTI" style="height: 100px; object-fit: contain;" />
            <img src="/images/logos/gad-puerto-lopez.png" alt="GAD Puerto López" style="height: 100px; object-fit: contain;" />
            <img src="/images/logos/smart-city-core.png" alt="Smart City Core" style="height: 100px; object-fit: contain;" />
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%); padding: 30px; border-radius: 15px; margin: 20px 0;">
            <h3 style="color: #0077b6; margin-bottom: 20px;">Universidad Estatal del Sur de Manabí</h3>
            <p style="margin: 5px 0; color: #4a5568;">Carrera de Tecnologías de la Información</p>
            <p style="margin: 15px 0; color: #4a5568;">Proyecto Smart City Core</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 15px; margin: 20px 0;">
            <h3 style="color: #00a896; margin-bottom: 20px;">GAD Municipal de Puerto López</h3>
            <p style="margin: 5px 0; color: #4a5568;">Gobierno Autónomo Descentralizado</p>
            <p style="margin: 5px 0; color: #4a5568;">Cantón Puerto López, Manabí, Ecuador</p>
          </div>
          
          <div style="margin-top: 40px; padding: 20px; border-top: 2px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px;">
              © ${new Date().getFullYear()} Puerto López Descubierto. Todos los derechos reservados.
            </p>
            <p style="color: #718096; font-size: 12px; margin-top: 10px;">
              Desarrollado como parte del proyecto Smart City Core
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const generateUserManualPDF = async () => {
  const element = document.createElement('div');
  element.innerHTML = generateManualHTML();
  
  const opt = {
    margin: 0,
    filename: 'Manual_Usuario_Puerto_Lopez_Descubierto.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  await html2pdf().set(opt).from(element).save();
};
