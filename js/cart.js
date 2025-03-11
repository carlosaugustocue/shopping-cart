class Cart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.setupEventListeners();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    setupEventListeners() {
        // Actualizar la vista del carrito cuando se abre el modal
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('show.bs.modal', () => this.updateCartView());
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (!existingItem) {
            this.items.push({ ...product, quantity: 1 });
            this.saveCart();
            window.notifications.show('Producto agregado al carrito', 'success');
        } else {
            window.notifications.show('Este producto ya está en el carrito', 'info');
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartView();
        window.notifications.show('Producto eliminado del carrito', 'success');
    }

    clearCart() {
        this.items = [];
        localStorage.removeItem('cart');
        this.updateCartCount();
        this.updateCartView();
        window.notifications.show('Carrito vaciado', 'success');
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    updateCartView() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-button');

        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="text-center text-muted my-4">El carrito está vacío</p>';
            if (cartTotal) cartTotal.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item mb-3">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="text-muted mb-0">$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        if (cartTotal) cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    processCheckout() {
        if (this.items.length === 0) {
            window.notifications.show('El carrito está vacío', 'error');
            return false;
        }

        try {
            // Guardar los items del carrito en sessionStorage para el checkout
            sessionStorage.setItem('checkout_items', JSON.stringify(this.items));
            sessionStorage.setItem('checkout_total', this.getTotal().toFixed(2));
            return true;
        } catch (error) {
            console.error('Error al guardar los items:', error);
            window.notifications.show('Error al procesar el carrito', 'error');
            return false;
        }
    }
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
