// main.js - Complete Main Application Logic

// Application State
const AppState = {
    currentUser: {
        id: "STORE001",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@biotech.edu",
        role: "storekeeper", // 'storekeeper' or 'student'
        department: "Biotechnology",
        lastLogin: new Date().toISOString()
    },
    currentTab: 'dashboard',
    isDarkMode: false,
    notifications: [],
    settings: {
        lowStockThreshold: 10,
        autoRefresh: true,
        notificationsEnabled: true,
        emailAlerts: false
    }
};

// DOM Elements
const mainContent = document.getElementById('mainContent');
const userRoleElement = document.getElementById('userRole');
const userNameElement = document.getElementById('userName');
const notificationCountElement = document.getElementById('notificationCount');
const navTabs = document.querySelectorAll('.nav-tabs li');
const logoutBtn = document.getElementById('logoutBtn');
const notificationsBtn = document.getElementById('notificationsBtn');

// Sample Data (In a real app, this would come from an API)
const sampleInventory = [
    { 
        id: 1, 
        name: "Agar Powder", 
        category: "Culture Media", 
        quantity: 15, 
        unit: "g", 
        minStock: 10, 
        status: "in-stock", 
        lastRestock: "2023-10-15", 
        location: "Shelf A1", 
        supplier: "BioBasic Inc.",
        expiryDate: "2024-06-30",
        price: 45.50,
        barcode: "AGAR001"
    },
    { 
        id: 2, 
        name: "Sterile Gloves", 
        category: "Consumables", 
        quantity: 8, 
        unit: "pairs", 
        minStock: 20, 
        status: "low-stock", 
        lastRestock: "2023-10-10", 
        location: "Shelf B2", 
        supplier: "Medline",
        expiryDate: "2025-12-31",
        price: 12.75,
        barcode: "GLOV002"
    },
    { 
        id: 3, 
        name: "Micropipette Tips", 
        category: "Labware", 
        quantity: 0, 
        unit: "box", 
        minStock: 5, 
        status: "out-of-stock", 
        lastRestock: "2023-09-28", 
        location: "Shelf C3", 
        supplier: "Eppendorf",
        expiryDate: "2026-03-15",
        price: 89.99,
        barcode: "TIPS003"
    },
    { 
        id: 4, 
        name: "Ethanol 70%", 
        category: "Chemicals", 
        quantity: 12, 
        unit: "L", 
        minStock: 5, 
        status: "in-stock", 
        lastRestock: "2023-10-18", 
        location: "Cabinet D4", 
        supplier: "Sigma-Aldrich",
        expiryDate: "2024-08-20",
        price: 32.50,
        barcode: "ETHN004"
    },
    { 
        id: 5, 
        name: "Petri Dishes", 
        category: "Labware", 
        quantity: 6, 
        unit: "pack", 
        minStock: 15, 
        status: "low-stock", 
        lastRestock: "2023-10-05", 
        location: "Shelf E5", 
        supplier: "Thermo Fisher",
        expiryDate: "2025-10-30",
        price: 24.99,
        barcode: "PETR005"
    },
    { 
        id: 6, 
        name: "LB Broth", 
        category: "Culture Media", 
        quantity: 22, 
        unit: "g", 
        minStock: 10, 
        status: "in-stock", 
        lastRestock: "2023-10-12", 
        location: "Shelf A2", 
        supplier: "BioBasic Inc.",
        expiryDate: "2024-09-15",
        price: 38.75,
        barcode: "LB006"
    },
    { 
        id: 7, 
        name: "PCR Tubes", 
        category: "Labware", 
        quantity: 3, 
        unit: "box", 
        minStock: 10, 
        status: "low-stock", 
        lastRestock: "2023-10-01", 
        location: "Shelf C1", 
        supplier: "Bio-Rad",
        expiryDate: "2025-07-31",
        price: 67.50,
        barcode: "PCR007"
    },
    { 
        id: 8, 
        name: "DNA Ladder", 
        category: "Reagents", 
        quantity: 0, 
        unit: "vial", 
        minStock: 3, 
        status: "out-of-stock", 
        lastRestock: "2023-09-20", 
        location: "Freezer F1", 
        supplier: "Invitrogen",
        expiryDate: "2024-01-15",
        price: 125.00,
        barcode: "DNA008"
    },
    { 
        id: 9, 
        name: "Microcentrifuge Tubes", 
        category: "Labware", 
        quantity: 18, 
        unit: "box", 
        minStock: 10, 
        status: "in-stock", 
        lastRestock: "2023-10-16", 
        location: "Shelf C2", 
        supplier: "Eppendorf",
        expiryDate: "2026-05-20",
        price: 55.25,
        barcode: "MCT009"
    },
    { 
        id: 10, 
        name: "Tris Buffer", 
        category: "Chemicals", 
        quantity: 4, 
        unit: "L", 
        minStock: 5, 
        status: "low-stock", 
        lastRestock: "2023-10-03", 
        location: "Cabinet D2", 
        supplier: "Sigma-Aldrich",
        expiryDate: "2024-04-30",
        price: 42.80,
        barcode: "TRIS010"
    }
];

