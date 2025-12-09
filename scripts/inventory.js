// inventory.js - Inventory Management Functions

class InventoryManager {
    constructor() {
        this.items = [];
        this.categories = ['Culture Media', 'Chemicals', 'Labware', 'Consumables', 'Reagents', 'Equipment'];
    }
    
    addItem(item) {
        this.items.push(item);
        this.saveToLocalStorage();
        return item;
    }
    
    updateItem(id, updates) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updates };
            this.saveToLocalStorage();
            return this.items[index];
        }
        return null;
    }
    
    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
    }
    
    getItem(id) {
        return this.items.find(item => item.id === id);
    }
    
    getItemsByCategory(category) {
        return this.items.filter(item => item.category === category);
    }
    
    getLowStockItems() {
        return this.items.filter(item => item.quantity <= item.minStock && item.quantity > 0);
    }
    
    getOutOfStockItems() {
        return this.items.filter(item => item.quantity === 0);
    }
    
    saveToLocalStorage() {
        localStorage.setItem('biotechInventory', JSON.stringify(this.items));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('biotechInventory');
        this.items = saved ? JSON.parse(saved) : [];
    }
}

// Export the inventory manager
const inventoryManager = new InventoryManager();
export default inventoryManager;