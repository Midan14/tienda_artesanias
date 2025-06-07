// Utilidades para observación de DOM modernas y optimizadas
class DOMObserver {
    constructor() {
        this.observers = new Map();
        this.intersectionObservers = new Map();
    }

    // Observar cambios en el DOM usando MutationObserver (API moderna)
    observeChanges(target, callback, options = {}) {
        const defaultOptions = {
            childList: true,
            subtree: false,
            attributes: false,
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        };

        const observerOptions = { ...defaultOptions, ...options };
        
        const observer = new MutationObserver((mutations) => {
            const changes = mutations.map(mutation => ({
                type: mutation.type,
                target: mutation.target,
                addedNodes: Array.from(mutation.addedNodes),
                removedNodes: Array.from(mutation.removedNodes),
                attributeName: mutation.attributeName,
                oldValue: mutation.oldValue
            }));
            
            callback(changes);
        });

        observer.observe(target, observerOptions);
        this.observers.set(target, observer);
        
        return observer;
    }

    // Observar cuando elementos entran/salen del viewport
    observeIntersection(elements, callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observerOptions = { ...defaultOptions, ...options };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                callback(entry.target, entry.isIntersecting, entry);
            });
        }, observerOptions);

        elements.forEach(element => {
            observer.observe(element);
        });

        this.intersectionObservers.set(elements, observer);
        return observer;
    }

    // Observar cambios de tamaño usando ResizeObserver
    observeResize(elements, callback) {
        if (!window.ResizeObserver) {
            console.warn('ResizeObserver no está disponible en este navegador');
            return null;
        }

        const observer = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                callback(entry.target, entry.contentRect);
            });
        });

        elements.forEach(element => {
            observer.observe(element);
        });

        return observer;
    }

    // Limpiar observadores
    disconnect(target) {
        if (this.observers.has(target)) {
            this.observers.get(target).disconnect();
            this.observers.delete(target);
        }
    }

    // Limpiar todos los observadores
    disconnectAll() {
        this.observers.forEach(observer => observer.disconnect());
        this.intersectionObservers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.intersectionObservers.clear();
    }
}

// Utilidades para manejo eficiente de eventos
class EventUtils {
    constructor() {
        this.throttleTimers = new Map();
        this.debounceTimers = new Map();
    }

    // Throttle: limita la ejecución de una función
    throttle(func, delay, id = 'default') {
        return (...args) => {
            if (!this.throttleTimers.has(id)) {
                func.apply(this, args);
                this.throttleTimers.set(id, setTimeout(() => {
                    this.throttleTimers.delete(id);
                }, delay));
            }
        };
    }

    // Debounce: retrasa la ejecución hasta que pase un tiempo sin llamadas
    debounce(func, delay, id = 'default') {
        return (...args) => {
            if (this.debounceTimers.has(id)) {
                clearTimeout(this.debounceTimers.get(id));
            }
            
            this.debounceTimers.set(id, setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(id);
            }, delay));
        };
    }

    // Event listener con opciones de rendimiento
    addOptimizedListener(element, event, handler, options = {}) {
        const defaultOptions = {
            passive: true, // Mejora el rendimiento para eventos de scroll/touch
            once: false,
            capture: false
        };

        const listenerOptions = { ...defaultOptions, ...options };
        element.addEventListener(event, handler, listenerOptions);
        
        return () => element.removeEventListener(event, handler, listenerOptions);
    }

    // Delegación de eventos para mejor rendimiento
    delegate(parent, selector, event, handler) {
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, e);
            }
        };

        parent.addEventListener(event, delegatedHandler);
        return () => parent.removeEventListener(event, delegatedHandler);
    }
}

// Instancias globales
window.domObserver = new DOMObserver();
window.eventUtils = new EventUtils();

// Limpiar observadores al cerrar la página
window.addEventListener('beforeunload', () => {
    window.domObserver.disconnectAll();
});

export { DOMObserver, EventUtils };
