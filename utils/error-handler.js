
class ErrorHandler {
    constructor() {
        this.errorContainer = null;
    }

    
    showError(message, container) {
        this.clearError(container);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dice-error-message';
        errorDiv.textContent = message;
        
        container.appendChild(errorDiv);
        this.errorContainer = errorDiv;
        
        
        setTimeout(() => {
            this.clearError(container);
        }, 5000);
    }

    
    clearError(container) {
        if (this.errorContainer && this.errorContainer.parentNode === container) {
            container.removeChild(this.errorContainer);
            this.errorContainer = null;
        }
        
        
        const existingErrors = container.querySelectorAll('.dice-error-message');
        existingErrors.forEach(error => error.remove());
    }

    
    handleValidationError(input, parser, container) {
        const errorMessage = parser.getErrorMessage(input);
        this.showError(errorMessage, container);
    }

    
    handleRuntimeError(error, container) {
        console.error('Dice Roller Error:', error);
        
        let userMessage = 'Ocorreu um erro inesperado. Tente novamente.';
        
        
        if (error.message.includes('WebGL')) {
            userMessage = 'Erro na animação 3D. Usando modo simples.';
        } else if (error.message.includes('DOM')) {
            userMessage = 'Erro ao acessar a interface. Recarregue a página.';
        } else if (error.message.includes('random')) {
            userMessage = 'Erro na geração de números. Usando método alternativo.';
        }
        
        this.showError(userMessage, container);
    }

    
    handleResourceError(resource, container) {
        const message = `Erro ao carregar ${resource}. Algumas funcionalidades podem não funcionar.`;
        this.showError(message, container);
    }

    
    showWarning(message, container) {
        this.clearError(container);
        
        const warningDiv = document.createElement('div');
        warningDiv.className = 'dice-warning-message';
        warningDiv.textContent = message;
        
        container.appendChild(warningDiv);
        
        
        setTimeout(() => {
            if (warningDiv.parentNode === container) {
                container.removeChild(warningDiv);
            }
        }, 3000);
    }
}


if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
}