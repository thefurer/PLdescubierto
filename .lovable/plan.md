

# Plan de Migración Híbrida - Dell EMC PowerEdge T150 con Ubuntu Server 22.04 LTS

## Resumen Ejecutivo

Este plan detalla la migración híbrida del proyecto "Puerto López Descubierto", donde el **frontend se hospedará en el servidor Dell EMC T150** mientras el **backend (Supabase) permanece en la nube**. Esta es la opción más segura, económica y fácil de mantener.

---

## Arquitectura de la Solución

```text
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR DELL EMC T150                       │
│                   Ubuntu Server 22.04 LTS                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      NGINX                               │   │
│  │              (Reverse Proxy + SSL)                       │   │
│  │                   Puerto 80/443                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               ARCHIVOS ESTÁTICOS                        │   │
│  │           React Build (dist/)                           │   │
│  │    - index.html, JS, CSS, imágenes                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD                               │
│              (lncxwvrcsuhphxxsvjod.supabase.co)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │   Storage    │  │    Edge      │          │
│  │   Database   │  │   Buckets    │  │  Functions   │          │
│  │   (20+ TB)   │  │  (avatars,   │  │ (chat, maps, │          │
│  │              │  │ site-images) │  │   contact)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   GoTrue     │  │   PostgREST  │                            │
│  │    (Auth)    │  │  (REST API)  │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Preparación del Servidor (Día 1-2)

### 1.1 Requisitos de Hardware
| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | Intel Xeon E-2314 | Incluido en T150 |
| RAM | 8 GB | 16 GB |
| Almacenamiento | 100 GB SSD | 256 GB SSD |
| Red | 1 Gbps | Incluido en T150 |

### 1.2 Instalación de Ubuntu Server 22.04 LTS
1. Descargar ISO desde ubuntu.com/download/server
2. Crear USB booteable con Rufus o balenaEtcher
3. Instalar con configuración mínima (servidor SSH habilitado)
4. Configurar IP estática

### 1.3 Comandos de Configuración Inicial
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y curl wget git ufw fail2ban htop

# Configurar firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version
```

### 1.4 Instalar Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## Fase 2: Configuración de Dominio y SSL (Día 2-3)

### 2.1 Opciones de Dominio
**Opción A - Dominio propio:**
- Registrar dominio (ej: puertolopez.gob.ec, turismopuertolopez.com)
- Apuntar registros DNS al servidor

**Opción B - Subdominio existente:**
- Usar subdominio del GAD (ej: turismo.puertolopez.gob.ec)

