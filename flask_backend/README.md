# Backend Flask para Centro Cultural Banreservas

Este backend en Flask está diseñado para ser desplegado en Render.com y trabaja con MongoDB Atlas como base de datos.

## Características

- Implementado con Flask
- Conexión a MongoDB Atlas
- Configuración mediante variables de entorno
- Endpoint de registro de visitantes
- CORS habilitado para integración con frontend en Vercel
- Listo para despliegue en Render

## Estructura de archivos

```
/flask_backend
├── app.py             # Punto de entrada de la aplicación
├── requirements.txt   # Dependencias
├── Procfile           # Configuración para Render
├── .env.example       # Ejemplo de variables de entorno
└── start_flask.sh     # Script para desarrollo local
```

## Configuración

1. Crea un archivo `.env` basado en `.env.example` con tus credenciales reales de MongoDB Atlas
2. Asegúrate de tener Python 3.8+ instalado

## Desarrollo local

```bash
# Dar permisos de ejecución al script (solo primera vez)
chmod +x start_flask.sh

# Iniciar el servidor de desarrollo
./start_flask.sh
```

El servidor estará disponible en http://localhost:5000

## Endpoints disponibles

- `GET /` - Mensaje de bienvenida
- `GET /api/health` - Verificación del estado del servicio
- `POST /api/registro` - Registro de visitantes

## Despliegue en Render

1. Sube el código a GitHub
2. En Render.com, crea un nuevo servicio Web
3. Conecta tu repositorio de GitHub
4. Especifica la ruta `/flask_backend` como directorio raíz
5. Usa el comando de inicio: `gunicorn app:app`
6. Añade la variable de entorno `MONGO_URI` con tu URI real de MongoDB Atlas
7. ¡Listo!
