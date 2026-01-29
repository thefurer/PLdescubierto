# 📚 Guía de Instalación Paso a Paso
## Migración Híbrida - Dell EMC PowerEdge T150 con Ubuntu Server 22.04 LTS

---

## 📋 Índice

1. [Requisitos Previos](#1-requisitos-previos)
2. [Instalación del Sistema Operativo](#2-instalación-del-sistema-operativo)
3. [Configuración Inicial del Servidor](#3-configuración-inicial-del-servidor)
4. [Instalación de Nginx](#4-instalación-de-nginx)
5. [Configuración de Dominio y DNS](#5-configuración-de-dominio-y-dns)
6. [Certificado SSL](#6-certificado-ssl)
7. [Despliegue de la Aplicación](#7-despliegue-de-la-aplicación)
8. [Configuración de Nginx para SPA](#8-configuración-de-nginx-para-spa)
9. [Seguridad del Servidor](#9-seguridad-del-servidor)
10. [Scripts de Automatización](#10-scripts-de-automatización)
11. [Verificación Final](#11-verificación-final)
12. [Solución de Problemas](#12-solución-de-problemas)

---

## 1. Requisitos Previos

### Hardware (Dell EMC PowerEdge T150)
- ✅ CPU: Intel Xeon E-2300 series
- ✅ RAM: Mínimo 8GB (recomendado 16GB)
- ✅ Almacenamiento: 100GB SSD mínimo
- ✅ Conexión de red Ethernet

### Software Necesario
- USB con Ubuntu Server 22.04 LTS ISO
- Acceso a router/firewall para configurar puertos
- Dominio registrado (opcional pero recomendado)

### Información Requerida
- [ ] IP estática para el servidor
- [ ] Puerta de enlace (gateway)
- [ ] Servidores DNS
- [ ] Nombre de dominio (si aplica)
- [ ] URL del repositorio Git del proyecto

---

## 2. Instalación del Sistema Operativo

### 2.1 Crear USB Booteable

**En Windows:**
```
1. Descargar Rufus: https://rufus.ie/
2. Descargar Ubuntu Server 22.04 LTS: https://ubuntu.com/download/server
3. Insertar USB (8GB mínimo)
4. Abrir Rufus y seleccionar la ISO
5. Hacer clic en "Start"
```

**En Linux/Mac:**
```bash
# Identificar el USB
lsblk

# Escribir ISO (reemplazar /dev/sdX con tu dispositivo)
sudo dd if=ubuntu-22.04-live-server-amd64.iso of=/dev/sdX bs=4M status=progress
sync
```

### 2.2 Instalación de Ubuntu Server

1. Insertar USB en el servidor y arrancar desde USB (F11 para menú de boot)
2. Seleccionar "Install Ubuntu Server"
3. Configurar:
   - **Idioma**: Español
   - **Teclado**: Spanish (Latin American)
   - **Red**: Configurar IP estática
   - **Almacenamiento**: Usar disco completo con LVM
   - **Nombre del servidor**: `puerto-lopez-server`
   - **Usuario**: Crear usuario administrador
   - **SSH**: ✅ Instalar OpenSSH Server
4. Completar instalación y reiniciar

### 2.3 Configurar IP Estática

Editar configuración de red:
```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

Contenido:
```yaml
network:
  version: 2
  ethernets:
    eno1:  # Puede variar según tu interfaz
      addresses:
        - 192.168.1.100/24  # Tu IP estática
      gateway4: 192.168.1.1  # Tu gateway
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

Aplicar cambios:
```bash
sudo netplan apply
```

---

## 3. Configuración Inicial del Servidor

### 3.1 Actualizar Sistema

```bash
# Actualizar lista de paquetes
sudo apt update

# Actualizar paquetes instalados
sudo apt upgrade -y

# Reiniciar si es necesario
sudo reboot
```

### 3.2 Instalar Herramientas Básicas

```bash
sudo apt install -y \
  curl \
  wget \
  git \
  htop \
  ufw \
  fail2ban \
  unzip \
  net-tools
```

### 3.3 Configurar Zona Horaria

```bash
# Ver zona horaria actual
timedatectl

# Configurar zona horaria de Ecuador
sudo timedatectl set-timezone America/Guayaquil

# Verificar
date
```

### 3.4 Instalar Node.js 20 LTS

```bash
# Agregar repositorio de NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalación
node --version   # Debe mostrar v20.x.x
npm --version    # Debe mostrar 10.x.x
```

---

## 4. Instalación de Nginx

### 4.1 Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Habilitar inicio automático
sudo systemctl enable nginx

# Iniciar servicio
sudo systemctl start nginx

# Verificar estado
sudo systemctl status nginx
```

### 4.2 Verificar Instalación

```bash
# Probar desde el servidor
curl http://localhost

# O acceder desde navegador: http://[IP-DEL-SERVIDOR]
```

---

## 5. Configuración de Dominio y DNS

### 5.1 Opción A: Con Dominio Propio

En el panel de tu proveedor de dominio, agregar registros DNS:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | [IP-PUBLICA-SERVIDOR] | 3600 |
| A | www | [IP-PUBLICA-SERVIDOR] | 3600 |

### 5.2 Opción B: Sin Dominio (IP Local)

Si solo usarás el servidor en red local, puedes acceder directamente por IP.

### 5.3 Configurar Router/Firewall

Para acceso desde Internet, abrir puertos en el router:

| Puerto | Protocolo | Servicio |
|--------|-----------|----------|
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 22 | TCP | SSH (opcional, solo si necesitas acceso remoto) |

---

## 6. Certificado SSL

### 6.1 Opción A: Let's Encrypt (Recomendado)

**Requisito:** Dominio público apuntando al servidor

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado (reemplazar con tu dominio)
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Seguir instrucciones en pantalla
# - Ingresar email
# - Aceptar términos
# - Elegir redireccionar HTTP a HTTPS
```

**Verificar renovación automática:**
```bash
# Ver timer de renovación
sudo systemctl status certbot.timer

# Probar renovación (sin aplicar)
sudo certbot renew --dry-run
```

### 6.2 Opción B: Certificado Autofirmado

**Solo para desarrollo o red local:**

```bash
# Crear certificado autofirmado
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt

# Responder las preguntas:
# Country Name: EC
# State: Manabi
# City: Puerto Lopez
# Organization: GAD Puerto Lopez
# Common Name: [IP o dominio]
```

---

## 7. Despliegue de la Aplicación

### 7.1 Clonar Repositorio

```bash
# Ir al directorio home
cd ~

# Clonar repositorio (reemplazar con URL real)
git clone https://github.com/TU-USUARIO/puerto-lopez.git

# Entrar al directorio
cd puerto-lopez
```

### 7.2 Instalar Dependencias y Compilar

```bash
# Instalar dependencias
npm install

# Compilar para producción
npm run build

# Verificar que se creó la carpeta dist
ls -la dist/
```

### 7.3 Desplegar Archivos

```bash
# Crear directorio de la aplicación
sudo mkdir -p /var/www/puerto-lopez

# Copiar archivos compilados
sudo cp -r dist/* /var/www/puerto-lopez/

# Establecer permisos
sudo chown -R www-data:www-data /var/www/puerto-lopez
sudo chmod -R 755 /var/www/puerto-lopez

# Verificar
ls -la /var/www/puerto-lopez/
```

---

## 8. Configuración de Nginx para SPA

### 8.1 Copiar Archivo de Configuración

El archivo de configuración está en: `docs/migration/nginx/puerto-lopez.conf`

```bash
# Desde el repositorio clonado
sudo cp docs/migration/nginx/puerto-lopez.conf /etc/nginx/sites-available/puerto-lopez

# Editar para personalizar dominio
sudo nano /etc/nginx/sites-available/puerto-lopez
```

### 8.2 Modificar Configuración

Reemplazar `tu-dominio.com` con tu dominio real o IP:

```nginx
server_name tu-dominio.com www.tu-dominio.com;
```

Si usas certificado autofirmado, cambiar las líneas de SSL:
```nginx
ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
```

### 8.3 Activar Sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/puerto-lopez /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Si dice "syntax is ok", reiniciar
sudo systemctl restart nginx

# Verificar estado
sudo systemctl status nginx
```

---

## 9. Seguridad del Servidor

### 9.1 Configurar Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir Nginx
sudo ufw allow 'Nginx Full'

# Ver estado
sudo ufw status verbose
```

### 9.2 Configurar Fail2Ban

```bash
# Copiar configuración
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar
sudo nano /etc/fail2ban/jail.local
```

Agregar al final del archivo:
```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/puerto-lopez.error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/puerto-lopez.error.log
maxretry = 10
bantime = 7200
```

Reiniciar Fail2Ban:
```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
```

### 9.3 Actualizaciones Automáticas

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
# Seleccionar "Yes"
```

---

## 10. Scripts de Automatización

### 10.1 Crear Directorio de Scripts

```bash
mkdir -p ~/scripts
```

### 10.2 Copiar Scripts

```bash
# Desde el repositorio
cp docs/migration/scripts/*.sh ~/scripts/

# Dar permisos de ejecución
chmod +x ~/scripts/*.sh
```

### 10.3 Configurar Cron para Backups

```bash
crontab -e
```

Agregar:
```cron
# Backup diario a las 3 AM
0 3 * * * /home/$USER/scripts/backup.sh >> /var/log/puerto-lopez-backup.log 2>&1

# Renovar certificados SSL (2 veces por día)
0 0,12 * * * certbot renew --quiet
```

### 10.4 Probar Scripts

```bash
# Monitoreo
~/scripts/monitor.sh

# Backup (prueba)
~/scripts/backup.sh
```

---

## 11. Verificación Final

### 11.1 Checklist de Verificación

```bash
# Ejecutar desde el servidor
echo "=== CHECKLIST DE VERIFICACIÓN ==="

# 1. Sistema
echo -n "✓ Ubuntu instalado: "
cat /etc/os-release | grep VERSION_ID

# 2. Node.js
echo -n "✓ Node.js: "
node --version

# 3. Nginx
echo -n "✓ Nginx activo: "
systemctl is-active nginx

# 4. Firewall
echo -n "✓ UFW activo: "
sudo ufw status | head -1

# 5. Fail2Ban
echo -n "✓ Fail2Ban activo: "
systemctl is-active fail2ban

# 6. Aplicación
echo -n "✓ index.html existe: "
[ -f /var/www/puerto-lopez/index.html ] && echo "Sí" || echo "No"

# 7. SSL
echo -n "✓ Certificado SSL: "
[ -f /etc/letsencrypt/live/*/fullchain.pem ] && echo "Let's Encrypt" || echo "Verificar manualmente"

# 8. Conectividad a Supabase
echo -n "✓ Conexión a Supabase: "
curl -s -o /dev/null -w "%{http_code}" https://lncxwvrcsuhphxxsvjod.supabase.co/rest/v1/
echo ""
```

### 11.2 Pruebas de Funcionalidad

1. **Acceso web:**
   - Abrir https://tu-dominio.com en navegador
   - Verificar que carga la página principal

2. **Navegación SPA:**
   - Navegar a diferentes secciones
   - Refrescar página en cada sección (debe funcionar)

3. **Autenticación:**
   - Intentar iniciar sesión
   - Verificar que conecta con Supabase

4. **Chatbot:**
   - Abrir el chatbot (Ballenita)
   - Enviar mensaje de prueba

5. **Consola del navegador:**
   - Abrir DevTools (F12)
   - Verificar que no hay errores de CORS
   - Verificar que las conexiones a Supabase funcionan

---

## 12. Solución de Problemas

### 12.1 Nginx no inicia

```bash
# Ver logs de error
sudo journalctl -u nginx -n 50

# Verificar configuración
sudo nginx -t

# Verificar puertos en uso
sudo netstat -tlpn | grep -E ':80|:443'
```

### 12.2 Error 502 Bad Gateway

```bash
# Verificar que los archivos existen
ls -la /var/www/puerto-lopez/

# Verificar permisos
sudo chown -R www-data:www-data /var/www/puerto-lopez
```

### 12.3 Errores de CORS

Verificar en la configuración de Nginx que el CSP incluye el dominio de Supabase:
```nginx
connect-src 'self' https://lncxwvrcsuhphxxsvjod.supabase.co ...
```

### 12.4 SSL no funciona

```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Ver logs de Certbot
sudo cat /var/log/letsencrypt/letsencrypt.log
```

### 12.5 Página en blanco

```bash
# Verificar que dist contiene archivos
ls -la /var/www/puerto-lopez/

# Revisar logs de Nginx
sudo tail -f /var/log/nginx/puerto-lopez.error.log

# Verificar consola del navegador (F12)
```

---

## 📞 Soporte

### Logs importantes:
- Nginx access: `/var/log/nginx/puerto-lopez.access.log`
- Nginx errors: `/var/log/nginx/puerto-lopez.error.log`
- Sistema: `journalctl -xe`

### Comandos útiles:
```bash
# Estado general del servidor
~/scripts/monitor.sh

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver conexiones activas
netstat -an | grep :443 | wc -l

# Espacio en disco
df -h
```

---

**Documento generado para: Puerto López Descubierto**  
**Versión: 1.0**  
**Fecha: $(date +%Y-%m-%d)**
