// modals.js - Modal Windows Management

class ModalManager {
    constructor() {
        this.activeModals = [];
        this.modalZIndex = 2000;
    }

    // Open a modal
    openModal(modalId, options = {}) {
        // Close any existing modal with same ID
        this.closeModal(modalId);

        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID ${modalId} not found`);
            return null;
        }

        // Set z-index
        this.modalZIndex += 2;
        modal.style.zIndex = this.modalZIndex;

        // Set options
        if (options.width) {
            modal.querySelector('.modal-content').style.maxWidth = options.width;
        }

        if (options.title) {
            const titleElement = modal.querySelector('.modal-header h2');
            if (titleElement) {
                titleElement.textContent = options.title;
            }
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add to active modals
        this.activeModals.push({
            id: modalId,
            element: modal,
            zIndex: this.modalZIndex
        });

        // Focus on first input if any
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);

        return modal;
    }

    // Close a modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }

        // Remove from active modals
        this.activeModals = this.activeModals.filter(m => m.id !== modalId);

        // Restore body overflow if no modals left
        if (this.activeModals.length === 0) {
            document.body.style.overflow = '';
        }
    }

    // Close all modals
    closeAllModals() {
        this.activeModals.forEach(modal => {
            modal.element.classList.remove('active');
        });
        this.activeModals = [];
        document.body.style.overflow = '';
    }

    // Create a confirmation modal
    createConfirmModal(options) {
        const {
            title = 'Confirmation',
            message = 'Are you sure?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm,
            onCancel,
            type = 'warning' // 'warning', 'danger', 'info', 'success'
        } = options;

        const modalId = 'confirmModal_' + Date.now();
        
        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header" style="background: ${this.getModalHeaderColor(type)};">
                        <h2><i class="fas ${this.getModalIcon(type)}"></i> ${title}</h2>
                        <button class="modal-close" onclick="modalManager.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="text-align: center; padding: 1rem;">
                            <div style="font-size: 4rem; color: ${this.getModalIconColor(type)}; margin-bottom: 1rem;">
                                <i class="fas ${this.getModalIcon(type)}"></i>
                            </div>
                            <h3 style="margin-bottom: 1rem;">${title}</h3>
                            <p style="margin-bottom: 2rem; font-size: 1.1rem;">${message}</p>
                            <div style="display: flex; gap: 1rem; justify-content: center;">
                                <button class="btn ${this.getConfirmButtonClass(type)}" id="${modalId}_confirm">
                                    <i class="fas fa-check"></i> ${confirmText}
                                </button>
                                <button class="btn btn-outline" id="${modalId}_cancel">
                                    <i class="fas fa-times"></i> ${cancelText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);

        // Add event listeners
        const modal = document.getElementById(modalId);
        
        modal.querySelector(`#${modalId}_confirm`).addEventListener('click', () => {
            if (onConfirm) onConfirm();
            this.closeModal(modalId);
        });

        modal.querySelector(`#${modalId}_cancel`).addEventListener('click', () => {
            if (onCancel) onCancel();
            this.closeModal(modalId);
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (onCancel) onCancel();
                this.closeModal(modalId);
            }
        });

        // Open the modal
        this.openModal(modalId);

        return modalId;
    }

    // Create an alert modal
    createAlertModal(options) {
        const {
            title = 'Alert',
            message,
            type = 'info', // 'info', 'success', 'warning', 'error'
            buttonText = 'OK',
            onClose
        } = options;

        const modalId = 'alertModal_' + Date.now();
        
        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header" style="background: ${this.getModalHeaderColor(type)};">
                        <h2><i class="fas ${this.getModalIcon(type)}"></i> ${title}</h2>
                        <button class="modal-close" onclick="modalManager.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="text-align: center; padding: 1rem;">
                            <div style="font-size: 4rem; color: ${this.getModalIconColor(type)}; margin-bottom: 1rem;">
                                <i class="fas ${this.getModalIcon(type)}"></i>
                            </div>
                            <p style="margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.6;">${message}</p>
                            <button class="btn ${this.getAlertButtonClass(type)}" id="${modalId}_close">
                                <i class="fas fa-check"></i> ${buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);

        // Add event listener
        const modal = document.getElementById(modalId);
        
        modal.querySelector(`#${modalId}_close`).addEventListener('click', () => {
            if (onClose) onClose();
            this.closeModal(modalId);
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (onClose) onClose();
                this.closeModal(modalId);
            }
        });

        // Open the modal
        this.openModal(modalId);

        return modalId;
    }

    // Create a custom form modal
    createFormModal(options) {
        const {
            title = 'Form',
            formId,
            formHTML,
            onSubmit,
            submitText = 'Submit',
            cancelText = 'Cancel',
            onCancel
        } = options;

        const modalId = 'formModal_' + Date.now();
        
        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-edit"></i> ${title}</h2>
                        <button class="modal-close" onclick="modalManager.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="${formId}">
                            ${formHTML}
                            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                <button type="submit" class="btn btn-success">
                                    <i class="fas fa-check"></i> ${submitText}
                                </button>
                                <button type="button" class="btn btn-outline" id="${modalId}_cancel">
                                    <i class="fas fa-times"></i> ${cancelText}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);

        // Add event listeners
        const modal = document.getElementById(modalId);
        const form = document.getElementById(formId);
        
        if (form && onSubmit) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                onSubmit(new FormData(form));
                this.closeModal(modalId);
            });
        }

        modal.querySelector(`#${modalId}_cancel`).addEventListener('click', () => {
            if (onCancel) onCancel();
            this.closeModal(modalId);
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (onCancel) onCancel();
                this.closeModal(modalId);
            }
        });

        // Open the modal
        this.openModal(modalId);

        return modalId;
    }

    // Create a loading modal
    createLoadingModal(options = {}) {
        const {
            title = 'Loading',
            message = 'Please wait...',
            showProgress = false,
            progress = 0
        } = options;

        const modalId = 'loadingModal_' + Date.now();
        
        const progressHTML = showProgress ? `
            <div style="margin: 1.5rem 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Loading...</span>
                    <span id="${modalId}_progress">${progress}%</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" id="${modalId}_progressBar" style="width: ${progress}%"></div>
                </div>
            </div>
        ` : '';

        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-spinner fa-spin"></i> ${title}</h2>
                    </div>
                    <div class="modal-body">
                        <div style="text-align: center; padding: 2rem;">
                            <div class="loading-spinner" style="width: 60px; height: 60px; margin: 0 auto 1.5rem;"></div>
                            <h3 style="margin-bottom: 1rem;">${title}</h3>
                            <p style="margin-bottom: 1rem;">${message}</p>
                            ${progressHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);

        // Open the modal
        this.openModal(modalId);

        return {
            id: modalId,
            updateProgress: (newProgress) => {
                if (showProgress) {
                    const progressElement = document.getElementById(`${modalId}_progress`);
                    const progressBar = document.getElementById(`${modalId}_progressBar`);
                    if (progressElement) progressElement.textContent = `${newProgress}%`;
                    if (progressBar) progressBar.style.width = `${newProgress}%`;
                }
            },
            updateMessage: (newMessage) => {
                const messageElement = modal.querySelector('p');
                if (messageElement) messageElement.textContent = newMessage;
            }
        };
    }

    // Create item details modal
    createItemDetailsModal(item) {
        const modalId = 'itemDetails_' + Date.now();
        
        const statusColors = {
            'in-stock': '#27ae60',
            'low-stock': '#f39c12',
            'out-of-stock': '#e74c3c'
        };

        const statusText = {
            'in-stock': 'In Stock',
            'low-stock': 'Low Stock',
            'out-of-stock': 'Out of Stock'
        };

        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-box"></i> Item Details</h2>
                        <button class="modal-close" onclick="modalManager.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
                            <div style="text-align: center;">
                                <div style="font-size: 4rem; color: ${statusColors[item.status] || '#3498db'}; margin-bottom: 1rem;">
                                    <i class="fas fa-flask"></i>
                                </div>
                                <div class="status ${item.status}" style="font-size: 1rem; padding: 0.5rem 1rem;">
                                    ${statusText[item.status] || 'Unknown'}
                                </div>
                            </div>
                            <div>
                                <h3 style="margin-bottom: 1rem; color: #2c3e50;">${item.name}</h3>
                                
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                                    <div>
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Category</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${item.category}</p>
                                    </div>
                                    <div>
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Quantity</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${item.quantity} ${item.unit}</p>
                                    </div>
                                    <div>
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Minimum Stock</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${item.minStock}</p>
                                    </div>
                                    <div>
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Location</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${item.location || 'Not specified'}</p>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 1.5rem;">
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Supplier</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem;">${item.supplier || 'Not specified'}</p>
                                </div>
                                
                                ${item.barcode ? `
                                    <div style="margin-bottom: 1.5rem;">
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Barcode</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem; font-family: monospace;">${item.barcode}</p>
                                    </div>
                                ` : ''}
                                
                                ${item.expiryDate ? `
                                    <div style="margin-bottom: 1.5rem;">
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Expiry Date</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${new Date(item.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                ` : ''}
                                
                                <div style="margin-bottom: 1.5rem;">
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Last Restock</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem;">${new Date(item.lastRestock).toLocaleDateString()}</p>
                                </div>
                                
                                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                    <button class="btn btn-success" onclick="handleRestockItem(${item.id})">
                                        <i class="fas fa-arrow-up"></i> Restock
                                    </button>
                                    <button class="btn btn-primary" onclick="handleEditItem(${item.id})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn btn-danger" onclick="handleDeleteItem(${item.id})">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);

        // Open the modal
        this.openModal(modalId);

        return modalId;
    }

    // Create request details modal
    createRequestDetailsModal(request, inventory) {
        const modalId = 'requestDetails_' + Date.now();
        
        const item = inventory.find(i => i.id === request.itemId);
        const availableQuantity = item ? item.quantity : 0;
        
        const statusColors = {
            'pending': '#3498db',
            'approved': '#27ae60',
            'rejected': '#e74c3c'
        };

        const statusText = {
            'pending': 'Pending',
            'approved': 'Approved',
            'rejected': 'Rejected'
        };

        const urgencyColors = {
            'normal': '#3498db',
            'high': '#f39c12',
            'urgent': '#e74c3c'
        };

        const urgencyText = {
            'normal': 'Normal',
            'high': 'High',
            'urgent': 'Urgent'
        };

        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header" style="background: ${statusColors[request.status] || '#3498db'}">
                        <h2><i class="fas fa-hand-paper"></i> Request Details</h2>
                        <button class="modal-close" onclick="modalManager.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                                <h3 style="margin: 0; color: #2c3e50;">${request.item}</h3>
                                <div>
                                    <span class="status ${request.status}" style="margin-right: 0.5rem;">
                                        ${statusText[request.status] || 'Unknown'}
                                    </span>
                                    <span class="badge" style="background: ${urgencyColors[request.urgency]}; color: white;">
                                        ${urgencyText[request.urgency] || 'Normal'}
                                    </span>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Request ID</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem; font-family: monospace;">${request.id}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Request Date</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem;">${new Date(request.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Student Name</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem;">${request.student}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Student ID</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem;">${request.studentId}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Quantity Requested</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem;">${request.quantity}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Available Stock</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem; color: ${availableQuantity >= request.quantity ? '#27ae60' : '#e74c3c'}">
                                        ${availableQuantity} ${item ? item.unit : ''}
                                    </p>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 1.5rem;">
                                <strong style="color: #7f8c8d; font-size: 0.9rem;">Purpose</strong>
                                <p style="margin: 0.5rem 0; font-size: 1.1rem; line-height: 1.6; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                                    ${request.purpose}
                                </p>
                            </div>
                            
                            ${request.notes ? `
                                <div style="margin-bottom: 1.5rem;">
                                    <strong style="color: #7f8c8d; font-size: 0.9rem;">Notes</strong>
                                    <p style="margin: 0.5rem 0; font-size: 1.1rem; line-height: 1.6; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                                        ${request.notes}
                                    </p>
                                </div>
                            ` : ''}
                            
                            ${request.approvedBy ? `
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div>
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Approved By</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${request.approvedBy}</p>
                                    </div>
                                    <div>
                                        <strong style="color: #7f8c8d; font-size: 0.9rem;">Approval Date</strong>
                                        <p style="margin: 0.5rem 0; font-size: 1.1rem;">${new Date(request.approvedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${request.status === 'pending' ? `
                                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                    <button class="btn btn-success" onclick="handleApproveRequest('${request.id}')">
                                        <i class="fas fa-check"></i> Approve Request
                                    </button>
                                    <button class="btn btn-danger" onclick="handleRejectRequest('${request.id}')">
                                        <i class="fas fa-times"></i> Reject Request
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);

        // Open the modal
        this.openModal(modalId);

        return modalId;
    }

    // Helper methods for modal styling
    getModalHeaderColor(type) {
        const colors = {
            'success': 'linear-gradient(135deg, #27ae60 0%, #219653 100%)',
            'warning': 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)',
            'danger': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            'info': 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            'error': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
        };
        return colors[type] || colors.info;
    }

    getModalIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'danger': 'fa-exclamation-circle',
            'info': 'fa-info-circle',
            'error': 'fa-times-circle'
        };
        return icons[type] || icons.info;
    }

    getModalIconColor(type) {
        const colors = {
            'success': '#27ae60',
            'warning': '#f39c12',
            'danger': '#e74c3c',
            'info': '#3498db',
            'error': '#e74c3c'
        };
        return colors[type] || colors.info;
    }

    getConfirmButtonClass(type) {
        const classes = {
            'success': 'btn-success',
            'warning': 'btn-warning',
            'danger': 'btn-danger',
            'info': 'btn-primary',
            'error': 'btn-danger'
        };
        return classes[type] || classes.info;
    }

    getAlertButtonClass(type) {
        const classes = {
            'success': 'btn-success',
            'warning': 'btn-warning',
            'danger': 'btn-danger',
            'info': 'btn-primary',
            'error': 'btn-danger'
        };
        return classes[type] || classes.info;
    }
}

