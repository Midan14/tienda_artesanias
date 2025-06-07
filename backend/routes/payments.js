const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const jwt = require('jsonwebtoken');

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

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.NODE_ENV === 'production' 
        ? process.env.MERCADOPAGO_ACCESS_TOKEN 
        : process.env.MERCADOPAGO_TEST_ACCESS_TOKEN,
});

// Crear preferencia de pago
router.post('/create-preference', authenticateToken, async (req, res) => {
    try {
        console.log('🔄 Creando preferencia de pago para:', req.user.email);
        
        const { items, datosEnvio, totales, pedidoId } = req.body;

        // Validar datos requeridos
        if (!items || !items.length || !datosEnvio || !totales) {
            return res.status(400).json({
                success: false,
                message: 'Datos incompletos para crear la preferencia de pago'
            });
        }

        // Preparar items para Mercado Pago
        const mpItems = items.map(item => ({
            id: item.id.toString(),
            title: item.nombre,
            description: `Artesanía: ${item.nombre}`,
            picture_url: item.imagen,
            category_id: 'art',
            quantity: parseInt(item.cantidad),
            currency_id: 'COP',
            unit_price: parseFloat(item.precio)
        }));

        // Agregar costo de envío como item si aplica
        if (totales.envio > 0) {
            mpItems.push({
                id: 'shipping',
                title: 'Costo de envío',
                description: 'Envío a domicilio',
                category_id: 'shipping',
                quantity: 1,
                currency_id: 'COP',
                unit_price: parseFloat(totales.envio)
            });
        }

        // Crear preferencia
        const preference = new Preference(client);
        
        const preferenceData = {
            items: mpItems,
            payer: {
                name: datosEnvio.nombre,
                email: datosEnvio.email,
                phone: {
                    number: datosEnvio.telefono
                },
                identification: {
                    type: 'CC',
                    number: datosEnvio.documento
                },
                address: {
                    street_name: datosEnvio.direccion,
                    city_name: datosEnvio.ciudad,
                    zip_code: datosEnvio.codigoPostal || '110111'
                }
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirmacion.html`,
                failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout.html?error=payment_failed`,
                pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout.html?status=pending`
            },
            auto_return: 'approved',
            external_reference: pedidoId || `orden_${Date.now()}`,
            notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
            statement_descriptor: 'ARTESANIAS ANCESTRALES',
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12
            }
        };

        console.log('📋 Datos de preferencia:', JSON.stringify(preferenceData, null, 2));

        const result = await preference.create({ body: preferenceData });

        console.log('✅ Preferencia creada exitosamente:', result.id);

        res.json({
            success: true,
            data: {
                preferenceId: result.id,
                initPoint: result.init_point,
                sandboxInitPoint: result.sandbox_init_point
            }
        });

    } catch (error) {
        console.error('❌ Error creando preferencia de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear la preferencia de pago',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Webhook para notificaciones de Mercado Pago
router.post('/webhook', async (req, res) => {
    try {
        console.log('🔔 Webhook recibido:', JSON.stringify(req.body, null, 2));
        
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;
            console.log('💳 Notificación de pago:', paymentId);
            
            // Aquí deberías:
            // 1. Consultar el pago en Mercado Pago para obtener el estado
            // 2. Actualizar el estado del pedido en tu base de datos
            // 3. Enviar confirmación por email si es necesario
            
            // Por ahora solo logueamos
            console.log('📝 Procesando pago:', paymentId);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Error procesando webhook:', error);
        res.status(500).send('Error');
    }
});

// Obtener estado de un pago
router.get('/payment-status/:paymentId', authenticateToken, async (req, res) => {
    try {
        const { paymentId } = req.params;
        console.log('🔍 Consultando estado del pago:', paymentId);

        // Aquí consultarías el API de Mercado Pago para obtener el estado actual
        // const payment = await mercadopago.payment.findById(paymentId);

        res.json({
            success: true,
            message: 'Función de consulta de estado en desarrollo'
        });

    } catch (error) {
        console.error('❌ Error consultando estado del pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error consultando el estado del pago'
        });
    }
});

module.exports = router;
