#!/bin/bash
# =============================================================================
# SCRIPT DE BACKUP - Puerto López Descubierto
# =============================================================================
# Ubicación recomendada: /home/usuario/scripts/backup.sh
# Uso: ./backup.sh
# Cron: 0 3 * * * /home/usuario/scripts/backup.sh >> /var/log/puerto-lopez-backup.log 2>&1
# =============================================================================

set -e

# =============================================================================
# CONFIGURACIÓN
# =============================================================================
APP_NAME="puerto-lopez"
APP_DIR="/var/www/puerto-lopez"
BACKUP_DIR="/home/$USER/backups"
MAX_BACKUPS=7  # Mantener backups de los últimos 7 días
LOG_FILE="/var/log/puerto-lopez-backup.log"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# =============================================================================
# FUNCIONES
# =============================================================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# BACKUP DE ARCHIVOS ESTÁTICOS
# =============================================================================
backup_static_files() {
    log "Iniciando backup de archivos estáticos..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/static_${APP_NAME}_${TIMESTAMP}.tar.gz"
    
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
        tar -czf "$BACKUP_FILE" -C "$APP_DIR" .
        
        # Calcular tamaño
        SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log_success "Backup creado: $BACKUP_FILE ($SIZE)"
    else
        log_error "Directorio vacío o no existe: $APP_DIR"
        return 1
    fi
}

# =============================================================================
# BACKUP DE CONFIGURACIÓN NGINX
# =============================================================================
backup_nginx_config() {
    log "Respaldando configuración de Nginx..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    NGINX_BACKUP="$BACKUP_DIR/nginx_config_${TIMESTAMP}.tar.gz"
    
    sudo tar -czf "$NGINX_BACKUP" \
        /etc/nginx/sites-available/puerto-lopez \
        /etc/nginx/nginx.conf \
        2>/dev/null || true
    
    sudo chown "$USER:$USER" "$NGINX_BACKUP"
    
    log_success "Configuración Nginx respaldada"
}

# =============================================================================
# LIMPIEZA DE BACKUPS ANTIGUOS
# =============================================================================
cleanup_old_backups() {
    log "Limpiando backups antiguos (manteniendo últimos $MAX_BACKUPS)..."
    
    # Limpiar backups de archivos estáticos
    if ls "$BACKUP_DIR"/static_*.tar.gz 1> /dev/null 2>&1; then
        STATIC_COUNT=$(ls -1 "$BACKUP_DIR"/static_*.tar.gz | wc -l)
        if [ "$STATIC_COUNT" -gt "$MAX_BACKUPS" ]; then
            ls -t "$BACKUP_DIR"/static_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
            log "Eliminados $(($STATIC_COUNT - $MAX_BACKUPS)) backups estáticos antiguos"
        fi
    fi
    
    # Limpiar backups de nginx
    if ls "$BACKUP_DIR"/nginx_*.tar.gz 1> /dev/null 2>&1; then
        NGINX_COUNT=$(ls -1 "$BACKUP_DIR"/nginx_*.tar.gz | wc -l)
        if [ "$NGINX_COUNT" -gt "$MAX_BACKUPS" ]; then
            ls -t "$BACKUP_DIR"/nginx_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
            log "Eliminados $(($NGINX_COUNT - $MAX_BACKUPS)) backups nginx antiguos"
        fi
    fi
    
    log_success "Limpieza completada"
}

# =============================================================================
# REPORTE DE ESPACIO
# =============================================================================
show_backup_report() {
    log "=== REPORTE DE BACKUPS ==="
    
    echo ""
    echo "📁 Directorio de backups: $BACKUP_DIR"
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        echo "📦 Backups existentes:"
        ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "  (ninguno)"
        echo ""
        
        TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
        echo "💾 Espacio total usado: $TOTAL_SIZE"
    fi
    
    echo ""
    echo "💿 Espacio en disco:"
    df -h "$BACKUP_DIR" | tail -1
    echo ""
}

# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================
main() {
    echo ""
    echo "=============================================="
    echo "📦 BACKUP - $APP_NAME"
    echo "=============================================="
    echo "⏰ Inicio: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    backup_static_files
    backup_nginx_config
    cleanup_old_backups
    show_backup_report
    
    echo "=============================================="
    echo -e "${GREEN}✅ BACKUP COMPLETADO${NC}"
    echo "=============================================="
}

main "$@"
