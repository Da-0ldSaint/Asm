# 🏗️ Asset Management System (ASM) — Full Deployment Guide

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| File Uploads | Multer |

---

## 📁 Folder Structure

```
ASM/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── api/axios.js         # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── ui/              # Input, Select, Modal, Spinner, Button
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── users/           # MyProfile.jsx, ChangePassword.jsx
│   │   │   ├── assets/          # AddAsset.jsx, ListAssets.jsx
│   │   │   └── employees/       # Employees.jsx (list + modal)
│   │   └── App.jsx              # React Router routes
│   ├── tailwind.config.js       # Custom brand + dark color scales
│   └── vite.config.js
│
└── server/                      # Express API
    ├── config/database.js       # Sequelize config
    ├── middleware/auth.js        # JWT middleware
    ├── models/                  # User, Asset, Category, Site, Location,
    │                            # Employee, Alert, ActivityLog
    ├── routes/                  # auth, users, assets, employees,
    │                            # dashboard, references
    ├── scripts/seed.js          # DB seeder (admin + sample data)
    ├── uploads/                 # Uploaded images (auto-created)
    └── index.js                 # Server entry point
```

---

## ✅ Prerequisites

1. **Node.js** v18+ → [nodejs.org](https://nodejs.org)
2. **PostgreSQL** v14+ → [postgresql.org](https://www.postgresql.org/download/)
3. **npm** v9+

---

## 🐘 PostgreSQL Setup

### 1. Install and start PostgreSQL

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create database and user

```bash
sudo -u postgres psql
```

Inside the psql prompt:
```sql
CREATE DATABASE asm_db;
CREATE USER postgres WITH PASSWORD 'admin@123';
GRANT ALL PRIVILEGES ON DATABASE asm_db TO postgres;
\q
```

> Or if postgres user already exists, just set the password:
> ```sql
> ALTER USER postgres WITH PASSWORD 'admin@123';
> ```

---

## ⚙️ Environment Variables

### Backend (`server/.env`) — already created
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asm_db
DB_USER=postgres
DB_PASSWORD=admin@123
JWT_SECRET=asm_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
```

### Frontend — uses Vite proxy (no .env needed for dev)
All `/api/*` requests are automatically proxied to `http://localhost:5000` via `vite.config.js`.

---

## 🚀 Running the Project

### Step 1 — Install dependencies
```bash
# Backend
cd /home/siddu/Music/ASM/server
npm install

# Frontend
cd /home/siddu/Music/ASM/frontend
npm install
```

### Step 2 — Seed the database
```bash
cd /home/siddu/Music/ASM/server
npm run seed
```
This creates:
- ✅ Admin user: `admin@asm.com` / `admin@123`
- ✅ Sites: Headquarters, Branch Office
- ✅ Locations & Categories
- ✅ Sample assets

### Step 3 — Start the backend
```bash
cd /home/siddu/Music/ASM/server
npm run dev        # uses nodemon (auto-restart on changes)
# OR
npm start          # production
```
Backend runs at: **http://localhost:5000**

### Step 4 — Start the frontend
```bash
cd /home/siddu/Music/ASM/frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

### Step 5 — Open in browser
Navigate to: **http://localhost:5173**

Login with:
- **Email**: `admin@asm.com`
- **Password**: `admin@123`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/logout` | Logout |

### Users (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get my profile |
| PUT | `/api/users/me` | Update profile + photo |
| PUT | `/api/users/change-password` | Change password |

### Assets (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | List all assets |
| GET | `/api/assets/:id` | Get one asset |
| POST | `/api/assets` | Create asset + photo |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |

### Employees (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List employees |
| GET | `/api/employees/:id` | Get one employee |
| POST | `/api/employees` | Add employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Dashboard (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Stat cards data |
| GET | `/api/dashboard/category-value` | Pie chart data |
| GET | `/api/dashboard/alerts` | Calendar events |
| GET | `/api/dashboard/feeds` | Activity feed |

### Reference Data (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | All sites |
| POST | `/api/sites` | Create site |
| GET | `/api/locations?site_id=` | Locations by site |
| POST | `/api/locations` | Create location |
| GET | `/api/categories` | All categories |
| POST | `/api/categories` | Create category |

---

## 🎨 Tailwind Theme

The app uses a custom color system defined in `tailwind.config.js`:

| Scale | Usage |
|-------|-------|
| `brand-600` | Primary buttons, active links |
| `brand-500` | Focus rings, highlights |
| `dark-900` | Main page background |
| `dark-800` | Cards and containers |
| `dark-700` | Borders and dividers |
| `dark-400` | Placeholder / muted text |
| `yellow-500` | CTA buttons (Save, Submit, Add) |

---

## 🛡️ Security Notes

1. JWT tokens are stored in `localStorage` — suitable for development
2. For production, consider `httpOnly` cookies
3. Change `JWT_SECRET` in `.env` to a strong random string
4. Use HTTPS in production
5. Enable PostgreSQL SSL for production DB connections

---

## 🔧 Common Issues

### "Database connection failed"
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `server/.env`
- Ensure database `asm_db` exists

### "Port already in use"
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9
# Kill process on port 5173
sudo lsof -ti:5173 | xargs kill -9
```

### Tailwind styles not loading
```bash
cd frontend && npm run dev
# Ensure postcss.config.js and tailwind.config.js exist
```

---

## 📦 Production Build

```bash
# Build frontend
cd /home/siddu/Music/ASM/frontend
npm run build
# Output in frontend/dist/

# Serve static files with Express (optional)
# Move dist/ to server/public/ and add:
# app.use(express.static(path.join(__dirname, 'public')));

# Start backend in production
cd /home/siddu/Music/ASM/server
NODE_ENV=production npm start
```
