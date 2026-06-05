# 🧬 BioStoreX – Biotechnology Department Store Management System

BioStoreX is a full-stack **MERN** web application for managing **Biotechnology Department lab inventory**, replacing outdated paper-based systems with a clean, digital workflow.  
It improves transparency, prevents stock mismanagement, and simplifies the process for **students, storekeepers, and administrators**.

---

## 👥 Team Members

| Name              | Registration Number |
|-------------------|---------------------|
| **Anmol Kumar**   | 20240007            | 
| **Honey Tiwari**  | 20240029            |

---

## 🚀 Features Overview

### 👨‍🎓 Student Module
- Register & login
- View all available items
- Submit item requests
- Prevent duplicate pending requests
- Track request status: **PENDING → APPROVED → ISSUED → RETURNED** or **PENDING → DECLINED**

---

### 🧑‍🔧 Storekeeper Module
- Add new items with:
  - Name, category, unit type
  - Multiple batches (batchNo, expiryDate)
  - Auto SKU generation
- Add or remove stock (**StockLog** entries)
- Approve / decline student requests
- Issue items:
  - Auto-reduces stock from batches (FIFO)
  - Creates **IssueLog** entry
- Accept returned items:
  - Restores quantity to stock
  - Adds negative quantity entry in **IssueLog**
- View all student requests

---

### 🛠 Admin Module
- Add storekeepers
- Blacklist / unblacklist users
- Manage authentication security
- View complete user and request history

---

## 📦 Inventory Management

### Batch-wise stock structure
Each item contains:
- name  
- category  
- unitType  
- image  
- **batches: [ { batchNo, quantity, expiryDate } ]**  
- totalQuantity  
- SKU  

### FIFO Stock Deduction
- On issuing items, quantity is deducted from the oldest batch first.

### Return System
- Restores quantity to stock
- Only affects **Item model**
- Adds a return entry in **IssueLog**

---

### Logging System

| Operation       | Updates Item Model | StockLog | IssueLog |
|-----------------|-----------------|----------|----------|
| add-stock       | ✔ Yes           | ✔ Yes    | ✖ No     |
| remove-stock    | ✔ Yes           | ✔ Yes    | ✖ No     |
| issue item      | ✔ Yes           | ✖ No     | ✔ Yes    |
| return item     | ✔ Yes           | ✖ No     | ✔ Yes    |

---

## 🗄 Database Structure (Mongoose Models)
- **User**: Student, Storekeeper, Admin, password hashing, JWT, role-based authorization
- **Item**: Batch-wise stock, totalQuantity auto-managed, SKU, image support
- **Request**: Tracks request lifecycle (**PENDING → APPROVED → ISSUED → RETURNED** or **PENDING → DECLINED**)
- **IssueLog**: Tracks issued and returned items (negative quantity for returns)
- **StockLog**: Logs manual stock changes only (ADD / REMOVE)

---

## 🧵 Backend API Structure

All endpoints are versioned under:

### 1️⃣ Student Routes: `/api/v1/user`
| Method | Route             | Description         |
|--------|-----------------|-------------------|
| POST   | `/register`       | Student registration |
| POST   | `/login`          | Login             |
| POST   | `/logout`         | Logout            |
| POST   | `/refresh-token`  | Refresh access token |

### 2️⃣ Storekeeper Item Routes: `/api/v1/item`
| Method | Route          | Description           |
|--------|----------------|----------------------|
| POST   | `/add-stock`   | Add new batch / increase stock |
| POST   | `/remove-stock`| Reduce stock / remove batch   |

### 3️⃣ Requests Routes: `/api/v1/request`
| Method | Route                | Role         | Description                      |
|--------|--------------------|--------------|----------------------------------|
| POST   | `/request`          | Student      | Request an item                  |
| GET    | `/my-requests`      | Student      | View own requests                |
| GET    | `/all-requests`     | Storekeeper  | View all student requests        |
| PUT    | `/approve/:id`      | Storekeeper  | Approve request                  |
| PUT    | `/decline/:id`      | Storekeeper  | Decline request                  |
| PUT    | `/issue/:id`        | Storekeeper  | Issue an item                    |
| PUT    | `/return/:id`       | Storekeeper  | Return an issued item            |

### 4️⃣ Admin Routes: `/api/v1/admin`
| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| POST   | `/add-storekeeper`     | Create storekeeper       |
| PATCH  | `/blacklist/:userId`   | Blacklist a user         |
| PATCH  | `/unblacklist/:userId` | Remove user from blacklist |

---

## 🔐 Security & Authorization
- JWT Authentication  
- Role-Based Access Control  
- HttpOnly Cookies  
- Separate access & refresh tokens  
- Blacklisting support  
- Middleware protection for each module  

---

## 🏗 Tech Stack

**Frontend**
- React.js, Vite, TailwindCSS, Axios  

**Backend**
- Node.js, Express.js, MongoDB, Mongoose, Multer (file uploads), Cloudinary (images)  

---

## 📌 Installation & Setup

```bash
git clone https://github.com/your-repo/BioStoreX.git
cd BioStoreX
npm install
