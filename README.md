# 🍔 CampusEats - Smart Canteen Management System

## 📖 Overview

**CampusEats** is a full-stack web application designed to digitize university canteen operations. It bridges the gap between students and the kitchen staff, offering a seamless ordering experience and a real-time Kitchen Display System (KDS).

Built with performance and UI/UX in mind, it features a modern **Glassmorphism design**, **Lazy Loading** for image optimization, and a robust **MySQL** backend.

---

## 🚀 Key Features

### 👤 For Students (Customer View)

- **Dynamic Carousel:** Featured "Trending Now" items with synchronized text/image animations.
- **Smart Menu:** Filter by Category, Veg/Non-Veg, Spicy Level, and more.
- **Real-time Search:** Instantly find items like "Chowmein" or "Pizza" with debounced search logic.
- **Digital Wallet:** Simulated wallet system for seamless checkout.
- **Interactive UI:** Glassmorphism cards, modal popups for item details, and toast notifications.

### 👨‍🍳 For Staff (Admin View)

- **Kitchen Display System (KDS):** A Kanban-style board to track orders.
- **Live Status Updates:** Move orders from `New` → `Cooking` → `Ready` → `Completed`.
- **Inventory Logic:** Items automatically hide from the menu if stock hits zero (SQL Logic).

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (ES6+).
- **Backend:** Node.js, Express.js.
- **Database:** MySQL (Relational DB with Complex Joins).
- **Assets:** FontAwesome (Icons), Google Fonts (Nunito).

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisites

- Node.js installed.
- MySQL Server (XAMPP or Workbench) running.

### 2. Clone the Repository

````bash
git clone [https://github.com/YOUR_USERNAME/CampusEats.git](https://github.com/YOUR_USERNAME/CampusEats.git)
cd CampusEats


### 3\. Install Dependencies

```bash
npm install
````

### 4\. Database Setup

1.  Open **MySQL Workbench** or phpMyAdmin.
2.  Create a database named `canteen_db`.
3.  Import the `database_schema.sql` file located in the root folder.
    - _This will create all tables (users, menu_items, orders, inventory) and seed the real menu data._

### 5\. Environment Configuration

Create a `.env` file in the root directory and add your MySQL credentials:

```properties
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=canteen_db
PORT=3000
```

### 6\. Run the Server

```bash
node server.js
```

Visit `http://localhost:3000` in your browser.

---

## 📂 Project Structure

```
CampusEats/
├── public/
│   └── images/       # High-res menu images
├── database_schema.sql # SQL Import file
├── index.html        # Single Page Application structure
├── script.js         # Frontend Logic (Fetch API, DOM Manipulation)
├── server.js         # Backend API & Static File Server
├── style.css         # Custom animations & Glassmorphism styles
└── README.md         # Documentation
```

---

## 🧠 Highlights

1.  **SQL Complexity:** The app uses `LEFT JOIN` queries to fetch Menu Items + Category Names + Inventory Stock in a single request.
2.  **Performance:** Implemented `loading="lazy"` attributes on images to ensure 60FPS scrolling performance despite high-res assets.
3.  **Security:** Uses `.env` variables to prevent exposing database credentials and `express.static` for secure file serving.
4.  **UI/UX:** Custom CSS animations for the carousel (`slideUpFade`) and modal interactions (`modalPop`).

---

Made with ❤️ by Shreyash and Sameer.

```

```
