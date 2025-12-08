// Transaction Management Functions
const TransactionManager = {
    // Get all transactions
    getAllTransactions() {
        return DataStore.transactions;
    },
    
    // Get recent transactions
    getRecentTransactions(limit = 10) {
        return DataStore.transactions.slice(0, limit);
    },
    
    // Export data as JSON
    exportData() {
        const data = {
            inventory: DataStore.inventory,
            requests: DataStore.requests,
            transactions: DataStore.transactions,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `biotech-store-data-${DataStore.getCurrentDate()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // Get transaction stats
    getStats() {
        const today = DataStore.getCurrentDate();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        return {
            totalItems: InventoryManager.getTotalItems(),
            lowStockItems: InventoryManager.getLowStockCount(),
            pendingRequests: RequestManager.getPendingCount(),
            todayIssued: DataStore.getTodayIssuedCount(),
            weeklyTransactions: DataStore.transactions.filter(t => 
                new Date(t.date) >= weekAgo
            ).length
        };
    }
};