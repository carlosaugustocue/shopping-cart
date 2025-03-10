class Checkout {
    constructor() {
        this.cart = window.cart;
        this.discountApplied = 0;
        this.promoCode = '';
        this.promoCodes = {
            'BIENVENIDO': 10,
            'DESCUENTO20': 20,
            'PRIMAVERA': 15
        };
        this.validCards = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/
        };
        this.initializeCheckout();
        this.setupEventListeners();
    }

    initializeCheckout() {
        this.updateOrderSummary();
        this.setupCardValidation();
    }

    updateOrderSummary() {
        const items = this.cart.items;
        const checkoutItems = document.getElementById('checkout-items');
        const cartCount = document.getElementById('cart-count');
        const subtotal = this.cart.getTotal();
        const discount = (subtotal * this.discountApplied) / 100;
        const total = subtotal - discount;

        if (checkoutItems && items.length > 0) {
            checkoutItems.innerHTML = items.map(item => `
                <div class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Cantidad: ${item.quantity}</small>
                    </div>
                    <span class="text-muted">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');

            // Agregar subtotal, descuento y total
            checkoutItems.innerHTML += `
                <div class="list-group-item d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>$${subtotal.toFixed(2)}</strong>
                </div>
                ${this.discountApplied > 0 ? `
                <div class="list-group-item d-flex justify-content-between text-success">
                    <span>Descuento (${this.discountApplied}%)</span>
                    <strong>-$${discount.toFixed(2)}</strong>
                </div>` : ''}
                <div class="list-group-item d-flex justify-content-between">
                    <span>Total</span>
                    <strong>$${total.toFixed(2)}</strong>
                </div>
            `;
        }

        if (cartCount) {
            cartCount.textContent = items.reduce((total, item) => total + item.quantity, 0);
        }
    }

    setupCardValidation() {
        const cardInput = document.getElementById('card-number');
        const cardTypeIcon = document.getElementById('card-type-icon');
        const expiryInput = document.getElementById('expiry-date');
        
        if (cardInput) {
            cardInput.addEventListener('input', (e) => {
                const number = e.target.value.replace(/\s/g, '');
                let cardType = this.getCardType(number);
                
                if (cardTypeIcon) {
                    cardTypeIcon.className = 'fab fa-cc-' + (cardType || 'credit-card');
                    cardTypeIcon.style.color = cardType ? '#1a1f71' : '#6c757d';
                }
                
                // Formatear número de tarjeta
                let formatted = number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
                e.target.value = formatted.trim();
            });
        }

        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }
    }

    getCardType(number) {
        if (this.validCards.visa.test(number)) return 'visa';
        if (this.validCards.mastercard.test(number)) return 'mastercard';
        if (this.validCards.amex.test(number)) return 'amex';
        return null;
    }

    validateCard(number) {
        // Algoritmo de Luhn
        let sum = 0;
        let isEven = false;
        
        // Eliminar espacios y revertir
        number = number.replace(/\s/g, '');
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number[i], 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return (sum % 10) === 0;
    }

    validateExpiryDate(month, year) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        year = parseInt(year);
        month = parseInt(month);
        
        return year > currentYear || (year === currentYear && month >= currentMonth);
    }

    applyPromoCode(code) {
        if (this.promoCodes[code]) {
            this.discountApplied = this.promoCodes[code];
            this.promoCode = code;
            this.updateOrderSummary();
            return true;
        }
        return false;
    }

    setupEventListeners() {
        const form = document.getElementById('checkout-form');
        const promoForm = document.getElementById('promo-form');
        const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (promoForm) {
            promoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('promo-code');
                if (codeInput) {
                    const code = codeInput.value.toUpperCase();
                    if (this.applyPromoCode(code)) {
                        alert('¡Código de descuento aplicado!');
                        codeInput.value = '';
                    } else {
                        alert('Código de descuento inválido');
                    }
                }
            });
        }

        paymentMethodInputs.forEach(input => {
            input.addEventListener('change', (e) => this.togglePaymentForm(e));
        });
    }

    togglePaymentForm(e) {
        const creditCardForm = document.querySelector('.credit-card-form');
        if (creditCardForm) {
            creditCardForm.style.display = e.target.value === 'credit' ? 'block' : 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validar tarjeta
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiry-date').value.split('/');
        
        if (!this.validateCard(cardNumber)) {
            alert('Número de tarjeta inválido');
            return;
        }

        if (!this.validateExpiryDate(expiryDate[0], expiryDate[1])) {
            alert('Fecha de expiración inválida');
            return;
        }

        // Mostrar modal de procesamiento
        const processingModal = new bootstrap.Modal(document.getElementById('processingModal'));
        processingModal.show();

        try {
            await this.simulatePayment();
            const orderNumber = this.generateOrderNumber();
            processingModal.hide();

            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            document.getElementById('orderNumber').textContent = orderNumber;
            successModal.show();

            this.cart.items = [];
            this.cart.saveCart();

        } catch (error) {
            console.error('Error en el proceso de pago:', error);
            alert('Hubo un error al procesar el pago. Por favor, intenta nuevamente.');
            processingModal.hide();
        }
    }

    simulatePayment() {
        return new Promise((resolve) => {
            setTimeout(resolve, 4000);
        });
    }

    generateOrderNumber() {
        return 'ORD-' + Date.now().toString(36).toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();
});
