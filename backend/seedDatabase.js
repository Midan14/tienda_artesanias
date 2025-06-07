const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar modelos
const User = require('./models/User');
const Product = require('./models/Product');

// Función para crear usuario administrador
const createAdminUser = async () => {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Usuario administrador ya existe');
      console.log('📧 Email:', existingAdmin.email);
      return existingAdmin;
    }

    // Crear usuario admin
    const adminUser = new User({
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

    await adminUser.save();
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@artesaniasancestrales.com');
    console.log('🔑 Contraseña: Admin123!');
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    throw error;
  }
};

// Función para crear productos de ejemplo
const createSampleProducts = async () => {
  try {
    // Verificar si ya existen productos
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`⚠️  Ya existen ${existingProducts} productos en la base de datos`);
      return;
    }

    const sampleProducts = [
      {
        nombre: 'Vasija de Barro Wayuu',
        descripcion: 'Hermosa vasija de barro tradicional elaborada por artesanas Wayuu de La Guajira. Cada pieza es única y refleja siglos de tradición ancestral.',
        precio: 85000,
        categoria: 'ceramica',
        stock: 15,
        imagenes: [
          { 
            url: 'img/Vasija Decorativa.png', 
            alt: 'Vasija de Barro Wayuu', 
            esPrincipal: true 
          }
        ],
        comunidad: {
          nombre: 'Artesanas Wayuu',
          region: 'La Guajira',
          descripcion: 'María aprendió el arte de la cerámica de su abuela y ha perfeccionado la técnica durante más de 20 años.'
        },
        dimensiones: {
          largo: 20,
          ancho: 20,
          alto: 25
        },
        peso: 1.2,
        destacado: true,
        activo: true,
        tags: ['wayuu', 'ceramica', 'tradicional', 'la-guajira']
      },
      {
        nombre: 'Mochila Arhuaca Original',
        descripcion: 'Auténtica mochila tejida por manos expertas de la comunidad Arhuaca. Elaborada con fibras naturales y técnicas ancestrales.',
        precio: 120000,
        categoria: 'textiles',
        stock: 8,
        imagenes: [
          { 
            url: 'img/Mochila wayuu.png', 
            alt: 'Mochila Arhuaca Original', 
            esPrincipal: true 
          }
        ],
        comunidad: {
          nombre: 'Tejedores Arhuacos',
          region: 'Sierra Nevada de Santa Marta',
          descripcion: 'Pedro es un maestro tejedor que preserva las tradiciones de su pueblo a través de cada fibra.'
        },
        dimensiones: {
          largo: 30,
          ancho: 35,
          alto: 40
        },
        peso: 0.5,
        destacado: true,
        activo: true,
        tags: ['arhuaco', 'textil', 'mochila', 'sierra-nevada']
      },
      {
        nombre: 'Collar de Nácar Embera',
        descripcion: 'Exquisito collar elaborado con nácar natural por artesanas de la comunidad Embera. Un símbolo de elegancia y tradición.',
        precio: 65000,
        categoria: 'joyeria',
        stock: 12,
        imagenes: [
          { 
            url: 'img/Collar de Nácar.png', 
            alt: 'Collar de Nácar Embera', 
            esPrincipal: true 
          }
        ],
        comunidad: {
          nombre: 'Artesanas Embera',
          region: 'Chocó',
          descripcion: 'Ana ha dedicado su vida a crear hermosas joyas que reflejan la riqueza cultural de su pueblo.'
        },
        peso: 0.1,
        destacado: false,
        activo: true,
        tags: ['embera', 'joyeria', 'nacar', 'choco']
      },
      {
        nombre: 'Tapiz Artesanal',
        descripcion: 'Hermoso tapiz tejido a mano con patrones geométricos tradicionales. Perfecto para decorar espacios con arte ancestral.',
        precio: 200000,
        categoria: 'textiles',
        stock: 5,
        imagenes: [
          { 
            url: 'img/Tapiz Artesanal.png', 
            alt: 'Tapiz Artesanal', 
            esPrincipal: true 
          }
        ],
        comunidad: {
          nombre: 'Tejedores Andinos',
          region: 'Boyacá',
          descripcion: 'Familia de tejedores que ha mantenido viva la tradición textil durante generaciones.'
        },
        dimensiones: {
          largo: 150,
          ancho: 100,
          alto: 2
        },
        peso: 1.5,
        destacado: true,
        activo: true,
        tags: ['textil', 'tapiz', 'boyaca', 'andino']
      },
      {
        nombre: 'Hamaca Artesanal',
        descripcion: 'Cómoda hamaca tejida con fibras naturales. Ideal para descansar y conectar con la naturaleza.',
        precio: 150000,
        categoria: 'textiles',
        stock: 7,
        imagenes: [
          { 
            url: 'img/Hamaca Artesanal.png', 
            alt: 'Hamaca Artesanal', 
            esPrincipal: true 
          }
        ],
        comunidad: {
          nombre: 'Tejedores Costeños',
          region: 'Costa Atlántica',
          descripcion: 'Especialistas en hamacas tradicionales con técnicas heredadas de generación en generación.'
        },
        dimensiones: {
          largo: 400,
          ancho: 150,
          alto: 10
        },
        peso: 2.0,
        destacado: false,
        activo: true,
        tags: ['hamaca', 'textil', 'costa', 'descanso']
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${createdProducts.length} productos de ejemplo creados`);
    
    return createdProducts;
  } catch (error) {
    console.error('❌ Error creando productos de ejemplo:', error);
    throw error;
  }
};

// Función principal para poblar la base de datos
const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Crear usuario administrador
    await createAdminUser();
    
    // Crear productos de ejemplo
    await createSampleProducts();
    
    console.log('🎉 Seed completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en el seed de la base de datos:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar seed si el archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, createAdminUser, createSampleProducts };