// Initialize global modal manager
const modalManager = new ModalManager();

// Global modal functions for use in other files
function openRequestModal() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const availableItems = inventory.filter(item => item.quantity > 0);
    
    const formHTML = `
        <div class="form-group">
            <label for="studentName">Student Name *</label>
            <input type="text" id="studentName" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="studentId">Student ID *</label>
            <input type="text" id="studentId" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="requestItem">Item Requested *</label>
            <select id="requestItem" class="form-control" required>
                <option value="">Select Item</option>
                ${availableItems.map(item => `
                    <option value="${item.id}" data-quantity="${item.quantity}" data-unit="${item.unit}">
                        ${item.name} (Available: ${item.quantity} ${item.unit})
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label for="requestQuantity">Quantity *</label>
            <input type="number" id="requestQuantity" class="form-control" min="1" required>
            <small id="availableStock" style="color: var(--gray); font-size: 0.8rem;"></small>
        </div>
        <div class="form-group">
            <label for="requestPurpose">Purpose *</label>
            <textarea id="requestPurpose" class="form-control" rows="3" required></textarea>
        </div>
        <div class="form-group">
            <label for="requestUrgency">Urgency</label>
            <select id="requestUrgency" class="form-control">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
            </select>
        </div>
    `;

    const modalId = modalManager.createFormModal({
        title: 'New Material Request',
        formId: 'requestForm',
        formHTML: formHTML,
        onSubmit: (formData) => {
            submitRequestFromModal(formData);
        },
        submitText: 'Submit Request',
        cancelText: 'Cancel'
    });

    // Add event listener for item selection
    setTimeout(() => {
        const itemSelect = document.getElementById('requestItem');
        const quantityInput = document.getElementById('requestQuantity');
        const availableStock = document.getElementById('availableStock');
        
        if (itemSelect) {
            itemSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    const maxQuantity = parseInt(selectedOption.getAttribute('data-quantity'));
                    const unit = selectedOption.getAttribute('data-unit');
                    quantityInput.max = maxQuantity;
                    availableStock.textContent = `Maximum available: ${maxQuantity} ${unit}`;
                    availableStock.style.color = maxQuantity < 10 ? 'var(--warning)' : 'var(--success)';
                } else {
                    availableStock.textContent = '';
                }
            });
        }
    }, 100);

    return modalId;
}

function openRestockModal() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    
    const formHTML = `
        <div class="form-group">
            <label for="restockItem">Select Item *</label>
            <select id="restockItem" class="form-control" required>
                <option value="">Select Item to Restock</option>
                ${inventory.map(item => `
                    <option value="${item.id}">
                        ${item.name} (Current: ${item.quantity} ${item.unit})
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label for="currentStock">Current Stock</label>
            <input type="text" id="currentStock" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="restockQuantity">Quantity to Add *</label>
            <input type="number" id="restockQuantity" class="form-control" min="1" required>
        </div>
        <div class="form-group">
            <label for="supplier">Supplier</label>
            <input type="text" id="supplier" class="form-control">
        </div>
        <div class="form-group">
            <label for="expiryDate">Expiry Date (if applicable)</label>
            <input type="date" id="expiryDate" class="form-control" min="${new Date().toISOString().split('T')[0]}">
        </div>
    `;

    const modalId = modalManager.createFormModal({
        title: 'Restock Item',
        formId: 'restockForm',
        formHTML: formHTML,
        onSubmit: (formData) => {
            submitRestockFromModal(formData);
        },
        submitText: 'Update Stock',
        cancelText: 'Cancel'
    });

    // Add event listener for item selection
    setTimeout(() => {
        const itemSelect = document.getElementById('restockItem');
        const currentStockInput = document.getElementById('currentStock');
        
        if (itemSelect) {
            itemSelect.addEventListener('change', function() {
                const selectedId = parseInt(this.value);
                if (selectedId) {
                    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
                    const selectedItem = inventory.find(item => item.id === selectedId);
                    if (selectedItem) {
                        currentStockInput.value = `${selectedItem.quantity} ${selectedItem.unit}`;
                    }
                } else {
                    currentStockInput.value = '';
                }
            });
        }
    }, 100);

    return modalId;
}

function openAddItemModal() {
    const formHTML = `
        <div class="form-group">
            <label for="itemName">Item Name *</label>
            <input type="text" id="itemName" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="itemCategory">Category *</label>
            <select id="itemCategory" class="form-control" required>
                <option value="">Select Category</option>
                <option value="Culture Media">Culture Media</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Labware">Labware</option>
                <option value="Consumables">Consumables</option>
                <option value="Reagents">Reagents</option>
                <option value="Equipment">Equipment</option>
                <option value="Safety">Safety Equipment</option>
            </select>
        </div>
        <div class="form-group">
            <label for="itemQuantity">Initial Quantity *</label>
            <input type="number" id="itemQuantity" class="form-control" min="0" required>
        </div>
        <div class="form-group">
            <label for="itemUnit">Unit *</label>
            <select id="itemUnit" class="form-control" required>
                <option value="">Select Unit</option>
                <option value="g">Grams (g)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="L">Liters (L)</option>
                <option value="mL">Milliliters (mL)</option>
                <option value="pairs">Pairs</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
                <option value="vial">Vial</option>
                <option value="tube">Tube</option>
                <option value="unit">Unit</option>
            </select>
        </div>
        <div class="form-group">
            <label for="itemMinStock">Minimum Stock Level *</label>
            <input type="number" id="itemMinStock" class="form-control" min="1" required>
        </div>
        <div class="form-group">
            <label for="itemLocation">Storage Location</label>
            <input type="text" id="itemLocation" class="form-control" placeholder="e.g., Shelf A1, Cabinet B2">
        </div>
        <div class="form-group">
            <label for="itemSupplier">Supplier</label>
            <input type="text" id="itemSupplier" class="form-control">
        </div>
        <div class="form-group">
            <label for="itemBarcode">Barcode/ID</label>
            <input type="text" id="itemBarcode" class="form-control">
        </div>
        <div class="form-group">
            <label for="itemExpiry">Expiry Date</label>
            <input type="date" id="itemExpiry" class="form-control" min="${new Date().toISOString().split('T')[0]}">
        </div>
    `;

    return modalManager.createFormModal({
        title: 'Add New Item',
        formId: 'addItemForm',
        formHTML: formHTML,
        onSubmit: (formData) => {
            submitAddItemFromModal(formData);
        },
        submitText: 'Add Item',
        cancelText: 'Cancel'
    });
}

function openEditItemModal(itemId) {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const item = inventory.find(i => i.id === itemId);
    
    if (!item) {
        modalManager.createAlertModal({
            title: 'Error',
            message: 'Item not found!',
            type: 'error'
        });
        return;
    }

    const formHTML = `
        <div class="form-group">
            <label for="editItemName">Item Name *</label>
            <input type="text" id="editItemName" class="form-control" value="${item.name}" required>
        </div>
        <div class="form-group">
            <label for="editItemCategory">Category *</label>
            <select id="editItemCategory" class="form-control" required>
                <option value="">Select Category</option>
                <option value="Culture Media" ${item.category === 'Culture Media' ? 'selected' : ''}>Culture Media</option>
                <option value="Chemicals" ${item.category === 'Chemicals' ? 'selected' : ''}>Chemicals</option>
                <option value="Labware" ${item.category === 'Labware' ? 'selected' : ''}>Labware</option>
                <option value="Consumables" ${item.category === 'Consumables' ? 'selected' : ''}>Consumables</option>
                <option value="Reagents" ${item.category === 'Reagents' ? 'selected' : ''}>Reagents</option>
                <option value="Equipment" ${item.category === 'Equipment' ? 'selected' : ''}>Equipment</option>
                <option value="Safety" ${item.category === 'Safety' ? 'selected' : ''}>Safety Equipment</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editItemQuantity">Current Quantity *</label>
            <input type="number" id="editItemQuantity" class="form-control" value="${item.quantity}" min="0" required>
        </div>
        <div class="form-group">
            <label for="editItemUnit">Unit *</label>
            <select id="editItemUnit" class="form-control" required>
                <option value="">Select Unit</option>
                <option value="g" ${item.unit === 'g' ? 'selected' : ''}>Grams (g)</option>
                <option value="mg" ${item.unit === 'mg' ? 'selected' : ''}>Milligrams (mg)</option>
                <option value="L" ${item.unit === 'L' ? 'selected' : ''}>Liters (L)</option>
                <option value="mL" ${item.unit === 'mL' ? 'selected' : ''}>Milliliters (mL)</option>
                <option value="pairs" ${item.unit === 'pairs' ? 'selected' : ''}>Pairs</option>
                <option value="box" ${item.unit === 'box' ? 'selected' : ''}>Box</option>
                <option value="pack" ${item.unit === 'pack' ? 'selected' : ''}>Pack</option>
                <option value="vial" ${item.unit === 'vial' ? 'selected' : ''}>Vial</option>
                <option value="tube" ${item.unit === 'tube' ? 'selected' : ''}>Tube</option>
                <option value="unit" ${item.unit === 'unit' ? 'selected' : ''}>Unit</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editItemMinStock">Minimum Stock Level *</label>
            <input type="number" id="editItemMinStock" class="form-control" value="${item.minStock}" min="1" required>
        </div>
        <div class="form-group">
            <label for="editItemLocation">Storage Location</label>
            <input type="text" id="editItemLocation" class="form-control" value="${item.location || ''}" placeholder="e.g., Shelf A1, Cabinet B2">
        </div>
        <div class="form-group">
            <label for="editItemSupplier">Supplier</label>
            <input type="text" id="editItemSupplier" class="form-control" value="${item.supplier || ''}">
        </div>
        <div class="form-group">
            <label for="editItemBarcode">Barcode/ID</label>
            <input type="text" id="editItemBarcode" class="form-control" value="${item.barcode || ''}">
        </div>
        <div class="form-group">
            <label for="editItemExpiry">Expiry Date</label>
            <input type="date" id="editItemExpiry" class="form-control" value="${item.expiryDate || ''}" min="${new Date().toISOString().split('T')[0]}">
        </div>
    `;

    return modalManager.createFormModal({
        title: 'Edit Item',
        formId: 'editItemForm',
        formHTML: formHTML,
        onSubmit: (formData) => {
            submitEditItemFromModal(itemId, formData);
        },
        submitText: 'Save Changes',
        cancelText: 'Cancel'
    });
}

function openRestockItemModal(itemId) {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const item = inventory.find(i => i.id === itemId);
    
    if (!item) {
        modalManager.createAlertModal({
            title: 'Error',
            message: 'Item not found!',
            type: 'error'
        });
        return;
    }

    const formHTML = `
        <div class="form-group">
            <label for="restockSpecificItem">Item</label>
            <input type="text" id="restockSpecificItem" class="form-control" value="${item.name}" readonly>
        </div>
        <div class="form-group">
            <label for="restockSpecificCurrent">Current Stock</label>
            <input type="text" id="restockSpecificCurrent" class="form-control" value="${item.quantity} ${item.unit}" readonly>
        </div>
        <div class="form-group">
            <label for="restockSpecificQuantity">Quantity to Add *</label>
            <input type="number" id="restockSpecificQuantity" class="form-control" min="1" required>
        </div>
        <div class="form-group">
            <label for="restockSpecificSupplier">Supplier</label>
            <input type="text" id="restockSpecificSupplier" class="form-control" value="${item.supplier || ''}">
        </div>
        <div class="form-group">
            <label for="restockSpecificExpiry">Expiry Date (if applicable)</label>
            <input type="date" id="restockSpecificExpiry" class="form-control" min="${new Date().toISOString().split('T')[0]}">
        </div>
    `;

    return modalManager.createFormModal({
        title: 'Restock Item',
        formId: 'restockSpecificForm',
        formHTML: formHTML,
        onSubmit: (formData) => {
            submitRestockItemFromModal(itemId, formData);
        },
        submitText: 'Update Stock',
        cancelText: 'Cancel'
    });
}

// Form submission handlers
function submitRequestFromModal(formData) {
    const studentName = document.getElementById('studentName').value;
    const studentId = document.getElementById('studentId').value;
    const itemId = parseInt(document.getElementById('requestItem').value);
    const quantity = parseInt(document.getElementById('requestQuantity').value);
    const purpose = document.getElementById('requestPurpose').value;
    const urgency = document.getElementById('requestUrgency').value;

    // Get selected item
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const selectedItem = inventory.find(item => item.id === itemId);

    if (!selectedItem) {
        showNotification('Please select a valid item', 'error');
        return;
    }

    if (quantity > selectedItem.quantity) {
        showNotification(`Cannot request more than available stock (${selectedItem.quantity} ${selectedItem.unit})`, 'error');
        return;
    }

    // Create new request
    const newRequest = {
        id: `REQ${Date.now().toString().slice(-6)}`,
        student: studentName,
        studentId: studentId,
        item: selectedItem.name,
        itemId: itemId,
        quantity: quantity,
        date: new Date().toISOString().split('T')[0],
        purpose: purpose,
        status: 'pending',
        urgency: urgency,
        requestedBy: studentName,
        requestedDate: new Date().toISOString(),
        approvedBy: null,
        approvedDate: null,
        notes: ''
    };

    // Add to request manager if available
    if (window.requestManager) {
        window.requestManager.addRequest(newRequest);
    } else {
        // Fallback to sample data
        sampleRequests.push(newRequest);
    }

    // Show success message
    showNotification(`Request submitted successfully for ${selectedItem.name}`, 'success');

    // Refresh requests view if we're on requests tab
    if (AppState && AppState.currentTab === 'requests') {
        renderRequests();
    } else if (AppState && AppState.currentTab === 'dashboard') {
        renderDashboard();
    }

    // Generate notifications
    if (typeof generateNotifications === 'function') {
        generateNotifications();
    }

    // Save data
    if (typeof saveAppData === 'function') {
        saveAppData();
    }
}

function submitRestockFromModal(formData) {
    const itemId = parseInt(document.getElementById('restockItem').value);
    const quantity = parseInt(document.getElementById('restockQuantity').value);
    const supplier = document.getElementById('supplier').value;
    const expiryDate = document.getElementById('expiryDate').value;

    if (!itemId || !quantity) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Get item from inventory
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const itemIndex = inventory.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        showNotification('Item not found', 'error');
        return;
    }

    // Update item quantity
    const oldQuantity = inventory[itemIndex].quantity;
    const newQuantity = oldQuantity + quantity;

    // Update item
    inventory[itemIndex].quantity = newQuantity;
    inventory[itemIndex].lastRestock = new Date().toISOString().split('T')[0];

    if (supplier) {
        inventory[itemIndex].supplier = supplier;
    }

    if (expiryDate) {
        inventory[itemIndex].expiryDate = expiryDate;
    }

    // Update status based on new quantity
    if (newQuantity === 0) {
        inventory[itemIndex].status = 'out-of-stock';
    } else if (newQuantity <= inventory[itemIndex].minStock) {
        inventory[itemIndex].status = 'low-stock';
    } else {
        inventory[itemIndex].status = 'in-stock';
    }

    // Update inventory manager if available
    if (window.inventoryManager) {
        window.inventoryManager.updateItem(itemId, inventory[itemIndex]);
    }

    // Show success message
    showNotification(`${inventory[itemIndex].name} restocked successfully. New quantity: ${newQuantity} ${inventory[itemIndex].unit}`, 'success');

    // Refresh inventory view
    if (AppState && AppState.currentTab === 'inventory') {
        renderInventory();
    } else if (AppState && AppState.currentTab === 'dashboard') {
        renderDashboard();
    }

    // Generate notifications
    if (typeof generateNotifications === 'function') {
        generateNotifications();
    }

    // Save data
    if (typeof saveAppData === 'function') {
        saveAppData();
    }
}