const sampleRequests = [
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

const sampleIssues = [
    { 
        id: "ISS001", 
        item: "Agar Powder", 
        itemId: 1,
        quantity: 10, 
        unit: "g",
        issuedTo: "Alex Chen", 
        studentId: "BT2021001",
        issuedBy: "Dr. Sarah Johnson", 
        issueDate: "2023-10-15", 
        expectedReturn: "2023-10-22", 
        actualReturn: null,
        status: "issued",
        projectCode: "MICRO2023",
        labRoom: "B301",
        supervisor: "Dr. Roberts"
    },
    { 
        id: "ISS002", 
        item: "Sterile Gloves", 
        itemId: 2,
        quantity: 5, 
        unit: "pairs",
        issuedTo: "Maria Rodriguez", 
        studentId: "BT2021015",
        issuedBy: "Dr. Sarah Johnson", 
        issueDate: "2023-10-14", 
        expectedReturn: "2023-10-21", 
        actualReturn: "2023-10-21",
        status: "returned",
        projectCode: "SAFETY101",
        labRoom: "Main Lab",
        supervisor: "Dr. Johnson"
    },
    { 
        id: "ISS003", 
        item: "Ethanol 70%", 
        itemId: 4,
        quantity: 3, 
        unit: "L",
        issuedTo: "James Wilson", 
        studentId: "BT2021022",
        issuedBy: "Dr. Sarah Johnson", 
        issueDate: "2023-10-13", 
        expectedReturn: "2023-10-20", 
        actualReturn: null,
        status: "issued",
        projectCode: "GENETICS2023",
        labRoom: "B305",
        supervisor: "Dr. Miller"
    },
    { 
        id: "ISS004", 
        item: "LB Broth", 
        itemId: 6,
        quantity: 15, 
        unit: "g",
        issuedTo: "Sofia Patel", 
        studentId: "BT2021008",
        issuedBy: "Dr. Sarah Johnson", 
        issueDate: "2023-10-12", 
        expectedReturn: "2023-10-19", 
        actualReturn: null,
        status: "overdue",
        projectCode: "TISSUE2023",
        labRoom: "C201",
        supervisor: "Dr. Chen"
    },
    { 
        id: "ISS005", 
        item: "Microcentrifuge Tubes", 
        itemId: 9,
        quantity: 2, 
        unit: "box",
        issuedTo: "David Kim", 
        studentId: "BT2021012",
        issuedBy: "Dr. Sarah Johnson", 
        issueDate: "2023-10-11", 
        expectedReturn: "2023-10-18", 
        actualReturn: "2023-10-18",
        status: "returned",
        projectCode: "MYCOLOGY2023",
        labRoom: "B304",
        supervisor: "Dr. Wilson"
    }
];

const sampleActivity = [
    { 
        id: 1,
        type: "request", 
        user: "Alex Chen", 
        details: "requested 5g of Agar Powder", 
        time: "2 hours ago",
        icon: "hand-paper",
        color: "var(--secondary)"
    },
    { 
        id: 2,
        type: "restock", 
        user: "Storekeeper", 
        details: "restocked 5L of Ethanol 70%", 
        time: "1 day ago",
        icon: "boxes",
        color: "var(--success)"
    },
    { 
        id: 3,
        type: "warning", 
        user: "System Alert", 
        details: "Micropipette Tips are out of stock", 
        time: "2 days ago",
        icon: "exclamation-triangle",
        color: "var(--warning)"
    },
    { 
        id: 4,
        type: "request", 
        user: "Maria Rodriguez", 
        details: "request for Sterile Gloves was approved", 
        time: "3 days ago",
        icon: "check-circle",
        color: "var(--success)"
    },
    { 
        id: 5,
        type: "restock", 
        user: "Storekeeper", 
        details: "updated inventory counts after audit", 
        time: "4 days ago",
        icon: "clipboard-check",
        color: "var(--info)"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log("Biotech Store Management System Initializing...");
    
    // Load data from localStorage or use sample data
    loadAppData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI
    initializeUI();
    
    // Render initial dashboard
    renderDashboard();
    
    console.log("Application initialized successfully!");
});

// Load application data
function loadAppData() {
    // Try to load from localStorage
    const savedInventory = localStorage.getItem('biotechInventory');
    const savedRequests = localStorage.getItem('biotechRequests');
    const savedIssues = localStorage.getItem('biotechIssues');
    const savedSettings = localStorage.getItem('biotechSettings');
    const savedUser = localStorage.getItem('biotechUser');
    
    // Initialize data managers
    if (typeof InventoryManager !== 'undefined') {
        window.inventoryManager = new InventoryManager();
        window.inventoryManager.items = savedInventory ? JSON.parse(savedInventory) : sampleInventory;
    }
    
    if (typeof RequestManager !== 'undefined') {
        window.requestManager = new RequestManager();
        window.requestManager.requests = savedRequests ? JSON.parse(savedRequests) : sampleRequests;
    }
    
    if (typeof IssueManager !== 'undefined') {
        window.issueManager = new IssueManager();
        window.issueManager.issues = savedIssues ? JSON.parse(savedIssues) : sampleIssues;
    }
    
    // Load settings
    if (savedSettings) {
        AppState.settings = JSON.parse(savedSettings);
    }
    
    // Load user data
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
    }
    
    // Generate notifications
    generateNotifications();
}

// Save application data
function saveAppData() {
    if (window.inventoryManager) {
        localStorage.setItem('biotechInventory', JSON.stringify(window.inventoryManager.items));
    }
    
    if (window.requestManager) {
        localStorage.setItem('biotechRequests', JSON.stringify(window.requestManager.requests));
    }
    
    if (window.issueManager) {
        localStorage.setItem('biotechIssues', JSON.stringify(window.issueManager.issues));
    }
    
    localStorage.setItem('biotechSettings', JSON.stringify(AppState.settings));
    localStorage.setItem('biotechUser', JSON.stringify(AppState.currentUser));
}

