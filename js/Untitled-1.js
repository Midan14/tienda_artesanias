// Configuración de la API
const API_BASE_URL = 'http://localhost:5000';

// Constants for DOM element IDs and classes
const DOM_ELEMENTS = {
    USER_NAME: 'user-name',
    GUEST_MENU: 'guest-menu',
    USER_MENU_CONTENT: 'user-menu-content',
    USER_MENU: 'user-menu',
    LOGOUT_BTN: 'logout-btn',
    CART_COUNT: 'cart-count',
    NOTIFICATION: 'notification',
    NOTIFICATION_MESSAGE: 'notification-message',
    NOTIFICATION_CLOSE: 'notification-close',
    LOGIN_FORM: 'login-form',
    REGISTER_FORM: 'register-form'
};

const CSS_CLASSES = {
    HIDDEN: 'hidden',
    SHOW: 'show',
    ADMIN_ONLY: 'admin-only',
    USER_TOGGLE: 'user-toggle',
    LOGOUT_BUTTON: 'logout-button'
};

// Authentication State Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authToken = localStorage.getItem('authToken');
        this.notificationTimeout = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthStatus();
            this.setupUserDropdown();
            this.updateCartCount();
        });
    }

    // Getters
    get isAuthenticated() {
        return !!this.authToken && !!this.currentUser;
    }

    get isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    // Check authentication status
    async checkAuthStatus() {
        if (!this.authToken) {
            this.updateUI();
            return;
        }

        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/api/auth/profile`);
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.data.user;
                this.saveUserToStorage(this.currentUser);
            } else {
                this.clearAuth();
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            this.clearAuth();
        }
        
        this.updateUI();
    }

    // Clear authentication data
    clearAuth() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.authToken = null;
        this.currentUser = null;
    }

    // Save user to localStorage for faster initial load
    saveUserToStorage(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Unified UI update method
    updateUI() {
        const elements = this.getUIElements();
        
        if (this.isAuthenticated) {
            this.showAuthenticatedUI(elements);
        } else {
            this.showGuestUI(elements);
        }
    }

    // Get UI elements with null checks
    getUIElements() {
        return {
            userName: document.getElementById(DOM_ELEMENTS.USER_NAME),
            guestMenu: document.getElementById(DOM_ELEMENTS.GUEST_MENU),
            userMenuContent: document.getElementById(DOM_ELEMENTS.USER_MENU_CONTENT),
            adminElements: document.querySelectorAll(`.${CSS_CLASSES.ADMIN_ONLY}`)
        };
    }

    // Show UI for authenticated users
    showAuthenticatedUI(elements) {
        const { userName, guestMenu, userMenuContent, adminElements } = elements;

        if (userName) {
            userName.textContent = this.currentUser.nombre;
            userName.classList.remove(CSS_CLASSES.HIDDEN);
        }

        if (guestMenu) {
            guestMenu.classList.add(CSS_CLASSES.HIDDEN);
        }
        if (userMenuContent) {
            userMenuContent.classList.remove(CSS_CLASSES.HIDDEN);
        }

        // Show admin elements if user is admin
        if (this.isAdmin) {
            adminElements.forEach(element => element.classList.remove(CSS_CLASSES.HIDDEN));
        } else {
            adminElements.forEach(element => element.classList.add(CSS_CLASSES.HIDDEN));
        }
    }

    // Show UI for guest users
    showGuestUI(elements) {
        const { userName, guestMenu, userMenuContent, adminElements } = elements;

        if (userName) {
            userName.classList.add(CSS_CLASSES.HIDDEN);
        }
        if (guestMenu) {
            guestMenu.classList.remove(CSS_CLASSES.HIDDEN);
        }
        if (userMenuContent) {
            userMenuContent.classList.add(CSS_CLASSES.HIDDEN);
        }

        // Hide all admin elements
        adminElements.forEach(element => element.classList.add(CSS_CLASSES.HIDDEN));
    }

    // Setup user dropdown functionality
    setupUserDropdown() {
        const userToggle = document.querySelector(`.${CSS_CLASSES.USER_TOGGLE}`);
        const dropdownMenu = document.getElementById(DOM_ELEMENTS.USER_MENU);
        const logoutBtn = document.getElementById(DOM_ELEMENTS.LOGOUT_BTN);

        if (userToggle && dropdownMenu) {
            // Remove existing listeners to prevent duplicates
            userToggle.replaceWith(userToggle.cloneNode(true));
            const newUserToggle = document.querySelector(`.${CSS_CLASSES.USER_TOGGLE}`);

            newUserToggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownMenu.classList.toggle(CSS_CLASSES.SHOW);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!newUserToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove(CSS_CLASSES.SHOW);
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.replaceWith(logoutBtn.cloneNode(true));
            const newLogoutBtn = document.getElementById(DOM_ELEMENTS.LOGOUT_BTN);
            newLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Login method
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.authToken = data.token;
                localStorage.setItem('authToken', this.authToken);
                this.currentUser = data.data.user;
                this.saveUserToStorage(this.currentUser);
                this.updateUI();
                this.showNotification(`Bienvenido, ${this.currentUser.nombre}!`, 'success');
                return { success: true, user: this.currentUser };
            } else {
                this.showNotification(data.message || 'Error en el login', 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.showNotification('Error de conexión', 'error');
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Register method
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.showNotification('Registro exitoso. Puedes iniciar sesión ahora.', 'success');
                return { success: true };
            } else {
                this.showNotification(data.message || 'Error en el registro', 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error en registro:', error);
            this.showNotification('Error de conexión', 'error');
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Authenticated fetch wrapper
    async fetchWithAuth(url, options = {}) {
        if (!this.authToken) {
            this.showNotification('No autenticado. Por favor inicia sesión.', 'warning');
            throw new Error('No hay token de autenticación');
        }

        const mergedOptions = {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        };

        const response = await fetch(url, mergedOptions);

        if (response.status === 401) {
            this.clearAuth();
            this.updateUI();
            this.showNotification('Sesión expirada. Por favor inicia sesión nuevamente.', 'warning');
            throw new Error('Token expirado o inválido');
        }

        return response;
    }

    // Get user profile
    async getProfile() {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/api/auth/profile`);
            const data = await response.json();
            return data.data.user;
        } catch (error) {
            console.error('Error getting profile:', error);
            throw error;
        }
    }

    // Update user profile
    async updateProfile(userData) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PUT',
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.currentUser = data.data.user;
                this.saveUserToStorage(this.currentUser);
                this.updateUI();
                return data.data.user;
            } else {
                throw new Error(data.message || 'Error actualizando perfil');
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            throw error;
        }
    }

    // Verify token
    async verifyToken() {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/api/auth/verify`);
            const data = await response.json();
            return response.ok && data.success;
        } catch (error) {
            console.error('Error verifying token:', error);
            this.clearAuth();
            this.showNotification('Error de autenticación. Por favor inicie sesión nuevamente.', 'error');
            return false;
        }
    }

    // Logout
    logout() {
        this.clearAuth();
        this.updateUI();
        this.showNotification('Sesión cerrada exitosamente', 'success');
        
        // Redirect if on protected pages
        const protectedPages = ['admin.html', 'cuenta.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // Cart functionality
    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById(DOM_ELEMENTS.CART_COUNT);
        
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    addToCart(productId, quantity = 1) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Producto agregado al carrito', 'success');
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.getElementById(DOM_ELEMENTS.NOTIFICATION);
        const messageElement = document.getElementById(DOM_ELEMENTS.NOTIFICATION_MESSAGE);
        const closeButton = document.getElementById(DOM_ELEMENTS.NOTIFICATION_CLOSE);

        if (!notification || !messageElement) {
            console.warn('Notification elements not found');
            return;
        }

        // Clear previous timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        // Clear previous type classes
        notification.classList.remove('success', 'error', 'warning', 'info');
        notification.classList.add(type);
        
        messageElement.textContent = message;
        notification.classList.remove(CSS_CLASSES.HIDDEN);
        notification.classList.add(CSS_CLASSES.SHOW);

        // Auto-close after 5 seconds
        this.notificationTimeout = setTimeout(() => {
            this.hideNotification();
        }, 5000);

        // Manual close
        if (closeButton) {
            closeButton.onclick = () => {
                clearTimeout(this.notificationTimeout);
                this.hideNotification();
            };
        }
    }

    hideNotification() {
        const notification = document.getElementById(DOM_ELEMENTS.NOTIFICATION);
        if (notification) {
            notification.classList.remove(CSS_CLASSES.SHOW);
            setTimeout(() => {
                notification.classList.add(CSS_CLASSES.HIDDEN);
            }, 300);
        }
    }

    // Authorization helpers
    requireAdmin() {
        if (!this.isAdmin) {
            this.showNotification('Acceso denegado. Se requieren permisos de administrador.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return false;
        }
        return true;
    }
}

// UI Helper for forms and interactions
class AuthUI {
    constructor(authManager) {
        this.authManager = authManager;
    }

    // Show error messages
    showError(message, elementId = 'error-message') {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            this.authManager.showNotification(message, 'error');
        }
    }

    // Show success messages
    showSuccess(message, elementId = 'success-message') {
        const successElement = document.getElementById(elementId);
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 3000);
        } else {
            this.authManager.showNotification(message, 'success');
        }
    }

    // Handle login form submission
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email')?.value?.trim();
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            this.showError('Por favor completa todos los campos');
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;

        try {
            if (submitBtn) {
                submitBtn.textContent = 'Iniciando sesión...';
                submitBtn.disabled = true;
            }

            const result = await this.authManager.login(email, password);
            
            if (result.success) {
                this.showSuccess('¡Inicio de sesión exitoso!');

                // Redirect based on role
                setTimeout(() => {
                    const redirectUrl = result.user.role === 'admin' ? 'admin.html' : 'cuenta.html';
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                this.showError(result.message || 'Error al iniciar sesión');
            }

        } catch (error) {
            this.showError(error.message || 'Error al iniciar sesión');
        } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText || 'Iniciar Sesión';
                submitBtn.disabled = false;
            }
        }
    }

    // Handle registration form submission
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = Object.fromEntries(formData.entries());

        // Basic validation
        if (userData.password !== userData.confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (userData.password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        delete userData.confirmPassword;

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;

        try {
            if (submitBtn) {
                submitBtn.textContent = 'Registrando...';
                submitBtn.disabled = true;
            }

            const result = await this.authManager.register(userData);
            
            if (result.success) {
                this.showSuccess('¡Registro exitoso! Puedes iniciar sesión ahora.');
                setTimeout(() => {
                    window.location.href = 'cuenta.html';
                }, 2000);
            } else {
                this.showError(result.message || 'Error al registrarse');
            }

        } catch (error) {
            this.showError(error.message || 'Error al registrarse');
        } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText || 'Registrarse';
                submitBtn.disabled = false;
            }
        }
    }

    // Handle logout with confirmation
    handleLogout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            this.authManager.logout();
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instances
    const authManager = new AuthManager();
    const authUI = new AuthUI(authManager);

    // Setup form handlers
    const loginForm = document.getElementById(DOM_ELEMENTS.LOGIN_FORM);
    if (loginForm) {
        loginForm.addEventListener('submit', authUI.handleLogin.bind(authUI));
    }

    const registerForm = document.getElementById(DOM_ELEMENTS.REGISTER_FORM);
    if (registerForm) {
        registerForm.addEventListener('submit', authUI.handleRegister.bind(authUI));
    }

    // Setup logout buttons
    const logoutButtons = document.querySelectorAll(`.${CSS_CLASSES.LOGOUT_BUTTON}`);
    logoutButtons.forEach(button => {
        button.addEventListener('click', authUI.handleLogout.bind(authUI));
    });

    // Expose to global scope for backward compatibility
    window.authManager = authManager;
    window.AuthUI = authUI;
    window.addToCart = authManager.addToCart.bind(authManager);
    window.updateCartCount = authManager.updateCartCount.bind(authManager);
    window.login = authManager.login.bind(authManager);
    window.register = authManager.register.bind(authManager);
    window.logout = authManager.logout.bind(authManager);
    window.getProfile = authManager.getProfile.bind(authManager);
    window.updateProfile = authManager.updateProfile.bind(authManager);
    window.verifyToken = authManager.verifyToken.bind(authManager);
    window.fetchWithAuth = authManager.fetchWithAuth.bind(authManager);
    window.isAdmin = () => authManager.isAdmin;
    window.requireAdmin = authManager.requireAdmin.bind(authManager);
    window.showNotification = authManager.showNotification.bind(authManager);
});
