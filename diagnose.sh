#!/bin/bash

echo "🔍 DIAGNÓSTICO CCB SOLIDJS PLATFORM"
echo "=================================="

# Verificar estructura de archivos
echo ""
echo "📁 Verificando estructura de archivos..."

# Verificar archivos críticos
critical_files=(
    "package.json"
    "vite.config.js"
    "tailwind.config.js"
    "postcss.config.js"
    "index.html"
    "src/index.jsx"
    "src/App.jsx"
    "src/styles/index.css"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - FALTA"
    fi
done

echo ""
echo "🔧 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules - OK"
else
    echo "❌ node_modules - FALTA (ejecutar npm install)"
fi

echo ""
echo "🚀 Verificando procesos..."
if pgrep -f "vite.*3000" > /dev/null; then
    echo "✅ Vite Dev Server - EJECUTÁNDOSE"
    echo "   Puerto: $(lsof -ti :3000 2>/dev/null || echo 'No detectado')"
else
    echo "❌ Vite Dev Server - NO EJECUTÁNDOSE"
fi

if pgrep -f "node.*server-basic" > /dev/null; then
    echo "✅ Backend Server - EJECUTÁNDOSE"
    echo "   Puerto: $(lsof -ti :3080 2>/dev/null || echo 'No detectado')"
else
    echo "❌ Backend Server - NO EJECUTÁNDOSE"
fi

echo ""
echo "🌐 Verificando puertos..."
ports=(3000 3001 3080 8080)
for port in "${ports[@]}"; do
    if lsof -ti :$port > /dev/null 2>&1; then
        process=$(lsof -ti :$port | xargs ps -p | tail -n +2 | awk '{print $4}')
        echo "✅ Puerto $port - OCUPADO ($process)"
    else
        echo "⚪ Puerto $port - LIBRE"
    fi
done

echo ""
echo "🔗 URLs de prueba:"
echo "   Frontend: http://localhost:3000"
echo "   Frontend Alt: http://localhost:3001"  
echo "   Backend: http://localhost:3080/health"
echo "   Vue System: http://localhost:8080"

echo ""
echo "🎯 COMANDOS DE SOLUCIÓN:"
echo "========================"
echo ""
echo "1. 🧹 Limpiar y reinstalar dependencias:"
echo "   rm -rf node_modules package-lock.json"
echo "   npm install"
echo ""
echo "2. 🚀 Iniciar con archivos de prueba:"
echo "   # Respaldar archivos actuales"
echo "   cp src/index.jsx src/index.jsx.bak"
echo "   cp src/App.jsx src/App.jsx.bak"
echo "   # Usar archivos de prueba"
echo "   cp src/index-test.jsx src/index.jsx"
echo "   cp src/App-test.jsx src/App.jsx"
echo "   # Iniciar servidor"
echo "   npm run dev"
echo ""
echo "3. 🔧 Si persisten errores de CSS:"
echo "   npm run build"
echo "   # Verificar errores de Tailwind"
echo ""
echo "4. 🐛 Debug completo:"
echo "   # Terminal 1"
echo "   cd backend && node server-basic.js"
echo "   # Terminal 2"  
echo "   npm run dev -- --host --port 3001"
echo ""
echo "=================================="