# ✅ Checklist Post-Instalación
## Migración Híbrida - Puerto López Descubierto

---

## 📋 Verificación del Sistema

### Sistema Operativo
- [ ] Ubuntu Server 22.04 LTS instalado correctamente
- [ ] IP estática configurada
- [ ] Zona horaria configurada (America/Guayaquil)
- [ ] Actualizaciones del sistema instaladas

### Software Base
- [ ] Node.js 20.x instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Git instalado (`git --version`)
- [ ] Nginx instalado (`nginx -v`)

---

## 🔒 Seguridad

### Firewall (UFW)
- [ ] UFW habilitado (`sudo ufw status`)
- [ ] Puerto 22 (SSH) permitido
- [ ] Puerto 80 (HTTP) permitido
- [ ] Puerto 443 (HTTPS) permitido
- [ ] Otros puertos bloqueados

### Fail2Ban
- [ ] Fail2Ban instalado y activo
- [ ] Jail nginx-http-auth configurado
- [ ] Jail nginx-limit-req configurado

### SSL/TLS
- [ ] Certificado SSL instalado
- [ ] Redirección HTTP → HTTPS funciona
- [ ] Renovación automática configurada (si Let's Encrypt)
- [ ] Probar: `sudo certbot renew --dry-run`

### Actualizaciones
- [ ] unattended-upgrades instalado
- [ ] Actualizaciones automáticas habilitadas

---

## 🌐 Nginx

### Configuración
- [ ] Archivo de configuración creado en `/etc/nginx/sites-available/puerto-lopez`
- [ ] Enlace simbólico creado en `/etc/nginx/sites-enabled/`
- [ ] Configuración por defecto eliminada
- [ ] `sudo nginx -t` muestra "syntax is ok"
- [ ] Nginx reiniciado después de cambios

### Headers de Seguridad
- [ ] X-Frame-Options configurado
- [ ] X-Content-Type-Options configurado
- [ ] Content-Security-Policy configurado
- [ ] Permite conexiones a Supabase

### Compresión y Cache
- [ ] Gzip habilitado
- [ ] Cache de assets configurado (1 año para JS/CSS/imágenes)
- [ ] index.html sin cache

---

## 📱 Aplicación

### Archivos Desplegados
- [ ] `/var/www/puerto-lopez/index.html` existe
- [ ] `/var/www/puerto-lopez/assets/` contiene archivos JS y CSS
- [ ] Permisos correctos (`www-data:www-data`)
- [ ] Chmod 755 en archivos

### Funcionalidad
- [ ] Página principal carga correctamente
- [ ] Navegación SPA funciona (rutas internas)
- [ ] Refresh en cualquier ruta funciona
- [ ] Sin errores en consola del navegador

---

## 🔗 Conectividad con Supabase

### API y Base de Datos
- [ ] Conexión a `lncxwvrcsuhphxxsvjod.supabase.co` funciona
- [ ] Datos de atracciones cargan
- [ ] Contenido del sitio carga

### Autenticación
- [ ] Formulario de login funciona
- [ ] Registro de usuarios funciona
- [ ] Logout funciona
- [ ] Sesiones persisten correctamente

### Edge Functions
- [ ] Chatbot (Ballenita) responde
- [ ] Formulario de contacto funciona
- [ ] Mapas de Google cargan

### Storage
- [ ] Imágenes de la galería cargan
- [ ] Avatares de usuarios cargan
- [ ] Upload de imágenes funciona (si aplica)

---

## 📜 Scripts de Automatización

### Scripts Instalados
- [ ] `~/scripts/deploy.sh` existe y es ejecutable
- [ ] `~/scripts/backup.sh` existe y es ejecutable
- [ ] `~/scripts/monitor.sh` existe y es ejecutable
- [ ] `~/scripts/restore.sh` existe y es ejecutable

### Cron Jobs
- [ ] Backup diario configurado (3 AM)
- [ ] Renovación SSL configurada (si Let's Encrypt)
- [ ] Verificar con `crontab -l`

### Pruebas
- [ ] `~/scripts/monitor.sh` ejecuta sin errores
- [ ] `~/scripts/backup.sh` crea backup correctamente
- [ ] Backups se guardan en `~/backups/`

---

## 📊 Monitoreo

### Logs Configurados
- [ ] `/var/log/nginx/puerto-lopez.access.log` se está escribiendo
- [ ] `/var/log/nginx/puerto-lopez.error.log` existe
- [ ] Logs de backup se escriben

### Verificaciones
- [ ] Espacio en disco suficiente (`df -h`)
- [ ] Memoria disponible (`free -h`)
- [ ] Carga del servidor normal (`uptime`)

---

## 🌍 DNS y Dominio (si aplica)

### Registros DNS
- [ ] Registro A para dominio principal
- [ ] Registro A para www (si se usa)
- [ ] Propagación DNS completa (verificar con `dig`)

### Acceso Externo
- [ ] Sitio accesible desde Internet
- [ ] HTTPS funciona desde fuera de la red local
- [ ] Redirección www funciona (si configurado)

---

## 📝 Documentación

### Información Guardada
- [ ] IP del servidor documentada
- [ ] Credenciales de acceso SSH guardadas de forma segura
- [ ] Ubicación de backups conocida
- [ ] Contacto de soporte documentado

### Capacitación
- [ ] Personal conoce cómo ejecutar despliegues
- [ ] Personal conoce cómo restaurar backups
- [ ] Personal conoce cómo verificar logs

---

## 🎯 Pruebas Finales

### Prueba de Usuario
- [ ] Navegar por todas las secciones del sitio
- [ ] Probar formulario de contacto
- [ ] Probar chatbot
- [ ] Probar galería de imágenes
- [ ] Probar autenticación (login/logout)

### Prueba de Administrador
- [ ] Acceso al dashboard funciona
- [ ] Edición de contenido funciona
- [ ] Upload de imágenes funciona

### Prueba de Rendimiento
- [ ] Tiempo de carga < 3 segundos
- [ ] Sin errores 5xx en logs
- [ ] Compresión gzip activa (verificar en DevTools)

---

## ✅ Firma de Aprobación

| Verificación | Responsable | Fecha | Firma |
|--------------|-------------|-------|-------|
| Sistema y Seguridad | | | |
| Nginx y SSL | | | |
| Aplicación Web | | | |
| Conectividad Supabase | | | |
| Scripts y Backups | | | |
| **APROBACIÓN FINAL** | | | |

---

## 📞 Contactos de Emergencia

| Rol | Nombre | Contacto |
|-----|--------|----------|
| Administrador del Servidor | | |
| Desarrollador | | |
| Soporte Supabase | | support@supabase.io |

---

**Proyecto:** Puerto López Descubierto  
**Versión del Documento:** 1.0  
**Última Actualización:** _______________