function submitAddItemFromModal(formData) {
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const unit = document.getElementById('itemUnit').value;
    const minStock = parseInt(document.getElementById('itemMinStock').value);
    const location = document.getElementById('itemLocation').value;
    const supplier = document.getElementById('itemSupplier').value;
    const barcode = document.getElementById('itemBarcode').value;
    const expiry = document.getElementById('itemExpiry').value;

    // Determine status based on quantity
    let status = 'in-stock';
    if (quantity === 0) {
        status = 'out-of-stock';
    } else if (quantity <= minStock) {
        status = 'low-stock';
    }

    // Create new item
    const newItem = {
        id: Date.now(),
        name,
        category,
        quantity,
        unit,
        minStock,
        status,
        location,
        supplier,
        barcode,
        expiryDate: expiry || null,
        lastRestock: new Date().toISOString().split('T')[0],
        price: 0,
        createdAt: new Date().toISOString()
    };

    // Add to inventory manager if available
    if (window.inventoryManager) {
        window.inventoryManager.addItem(newItem);
    } else {
        // Fallback to sample data
        sampleInventory.push(newItem);
    }

    // Show success message
    showNotification(`"${name}" added to inventory successfully`, 'success');

    // Refresh inventory view if we're on inventory tab
    if (AppState && AppState.currentTab === 'inventory') {
        renderInventory();
    } else if (AppState && AppState.currentTab === 'dashboard') {
        renderDashboard();
    }

    // Generate notifications
    if (typeof generateNotifications === 'function') {
        generateNotifications();
    }

    // Save data
    if (typeof saveAppData === 'function') {
        saveAppData();
    }
}

