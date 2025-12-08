// Inventory Management Functions
const InventoryManager = {
    // Add new inventory item
    addItem(itemData) {
        const newItem = {
            id: DataStore.generateId(DataStore.inventory),
            ...itemData,
            status: 'good'
        };
        
        DataStore.inventory.push(DataStore.updateItemStatus(newItem));
        DataStore.saveToLocalStorage();
        return newItem;
    },
    
    // Update inventory item
    updateItem(itemId, updates) {
        const index = DataStore.inventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            DataStore.inventory[index] = DataStore.updateItemStatus({
                ...DataStore.inventory[index],
                ...updates
            });
            DataStore.saveToLocalStorage();
            return DataStore.inventory[index];
        }
        return null;
    },
    
    // Delete inventory item
    deleteItem(itemId) {
        const index = DataStore.inventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            DataStore.inventory.splice(index, 1);
            DataStore.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // Restock item
    restockItem(itemId, quantity, supplier = '', expiryDate = '') {
        const item = DataStore.inventory.find(i => i.id === itemId);
        if (item) {
            item.quantity += quantity;
            DataStore.updateItemStatus(item);
            
            // Add transaction record
            const transaction = {
                id: DataStore.generateId(DataStore.transactions),
                itemName: item.name,
                quantity: quantity,
                user: DataStore.currentUserName,
                date: DataStore.getCurrentDate(),
                type: 'restocked',
                notes: supplier ? `Supplier: ${supplier}` : 'Manual restock'
            };
            
            if (expiryDate) {
                transaction.notes += ` | Expiry: ${expiryDate}`;
            }
            
            DataStore.transactions.push(transaction);
            DataStore.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // Get low stock items
    getLowStockItems() {
        return DataStore.inventory.filter(item => 
            item.status === 'low' || item.status === 'medium'
        );
    },
    
    // Get item by ID
    getItemById(itemId) {
        return DataStore.inventory.find(item => item.id === itemId);
    },
    
    // Get total item count
    getTotalItems() {
        return DataStore.inventory.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // Get low stock count
    getLowStockCount() {
        return DataStore.inventory.filter(item => item.status === 'low').length;
    }
};