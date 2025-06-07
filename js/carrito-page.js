// JavaScript específico para la página del carrito
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página del carrito cargada');
    
    // Diagnóstico del carrito
    console.log('Estado del carrito:', {
        carritoExiste: typeof carrito !== 'undefined',
        localStorage: localStorage.getItem('carrito'),
        windowCarrito: window.carrito
    });
    
    // Esperar a que carrito esté disponible
    if (typeof carrito === 'undefined') {
        console.log('Esperando a que carrito se cargue...');
        setTimeout(() => {
            if (typeof carrito !== 'undefined') {
                console.log('Carrito encontrado, items:', carrito.items);
                renderizarCarritoCompleto();
            } else {
                console.error('Carrito no disponible después de timeout');
                // Intentar crear carrito desde localStorage directamente
                const itemsStorage = localStorage.getItem('carrito');
                if (itemsStorage) {
                    console.log('Intentando renderizar desde localStorage:', itemsStorage);
                    renderizarCarritoDesdeStorage(JSON.parse(itemsStorage));
                } else {
                    inicializarCarritoVacio();
                }
            }
        }, 300);
    } else {
        console.log('Carrito disponible inmediatamente, items:', carrito.items);
        renderizarCarritoCompleto();
    }
});

function inicializarCarritoVacio() {
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="carrito-vacio">
            <i class="fas fa-shopping-cart"></i>
            <h2>Tu carrito está vacío</h2>
            <p>¡Agrega algunos productos para comenzar tu compra!</p>
            <a href="index.html" class="btn-continuar">
                <i class="fas fa-arrow-left"></i> Continuar Comprando
            </a>
        </div>
    `;
}

function renderizarCarritoDesdeStorage(items) {
    console.log('Renderizando desde localStorage:', items);
    const contenedor = document.getElementById('carrito-contenido');
    
    if (!contenedor) return;
    
    if (!items || items.length === 0) {
        inicializarCarritoVacio();
        return;
    }

    const calcularTotal = (items) => {
        return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const obtenerCantidadTotal = (items) => {
        return items.reduce((total, item) => total + item.cantidad, 0);
    };

    const subtotal = calcularTotal(items);
    const envio = subtotal > 200000 ? 0 : 15000;
    const total = subtotal + envio;

    contenedor.innerHTML = `
        <div class="carrito-content">
            <div class="carrito-items">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>Productos en tu carrito (${obtenerCantidadTotal(items)} items)</h2>
                    <button class="btn-vaciar" onclick="vaciarCarritoDirecto()">
                        <i class="fas fa-trash"></i> Vaciar Carrito
                    </button>
                </div>
                ${items.map(item => `
                    <div class="item-carrito">
                        <img src="${item.imagen}" alt="${item.nombre}" class="item-imagen">
                        <div class="item-info">
                            <h3>${item.nombre}</h3>
                            <p>Producto artesanal hecho a mano</p>
                            <p>Precio unitario: $${item.precio.toLocaleString()}</p>
                        </div>
                        <div class="cantidad-control">
                            <button class="cantidad-btn" onclick="cambiarCantidadDirecto('${item.id}', ${item.cantidad - 1})">-</button>
                            <input type="number" class="cantidad-input" value="${item.cantidad}" 
                                   onchange="cambiarCantidadDirecto('${item.id}', this.value)" min="1">
                            <button class="cantidad-btn" onclick="cambiarCantidadDirecto('${item.id}', ${item.cantidad + 1})">+</button>
                        </div>
                        <div class="item-precio">
                            $${(item.precio * item.cantidad).toLocaleString()}
                        </div>
                        <button class="btn-eliminar" onclick="eliminarItemDirecto('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div class="carrito-resumen">
                <h3>Resumen del Pedido</h3>
                
                <div class="resumen-linea">
                    <span>Subtotal (${obtenerCantidadTotal(items)} items):</span>
                    <span>$${subtotal.toLocaleString()}</span>
                </div>
                
                <div class="resumen-linea">
                    <span>Envío:</span>
                    <span>${envio === 0 ? 'GRATIS' : '$' + envio.toLocaleString()}</span>
                </div>
                
                ${envio === 0 ? `
                    <div style="background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 14px; color: #155724;">
                        <i class="fas fa-check-circle"></i> ¡Felicidades! Tienes envío gratis
                    </div>
                ` : `
                    <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 14px; color: #856404;">
                        <i class="fas fa-info-circle"></i> Envío gratis en compras superiores a $200.000
                    </div>
                `}
                
                <div class="resumen-linea resumen-total">
                    <span>Total:</span>
                    <span>$${total.toLocaleString()}</span>
                </div>
                
                <button class="btn-checkout" onclick="procederAlCheckout()">
                    <i class="fas fa-credit-card"></i> Proceder al Checkout
                </button>
                
                <div style="margin-top: 20px; text-align: center;">
                    <a href="index.html" style="color: #8B4513; text-decoration: none; font-size: 14px;">
                        <i class="fas fa-arrow-left"></i> Continuar comprando
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Funciones directas para manejo de localStorage
function cambiarCantidadDirecto(productId, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (nuevaCantidad < 1) {
        eliminarItemDirecto(productId);
        return;
    }
    
    const items = JSON.parse(localStorage.getItem('carrito') || '[]');
    const item = items.find(item => item.id === productId);
    if (item) {
        item.cantidad = nuevaCantidad;
        localStorage.setItem('carrito', JSON.stringify(items));
        renderizarCarritoDesdeStorage(items);
        actualizarContadorDirecto(items);
    }
}

function eliminarItemDirecto(productId) {
    let items = JSON.parse(localStorage.getItem('carrito') || '[]');
    const item = items.find(item => item.id === productId);
    
    if (item && confirm(`¿Estás seguro de eliminar "${item.nombre}" del carrito?`)) {
        items = items.filter(item => item.id !== productId);
        localStorage.setItem('carrito', JSON.stringify(items));
        renderizarCarritoDesdeStorage(items);
        actualizarContadorDirecto(items);
    }
}

function vaciarCarritoDirecto() {
    if (confirm('¿Estás seguro de vaciar todo el carrito? Esta acción no se puede deshacer.')) {
        localStorage.setItem('carrito', JSON.stringify([]));
        inicializarCarritoVacio();
        actualizarContadorDirecto([]);
    }
}

function actualizarContadorDirecto(items) {
    const contador = document.getElementById('cart-counter');
    if (contador) {
        const total = items.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = total;
        contador.style.display = total > 0 ? 'inline' : 'none';
    }
}

function renderizarCarritoCompleto() {
    const contenedor = document.getElementById('carrito-contenido');
    
    if (!contenedor) return;
    
    // Verificar que carrito existe y tiene items
    if (typeof carrito === 'undefined' || !carrito.items) {
        inicializarCarritoVacio();
        return;
    }

    if (carrito.items.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <h2>Tu carrito está vacío</h2>
                <p>¡Agrega algunos productos para comenzar tu compra!</p>
                <a href="index.html" class="btn-continuar">
                    <i class="fas fa-arrow-left"></i> Continuar Comprando
                </a>
            </div>
        `;
        return;
    }

    const subtotal = carrito.calcularTotal();
    const envio = subtotal > 200000 ? 0 : 15000; // Envío gratis para compras superiores a $200.000
    const total = subtotal + envio;

    contenedor.innerHTML = `
        <div class="carrito-content">
            <div class="carrito-items">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>Productos en tu carrito (${carrito.obtenerCantidadTotal()} items)</h2>
                    <button class="btn-vaciar" onclick="confirmarVaciarCarrito()">
                        <i class="fas fa-trash"></i> Vaciar Carrito
                    </button>
                </div>
                ${carrito.items.map(item => `
                    <div class="item-carrito">
                        <img src="${item.imagen}" alt="${item.nombre}" class="item-imagen">
                        <div class="item-info">
                            <h3>${item.nombre}</h3>
                            <p>Producto artesanal hecho a mano</p>
                            <p>Precio unitario: $${item.precio.toLocaleString()}</p>
                        </div>
                        <div class="cantidad-control">
                            <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', ${item.cantidad - 1})">-</button>
                            <input type="number" class="cantidad-input" value="${item.cantidad}" 
                                   onchange="cambiarCantidad('${item.id}', this.value)" min="1">
                            <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', ${item.cantidad + 1})">+</button>
                        </div>
                        <div class="item-precio">
                            $${(item.precio * item.cantidad).toLocaleString()}
                        </div>
                        <button class="btn-eliminar" onclick="confirmarEliminarItem('${item.id}', '${item.nombre}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div class="carrito-resumen">
                <h3>Resumen del Pedido</h3>
                
                <div class="resumen-linea">
                    <span>Subtotal (${carrito.obtenerCantidadTotal()} items):</span>
                    <span>$${subtotal.toLocaleString()}</span>
                </div>
                
                <div class="resumen-linea">
                    <span>Envío:</span>
                    <span>${envio === 0 ? 'GRATIS' : '$' + envio.toLocaleString()}</span>
                </div>
                
                ${envio === 0 ? `
                    <div style="background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 14px; color: #155724;">
                        <i class="fas fa-check-circle"></i> ¡Felicidades! Tienes envío gratis
                    </div>
                ` : `
                    <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 14px; color: #856404;">
                        <i class="fas fa-info-circle"></i> Envío gratis en compras superiores a $200.000
                    </div>
                `}
                
                <div class="resumen-linea resumen-total">
                    <span>Total:</span>
                    <span>$${total.toLocaleString()}</span>
                </div>
                
                <button class="btn-checkout" onclick="procederAlCheckout()">
                    <i class="fas fa-credit-card"></i> Proceder al Checkout
                </button>
                
                <div style="margin-top: 20px; text-align: center;">
                    <a href="index.html" style="color: #8B4513; text-decoration: none; font-size: 14px;">
                        <i class="fas fa-arrow-left"></i> Continuar comprando
                    </a>
                </div>
            </div>
        </div>
    `;
}

function cambiarCantidad(productId, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (nuevaCantidad < 1) {
        confirmarEliminarItem(productId);
        return;
    }
    
    carrito.actualizarCantidad(productId, nuevaCantidad);
    renderizarCarritoCompleto();
}

function confirmarEliminarItem(productId, nombreProducto = '') {
    const item = carrito.items.find(item => item.id === productId);
    if (!item) return;
    
    if (confirm(`¿Estás seguro de eliminar "${item.nombre}" del carrito?`)) {
        carrito.removerProducto(productId);
        renderizarCarritoCompleto();
        
        // Mostrar notificación
        carrito.mostrarNotificacion(`${item.nombre} eliminado del carrito`);
    }
}

function confirmarVaciarCarrito() {
    if (carrito.items.length === 0) return;
    
    if (confirm('¿Estás seguro de vaciar todo el carrito? Esta acción no se puede deshacer.')) {
        carrito.vaciarCarrito();
        renderizarCarritoCompleto();
    }
}

function procederAlCheckout() {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        if (confirm('Necesitas iniciar sesión para continuar con la compra. ¿Deseas ir a la página de login?')) {
            // Guardar la URL actual para redirigir después del login
            localStorage.setItem('redirectAfterLogin', 'checkout.html');
            window.location.href = 'cuenta.html';
        }
        return;
    }

    // Verificar que el carrito no esté vacío
    if (carrito.items.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de continuar.');
        return;
    }

    // Redirigir al checkout
    window.location.href = 'checkout.html';
}

// Función para actualizar el carrito cuando se modifica desde otras páginas
function actualizarVistaCarrito() {
    renderizarCarritoCompleto();
}

// Escuchar cambios en el localStorage para actualizar en tiempo real
window.addEventListener('storage', function(e) {
    if (e.key === 'carrito') {
        carrito.items = JSON.parse(e.newValue || '[]');
        carrito.actualizarContador();
        renderizarCarritoCompleto();
    }
});

// Override de funciones del carrito para actualizar la vista (solo si carrito existe)
function setupCarritoOverrides() {
    if (typeof carrito === 'undefined') return;
    
    try {
        const originalAgregarProducto = carrito.agregarProducto.bind(carrito);
        const originalRemoverProducto = carrito.removerProducto.bind(carrito);
        const originalVaciarCarrito = carrito.vaciarCarrito.bind(carrito);

        carrito.agregarProducto = function(producto) {
            originalAgregarProducto(producto);
            renderizarCarritoCompleto();
        };

        carrito.removerProducto = function(productId) {
            originalRemoverProducto(productId);
            renderizarCarritoCompleto();
        };

        carrito.vaciarCarrito = function() {
            originalVaciarCarrito();
            renderizarCarritoCompleto();
        };
    } catch (error) {
        console.warn('No se pudieron configurar los overrides del carrito:', error);
    }
}

// Configurar overrides cuando carrito esté disponible
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupCarritoOverrides, 200);
});

// Función temporal para agregar productos de prueba (solo para debug)
function agregarProductoPrueba() {
    const productos = [
        {
            id: 'mochila-wayuu',
            nombre: 'Mochila Wayuu',
            precio: 120000,
            imagen: 'img/Mochila wayuu.png',
            descripcion: 'Tejido a mano por artesanas de la comunidad Wayuu de La Guajira.'
        },
        {
            id: 'collar-embera',
            nombre: 'Collar Embera',
            precio: 45000,
            imagen: 'img/Collar vera.png',
            descripcion: 'Elaborado con cuentas naturales y diseños tradicionales Embera.'
        },
        {
            id: 'ceramica-ticuna',
            nombre: 'Cerámica Ticuna',
            precio: 85000,
            imagen: 'img/Ceramica.png',
            descripcion: 'Pieza de cerámica con pigmentos naturales de la Amazonía.'
        }
    ];

    // Agregar un producto aleatorio
    const producto = productos[Math.floor(Math.random() * productos.length)];
    
    // Obtener carrito actual del localStorage
    let items = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Verificar si el producto ya existe
    const itemExistente = items.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        items.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(items));
    
    // Renderizar carrito
    renderizarCarritoDesdeStorage(items);
    actualizarContadorDirecto(items);
    
    console.log('Producto agregado:', producto.nombre);
}

// Agregar botón de prueba temporalmente
setTimeout(() => {
    const contenedor = document.getElementById('carrito-contenido');
    if (contenedor && (!localStorage.getItem('carrito') || JSON.parse(localStorage.getItem('carrito')).length === 0)) {
        const btnPrueba = document.createElement('button');
        btnPrueba.innerHTML = '🛒 Agregar Producto de Prueba';
        btnPrueba.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        btnPrueba.onclick = agregarProductoPrueba;
        document.body.appendChild(btnPrueba);
    }
}, 1000);
