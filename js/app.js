// Funções utilitárias gerais
class AppUtils {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEvents();
        this.initTooltips();
    }

    // Formatação de dados
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    formatDateTime(dateString, timeString) {
        if (!dateString) return '-';
        const date = new Date(dateString + ' ' + (timeString || ''));
        return date.toLocaleString('pt-BR');
    }

    formatCPF(cpf) {
        if (!cpf) return '-';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formatPhone(phone) {
        if (!phone) return '-';
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Validações
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        
        // Validação simples de CPF
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        return true;
    }

    // Notificações
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Posicionar a notificação
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '10000';
        notification.style.minWidth = '300px';
        notification.style.maxWidth = '500px';
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Loading states
    showLoading(element) {
        element.disabled = true;
        element.innerHTML = '<div class="loading"></div> Carregando...';
    }

    hideLoading(element, originalText) {
        element.disabled = false;
        element.innerHTML = originalText;
    }

    // Modal functions
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // LocalStorage helpers
    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return defaultValue;
        }
    }

    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    // Event listeners globais
    setupGlobalEvents() {
        // Fechar modal ao clicar fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });

        // Tooltips
        document.addEventListener('mouseover', (e) => {
            if (e.target.hasAttribute('data-tooltip')) {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.hasAttribute('data-tooltip')) {
                this.hideTooltip();
            }
        });
    }

    // Tooltips simples
    initTooltips() {
        // Estilo do tooltip
        const style = document.createElement('style');
        style.textContent = `
            .tooltip {
                position: absolute;
                background: var(--dark);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.8rem;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
    }

    showTooltip(element, text) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';
        
        element._tooltip = tooltip;
    }

    hideTooltip() {
        const existingTooltip = document.querySelector('.tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    // Exportar dados
    exportToCSV(data, filename) {
        if (!data || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Busca em tempo real
    setupSearch(inputId, tableId, searchColumns) {
        const searchInput = document.getElementById(inputId);
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll(`#${tableId} tr`);
            
            rows.forEach(row => {
                let found = false;
                searchColumns.forEach(colIndex => {
                    const cell = row.cells[colIndex];
                    if (cell && cell.textContent.toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });
                row.style.display = found ? '' : 'none';
            });
        });
    }
}

// Inicializar utilitários
const appUtils = new AppUtils();

// Funções globais para uso fácil
function showSuccess(message) {
    appUtils.showNotification(message, 'success');
}

function showError(message) {
    appUtils.showNotification(message, 'error');
}

function showWarning(message) {
    appUtils.showNotification(message, 'warning');
}

function formatDate(dateString) {
    return appUtils.formatDate(dateString);
}

function formatCPF(cpf) {
    return appUtils.formatCPF(cpf);
}