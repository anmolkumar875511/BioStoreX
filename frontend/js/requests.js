// Request Management Functions
const RequestManager = {
    // Create new request
    createRequest(requestData) {
        const item = InventoryManager.getItemById(requestData.itemId);
        if (!item) {
            throw new Error('Item not found');
        }
        
        if (requestData.quantity > item.quantity) {
            throw new Error(`Requested quantity exceeds available stock (${item.quantity})`);
        }
        
        const newRequest = {
            id: DataStore.generateId(DataStore.requests),
            ...requestData,
            date: DataStore.getCurrentDate(),
            status: 'pending'
        };
        
        DataStore.requests.unshift(newRequest);
        DataStore.saveToLocalStorage();
        return newRequest;
    },
    
    // Update request status
    updateRequestStatus(requestId, status, notes = '') {
        const request = DataStore.requests.find(r => r.id === requestId);
        if (!request) return false;
        
        const oldStatus = request.status;
        request.status = status;
        
        // If request is approved/completed, update inventory
        if ((oldStatus !== 'completed' && status === 'completed') || 
            (oldStatus === 'pending' && status === 'approved')) {
            const item = InventoryManager.getItemById(request.itemId);
            if (item) {
                item.quantity -= request.quantity;
                InventoryManager.updateItem(item.id, { quantity: item.quantity });
                
                // Add transaction record
                const transaction = {
                    id: DataStore.generateId(DataStore.transactions),
                    itemName: request.itemName,
                    quantity: request.quantity,
                    user: request.requestor,
                    date: DataStore.getCurrentDate(),
                    type: 'issued',
                    notes: `Request #${request.id}${notes ? ' | ' + notes : ''}`
                };
                
                DataStore.transactions.push(transaction);
            }
        }
        
        DataStore.saveToLocalStorage();
        return true;
    },
    
    // Delete request
    deleteRequest(requestId) {
        const index = DataStore.requests.findIndex(r => r.id === requestId);
        if (index !== -1) {
            DataStore.requests.splice(index, 1);
            DataStore.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // Get pending requests
    getPendingRequests() {
        return DataStore.requests.filter(request => request.status === 'pending');
    },
    
    // Get request by ID
    getRequestById(requestId) {
        return DataStore.requests.find(r => r.id === requestId);
    },
    
    // Get recent requests
    getRecentRequests(limit = 5) {
        return DataStore.requests.slice(0, limit);
    },
    
    // Get pending requests count
    getPendingCount() {
        return this.getPendingRequests().length;
    }
};