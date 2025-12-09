// requests.js - Request Management System

class RequestManager {
    constructor() {
        this.requests = [];
        this.statuses = ['pending', 'approved', 'rejected'];
        this.urgencyLevels = ['normal', 'high', 'urgent'];
    }

    // Add a new request
    addRequest(request) {
        const newRequest = {
            ...request,
            id: this.generateRequestId(),
            status: 'pending',
            requestedDate: new Date().toISOString(),
            approvedBy: null,
            approvedDate: null,
            notes: ''
        };
        
        this.requests.push(newRequest);
        this.saveToLocalStorage();
        return newRequest;
    }

    // Update a request
    updateRequest(requestId, updates) {
        const index = this.requests.findIndex(req => req.id === requestId);
        if (index !== -1) {
            this.requests[index] = { ...this.requests[index], ...updates };
            this.saveToLocalStorage();
            return this.requests[index];
        }
        return null;
    }

    // Delete a request
    deleteRequest(requestId) {
        this.requests = this.requests.filter(req => req.id !== requestId);
        this.saveToLocalStorage();
    }

    // Get a request by ID
    getRequest(requestId) {
        return this.requests.find(req => req.id === requestId);
    }

    // Get all requests
    getAllRequests() {
        return this.requests;
    }

    // Get requests by status
    getRequestsByStatus(status) {
        return this.requests.filter(req => req.status === status);
    }

    // Get requests by student
    getRequestsByStudent(studentId) {
        return this.requests.filter(req => req.studentId === studentId);
    }

    // Get requests by item
    getRequestsByItem(itemId) {
        return this.requests.filter(req => req.itemId === itemId);
    }

    // Get pending requests
    getPendingRequests() {
        return this.getRequestsByStatus('pending');
    }

    // Get approved requests
    getApprovedRequests() {
        return this.getRequestsByStatus('approved');
    }

    // Get rejected requests
    getRejectedRequests() {
        return this.getRequestsByStatus('rejected');
    }

    // Get urgent requests
    getUrgentRequests() {
        return this.requests.filter(req => req.urgency === 'urgent');
    }

    // Get high priority requests
    getHighPriorityRequests() {
        return this.requests.filter(req => req.urgency === 'high');
    }

    // Approve a request
    approveRequest(requestId, approvedBy, notes = '') {
        const request = this.getRequest(requestId);
        if (!request) return null;

        // Check if item is available in inventory
        const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
        const item = inventory.find(i => i.id === request.itemId);
        
        if (!item) {
            throw new Error('Requested item not found in inventory');
        }

        if (item.quantity < request.quantity) {
            throw new Error(`Insufficient stock. Available: ${item.quantity} ${item.unit}, Requested: ${request.quantity}`);
        }

        // Update request status
        const updatedRequest = this.updateRequest(requestId, {
            status: 'approved',
            approvedBy: approvedBy,
            approvedDate: new Date().toISOString(),
            notes: notes
        });

        // Create issue log entry
        if (updatedRequest && window.issueManager) {
            const issue = window.issueManager.createIssueFromRequest(updatedRequest);
            if (issue) {
                // Deduct from inventory
                if (window.inventoryManager) {
                    window.inventoryManager.updateItemQuantity(request.itemId, -request.quantity);
                } else {
                    // Fallback: update sample inventory
                    const itemIndex = inventory.findIndex(i => i.id === request.itemId);
                    if (itemIndex !== -1) {
                        inventory[itemIndex].quantity -= request.quantity;
                        
                        // Update status if needed
                        if (inventory[itemIndex].quantity === 0) {
                            inventory[itemIndex].status = 'out-of-stock';
                        } else if (inventory[itemIndex].quantity <= inventory[itemIndex].minStock) {
                            inventory[itemIndex].status = 'low-stock';
                        }
                    }
                }
            }
        }

        return updatedRequest;
    }

    // Reject a request
    rejectRequest(requestId, rejectedBy, notes = '') {
        return this.updateRequest(requestId, {
            status: 'rejected',
            approvedBy: rejectedBy,
            approvedDate: new Date().toISOString(),
            notes: notes
        });
    }

