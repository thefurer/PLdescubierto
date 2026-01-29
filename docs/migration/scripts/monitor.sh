#!/bin/bash
# =============================================================================
# SCRIPT DE MONITOREO - Puerto López Descubierto
# =============================================================================
# Ubicación recomendada: /home/usuario/scripts/monitor.sh
# Uso: ./monitor.sh
# =============================================================================

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
APP_DIR="/var/www/puerto-lopez"
NGINX_LOG="/var/log/nginx/puerto-lopez.access.log"
NGINX_ERROR_LOG="/var/log/nginx/puerto-lopez.error.log"

# =============================================================================
# FUNCIONES DE MONITOREO
# =============================================================================

print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     🖥️  MONITOR DEL SERVIDOR - PUERTO LÓPEZ DESCUBIERTO      ║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║     📅 $(date '+%Y-%m-%d %H:%M:%S')                                  ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_system_resources() {
    echo -e "${BLUE}📊 RECURSOS DEL SISTEMA${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    
    # CPU
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo -e "🔧 CPU:        ${YELLOW}${CPU_USAGE}%${NC} usado"
    
    # Memoria
    MEM_INFO=$(free -h | grep "Mem:")
    MEM_USED=$(echo $MEM_INFO | awk '{print $3}')
    MEM_TOTAL=$(echo $MEM_INFO | awk '{print $2}')
    MEM_PERCENT=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    
    if [ "$MEM_PERCENT" -gt 80 ]; then
        echo -e "💾 Memoria:    ${RED}${MEM_USED}/${MEM_TOTAL} (${MEM_PERCENT}%)${NC} ⚠️  ALTO"
    elif [ "$MEM_PERCENT" -gt 60 ]; then
        echo -e "💾 Memoria:    ${YELLOW}${MEM_USED}/${MEM_TOTAL} (${MEM_PERCENT}%)${NC}"
    else
        echo -e "💾 Memoria:    ${GREEN}${MEM_USED}/${MEM_TOTAL} (${MEM_PERCENT}%)${NC}"
    fi
    
    # Disco
    DISK_INFO=$(df -h / | tail -1)
    DISK_USED=$(echo $DISK_INFO | awk '{print $3}')
    DISK_TOTAL=$(echo $DISK_INFO | awk '{print $2}')
    DISK_PERCENT=$(echo $DISK_INFO | awk '{print $5}' | tr -d '%')
    
    if [ "$DISK_PERCENT" -gt 90 ]; then
        echo -e "💿 Disco:      ${RED}${DISK_USED}/${DISK_TOTAL} (${DISK_PERCENT}%)${NC} ⚠️  CRÍTICO"
    elif [ "$DISK_PERCENT" -gt 80 ]; then
        echo -e "💿 Disco:      ${YELLOW}${DISK_USED}/${DISK_TOTAL} (${DISK_PERCENT}%)${NC}"
    else
        echo -e "💿 Disco:      ${GREEN}${DISK_USED}/${DISK_TOTAL} (${DISK_PERCENT}%)${NC}"
    fi
    
    # Uptime
    UPTIME=$(uptime -p)
    echo -e "⏱️  Uptime:     ${UPTIME}"
    
    # Load Average
    LOAD=$(uptime | awk -F'load average:' '{print $2}' | xargs)
    echo -e "📈 Load Avg:   ${LOAD}"
    
    echo ""
}

check_nginx_status() {
    echo -e "${BLUE}🌐 ESTADO DE NGINX${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    
    if systemctl is-active --quiet nginx; then
        echo -e "📡 Estado:     ${GREEN}● Activo${NC}"
        
        # PID y tiempo de ejecución
        NGINX_PID=$(pgrep -f "nginx: master" | head -1)
        if [ -n "$NGINX_PID" ]; then
            NGINX_UPTIME=$(ps -p $NGINX_PID -o etime= 2>/dev/null | xargs)
            echo -e "🔢 PID:        ${NGINX_PID}"
            echo -e "⏰ Tiempo:     ${NGINX_UPTIME}"
        fi
    else
        echo -e "📡 Estado:     ${RED}● Inactivo${NC} ⚠️"
    fi
    
    # Conexiones activas
    if [ -f "/var/run/nginx.pid" ]; then
        CONNECTIONS_443=$(netstat -an 2>/dev/null | grep ":443" | grep "ESTABLISHED" | wc -l)
        CONNECTIONS_80=$(netstat -an 2>/dev/null | grep ":80" | grep "ESTABLISHED" | wc -l)
        echo -e "🔗 Conexiones: HTTPS: ${CONNECTIONS_443} | HTTP: ${CONNECTIONS_80}"
    fi
    
    # Verificar configuración
    if sudo nginx -t 2>/dev/null | grep -q "successful"; then
        echo -e "⚙️  Config:     ${GREEN}Válida${NC}"
    else
        echo -e "⚙️  Config:     ${RED}Error${NC} ⚠️"
    fi
    
    echo ""
}

