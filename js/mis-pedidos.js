// JavaScript para gestionar los pedidos del usuario
document.addEventListener('DOMContentLoaded', function() {
    // Cargar pedidos cuando se carga la página
    if (document.getElementById('orders')) {
        cargarMisPedidos();
    }
});

async function cargarMisPedidos() {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('No hay token de autenticación');
            return;
        }

        console.log('🔄 Cargando pedidos del usuario...');
        
        const response = await fetch('http://localhost:5000/api/pedidos/mis-pedidos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('📦 Respuesta de pedidos:', data);

        if (data.success) {
            mostrarPedidos(data.data);
        } else {
            console.error('Error obteniendo pedidos:', data.message);
            mostrarErrorPedidos(data.message);
        }

    } catch (error) {
        console.error('Error cargando pedidos:', error);
        mostrarErrorPedidos('Error de conexión');
    }
}

function mostrarPedidos(pedidos) {
    const container = document.getElementById('orders');
    
    if (!container) return;

    // Limpiar contenido anterior
    container.innerHTML = '<h2>Mis Pedidos</h2>';

    if (pedidos.length === 0) {
        container.innerHTML += `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 20px; color: #ddd;"></i>
                <h3>No tienes pedidos aún</h3>
                <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                <a href="productos.html" class="btn">Explorar Productos</a>
            </div>
        `;
        return;
    }

    // Mostrar cada pedido
    pedidos.forEach(pedido => {
        const pedidoCard = crearTarjetaPedido(pedido);
        container.appendChild(pedidoCard);
    });
}

function crearTarjetaPedido(pedido) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const fechaFormateada = new Date(pedido.fechaCreacion).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const estadoClass = obtenerClaseEstado(pedido.estado);
    const estadoTexto = obtenerTextoEstado(pedido.estado);
    const metodoPagoTexto = obtenerTextoMetodoPago(pedido.metodoPago);

    card.innerHTML = `
        <div class="order-header">
            <div>
                <strong>📦 Pedido ${pedido.numeroPedido}</strong>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                    📅 ${fechaFormateada} • 💳 ${metodoPagoTexto}
                </p>
            </div>
            <div style="text-align: right;">
                <span class="order-status ${estadoClass}">${estadoTexto}</span>
                <p style="margin: 5px 0 0 0; font-weight: bold; color: #D2691E;">
                    $${pedido.total.toLocaleString()}
                </p>
            </div>
        </div>
        
        <div class="order-summary">
            <p style="margin: 10px 0; color: #666; font-size: 14px;">
                <i class="fas fa-box"></i> ${pedido.cantidadItems} producto${pedido.cantidadItems > 1 ? 's' : ''}
            </p>
            
            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn-small" onclick="verDetallePedido('${pedido.id}')" 
                        style="padding: 8px 16px; font-size: 14px; background: #f8f9fa; color: #333; border: 1px solid #ddd;">
                    <i class="fas fa-eye"></i> Ver Detalle
                </button>
                
                ${pedido.estado === 'pendiente' ? `
                    <button class="btn-small" onclick="cancelarPedido('${pedido.id}')" 
                            style="padding: 8px 16px; font-size: 14px; background: #dc3545; color: white; border: none;">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                ` : ''}
                
                ${pedido.estado === 'entregado' ? `
                    <button class="btn-small" onclick="reordenar('${pedido.id}')" 
                            style="padding: 8px 16px; font-size: 14px; background: #28a745; color: white; border: none;">
                        <i class="fas fa-redo"></i> Volver a Comprar
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}

function obtenerClaseEstado(estado) {
    const clases = {
        'pendiente': 'status-pending',
        'confirmado': 'status-processing',
        'enviado': 'status-shipped',
        'entregado': 'status-completed',
        'cancelado': 'status-cancelled'
    };
    return clases[estado] || 'status-pending';
}