function submitEditItemFromModal(itemId, formData) {
    const name = document.getElementById('editItemName').value;
    const category = document.getElementById('editItemCategory').value;
    const quantity = parseInt(document.getElementById('editItemQuantity').value);
    const unit = document.getElementById('editItemUnit').value;
    const minStock = parseInt(document.getElementById('editItemMinStock').value);
    const location = document.getElementById('editItemLocation').value;
    const supplier = document.getElementById('editItemSupplier').value;
    const barcode = document.getElementById('editItemBarcode').value;
    const expiry = document.getElementById('editItemExpiry').value;

    // Determine status based on quantity
    let status = 'in-stock';
    if (quantity === 0) {
        status = 'out-of-stock';
    } else if (quantity <= minStock) {
        status = 'low-stock';
    }

    // Update item
    const updatedItem = {
        name,
        category,
        quantity,
        unit,
        minStock,
        status,
        location,
        supplier,
        barcode,
        expiryDate: expiry || null
    };

    // Update inventory manager if available
    if (window.inventoryManager) {
        window.inventoryManager.updateItem(itemId, updatedItem);
    } else {
        // Fallback to sample data
        const inventory = sampleInventory;
        const itemIndex = inventory.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            inventory[itemIndex] = { ...inventory[itemIndex], ...updatedItem };
        }
    }

    // Show success message
    showNotification(`"${name}" updated successfully`, 'success');

    // Refresh inventory view if we're on inventory tab
    if (AppState && AppState.currentTab === 'inventory') {
        renderInventory();
    } else if (AppState && AppState.currentTab === 'dashboard') {
        renderDashboard();
    }

    // Generate notifications
    if (typeof generateNotifications === 'function') {
        generateNotifications();
    }

    // Save data
    if (typeof saveAppData === 'function') {
        saveAppData();
    }
}

