// Application Data Store
const DataStore = {
    // Initial data
    currentUser: 'storekeeper',
    currentUserId: 'STORE001',
    currentUserName: 'Dr. Arjun Sharma',
    
    inventory: JSON.parse(localStorage.getItem('biotech-inventory')) || [
        { id: 1, name: "Agar Powder", category: "Consumables", quantity: 15, threshold: 10, location: "Shelf B2", status: "medium" },
        { id: 2, name: "Micropipette Tips (1000µL)", category: "Consumables", quantity: 8, threshold: 15, location: "Drawer A1", status: "low" },
        { id: 3, name: "Nitrile Gloves (M)", category: "Safety", quantity: 25, threshold: 20, location: "Cabinet C3", status: "good" },
        { id: 4, name: "Ethanol 70%", category: "Chemicals", quantity: 12, threshold: 5, location: "Flammable Storage", status: "good" },
        { id: 5, name: "Petri Dishes", category: "Labware", quantity: 3, threshold: 20, location: "Shelf A5", status: "low" },
        { id: 6, name: "PCR Tubes", category: "Consumables", quantity: 50, threshold: 30, location: "Freezer Rack", status: "good" },
        { id: 7, name: "Tris Buffer", category: "Chemicals", quantity: 2, threshold: 5, location: "Cold Room", status: "low" },
        { id: 8, name: "Microcentrifuge", category: "Equipment", quantity: 4, threshold: 2, location: "Bench 3", status: "good" }
    ],
    
    requests: JSON.parse(localStorage.getItem('biotech-requests')) || [
        { id: 101, itemId: 2, itemName: "Micropipette Tips (1000µL)", quantity: 2, purpose: "DNA extraction experiment", requestor: "Rahul Verma", requestorId: "BT2021001", date: "2023-10-15", status: "pending" },
        { id: 102, itemId: 1, itemName: "Agar Powder", quantity: 5, purpose: "Microbiology lab - bacterial culture", requestor: "Priya Singh", requestorId: "BT2021012", date: "2023-10-14", status: "approved" },
        { id: 103, itemId: 4, itemName: "Ethanol 70%", quantity: 3, purpose: "Surface sterilization for tissue culture", requestor: "Amit Kumar", requestorId: "BT2021008", date: "2023-10-14", status: "completed" },
        { id: 104, itemId: 5, itemName: "Petri Dishes", quantity: 10, purpose: "Fungal isolation experiment", requestor: "Neha Sharma", requestorId: "BT2021015", date: "2023-10-13", status: "rejected" },
        { id: 105, itemId: 3, itemName: "Nitrile Gloves (M)", quantity: 5, purpose: "General lab work", requestor: "Vikram Patel", requestorId: "BT2021003", date: "2023-10-12", status: "completed" }
    ],
    
    transactions: JSON.parse(localStorage.getItem('biotech-transactions')) || [
        { id: 1001, itemName: "Agar Powder", quantity: 5, user: "Priya Singh", date: "2023-10-14", type: "issued", notes: "Request #102" },
        { id: 1002, itemName: "Ethanol 70%", quantity: 3, user: "Amit Kumar", date: "2023-10-14", type: "issued", notes: "Request #103" },
        { id: 1003, itemName: "Nitrile Gloves (M)", quantity: 5, user: "Vikram Patel", date: "2023-10-12", type: "issued", notes: "Request #105" },
        { id: 1004, itemName: "PCR Tubes", quantity: 100, user: "Storekeeper", date: "2023-10-10", type: "restocked", notes: "Supplier: BioLab Supplies" },
        { id: 1005, itemName: "Micropipette Tips (1000µL)", quantity: 50, user: "Storekeeper", date: "2023-10-08", type: "restocked", notes: "Supplier: LabTech Inc." }
    ],
    
    // Save data to localStorage
    saveToLocalStorage() {
        localStorage.setItem('biotech-inventory', JSON.stringify(this.inventory));
        localStorage.setItem('biotech-requests', JSON.stringify(this.requests));
        localStorage.setItem('biotech-transactions', JSON.stringify(this.transactions));
    },
    
    // Update item status based on quantity
    updateItemStatus(item) {
        if (item.quantity <= 0) {
            item.status = 'out';
        } else if (item.quantity < item.threshold * 0.3) {
            item.status = 'low';
        } else if (item.quantity < item.threshold) {
            item.status = 'medium';
        } else {
            item.status = 'good';
        }
        return item;
    },
    
    // Generate unique IDs
    generateId(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    },
    
    // Get current date in YYYY-MM-DD format
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },
    
    // Get today's transactions count
    getTodayIssuedCount() {
        const today = this.getCurrentDate();
        return this.transactions.filter(t => 
            t.type === 'issued' && t.date === today
        ).reduce((sum, t) => sum + t.quantity, 0);
    }
};