class Checkout {
    constructor() {
        this.items = [];
        this.discountCode = '';
        this.discountPercent = 0;
        this.init();
    }

    init() {
        this.loadCheckoutItems();
        this.setupEventListeners();
        this.updateOrderSummary();
    }

    loadCheckoutItems() {
        const checkoutItems = sessionStorage.getItem('checkout_items');
        if (checkoutItems) {
            this.items = JSON.parse(checkoutItems);
        }
    }

    setupEventListeners() {
        const form = document.getElementById('checkout-form');
        const cardInput = document.getElementById('card-number');
        const expiryInput = document.getElementById('expiry-date');
        const promoButton = document.getElementById('apply-promo');

        if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
        if (cardInput) cardInput.addEventListener('input', (e) => this.handleCardInput(e));
        if (expiryInput) expiryInput.addEventListener('input', (e) => this.handleExpiryInput(e));
        if (promoButton) promoButton.addEventListener('click', () => this.applyPromoCode());
    }

    updateOrderSummary() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;

        document.getElementById('cart-count').textContent = this.items.length;
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('payment-amount').textContent = ` ($${total.toFixed(2)})`;

        this.renderCheckoutItems();
    }

    renderCheckoutItems() {
        const container = document.getElementById('checkout-items');
        if (!container) return;

        container.innerHTML = this.items.map(item => `
            <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Cantidad: 1</small>
                    </div>
                    <span class="text-muted">$${item.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    calculateDiscount(subtotal) {
        return subtotal * (this.discountPercent / 100);
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promo-code');
        const code = promoInput.value.toUpperCase();
        const discounts = {
            'BIENVENIDO': 10,
            'DESCUENTO20': 20,
            'PRIMAVERA': 15
        };

        if (discounts[code]) {
            this.discountCode = code;
            this.discountPercent = discounts[code];
            this.updateOrderSummary();
            window.notifications.show(`Código ${code} aplicado: ${this.discountPercent}% de descuento`, 'success');
        } else {
            window.notifications.show('Código no válido', 'error');
        }
    }

    handleCardInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/.{1,4}/g).join(' ');
        }
        e.target.value = value;

        // Detectar tipo de tarjeta
        const cardIcon = document.getElementById('card-type-icon');
        const firstDigit = value.charAt(0);
        const firstTwoDigits = parseInt(value.substring(0, 2));

        if (firstDigit === '4') {
            cardIcon.className = 'fab fa-cc-visa ms-2 text-primary';
        } else if (firstTwoDigits >= 51 && firstTwoDigits <= 55) {
            cardIcon.className = 'fab fa-cc-mastercard ms-2 text-danger';
        } else if (firstDigit === '3' && (value.charAt(1) === '4' || value.charAt(1) === '7')) {
            cardIcon.className = 'fab fa-cc-amex ms-2 text-info';
        } else {
            cardIcon.className = 'fab fa-cc-credit-card ms-2 text-muted';
        }
    }

    handleExpiryInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORD-${timestamp}-${random}`;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const processingModal = new bootstrap.Modal(document.getElementById('processingModal'));
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        
        processingModal.show();

        try {
            // Simular procesamiento del pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generar y mostrar número de orden
            const orderNumber = this.generateOrderNumber();
            document.getElementById('orderNumber').textContent = orderNumber;

            // Limpiar carrito y datos de checkout
            sessionStorage.removeItem('checkout_items');
            sessionStorage.removeItem('checkout_total');

            processingModal.hide();
            successModal.show();
        } catch (error) {
            processingModal.hide();
            window.notifications.show('Error al procesar el pago', 'error');
        }
    }
}

// Inicializar checkout cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();
});
