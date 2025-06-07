const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artesanias_ancestrales');
    console.log('✅ Conectado a MongoDB');
    
    const user = await User.findOne({email: 'admin@artesaniasancestrales.com'});
    console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
    
    if (user) {
      console.log('📧 Email:', user.email);
      console.log('👑 Rol:', user.rol);
      console.log('✅ Activo:', user.activo);
      console.log('🔑 Password hash existe:', user.password ? 'Sí' : 'No');
      
      // Probar la contraseña
      const isValid = await user.comparePassword('Admin123!');
      console.log('🔐 Contraseña "Admin123!" válida:', isValid);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUser();
