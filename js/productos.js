// Datos de productos
const todosLosProductos = [
  // Productos originales
  {
    id: 1,
    nombre: "Mochila Wayuu",
    precio: 120000,
    categoria: "textiles",
    descripcion: "Mochila tejida a mano por artesanas de La Guajira.",
    imagen: "https://via.placeholder.com/300x200?text=Mochila+Wayuu",
  },
  {
    id: 2,
    nombre: "Collar Embera",
    precio: 45000,
    categoria: "joyeria",
    descripcion: "Collar elaborado con chaquiras por la comunidad Embera.",
    imagen: "https://via.placeholder.com/300x200?text=Collar+Embera",
  },
  {
    id: 3,
    nombre: "Cerámica Ticuna",
    precio: 85000,
    categoria: "ceramica",
    descripcion: "Pieza de cerámica con pigmentos naturales de la Amazonía.",
    imagen: "https://via.placeholder.com/300x200?text=Cerámica+Ticuna",
  },
  {
    id: 4,
    nombre: "Hamaca Artesanal",
    precio: 250000,
    categoria: "textiles",
    descripcion:
      "Tejida a mano con algodón natural por artesanos del Amazonas.",
    imagen: "https://via.placeholder.com/300x200?text=Hamaca+Artesanal",
  },
  {
    id: 5,
    nombre: "Pulsera Kogi",
    precio: 35000,
    categoria: "joyeria",
    descripcion: "Pulsera tradicional con símbolos de la cosmovisión Kogi.",
    imagen: "https://via.placeholder.com/300x200?text=Pulsera+Kogi",
  },
  {
    id: 6,
    nombre: "Vasija Decorativa",
    precio: 95000,
    categoria: "ceramica",
    descripcion: "Vasija ceremonial con diseños tradicionales.",
    imagen: "https://via.placeholder.com/300x200?text=Vasija+Decorativa",
  },

  // Productos nuevos (novedades)
  {
    id: 7,
    nombre: "Collar de Nácar",
    precio: 78000,
    categoria: "joyeria",
    descripcion: "Nuevo diseño con nácar del Pacífico colombiano.",
    imagen: "https://via.placeholder.com/300x200?text=Collar+Nacar",
    esNovedad: true,
  },
  {
    id: 8,
    nombre: "Tapiz Artesanal",
    precio: 150000,
    categoria: "textiles",
    descripcion: "Colorido tapiz elaborado por artesanos Zenú.",
    imagen: "https://via.placeholder.com/300x200?text=Tapiz+Artesanal",
    esNovedad: true,
  },
  {
    id: 9,
    nombre: "Máscara Ritual",
    precio: 95000,
    categoria: "decoracion",
    descripcion: "Réplica de máscara ceremonial Kamentsá.",
    imagen: "https://via.placeholder.com/300x200?text=Máscara+Ritual",
    esNovedad: true,
  },

  // Productos de ofertas
  {
    id: 10,
    nombre: "Set de Joyería",
    precio: 85000,
    precioOferta: 65000,
    categoria: "joyeria",
    descripcion: "Collar y pulsera Embera con chaquiras naturales.",
    imagen: "https://via.placeholder.com/300x200?text=Set+de+Joyería",
    descuento: 23, // Porcentaje de descuento
  },
];

// Función para actualizar los botones de categoría
function actualizarBotonesCategorias(categoriaFiltro) {
  const botonesCategorias = document.querySelectorAll(".categorias .btn");
  if (!botonesCategorias || botonesCategorias.length === 0) return;

  for (const btn of botonesCategorias) {
    if (btn.dataset.categoria === categoriaFiltro) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  }
}

// Función para inicializar la página de productos
function inicializarPaginaProductos() {
  const params = new URLSearchParams(window.location.search);
  const categoriaFiltro = params.get("categoria");

  if (categoriaFiltro) {
    filtrarCategoria(categoriaFiltro);
    actualizarBotonesCategorias(categoriaFiltro);
  }
}

// Función para inicializar productos en la página de productos
function inicializarProductos() {
  const ruta = window.location.pathname;

  if (ruta.includes("productos.html")) {
    inicializarPaginaProductos();
  }

  // Inicializar productos para novedades
  if (ruta.includes("novedades.html")) {
    mostrarNovedades();
  }

  // Inicializar productos para ofertas
  if (ruta.includes("ofertas.html")) {
    mostrarOfertas();
  }
}

function mostrarNovedades() {
  // Filtrar y mostrar directamente los productos de novedades
  const contenedor = document.getElementById("productos-container");
  if (contenedor) {
    const novedades = todosLosProductos.filter((p) => p.esNovedad);
    mostrarProductosEnContenedor(novedades, contenedor);
  }
}
function mostrarOfertas() {
  // Filtrar y mostrar directamente los productos en oferta
  const contenedor = document.getElementById("productos-container");
  if (contenedor) {
    const ofertas = todosLosProductos.filter((p) => p.precioOferta);
    mostrarProductosEnContenedor(ofertas, contenedor);
  }
}

// Función auxiliar para mostrar productos en un contenedor
function mostrarProductosEnContenedor(productos, contenedor) {
  contenedor.innerHTML = "";
  if (productos.length === 0) {
    contenedor.innerHTML =
      "<p>No hay productos disponibles en esta categoría.</p>";
    return;
  }

  for (const producto of productos) {
    const productoHTML = `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">$${producto.precioOferta
        ? `<span class="oferta">${producto.precio}</span> ${producto.precioOferta}`
        : producto.precio
      }</p>
        <button class="btn-agregar" data-id="${producto.id
      }">Agregar al carrito</button>
      </div>
    `;
    contenedor.innerHTML += productoHTML;
  }
}

// Inicializar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  
  // Actualizar la variable global productos para carrito.js
  window.productos = todosLosProductos;

  // Inicializar productos en la página correspondiente
  inicializarProductos();
});
