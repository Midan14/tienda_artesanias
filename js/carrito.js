const productos = [
  { id: 1, nombre: "Mochila Wayuu", precio: 120000 },
  { id: 2, nombre: "Collar Embera", precio: 45000 },
  { id: 3, nombre: "Cerámica Ticuna", precio: 85000 },
  { id: 4, nombre: "Hamaca Artesanal", precio: 250000 },
  { id: 5, nombre: "Pulsera Kogi", precio: 35000 },
  { id: 6, nombre: "Vasija Decorativa", precio: 95000 },
];
let carrito = [];

// Cargar carrito guardado en localStorage si existe
document.addEventListener("DOMContentLoaded", () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }

  // Inicializar las vistas del carrito
  actualizarContadorCarrito();
  actualizarPreviewCarrito();

  // Agregar evento click al documento para cerrar el preview del carrito
  document.addEventListener("click", (e) => {
    const cartIcons = document.querySelectorAll(
      ".icon-link .fa-shopping-cart, .cart-icon"
    );
    const cartPreview = document.getElementById("cart-preview");

    if (cartPreview) {
      // Verificar si el clic fue en uno de los iconos del carrito o dentro del preview
      const clickedOnCartIcon = Array.from(cartIcons).some(
        (icon) => icon.contains(e.target) || icon.parentNode.contains(e.target)
      );

      // Si el clic NO fue en el carrito ni dentro del preview
      if (!clickedOnCartIcon && !cartPreview.contains(e.target)) {
        cartPreview.classList.remove("active");
      }
    }
  });
});

function agregarAlCarrito(id, precioOferta) {
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    // Si se proporciona un precio de oferta, crear una copia del producto con el precio modificado
    if (precioOferta) {
      const productoOferta = {
        ...producto,
        precio: precioOferta,
        esOferta: true,
      };
      carrito.push(productoOferta);
      mostrarNotificacion(`${producto.nombre} (OFERTA) añadido al carrito`);
    } else {
      carrito.push(producto);
      mostrarNotificacion(`${producto.nombre} añadido al carrito`);
    }

    actualizarCarrito();
    actualizarContadorCarrito();
    actualizarPreviewCarrito();

    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

function actualizarCarrito() {
  const contenedor = document.getElementById("carrito-container");
  const totalSpan = document.getElementById("total");
  const totalFinalSpan = document.getElementById("total-final");
  if (!contenedor) {
    return;
  }

  contenedor.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
        <h3>Tu carrito está vacío</h3>
        <p>¡Explora nuestros productos artesanales y añade algo al carrito!</p>
        <a href="productos.html" class="btn">Ver Productos</a>
      </div>
    `;

    // Deshabilitar el botón de pago si el carrito está vacío
    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
      btnPagar.disabled = true;
      btnPagar.classList.add("disabled");
    }
  } else {
    let index = 0;
    for (const producto of carrito) {
      total += producto.precio;
      contenedor.innerHTML += `
        <div class="item-carrito">
          <div>
            <h4>${producto.nombre}</h4>
            <p>Precio: $${producto.precio.toLocaleString("es-CO")}</p>
          </div>
          <button class="btn" onclick="eliminarDelCarrito(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      index++;
    }

    // Habilitar el botón de pago si hay productos en el carrito
    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
      btnPagar.disabled = false;
      btnPagar.classList.remove("disabled");
    }
  }

  // Actualizar subtotal y total final
  if (totalSpan) {
    totalSpan.textContent = `$${total.toLocaleString("es-CO")}`;
  }

  // Actualizar el total final (en este caso es igual al subtotal porque el envío es gratis)
  if (totalFinalSpan) {
    totalFinalSpan.textContent = `$${total.toLocaleString("es-CO")}`;
  }
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  actualizarContadorCarrito();
  actualizarPreviewCarrito();

  // Actualizar localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarNotificacion("Producto eliminado del carrito");
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
  actualizarContadorCarrito();
  actualizarPreviewCarrito();

  // Actualizar localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarNotificacion("Carrito vaciado");
}

function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div");
  notificacion.className = "notificacion";
  notificacion.innerHTML = `<p>${mensaje}</p>`;

  // Agregar estilos inline temporales hasta que los agreguemos al CSS
  notificacion.style.position = "fixed";
  notificacion.style.bottom = "20px";
  notificacion.style.right = "20px";
  notificacion.style.backgroundColor = "var(--color-accent)";
  notificacion.style.color = "white";
  notificacion.style.padding = "10px 20px";
  notificacion.style.borderRadius = "4px";
  notificacion.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  notificacion.style.transform = "translateY(100px)";
  notificacion.style.opacity = "0";
  notificacion.style.transition = "transform 0.3s, opacity 0.3s";

  // Agregar al body
  document.body.appendChild(notificacion);

  // Mostrar con animación
  setTimeout(() => {
    notificacion.style.transform = "translateY(0)";
    notificacion.style.opacity = "1";
  }, 100);

  // Eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.style.transform = "translateY(100px)";
    notificacion.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 500);
  }, 3000);
}

// Función para procesar el pago
function procesarPago() {
  // Aquí se integraría con un servicio de pagos real
  alert(
    "¡Gracias por tu compra! En breve recibirás un correo con los detalles."
  );
  vaciarCarrito();
  // Redireccionar al inicio
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

// Funciones para el carrito flotante
function actualizarContadorCarrito() {
  const contador = document.getElementById("cart-counter");
  if (contador) {
    contador.textContent = carrito.length;

    // Mostrar u ocultar el contador según si hay elementos en el carrito
    if (carrito.length > 0) {
      contador.style.display = "flex";
    } else {
      contador.style.display = "none";
    }
  }
}

function mostrarPreviewCarrito() {
  const previewCarrito = document.getElementById("cart-preview");
  if (!previewCarrito) {
    return;
  }

  previewCarrito.classList.toggle("active");

  // Ajustar posición del preview del carrito según dispositivo
  if (window.innerWidth <= 768) {
    previewCarrito.style.right = "0";
    previewCarrito.style.left = "auto";
  }

  // Si se está mostrando, actualizar contenido
  if (previewCarrito.classList.contains("active")) {
    actualizarPreviewCarrito();
  }
}

function actualizarPreviewCarrito() {
  const previewContainer = document.getElementById("cart-preview-items");
  const previewTotal = document.getElementById("cart-preview-total");
  if (!previewContainer || !previewTotal) {
    return;
  }

  previewContainer.innerHTML = "";

  if (carrito.length === 0) {
    previewContainer.innerHTML = `
      <div style="text-align: center; padding: 1rem 0;">
        <i class="fas fa-shopping-cart" style="font-size: 2rem; color: #ccc; margin-bottom: 0.5rem;"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    previewTotal.textContent = "$0";
  } else {
    let total = 0;
    // Mostrar máximo 3 items en el preview
    const itemsToShow = carrito.slice(0, 3);

    for (const producto of itemsToShow) {
      total += producto.precio;
      previewContainer.innerHTML += `
        <div class="cart-preview-item">
          <div>${producto.nombre}</div>
          <div>$${producto.precio.toLocaleString("es-CO")}</div>
        </div>
      `;
    }

    // Si hay más de 3 items, mostrar mensaje
    if (carrito.length > 3) {
      previewContainer.innerHTML += `<p>Y ${
        carrito.length - 3
      } artículos más...</p>`;
    }

    // Actualizar total
    previewTotal.textContent = `$${total.toLocaleString("es-CO")}`;
  }
}
