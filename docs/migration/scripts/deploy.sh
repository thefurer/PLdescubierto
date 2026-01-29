#!/bin/bash
# =============================================================================
# SCRIPT DE DESPLIEGUE - Puerto López Descubierto
# =============================================================================
# Ubicación recomendada: /home/usuario/scripts/deploy.sh
# Uso: ./deploy.sh
# =============================================================================

set -e  # Salir si cualquier comando falla

# =============================================================================
# CONFIGURACIÓN - MODIFICAR SEGÚN TU ENTORNO
# =============================================================================
APP_NAME="puerto-lopez"
APP_DIR="/var/www/puerto-lopez"
REPO_DIR="/home/$USER/puerto-lopez"
BACKUP_DIR="/home/$USER/backups"
GIT_BRANCH="main"
MAX_BACKUPS=5

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# =============================================================================
# FUNCIONES
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Verificando prerrequisitos..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    
    # Verificar git
    if ! command -v git &> /dev/null; then
        log_error "git no está instalado"
        exit 1
    fi
    
    # Verificar directorio del repositorio
    if [ ! -d "$REPO_DIR" ]; then
        log_error "Directorio del repositorio no existe: $REPO_DIR"
        exit 1
    fi
    
    log_success "Prerrequisitos verificados"
}

create_backup() {
    log_info "Creando backup del despliegue actual..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
        tar -czf "$BACKUP_DIR/backup_${APP_NAME}_${TIMESTAMP}.tar.gz" -C "$APP_DIR" .
        log_success "Backup creado: backup_${APP_NAME}_${TIMESTAMP}.tar.gz"
    else
        log_warning "No hay archivos para respaldar en $APP_DIR"
    fi
}

update_repository() {
    log_info "Actualizando repositorio desde Git..."
    
    cd "$REPO_DIR"
    
    # Guardar cambios locales si existen
    if ! git diff-index --quiet HEAD --; then
        log_warning "Hay cambios locales, guardando con stash..."
        git stash
    fi
    
    # Obtener últimos cambios
    git fetch origin "$GIT_BRANCH"
    git checkout "$GIT_BRANCH"
    git pull origin "$GIT_BRANCH"
    
    log_success "Repositorio actualizado"
}

install_dependencies() {
    log_info "Instalando dependencias..."
    
    cd "$REPO_DIR"
    
    # Usar npm ci para instalación limpia y reproducible
    npm ci --silent
    
    log_success "Dependencias instaladas"
}

build_application() {
    log_info "Compilando aplicación..."
    
    cd "$REPO_DIR"
    
    # Build de producción
    npm run build
    
    if [ ! -d "$REPO_DIR/dist" ]; then
        log_error "La compilación falló - no se encontró carpeta dist/"
        exit 1
    fi
    
    log_success "Aplicación compilada"
}

deploy_files() {
    log_info "Desplegando archivos..."
    
    # Crear directorio si no existe
    sudo mkdir -p "$APP_DIR"
    
    # Limpiar directorio de destino
    sudo rm -rf "${APP_DIR:?}/"*
    
    # Copiar archivos compilados
    sudo cp -r "$REPO_DIR/dist/"* "$APP_DIR/"
    
    # Establecer permisos correctos
    sudo chown -R www-data:www-data "$APP_DIR"
    sudo chmod -R 755 "$APP_DIR"
    
    log_success "Archivos desplegados en $APP_DIR"
}

cleanup_old_backups() {
    log_info "Limpiando backups antiguos..."
    
    if [ -d "$BACKUP_DIR" ]; then
        # Contar backups existentes
        BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | wc -l)
        
        if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
            # Eliminar los más antiguos
            ls -t "$BACKUP_DIR"/backup_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
            log_success "Backups antiguos eliminados (manteniendo últimos $MAX_BACKUPS)"
        else
            log_info "No hay backups antiguos para eliminar"
        fi
    fi
}

verify_deployment() {
    log_info "Verificando despliegue..."
    
    # Verificar que index.html existe
    if [ ! -f "$APP_DIR/index.html" ]; then
        log_error "index.html no encontrado en $APP_DIR"
        exit 1
    fi
    
    # Verificar que assets existen
    if [ ! -d "$APP_DIR/assets" ]; then
        log_warning "Carpeta assets no encontrada"
    fi
    
    # Verificar Nginx
    if ! sudo nginx -t 2>/dev/null; then
        log_error "Configuración de Nginx inválida"
        exit 1
    fi
    
    log_success "Despliegue verificado correctamente"
}

show_summary() {
    echo ""
    echo "=============================================="
    echo -e "${GREEN}✅ DESPLIEGUE COMPLETADO EXITOSAMENTE${NC}"
    echo "=============================================="
    echo ""
    echo "📁 Archivos desplegados en: $APP_DIR"
    echo "📦 Backup guardado en: $BACKUP_DIR"
    echo "🌐 Sitio disponible en: https://tu-dominio.com"
    echo ""
    echo "⏰ Completado: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=============================================="
}

# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================

main() {
    echo ""
    echo "=============================================="
    echo "🚀 INICIANDO DESPLIEGUE - $APP_NAME"
    echo "=============================================="
    echo "⏰ Inicio: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    check_prerequisites
    create_backup
    update_repository
    install_dependencies
    build_application
    deploy_files
    cleanup_old_backups
    verify_deployment
    show_summary
}

# Ejecutar script principal
main "$@"
