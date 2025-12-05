# 🧬 BioStoreX – Biotechnology Department Store Management System

BioStoreX is a full-stack MERN web application designed to modernize and digitalize the Biotechnology Department’s laboratory store.  
Traditional manual logs, paper registers, and messy stock books are replaced by an efficient, automated, and transparent system where:

- Students can request lab materials online  
- Storekeepers can manage stock, approve requests, and track batches  
- The system automatically updates stock, logs all operations, and prevents mismanagement  

This project is built to solve the real-world problem of inventory chaos in college laboratory stores.

---

## 👥 Team Members

| Name            | Registration Number |
|-----------------|-------------|
| **Anmol Kumar** | 20240007    |
| **Ashwini Kumar** | 20240014 |
| **Honey Tiwari** | 20240029   |

---

## 🚀 Features

### 👨‍🎓 **Student Module**
- Register / Login
- View available items
- Request materials
- Track request status (Pending → Approved or Pending → Declined)

### 🧑‍🔧 **Storekeeper Module**
- Add new items to inventory
- Add batches with expiry dates
- Approve or decline student requests
- Issue items and auto-update stock
- Add or remove stock with proper logging

### 🛠 **Admin Module**
- Manage users (activate/deactivate)
- View complete inventory
- View all issue logs and stock logs

### 📦 **Inventory Management**
- Batch-wise tracking (batchNo, expiryDate, quantity)
- Automatic total quantity calculation
- Low-stock threshold alerts
- SKU auto-generation
- Expiry-aware issuing (FIFO)

### 🧾 **Audit Logs**
- StockLog → Tracks every ADD / REMOVE operation
- IssueLog → Tracks every item issued to students
- Fully time-stamped for transparency

---

## 🗄️ **Database Design (Mongoose Schemas)**

The system uses **MongoDB** with **Mongoose** and includes:

- **User**
- **Item**
- **Batch (subdocument)**
- **Request**
- **IssueLog**
- **StockLog**

Each is designed for reliability, auditability, and clean separation of concerns.

---

## 🏗️ Tech Stack

### **Frontend**
- React.js  
- Vite
- TailwindCSS / CSS  
- Axios  
- JWT Authentication  

### **Backend**
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

### **Tools**
- Postman  
- Git & GitHub  
- dbdiagram.io / Draw.io (ERD)  
