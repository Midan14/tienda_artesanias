// JavaScript para el checkout
document.addEventListener('DOMContentLoaded', function() {
    verificarAcceso();
    cargarDatosUsuario();
    renderizarResumenPedido();
    configurarValidaciones();
});

function verificarAcceso() {
    // Verificar si hay productos en el carrito
    if (carrito.items.length === 0) {
        alert('Tu carrito está vacío. Serás redirigido a la tienda.');
        window.location.href = 'index.html';
        return;
    }

    // Verificar si el usuario está logueado
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debes iniciar sesión para continuar con la compra.');
        localStorage.setItem('redirectAfterLogin', 'checkout.html');
        window.location.href = 'cuenta.html';
        return;
    }
}

async function cargarDatosUsuario() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            const usuario = data.data.user;
            
            // Pre-llenar campos con datos del usuario
            document.getElementById('nombre').value = usuario.nombre || '';
            document.getElementById('email').value = usuario.email || '';
            
            // Si el usuario ya tiene datos adicionales guardados, cargarlos
            if (usuario.telefono) document.getElementById('telefono').value = usuario.telefono;
            if (usuario.documento) document.getElementById('documento').value = usuario.documento;
            if (usuario.direccion) document.getElementById('direccion').value = usuario.direccion;
            if (usuario.ciudad) document.getElementById('ciudad').value = usuario.ciudad;
        }
    } catch (error) {
        console.error('Error cargando datos del usuario:', error);
    }
}

