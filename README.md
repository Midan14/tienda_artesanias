# 🏛️ Artesanías Ancestrales - Tienda Online Completa

Una plataforma e-commerce moderna y completa para la venta de artesanías indígenas colombianas, con sistema de gestión integral y panel de administración.

## 📋 Descripción

**Artesanías Ancestrales** es una tienda online full-stack dedicada a la comercialización de productos artesanales elaborados por comunidades indígenas de Colombia. La plataforma integra frontend, backend, base de datos y panel administrativo para crear un ecosistema completo de e-commerce que promueve el comercio justo y la preservación de técnicas ancestrales.

## ✨ Características Principales

### 🛒 Sistema de E-commerce Completo
- **Carrito de compras inteligente** con persistencia en LocalStorage
- **Dropdown del carrito** con vista previa en tiempo real
- **Contador dinámico** de productos y total
- **Proceso de checkout** completo con formulario de envío
- **Gestión de productos** con categorías y filtros
- **Sistema de stock** en tiempo real

### 👥 Gestión de Usuarios
- **Registro e inicio de sesión** con autenticación JWT
- **Roles de usuario** (cliente/administrador)
- **Gestión de perfil** y datos personales
- **Historial de pedidos** con seguimiento de estados
- **Autenticación segura** con middleware de protección

### 🔐 Panel de Administración
- **Dashboard completo** con estadísticas en tiempo real
- **Gestión de productos** (crear, editar, eliminar)
- **Gestión de usuarios** y roles
- **Gestión de pedidos** con cambio de estados
- **Estadísticas de ventas** y métricas del negocio
- **Sistema de login** independiente para administradores

### 📊 Base de Datos y Backend
- **API REST completa** con Node.js y Express
- **Base de datos MongoDB** con modelos estructurados
- **Autenticación JWT** segura
- **Middleware de protección** de rutas
- **Validación de datos** en servidor
- **Gestión de archivos** y uploads

### 🎨 Diseño y UX
- **Diseño responsivo** mobile-first
- **Interfaz moderna** con colores temáticos
- **Navegación intuitiva** con menú hamburguesa
- **Animaciones suaves** y micro-interacciones
- **Iconografía clara** con Font Awesome
- **Optimización de rendimiento** y carga

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con Grid y Flexbox
- **JavaScript ES6+** - Lógica del cliente
- **Font Awesome** - Iconografía
- **LocalStorage** - Persistencia del carrito

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Control de acceso

### Herramientas de Desarrollo
- **VS Code** - Editor principal
- **Live Server** - Servidor de desarrollo
- **MongoDB Compass** - Gestión de base de datos
- **Postman** - Testing de API

## 📁 Estructura Completa del Proyecto

