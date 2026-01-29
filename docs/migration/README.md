# Documentación de Migración Híbrida
## Puerto López Descubierto - Dell EMC PowerEdge T150

---

## 📁 Estructura de Archivos

```
docs/migration/
├── README.md                      # Este archivo
├── GUIA_INSTALACION.md            # Guía paso a paso completa
├── CHECKLIST_POST_INSTALACION.md  # Verificación post-instalación
├── nginx/
│   └── puerto-lopez.conf          # Configuración de Nginx
└── scripts/
    ├── deploy.sh                  # Script de despliegue automatizado
    ├── backup.sh                  # Script de backup diario
    ├── monitor.sh                 # Script de monitoreo del servidor
    └── restore.sh                 # Script de restauración de backups
```

---

## 🎯 Resumen de la Migración

### Arquitectura
- **Frontend**: Hospedado localmente en el servidor Dell EMC T150
- **Backend**: Permanece en Supabase Cloud
- **Base de datos**: PostgreSQL en Supabase Cloud
- **Edge Functions**: Ejecutadas en Supabase Cloud
- **Storage**: Supabase Storage

### Ventajas
1. ✅ Control total del frontend
2. ✅ Sin dependencia de servicios de hosting
3. ✅ Supabase maneja la complejidad del backend
4. ✅ Bajo costo operativo (~$10-20/mes electricidad)
5. ✅ Fácil mantenimiento

---

## 🚀 Inicio Rápido

### 1. Preparar el Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y curl wget git nginx ufw fail2ban

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Configurar Nginx
```bash
# Copiar configuración
sudo cp docs/migration/nginx/puerto-lopez.conf /etc/nginx/sites-available/puerto-lopez

# Editar dominio
sudo nano /etc/nginx/sites-available/puerto-lopez

# Activar sitio
sudo ln -s /etc/nginx/sites-available/puerto-lopez /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### 3. Desplegar Aplicación
```bash
# Compilar
npm install && npm run build

# Desplegar
sudo cp -r dist/* /var/www/puerto-lopez/
sudo chown -R www-data:www-data /var/www/puerto-lopez
```

### 4. Configurar SSL
```bash
# Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 📋 Documentos Incluidos

### 1. [GUIA_INSTALACION.md](./GUIA_INSTALACION.md)
Guía completa paso a paso con:
- Instalación de Ubuntu Server 22.04 LTS
- Configuración de red y firewall
- Instalación de Nginx y Node.js
- Configuración de SSL
- Seguridad del servidor
- Solución de problemas

### 2. [CHECKLIST_POST_INSTALACION.md](./CHECKLIST_POST_INSTALACION.md)
Lista de verificación para confirmar:
- Sistema operativo configurado
- Seguridad implementada
- Nginx funcionando
- Aplicación desplegada
- Conectividad con Supabase
- Scripts de automatización

### 3. [nginx/puerto-lopez.conf](./nginx/puerto-lopez.conf)
Configuración de Nginx optimizada para:
- SPA (Single Page Application) routing
- SSL/TLS con configuración moderna
- Compresión Gzip
- Cache de assets
- Headers de seguridad
- Content Security Policy para Supabase

### 4. Scripts de Automatización
- **[deploy.sh](./scripts/deploy.sh)**: Despliegue automatizado
- **[backup.sh](./scripts/backup.sh)**: Backups diarios
- **[monitor.sh](./scripts/monitor.sh)**: Monitoreo del servidor
- **[restore.sh](./scripts/restore.sh)**: Restauración de backups

---

## 🔗 Conexiones a Supabase

El frontend se conecta a los siguientes servicios de Supabase:

| Servicio | URL |
|----------|-----|
| API REST | https://lncxwvrcsuhphxxsvjod.supabase.co |
| WebSocket (Realtime) | wss://lncxwvrcsuhphxxsvjod.supabase.co |
| Edge Functions | https://lncxwvrcsuhphxxsvjod.supabase.co/functions/v1/ |
| Storage | https://lncxwvrcsuhphxxsvjod.supabase.co/storage/v1/ |

---

## 📊 Estimación de Recursos

### Hardware Mínimo
| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 8 GB | 16 GB |
| Disco | 100 GB SSD | 256 GB SSD |
| Red | 100 Mbps | 1 Gbps |

### Costos Mensuales
| Concepto | Costo Estimado |
|----------|----------------|
| Electricidad | $10-20 |
| Supabase (Free tier) | $0 |
| Dominio (anual) | $10-50/año |
| SSL (Let's Encrypt) | $0 |
| **Total** | **~$15/mes** |

---

## 🆘 Soporte

### Logs Importantes
```bash
# Nginx
/var/log/nginx/puerto-lopez.access.log
/var/log/nginx/puerto-lopez.error.log

# Sistema
journalctl -u nginx -f
journalctl -xe
```

### Comandos Útiles
```bash
# Monitoreo rápido
~/scripts/monitor.sh

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver estado de servicios
sudo systemctl status nginx
sudo ufw status
```

---

## 📞 Contactos

- **Supabase Dashboard**: https://supabase.com/dashboard/project/lncxwvrcsuhphxxsvjod
- **Documentación Supabase**: https://supabase.com/docs
- **Documentación Nginx**: https://nginx.org/en/docs/

---

**Proyecto**: Puerto López Descubierto  
**Versión**: 1.0  
**Tipo de Migración**: Híbrida (Frontend local + Backend cloud)
