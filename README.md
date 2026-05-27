# StyleCart 🛒

StyleCart is a modern, premium full-stack e-commerce web application built using **React (Vite)**, **Tailwind CSS v4**, **Node.js (Express)**, and **MongoDB**.

## Features
- **User Authentication**: Register, login, and profile tracking via JWT & bcrypt.
- **Storefront**: View all products, search, sort, and filter by category (Apparel, Electronics, Accessories, Home & Living).
- **Product Details**: Complete item description, pricing, rating, and stock status.
- **Cart Management**: Add products, adjust quantities, review order summary, and clear cart.
- **Checkout Process**: Submit shipping information and create customer orders.
- **Admin Dashboard**:
  - Store overview metrics (Sales, Orders, Users).
  - Product CRUD (Create, Read, Update, Delete new products).
  - Customer Order tracking & update delivery status.
- **Premium UI**: Sleek dark mode aesthetics, glassmorphic layout cards, violet/indigo gradient highlights, and responsive page design.

---

## Technical Stack
- **Frontend**: React, Vite, Tailwind CSS v4, React Router, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT, bcryptjs
- **Workspace Setup**: Concurrently command executions

---

## Folder Structure
```text
stylecart/
 ├── backend/            # Express REST API, MongoDB Schemas, JWT authentication
 └── frontend/           # React Client-side App (Tailwind CSS v4)
```

---

## Setup & Running Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Running locally or an Atlas connection URI)

### Quick Start

1. **Clone/Open the workspace** and navigate to the project directory.

2. **Install Dependencies**
   Run the following command at the project root to install dependencies for the root environment, frontend, and backend automatically:
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the `backend/` directory:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/stylecart
     JWT_SECRET=your_jwt_super_secret_key_change_in_production
     NODE_ENV=development
     ```

4. **Seed the Database**
   To populate your MongoDB database with premium mock products (clothing, electronics, accessories) so the storefront isn't empty, run:
   ```bash
   npm run seed
   ```

5. **Start Development Servers**
   To run both the backend server and frontend development server concurrently:
   ```bash
   npm run dev
   ```
   - Frontend will open at `http://localhost:5173`
   - Backend will run at `http://localhost:5000`

---

## Admin Credentials (Seeded)
To log in as an administrator and test the Admin Dashboard, use the following seeded account details after seeding:
- **Email**: `admin@stylecart.com`
- **Password**: `admin123456`
