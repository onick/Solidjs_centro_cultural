# CCB SolidJS Platform

## 🏛️ Centro Cultural Banreservas - Plataforma SolidJS

Esta es una nueva plataforma desarrollada con **SolidJS** que funciona en paralelo al sistema Vue.js existente, sin modificar ni interferir con el sistema actual.

## 🚀 Configuración de Puertos

- **Frontend SolidJS**: `http://localhost:3000`
- **Backend Node.js**: `http://localhost:3080`  
- **Sistema Vue.js Existente**: `http://localhost:8080` ⚠️ **NO SE MODIFICA**

## 📁 Estructura del Proyecto

```
ccb_solidjs_platform/
├── src/                    # Frontend SolidJS
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── stores/            # Estado global (SolidJS Store)
│   ├── utils/             # Utilidades (incluye sincronización Vue.js)
│   └── styles/            # Estilos CSS con colores CCB
├── backend/               # Backend Node.js + Express
│   ├── routes/            # Rutas API
│   ├── controllers/       # Controladores
│   ├── models/            # Modelos de datos
│   ├── middleware/        # Middleware
│   └── utils/             # Utilidades backend
├── docs/                  # Documentación
├── tests/                 # Pruebas
└── logs/                  # Logs de ejecución
```

## 🛠️ Inicio Rápido

### 1. Iniciar la plataforma
```bash
./start.sh
```

### 2. Detener la plataforma
```bash
./stop.sh
```

## 🔄 Sistema de Sincronización

La plataforma incluye un sistema de sincronización con el sistema Vue.js existente:

- **WebSocket** para comunicación en tiempo real
- **API Bridge** para replicar datos críticos
- **Fallback automático** al sistema Vue.js en caso de fallos

## ⚠️ IMPORTANTE

- **NO se modifica el sistema actual** en `ccb_repo2`
- **Desarrollo completamente en paralelo**
- **Sistema Vue.js sigue funcionando normalmente**
- **Confirmar cada paso** antes de proceder a siguientes fases