**Opción C - Sin dominio (solo IP local):**
- Acceso vía IP del servidor (ej: https://192.168.1.100)
- Certificado autofirmado

### 2.2 Certificado SSL con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado (reemplazar tu-dominio.com)
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática (ya configurada por defecto)
sudo systemctl status certbot.timer
```

### 2.3 Certificado Autofirmado (si no hay dominio)
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt
```

---

## Fase 3: Compilar y Desplegar Frontend (Día 3-4)

### 3.1 Estructura del Proyecto Actual
```text
Proyecto Puerto López Descubierto
├── src/                    # Código fuente React
│   ├── components/         # 100+ componentes
│   ├── pages/              # 10 páginas principales
│   ├── hooks/              # 30+ custom hooks
│   ├── services/           # Servicios de API
│   └── integrations/       # Cliente Supabase
├── public/                 # Archivos estáticos
│   ├── images/             # Logos e imágenes
│   └── favicon.ico
├── supabase/functions/     # Edge Functions (permanecen en cloud)
├── package.json            # Dependencias (35+ paquetes)
└── vite.config.ts          # Configuración de build
```

### 3.2 Preparar el Build
En la máquina de desarrollo (o en el servidor):

```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO] puerto-lopez
cd puerto-lopez

# Instalar dependencias
npm install

# Crear build de producción
npm run build
```

### 3.3 Archivos Generados
El comando `npm run build` genera la carpeta `dist/` con:
- `index.html` - Punto de entrada
- `assets/` - JavaScript y CSS minificados
- Imágenes y recursos estáticos

### 3.4 Desplegar en el Servidor
```bash
# Crear directorio de la aplicación
sudo mkdir -p /var/www/puerto-lopez

# Copiar archivos (desde máquina de desarrollo)
scp -r dist/* usuario@servidor:/var/www/puerto-lopez/

# O si se compiló en el servidor
sudo cp -r dist/* /var/www/puerto-lopez/

# Establecer permisos
sudo chown -R www-data:www-data /var/www/puerto-lopez
sudo chmod -R 755 /var/www/puerto-lopez
```

---

## Fase 4: Configuración de Nginx (Día 4)

### 4.1 Archivo de Configuración Principal
Crear `/etc/nginx/sites-available/puerto-lopez`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Raíz del sitio
    root /var/www/puerto-lopez;
    index index.html;

    # Logs
    access_log /var/log/nginx/puerto-lopez.access.log;
    error_log /var/log/nginx/puerto-lopez.error.log;

    # Compresión Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # Cache de archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA - Redirigir todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CSP para permitir Supabase
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://lncxwvrcsuhphxxsvjod.supabase.co wss://lncxwvrcsuhphxxsvjod.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https://ai.gateway.lovable.dev; frame-src 'self' https://www.google.com https://hcaptcha.com https://*.hcaptcha.com;" always;
}
```

### 4.2 Activar el Sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/puerto-lopez /etc/nginx/sites-enabled/

# Eliminar sitio por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## Fase 5: Seguridad del Servidor (Día 5)

### 5.1 Configurar Fail2Ban
```bash
sudo apt install -y fail2ban

# Crear configuración local
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuración
sudo nano /etc/fail2ban/jail.local
```

Agregar al final:
```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/puerto-lopez.error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/puerto-lopez.error.log
maxretry = 10
findtime = 600
bantime = 7200
```

### 5.2 Actualizar UFW
```bash
# Ver estado
sudo ufw status verbose

# Solo permitir lo necesario
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### 5.3 Actualizaciones Automáticas
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

---

## Fase 6: Automatización de Despliegues (Día 6)

### 6.1 Script de Actualización
Crear `/home/usuario/scripts/deploy.sh`:

```bash
#!/bin/bash
# Script de despliegue para Puerto López

set -e

echo "🚀 Iniciando despliegue..."

# Variables
APP_DIR="/var/www/puerto-lopez"
REPO_DIR="/home/usuario/puerto-lopez"
BACKUP_DIR="/home/usuario/backups"

# Crear backup
echo "📦 Creando backup..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $APP_DIR .

# Actualizar código
echo "📥 Descargando actualizaciones..."
cd $REPO_DIR
git pull origin main

# Instalar dependencias
echo "📚 Instalando dependencias..."
npm ci

# Compilar
echo "🔨 Compilando aplicación..."
npm run build

# Desplegar
echo "🚀 Desplegando..."
sudo rm -rf $APP_DIR/*
sudo cp -r dist/* $APP_DIR/
sudo chown -R www-data:www-data $APP_DIR

# Limpiar backups antiguos (mantener últimos 5)
echo "🧹 Limpiando backups antiguos..."
ls -t $BACKUP_DIR/backup_*.tar.gz | tail -n +6 | xargs -r rm

echo "✅ Despliegue completado!"
```

### 6.2 Dar Permisos
```bash
chmod +x /home/usuario/scripts/deploy.sh
```

---

## Fase 7: Monitoreo y Mantenimiento

### 7.1 Script de Monitoreo
Crear `/home/usuario/scripts/monitor.sh`:

```bash
#!/bin/bash
# Monitor básico del servidor

echo "=== Estado del Servidor Puerto López ==="
echo ""
echo "📊 Uso de CPU y Memoria:"
top -bn1 | head -15
echo ""
echo "💾 Uso de Disco:"
df -h /
echo ""
echo "🌐 Estado de Nginx:"
sudo systemctl status nginx --no-pager | head -10
echo ""
echo "📈 Conexiones activas:"
netstat -an | grep :443 | wc -l
echo ""
echo "📋 Últimos errores de Nginx:"
sudo tail -5 /var/log/nginx/puerto-lopez.error.log
```

