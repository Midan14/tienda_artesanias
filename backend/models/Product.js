const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['ceramica', 'textiles', 'joyeria', 'madera', 'otros']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  imagenes: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    esPrincipal: {
      type: Boolean,
      default: false
    }
  }],
  comunidad: {
    nombre: String,
    region: String,
    descripcion: String
  },
  dimensiones: {
    largo: Number,
    ancho: Number,
    alto: Number
  },
  peso: {
    type: Number,
    min: [0, 'El peso no puede ser negativo']
  },
  destacado: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  descuento: {
    porcentaje: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    fechaInicio: Date,
    fechaFin: Date
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
productSchema.index({ categoria: 1, activo: 1 });
productSchema.index({ destacado: 1, activo: 1 });
productSchema.index({ nombre: 'text', descripcion: 'text' });

// Virtual para precio con descuento
productSchema.virtual('precioConDescuento').get(function() {
  if (this.descuento && this.descuento.porcentaje > 0) {
    const ahora = new Date();
    if ((!this.descuento.fechaInicio || ahora >= this.descuento.fechaInicio) &&
        (!this.descuento.fechaFin || ahora <= this.descuento.fechaFin)) {
      return this.precio * (1 - this.descuento.porcentaje / 100);
    }
  }
  return this.precio;
});

// Asegurar que los virtuals se incluyan en JSON
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
