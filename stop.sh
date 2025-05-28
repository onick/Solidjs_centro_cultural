#!/bin/bash

echo "🛑 Deteniendo CCB SolidJS Platform..."

# Leer PIDs de los archivos
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    echo "🔧 Deteniendo backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || echo "Backend ya estaba detenido"
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    echo "🟦 Deteniendo frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || echo "Frontend ya estaba detenido"
    rm logs/frontend.pid
fi

# Limpiar procesos en los puertos por si acaso
echo "🧹 Limpiando puertos 3000 y 3080..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3080 | xargs kill -9 2>/dev/null || true

echo "✅ CCB SolidJS Platform detenida"
echo "⚠️  Sistema Vue.js (puerto 8080) NO ha sido afectado"
