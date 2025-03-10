class NotificationSystem {
    constructor() {
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const bgClass = this.getBackgroundClass(type);
        const iconClass = this.getIconClass(type);

        const toastHtml = `
            <div class="toast ${bgClass}" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <i class="${iconClass} me-2"></i>
                    <strong class="me-auto">${this.getTitle(type)}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        toast.show();

        // Eliminar el toast del DOM después de ocultarse
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    getBackgroundClass(type) {
        const classes = {
            success: 'bg-success text-white',
            error: 'bg-danger text-white',
            warning: 'bg-warning',
            info: 'bg-info text-white'
        };
        return classes[type] || classes.info;
    }

    getIconClass(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: '¡Éxito!',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }
}

// Inicializar el sistema de notificaciones
document.addEventListener('DOMContentLoaded', () => {
    window.notifications = new NotificationSystem();
});