// Setup event listeners
function setupEventListeners() {
    // Navigation tab clicks
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Notifications button
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', showNotificationsModal);
    }
    
    // New Request button
    const newRequestBtn = document.getElementById('newRequestBtn');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', function() {
            openRequestModal();
        });
    }
    
    // Restock button
    const restockBtn = document.getElementById('restockBtn');
    if (restockBtn) {
        restockBtn.addEventListener('click', function() {
            openRestockModal();
        });
    }
    
    // Quick action buttons
    const quickRequestBtn = document.getElementById('quickRequestBtn');
    if (quickRequestBtn) {
        quickRequestBtn.addEventListener('click', function() {
            openRequestModal();
        });
    }
    
    const quickRestockBtn = document.getElementById('quickRestockBtn');
    if (quickRestockBtn) {
        quickRestockBtn.addEventListener('click', function() {
            openRestockModal();
        });
    }
    
    const quickReportBtn = document.getElementById('quickReportBtn');
    if (quickReportBtn) {
        quickReportBtn.addEventListener('click', function() {
            generateReport();
        });
    }
    
    // Search functionality
    const inventorySearch = document.getElementById('inventorySearch');
    if (inventorySearch) {
        inventorySearch.addEventListener('input', function(e) {
            searchInventory(e.target.value);
        });
    }
    
    // Filter buttons for requests
    const filterPending = document.getElementById('filterPending');
    if (filterPending) {
        filterPending.addEventListener('click', function() {
            filterRequests('pending');
        });
    }
    
    const filterApproved = document.getElementById('filterApproved');
    if (filterApproved) {
        filterApproved.addEventListener('click', function() {
            filterRequests('approved');
        });
    }
    
    const filterRejected = document.getElementById('filterRejected');
    if (filterRejected) {
        filterRejected.addEventListener('click', function() {
            filterRequests('rejected');
        });
    }
    
    const filterAll = document.getElementById('filterAll');
    if (filterAll) {
        filterAll.addEventListener('click', function() {
            filterRequests('all');
        });
    }
    
    // Generate report button
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateReport();
        });
    }
    
    // Date range selector
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            const customRange = document.getElementById('customDateRange');
            if (this.value === 'custom') {
                customRange.style.display = 'block';
            } else {
                customRange.style.display = 'none';
            }
        });
    }
    
    // Log date filter
    const logDateFilter = document.getElementById('logDateFilter');
    if (logDateFilter) {
        logDateFilter.addEventListener('change', function() {
            filterIssueLogByDate(this.value);
        });
    }
    
    // Before unload - save data
    window.addEventListener('beforeunload', saveAppData);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new request
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openRequestModal();
        }
        
        // Ctrl/Cmd + R for restock
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            openRestockModal();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Initialize UI elements
function initializeUI() {
    // Update user info
    updateUserInfo();
    
    // Update notification count
    updateNotificationCount();
    
    // Set current date in date inputs
    setCurrentDateInInputs();
    
    // Initialize charts if needed
    initializeCharts();
}

// Update user information in the UI
function updateUserInfo() {
    if (userRoleElement) {
        userRoleElement.textContent = AppState.currentUser.role === 'storekeeper' ? 'Storekeeper' : 'Student';
    }
    
    if (userNameElement) {
        userNameElement.textContent = AppState.currentUser.name;
    }
}

