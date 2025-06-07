// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Utilitarios para manejar tokens
const AuthUtils = {
  // Guardar token en localStorage
  saveToken(token) {
    localStorage.setItem('authToken', token);
  },

  // Obtener token desde localStorage
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Eliminar token
  removeToken() {
    localStorage.removeItem('authToken');
  },

  // Verificar si hay un token válido
  isAuthenticated() {
    return !!this.getToken();
  },

  // Obtener headers de autorización
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

// Clase para manejar autenticación
class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Realizar petición HTTP
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...AuthUtils.getAuthHeaders(),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  }

  // Login de usuario
  async login(email, password) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        AuthUtils.saveToken(response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Registro de usuario
  async register(userData) {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        AuthUtils.saveToken(response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await this.makeRequest('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  // Actualizar perfil
  async updateProfile(userData) {
    try {
      const response = await this.makeRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  // Verificar token
  async verifyToken() {
    try {
      const response = await this.makeRequest('/auth/verify');
      return response.success;
    } catch (error) {
      // Si el token es inválido, eliminarlo
      console.error('Error verificando token:', error.message);
      AuthUtils.removeToken();
      return false;
    }
  }

  // Logout
  logout() {
    AuthUtils.removeToken();
    // Redireccionar a la página principal si es necesario
    window.location.href = '/';
  }
}

// Crear instancia global del servicio de autenticación
const authService = new AuthService();

// Funciones para manejar la UI de autenticación
const AuthUI = {
  // Mostrar errores en la interfaz
  showError(message, elementId = 'error-message') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      // Ocultar el error después de 5 segundos
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    } else {
      alert(message); // Fallback si no hay elemento de error
    }
  },

  // Mostrar mensaje de éxito
  showSuccess(message, elementId = 'success-message') {
    const successElement = document.getElementById(elementId);
    if (successElement) {
      successElement.textContent = message;
      successElement.style.display = 'block';
      setTimeout(() => {
        successElement.style.display = 'none';
      }, 3000);
    }
  },

  // Actualizar UI basada en el estado de autenticación
  updateAuthUI(user = null) {
    const userDropdown = document.querySelector('.user-dropdown');
    const userName = document.querySelector('.user-name');
    const loginButton = document.querySelector('.login-button');

    if (user) {
      // Usuario logueado
      if (userDropdown) {
        userDropdown.style.display = 'block';
      }
      if (userName) {
        userName.textContent = user.nombre;
      }
      if (loginButton) {
        loginButton.style.display = 'none';
      }

      // Mostrar enlaces de admin si es administrador
      const adminLinks = document.querySelectorAll('.admin-only');
      if (user.role === 'admin') {
        adminLinks.forEach(link => link.style.display = 'block');
      } else {
        adminLinks.forEach(link => link.style.display = 'none');
      }
    } else {
      // Usuario no logueado
      if (userDropdown) {
        userDropdown.style.display = 'none';
      }
      if (loginButton) {
        loginButton.style.display = 'block';
      }
      
      // Ocultar enlaces de admin
      const adminLinks = document.querySelectorAll('.admin-only');
      adminLinks.forEach(link => link.style.display = 'none');
    }
  },

  // Manejar formulario de login
  async handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      this.showError('Por favor completa todos los campos');
      return;
    }

    try {
      // Mostrar loading
      const submitBtn = event.target.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Iniciando sesión...';
      submitBtn.disabled = true;

      const user = await authService.login(email, password);
      
      this.showSuccess('¡Inicio de sesión exitoso!');
      this.updateAuthUI(user);

      // Redireccionar según el rol
      setTimeout(() => {
        if (user.role === 'admin') {
          window.location.href = '/admin.html';
        } else {
          window.location.href = '/cuenta.html';
        }
      }, 1000);

    } catch (error) {
      this.showError(error.message || 'Error al iniciar sesión');
    } finally {
      // Restaurar botón
      const submitBtn = event.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Iniciar Sesión';
        submitBtn.disabled = false;
      }
    }
  },

  // Manejar formulario de registro
  async handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    // Validaciones básicas
    if (userData.password !== userData.confirmPassword) {
      this.showError('Las contraseñas no coinciden');
      return;
    }

    delete userData.confirmPassword; // No enviar la confirmación

    try {
      const submitBtn = event.target.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Registrando...';
      submitBtn.disabled = true;
      const user = await authService.register(userData);
      
      this.showSuccess('¡Registro exitoso!');
      this.updateAuthUI(user);

      setTimeout(() => {
        window.location.href = '/cuenta.html';
      }, 1000);

    } catch (error) {
      this.showError(error.message || 'Error al registrarse');
    } finally {
      const submitBtn = event.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Registrarse';
        submitBtn.disabled = false;
      }
    }
  },

  // Manejar logout
  handleLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      authService.logout();
      this.updateAuthUI();
    }
  }
};

// Inicializar autenticación cuando carga la página
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar si hay un token válido
  if (AuthUtils.isAuthenticated()) {
    try {
      const isValid = await authService.verifyToken();
      if (isValid) {
        const user = await authService.getProfile();
        AuthUI.updateAuthUI(user);
      } else {
        AuthUI.updateAuthUI(); // Token inválido
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      AuthUI.updateAuthUI(); // Error, asumir no autenticado
    }
  } else {
    AuthUI.updateAuthUI(); // No hay token
  }

  // Configurar event listeners para formularios
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', AuthUI.handleLogin.bind(AuthUI));
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', AuthUI.handleRegister.bind(AuthUI));
  }

  // Configurar event listeners para logout
  const logoutButtons = document.querySelectorAll('.logout-button');
  logoutButtons.forEach(button => {
    button.addEventListener('click', AuthUI.handleLogout.bind(AuthUI));
  });
});

// Exponer servicios globalmente
window.authService = authService;
window.AuthUtils = AuthUtils;
window.AuthUI = AuthUI;
