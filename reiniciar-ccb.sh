#!/bin/bash

echo "🔄 ============================================="
echo "   REINICIO COMPLETO - CCB SOLIDJS PLATFORM"
echo "   Aplicando correcciones..."
echo "============================================="

# Navegar al directorio del proyecto
cd "/Volumes/Centro cultural Backup/ccb 2025/Web Proyect/Solid/ccb_solidjs_platform"

echo ""
echo "🧹 Limpiando cache y dependencias..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

echo "✅ Cache limpiado"

echo ""
echo "📦 Verificando dependencias..."
npm install --silent

echo ""
echo "🔍 Verificando archivos principales..."

if [ -f "src/App.jsx" ]; then
    echo "✅ App.jsx - OK"
else
    echo "❌ App.jsx - FALTA"
fi

if [ -f "src/index.jsx" ]; then
    echo "✅ index.jsx - OK (actualizado)"
else
    echo "❌ index.jsx - FALTA"
fi

if [ -f "src/pages/HomeImproved.jsx" ]; then
    echo "✅ HomeImproved.jsx - OK"
else
    echo "❌ HomeImproved.jsx - FALTA"
fi

if [ -f "src/pages/EventosImproved.jsx" ]; then
    echo "✅ EventosImproved.jsx - OK"
else
    echo "❌ EventosImproved.jsx - FALTA"
fi

echo ""
echo "🚀 Iniciando servidor de desarrollo..."
echo ""
echo "IMPORTANTE:"
echo "• El servidor se iniciará en un puerto disponible"
echo "• Busca la URL en la salida del comando"
echo "• Normalmente será http://localhost:3002/ o similar"
echo ""

# Iniciar el servidor
npm run dev