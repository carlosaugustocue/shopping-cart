class Wishlist {
    constructor() {
        this.items = this.loadWishlist();
        this.updateWishlistCount();
    }

    loadWishlist() {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
        this.updateWishlistCount();
    }

    addItem(product) {
        if (!this.items.some(item => item.id === product.id)) {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
            this.saveWishlist();
            this.updateWishlistModal();
            return true;
        }
        return false;
    }

    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveWishlist();
            this.updateWishlistModal();
        }
    }

    moveToCart(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && window.cart) {
            window.cart.addItem(item);
            this.removeItem(productId);
            window.notifications.show('Producto movido al carrito', 'success');
        }
    }

    updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.items.length;
        }
    }

    updateWishlistModal() {
        const wishlistItems = document.getElementById('wishlist-items');
        if (!wishlistItems) return;

        if (this.items.length === 0) {
            wishlistItems.innerHTML = '<p class="text-center p-3">Tu lista de deseos está vacía</p>';
            return;
        }

        wishlistItems.innerHTML = `
            ${this.items.map(item => `
                <div class="wishlist-item d-flex align-items-center p-2 border-bottom">
                    <img src="${item.image}" alt="${item.name}" class="wishlist-item-img me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="mb-0 text-muted">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-primary" onclick="wishlist.moveToCart('${item.id}')">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="wishlist.removeItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }
}

// Inicializar lista de deseos
document.addEventListener('DOMContentLoaded', () => {
    window.wishlist = new Wishlist();

    // Event listener para botones de agregar a la lista de deseos
    document.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-wishlist, .add-to-wishlist *')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.productId,
                    name: productCard.querySelector('.product-title').textContent,
                    price: parseFloat(productCard.dataset.price),
                    image: productCard.querySelector('img').src
                };
                if (wishlist.addItem(product)) {
                    window.notifications.show('Producto agregado a la lista de deseos', 'success');
                } else {
                    window.notifications.show('Este producto ya está en tu lista de deseos', 'info');
                }
            }
        }
    });

    // Event listener para el modal de la lista de deseos
    const wishlistModal = document.getElementById('wishlistModal');
    if (wishlistModal) {
        wishlistModal.addEventListener('show.bs.modal', () => {
            wishlist.updateWishlistModal();
        });
    }
});
