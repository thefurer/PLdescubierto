#!/bin/bash
# =============================================================================
# SCRIPT DE RESTAURACIÓN - Puerto López Descubierto
# =============================================================================
# Ubicación recomendada: /home/usuario/scripts/restore.sh
# Uso: ./restore.sh [archivo_backup.tar.gz]
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
APP_DIR="/var/www/puerto-lopez"
BACKUP_DIR="/home/$USER/backups"

# =============================================================================
# FUNCIONES
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

show_usage() {
    echo ""
    echo "Uso: $0 [archivo_backup.tar.gz]"
    echo ""
    echo "Si no se especifica un archivo, se mostrará una lista de backups disponibles."
    echo ""
    echo "Ejemplos:"
    echo "  $0                                    # Listar backups disponibles"
    echo "  $0 static_puerto-lopez_20240115.tar.gz  # Restaurar backup específico"
    echo ""
}

list_backups() {
    echo ""
    echo -e "${BLUE}📦 BACKUPS DISPONIBLES${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    
    if [ -d "$BACKUP_DIR" ]; then
        if ls "$BACKUP_DIR"/static_*.tar.gz 1> /dev/null 2>&1; then
            echo ""
            echo "Archivos de respaldo:"
            echo ""
            
            INDEX=1
            for backup in $(ls -t "$BACKUP_DIR"/static_*.tar.gz); do
                FILENAME=$(basename "$backup")
                SIZE=$(du -h "$backup" | cut -f1)
                DATE=$(stat -c %y "$backup" | cut -d'.' -f1)
                
                echo "  [$INDEX] $FILENAME"
                echo "      📅 $DATE | 💾 $SIZE"
                echo ""
                
                INDEX=$((INDEX + 1))
            done
        else
            log_warning "No se encontraron backups en $BACKUP_DIR"
        fi
    else
        log_error "Directorio de backups no existe: $BACKUP_DIR"
    fi
}

confirm_restore() {
    local BACKUP_FILE=$1
    
    echo ""
    echo -e "${YELLOW}⚠️  ADVERTENCIA${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    echo "Esta acción reemplazará el contenido actual de:"
    echo "  $APP_DIR"
    echo ""
    echo "Con el contenido del backup:"
    echo "  $BACKUP_FILE"
    echo ""
    echo -n "¿Está seguro de continuar? (s/N): "
    read -r CONFIRM
    
    if [[ ! "$CONFIRM" =~ ^[sS]$ ]]; then
        log_info "Restauración cancelada"
        exit 0
    fi
}

restore_backup() {
    local BACKUP_FILE=$1
    
    log_info "Iniciando restauración..."
    
    # Crear backup del estado actual antes de restaurar
    if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        PRE_RESTORE_BACKUP="$BACKUP_DIR/pre_restore_${TIMESTAMP}.tar.gz"
        
        log_info "Creando backup del estado actual..."
        tar -czf "$PRE_RESTORE_BACKUP" -C "$APP_DIR" .
        log_success "Backup pre-restauración: $PRE_RESTORE_BACKUP"
    fi
    
    # Limpiar directorio de destino
    log_info "Limpiando directorio de destino..."
    sudo rm -rf "${APP_DIR:?}/"*
    
    # Restaurar archivos
    log_info "Extrayendo backup..."
    sudo tar -xzf "$BACKUP_FILE" -C "$APP_DIR"
    
    # Establecer permisos
    log_info "Configurando permisos..."
    sudo chown -R www-data:www-data "$APP_DIR"
    sudo chmod -R 755 "$APP_DIR"
    
    # Verificar restauración
    if [ -f "$APP_DIR/index.html" ]; then
        log_success "Restauración completada exitosamente"
    else
        log_error "La restauración puede haber fallado - index.html no encontrado"
        exit 1
    fi
}

verify_nginx() {
    log_info "Verificando configuración de Nginx..."
    
    if sudo nginx -t 2>/dev/null; then
        log_success "Configuración de Nginx válida"
        
        log_info "Recargando Nginx..."
        sudo systemctl reload nginx
        log_success "Nginx recargado"
    else
        log_error "Error en la configuración de Nginx"
        exit 1
    fi
}

# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================

main() {
    echo ""
    echo "=============================================="
    echo "🔄 RESTAURACIÓN - Puerto López Descubierto"
    echo "=============================================="
    echo ""
    
    # Si no se proporciona argumento, listar backups
    if [ $# -eq 0 ]; then
        list_backups
        show_usage
        exit 0
    fi
    
    BACKUP_FILE=$1
    
    # Si es ruta relativa, buscar en BACKUP_DIR
    if [[ ! "$BACKUP_FILE" == /* ]]; then
        if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
            BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
        fi
    fi
    
    # Verificar que el archivo existe
    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "Archivo de backup no encontrado: $BACKUP_FILE"
        list_backups
        exit 1
    fi
    
    # Confirmar con el usuario
    confirm_restore "$BACKUP_FILE"
    
    # Realizar restauración
    restore_backup "$BACKUP_FILE"
    
    # Verificar Nginx
    verify_nginx
    
    echo ""
    echo "=============================================="
    echo -e "${GREEN}✅ RESTAURACIÓN COMPLETADA${NC}"
    echo "=============================================="
    echo ""
    echo "🌐 El sitio debería estar disponible en: https://tu-dominio.com"
    echo ""
}

main "$@"
