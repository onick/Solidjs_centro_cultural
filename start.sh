#!/bin/bash

echo "🚀 Iniciando CCB SolidJS Platform..."
echo "=================================="

# Verificar que el sistema Vue.js no esté siendo modificado
echo "🔍 Verificando integridad del sistema Vue.js..."
if [ -d "../ccb_repo2" ]; then
    echo "✅ Sistema Vue.js intacto - NO se modificará"
else
    echo "❌ No se encontró el sistema Vue.js en ccb_repo2"
    exit 1
fi

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        return 0  # Puerto en uso
    else
        return 1  # Puerto libre
    fi
}

# Verificar puertos
echo "🔍 Verificando puertos..."

if check_port 3000; then
    echo "⚠️  Puerto 3000 ya está en uso"
    read -p "¿Continuar de todos modos? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if check_port 3080; then
    echo "⚠️  Puerto 3080 ya está en uso"
    read -p "¿Continuar de todos modos? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Instalando dependencias del frontend..."
npm install

echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo "🔄 Iniciando servicios en paralelo..."

# Crear archivos de log
mkdir -p logs
touch logs/frontend.log
touch logs/backend.log

# Iniciar backend en segundo plano
echo "🟢 Iniciando backend Node.js en puerto 3080..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend inicie
sleep 3

# Iniciar frontend
echo "🟦 Iniciando frontend SolidJS en puerto 3000..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Guardar PIDs para poder detener los servicios
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo "=================================="
echo "✅ CCB SolidJS Platform iniciada"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3080"
echo "🔄 Vue.js System: http://localhost:8080 (NO MODIFICADO)"
echo "=================================="
echo "💾 Logs en: logs/"
echo "🛑 Para detener: ./stop.sh"

# Mantener el script corriendo
wait
