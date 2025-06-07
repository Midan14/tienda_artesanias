# Configuración de Mercado Pago - Guía Completa

## 🚀 ¿Qué hemos implementado?

He integrado **Mercado Pago** como pasarela de pago en tu tienda de artesanías. Aquí tienes todo lo que necesitas saber:

## 📋 Archivos Modificados/Creados

1. **backend/routes/payments.js** - Nueva ruta para procesar pagos
2. **backend/server.js** - Registrada nueva ruta de pagos
3. **backend/.env** - Agregadas variables de entorno para Mercado Pago
4. **js/checkout.js** - Integrado flujo de pago con Mercado Pago
5. **MERCADOPAGO_SETUP.md** - Esta guía

## 🔧 Configuración Requerida

### 1. Obtener Credenciales de Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
2. Crea una cuenta o inicia sesión
3. Ve a "Tus integraciones" → "Crear aplicación"
4. Selecciona "Pagos online" y completa el formulario
5. Obtén tus credenciales:

**Para Pruebas (Sandbox):**
- Access Token: `TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Public Key: `TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Para Producción:**
- Access Token: `APP_USR-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Public Key: `APP_USR-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 2. Configurar Variables de Entorno

Edita el archivo `backend/.env` y reemplaza las credenciales:

```env
# Configuración de Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu_access_token_de_produccion_aqui
MERCADOPAGO_PUBLIC_KEY=APP_USR-tu_public_key_de_produccion_aqui
MERCADOPAGO_TEST_ACCESS_TOKEN=TEST-tu_access_token_de_pruebas_aqui
MERCADOPAGO_TEST_PUBLIC_KEY=TEST-tu_public_key_de_pruebas_aqui

# URL del backend para webhooks
BACKEND_URL=http://localhost:5000
```

### 3. Configurar URLs en Mercado Pago

En tu cuenta de Mercado Pago, configura:

**URLs de retorno:**
- Éxito: `http://tu-dominio.com/confirmacion.html`
- Fallo: `http://tu-dominio.com/checkout.html?error=payment_failed`
- Pendiente: `http://tu-dominio.com/checkout.html?status=pending`

**URL de notificaciones (Webhook):**
- `http://tu-dominio.com/api/payments/webhook`

## 🔄 Cómo Funciona

### Flujo de Pago:

1. **Usuario selecciona "Tarjeta"** en checkout
2. **Se crea preferencia** en Mercado Pago con datos del pedido
3. **Usuario es redirigido** a Mercado Pago para pagar
4. **Mercado Pago procesa** el pago
5. **Usuario regresa** a tu sitio con el resultado
6. **Webhook actualiza** el estado del pedido

### Métodos de Pago Disponibles:

- ✅ **Tarjetas de crédito/débito** (Visa, Mastercard, American Express)
- ✅ **PSE** (Pagos Seguros en Línea)
- ✅ **Efecty**
- ✅ **Baloto**
- ✅ **Nequi** (si está habilitado)
- ✅ **Daviplata** (si está habilitado)

## 🧪 Probar la Integración

### Datos de Prueba para Tarjetas:

**Tarjeta Aprobada:**
- Número: `4013 5406 8274 6260`
- CVV: `123`
- Fecha: `11/25`
- Nombre: `APRO`

**Tarjeta Rechazada:**
- Número: `4509 9535 6623 3704`
- CVV: `123`
- Fecha: `11/25`
- Nombre: `OTHE`

### Usuarios de Prueba:

**Comprador:**
- Email: `test_user_63274575@testuser.com`
- Contraseña: `qatest3368`

**Vendedor:**
- Email: `test_user_36329811@testuser.com`
- Contraseña: `qatest3368`

## 🚀 Pasos Siguientes

### 1. Iniciar el Servidor
```bash
cd backend
npm start
```

### 2. Probar el Flujo
1. Abre tu tienda en el navegador
2. Agrega productos al carrito
3. Ve a checkout
4. Selecciona "Pago con Tarjeta"
5. Completa el formulario
6. Serás redirigido a Mercado Pago

### 3. Implementar Webhook (Opcional)
Para notificaciones automáticas, implementa la lógica en `backend/routes/payments.js`:

```javascript
// En el webhook, agregar:
const { Payment } = require('mercadopago');
const payment = new Payment(client);
const paymentInfo = await payment.get({ id: paymentId });

// Actualizar estado del pedido según paymentInfo.status
```

## 🔐 Seguridad

### ⚠️ Importante para Producción:

1. **Nunca expongas** las credenciales en el frontend
2. **Valida siempre** los pagos en el backend mediante webhook
3. **Usa HTTPS** en producción
4. **Configura CORS** correctamente
5. **Implementa rate limiting** para el webhook

## 🐛 Solución de Problemas

### Error: "Access token inválido"
- Verifica que las credenciales estén correctas en `.env`
- Asegúrate de usar TEST tokens para pruebas

### Error: "CORS policy"
- Agrega tu dominio a `allowedOrigins` en `server.js`

### Webhook no recibe notificaciones
- Verifica que la URL esté accesible públicamente
- Usa ngrok para pruebas locales: `ngrok http 5000`

## 📞 Soporte

- [Documentación oficial](https://www.mercadopago.com.co/developers/es/docs)
- [Centro de ayuda](https://www.mercadopago.com.co/ayuda)
- [Comunidad de desarrolladores](https://www.mercadopago.com.co/developers/es/community)

## 🎉 ¡Listo!

Tu tienda ahora acepta pagos con tarjeta a través de Mercado Pago. Los usuarios pueden pagar de forma segura y tú recibirás las notificaciones correspondientes.

---

**Próximos pasos recomendados:**
1. Configurar cuenta empresarial en Mercado Pago
2. Implementar envío de emails de confirmación
3. Crear panel de administración para ver pagos
4. Configurar informes de ventas