// Switch between tabs
function switchTab(tabId) {
    // Update active tab in navigation
    navTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update current tab in state
    AppState.currentTab = tabId;
    
    // Render appropriate content
    switch(tabId) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'inventory':
            renderInventory();
            break;
        case 'requests':
            renderRequests();
            break;
        case 'issue-log':
            renderIssueLog();
            break;
        case 'reports':
            renderReports();
            break;
        case 'settings':
            renderSettings();
            break;
        default:
            renderDashboard();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Render Dashboard
function renderDashboard() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const requests = window.requestManager ? window.requestManager.requests : sampleRequests;
    const issues = window.issueManager ? window.issueManager.issues : sampleIssues;
    
    // Calculate statistics
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock && item.quantity > 0).length;
    const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
    const pendingRequests = requests.filter(req => req.status === 'pending').length;
    const issuedItems = issues.filter(issue => issue.status === 'issued' || issue.status === 'overdue').length;
    
    // Get recent activity
    const recentActivity = sampleActivity;
    
    // Get recent requests (max 5)
    const recentRequests = [...requests]
        .sort((a, b) => new Date(b.requestedDate || b.date) - new Date(a.requestedDate || a.date))
        .slice(0, 5);
    
    const html = `
        <div class="stats-container">
            <div class="stat-card inventory">
                <div class="stat-value">${totalItems}</div>
                <div class="stat-label">Total Items</div>
                <div class="stat-change positive">+2 this week</div>
            </div>
            <div class="stat-card requests">
                <div class="stat-value">${pendingRequests}</div>
                <div class="stat-label">Pending Requests</div>
                <div class="stat-change negative">${pendingRequests > 0 ? 'Needs attention' : 'All clear'}</div>
            </div>
            <div class="stat-card low-stock">
                <div class="stat-value">${lowStockItems}</div>
                <div class="stat-label">Low Stock Items</div>
                <div class="stat-change warning">${lowStockItems > 0 ? 'Restock needed' : 'Adequate'}</div>
            </div>
            <div class="stat-card out-of-stock">
                <div class="stat-value">${outOfStockItems}</div>
                <div class="stat-label">Out of Stock</div>
                <div class="stat-change ${outOfStockItems > 0 ? 'negative' : 'positive'}">${outOfStockItems > 0 ? 'Order required' : 'All in stock'}</div>
            </div>
        </div>
        
        <div class="dashboard">
            <div>
                <!-- Inventory Summary -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-boxes"></i> Inventory Summary
                        </h2>
                        <div class="search-bar">
                            <i class="fas fa-search"></i>
                            <input type="text" id="inventorySearch" placeholder="Search inventory...">
                        </div>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Last Restock</th>
                                </tr>
                            </thead>
                            <tbody id="inventoryTable">
                                ${inventory.map(item => `
                                    <tr>
                                        <td>
                                            <strong>${item.name}</strong>
                                            <div class="badge badge-primary" style="margin-top: 4px;">${item.barcode || 'N/A'}</div>
                                        </td>
                                        <td>${item.category}</td>
                                        <td>
                                            ${item.quantity} ${item.unit}
                                            <div class="progress">
                                                <div class="progress-bar" style="width: ${Math.min(100, (item.quantity / (item.minStock * 2)) * 100)}%"></div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="status ${item.status}">
                                                ${item.status === 'in-stock' ? 'In Stock' : 
                                                  item.status === 'low-stock' ? 'Low Stock' : 
                                                  'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>${formatDate(item.lastRestock)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Requests -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-hand-paper"></i> Recent Requests
                        </h2>
                        <button class="btn btn-sm btn-primary" id="viewAllRequests">
                            <i class="fas fa-list"></i> View All
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Student</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentRequests.map(request => `
                                    <tr>
                                        <td><strong>${request.id}</strong></td>
                                        <td>${request.student}</td>
                                        <td>${request.item}</td>
                                        <td>${request.quantity}</td>
                                        <td>${formatDate(request.date)}</td>
                                        <td>
                                            <span class="status ${request.status}">
                                                ${request.status === 'pending' ? 'Pending' : 
                                                  request.status === 'approved' ? 'Approved' : 
                                                  'Rejected'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <!-- Recent Activity -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-history"></i> Recent Activity
                        </h2>
                    </div>
                    <div class="card-body">
                        <ul class="activity-list">
                            ${recentActivity.map(activity => `
                                <li class="activity-item">
                                    <div class="activity-icon" style="background: ${activity.color};">
                                        <i class="fas fa-${activity.icon}"></i>
                                    </div>
                                    <div class="activity-details">
                                        <h4>${activity.user}</h4>
                                        <p>${activity.details}</p>
                                        <div class="activity-time">${activity.time}</div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-bolt"></i> Quick Actions
                        </h2>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-primary btn-block" id="quickRequestBtn" style="margin-bottom: 10px;">
                            <i class="fas fa-hand-paper"></i> Request Item
                        </button>
                        <button class="btn btn-success btn-block" id="quickRestockBtn" style="margin-bottom: 10px;">
                            <i class="fas fa-arrow-up"></i> Update Stock
                        </button>
                        <button class="btn btn-info btn-block" id="quickReportBtn" style="margin-bottom: 10px;">
                            <i class="fas fa-file-export"></i> Generate Report
                        </button>
                        <button class="btn btn-warning btn-block" id="quickNotificationBtn">
                            <i class="fas fa-bell"></i> Check Alerts
                        </button>
                    </div>
                </div>
                
                <!-- Stock Alert -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-exclamation-triangle"></i> Stock Alerts
                        </h2>
                    </div>
                    <div class="card-body">
                        ${lowStockItems > 0 || outOfStockItems > 0 ? `
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <div>
                                    <strong>Attention Needed</strong>
                                    <p>${outOfStockItems} items out of stock and ${lowStockItems} items running low</p>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-danger btn-block" id="viewLowStockBtn">
                                <i class="fas fa-box"></i> View Low Stock Items
                            </button>
                        ` : `
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    <strong>All Good!</strong>
                                    <p>All items are adequately stocked</p>
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
    
    // Add event listeners for dynamically created buttons
    setTimeout(() => {
        const viewAllRequestsBtn = document.getElementById('viewAllRequests');
        if (viewAllRequestsBtn) {
            viewAllRequestsBtn.addEventListener('click', () => switchTab('requests'));
        }
        
        const viewLowStockBtn = document.getElementById('viewLowStockBtn');
        if (viewLowStockBtn) {
            viewLowStockBtn.addEventListener('click', () => {
                switchTab('inventory');
                // Focus on low stock items
                setTimeout(() => {
                    const searchInput = document.getElementById('fullInventorySearch');
                    if (searchInput) {
                        searchInput.value = 'low stock';
                        searchInput.dispatchEvent(new Event('input'));
                    }
                }, 100);
            });
        }
        
        const quickNotificationBtn = document.getElementById('quickNotificationBtn');
        if (quickNotificationBtn) {
            quickNotificationBtn.addEventListener('click', showNotificationsModal);
        }
        
        // Reattach search listener
        const inventorySearch = document.getElementById('inventorySearch');
        if (inventorySearch) {
            inventorySearch.addEventListener('input', function(e) {
                searchInventory(e.target.value);
            });
        }
    }, 100);
}

// Render Inventory Page
function renderInventory() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    
    const html = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-boxes"></i> Full Inventory
                </h2>
                <div class="card-actions">
                    <button class="btn btn-success btn-sm" id="addNewItemBtn">
                        <i class="fas fa-plus"></i> Add New Item
                    </button>
                    <button class="btn btn-primary btn-sm" id="exportInventoryBtn">
                        <i class="fas fa-download"></i> Export
                    </button>
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" id="fullInventorySearch" placeholder="Search full inventory...">
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Min Stock</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="fullInventoryTable">
                        ${inventory.map(item => `
                            <tr>
                                <td><strong>${item.id}</strong></td>
                                <td>
                                    <strong>${item.name}</strong>
                                    <div style="font-size: 0.8rem; color: var(--gray);">${item.supplier || 'No supplier'}</div>
                                </td>
                                <td>
                                    <span class="badge badge-primary">${item.category}</span>
                                </td>
                                <td>
                                    <div style="font-weight: 600;">${item.quantity} ${item.unit}</div>
                                    <div class="progress" style="margin-top: 5px;">
                                        <div class="progress-bar" style="width: ${Math.min(100, (item.quantity / (item.minStock * 2)) * 100)}%"></div>
                                    </div>
                                </td>
                                <td>${item.unit}</td>
                                <td>${item.minStock}</td>
                                <td>
                                    <span class="status ${item.status}">
                                        ${item.status === 'in-stock' ? 'In Stock' : 
                                          item.status === 'low-stock' ? 'Low Stock' : 
                                          'Out of Stock'}
                                    </span>
                                </td>
                                <td>${item.location || 'N/A'}</td>
                                <td>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="btn btn-sm btn-success edit-item" data-id="${item.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-warning restock-item" data-id="${item.id}">
                                            <i class="fas fa-arrow-up"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger delete-item" data-id="${item.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="card-footer" style="padding: 1rem; text-align: center; border-top: 1px solid var(--light-gray);">
                <p style="color: var(--gray); font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> Showing ${inventory.length} inventory items
                </p>
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
    
    // Add event listeners for inventory actions
    setTimeout(() => {
        // Add new item button
        const addNewItemBtn = document.getElementById('addNewItemBtn');
        if (addNewItemBtn) {
            addNewItemBtn.addEventListener('click', openAddItemModal);
        }
        
        // Export inventory button
        const exportInventoryBtn = document.getElementById('exportInventoryBtn');
        if (exportInventoryBtn) {
            exportInventoryBtn.addEventListener('click', exportInventory);
        }
        
        // Edit item buttons
        document.querySelectorAll('.edit-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                openEditItemModal(itemId);
            });
        });
        
        // Restock item buttons
        document.querySelectorAll('.restock-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                openRestockItemModal(itemId);
            });
        });
        
        // Delete item buttons
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                deleteItem(itemId);
            });
        });
        
        // Search functionality
        const fullInventorySearch = document.getElementById('fullInventorySearch');
        if (fullInventorySearch) {
            fullInventorySearch.addEventListener('input', function(e) {
                searchFullInventory(e.target.value);
            });
        }
    }, 100);
}