```
tienda_artesanias/
├── 📄 Frontend (Páginas HTML)
│   ├── index.html              # Página principal
│   ├── productos.html          # Catálogo completo
│   ├── carrito.html           # Carrito y checkout
│   ├── admin.html             # Panel de administración
│   ├── cuenta.html            # Gestión de cuenta
│   ├── about.html             # Información de la empresa
│   ├── contacto.html          # Formulario de contacto
│   ├── blog.html              # Blog informativo
│   ├── novedades.html         # Productos nuevos
│   ├── ofertas.html           # Promociones
│   ├── checkout.html          # Proceso de pago
│   └── confirmacion.html      # Confirmación de pedido
│
├── 🎨 Estilos y Recursos
│   ├── css/
│   │   └── style.css          # Estilos principales responsivos
│   └── img/                   # Imágenes de productos
│       ├── Imagen2.png        # Logo principal
│       ├── Mochila wayuu.png  # Productos artesanales
│       ├── Collar vera.png
│       └── [más imágenes...]
│
├── 💻 JavaScript Frontend
│   ├── js/
│   │   ├── carrito.js         # Lógica del carrito completa
│   │   ├── carrito-page.js    # Página del carrito
│   │   ├── menu.js            # Navegación responsive
│   │   ├── productos.js       # Catálogo y filtros
│   │   ├── auth.js            # Autenticación cliente
│   │   ├── checkout.js        # Proceso de compra
│   │   ├── mis-pedidos.js     # Historial de pedidos
│   │   └── observer-utils.js  # Utilidades modernas
│
├── 🔧 Backend Node.js
│   ├── backend/
│   │   ├── server.js          # Servidor principal Express
│   │   ├── package.json       # Dependencias del proyecto
│   │   ├── .env               # Variables de entorno
│   │   │
│   │   ├── 📊 Modelos (MongoDB)
│   │   ├── models/
│   │   │   ├── User.js        # Modelo de usuarios
│   │   │   ├── Product.js     # Modelo de productos
│   │   │   └── Pedido.js      # Modelo de pedidos
│   │   │
│   │   ├── 🛣️ Rutas API
│   │   ├── routes/
│   │   │   ├── auth.js        # Autenticación y registro
│   │   │   ├── users.js       # Gestión de usuarios
│   │   │   ├── products.js    # CRUD de productos
│   │   │   ├── pedidos.js     # Gestión de pedidos
│   │   │   └── payments.js    # Procesamiento de pagos
│   │   │
│   │   ├── 🛡️ Middleware
│   │   ├── middleware/
│   │   │   └── auth.js        # Protección de rutas JWT
│   │   │
│   │   ├── ⚙️ Configuración
│   │   ├── config/
│   │   │   └── database.js    # Conexión MongoDB
│   │   │
│   │   └── 📦 Scripts Útiles
│   │       ├── seedDatabase.js    # Población inicial
│   │       ├── checkUser.js       # Verificación de usuarios
│   │       └── fixAdminPassword.js # Utilidades admin
│
└── 📚 Documentación
    ├── README.md                  # Este archivo
    ├── MERCADOPAGO_SETUP.md      # Configuración de pagos
    └── PERFORMANCE_OPTIMIZATION.md # Optimizaciones
```

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash

git clone https://github.com/Midan14/tienda_artesanias.git
cd tienda_artesanias

```

### 2️⃣ Configurar el Backend

```bash

# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3️⃣ Configurar MongoDB

```bash
# Instalar MongoDB Community Edition
# macOS: brew install mongodb/brew/mongodb-community
# Windows: Descargar desde mongodb.com
# Ubuntu: sudo apt install mongodb

# Iniciar MongoDB
mongosh
use artesanias_ancestrales

```

### 4️⃣ Poblar la Base de Datos

```bash

# Ejecutar script de población inicial
node seedDatabase.js

# Verificar datos
node checkUser.js

```

### 5️⃣ Iniciar el Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### 6️⃣ Configurar el Frontend

```bash
# Instalar Live Server en VS Code
# O usar cualquier servidor estático

# Con VS Code:
# 1. Instalar extensión "Live Server"
# 2. Clic derecho en index.html
# 3. "Open with Live Server"
```

## 🎯 Uso del Sitemap

### 👤 Para Clientes

1. **Navegar** por el catálogo en "Productos"
2. **Filtrar** por categorías o búsqueda
3. **Agregar** productos al carrito
4. **Revisar** carrito en dropdown flotante
5. **Proceder** al checkout con datos de envío
6. **Registrarse** o iniciar sesión
7. **Completar** el pedido
8. **Seguir** el estado en "Mis Pedidos"

### 👨‍💼 Para Administradores

1. **Acceder** a `/admin.html`
2. **Credenciales**: `admin` / `artesanias2025`
3. **Dashboard** con estadísticas en tiempo real
4. **Gestionar** productos, usuarios y pedidos
5. **Actualizar** estados de pedidos
6. **Generar** reportes y estadísticas

## 🔑 Credenciales por Defecto

### Administrador

- **Usuario**: `admin`
- **Contraseña**: `artesanias2025`
- **Acceso**: `/admin.html`