### 7.2 Configurar Cron para Backups
```bash
crontab -e
```

Agregar:
```cron
# Backup diario a las 3 AM
0 3 * * * /home/usuario/scripts/backup.sh >> /var/log/backup.log 2>&1

# Renovar certificados SSL (2 veces por día)
0 0,12 * * * certbot renew --quiet
```

---

## Fase 8: Documentación Final

### 8.1 Archivos a Crear en el Servidor

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `puerto-lopez` | `/etc/nginx/sites-available/` | Config Nginx |
| `deploy.sh` | `/home/usuario/scripts/` | Script despliegue |
| `backup.sh` | `/home/usuario/scripts/` | Script backup |
| `monitor.sh` | `/home/usuario/scripts/` | Script monitoreo |

### 8.2 Información de Conexiones

| Servicio | URL/Endpoint |
|----------|--------------|
| Frontend (local) | https://tu-dominio.com |
| Supabase API | https://lncxwvrcsuhphxxsvjod.supabase.co |
| Edge Functions | https://lncxwvrcsuhphxxsvjod.supabase.co/functions/v1/ |
| Storage | https://lncxwvrcsuhphxxsvjod.supabase.co/storage/v1/ |

### 8.3 Credenciales a Mantener Seguras
- Acceso SSH al servidor
- Credenciales de Supabase Dashboard
- API Keys (GOOGLE_MAPS_API_KEY, LOVABLE_API_KEY)
- Contraseña de administrador del sitio

---

## Resumen de Costos

### Costos Iniciales (Una vez)
| Item | Costo Estimado |
|------|----------------|
| Dell EMC PowerEdge T150 | Ya adquirido |
| Dominio (.com o .ec) | $10-50/año |
| Configuración inicial | Personal interno |

### Costos Recurrentes (Mensuales)
| Item | Costo |
|------|-------|
| Supabase Cloud (Free tier) | $0 |
| Electricidad servidor | ~$10-20 |
| Internet | Ya existente |
| SSL (Let's Encrypt) | $0 |
| **Total mensual** | **~$10-20** |

---

## Ventajas de Esta Configuración

1. **Simplicidad**: Solo se administra el servidor web, no la base de datos
2. **Seguridad**: Supabase maneja autenticación, backups y actualizaciones de BD
3. **Escalabilidad**: Si el tráfico crece, se puede escalar Supabase fácilmente
4. **Bajo costo**: Free tier de Supabase es generoso para proyectos pequeños-medianos
5. **Sin pérdida de funcionalidad**: Edge Functions, IA del chatbot, todo sigue funcionando
6. **Fácil mantenimiento**: Solo actualizar archivos estáticos

---

## Cronograma de Implementación

| Día | Actividad | Duración |
|-----|-----------|----------|
| 1 | Instalar Ubuntu Server 22.04 LTS | 2-3 horas |
| 2 | Configurar red, firewall, Nginx | 2-3 horas |
| 2-3 | Configurar dominio y SSL | 1-2 horas |
| 3-4 | Compilar y desplegar frontend | 2-3 horas |
| 4 | Configurar Nginx para SPA | 1-2 horas |
| 5 | Hardening de seguridad | 2-3 horas |
| 6 | Scripts de automatización | 1-2 horas |
| 7 | Pruebas y ajustes finales | 2-4 horas |
| **Total** | **Migración completa** | **3-5 días** |

---

## Próximos Pasos

Una vez aprobado este plan, procederé a crear:

1. **Archivo de configuración Nginx** completo y listo para usar
2. **Scripts de despliegue** automatizado (deploy.sh)
3. **Scripts de backup** y restauración
4. **Scripts de monitoreo** del servidor
5. **Guía de comandos** paso a paso para la instalación
6. **Checklist de verificación** post-instalación