check_application() {
    echo -e "${BLUE}📱 ESTADO DE LA APLICACIÓN${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    
    # Verificar archivos
    if [ -f "$APP_DIR/index.html" ]; then
        echo -e "📄 index.html: ${GREEN}Presente${NC}"
    else
        echo -e "📄 index.html: ${RED}No encontrado${NC} ⚠️"
    fi
    
    if [ -d "$APP_DIR/assets" ]; then
        ASSET_COUNT=$(ls -1 "$APP_DIR/assets" | wc -l)
        echo -e "📁 Assets:     ${GREEN}${ASSET_COUNT} archivos${NC}"
    else
        echo -e "📁 Assets:     ${YELLOW}Carpeta no encontrada${NC}"
    fi
    
    # Tamaño del despliegue
    if [ -d "$APP_DIR" ]; then
        APP_SIZE=$(du -sh "$APP_DIR" 2>/dev/null | cut -f1)
        echo -e "💾 Tamaño:     ${APP_SIZE}"
    fi
    
    # Última modificación
    if [ -f "$APP_DIR/index.html" ]; then
        LAST_MODIFIED=$(stat -c %y "$APP_DIR/index.html" | cut -d'.' -f1)
        echo -e "🕐 Modificado: ${LAST_MODIFIED}"
    fi
    
    echo ""
}

check_ssl_certificate() {
    echo -e "${BLUE}🔒 CERTIFICADO SSL${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    
    CERT_PATH="/etc/letsencrypt/live"
    
    if [ -d "$CERT_PATH" ]; then
        # Buscar el primer certificado disponible
        DOMAIN_DIR=$(ls -1 "$CERT_PATH" 2>/dev/null | head -1)
        
        if [ -n "$DOMAIN_DIR" ] && [ -f "$CERT_PATH/$DOMAIN_DIR/fullchain.pem" ]; then
            CERT_FILE="$CERT_PATH/$DOMAIN_DIR/fullchain.pem"
            
            # Fecha de expiración
            EXPIRY=$(sudo openssl x509 -enddate -noout -in "$CERT_FILE" 2>/dev/null | cut -d= -f2)
            EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null)
            NOW_EPOCH=$(date +%s)
            DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
            
            echo -e "📜 Dominio:    ${DOMAIN_DIR}"
            
            if [ "$DAYS_LEFT" -lt 7 ]; then
                echo -e "📅 Expira:     ${RED}${EXPIRY} (${DAYS_LEFT} días)${NC} ⚠️ RENOVAR YA"
            elif [ "$DAYS_LEFT" -lt 30 ]; then
                echo -e "📅 Expira:     ${YELLOW}${EXPIRY} (${DAYS_LEFT} días)${NC}"
            else
                echo -e "📅 Expira:     ${GREEN}${EXPIRY} (${DAYS_LEFT} días)${NC}"
            fi
        else
            echo -e "📜 Estado:     ${YELLOW}No se encontró certificado${NC}"
        fi
    else
        echo -e "📜 Let's Encrypt: ${YELLOW}No configurado${NC}"
    fi
    
    echo ""
}

show_recent_logs() {
    echo -e "${BLUE}📋 LOGS RECIENTES${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    
    # Últimos accesos
    if [ -f "$NGINX_LOG" ]; then
        echo -e "${YELLOW}Últimos 5 accesos:${NC}"
        sudo tail -5 "$NGINX_LOG" 2>/dev/null | while read line; do
            echo "  $line" | cut -c1-70
        done
        echo ""
    fi
    
    # Últimos errores
    if [ -f "$NGINX_ERROR_LOG" ]; then
        ERROR_COUNT=$(sudo wc -l < "$NGINX_ERROR_LOG" 2>/dev/null)
        if [ "$ERROR_COUNT" -gt 0 ]; then
            RECENT_ERRORS=$(sudo tail -5 "$NGINX_ERROR_LOG" 2>/dev/null | wc -l)
            echo -e "${YELLOW}Últimos errores (${ERROR_COUNT} total):${NC}"
            sudo tail -3 "$NGINX_ERROR_LOG" 2>/dev/null | while read line; do
                echo -e "  ${RED}$line${NC}" | cut -c1-70
            done
        else
            echo -e "${GREEN}Sin errores recientes${NC}"
        fi
    fi
    
    echo ""
}

show_quick_actions() {
    echo -e "${BLUE}⚡ ACCIONES RÁPIDAS${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    echo "  sudo systemctl restart nginx    # Reiniciar Nginx"
    echo "  sudo nginx -t                   # Verificar configuración"
    echo "  sudo certbot renew              # Renovar certificado SSL"
    echo "  ~/scripts/deploy.sh             # Desplegar actualización"
    echo "  ~/scripts/backup.sh             # Crear backup"
    echo ""
}

# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================

main() {
    clear
    print_header
    check_system_resources
    check_nginx_status
    check_application
    check_ssl_certificate
    show_recent_logs
    show_quick_actions
}

main "$@"
