# 🏛️ Centro Cultural Banreservas - SolidJS Platform

Sistema de gestión de eventos y visitantes para el Centro Cultural Banreservas, desarrollado con SolidJS.

## 🎨 Diseño Corporativo

- **Colores Oficiales CCB**: Azul `#00BDF2`, Naranja `#F99D2A`, Gris `#474C55`
- **Diseño Responsive**: Adaptado para móvil, tablet y desktop
- **Efectos Visuales**: Gradientes, animaciones y transiciones suaves

## ✨ Características

- ✅ **Panel de Inicio**: Bienvenida corporativa con navegación intuitiva
- ✅ **Gestión de Eventos**: Lista de eventos con filtros y estadísticas
- ✅ **Registro de Visitantes**: Formulario de registro para eventos
- ✅ **Check-in Sistema**: Confirmación de asistencia
- ✅ **Diseño Responsive**: Optimizado para todos los dispositivos
- ✅ **Tiempo Real**: Reloj actualizado y estados en vivo

## 🚀 Demo en Vivo

**Vercel**: [https://solidjs-centro-cultural.vercel.app](https://solidjs-centro-cultural.vercel.app)

## 🛠️ Tecnologías

- **Frontend**: SolidJS 1.9.7
- **Routing**: @solidjs/router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/onick/Solidjs_centro_cultural.git

# Instalar dependencias
cd Solidjs_centro_cultural
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🌐 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Preview de producción
npm run preview

# Pruebas
npm run test
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/           # Componentes UI reutilizables
│   └── Layout.jsx    # Layout principal
├── pages/
│   ├── HomeSimplified.jsx    # Página de inicio
│   ├── EventosImproved.jsx   # Lista de eventos
│   ├── RegistroPage.jsx      # Formulario de registro
│   └── CheckinPage.jsx       # Sistema de check-in
├── styles/           # Estilos globales
└── App.jsx          # Aplicación principal
```

## 🎯 Funcionalidades Principales

### 🏠 Panel de Inicio
- Header corporativo con logo CCB
- Reloj en tiempo real
- Navegación a módulos principales
- Estado del sistema en vivo

### 🎭 Gestión de Eventos
- Lista completa de eventos
- Filtros: Todos, Próximos, En Curso, Finalizados
- Estadísticas de registrados y check-ins
- Navegación directa a registro y check-in

### 📝 Registro de Visitantes
- Formulario intuitivo de registro
- Validación de datos en tiempo real
- Selección de eventos disponibles
- Confirmación de registro

### ✅ Sistema de Check-in
- Verificación de código de registro
- Confirmación de asistencia
- Estado de check-in actualizado

## 🎨 Personalización

Los colores corporativos están definidos en variables CSS:

```css
:root {
  --ccb-blue: #00BDF2;
  --ccb-orange: #F99D2A;
  --ccb-gray: #474C55;
}
```

## 📊 Estado del Proyecto

- **Frontend SolidJS**: 80% ✅
- **Backend Integration**: 70% ✅
- **Responsive Design**: 100% ✅
- **Corporate Design**: 100% ✅

## 🔄 Próximas Funcionalidades

- [ ] Panel Administrativo completo
- [ ] Dashboard con estadísticas
- [ ] Sistema de autenticación
- [ ] Modo kiosco
- [ ] Exportación de datos
- [ ] Notificaciones push

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Desarrollador

**Marcelino Francisco M.**
- GitHub: [@onick](https://github.com/onick)
- Proyecto: Centro Cultural Banreservas

## 🏛️ Sobre el Centro Cultural Banreservas

El Centro Cultural Banreservas es una institución dedicada a promover y difundir las artes y la cultura en la República Dominicana, ofreciendo una amplia gama de actividades culturales, educativas y artísticas.

---

**¿Tienes preguntas o sugerencias?** 
Abre un [issue](https://github.com/onick/Solidjs_centro_cultural/issues) en el repositorio.

---

*Desarrollado con ❤️ para el Centro Cultural Banreservas*