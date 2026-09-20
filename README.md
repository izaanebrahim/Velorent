# VeloRent - Smart Vehicle Rental Management System

VeloRent is a premium, full-stack vehicle rental management web application that allows renters to select, book, and simulate UPI/Card payments for luxury cars, SUVs, and bikes. It provides fleet owners and administrators with full telemetry dashboards to review incomes, approve vehicle hosts, ban/permit users, and run reports.

## 🚀 Features

- **Auth System**: Custom JWT-based user registrations (supporting Customer/Owner roles) and password hashing with `bcryptjs`.
- **Fleet Catalog**: Searchable listings with advanced filter options (price ceilings, transmissions, fuel variants) and category chip selectors.
- **Double-booking Prevention**: Automatic validation checks for rental dates preventing conflicting bookings for identical assets.
- **Checkouts**: Stepper wizards listing per-day base rates + 18% GST invoices, simulated checkout drawers, and invoice receipts.
- **Admin Dashboard**: Recharts-powered graphs monitoring monthly revenue flow, vehicle usage distributions, user promotions, and CRUD capabilities.

---

## 📁 Repository Structure

```
velorent/
├── client/                  # React.js SPA (Vite)
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Footer, Sidebar, Card)
│   │   ├── context/         # React Auth context
│   │   ├── pages/           # Catalog, details, checkout, history, admin
│   │   ├── services/        # Axios API instance
│   │   └── index.css        # Tailwind CSS v4 custom variables
│   └── vite.config.js
│
└── server/                  # Node.js/Express API server
    ├── config/              # MySQL pool configurations
    ├── controllers/         # Auth, Vehicle, Booking, Payment, Admin controls
    ├── db/                  # SQL schema & seed files
    ├── middleware/          # JWT check & authorization roles guards
    └── server.js
```

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **MySQL Server** (running locally on port 3306)

### 1. Database Setup
Log in to your local MySQL instance and run:
```sql
CREATE DATABASE velorent;
```
Import the schema and initial seed data:
```bash
# From the root directory
mysql -u root -p velorent < server/db/schema.sql
mysql -u root -p velorent < server/db/seed.sql
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory and paste the following:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=velorent
JWT_SECRET=velorent_super_secret_key_change_in_production_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Install & Start Backend Server
```bash
cd server
npm install
npm run dev
```
The server will boot up on `http://localhost:5000`.

### 4. Install & Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`. Open this URL in your web browser.

---

## 🔑 Demo Access Logins

| User Role | Email Address | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@velorent.com` | `Admin@123` |
| **Renter Customer** | `rahul@email.com` | `Admin@123` |
| **Vehicle Owner** | `ahmed@email.com` | `Admin@123` |
