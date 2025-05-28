# CCB SolidJS Platform

## 🏛️ Centro Cultural Banreservas - Plataforma SolidJS

Esta es una nueva plataforma desarrollada con **SolidJS** que funciona en paralelo al sistema Vue.js existente, sin modificar ni interferir con el sistema actual.

## 🚀 Configuración de Puertos

- **Frontend SolidJS**: `http://localhost:3000`
- **Backend Node.js**: `http://localhost:3080`
- **Backend Flask**: `http://localhost:5000` (Nuevo)
- **Sistema Vue.js Existente**: `http://localhost:8080` ⚠️ **NO SE MODIFICA**

## 📁 Estructura del Proyecto

```
ccb_solidjs_platform/
├── src/                    # Frontend SolidJS
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── stores/             # Estado global (SolidJS Store)
│   ├── utils/              # Utilidades (incluye sincronización Vue.js)
│   └── styles/             # Estilos CSS con colores CCB
├── backend/                # Backend Node.js + Express
│   ├── routes/             # Rutas API
│   ├── controllers/        # Controladores
│   ├── models/             # Modelos de datos
│   ├── middleware/         # Middleware
│   └── utils/              # Utilidades backend
├── flask_backend/          # NUEVO: Backend Flask para Render
│   ├── app.py              # Punto de entrada de Flask
│   ├── requirements.txt    # Dependencias Python
│   └── Procfile            # Configuración para Render
├── docs/                   # Documentación
├── tests/                  # Pruebas
└── logs/                   # Logs de ejecución
```

## 🛠️ Inicio Rápido

### 1. Iniciar la plataforma (Node.js + SolidJS)
```bash
./start.sh
```

### 2. Iniciar el backend Flask (Nuevo)
```bash
cd flask_backend
./start_flask.sh
```

### 3. Detener la plataforma
```bash
./stop.sh
```

## 🔄 Sistema de Sincronización

La plataforma incluye un sistema de sincronización con el sistema Vue.js existente:

- **WebSocket** para comunicación en tiempo real
- **API Bridge** para replicar datos críticos
- **Fallback automático** al sistema Vue.js en caso de fallos

## 🚀 Despliegue

### Frontend (Vercel)
El frontend está configurado para desplegarse en Vercel automáticamente.

### Backend (Render)
Disponemos de dos opciones de backend:

1. **Node.js**: El backend original del proyecto
2. **Flask**: Nuevo backend optimizado para Render (ver `/flask_backend/README.md` para más detalles)

## ⚠️ IMPORTANTE

- **NO se modifica el sistema actual** en `ccb_repo2`
- **Desarrollo completamente en paralelo**
- **Sistema Vue.js sigue funcionando normalmente**
- **Confirmar cada paso** antes de proceder a siguientes fases
