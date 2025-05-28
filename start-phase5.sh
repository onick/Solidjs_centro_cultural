#!/bin/bash

# Script de inicio completo para CCB SolidJS Platform - Fase 5
echo "🚀 Iniciando CCB SolidJS Platform - Fase 5"
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones de logging
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Verificar Docker
check_docker() {
    log_info "Verificando Docker..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    fi
    
    log_success "Docker y Docker Compose disponibles"
}

# Crear directorios necesarios
create_directories() {
    log_info "Creando directorios necesarios..."
    mkdir -p logs uploads backend/logs data/mongodb data/redis
    log_success "Directorios creados"
}

# Configurar variables de entorno
setup_env() {
    log_info "Configurando variables de entorno..."
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            log_success "Archivo .env creado desde .env.example"
        else
            log_error "No se encontró .env.example"
            exit 1
        fi
    else
        log_warning "Archivo .env ya existe, manteniéndolo"
    fi
}

# Instalar dependencias
install_dependencies() {
    log_info "Instalando dependencias..."
    npm install
    cd backend && npm install && cd ..
    log_success "Dependencias instaladas"
}

# Ejecutar tests
run_tests() {
    log_info "Ejecutando tests..."
    cd backend
    npm run test
    test_result=$?
    cd ..
    
    if [ $test_result -ne 0 ]; then
        log_error "Tests fallaron"
        read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        log_success "Tests pasaron exitosamente"
    fi
}

# Iniciar servicios con Docker
start_services() {
    log_info "Iniciando servicios con Docker Compose..."
    
    # Parar servicios existentes
    docker-compose down
    
    # Construir y levantar servicios
    docker-compose up --build -d
    
    log_success "Servicios iniciados en Docker"
    
    # Mostrar status
    log_info "Estado de los servicios:"
    docker-compose ps
}

# Ejecutar migraciones
run_migrations() {
    log_info "Esperando que los servicios estén listos..."
    sleep 10
    
    log_info "Ejecutando migraciones de base de datos..."
    docker-compose exec backend npm run migrate
    
    log_success "Migraciones completadas"
}

# Mostrar información final
show_info() {
    echo ""
    log_success "🎉 CCB SolidJS Platform - Fase 5 iniciado exitosamente!"
    echo ""
    echo "📱 URLs disponibles:"
    echo "   • Frontend SolidJS: http://localhost:3000"
    echo "   • Backend API: http://localhost:3080"
    echo "   • Sistema Vue.js: http://localhost:8080 (NUNCA MODIFICAR)"
    echo ""
    echo "🗄️ Bases de datos:"
    echo "   • MongoDB: mongodb://localhost:27017"
    echo "   • Redis: redis://localhost:6379"
    echo ""
    echo "📊 Para ver logs:"
    echo "   • docker-compose logs -f"
    echo "   • docker-compose logs -f backend"
    echo "   • docker-compose logs -f frontend"
    echo ""
    log_info "Para parar todos los servicios: docker-compose down"
}

# Función principal
main() {
    check_docker
    create_directories
    setup_env
    install_dependencies
    run_tests
    start_services
    run_migrations
    show_info
}

# Ejecutar función principal
main "$@"
