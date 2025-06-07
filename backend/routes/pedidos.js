const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'artesanias_db';

// Middleware de autenticación
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// Crear nuevo pedido
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log('📦 Nueva solicitud de pedido recibida');
        console.log('👤 Usuario:', req.user.email);
        console.log('📋 Datos del pedido:', JSON.stringify(req.body, null, 2));

        await client.connect();
        const db = client.db(dbName);
        const pedidosCollection = db.collection('pedidos');

        const {
            items,
            datosEnvio,
            metodoPago,
            totales,
            datosTarjeta
        } = req.body;

        // Validaciones básicas
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El pedido debe contener al menos un producto'
            });
        }

        if (!datosEnvio || !datosEnvio.nombre || !datosEnvio.documento || !datosEnvio.telefono || !datosEnvio.email || !datosEnvio.direccion || !datosEnvio.ciudad) {
            return res.status(400).json({
                success: false,
                message: 'Todos los datos de envío son requeridos'
            });
        }

        if (!metodoPago) {
            return res.status(400).json({
                success: false,
                message: 'Método de pago es requerido'
            });
        }

        // Generar número de pedido único
        const numeroPedido = 'AP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

        // Crear pedido
        const nuevoPedido = {
            numeroPedido,
            usuario: {
                id: new ObjectId(req.user.userId),
                email: req.user.email,
                nombre: req.user.nombre
            },
            items: items.map(item => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                imagen: item.imagen,
                subtotal: item.precio * item.cantidad
            })),
            datosEnvio: {
                nombre: datosEnvio.nombre,
                documento: datosEnvio.documento,
                telefono: datosEnvio.telefono,
                email: datosEnvio.email,
                direccion: datosEnvio.direccion,
                ciudad: datosEnvio.ciudad,
                codigoPostal: datosEnvio.codigoPostal || '',
                notas: datosEnvio.notas || ''
            },
            metodoPago: metodoPago,
            totales: {
                subtotal: totales.subtotal,
                envio: totales.envio,
                total: totales.total
            },
            estado: 'pendiente', // pendiente, confirmado, enviado, entregado, cancelado
            estadoPago: metodoPago === 'contraentrega' ? 'pendiente' : 'procesando', // pendiente, procesando, aprobado, rechazado
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        };

        // Si es pago con tarjeta, agregar información (en producción esto debe estar encriptado)
        if (metodoPago === 'tarjeta' && datosTarjeta) {
            nuevoPedido.datosPago = {
                tipo: 'tarjeta',
                ultimosCuatroDigitos: datosTarjeta.numero.slice(-4),
                nombreTarjeta: datosTarjeta.nombre,
                // En producción, nunca guardar el número completo, CVV o fecha de expiración
                // Aquí solo para propósitos de demostración
                numeroEncriptado: '****-****-****-' + datosTarjeta.numero.slice(-4)
            };
        } else if (metodoPago === 'pse') {
            nuevoPedido.datosPago = {
                tipo: 'pse',
                estado: 'pendiente_redireccion'
            };
        } else if (metodoPago === 'transferencia') {
            nuevoPedido.datosPago = {
                tipo: 'transferencia',
                estado: 'pendiente_transferencia',
                datosBancarios: {
                    banco: 'Banco Ejemplo',
                    tipoCuenta: 'Ahorros',
                    numeroCuenta: '1234567890',
                    titular: 'Artesanías Ancestrales SAS',
                    nit: '123456789-0'
                }
            };
        } else if (metodoPago === 'contraentrega') {
            nuevoPedido.datosPago = {
                tipo: 'contraentrega',
                estado: 'pendiente_entrega'
            };
        }

        // Insertar pedido en la base de datos
        const resultado = await pedidosCollection.insertOne(nuevoPedido);

        console.log('✅ Pedido creado exitosamente:', numeroPedido);
        console.log('🔑 ID del pedido:', resultado.insertedId);

        // Actualizar datos del usuario si es necesario
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
            { _id: new ObjectId(req.user.userId) },
            {
                $set: {
                    telefono: datosEnvio.telefono,
                    documento: datosEnvio.documento,
                    direccion: datosEnvio.direccion,
                    ciudad: datosEnvio.ciudad,
                    fechaActualizacion: new Date()
                }
            }
        );

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: {
                pedidoId: resultado.insertedId,
                numeroPedido: numeroPedido,
                estado: nuevoPedido.estado,
                estadoPago: nuevoPedido.estadoPago,
                total: totales.total,
                fechaCreacion: nuevoPedido.fechaCreacion,
                metodoPago: metodoPago
            }
        });

    } catch (error) {
        console.error('❌ Error creando pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear el pedido'
        });
    } finally {
        await client.close();
    }
});

