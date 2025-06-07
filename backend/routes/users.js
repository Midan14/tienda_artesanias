const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', auth, async (req, res) => {
  try {
    console.log('📊 Petición a /api/users recibida');
    console.log('👤 Usuario autenticado:', req.user);
    
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      console.log('❌ Usuario no es admin:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador.'
      });
    }

    console.log('✅ Usuario es admin, obteniendo usuarios...');
    
    // Obtener todos los usuarios (sin la contraseña)
    const users = await User.find({}).select('-password');
    
    console.log(`📋 ${users.length} usuarios encontrados`);
    
    res.json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: users
    });
  } catch (error) {
    console.error('❌ Error en GET /users:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/users/:id - Obtener usuario específico
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo el mismo usuario o admin puede ver la información
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    // Aquí iría la lógica para obtener un usuario específico
    res.json({
      success: true,
      message: 'Usuario encontrado',
      data: {
        user: {
          id: id,
          message: 'Funcionalidad en desarrollo'
        }
      }
    });
  } catch (error) {
    console.error('Error en GET /users/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo el mismo usuario o admin puede actualizar
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    // Aquí iría la lógica para actualizar usuario
    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: {
        user: {
          id: id,
          message: 'Funcionalidad en desarrollo'
        }
      }
    });
  } catch (error) {
    console.error('Error en PUT /users/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador.'
      });
    }

    const { id } = req.params;

    // Aquí iría la lógica para eliminar usuario
    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en DELETE /users/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