    // Bulk approve requests
    bulkApproveRequests(requestIds, approvedBy) {
        const results = [];
        requestIds.forEach(requestId => {
            try {
                const result = this.approveRequest(requestId, approvedBy);
                results.push({ requestId, success: true, result });
            } catch (error) {
                results.push({ requestId, success: false, error: error.message });
            }
        });
        return results;
    }

    // Bulk reject requests
    bulkRejectRequests(requestIds, rejectedBy, notes = '') {
        return requestIds.map(requestId => 
            this.rejectRequest(requestId, rejectedBy, notes)
        ).filter(result => result !== null);
    }

    // Get request statistics
    getRequestStats() {
        const total = this.requests.length;
        const pending = this.getPendingRequests().length;
        const approved = this.getApprovedRequests().length;
        const rejected = this.getRejectedRequests().length;
        const urgent = this.getUrgentRequests().length;
        const highPriority = this.getHighPriorityRequests().length;

        return {
            total,
            pending,
            approved,
            rejected,
            urgent,
            highPriority,
            approvalRate: total > 0 ? (approved / total) * 100 : 0
        };
    }

    // Get recent requests
    getRecentRequests(limit = 10) {
        return [...this.requests]
            .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate))
            .slice(0, limit);
    }

    // Get requests within date range
    getRequestsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.requests.filter(request => {
            const requestDate = new Date(request.date || request.requestedDate);
            return requestDate >= start && requestDate <= end;
        });
    }

    // Search requests
    searchRequests(query) {
        const lowerQuery = query.toLowerCase();
        return this.requests.filter(request => 
            request.student.toLowerCase().includes(lowerQuery) ||
            request.studentId.toLowerCase().includes(lowerQuery) ||
            request.item.toLowerCase().includes(lowerQuery) ||
            request.purpose.toLowerCase().includes(lowerQuery) ||
            request.id.toLowerCase().includes(lowerQuery)
        );
    }

    // Generate request ID
    generateRequestId() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        return `REQ${year}${month}${day}${random}`;
    }

    // Export requests to CSV
    exportToCSV(requests = this.requests) {
        const headers = ['ID', 'Student Name', 'Student ID', 'Item', 'Quantity', 'Request Date', 'Purpose', 'Status', 'Urgency', 'Approved By', 'Approval Date', 'Notes'];
        
        const csvData = [
            headers.join(','),
            ...requests.map(request => [
                `"${request.id}"`,
                `"${request.student}"`,
                `"${request.studentId}"`,
                `"${request.item}"`,
                request.quantity,
                `"${request.date || request.requestedDate}"`,
                `"${request.purpose}"`,
                `"${request.status}"`,
                `"${request.urgency || 'normal'}"`,
                `"${request.approvedBy || ''}"`,
                `"${request.approvedDate || ''}"`,
                `"${request.notes || ''}"`
            ].join(','))
        ].join('\n');

        return csvData;
    }

    // Generate request report
    generateRequestReport(options = {}) {
        const {
            startDate = null,
            endDate = null,
            status = null,
            studentId = null
        } = options;

        let filteredRequests = this.requests;

        // Apply filters
        if (startDate && endDate) {
            filteredRequests = this.getRequestsByDateRange(startDate, endDate);
        }

        if (status) {
            filteredRequests = filteredRequests.filter(req => req.status === status);
        }

        if (studentId) {
            filteredRequests = filteredRequests.filter(req => req.studentId === studentId);
        }

        const stats = this.getRequestStats();
        
        const report = {
            generatedAt: new Date().toISOString(),
            filters: options,
            summary: {
                totalRequests: filteredRequests.length,
                pending: filteredRequests.filter(req => req.status === 'pending').length,
                approved: filteredRequests.filter(req => req.status === 'approved').length,
                rejected: filteredRequests.filter(req => req.status === 'rejected').length,
                urgent: filteredRequests.filter(req => req.urgency === 'urgent').length
            },
            requests: filteredRequests,
            overallStats: stats
        };

        return report;
    }

    // Save to localStorage
    saveToLocalStorage() {
        localStorage.setItem('biotechRequests', JSON.stringify(this.requests));
    }

    // Load from localStorage
    loadFromLocalStorage() {
        const saved = localStorage.getItem('biotechRequests');
        this.requests = saved ? JSON.parse(saved) : [];
    }

    // Initialize with sample data if empty
    initializeWithSampleData() {
        if (this.requests.length === 0) {
            this.requests = [
                {
                    id: "REQ001",
                    student: "Alex Chen",
                    studentId: "BT2021001",
                    item: "Agar Powder",
                    itemId: 1,
                    quantity: 5,
                    date: "2023-10-20",
                    purpose: "Bacterial culture experiment for microbiology lab",
                    status: "pending",
                    urgency: "normal",
                    requestedBy: "Alex Chen",
                    requestedDate: "2023-10-20T10:30:00",
                    approvedBy: null,
                    approvedDate: null,
                    notes: ""
                },
                {
                    id: "REQ002",
                    student: "Maria Rodriguez",
                    studentId: "BT2021015",
                    item: "Sterile Gloves",
                    itemId: 2,
                    quantity: 2,
                    date: "2023-10-19",
                    purpose: "Required for lab safety protocol during practical",
                    status: "approved",
                    urgency: "high",
                    requestedBy: "Maria Rodriguez",
                    requestedDate: "2023-10-19T14:20:00",
                    approvedBy: "Dr. Sarah Johnson",
                    approvedDate: "2023-10-19T16:45:00",
                    notes: "Issued for lab safety training"
                },
                {
                    id: "REQ003",
                    student: "James Wilson",
                    studentId: "BT2021022",
                    item: "Micropipette Tips",
                    itemId: 3,
                    quantity: 1,
                    date: "2023-10-18",
                    purpose: "DNA quantification experiment for genetics project",
                    status: "rejected",
                    urgency: "normal",
                    requestedBy: "James Wilson",
                    requestedDate: "2023-10-18T09:15:00",
                    approvedBy: "Dr. Sarah Johnson",
                    approvedDate: "2023-10-18T11:30:00",
                    notes: "Item out of stock. Will notify when available."
                },
                {
                    id: "REQ004",
                    student: "Sofia Patel",
                    studentId: "BT2021008",
                    item: "Ethanol 70%",
                    itemId: 4,
                    quantity: 2,
                    date: "2023-10-17",
                    purpose: "Surface sterilization for tissue culture work",
                    status: "approved",
                    urgency: "urgent",
                    requestedBy: "Sofia Patel",
                    requestedDate: "2023-10-17T13:45:00",
                    approvedBy: "Dr. Sarah Johnson",
                    approvedDate: "2023-10-17T14:20:00",
                    notes: "For urgent tissue culture work"
                },
                {
                    id: "REQ005",
                    student: "David Kim",
                    studentId: "BT2021012",
                    item: "Petri Dishes",
                    itemId: 5,
                    quantity: 3,
                    date: "2023-10-16",
                    purpose: "Fungal culture isolation for mycology research",
                    status: "pending",
                    urgency: "normal",
                    requestedBy: "David Kim",
                    requestedDate: "2023-10-16T16:10:00",
                    approvedBy: null,
                    approvedDate: null,
                    notes: ""
                }
            ];
            this.saveToLocalStorage();
        }
    }
}