// Obtener pedidos del usuario
router.get('/mis-pedidos', authenticateToken, async (req, res) => {
    try {
        console.log('📦 Obteniendo pedidos del usuario:', req.user.email);

        await client.connect();
        const db = client.db(dbName);
        const pedidosCollection = db.collection('pedidos');

        const pedidos = await pedidosCollection.find(
            { 'usuario.id': new ObjectId(req.user.userId) }
        ).sort({ fechaCreacion: -1 }).toArray();

        console.log(`📋 ${pedidos.length} pedidos encontrados`);

        res.json({
            success: true,
            data: pedidos.map(pedido => ({
                id: pedido._id,
                numeroPedido: pedido.numeroPedido,
                estado: pedido.estado,
                estadoPago: pedido.estadoPago,
                total: pedido.totales.total,
                fechaCreacion: pedido.fechaCreacion,
                metodoPago: pedido.metodoPago,
                cantidadItems: pedido.items.reduce((total, item) => total + item.cantidad, 0)
            }))
        });

    } catch (error) {
        console.error('❌ Error obteniendo pedidos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    } finally {
        await client.close();
    }
});

// Obtener detalle de un pedido específico
router.get('/:pedidoId', authenticateToken, async (req, res) => {
    try {
        const { pedidoId } = req.params;
        console.log('📦 Obteniendo detalle del pedido:', pedidoId);

        await client.connect();
        const db = client.db(dbName);
        const pedidosCollection = db.collection('pedidos');

        const pedido = await pedidosCollection.findOne({
            _id: new ObjectId(pedidoId),
            'usuario.id': new ObjectId(req.user.userId)
        });

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        console.log('✅ Pedido encontrado:', pedido.numeroPedido);

        res.json({
            success: true,
            data: pedido
        });

    } catch (error) {
        console.error('❌ Error obteniendo detalle del pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    } finally {
        await client.close();
    }
});

// Obtener todos los pedidos (solo para admin)
router.get('/', authenticateToken, async (req, res) => {
    try {
        console.log('📦 Obteniendo todos los pedidos (admin)');
        console.log('👤 Usuario solicitante:', req.user.email, 'Rol:', req.user.role);

        // Verificar que sea admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores pueden ver todos los pedidos.'
            });
        }

        await client.connect();
        const db = client.db(dbName);
        const pedidosCollection = db.collection('pedidos');

        const pedidos = await pedidosCollection.find({}).sort({ fechaCreacion: -1 }).toArray();

        console.log(`📋 ${pedidos.length} pedidos encontrados`);

        res.json({
            success: true,
            data: pedidos
        });

    } catch (error) {
        console.error('❌ Error obteniendo pedidos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    } finally {
        await client.close();
    }
});

// Actualizar estado de pedido (solo para admin)
router.put('/:pedidoId/estado', authenticateToken, async (req, res) => {
    try {
        const { pedidoId } = req.params;
        const { estado, estadoPago } = req.body;

        console.log('📦 Actualizando estado del pedido:', pedidoId);
        console.log('👤 Usuario:', req.user.email, 'Rol:', req.user.role);

        // Verificar que sea admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores pueden actualizar pedidos.'
            });
        }

        await client.connect();
        const db = client.db(dbName);
        const pedidosCollection = db.collection('pedidos');

        const updateData = {
            fechaActualizacion: new Date()
        };

        if (estado) updateData.estado = estado;
        if (estadoPago) updateData.estadoPago = estadoPago;

        const resultado = await pedidosCollection.updateOne(
            { _id: new ObjectId(pedidoId) },
            { $set: updateData }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        console.log('✅ Estado del pedido actualizado');

        res.json({
            success: true,
            message: 'Estado del pedido actualizado exitosamente'
        });

    } catch (error) {
        console.error('❌ Error actualizando pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    } finally {
        await client.close();
    }
});

module.exports = router;
