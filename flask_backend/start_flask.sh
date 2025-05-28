#!/bin/bash

cd "$(dirname "$0")"

echo "📦 Creando entorno virtual..."
python3 -m venv venv

echo "🔄 Activando entorno virtual..."
source venv/bin/activate

echo "⬇️ Instalando dependencias..."
pip install -r requirements.txt

echo "🚀 Iniciando servidor Flask..."
python app.py
