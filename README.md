<div align="center">

# 🚗 VeloRent
### Smart Vehicle Rental Management System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A premium, full-stack vehicle rental management web application built with a modern dark glassmorphic design system. Enables renters to browse luxury cars, SUVs, and superbikes, book rentals with 18% GST invoice generation, simulate payments (UPI/Card/NetBanking), and provides administrators with real-time revenue velocity analytics and fleet controls.
</p>

</div>

---

## 🌟 Key Features

### 👤 Customer Experience
- **Interactive Fleet Catalog**: Real-time category chip filters (Sports, Luxury, SUV, Sedan, Bike, Scooter), live price slider, transmission filters, fuel variant selectors, and debounced keyword search.
- **Detailed Asset Showcase**: High-resolution image galleries, engine specifications, passenger capacity, transmission badges, and daily pricing.
- **3-Step Checkout Stepper**:
  - **Step 1: Reservation Details**: Dynamic date calculation, pickup hub selector, and booking notes.
  - **Step 2: Payment Simulation**: Supports simulated UPI (VPA), credit/debit card, and NetBanking gateways.
  - **Step 3: Instant Invoice Receipt**: Detailed order confirmation with generated transaction ID and GST breakdown.
- **Rental History & Self-Service**: Live booking status tracking (`pending`, `confirmed`, `active`, `completed`, `cancelled`) and one-click cancellation with simulated automatic refund.
- **Customer Profiles**: Personal info management and simulated driver license upload verification.

### 🛡️ Administrative Telemetry & Controls
- **Revenue Analytics Dashboard**: Recharts-powered interactive graphs displaying monthly revenue velocity, fleet utilization pie charts, and gross earnings ledgers.
- **Fleet Inventory Manager**: Add new premium vehicles, adjust daily rental rates, delete decommissioned models, and review/approve fleet host submissions.
- **User Directory Administration**: Inspect registered customers, promote or demote roles (`customer`, `owner`, `admin`), and ban/reactivate user accounts.
- **Financial Reports & Exports**: Audit monthly billing cycles and simulate CSV ledger exports.

### 🔒 Security & Data Integrity
- **JWT Authentication & RBAC**: Role-based access control guarding administrative endpoints and views.
- **Double-Booking Prevention**: Intelligent conflict detection algorithm ensuring no overlapping reservations for the same vehicle (including an active 15-minute hold on pending checkouts).
- **Password Protection**: Salting and hashing via `bcryptjs` (cost factor 12).
- **Rate Limiting & Sanitization**: Express rate limiting protecting API routes from brute-force attempts and input validation with `express-validator`.

---

## 📁 Repository Structure

```
velorent/
├── client/                      # React SPA (Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/          # Navbar, Footer, AdminSidebar
│   │   │   └── shared/          # VehicleCard, Badge, Dialogs
│   │   ├── context/             # AuthContext (JWT & state management)
│   │   ├── pages/               # Application views
│   │   │   ├── admin/           # Dashboard, ManageVehicles, ManageUsers, Reports
│   │   │   ├── Home.jsx         # Landing page with hero & testimonials
│   │   │   ├── Vehicles.jsx     # Fleet browser with multi-filter sidebar
│   │   │   ├── VehicleDetails.jsx # Spec sheet & booking drawer
│   │   │   ├── Booking.jsx      # 3-step checkout wizard
│   │   │   ├── BookingHistory.jsx # Renter booking records & invoices
│   │   │   ├── Profile.jsx      # Account settings & license validation
│   │   │   ├── Login.jsx        # Authentication portal
│   │   │   └── Register.jsx     # Registration (Renter / Host Owner)
│   │   ├── services/            # Axios instance with 401 interceptors
│   │   ├── App.jsx              # Nested router layout with AdminRoute guards
│   │   └── index.css            # Dark glassmorphic theme & CSS variables
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js Express REST API
│   ├── config/                  # MySQL2 connection pool
│   ├── controllers/             # Business logic (auth, vehicles, bookings, payments, admin)
│   ├── db/                      # Database files
│   │   ├── schema.sql           # MySQL 8.0+ schema definitions
│   │   ├── seed.sql             # Demo accounts and 16+ sample vehicles
│   │   └── initDb.js            # Automated DB creation & seeding runner
│   ├── middleware/              # JWT auth guard, role authorizer, global error handler
│   ├── routes/                  # Express route definitions
│   ├── utils/                   # Token helpers & transaction ID generators
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── package.json                 # Monorepo scripts
└── README.md
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0+, running locally on port `3306`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/izaanebrahim/Velorent.git
cd Velorent
```

---

### Step 2: Configure Environment Variables
Inside the `server` directory, create a `.env` file (or copy from `.env.example`):
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your database credentials:
```env
PORT=5000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=velorent

# JWT Secret
JWT_SECRET=velorent_super_secret_key_change_in_production_2024
JWT_EXPIRES_IN=7d

# Frontend CORS URL
CLIENT_URL=http://localhost:5173
```

---

### Step 3: Automated Database Setup
Run the automated database setup script from the `server` directory:
```bash
cd server
npm install
npm run db:setup
```
*This will connect to your MySQL instance, create the `velorent` database if it doesn't exist, apply all table schemas, and import sample demo users, vehicles, and booking records.*

---

### Step 4: Run the Application

You can start both backend and frontend using the root scripts:

```bash
# In terminal 1 (Backend API):
npm run server

# In terminal 2 (Frontend Client):
npm run client
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 🔑 Demo Credentials

Use these pre-seeded accounts to explore the application:

| Role | Email Address | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@velorent.com` | `Admin@123` | Full admin telemetry, vehicle approvals, user management, and ledger reports. |
| **Renter (Customer)** | `rahul@email.com` | `Admin@123` | Browse catalog, create bookings, simulate payments, cancel reservations. |
| **Fleet Owner** | `ahmed@email.com` | `Admin@123` | List vehicles for administrative review, vehicle specifications. |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`customer` or `owner`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update name, phone, or license URL |
| `GET` | `/api/vehicles` | Public | Get fleet with filtering, sorting, pagination |
| `GET` | `/api/vehicles/:id` | Public | Get single vehicle details |
| `POST` | `/api/vehicles` | Admin / Owner | List a new vehicle (admin approves automatically) |
| `PUT` | `/api/vehicles/:id` | Admin / Owner | Update vehicle specs (approval requires admin) |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete a vehicle listing from fleet |
| `POST` | `/api/bookings` | Authenticated | Create booking reservation with 18% GST |
| `GET` | `/api/bookings` | Authenticated | Get current user's booking history |
| `PUT` | `/api/bookings/:id/cancel` | Authenticated | Cancel booking & issue simulated refund |
| `POST` | `/api/payments` | Authenticated | Process simulated payment (UPI / Card / NetBank) |
| `GET` | `/api/admin/stats` | Admin | Get revenue metrics, utilization & recent activity |
| `GET` | `/api/admin/users` | Admin | Get paginated user directory |
| `PUT` | `/api/admin/users/:id` | Admin | Update user role or ban/activate account |

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the Project (`https://github.com/izaanebrahim/Velorent/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
