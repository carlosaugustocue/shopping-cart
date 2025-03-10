class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        this.saveCart();
        this.updateCartModal();
        return true;
    }

    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveCart();
            this.updateCartModal();
        }
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartModal();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartModal() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="text-center p-3">Tu carrito está vacío</p>';
            document.querySelector('#checkout-button')?.classList.add('disabled');
            return;
        }

        cartItems.innerHTML = `
            ${this.items.map(item => `
                <div class="cart-item d-flex align-items-center p-2 border-bottom">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="mb-0 text-muted">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls mt-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="text-end ms-3">
                        <p class="mb-0 fw-bold">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="btn btn-sm btn-danger mt-2" onclick="cart.removeItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
            <div class="cart-total d-flex justify-content-between align-items-center p-3">
                <h5 class="mb-0">Total:</h5>
                <h5 class="mb-0">$${this.getTotal().toFixed(2)}</h5>
            </div>
        `;
        
        // Habilitar el botón de checkout si hay items
        const checkoutButton = document.querySelector('#checkout-button');
        if (checkoutButton) {
            checkoutButton.classList.remove('disabled');
        }
    }

    // Método para procesar el checkout
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

// Inicializar carrito
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();

    // Event listener para botones de agregar al carrito
    document.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart, .add-to-cart *')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.productId,
                    name: productCard.querySelector('.product-title').textContent,
                    price: parseFloat(productCard.dataset.price),
                    image: productCard.querySelector('img').src
                };
                if (cart.addItem(product)) {
                    window.notifications.show('Producto agregado al carrito', 'success');
                }
            }
        }
    });

    // Event listener para el modal del carrito
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', () => {
            cart.updateCartModal();
        });
    }
});