// Initialize global request manager
const requestManager = new RequestManager();

// Request handling functions
function handleApproveRequest(requestId) {
    if (!requestId) return;

    const request = requestManager.getRequest(requestId);
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }

    // Check inventory availability
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const item = inventory.find(i => i.id === request.itemId);
    
    if (!item) {
        modalManager.createAlertModal({
            title: 'Error',
            message: 'Requested item not found in inventory',
            type: 'error'
        });
        return;
    }

    if (item.quantity < request.quantity) {
        modalManager.createAlertModal({
            title: 'Insufficient Stock',
            message: `Cannot approve request. Available: ${item.quantity} ${item.unit}, Requested: ${request.quantity}`,
            type: 'error'
        });
        return;
    }

    modalManager.createConfirmModal({
        title: 'Approve Request',
        message: `Are you sure you want to approve this request for ${request.quantity} ${item.unit} of ${request.item}?`,
        confirmText: 'Approve',
        cancelText: 'Cancel',
        type: 'success',
        onConfirm: () => {
            try {
                const user = AppState ? AppState.currentUser.name : 'Storekeeper';
                const approvedRequest = requestManager.approveRequest(requestId, user);
                
                if (approvedRequest) {
                    // Create issue log entry
                    if (window.issueManager) {
                        window.issueManager.createIssueFromRequest(approvedRequest);
                    }
                    
                    showNotification(`Request ${requestId} approved successfully`, 'success');
                    
                    // Refresh UI
                    if (typeof renderRequests === 'function') {
                        renderRequests();
                    }
                    if (typeof renderDashboard === 'function') {
                        renderDashboard();
                    }
                    
                    // Update notifications
                    if (typeof generateNotifications === 'function') {
                        generateNotifications();
                    }
                    
                    // Save data
                    if (typeof saveAppData === 'function') {
                        saveAppData();
                    }
                }
            } catch (error) {
                showNotification(`Error approving request: ${error.message}`, 'error');
            }
        }
    });
}