### Base de Datos

- **URL**: `mongodb://localhost:27017/artesanias_ancestrales`
- **Colecciones**: `users`, `products`, `pedidos`

## 🌐 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### Productos

- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Pedidos

- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/:id/estado` - Actualizar estado

### Usuarios

- `GET /api/users` - Listar usuarios (admin)
- `PUT /api/users/:id` - Actualizar usuario

## 🚧 Características Implementadas

### ✅ Completadas

- [x] **Sistema de carrito** completo con persistencia
- [x] **Autenticación JWT** segura
- [x] **Panel de administración** funcional
- [x] **API REST** completa
- [x] **Base de datos** estructurada
- [x] **Diseño responsive** mobile-first
- [x] **Gestión de pedidos** con estados
- [x] **Dashboard** con estadísticas
- [x] **Documentación** completa

### 🔄 En Desarrollo

- [ ] **Integración con Mercado Pago**
- [ ] **Sistema de reviews** y calificaciones
- [ ] **Chat en vivo** con soporte
- [ ] **Notificaciones push**
- [ ] **Reportes avanzados** en PDF

## 🛡️ Seguridad

- **Autenticación JWT** con expiración
- **Encriptación** de contraseñas con bcrypt
- **Validación** de datos en servidor
- **Protección CORS** configurada
- **Middleware** de autenticación en rutas protegidas
- **Sanitización** de entradas de usuario

## 📱 Responsive Design

- **Mobile First** - Diseño optimizado para móviles
- **Breakpoints** configurados para todas las pantallas
- **Menú hamburguesa** en dispositivos móviles
- **Touch-friendly** - Botones y elementos táctiles
- **Imágenes optimizadas** para diferentes resoluciones

## 🔧 Scripts Disponibles

```bash
# Backend
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run seed       # Poblar base de datos

# Base de datos
node seedDatabase.js      # Crear datos iniciales
node checkUser.js         # Verificar usuarios
node fixAdminPassword.js  # Restablecer admin
```

## 📈 Métricas y Estadísticas

El panel administrativo incluye:

- **Ventas totales** del mes
- **Número de pedidos** y estados
- **Usuarios registrados** y roles
- **Productos** con stock bajo
- **Gráficos** de rendimiento
- **Reportes** exportables

## 🎨 Paleta de Colores

```css

:root {
  --color-primary: #8B4513;      /* Marrón principal */
  --color-secondary: #D2691E;    /* Naranja/Terracota */
  --color-accent: #F4A460;       /* Beige claro */
  --color-text: #3a3a3a;         /* Texto principal */
  --color-background: #f8f9fa;   /* Fondo */
}
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

### 📋 Código de Conducta

- Usa un lenguaje profesional y respetuoso
- Enfócate en el beneficio de la comunidad
- Acepta críticas constructivas
- Mantén la calidad del código

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Miguel Antonio Moscote**

- Email: mmoscot25613@universidadean.edu.com
- GitHub: [@Midan14](https://github.com/Midan14)
- LinkedIn: [Miguel Antonio Moscote](https://linkedin.com/in/miguel-moscote)

## 🙏 Agradecimientos

- **Comunidades indígenas** de Colombia por su arte ancestral
- **Universidad EAN** por el apoyo académico
- **Comunidad open source** por las herramientas utilizadas
- **Artesanos colombianos** que inspiran este proyecto

## 🎯 Visión del Proyecto

Este proyecto busca:
- **Preservar** las tradiciones artesanales indígenas
- **Conectar** artesanos con el mercado global
- **Promover** el comercio justo y sostenible
- **Tecnificar** la venta de productos tradicionales
- **Crear** oportunidades económicas para las comunidades

---

**Desarrollado con ❤️ para apoyar a las comunidades indígenas de Colombia**

*¿Encontraste algún bug o tienes una sugerencia? ¡Abre un issue!* 🐛✨
