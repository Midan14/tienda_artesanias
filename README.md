<!-- trunk-ignore-all(prettier) -->
# Artesanías Ancestrales - Tienda Online

Sitio web para la venta de artesanías indígenas colombianas.

## Descripción

Artesanías Ancestrales es una tienda online dedicada a la comercialización de productos artesanales elaborados por comunidades indígenas de Colombia. La plataforma busca crear un puente entre los artesanos y el mercado global, promoviendo el comercio justo y la preservación de técnicas ancestrales.

## Características Principales

### Sistema de Usuarios

- Registro e inicio de sesión de usuarios
- Gestión de cuenta personal
- Seguimiento de pedidos

### Catálogo y Compras

- Catálogo completo de productos artesanales
- Filtrado de productos por categorías
- Sistema de carrito de compras con persistencia (LocalStorage)
- Vista previa del carrito flotante
- Contador de productos en tiempo real
- Notificaciones visuales al añadir/remover productos

### Navegación y Diseño

- Diseño responsivo mobile-first
- Menú de navegación moderno con versión móvil
- Elementos optimizados para pantallas táctiles
- Interfaz intuitiva con iconografía clara

### Secciones Especiales

- Página de novedades con últimos productos
- Sección de ofertas y descuentos
- Blog informativo sobre artesanías y tradiciones
- Información sobre comunidades indígenas
- Formulario de contacto

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage para persistencia de datos

## Estructura del Proyecto

```text
tienda-artesanias/
├── index.html          # Página principal
├── productos.html      # Catálogo de productos
├── carrito.html        # Carrito de compras
├── about.html          # Información sobre nosotros
├── contacto.html       # Página de contacto
├── blog.html          # Blog informativo
├── cuenta.html        # Gestión de cuenta
├── novedades.html     # Nuevos productos
├── ofertas.html       # Productos en oferta
├── css/
│   └── style.css      # Estilos CSS
├── js/
│   ├── carrito.js     # Funcionalidad del carrito
│   ├── menu.js        # Funcionalidad del menú
│   └── productos.js   # Gestión de productos
└── img/               # Imágenes del sitio

```

## Instalación

1. Clona este repositorio:

   ```bash
   git clone <https://github.com/Midan14/tienda_artesanias.git>
   ```

2. Abre el archivo `index.html` en tu navegador

No se requiere ninguna instalación adicional ya que es un proyecto estático sin dependencias externas.

## Uso

1. Navega por el catálogo en la sección "Productos"
2. Agrega artículos al carrito usando el botón "Añadir al Carrito"
3. Revisa el carrito haciendo hover/click en el icono flotante
4. Gestiona tu pedido en la página "Carrito"
5. Regístrate o inicia sesión para completar tu compra
6. Explora el blog y secciones informativas sobre las comunidades indígenas

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, por favor abre primero un issue para discutir qué te gustaría cambiar.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

## Contacto

Miguel Antonio Moscote - <mmoscot25613@universidadean.edu.com>

Desarrollado con ❤️ para apoyar a las comunidades indígenas de Colombia