function handleRejectRequest(requestId) {
    if (!requestId) return;

    const request = requestManager.getRequest(requestId);
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }

    modalManager.createFormModal({
        title: 'Reject Request',
        formId: 'rejectRequestForm',
        formHTML: `
            <div class="form-group">
                <label for="rejectReason">Reason for Rejection *</label>
                <textarea id="rejectReason" class="form-control" rows="3" required placeholder="Enter reason for rejecting this request..."></textarea>
            </div>
        `,
        onSubmit: (formData) => {
            const reason = document.getElementById('rejectReason').value;
            const user = AppState ? AppState.currentUser.name : 'Storekeeper';
            
            const rejectedRequest = requestManager.rejectRequest(requestId, user, reason);
            
            if (rejectedRequest) {
                showNotification(`Request ${requestId} rejected`, 'info');
                
                // Refresh UI
                if (typeof renderRequests === 'function') {
                    renderRequests();
                }
                if (typeof renderDashboard === 'function') {
                    renderDashboard();
                }
                
                // Update notifications
                if (typeof generateNotifications === 'function') {
                    generateNotifications();
                }
                
                // Save data
                if (typeof saveAppData === 'function') {
                    saveAppData();
                }
            }
        },
        submitText: 'Reject Request',
        cancelText: 'Cancel'
    });
}

function handleViewRequestDetails(requestId) {
    const request = requestManager.getRequest(requestId);
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }

    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    modalManager.createRequestDetailsModal(request, inventory);
}

function handleBulkApproveRequests() {
    const selectedRequests = getSelectedRequests();
    if (selectedRequests.length === 0) {
        showNotification('No requests selected', 'warning');
        return;
    }

    modalManager.createConfirmModal({
        title: 'Bulk Approve',
        message: `Are you sure you want to approve ${selectedRequests.length} selected request(s)?`,
        confirmText: 'Approve All',
        cancelText: 'Cancel',
        type: 'success',
        onConfirm: () => {
            const user = AppState ? AppState.currentUser.name : 'Storekeeper';
            const results = requestManager.bulkApproveRequests(selectedRequests, user);
            
            const successful = results.filter(r => r.success).length;
            const failed = results.filter(r => !r.success).length;
            
            if (failed > 0) {
                modalManager.createAlertModal({
                    title: 'Bulk Approval Results',
                    message: `${successful} requests approved successfully. ${failed} requests failed.`,
                    type: failed === selectedRequests.length ? 'error' : 'warning'
                });
            } else {
                showNotification(`${successful} requests approved successfully`, 'success');
            }
            
            // Refresh UI
            if (typeof renderRequests === 'function') {
                renderRequests();
            }
            if (typeof renderDashboard === 'function') {
                renderDashboard();
            }
            
            // Update notifications
            if (typeof generateNotifications === 'function') {
                generateNotifications();
            }
            
            // Save data
            if (typeof saveAppData === 'function') {
                saveAppData();
            }
        }
    });
}

