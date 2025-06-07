const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/products - Obtener todos los productos (público)
router.get('/', async (req, res) => {
  try {
    // Aquí iría la lógica para obtener productos de la base de datos
    // Por ahora retornamos datos de ejemplo
    const productos = [
      {
        id: 1,
        nombre: 'Mochila Wayuu',
        descripcion: 'Mochila artesanal tejida por la comunidad Wayuu',
        precio: 150000,
        categoria: 'Textiles',
        imagen: '/img/Mochila wayuu.png',
        disponible: true,
        stock: 10
      },
      {
        id: 2,
        nombre: 'Cerámica Amazónica',
        descripcion: 'Vasija decorativa de cerámica tradicional amazónica',
        precio: 85000,
        categoria: 'Cerámica',
        imagen: '/img/Cerámica Amazónica.png',
        disponible: true,
        stock: 5
      },
      {
        id: 3,
        nombre: 'Collar de Nácar',
        descripcion: 'Collar artesanal elaborado con nácar natural',
        precio: 120000,
        categoria: 'Joyería',
        imagen: '/img/Collar de Nácar.png',
        disponible: true,
        stock: 8
      }
    ];

    res.json({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: {
        products: productos,
        total: productos.length
      }
    });
  } catch (error) {
    console.error('Error en GET /products:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/products/:id - Obtener producto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Aquí iría la lógica para obtener un producto específico
    // Por ahora simulamos la búsqueda
    const producto = {
      id: parseInt(id),
      nombre: 'Producto de ejemplo',
      descripcion: 'Descripción del producto',
      precio: 100000,
      categoria: 'Ejemplo',
      imagen: '/img/ejemplo.png',
      disponible: true,
      stock: 5,
      detalles: {
        material: 'Materiales tradicionales',
        origen: 'Artesanos locales',
        dimensiones: '20cm x 15cm x 10cm'
      }
    };

    res.json({
      success: true,
      message: 'Producto encontrado',
      data: {
        product: producto
      }
    });
  } catch (error) {
    console.error('Error en GET /products/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/products - Crear nuevo producto (solo admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, descripción, precio, categoría'
      });
    }

    // Aquí iría la lógica para crear el producto en la base de datos
    const nuevoProducto = {
      id: Date.now(), // ID temporal
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
      imagen: imagen || '/img/default.png',
      disponible: true,
      stock: parseInt(stock) || 0,
      fechaCreacion: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: {
        product: nuevoProducto
      }
    });
  } catch (error) {
    console.error('Error en POST /products:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, imagen, stock, disponible } = req.body;

    // Aquí iría la lógica para actualizar el producto en la base de datos
    const productoActualizado = {
      id: parseInt(id),
      nombre: nombre || 'Nombre actualizado',
      descripcion: descripcion || 'Descripción actualizada',
      precio: precio ? parseFloat(precio) : 100000,
      categoria: categoria || 'Categoría',
      imagen: imagen || '/img/default.png',
      disponible: disponible !== undefined ? disponible : true,
      stock: stock ? parseInt(stock) : 0,
      fechaActualizacion: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: {
        product: productoActualizado
      }
    });
  } catch (error) {
    console.error('Error en PUT /products/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/products/:id - Eliminar producto (solo admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Aquí iría la lógica para eliminar el producto de la base de datos
    res.json({
      success: true,
      message: `Producto con ID ${id} eliminado correctamente`
    });
  } catch (error) {
    console.error('Error en DELETE /products/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/products/category/:categoria - Obtener productos por categoría
router.get('/category/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;

    // Aquí iría la lógica para filtrar productos por categoría
    const productosPorCategoria = [
      {
        id: 1,
        nombre: `Producto de ${categoria}`,
        descripcion: `Producto artesanal de la categoría ${categoria}`,
        precio: 95000,
        categoria: categoria,
        imagen: '/img/ejemplo.png',
        disponible: true,
        stock: 3
      }
    ];

    res.json({
      success: true,
      message: `Productos de la categoría ${categoria}`,
      data: {
        products: productosPorCategoria,
        categoria: categoria,
        total: productosPorCategoria.length
      }
    });
  } catch (error) {
    console.error('Error en GET /products/category/:categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/products/search/:termino - Buscar productos
router.get('/search/:termino', async (req, res) => {
  try {
    const { termino } = req.params;

    // Aquí iría la lógica para buscar productos
    const resultadosBusqueda = [
      {
        id: 1,
        nombre: `Resultado para "${termino}"`,
        descripcion: `Producto que coincide con la búsqueda de ${termino}`,
        precio: 75000,
        categoria: 'Varios',
        imagen: '/img/ejemplo.png',
        disponible: true,
        stock: 2
      }
    ];

    res.json({
      success: true,
      message: `Resultados de búsqueda para "${termino}"`,
      data: {
        products: resultadosBusqueda,
        termino: termino,
        total: resultadosBusqueda.length
      }
    });
  } catch (error) {
    console.error('Error en GET /products/search/:termino:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