function submitRestockItemFromModal(itemId, formData) {
    const quantity = parseInt(document.getElementById('restockSpecificQuantity').value);
    const supplier = document.getElementById('restockSpecificSupplier').value;
    const expiryDate = document.getElementById('restockSpecificExpiry').value;

    if (!quantity) {
        showNotification('Please enter quantity to add', 'error');
        return;
    }

    // Get item from inventory
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const itemIndex = inventory.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        showNotification('Item not found', 'error');
        return;
    }

    // Update item quantity
    const oldQuantity = inventory[itemIndex].quantity;
    const newQuantity = oldQuantity + quantity;

    // Update item
    inventory[itemIndex].quantity = newQuantity;
    inventory[itemIndex].lastRestock = new Date().toISOString().split('T')[0];

    if (supplier) {
        inventory[itemIndex].supplier = supplier;
    }

    if (expiryDate) {
        inventory[itemIndex].expiryDate = expiryDate;
    }

    // Update status based on new quantity
    if (newQuantity === 0) {
        inventory[itemIndex].status = 'out-of-stock';
    } else if (newQuantity <= inventory[itemIndex].minStock) {
        inventory[itemIndex].status = 'low-stock';
    } else {
        inventory[itemIndex].status = 'in-stock';
    }

    // Update inventory manager if available
    if (window.inventoryManager) {
        window.inventoryManager.updateItem(itemId, inventory[itemIndex]);
    }

    // Show success message
    showNotification(`${inventory[itemIndex].name} restocked successfully. New quantity: ${newQuantity} ${inventory[itemIndex].unit}`, 'success');

    // Refresh inventory view
    if (AppState && AppState.currentTab === 'inventory') {
        renderInventory();
    } else if (AppState && AppState.currentTab === 'dashboard') {
        renderDashboard();
    }

    // Generate notifications
    if (typeof generateNotifications === 'function') {
        generateNotifications();
    }

    // Save data
    if (typeof saveAppData === 'function') {
        saveAppData();
    }
}

// Export modal manager for global use
window.modalManager = modalManager;
window.openRequestModal = openRequestModal;
window.openRestockModal = openRestockModal;
window.openAddItemModal = openAddItemModal;
window.openEditItemModal = openEditItemModal;
window.openRestockItemModal = openRestockItemModal;