function handleBulkRejectRequests() {
    const selectedRequests = getSelectedRequests();
    if (selectedRequests.length === 0) {
        showNotification('No requests selected', 'warning');
        return;
    }

    modalManager.createFormModal({
        title: 'Bulk Reject',
        formId: 'bulkRejectForm',
        formHTML: `
            <div class="form-group">
                <label for="bulkRejectReason">Reason for Rejection *</label>
                <textarea id="bulkRejectReason" class="form-control" rows="3" required placeholder="Enter reason for rejecting these requests..."></textarea>
            </div>
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                This action will reject ${selectedRequests.length} selected request(s).
            </div>
        `,
        onSubmit: (formData) => {
            const reason = document.getElementById('bulkRejectReason').value;
            const user = AppState ? AppState.currentUser.name : 'Storekeeper';
            
            const results = requestManager.bulkRejectRequests(selectedRequests, user, reason);
            
            showNotification(`${results.length} requests rejected`, 'info');
            
            // Refresh UI
            if (typeof renderRequests === 'function') {
                renderRequests();
            }
            if (typeof renderDashboard === 'function') {
                renderDashboard();
            }
            
            // Update notifications
            if (typeof generateNotifications === 'function') {
                generateNotifications();
            }
            
            // Save data
            if (typeof saveAppData === 'function') {
                saveAppData();
            }
        },
        submitText: 'Reject All',
        cancelText: 'Cancel'
    });
}

