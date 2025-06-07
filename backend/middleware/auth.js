const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId);
    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuario no encontrado o inactivo.'
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      nombre: user.nombre
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

// Middleware para verificar rol de administrador
const adminAuth = async (req, res, next) => {
  try {
    // Primero verificar autenticación
    await auth(req, res, () => {
      // Verificar si es administrador
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado. Se requieren permisos de administrador.'
        });
      }
      next();
    });
  } catch (error) {
    console.error('Error en middleware de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = { auth, adminAuth };
