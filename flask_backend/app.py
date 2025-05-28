from flask import Flask, request, jsonify
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import json
from flask_cors import CORS

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permitir solicitudes CORS para integración con frontend en Vercel

# Conexión a MongoDB Atlas
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_database("centro_cultural")
visitantes_collection = db.visitantes

@app.route('/')
def home():
    return jsonify({"message": "Hola desde Flask en Render - Centro Cultural Banreservas"})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar el estado del servicio"""
    return jsonify({
        "status": "online",
        "service": "ccb-flask-backend",
        "database": "connected" if mongo_uri else "not_configured"
    })

@app.route('/api/registro', methods=['POST'])
def registro_visitante():
    try:
        data = request.get_json()
        
        # Validación básica
        if not data:
            return jsonify({"error": "No se proporcionaron datos"}), 400
            
        required_fields = ['nombre', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"El campo '{field}' es requerido"}), 400
        
        # Añadir timestamp
        from datetime import datetime
        data['fecha_registro'] = datetime.now().isoformat()
        
        # Inserción en MongoDB
        resultado = visitantes_collection.insert_one(data)
        
        return jsonify({
            "success": True,
            "message": "Visitante registrado correctamente",
            "id": str(resultado.inserted_id)
        }), 201
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Para desarrollo local
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
