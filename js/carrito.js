// Sistema de Carrito de Compras
class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarContador();
        this.renderizarCarrito();
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.actualizarContador();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
        this.renderizarCarrito();
    }

    // Remover producto del carrito
    removerProducto(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.guardarCarrito();
        this.actualizarContador();
        this.renderizarCarrito();
    }

    // Actualizar cantidad de producto
    actualizarCantidad(productId, nuevaCantidad) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.cantidad = Math.max(1, nuevaCantidad);
            this.guardarCarrito();
            this.actualizarContador();
            this.renderizarCarrito();
        }
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.items = [];
        this.guardarCarrito();
        this.actualizarContador();
        this.renderizarCarrito();
        this.mostrarNotificacion('Carrito vaciado');
    }

    // Calcular total del carrito
    calcularTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Obtener cantidad total de items
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    // Actualizar contador del carrito en la UI
    actualizarContador() {
        const contador = document.getElementById('cart-counter');
        if (contador) {
            const total = this.obtenerCantidadTotal();
            contador.textContent = total;
            contador.style.display = total > 0 ? 'inline' : 'none';
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'carrito-notificacion';
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notificacion);

        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }

    // Renderizar carrito en preview
    renderizarCarrito() {
        const cartPreview = document.querySelector('.cart-preview');
        
        if (!cartPreview) return;

        // Limpiar contenido actual
        cartPreview.innerHTML = '';

        // Título del carrito
        const titulo = document.createElement('h3');
        titulo.textContent = 'Tu Carrito';
        cartPreview.appendChild(titulo);

        if (this.items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cart-preview-empty';
            empty.innerHTML = '<p>Tu carrito está vacío</p>';
            cartPreview.appendChild(empty);
            return;
        }

        // Items del carrito
        this.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-preview-item';
            
            itemDiv.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" width="50" height="50">
                <div class="item-info">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-price">$${item.precio.toLocaleString()}</div>
                    <div class="item-quantity">Cantidad: ${item.cantidad}</div>
                </div>
                <button onclick="carrito.removerProducto('${item.id}')" class="btn-remove">×</button>
            `;
            
            cartPreview.appendChild(itemDiv);
        });

        // Total del carrito
        const totalDiv = document.createElement('div');
        totalDiv.className = 'cart-preview-total';
        const totalAmount = this.calcularTotal();
        totalDiv.innerHTML = `<strong>Total: $${totalAmount.toLocaleString()}</strong>`;
        cartPreview.appendChild(totalDiv);

        // Mostrar información adicional si hay más de 3 items
        if (this.items.length > 3) {
            const moreInfo = document.createElement('div');
            moreInfo.style.cssText = 'color: #666; font-size: 0.9em; text-align: center; margin: 5px 0;';
            const hiddenItems = this.items.length - 3;
            moreInfo.textContent = `Y ${hiddenItems} artículo${hiddenItems > 1 ? 's' : ''} más...`;
            totalDiv.before(moreInfo);
        }

        // Botones de acción
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'cart-preview-buttons';
        buttonsDiv.innerHTML = `
            <a href="carrito.html" class="btn btn-ver-carrito">Ver Carrito</a>
            <button onclick="carrito.vaciarCarrito()" class="btn btn-vaciar-mini">Vaciar</button>
        `;
        
        cartPreview.appendChild(buttonsDiv);
    }
}

// Productos disponibles
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

// Inicializar carrito
const carrito = new Carrito();

// Función para mostrar/ocultar preview del carrito
function mostrarPreviewCarrito() {
    const preview = document.getElementById('cart-preview');
    if (preview) {
        const isVisible = preview.style.display === 'block';
        preview.style.display = isVisible ? 'none' : 'block';
        
        // Si se está mostrando, actualizar el contenido
        if (!isVisible) {
            carrito.renderizarCarrito();
        }
    }
}

// Cerrar preview al hacer clic fuera
document.addEventListener('click', function(e) {
    const preview = document.getElementById('cart-preview');
    const cartIcon = document.querySelector('.icon-link[aria-label="Carrito de compras"]');
    
    if (preview && !preview.contains(e.target) && !cartIcon.contains(e.target)) {
        preview.style.display = 'none';
    }
});

// Función para vaciar carrito (accesible globalmente)
function vaciarCarrito() {
    carrito.vaciarCarrito();
}

// Event listeners optimizados para botones
document.addEventListener('DOMContentLoaded', function() {
    // Usar delegación de eventos para mejor rendimiento
    const body = document.body;
    
    // Delegar eventos para botones de agregar al carrito
    if (window.eventUtils) {
        window.eventUtils.delegate(body, '.btn-add', 'click', function(e) {
            e.preventDefault();
            
            // Cambiar texto del botón si es necesario
            if (this.textContent === 'Ver Detalle') {
                this.textContent = 'Agregar al Carrito';
            }
            
            // Encontrar producto por índice o ID
            const index = Array.from(document.querySelectorAll('.btn-add')).indexOf(this);
            if (productos && productos[index]) {
                carrito.agregarProducto(productos[index]);
            }
        });
    } else {
        // Fallback para compatibilidad
        body.addEventListener('click', function(e) {
            if (e.target.matches('.btn-add')) {
                e.preventDefault();
                
                if (e.target.textContent === 'Ver Detalle') {
                    e.target.textContent = 'Agregar al Carrito';
                }
                
                const index = Array.from(document.querySelectorAll('.btn-add')).indexOf(e.target);
                if (productos && productos[index]) {
                    carrito.agregarProducto(productos[index]);
                }
            }
        });
    }
});

// Estilos CSS para las notificaciones (se inyectan dinámicamente)
if (!document.querySelector('#carrito-styles')) {
    const styles = document.createElement('style');
    styles.id = 'carrito-styles';
    styles.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .cart-preview {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            padding: 15px;
        }
        
        .cart-preview h3 {
            margin: 0 0 15px 0;
            color: #8B4513;
            border-bottom: 2px solid #D2691E;
            padding-bottom: 5px;
        }
        
        .cart-preview-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-preview-item:last-child {
            border-bottom: none;
        }
        
        .cart-preview-item img {
            border-radius: 4px;
            object-fit: cover;
        }
        
        .cart-preview-item .item-info {
            flex: 1;
        }
        
        .cart-preview-item h4 {
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #333;
        }
        
        .cart-preview-item p {
            margin: 0;
            font-size: 12px;
            color: #666;
        }
        
        .btn-remove {
            background: #dc3545;
            color: white;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
        }
        
        .btn-remove:hover {
            background: #c82333;
        }
        
        .cart-preview-total {
            margin: 15px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            color: #8B4513;
        }
        
        .cart-preview-buttons {
            display: flex;
            gap: 10px;
        }
        
        .btn-ver-carrito, .btn-vaciar-mini {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            text-decoration: none;
            text-align: center;
        }
        
        .btn-ver-carrito {
            background: #8B4513;
            color: white;
        }
        
        .btn-ver-carrito:hover {
            background: #6D2E0A;
        }
        
        .btn-vaciar-mini {
            background: #6c757d;
            color: white;
        }
        
        .btn-vaciar-mini:hover {
            background: #545b62;
        }
        
        .badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #dc3545;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            min-width: 18px;
            text-align: center;
            line-height: 1.2;
        }
    `;
    document.head.appendChild(styles);
}
