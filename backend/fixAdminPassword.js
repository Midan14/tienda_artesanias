const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function fixAdminPassword() {
  try {
    console.log('🔧 Iniciando corrección del usuario administrador...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artesanias_ancestrales');
    console.log('✅ Conectado a MongoDB');
    
    // Buscar el usuario administrador (incluir password)
    const adminUser = await User.findOne({ email: 'admin@artesaniasancestrales.com' }).select('+password');
    
    if (!adminUser) {
      console.log('❌ Usuario administrador no encontrado');
      console.log('🔄 Creando nuevo usuario administrador...');
      
      // Crear nuevo usuario admin
      const newAdmin = new User({
        nombre: 'Administrador',
        email: 'admin@artesaniasancestrales.com',
        password: 'Admin123!',
        role: 'admin',
        telefono: '+57 300 123 4567',
        direccion: {
          calle: 'Calle Principal 123',
          ciudad: 'Bogotá',
          estado: 'Cundinamarca',
          codigoPostal: '110111',
          pais: 'Colombia'
        },
        activo: true
      });

      await newAdmin.save();
      console.log('✅ Nuevo usuario administrador creado');
      console.log('📧 Email: admin@artesaniasancestrales.com');
      console.log('🔑 Contraseña: Admin123!');
      
    } else {
      console.log('👤 Usuario administrador encontrado');
      console.log('📧 Email:', adminUser.email);
      console.log('👑 Rol actual:', adminUser.role);
      console.log('✅ Activo:', adminUser.activo);
      console.log('🔑 Password existe:', adminUser.password ? 'Sí' : 'No');
      
      // Siempre actualizar el usuario para corregir rol y contraseña
      console.log('🔄 Actualizando usuario administrador...');
      
      // Crear nueva contraseña encriptada
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Admin123!', salt);
      
      await User.findByIdAndUpdate(adminUser._id, {
        password: hashedPassword,
        role: 'admin', // Corregir el rol
        activo: true
      });
      
      console.log('✅ Usuario administrador actualizado exitosamente');
      
      // Verificar la contraseña después de la actualización
      const updatedUser = await User.findOne({ email: 'admin@artesaniasancestrales.com' }).select('+password');
      const finalCheck = await updatedUser.comparePassword('Admin123!');
      console.log('🔐 Verificación final - Contraseña funciona:', finalCheck);
      console.log('👑 Rol actualizado:', updatedUser.role);
    }
    
    console.log('🎉 Proceso completado exitosamente');
    console.log('');
    console.log('💡 Credenciales del administrador:');
    console.log('   📧 Email: admin@artesaniasancestrales.com');
    console.log('   🔑 Contraseña: Admin123!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixAdminPassword();
}

module.exports = fixAdminPassword;