// Render Requests Page
function renderRequests() {
    const requests = window.requestManager ? window.requestManager.requests : sampleRequests;
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    
    const html = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-hand-paper"></i> Material Requests
                </h2>
                <div class="card-actions">
                    <button class="btn btn-primary" id="filterPending">Pending</button>
                    <button class="btn btn-success" id="filterApproved">Approved</button>
                    <button class="btn btn-danger" id="filterRejected">Rejected</button>
                    <button class="btn" id="filterAll">All</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
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
                    <tbody id="materialRequestsTable">
                        ${requests.map(request => {
                            const item = inventory.find(i => i.id === request.itemId);
                            const availableQuantity = item ? item.quantity : 0;
                            
                            return `
                                <tr>
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
                                        <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${request.purpose}">
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
                                                <button class="btn btn-sm btn-success approve-request" data-id="${request.id}">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger reject-request" data-id="${request.id}">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            ` : ''}
                                            <button class="btn btn-sm btn-info view-request" data-id="${request.id}">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
    
    // Add event listeners for request actions
    setTimeout(() => {
        // Approve request buttons
        document.querySelectorAll('.approve-request').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                approveRequest(requestId);
            });
        });
        
        // Reject request buttons
        document.querySelectorAll('.reject-request').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                rejectRequest(requestId);
            });
        });
        
        // View request buttons
        document.querySelectorAll('.view-request').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                viewRequestDetails(requestId);
            });
        });
    }, 100);
}