function obtenerTextoEstado(estado) {
    const textos = {
        'pendiente': 'Pendiente',
        'confirmado': 'Confirmado',
        'enviado': 'Enviado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return textos[estado] || estado;
}

function obtenerTextoMetodoPago(metodo) {
    const textos = {
        'tarjeta': 'Tarjeta',
        'pse': 'PSE',
        'transferencia': 'Transferencia',
        'contraentrega': 'Contra Entrega'
    };
    return textos[metodo] || metodo;
}

function mostrarErrorPedidos(mensaje) {
    const container = document.getElementById('orders');
    if (!container) return;

    container.innerHTML = `
        <h2>Mis Pedidos</h2>
        <div style="text-align: center; padding: 40px; color: #dc3545;">
            <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
            <h3>Error cargando pedidos</h3>
            <p>${mensaje}</p>
            <button class="btn" onclick="cargarMisPedidos()">Reintentar</button>
        </div>
    `;
}

async function verDetallePedido(pedidoId) {
    try {
        const token = localStorage.getItem('authToken');
        
        console.log('🔍 Obteniendo detalle del pedido:', pedidoId);
        
        const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            mostrarModalDetallePedido(data.data);
        } else {
            alert('Error obteniendo detalle del pedido: ' + data.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al obtener detalle del pedido');
    }
}

function mostrarModalDetallePedido(pedido) {
    // Crear modal con detalles completos del pedido
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 30px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;

    const fechaFormateada = new Date(pedido.fechaCreacion).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    modalContent.innerHTML = `
        <button onclick="this.closest('.modal').remove()" 
                style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">
            ×
        </button>
        
        <h2 style="margin-bottom: 20px; color: #8B4513;">
            📦 Detalle del Pedido
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                <div><strong>Número:</strong> ${pedido.numeroPedido}</div>
                <div><strong>Estado:</strong> <span class="order-status ${obtenerClaseEstado(pedido.estado)}">${obtenerTextoEstado(pedido.estado)}</span></div>
                <div><strong>Fecha:</strong> ${fechaFormateada}</div>
                <div><strong>Método de Pago:</strong> ${obtenerTextoMetodoPago(pedido.metodoPago)}</div>
            </div>
        </div>
        
        <h3 style="margin-bottom: 15px;">📋 Productos</h3>
        <div style="margin-bottom: 20px;">
            ${pedido.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <div>
                        <strong>${item.nombre}</strong><br>
                        <small>Cantidad: ${item.cantidad} × $${item.precio.toLocaleString()}</small>
                    </div>
                    <div style="font-weight: bold; color: #D2691E;">
                        $${item.subtotal.toLocaleString()}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <h3 style="margin-bottom: 15px;">📍 Información de Envío</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
            <div><strong>${pedido.datosEnvio.nombre}</strong></div>
            <div>${pedido.datosEnvio.direccion}</div>
            <div>${pedido.datosEnvio.ciudad}</div>
            <div>📞 ${pedido.datosEnvio.telefono}</div>
            <div>📧 ${pedido.datosEnvio.email}</div>
            ${pedido.datosEnvio.notas ? `<div style="margin-top: 10px;"><strong>Notas:</strong> ${pedido.datosEnvio.notas}</div>` : ''}
        </div>
        
        <h3 style="margin-bottom: 15px;">💰 Resumen de Pago</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${pedido.totales.subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Envío:</span>
                <span>${pedido.totales.envio === 0 ? 'GRATIS' : '$' + pedido.totales.envio.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #D2691E; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                <span>Total:</span>
                <span>$${pedido.totales.total.toLocaleString()}</span>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="this.closest('.modal').remove()" class="btn">Cerrar</button>
        </div>
    `;

    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function cancelarPedido(pedidoId) {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ estado: 'cancelado' })
        });

        const data = await response.json();

        if (data.success) {
            alert('Pedido cancelado exitosamente');
            cargarMisPedidos(); // Recargar la lista
        } else {
            alert('Error cancelando pedido: ' + data.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al cancelar pedido');
    }
}

function reordenar(pedidoId) {
    if (confirm('¿Deseas agregar estos productos nuevamente al carrito?')) {
        // Esta funcionalidad requeriría obtener los productos del pedido
        // y agregarlos al carrito actual
        alert('Funcionalidad de reordenar en desarrollo');
    }
}

// Agregar estilos para los estados de pedidos
const styles = `
    .status-pending {
        background-color: #fff3cd;
        color: #856404;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-processing {
        background-color: #cce5ff;
        color: #004085;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-shipped {
        background-color: #d1ecf1;
        color: #0c5460;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-completed {
        background-color: #d4edda;
        color: #155724;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-cancelled {
        background-color: #f8d7da;
        color: #721c24;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .btn-small {
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    
    .btn-small:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
`;

// Agregar estilos al documento
if (!document.getElementById('mis-pedidos-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mis-pedidos-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
