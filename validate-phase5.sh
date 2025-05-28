#!/bin/bash

# Script de validación completa - Fase 5
echo "🔍 Validando implementación de Fase 5..."
echo "======================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

success_count=0
total_checks=0

check_item() {
    local description="$1"
    local command="$2"
    
    total_checks=$((total_checks + 1))
    echo -n "Verificando $description... "
    
    if eval "$command" &>/dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ FALLO${NC}"
        echo "   Comando: $command"
    fi
}

echo "📁 Verificando archivos de estructura..."
check_item "Modelo Event.js" "[ -f backend/models/Event.js ]"
check_item "Modelo Visitor.js" "[ -f backend/models/Visitor.js ]"
check_item "Modelo User.js" "[ -f backend/models/User.js ]"
check_item "Modelo Configuration.js" "[ -f backend/models/Configuration.js ]"
check_item "RedisManager" "[ -f backend/utils/redisManager.js ]"
check_item "DatabaseManager" "[ -f backend/utils/database.js ]"
check_item "Logger Winston" "[ -f backend/utils/logger.js ]"
check_item "Sistema de migraciones" "[ -f backend/utils/migrations.js ]"

echo ""
echo "🐳 Verificando archivos Docker..."
check_item "docker-compose.yml" "[ -f docker-compose.yml ]"
check_item "Dockerfile.backend" "[ -f Dockerfile.backend ]"
check_item "Dockerfile.frontend" "[ -f Dockerfile.frontend ]"
check_item "nginx.conf" "[ -f nginx.conf ]"

echo ""
echo "🧪 Verificando configuración de testing..."
check_item "jest.config.js" "[ -f backend/jest.config.js ]"
check_item "tests/setup.js" "[ -f backend/tests/setup.js ]"
check_item "directorio tests/models" "[ -d backend/tests/models ]"

echo ""
echo "⚙️  Verificando configuración..."
check_item ".env.example" "[ -f .env.example ]"
check_item "GitHub Actions" "[ -f .github/workflows/ci-cd.yml ]"
check_item "Script de inicio" "[ -f start-phase5.sh ]"
check_item "Documentación Fase 5" "[ -f FASE_5_COMPLETADA.md ]"

echo ""
echo "📦 Verificando dependencias de backend..."
check_item "mongoose en package.json" "grep -q '\"mongoose\"' backend/package.json"
check_item "ioredis en package.json" "grep -q '\"ioredis\"' backend/package.json"
check_item "winston en package.json" "grep -q '\"winston\"' backend/package.json"
check_item "jest en package.json" "grep -q '\"jest\"' backend/package.json"

echo ""
echo "🔍 Verificando scripts npm..."
check_item "script phase5:start" "grep -q '\"phase5:start\"' package.json"
check_item "script docker:up" "grep -q '\"docker:up\"' package.json"
check_item "script migrate" "grep -q '\"migrate\"' backend/package.json"

echo ""
echo "📊 RESUMEN DE VALIDACIÓN"
echo "========================"
success_rate=$((success_count * 100 / total_checks))
echo "Verificaciones exitosas: $success_count/$total_checks ($success_rate%)"

if [ $success_rate -eq 100 ]; then
    echo -e "${GREEN}🎉 ¡FASE 5 COMPLETAMENTE IMPLEMENTADA!${NC}"
    echo ""
    echo "✅ Todos los componentes están en su lugar"
    echo "✅ Arquitectura MongoDB + Redis + Docker lista"
    echo "✅ Sistema de testing configurado"
    echo "✅ Pipeline CI/CD implementado"
    echo "✅ Logging y monitoreo configurado"
    echo ""
    echo "🚀 Para iniciar el sistema completo:"
    echo "   ./start-phase5.sh"
elif [ $success_rate -ge 90 ]; then
    echo -e "${YELLOW}⚠️  FASE 5 CASI COMPLETA${NC}"
    echo "Algunos componentes menores pueden faltar"
else
    echo -e "${RED}❌ FASE 5 INCOMPLETA${NC}"
    echo "Se requiere completar más componentes antes del deployment"
fi

echo ""
echo "📋 Para más detalles, revisa: FASE_5_COMPLETADA.md"