// Render Issue Log Page
function renderIssueLog() {
    const issues = window.issueManager ? window.issueManager.issues : sampleIssues;
    
    const html = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-clipboard-list"></i> Issue Log
                </h2>
                <div class="card-actions">
                    <input type="date" id="logDateFilter" class="form-control" style="width: auto;">
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Issue ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Issued To</th>
                            <th>Issued By</th>
                            <th>Issue Date</th>
                            <th>Return Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="issueLogTable">
                        ${issues.map(issue => `
                            <tr>
                                <td><strong>${issue.id}</strong></td>
                                <td>${issue.item}</td>
                                <td>${issue.quantity} ${issue.unit}</td>
                                <td>
                                    ${issue.issuedTo}
                                    <div class="badge badge-primary" style="margin-top: 4px;">${issue.studentId}</div>
                                </td>
                                <td>${issue.issuedBy}</td>
                                <td>${formatDate(issue.issueDate)}</td>
                                <td>
                                    ${issue.actualReturn ? 
                                      formatDate(issue.actualReturn) : 
                                      `Expected: ${formatDate(issue.expectedReturn)}`
                                    }
                                </td>
                                <td>
                                    <span class="status ${issue.status}">
                                        ${issue.status === 'issued' ? 'Issued' : 
                                          issue.status === 'returned' ? 'Returned' : 
                                          'Overdue'}
                                    </span>
                                    ${issue.status === 'overdue' ? 
                                      '<div class="badge badge-danger" style="margin-top: 4px;">OVERDUE</div>' : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
    
    // Set today's date as default in filter
    setTimeout(() => {
        const logDateFilter = document.getElementById('logDateFilter');
        if (logDateFilter) {
            const today = new Date().toISOString().split('T')[0];
            logDateFilter.value = today;
        }
    }, 100);
}

// Render Reports Page
function renderReports() {
    const html = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-chart-bar"></i> Generate Reports
                </h2>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="reportType">Report Type</label>
                    <select id="reportType" class="form-control">
                        <option value="inventory">Inventory Summary</option>
                        <option value="requests">Request History</option>
                        <option value="issuance">Issuance Log</option>
                        <option value="low-stock">Low Stock Items</option>
                        <option value="expiry">Expiry Report</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dateRange">Date Range</label>
                    <select id="dateRange" class="form-control">
                        <option value="last-week">Last Week</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-quarter">Last Quarter</option>
                        <option value="last-year">Last Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                <div class="form-group" id="customDateRange" style="display: none;">
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label>From Date</label>
                            <input type="date" id="fromDate" class="form-control">
                        </div>
                        <div style="flex: 1;">
                            <label>To Date</label>
                            <input type="date" id="toDate" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="reportFormat">Format</label>
                    <select id="reportFormat" class="form-control">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                <button class="btn btn-primary btn-block" id="generateReportBtn">
                    <i class="fas fa-download"></i> Generate Report
                </button>
                
                <div class="report-preview" style="margin-top: 2rem; padding: 1rem; border: 1px solid var(--light-gray); border-radius: var(--border-radius);">
                    <h3 style="margin-bottom: 1rem;">
                        <i class="fas fa-chart-pie"></i> Quick Statistics
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                        <div class="stat-card">
                            <div class="stat-value" id="reportTotalItems">10</div>
                            <div class="stat-label">Total Items</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="reportLowStock">3</div>
                            <div class="stat-label">Low Stock</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="reportPendingRequests">2</div>
                            <div class="stat-label">Pending Requests</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="reportIssuedItems">3</div>
                            <div class="stat-label">Issued Items</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
    
    // Update report statistics
    setTimeout(() => {
        const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
        const requests = window.requestManager ? window.requestManager.requests : sampleRequests;
        const issues = window.issueManager ? window.issueManager.issues : sampleIssues;
        
        const totalItems = inventory.length;
        const lowStockItems = inventory.filter(item => item.quantity <= item.minStock && item.quantity > 0).length;
        const pendingRequests = requests.filter(req => req.status === 'pending').length;
        const issuedItems = issues.filter(issue => issue.status === 'issued' || issue.status === 'overdue').length;
        
        document.getElementById('reportTotalItems').textContent = totalItems;
        document.getElementById('reportLowStock').textContent = lowStockItems;
        document.getElementById('reportPendingRequests').textContent = pendingRequests;
        document.getElementById('reportIssuedItems').textContent = issuedItems;
    }, 100);
}

// Render Settings Page
function renderSettings() {
    const html = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-cog"></i> Settings
                </h2>
            </div>
            <div class="card-body">
                <form id="settingsForm">
                    <h3 style="margin-bottom: 1rem; color: var(--primary);">
                        <i class="fas fa-user-cog"></i> User Settings
                    </h3>
                    <div class="form-group">
                        <label for="userName">Full Name</label>
                        <input type="text" id="userName" class="form-control" value="${AppState.currentUser.name}">
                    </div>
                    <div class="form-group">
                        <label for="userEmail">Email Address</label>
                        <input type="email" id="userEmail" class="form-control" value="${AppState.currentUser.email}">
                    </div>
                    <div class="form-group">
                        <label for="userDepartment">Department</label>
                        <input type="text" id="userDepartment" class="form-control" value="${AppState.currentUser.department}">
                    </div>
                    
                    <h3 style="margin: 2rem 0 1rem 0; color: var(--primary);">
                        <i class="fas fa-sliders-h"></i> Application Settings
                    </h3>
                    <div class="form-group">
                        <label for="lowStockThreshold">Low Stock Threshold</label>
                        <input type="number" id="lowStockThreshold" class="form-control" value="${AppState.settings.lowStockThreshold}" min="1" max="100">
                        <small style="color: var(--gray);">Items with quantity at or below this level will be marked as low stock</small>
                    </div>
                    
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <input type="checkbox" id="autoRefresh" ${AppState.settings.autoRefresh ? 'checked' : ''}>
                            <label for="autoRefresh" style="margin-bottom: 0;">Auto-refresh data</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <input type="checkbox" id="notificationsEnabled" ${AppState.settings.notificationsEnabled ? 'checked' : ''}>
                            <label for="notificationsEnabled" style="margin-bottom: 0;">Enable notifications</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="emailAlerts" ${AppState.settings.emailAlerts ? 'checked' : ''}>
                            <label for="emailAlerts" style="margin-bottom: 0;">Email alerts for critical stock</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="themeSelect">Theme</label>
                        <select id="themeSelect" class="form-control">
                            <option value="light" ${!AppState.isDarkMode ? 'selected' : ''}>Light Theme</option>
                            <option value="dark" ${AppState.isDarkMode ? 'selected' : ''}>Dark Theme</option>
                            <option value="auto">Auto (System Preference)</option>
                        </select>
                    </div>
                    
                    <h3 style="margin: 2rem 0 1rem 0; color: var(--primary);">
                        <i class="fas fa-database"></i> Data Management
                    </h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 1rem;">
                        <button type="button" class="btn btn-primary" id="backupDataBtn">
                            <i class="fas fa-save"></i> Backup Data
                        </button>
                        <button type="button" class="btn btn-warning" id="restoreDataBtn">
                            <i class="fas fa-undo"></i> Restore Data
                        </button>
                        <button type="button" class="btn btn-danger" id="resetDataBtn">
                            <i class="fas fa-trash"></i> Reset Data
                        </button>
                    </div>
                    
                    <button type="submit" class="btn btn-success btn-block" style="margin-top: 2rem;">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                </form>
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
    
    // Add event listeners for settings
    setTimeout(() => {
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveSettings();
            });
        }
        
        const backupDataBtn = document.getElementById('backupDataBtn');
        if (backupDataBtn) {
            backupDataBtn.addEventListener('click', backupData);
        }
        
        const restoreDataBtn = document.getElementById('restoreDataBtn');
        if (restoreDataBtn) {
            restoreDataBtn.addEventListener('click', restoreData);
        }
        
        const resetDataBtn = document.getElementById('resetDataBtn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', resetData);
        }
    }, 100);
}

// Search inventory in dashboard
function searchInventory(query) {
    const rows = document.querySelectorAll('#inventoryTable tr');
    const lowerQuery = query.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(lowerQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Search full inventory
function searchFullInventory(query) {
    const rows = document.querySelectorAll('#fullInventoryTable tr');
    const lowerQuery = query.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(lowerQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter requests by status
function filterRequests(status) {
    const rows = document.querySelectorAll('#materialRequestsTable tr');
    
    rows.forEach(row => {
        const statusCell = row.querySelector('.status');
        if (statusCell) {
            const rowStatus = statusCell.textContent.toLowerCase().trim();
            const display = (status === 'all' || rowStatus === status) ? '' : 'none';
            row.style.display = display;
        }
    });
    
    // Update active filter button
    document.querySelectorAll('#filterPending, #filterApproved, #filterRejected, #filterAll').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`filter${status.charAt(0).toUpperCase() + status.slice(1)}`).classList.add('active');
}

// Filter issue log by date
function filterIssueLogByDate(date) {
    if (!date) return;
    
    const rows = document.querySelectorAll('#issueLogTable tr');
    const filterDate = new Date(date).toDateString();
    
    rows.forEach(row => {
        const dateCell = row.cells[5]; // Issue Date column
        if (dateCell) {
            const rowDate = new Date(dateCell.textContent).toDateString();
            row.style.display = (rowDate === filterDate) ? '' : 'none';
        }
    });
}

// Format date to readable string
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Generate notifications based on inventory status
function generateNotifications() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const requests = window.requestManager ? window.requestManager.requests : sampleRequests;
    
    AppState.notifications = [];
    
    // Check for out of stock items
    const outOfStock = inventory.filter(item => item.quantity === 0);
    outOfStock.forEach(item => {
        AppState.notifications.push({
            id: Date.now() + Math.random(),
            type: 'danger',
            title: 'Out of Stock',
            message: `${item.name} is out of stock`,
            timestamp: new Date().toISOString(),
            read: false
        });
    });
    
    // Check for low stock items
    const lowStock = inventory.filter(item => item.quantity <= item.minStock && item.quantity > 0);
    lowStock.forEach(item => {
        AppState.notifications.push({
            id: Date.now() + Math.random(),
            type: 'warning',
            title: 'Low Stock Alert',
            message: `${item.name} is running low (${item.quantity} ${item.unit} remaining)`,
            timestamp: new Date().toISOString(),
            read: false
        });
    });
    
    // Check for pending requests
    const pendingRequests = requests.filter(req => req.status === 'pending');
    if (pendingRequests.length > 0) {
        AppState.notifications.push({
            id: Date.now() + Math.random(),
            type: 'info',
            title: 'Pending Requests',
            message: `${pendingRequests.length} requests awaiting approval`,
            timestamp: new Date().toISOString(),
            read: false
        });
    }
    
    updateNotificationCount();
}

// Update notification count in the UI
function updateNotificationCount() {
    const unreadCount = AppState.notifications.filter(n => !n.read).length;
    
    if (notificationCountElement) {
        notificationCountElement.textContent = unreadCount;
        if (unreadCount === 0) {
            notificationCountElement.style.display = 'none';
        } else {
            notificationCountElement.style.display = 'flex';
        }
    }
}

// Show notifications modal
function showNotificationsModal() {
    const allNotifications = AppState.notifications;
    
    // Mark all as read
    AppState.notifications.forEach(n => n.read = true);
    updateNotificationCount();
    
    const modalHtml = `
        <div class="modal active" id="notificationsModal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2><i class="fas fa-bell"></i> Notifications</h2>
                    <button class="modal-close" id="closeNotificationsModal">&times;</button>
                </div>
                <div class="modal-body">
                    ${allNotifications.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-bell-slash"></i>
                            <h3>No Notifications</h3>
                            <p>You're all caught up!</p>
                        </div>
                    ` : `
                        <div class="notifications-list">
                            ${allNotifications.map(notification => `
                                <div class="alert alert-${notification.type}" style="margin-bottom: 10px;">
                                    <div style="flex: 1;">
                                        <strong>${notification.title}</strong>
                                        <p style="margin: 5px 0 0 0; font-size: 0.9rem;">${notification.message}</p>
                                        <div style="font-size: 0.8rem; color: var(--gray); margin-top: 5px;">
                                            ${formatDate(notification.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <button class="btn btn-sm btn-outline" id="clearAllNotifications">
                                <i class="fas fa-trash"></i> Clear All
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Add event listeners
    setTimeout(() => {
        const closeBtn = document.getElementById('closeNotificationsModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('notificationsModal').remove();
            });
        }
        
        const clearBtn = document.getElementById('clearAllNotifications');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                AppState.notifications = [];
                updateNotificationCount();
                document.getElementById('notificationsModal').remove();
                showNotification('All notifications cleared', 'success');
            });
        }
        
        // Close modal when clicking outside
        document.getElementById('notificationsModal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }, 100);
}

// Show a toast notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    `;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" style="margin-left: auto; background: none; border: none; cursor: pointer; color: inherit;">
            &times;
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Save data before logout
        saveAppData();
        
        // Clear user session
        localStorage.removeItem('biotechUserSession');
        
        // Redirect to login page (in a real app)
        showNotification('Logged out successfully', 'success');
        
        // Reload page to reset state
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Set current date in date inputs
function setCurrentDateInInputs() {
    const today = new Date().toISOString().split('T')[0];
    
    // Set today as max date for expiry dates
    const expiryInputs = document.querySelectorAll('input[type="date"][id*="expiry"], input[type="date"][id*="Expiry"]');
    expiryInputs.forEach(input => {
        input.min = today;
    });
    
    // Set today as default for issue dates
    const issueInputs = document.querySelectorAll('input[type="date"][id*="issue"], input[type="date"][id*="Issue"]');
    issueInputs.forEach(input => {
        input.value = today;
        input.max = today;
    });
}

// Initialize charts (if needed)
function initializeCharts() {
    // This would initialize any charts on the dashboard
    // For now, we'll just log that charts would be initialized here
    console.log('Charts would be initialized here');
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.remove();
    });
}

// Export inventory data
function exportInventory() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    
    // Convert to CSV
    const headers = ['ID', 'Name', 'Category', 'Quantity', 'Unit', 'Min Stock', 'Status', 'Location', 'Supplier', 'Expiry Date'];
    const csvData = [
        headers.join(','),
        ...inventory.map(item => [
            item.id,
            `"${item.name}"`,
            item.category,
            item.quantity,
            item.unit,
            item.minStock,
            item.status,
            `"${item.location || ''}"`,
            `"${item.supplier || ''}"`,
            item.expiryDate || ''
        ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biotech-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Inventory exported successfully', 'success');
}

// Open request modal
function openRequestModal() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    const availableItems = inventory.filter(item => item.quantity > 0);
    
    const modalHtml = `
        <div class="modal active" id="requestModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> New Material Request</h2>
                    <button class="modal-close" id="closeRequestModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="requestForm">
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
                        <button type="submit" class="btn btn-primary btn-block">Submit Request</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Add event listeners
    setTimeout(() => {
        const form = document.getElementById('requestForm');
        const closeBtn = document.getElementById('closeRequestModal');
        const itemSelect = document.getElementById('requestItem');
        const quantityInput = document.getElementById('requestQuantity');
        const availableStock = document.getElementById('availableStock');
        
        // Update available stock when item is selected
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
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                submitRequest();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('requestModal').remove();
            });
        }
        
        // Close on outside click
        document.getElementById('requestModal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }, 100);
}

// Submit new request
function submitRequest() {
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
    
    // Close modal
    document.getElementById('requestModal').remove();
    
    // Show success message
    showNotification(`Request submitted successfully for ${selectedItem.name}`, 'success');
    
    // Refresh requests view if we're on requests tab
    if (AppState.currentTab === 'requests') {
        renderRequests();
    } else if (AppState.currentTab === 'dashboard') {
        renderDashboard();
    }
    
    // Generate notifications
    generateNotifications();
    
    // Save data
    saveAppData();
}

// Open restock modal
function openRestockModal() {
    const inventory = window.inventoryManager ? window.inventoryManager.items : sampleInventory;
    
    const modalHtml = `
        <div class="modal active" id="restockModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-boxes"></i> Restock Item</h2>
                    <button class="modal-close" id="closeRestockModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="restockForm">
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
                            <input type="date" id="expiryDate" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-success btn-block">Update Stock</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Set current date as min for expiry
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.min = new Date().toISOString().split('T')[0];
    }
    
    // Add event listeners
    setTimeout(() => {
        const form = document.getElementById('restockForm');
        const closeBtn = document.getElementById('closeRestockModal');
        const itemSelect = document.getElementById('restockItem');
        const currentStockInput = document.getElementById('currentStock');
        
        // Update current stock when item is selected
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
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                submitRestock();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('restockModal').remove();
            });
        }
        
        // Close on outside click
        document.getElementById('restockModal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }, 100);
}

// Submit restock
function submitRestock() {
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
    
    // Close modal
    document.getElementById('restockModal').remove();
    
    // Show success message
    showNotification(`${inventory[itemIndex].name} restocked successfully. New quantity: ${newQuantity} ${inventory[itemIndex].unit}`, 'success');
    
    // Refresh inventory view
    if (AppState.currentTab === 'inventory') {
        renderInventory();
    } else if (AppState.currentTab === 'dashboard') {
        renderDashboard();
    }
    
    // Generate notifications
    generateNotifications();
    
    // Save data
    saveAppData();
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    const format = document.getElementById('reportFormat').value;
    
    showNotification(`Generating ${reportType} report in ${format} format...`, 'info');
    
    // In a real app, this would generate and download the report
    // For now, we'll simulate the download
    setTimeout(() => {
        showNotification(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`, 'success');
        
        // Simulate download
        const reportData = `Biotech Store Management Report\nType: ${reportType}\nDate: ${new Date().toLocaleDateString()}\n\nThis is a sample report. In a real application, this would contain actual data.`;
        const blob = new Blob([reportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `biotech-report-${reportType}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1500);
}

// Save settings
function saveSettings() {
    // Update user info
    AppState.currentUser.name = document.getElementById('userName').value;
    AppState.currentUser.email = document.getElementById('userEmail').value;
    AppState.currentUser.department = document.getElementById('userDepartment').value;
    
    // Update settings
    AppState.settings.lowStockThreshold = parseInt(document.getElementById('lowStockThreshold').value);
    AppState.settings.autoRefresh = document.getElementById('autoRefresh').checked;
    AppState.settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
    AppState.settings.emailAlerts = document.getElementById('emailAlerts').checked;
    
    // Update theme
    const themeSelect = document.getElementById('themeSelect').value;
    AppState.isDarkMode = themeSelect === 'dark' || (themeSelect === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Update UI
    updateUserInfo();
    
    // Save data
    saveAppData();
    
    showNotification('Settings saved successfully', 'success');
}

// Backup data
function backupData() {
    const backup = {
        inventory: window.inventoryManager ? window.inventoryManager.items : sampleInventory,
        requests: window.requestManager ? window.requestManager.requests : sampleRequests,
        issues: window.issueManager ? window.issueManager.issues : sampleIssues,
        user: AppState.currentUser,
        settings: AppState.settings,
        backupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biotech-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data backup created successfully', 'success');
}

// Restore data
function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const backup = JSON.parse(event.target.result);
                
                if (confirm('Restoring data will overwrite current data. Are you sure?')) {
                    // Restore data
                    if (window.inventoryManager) {
                        window.inventoryManager.items = backup.inventory || sampleInventory;
                    }
                    
                    if (window.requestManager) {
                        window.requestManager.requests = backup.requests || sampleRequests;
                    }
                    
                    if (window.issueManager) {
                        window.issueManager.issues = backup.issues || sampleIssues;
                    }
                    
                    AppState.currentUser = backup.user || AppState.currentUser;
                    AppState.settings = backup.settings || AppState.settings;
                    
                    // Save to localStorage
                    saveAppData();
                    
                    // Update UI
                    updateUserInfo();
                    generateNotifications();
                    
                    // Refresh current view
                    switchTab(AppState.currentTab);
                    
                    showNotification('Data restored successfully from ' + new Date(backup.backupDate).toLocaleDateString(), 'success');
                }
            } catch (error) {
                showNotification('Error restoring data: Invalid backup file', 'error');
                console.error('Restore error:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Reset data
function resetData() {
    if (confirm('This will reset all data to sample data. This action cannot be undone. Are you sure?')) {
        // Clear localStorage
        localStorage.removeItem('biotechInventory');
        localStorage.removeItem('biotechRequests');
        localStorage.removeItem('biotechIssues');
        localStorage.removeItem('biotechSettings');
        
        // Reload page
        window.location.reload();
    }
}

// These functions need to be implemented or will be in other files
function openAddItemModal() {
    showNotification('Add item functionality would be implemented here', 'info');
}

function openEditItemModal(itemId) {
    showNotification(`Edit item ${itemId} functionality would be implemented here`, 'info');
}

function openRestockItemModal(itemId) {
    showNotification(`Restock item ${itemId} functionality would be implemented here`, 'info');
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        showNotification(`Item ${itemId} deleted`, 'success');
        // In a real implementation, this would actually delete the item
    }
}

function approveRequest(requestId) {
    showNotification(`Request ${requestId} approved`, 'success');
    // In a real implementation, this would actually approve the request
}

function rejectRequest(requestId) {
    showNotification(`Request ${requestId} rejected`, 'info');
    // In a real implementation, this would actually reject the request
}

function viewRequestDetails(requestId) {
    showNotification(`View details for request ${requestId}`, 'info');
    // In a real implementation, this would show request details
}

// Add CSS for notifications animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);