function handleExportRequests() {
    const requests = requestManager.getAllRequests();
    if (requests.length === 0) {
        showNotification('No requests to export', 'warning');
        return;
    }

    modalManager.createConfirmModal({
        title: 'Export Requests',
        message: `Export ${requests.length} requests to CSV file?`,
        confirmText: 'Export',
        cancelText: 'Cancel',
        type: 'info',
        onConfirm: () => {
            const csvData = requestManager.exportToCSV();
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `biotech-requests-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Requests exported successfully', 'success');
        }
    });
}

function handleGenerateRequestReport() {
    modalManager.createFormModal({
        title: 'Generate Request Report',
        formId: 'requestReportForm',
        formHTML: `
            <div class="form-group">
                <label for="reportStartDate">Start Date</label>
                <input type="date" id="reportStartDate" class="form-control">
            </div>
            <div class="form-group">
                <label for="reportEndDate">End Date</label>
                <input type="date" id="reportEndDate" class="form-control">
            </div>
            <div class="form-group">
                <label for="reportStatus">Status Filter</label>
                <select id="reportStatus" class="form-control">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div class="form-group">
                <label for="reportFormat">Report Format</label>
                <select id="reportFormat" class="form-control">
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF (Preview)</option>
                </select>
            </div>
        `,
        onSubmit: (formData) => {
            const startDate = document.getElementById('reportStartDate').value;
            const endDate = document.getElementById('reportEndDate').value;
            const status = document.getElementById('reportStatus').value;
            const format = document.getElementById('reportFormat').value;
            
            const options = {};
            if (startDate) options.startDate = startDate;
            if (endDate) options.endDate = endDate;
            if (status) options.status = status;
            
            const report = requestManager.generateRequestReport(options);
            
            if (format === 'json') {
                // Export as JSON
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `request-report-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else if (format === 'csv') {
                // Export as CSV
                const filteredRequests = report.requests;
                const csvData = requestManager.exportToCSV(filteredRequests);
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `request-report-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                // Show PDF preview
                showRequestReportPreview(report);
            }
            
            showNotification('Request report generated successfully', 'success');
        },
        submitText: 'Generate Report',
        cancelText: 'Cancel'
    });
}

function showRequestReportPreview(report) {
    const modalId = modalManager.createFormModal({
        title: 'Request Report Preview',
        formId: 'reportPreview',
        formHTML: `
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 5px; margin-bottom: 1rem;">
                <h3 style="margin-bottom: 0.5rem;">Report Summary</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                    <div>Total Requests: <strong>${report.summary.totalRequests}</strong></div>
                    <div>Pending: <strong>${report.summary.pending}</strong></div>
                    <div>Approved: <strong>${report.summary.approved}</strong></div>
                    <div>Rejected: <strong>${report.summary.rejected}</strong></div>
                    <div>Urgent: <strong>${report.summary.urgent}</strong></div>
                </div>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #2c3e50; color: white;">
                            <th style="padding: 0.5rem; text-align: left;">ID</th>
                            <th style="padding: 0.5rem; text-align: left;">Student</th>
                            <th style="padding: 0.5rem; text-align: left;">Item</th>
                            <th style="padding: 0.5rem; text-align: left;">Qty</th>
                            <th style="padding: 0.5rem; text-align: left;">Status</th>
                            <th style="padding: 0.5rem; text-align: left;">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.requests.map(req => `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 0.5rem;">${req.id}</td>
                                <td style="padding: 0.5rem;">${req.student}</td>
                                <td style="padding: 0.5rem;">${req.item}</td>
                                <td style="padding: 0.5rem;">${req.quantity}</td>
                                <td style="padding: 0.5rem;">
                                    <span style="padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; 
                                          background: ${req.status === 'approved' ? '#d4edda' : 
                                                       req.status === 'rejected' ? '#f8d7da' : '#d1ecf1'}; 
                                          color: ${req.status === 'approved' ? '#155724' : 
                                                  req.status === 'rejected' ? '#721c24' : '#0c5460'}">
                                        ${req.status}
                                    </span>
                                </td>
                                <td style="padding: 0.5rem;">${req.date}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 1rem; text-align: center;">
                <button class="btn btn-primary" onclick="printReport()">
                    <i class="fas fa-print"></i> Print Report
                </button>
                <button class="btn btn-success" onclick="downloadReportAsPDF()" style="margin-left: 0.5rem;">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        `,
        onSubmit: null,
        submitText: '',
        cancelText: 'Close'
    });
    
    // Add print functionality
    window.printReport = function() {
        window.print();
    };
    
    window.downloadReportAsPDF = function() {
        showNotification('PDF download would be implemented in production', 'info');
    };
}

function getSelectedRequests() {
    // This function should get selected request IDs from checkboxes in the UI
    // For now, return empty array - implementation depends on UI
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(selectedCheckboxes).map(cb => cb.value);
}

function renderRequestsTable(requests, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    
    const html = `
        <table class="requests-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="selectAllRequests"></th>
                    <th>Request ID</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Request Date</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${requests.map(request => {
                    const item = inventory.find(i => i.id === request.itemId);
                    const availableQuantity = item ? item.quantity : 0;
                    
                    return `
                        <tr data-request-id="${request.id}">
                            <td><input type="checkbox" value="${request.id}" class="request-checkbox"></td>
                            <td><strong>${request.id}</strong></td>
                            <td>${request.student}</td>
                            <td>${request.studentId}</td>
                            <td>
                                ${request.item}
                                <div class="badge badge-info" style="margin-top: 4px;">
                                    Available: ${availableQuantity}
                                </div>
                            </td>
                            <td>${request.quantity}</td>
                            <td>${formatDate(request.date)}</td>
                            <td>
                                <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" 
                                     title="${request.purpose}">
                                    ${request.purpose}
                                </div>
                            </td>
                            <td>
                                <span class="status ${request.status}">
                                    ${request.status === 'pending' ? 'Pending' : 
                                      request.status === 'approved' ? 'Approved' : 
                                      'Rejected'}
                                </span>
                                ${request.urgency === 'urgent' ? 
                                  '<div class="badge badge-danger" style="margin-top: 4px;">URGENT</div>' : 
                                  request.urgency === 'high' ? 
                                  '<div class="badge badge-warning" style="margin-top: 4px;">HIGH</div>' : ''}
                            </td>
                            <td>
                                <div style="display: flex; gap: 5px;">
                                    ${request.status === 'pending' ? `
                                        <button class="btn btn-sm btn-success" onclick="handleApproveRequest('${request.id}')">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="handleRejectRequest('${request.id}')">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    ` : ''}
                                    <button class="btn btn-sm btn-info" onclick="handleViewRequestDetails('${request.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    // Add event listener for select all checkbox
    const selectAll = document.getElementById('selectAllRequests');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.request-checkbox');
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
            });
        });
    }
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Initialize request manager
document.addEventListener('DOMContentLoaded', function() {
    // Load requests from localStorage
    requestManager.loadFromLocalStorage();
    
    // Initialize with sample data if empty
    if (requestManager.requests.length === 0) {
        requestManager.initializeWithSampleData();
    }
    
    console.log('Request Manager initialized with', requestManager.requests.length, 'requests');
});

// Export request manager for global use
window.requestManager = requestManager;
window.handleApproveRequest = handleApproveRequest;
window.handleRejectRequest = handleRejectRequest;
window.handleViewRequestDetails = handleViewRequestDetails;
window.handleBulkApproveRequests = handleBulkApproveRequests;
window.handleBulkRejectRequests = handleBulkRejectRequests;
window.handleExportRequests = handleExportRequests;
window.handleGenerateRequestReport = handleGenerateRequestReport;
window.renderRequestsTable = renderRequestsTable;