function renderizarResumenPedido() {
    const orderItems = document.getElementById('order-items');
    const orderTotals = document.getElementById('order-totals');

    if (!orderItems || !orderTotals) return;

    // Renderizar items del pedido
    orderItems.innerHTML = carrito.items.map(item => `
        <div class="order-summary-item">
            <div class="item-details">
                <img src="${item.imagen}" alt="${item.nombre}" class="item-image">
                <div>
                    <h4 style="margin: 0; font-size: 14px;">${item.nombre}</h4>
                    <p style="margin: 0; font-size: 12px; color: #666;">Cantidad: ${item.cantidad}</p>
                </div>
            </div>
            <div style="font-weight: bold;">
                $${(item.precio * item.cantidad).toLocaleString()}
            </div>
        </div>
    `).join('');

    // Calcular totales
    const subtotal = carrito.calcularTotal();
    const envio = subtotal > 200000 ? 0 : 15000;
    const total = subtotal + envio;

    // Renderizar totales
    orderTotals.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span>Subtotal (${carrito.obtenerCantidadTotal()} items):</span>
            <span>$${subtotal.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span>Envío:</span>
            <span>${envio === 0 ? 'GRATIS' : '$' + envio.toLocaleString()}</span>
        </div>
        ${envio === 0 ? `
            <div style="background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 12px; color: #155724;">
                <i class="fas fa-check-circle"></i> ¡Envío gratuito!
            </div>
        ` : ''}
        <div class="summary-total" style="display: flex; justify-content: space-between;">
            <span>Total:</span>
            <span>$${total.toLocaleString()}</span>
        </div>
    `;
}

function selectPaymentMethod(method) {
    // Remover selección previa
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.card-info').forEach(info => {
        info.classList.remove('active');
    });

    // Seleccionar nuevo método
    const selectedOption = document.querySelector(`input[value="${method}"]`).closest('.payment-option');
    selectedOption.classList.add('selected');
    
    // Marcar radio button
    document.getElementById(`pago-${method}`).checked = true;

    // Mostrar campos de tarjeta si es necesario
    if (method === 'tarjeta') {
        document.getElementById('card-info').classList.add('active');
    }
}

function configurarValidaciones() {
    // Validación de número de tarjeta
    const numeroTarjeta = document.getElementById('numero_tarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let valorFormateado = valor.match(/.{1,4}/g)?.join(' ') || valor;
            e.target.value = valorFormateado;
        });
    }

    // Validación de fecha de expiración
    const fechaExpiracion = document.getElementById('fecha_expiracion');
    if (fechaExpiracion) {
        fechaExpiracion.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length >= 2) {
                valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
            }
            e.target.value = valor;
        });
    }

    // Validación de CVV
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Validación de documento
    const documento = document.getElementById('documento');
    if (documento) {
        documento.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Validación de teléfono
    const telefono = document.getElementById('telefono');
    if (telefono) {
        telefono.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9+\-\s]/g, '');
        });
    }
}

function validarFormulario() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const errors = [];

    // Validaciones básicas
    const camposRequeridos = ['nombre', 'documento', 'telefono', 'email', 'direccion', 'ciudad'];
    camposRequeridos.forEach(campo => {
        if (!formData.get(campo) || formData.get(campo).trim() === '') {
            errors.push(`El campo ${campo} es requerido`);
        }
    });

    // Validar método de pago
    const metodoPago = formData.get('metodo_pago');
    if (!metodoPago) {
        errors.push('Debes seleccionar un método de pago');
    }

    // Validaciones específicas para tarjeta
    if (metodoPago === 'tarjeta') {
        const camposTarjeta = ['numero_tarjeta', 'nombre_tarjeta', 'fecha_expiracion', 'cvv'];
        camposTarjeta.forEach(campo => {
            if (!formData.get(campo) || formData.get(campo).trim() === '') {
                errors.push(`El campo ${campo.replace('_', ' ')} es requerido para pago con tarjeta`);
            }
        });

        // Validar formato de tarjeta
        const numeroTarjeta = formData.get('numero_tarjeta').replace(/\s/g, '');
        if (numeroTarjeta.length < 13 || numeroTarjeta.length > 19) {
            errors.push('El número de tarjeta no es válido');
        }

        // Validar CVV
        const cvv = formData.get('cvv');
        if (cvv.length < 3 || cvv.length > 4) {
            errors.push('El CVV debe tener 3 o 4 dígitos');
        }
    }

    // Validar email
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('El email no tiene un formato válido');
    }

    return errors;
}

async function realizarPedido() {
    try {
        const button = document.querySelector('.btn-place-order');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        // Validar formulario
        const errors = validarFormulario();
        if (errors.length > 0) {
            alert('Por favor corrige los siguientes errores:\n\n' + errors.join('\n'));
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-check"></i> Realizar Pedido';
            return;
        }

        // Recopilar datos del formulario
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        const token = localStorage.getItem('authToken');
        const metodoPago = formData.get('metodo_pago');

        // Calcular totales
        const subtotal = carrito.calcularTotal();
        const envio = subtotal > 200000 ? 0 : 15000;
        const total = subtotal + envio;

        // Preparar datos del pedido
        const pedidoData = {
            items: carrito.items,
            datosEnvio: {
                nombre: formData.get('nombre'),
                documento: formData.get('documento'),
                telefono: formData.get('telefono'),
                email: formData.get('email'),
                direccion: formData.get('direccion'),
                ciudad: formData.get('ciudad'),
                codigoPostal: formData.get('codigo_postal'),
                notas: formData.get('notas')
            },
            metodoPago: metodoPago,
            totales: {
                subtotal: subtotal,
                envio: envio,
                total: total
            }
        };

        // Si es pago con tarjeta, redirigir a Mercado Pago
        if (metodoPago === 'tarjeta') {
            await procesarPagoMercadoPago(pedidoData, token);
            return;
        }

        // Si es pago con tarjeta (método anterior), incluir datos de la tarjeta
        if (pedidoData.metodoPago === 'tarjeta_manual') {
            pedidoData.datosTarjeta = {
                numero: formData.get('numero_tarjeta'),
                nombre: formData.get('nombre_tarjeta'),
                expiracion: formData.get('fecha_expiracion'),
                cvv: formData.get('cvv')
            };
        }

        // Enviar pedido al servidor (para otros métodos de pago)
        const response = await fetch('http://localhost:5000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedidoData)
        });

        const result = await response.json();

        if (result.success) {
            // Limpiar carrito
            carrito.vaciarCarrito();
            
            // Redirigir a página de confirmación
            localStorage.setItem('ultimoPedido', JSON.stringify(result.data));
            window.location.href = 'confirmacion.html';
        } else {
            throw new Error(result.message || 'Error al procesar el pedido');
        }

    } catch (error) {
        console.error('Error realizando pedido:', error);
        alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
        
        const button = document.querySelector('.btn-place-order');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i> Realizar Pedido';
    }
}

// Nueva función para procesar pagos con Mercado Pago
async function procesarPagoMercadoPago(pedidoData, token) {
    try {
        // Crear preferencia de pago en Mercado Pago
        const response = await fetch('http://localhost:5000/api/payments/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedidoData)
        });

        const result = await response.json();

        if (result.success) {
            // Guardar datos del pedido temporalmente
            localStorage.setItem('pedidoPendiente', JSON.stringify(pedidoData));
            
            // Redirigir a Mercado Pago
            const initPoint = result.data.sandboxInitPoint || result.data.initPoint;
            window.location.href = initPoint;
        } else {
            throw new Error(result.message || 'Error creando preferencia de pago');
        }

    } catch (error) {
        console.error('Error con Mercado Pago:', error);
        alert('Error al conectar con la pasarela de pago. Por favor intenta nuevamente.');
        throw error;
    }
}

// Función para volver al carrito
function volverAlCarrito() {
    window.location.href = 'carrito.html';
}
